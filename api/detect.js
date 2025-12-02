const HF_SPACE_URL = 'https://nahid112376-demectai.hf.space';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
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

    // Step 1: Upload file to HF Space using native FormData (works in Node 18+)
    const { Blob } = await import('buffer');
    const blob = new Blob([imageBuffer], { type: mimeType || 'image/png' });
    const formData = new FormData();
    formData.append('files', blob, filename);

    const uploadResponse = await fetch(`${HF_SPACE_URL}/upload`, {
      method: 'POST',
      body: formData
    });

    if (!uploadResponse.ok) {
      const errText = await uploadResponse.text();
      console.error('Upload failed:', errText);
      return res.status(500).json({ error: 'Failed to upload image to HF Space' });
    }

    const uploadResult = await uploadResponse.json();
    console.log('Upload result:', uploadResult);
    const filePath = uploadResult[0];

    // Step 2: Try direct API first
    const directResponse = await fetch(`${HF_SPACE_URL}/api/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [{ path: filePath }]
      })
    });

    if (directResponse.ok) {
      const result = await directResponse.json();
      console.log('Direct API result:', result);
      if (result.data?.[0]) {
        return res.status(200).json(result.data[0]);
      }
    }

    // Step 3: Use queue if direct API doesn't work
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
      console.error('Queue join failed:', await predictResponse.text());
      return res.status(500).json({ error: 'Failed to join queue' });
    }

    console.log('Queue joined, polling...');

    // Step 4: Poll for result
    const maxAttempts = 90;
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
        console.error('Poll error:', e.message);
      }
    }

    return res.status(504).json({ error: 'Timeout' });

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
