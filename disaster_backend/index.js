import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import geocodeRoutes from './routes/geocode.js';
import verifyRoutes from './routes/verify.js';
import simulateRoutes from './routes/simulate.js';
import disasterRoutes from './routes/disasters.js';
import officialRoutes from './routes/official.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());
app.set('io', io);

app.use('/geocode', geocodeRoutes);
app.use('/disasters', disasterRoutes);
app.use('/simulate', simulateRoutes);
app.use('/disasters', verifyRoutes);
app.use('/disasters', officialRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
