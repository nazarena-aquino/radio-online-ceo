export interface Station {
  id: string;
  name: string;
  description: string | null;
  stream_url: string;
  logo_url: string | null;
  genre: string | null;
  language: string;
  bitrate: number;
  is_active: boolean;
  listener_count: number;
  created_at: string;
  updated_at: string;
}

export interface SongHistory {
  id: string;
  station_id: string;
  title: string;
  artist: string | null;
  album: string | null;
  played_at: string;
}

export interface ChatMessage {
  id: string;
  station_id: string;
  username: string;
  message: string;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export type PlayerStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error';
