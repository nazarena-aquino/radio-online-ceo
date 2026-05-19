import { Request, Response } from 'express';
import pool from '../db/pool';

export const getStations = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      'SELECT * FROM stations WHERE is_active = true ORDER BY name ASC'
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error al obtener estaciones:', error);
    res.status(500).json({ success: false, message: 'Error al obtener estaciones' });
  }
};

export const getStationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM stations WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Estación no encontrada' });
      return;
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error al obtener estación:', error);
    res.status(500).json({ success: false, message: 'Error al obtener estación' });
  }
};

export const createStation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, stream_url, logo_url, genre, language, bitrate } = req.body;
    if (!name || !stream_url) {
      res.status(400).json({ success: false, message: 'Nombre y URL del stream son requeridos' });
      return;
    }
    const result = await pool.query(
      `INSERT INTO stations (name, description, stream_url, logo_url, genre, language, bitrate)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, description, stream_url, logo_url, genre, language || 'Español', bitrate || 128]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error al crear estación:', error);
    res.status(500).json({ success: false, message: 'Error al crear estación' });
  }
};

export const updateStation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, stream_url, logo_url, genre, language, bitrate, is_active } = req.body;
    const result = await pool.query(
      `UPDATE stations SET 
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        stream_url = COALESCE($3, stream_url),
        logo_url = COALESCE($4, logo_url),
        genre = COALESCE($5, genre),
        language = COALESCE($6, language),
        bitrate = COALESCE($7, bitrate),
        is_active = COALESCE($8, is_active),
        updated_at = NOW()
       WHERE id = $9 RETURNING *`,
      [name, description, stream_url, logo_url, genre, language, bitrate, is_active, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Estación no encontrada' });
      return;
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error al actualizar estación:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar estación' });
  }
};

export const deleteStation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE stations SET is_active = false WHERE id = $1', [id]);
    res.json({ success: true, message: 'Estación desactivada correctamente' });
  } catch (error) {
    console.error('Error al eliminar estación:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar estación' });
  }
};

export const getSongHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM song_history WHERE station_id = $1 ORDER BY played_at DESC LIMIT 20',
      [id]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({ success: false, message: 'Error al obtener historial' });
  }
};

export const addSongToHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, artist, album } = req.body;
    if (!title) {
      res.status(400).json({ success: false, message: 'El título es requerido' });
      return;
    }
    const result = await pool.query(
      'INSERT INTO song_history (station_id, title, artist, album) VALUES ($1, $2, $3, $4) RETURNING *',
      [id, title, artist, album]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error al agregar canción:', error);
    res.status(500).json({ success: false, message: 'Error al agregar canción' });
  }
};

export const getChatMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM chat_messages WHERE station_id = $1 ORDER BY created_at DESC LIMIT 50',
      [id]
    );
    res.json({ success: true, data: result.rows.reverse() });
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    res.status(500).json({ success: false, message: 'Error al obtener mensajes' });
  }
};

export const addChatMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { username, message } = req.body;
    if (!username || !message) {
      res.status(400).json({ success: false, message: 'Usuario y mensaje son requeridos' });
      return;
    }
    if (message.length > 500) {
      res.status(400).json({ success: false, message: 'Mensaje demasiado largo (máx 500 caracteres)' });
      return;
    }
    const result = await pool.query(
      'INSERT INTO chat_messages (station_id, username, message) VALUES ($1, $2, $3) RETURNING *',
      [id, username.slice(0, 50), message]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    res.status(500).json({ success: false, message: 'Error al enviar mensaje' });
  }
};
