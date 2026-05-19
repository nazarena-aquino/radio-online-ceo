import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import stationsRouter from './routes/stations';
import authRouter from './routes/auth';
import pool from './db/pool';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'OK', message: 'Radio API funcionando', database: 'Conectado', timestamp: new Date().toISOString() });
  } catch {
    res.status(500).json({ status: 'ERROR', database: 'Desconectado' });
  }
});

app.use('/api/auth', authRouter);
app.use('/api/stations', stationsRouter);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`🎵 Radio API corriendo en http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
});

export default app;
