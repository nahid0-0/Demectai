import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json({ limit: '50mb' }));

const HF_SPACE_URL = 'https://nahid112376-demectai.hf.space';

// Proxy endpoint for HF Space
app.post('/api/detect', upload.single('image'), async (req, res) => {
  try {
    let imageBuffer;
    let mimeType = 'image/png';
    let filename = 'image.png';

    if (req.file) {
      // File upload
      imageBuffer = fs.readFileSync(req.file.path);
      mimeType = req.file.mimetype;
      filename = req.file.originalname;
      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
    } else if (req.body.image) {
      // Base64 image
      const base64Data = req.body.image.replace(/^data:image\/\w+;base64,/, '');
      imageBuffer = Buffer.from(base64Data, 'base64');
      if (req.body.mimeType) {
        mimeType = req.body.mimeType;
        const ext = mimeType.split('/')[1] || 'png';
        filename = `image.${ext}`;
      }
    } else {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Step 1: Upload file to HF Space
    const formData = new FormData();
    formData.append('files', imageBuffer, {
      filename: filename,
      contentType: mimeType
    });

    const uploadResponse = await fetch(`${HF_SPACE_URL}/upload`, {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders()
    });

    if (!uploadResponse.ok) {
      const errText = await uploadResponse.text();
      console.error('Upload failed:', errText);
      return res.status(500).json({ error: 'Failed to upload image to HF Space' });
    }

    const uploadResult = await uploadResponse.json();
    console.log('Upload result:', uploadResult);
    const filePath = uploadResult[0];

    // Step 2: Call the predict API via queue
    const predictResponse = await fetch(`${HF_SPACE_URL}/queue/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [{ path: filePath }],
        fn_index: 0,
        session_hash: Math.random().toString(36).substring(7)
      })
    });

    if (!predictResponse.ok) {
      // Try alternate endpoint
      const altResponse = await fetch(`${HF_SPACE_URL}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [{ path: filePath }]
        })
      });
      
      if (altResponse.ok) {
        const result = await altResponse.json();
        console.log('Alt API result:', result);
        return res.json(result.data?.[0] || result);
      }
      
      const errText = await predictResponse.text();
      console.error('Predict call failed:', errText);
      return res.status(500).json({ error: 'Failed to call predict API' });
    }

    const callResult = await predictResponse.json();
    console.log('Queue join result:', callResult);
    const eventId = callResult.event_id;

    // Step 3: Get the result via SSE - poll the queue/data endpoint
    const maxAttempts = 60; // 60 seconds timeout
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(r => setTimeout(r, 1000)); // Wait 1 second
      
      const statusResponse = await fetch(`${HF_SPACE_URL}/queue/data?session_hash=${callResult.session_hash || eventId}`);
      const statusText = await statusResponse.text();
      console.log('Status check:', statusText.substring(0, 200));
      
      // Parse SSE response
      const lines = statusText.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.msg === 'process_completed' && data.output?.data) {
              return res.json(data.output.data[0]);
            }
          } catch (e) {
            continue;
          }
        }
      }
    }

    res.status(500).json({ error: 'Timeout waiting for result' });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
