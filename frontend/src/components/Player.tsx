import { useRadioStore } from '../store/radioStore';
import './Player.css';

// ── Custom SVG icons (no emojis) ─────────────────────────────────────────────

// Antena de radio con ondas
function RadioIcon({ color = '#fff' }: { color?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="12" width="6" height="9" rx="1.5" fill={color} opacity=".9"/>
      <rect x="11" y="10" width="2" height="3" fill={color} opacity=".7"/>
      {/* Ondas */}
      <path d="M6 8a7 7 0 0 1 12 0"   stroke={color} strokeWidth="1.6" strokeLinecap="round" fill="none" opacity=".9"/>
      <path d="M8.5 10.5a4 4 0 0 1 7 0" stroke={color} strokeWidth="1.6" strokeLinecap="round" fill="none" opacity=".65"/>
      <path d="M11 13a1 1 0 0 1 2 0"    stroke={color} strokeWidth="1.4" strokeLinecap="round" fill="none" opacity=".5"/>
    </svg>
  );
}

// Botón play triangular redondeado
function PlaySVG({ color = '#fff' }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 4.5v15L20 12 7 4.5Z" fill={color} strokeLinejoin="round"/>
    </svg>
  );
}

// Botón pause con líneas redondeadas
function PauseSVG({ color = '#fff' }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5"  y="4" width="4.5" height="16" rx="2.2" fill={color}/>
      <rect x="14.5" y="4" width="4.5" height="16" rx="2.2" fill={color}/>
    </svg>
  );
}

// Stop cuadrado con esquinas redondeadas
function StopSVG({ color = 'currentColor' }: { color?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="3" fill={color}/>
    </svg>
  );
}

// Volumen — parlante con ondas
function VolumeHighSVG({ color = 'currentColor' }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 9v6h4l5 5V4L7 9H3Z" fill={color} opacity=".9"/>
      <path d="M16 7a6 6 0 0 1 0 10"  stroke={color} strokeWidth="1.6" strokeLinecap="round" fill="none" opacity=".9"/>
      <path d="M18.5 4.5a10 10 0 0 1 0 15" stroke={color} strokeWidth="1.6" strokeLinecap="round" fill="none" opacity=".45"/>
    </svg>
  );
}

function VolumeLowSVG({ color = 'currentColor' }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 9v6h4l5 5V4L7 9H3Z" fill={color} opacity=".9"/>
      <path d="M16 7a6 6 0 0 1 0 10"  stroke={color} strokeWidth="1.6" strokeLinecap="round" fill="none" opacity=".9"/>
    </svg>
  );
}

function VolumeMuteSVG({ color = 'currentColor' }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 9v6h4l5 5V4L7 9H3Z" fill={color} opacity=".5"/>
      <path d="M17 9l4 4m0-4l-4 4" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

// Spinner SVG animado
function SpinnerSVG({ color = '#fff' }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"
      style={{ animation: 'player-spin .75s linear infinite' }}>
      <circle cx="12" cy="12" r="9" stroke={color} strokeOpacity=".25" strokeWidth="2.5"/>
      <path d="M12 3a9 9 0 0 1 9 9" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

// ── Player component ──────────────────────────────────────────────────────────
export default function Player() {
  const { currentStation, status, volume, isMuted, pause, play, stop, setVolume, toggleMute } = useRadioStore();

  if (!currentStation) return null;

  const isPlaying = status === 'playing';
  const isLoading = status === 'loading';
  const isError   = status === 'error';

  // Read dynamic color from CSS custom property set by HomePage
  const dynColor = getComputedStyle(document.documentElement).getPropertyValue('--hero-color').trim() || '#CC6600';

  const VolumeIcon = isMuted || volume === 0 ? VolumeMuteSVG : volume < 0.5 ? VolumeLowSVG : VolumeHighSVG;

  return (
    <div className="player" style={{ borderTopColor: dynColor + '55' }}>
      {/* Subtle glow line */}
      <div className="player__glow" style={{ background: `linear-gradient(90deg, transparent, ${dynColor}33, transparent)` }} />

      <div className="player__inner">

        {/* Info */}
        <div className="player__info">
          <div className="player__icon-box" style={{ background: dynColor + '22', border: `1px solid ${dynColor}44` }}>
            <RadioIcon color={dynColor} />
          </div>
          <div>
            <div className="player__station-name">{currentStation.name}</div>
            <div className="player__status">
              {isLoading && <span className="player__status-text loading">Conectando…</span>}
              {isPlaying && (
                <span className="player__status-text playing" style={{ color: dynColor }}>
                  <span className="player__live-dot" style={{ background: '#22c55e' }} />
                  EN VIVO
                </span>
              )}
              {isError   && <span className="player__status-text error">Error de conexión</span>}
              {status === 'paused' && <span className="player__status-text paused">Pausado</span>}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="player__controls">
          <button
            className="player__btn player__btn--stop"
            onClick={stop}
            title="Detener"
          >
            <StopSVG color="#879299" />
          </button>
          <button
            className="player__btn player__btn--main"
            onClick={isPlaying ? pause : play}
            disabled={isLoading}
            style={{ background: dynColor, boxShadow: `0 4px 20px -6px ${dynColor}99` }}
          >
            {isLoading
              ? <SpinnerSVG color="#fff" />
              : isPlaying
                ? <PauseSVG color="#fff" />
                : <PlaySVG  color="#fff" />}
          </button>
        </div>

        {/* Volume */}
        <div className="player__volume">
          <button className="player__mute" onClick={toggleMute} title={isMuted ? 'Activar' : 'Silenciar'}>
            <VolumeIcon color="#bcc8cf" />
          </button>
          <div className="player__slider-wrap">
            <input
              type="range"
              min={0} max={1} step={0.01}
              value={isMuted ? 0 : volume}
              onChange={e => setVolume(parseFloat(e.target.value))}
              className="player__slider"
              style={{ '--thumb-color': dynColor } as React.CSSProperties}
            />
            <div className="player__slider-fill"
              style={{
                width: `${(isMuted ? 0 : volume) * 100}%`,
                background: dynColor,
              }}
            />
          </div>
        </div>

        {/* Meta */}
        <div className="player__meta">
          <span style={{ color: dynColor, fontWeight: 600 }}>{currentStation.bitrate} kbps</span>
          {currentStation.genre && <span>{currentStation.genre}</span>}
        </div>

      </div>
    </div>
  );
}
