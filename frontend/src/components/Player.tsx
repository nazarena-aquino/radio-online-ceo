import { useRadioStore } from '../store/radioStore';
import './Player.css';

export default function Player() {
  const { currentStation, status, volume, isMuted, pause, play, stop, setVolume, toggleMute } = useRadioStore();

  if (!currentStation) return null;

  const isPlaying = status === 'playing';
  const isLoading = status === 'loading';
  const isError   = status === 'error';

  return (
    <div className="player">
      <div className="player__inner">

        {/* Info */}
        <div className="player__info">
          <div className="player__icon-box">📻</div>
          <div>
            <div className="player__station-name">{currentStation.name}</div>
            <div className="player__status">
              {isLoading && <span className="player__status-text loading">Conectando...</span>}
              {isPlaying && <span className="player__status-text playing">● EN VIVO</span>}
              {isError   && <span className="player__status-text error">Error de conexión</span>}
              {status === 'paused' && <span className="player__status-text paused">Pausado</span>}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="player__controls">
          <button
            className="player__btn player__btn--main"
            onClick={isPlaying ? pause : play}
            disabled={isLoading}
          >
            {isLoading ? <span className="spinner" /> : isPlaying ? '⏸' : '▶'}
          </button>
          <button className="player__btn player__btn--stop" onClick={stop} title="Detener">
            ■
          </button>
        </div>

        {/* Volume */}
        <div className="player__volume">
          <button className="player__mute" onClick={toggleMute} title={isMuted ? 'Activar' : 'Silenciar'}>
            {isMuted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
            className="player__slider"
          />
        </div>

        {/* Meta */}
        <div className="player__meta">
          <span>{currentStation.bitrate} kbps</span>
          {currentStation.genre && <span>{currentStation.genre}</span>}
        </div>

      </div>
    </div>
  );
}
