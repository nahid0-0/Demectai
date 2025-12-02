import FormData from 'form-data';

const HF_SPACE_URL = 'https://nahid112376-demectai.hf.space';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image, mimeType } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Extract base64 data
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    const ext = mimeType?.split('/')[1] || 'png';
    const filename = `image.${ext}`;

    // Step 1: Upload file to HF Space
    const formData = new FormData();
    formData.append('files', imageBuffer, {
      filename: filename,
      contentType: mimeType || 'image/png'
    });

    const uploadResponse = await fetch(`${HF_SPACE_URL}/upload`, {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders()
    });

    if (!uploadResponse.ok) {
      console.error('Upload failed:', await uploadResponse.text());
      return res.status(500).json({ error: 'Failed to upload image' });
    }

    const uploadResult = await uploadResponse.json();
    console.log('Upload result:', uploadResult);
    const filePath = uploadResult[0];

    // Step 2: Call the predict API via queue
    const sessionHash = Math.random().toString(36).substring(7);
    const predictResponse = await fetch(`${HF_SPACE_URL}/queue/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [{ path: filePath }],
        fn_index: 0,
        session_hash: sessionHash
      })
    });

    if (!predictResponse.ok) {
      // Try direct API endpoint
      const directResponse = await fetch(`${HF_SPACE_URL}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [{ path: filePath }]
        })
      });

      if (directResponse.ok) {
        const result = await directResponse.json();
        return res.status(200).json(result.data?.[0] || result);
      }

      console.error('Predict failed:', await predictResponse.text());
      return res.status(500).json({ error: 'Failed to process image' });
    }

    const queueResult = await predictResponse.json();
    console.log('Queue join result:', queueResult);

    // Step 3: Poll for result
    const maxAttempts = 120; // 2 minute timeout
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(r => setTimeout(r, 1000));

      try {
        const statusResponse = await fetch(`${HF_SPACE_URL}/queue/data?session_hash=${sessionHash}`);
        const statusText = await statusResponse.text();

        const lines = statusText.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.msg === 'process_completed' && data.output?.data) {
                return res.status(200).json(data.output.data[0]);
              }
              if (data.msg === 'process_failed') {
                return res.status(500).json({ error: 'Processing failed' });
              }
            } catch (e) {
              continue;
            }
          }
        }
      } catch (e) {
        console.error('Status check error:', e);
      }
    }

    return res.status(504).json({ error: 'Timeout waiting for result' });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
