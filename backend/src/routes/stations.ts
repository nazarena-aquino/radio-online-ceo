import { Router } from 'express';
import {
  getStations,
  getStationById,
  createStation,
  updateStation,
  deleteStation,
  getSongHistory,
  addSongToHistory,
  getChatMessages,
  addChatMessage,
} from '../controllers/stationsController';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Estaciones — lectura pública, escritura protegida
router.get('/', getStations);
router.get('/:id', getStationById);
router.post('/', requireAuth, createStation);
router.put('/:id', requireAuth, updateStation);
router.delete('/:id', requireAuth, deleteStation);

// Historial — solo admin puede agregar
router.get('/:id/history', getSongHistory);
router.post('/:id/history', requireAuth, addSongToHistory);

// Chat — público para leer y enviar
router.get('/:id/chat', getChatMessages);
router.post('/:id/chat', addChatMessage);

export default router;
