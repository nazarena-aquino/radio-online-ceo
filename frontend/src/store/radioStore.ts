import { create } from 'zustand';
import type { Station, PlayerStatus } from '../types';

interface RadioStore {
  // Estado del reproductor
  currentStation: Station | null;
  status: PlayerStatus;
  volume: number;
  isMuted: boolean;
  audioRef: HTMLAudioElement | null;

  // Acciones
  setStation: (station: Station) => void;
  setStatus: (status: PlayerStatus) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  setAudioRef: (ref: HTMLAudioElement | null) => void;
}

export const useRadioStore = create<RadioStore>((set, get) => ({
  currentStation: null,
  status: 'idle',
  volume: 0.8,
  isMuted: false,
  audioRef: null,

  setStation: (station) => {
    const { audioRef } = get();
    if (audioRef) {
      audioRef.pause();
      audioRef.src = '';
    }
    set({ currentStation: station, status: 'loading' });
  },

  setStatus: (status) => set({ status }),

  setVolume: (volume) => {
    const { audioRef } = get();
    if (audioRef) audioRef.volume = volume;
    set({ volume, isMuted: volume === 0 });
  },

  toggleMute: () => {
    const { isMuted, volume, audioRef } = get();
    const newMuted = !isMuted;
    if (audioRef) audioRef.volume = newMuted ? 0 : volume;
    set({ isMuted: newMuted });
  },

  play: () => {
    const { audioRef } = get();
    if (audioRef) {
      audioRef.play().catch(console.error);
      set({ status: 'playing' });
    }
  },

  pause: () => {
    const { audioRef } = get();
    if (audioRef) {
      audioRef.pause();
      set({ status: 'paused' });
    }
  },

  stop: () => {
    const { audioRef } = get();
    if (audioRef) {
      audioRef.pause();
      audioRef.src = '';
    }
    set({ currentStation: null, status: 'idle' });
  },

  setAudioRef: (ref) => set({ audioRef: ref }),
}));
