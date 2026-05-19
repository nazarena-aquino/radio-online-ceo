import { useRadioStore } from '../store/radioStore';
import type { Station } from '../types';
import './StationCard.css';

interface Props {
  station: Station;
}

const GENRE_COLORS: Record<string, string> = {
  Jazz: '#f5a623',
  Rock: '#e84545',
  Pop: '#a855f7',
  Electrónica: '#06b6d4',
  Clásica: '#10b981',
  Reggaeton: '#f97316',
  Cumbia: '#eab308',
  Internacional: '#6366f1',
  Default: '#8888aa',
};

const GENRE_ICONS: Record<string, string> = {
  Jazz: '🎷',
  Rock: '🎸',
  Pop: '🎤',
  Electrónica: '🎛️',
  Clásica: '🎻',
  Reggaeton: '🎵',
  Cumbia: '🪗',
  Internacional: '🌍',
  Default: '📻',
};

export default function StationCard({ station }: Props) {
  const { currentStation, status, setStation, pause, play } = useRadioStore();
  const isActive = currentStation?.id === station.id;
  const isPlaying = isActive && status === 'playing';
  const isLoading = isActive && status === 'loading';

  const genre = station.genre || 'Default';
  const color = GENRE_COLORS[genre] || GENRE_COLORS.Default;
  const icon = GENRE_ICONS[genre] || GENRE_ICONS.Default;

  const handleClick = () => {
    if (isPlaying) {
      pause();
    } else if (isActive && status === 'paused') {
      play();
    } else {
      setStation(station);
    }
  };

  return (
    <div
      className={`station-card ${isActive ? 'active' : ''}`}
      onClick={handleClick}
      style={{ '--card-color': color } as React.CSSProperties}
    >
      <div className="station-card__glow" />

      <div className="station-card__top">
        <div className="station-card__icon">{icon}</div>
        {isActive && (
          <div className="station-card__playing">
            {isLoading ? (
              <div className="loading-dots">
                <span /><span /><span />
              </div>
            ) : isPlaying ? (
              <div className="wave-bars">
                {[1,2,3,4].map(i => (
                  <span key={i} style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
            ) : (
              <span className="paused-badge">⏸</span>
            )}
          </div>
        )}
      </div>

      <div className="station-card__body">
        <h3 className="station-card__name">{station.name}</h3>
        <p className="station-card__desc">{station.description || 'Streaming en vivo'}</p>
      </div>

      <div className="station-card__footer">
        {station.genre && (
          <span className="station-card__genre">{station.genre}</span>
        )}
        <span className="station-card__bitrate">{station.bitrate}kbps</span>
      </div>

      <button className="station-card__btn">
        {isPlaying ? '⏸ Pausar' : isLoading ? 'Cargando...' : '▶ Escuchar'}
      </button>
    </div>
  );
}
