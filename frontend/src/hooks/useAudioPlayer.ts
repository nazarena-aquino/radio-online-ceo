import { useEffect, useRef } from 'react';
import { useRadioStore } from '../store/radioStore';

export const useAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { currentStation, volume, isMuted, setStatus, setAudioRef } = useRadioStore();

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      setAudioRef(audioRef.current);
    }
    const audio = audioRef.current;

    const handleCanPlay = () => setStatus('playing');
    const handleError = () => setStatus('error');
    const handleWaiting = () => setStatus('loading');
    const handlePlaying = () => setStatus('playing');

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
    };
  }, [setStatus, setAudioRef]);

  useEffect(() => {
    if (!audioRef.current || !currentStation) return;
    const audio = audioRef.current;
    audio.src = currentStation.stream_url;
    audio.volume = isMuted ? 0 : volume;
    audio.load();
    audio.play().catch(() => setStatus('error'));
  }, [currentStation, volume, isMuted, setStatus]);

  return audioRef;
};
