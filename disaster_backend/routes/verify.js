import express from 'express';
import axios from 'axios';
const router = express.Router();

router.post('/:id/verify-image', async (req, res) => {
  const { imageUrl } = req.body;
  if (!imageUrl) return res.status(400).json({ error: 'Image URL required' });

  try {
    const image = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const base64Image = Buffer.from(image.data).toString('base64');

    const geminiRes = await axios.post(
      'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent',
      {
        contents: [{
          parts: [
            { text: 'Is this image showing a natural disaster?' },
            {
              inline_data: {
                mime_type: 'image/jpeg',
                data: base64Image
              }
            }
          ]
        }]
      },
      {
        params: { key: process.env.GEMINI_API_KEY },
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const result = geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    res.json({ result: result || 'No result from Gemini' });
  } catch (err) {
    res.status(500).json({ error: 'Image verification failed' });
  }
});

export default router;
