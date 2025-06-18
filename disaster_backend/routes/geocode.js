import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

router.post('/', async (req, res) => {
  const { description } = req.body;

  if (!description) return res.status(400).json({ error: 'Description required' });

  try {
    const geminiResponse = await axios.post(
      'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent',
      {
        contents: [{ parts: [{ text: `Extract location from: ${description}` }] }]
      },
      {
        params: { key: process.env.GEMINI_API_KEY },
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const location = geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!location) return res.status(400).json({ error: 'No location found' });

    const mapsURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    const mapsRes = await axios.get(mapsURL);
    const geo = mapsRes.data.results?.[0];

    if (!geo) return res.status(400).json({ error: 'Could not geocode location' });

    res.status(200).json({
      location_name: location,
      lat: geo.geometry.location.lat,
      lng: geo.geometry.location.lng
    });
  } catch (err) {
    res.status(500).json({ error: 'Geocode failed' });
  }
});

export default router;
