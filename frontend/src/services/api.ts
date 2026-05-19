import axios from 'axios';
import type { Station, SongHistory, ChatMessage, ApiResponse } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Adjunta el token JWT automáticamente si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('radio_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const stationsApi = {
  getAll: () => api.get<ApiResponse<Station[]>>('/stations'),
  getById: (id: string) => api.get<ApiResponse<Station>>(`/stations/${id}`),
  create: (data: Partial<Station>) => api.post<ApiResponse<Station>>('/stations', data),
  update: (id: string, data: Partial<Station>) => api.put<ApiResponse<Station>>(`/stations/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse<void>>(`/stations/${id}`),

  getSongHistory: (id: string) => api.get<ApiResponse<SongHistory[]>>(`/stations/${id}/history`),
  addSong: (id: string, data: { title: string; artist?: string; album?: string }) =>
    api.post<ApiResponse<SongHistory>>(`/stations/${id}/history`, data),

  getChatMessages: (id: string) => api.get<ApiResponse<ChatMessage[]>>(`/stations/${id}/chat`),
  sendChatMessage: (id: string, data: { username: string; message: string }) =>
    api.post<ApiResponse<ChatMessage>>(`/stations/${id}/chat`, data),
};

export default api;
