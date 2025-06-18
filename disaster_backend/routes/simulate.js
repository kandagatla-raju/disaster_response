import express from 'express';
const router = express.Router();
let intervalId = null;

router.post('/simulate/start', (req, res) => {
  const io = req.app.get('io');
  if (intervalId) return res.status(200).json({ message: 'Already running' });

  const alerts = [
    '⚠️ Earthquake tremors in Assam',
    '🚨 Flash floods in Hyderabad',
    '🔥 Forest fire near Bandipur',
    '🌀 Cyclone alert for Odisha',
    '🌧️ Heavy rainfall in Pune'
  ];
  let index = 0;

  intervalId = setInterval(() => {
    const message = alerts[index % alerts.length];
    const timestamp = new Date().toISOString();
    io.emit('social_feed', { message, timestamp });
    index++;
  }, 5000);

  res.status(200).json({ started: true });
});

export default router;
