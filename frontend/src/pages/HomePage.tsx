import { useEffect, useState } from 'react';
import { stationsApi } from '../services/api';
import type { Station } from '../types';
import { useRadioStore } from '../store/radioStore';
import './HomePage.css';

const GENRE_COLORS: Record<string, string> = {
  Jazz: '#CC6600',
  Rock: '#17B0DE',
  Pop: '#5700C4',
  Clásica: '#890187',
  Electrónica: '#17B0DE',
  Reggaeton: '#CC6600',
  Cumbia: '#890187',
  Internacional: '#5700C4',
  Default: '#17B0DE',
};

const GENRE_ICONS: Record<string, string> = {
  Jazz: '🎷', Rock: '🎸', Pop: '🎤', Clásica: '🎻',
  Electrónica: '🎛️', Reggaeton: '🎵', Cumbia: '🪗',
  Internacional: '🌍', Default: '📻',
};

const COMMUNITY_ITEMS = [
  { label: 'Nuestra Agencia', bg: '#1a1a2e' },
  { label: 'Live Studio', bg: '#16213e' },
  { label: 'Tendencia Digital', bg: '#0f3460' },
  { label: 'Música Pura', bg: '#1a1a2e' },
  { label: 'Nuestro Team', bg: '#16213e' },
  { label: 'Eventos CEO', bg: '#0f3460' },
];

export default function HomePage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('Todos');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { currentStation, status, setStation, pause, play } = useRadioStore();

  useEffect(() => { loadStations(); }, []);

  const loadStations = async () => {
    try {
      setLoading(true);
      const res = await stationsApi.getAll();
      setStations(res.data.data || []);
    } catch {
      setError('No se pudo conectar al servidor.');
    } finally {
      setLoading(false);
    }
  };

  const genres = ['Todos', ...Array.from(new Set(stations.map(s => s.genre).filter(Boolean) as string[]))];

  const filtered = stations.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'Todos' || s.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const handleStationClick = (station: Station) => {
    if (currentStation?.id === station.id) {
      if (status === 'playing') pause();
      else play();
    } else {
      setStation(station);
    }
  };

  const isPlaying = (station: Station) => currentStation?.id === station.id && status === 'playing';
  const isLoading = (station: Station) => currentStation?.id === station.id && status === 'loading';
  const isActive = (station: Station) => currentStation?.id === station.id;

  return (
    <div className="ceo-layout">
      {/* Sidebar overlay mobile */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`ceo-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-name">CEO MultiMedios</div>
          <div className="sidebar-brand-sub">Innovación &amp; Tendencia</div>
        </div>
        <nav className="sidebar-nav">
          <a href="#live" className="sidebar-link active">
            <span className="sidebar-icon">📡</span>
            <span>Live Stream</span>
          </a>
          <a href="#tracks" className="sidebar-link">
            <span className="sidebar-icon">🎵</span>
            <span>Recent Tracks</span>
          </a>
          <a href="#community" className="sidebar-link">
            <span className="sidebar-icon">👥</span>
            <span>Our Team</span>
          </a>
          <a href="#community" className="sidebar-link">
            <span className="sidebar-icon">🔗</span>
            <span>Services</span>
          </a>
          <a href="#community" className="sidebar-link">
            <span className="sidebar-icon">✉️</span>
            <span>Contact</span>
          </a>
        </nav>
        <div className="sidebar-footer">
          <button className="sidebar-listen-btn" onClick={() => {
            if (stations.length > 0 && !currentStation) setStation(stations[0]);
          }}>
            Listen Live
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="ceo-main">

        {/* Top bar */}
        <header className="ceo-topbar">
          <button className="topbar-menu-btn" onClick={() => setSidebarOpen(v => !v)}>☰</button>
          <div className="topbar-brand">CEO MultiMedios</div>
          <nav className="topbar-nav">
            <a href="#live" className="topbar-link active">Home</a>
            <a href="#tracks" className="topbar-link">Schedule</a>
            <a href="#" className="topbar-link">Podcasts</a>
            <a href="#community" className="topbar-link">Social</a>
          </nav>
          <div className="topbar-actions">
            <button className="topbar-icon-btn" title="Notificaciones">🔔</button>
            <button className="topbar-icon-btn" title="Perfil">👤</button>
          </div>
        </header>

        {/* Hero */}
        <section className="ceo-hero" id="live">
          <div className="hero-bg-glow hero-bg-glow--blue" />
          <div className="hero-bg-glow hero-bg-glow--purple" />

          <div className="hero-content">
            <div className="hero-live-badge">
              <span className="hero-live-dot" />
              <span className="hero-live-text">EN VIVO AHORA</span>
            </div>
            <h1 className="hero-title">
              TU MÚSICA.<br />
              <span className="hero-title-gradient">SIN INTERRUPCIONES.</span>
            </h1>
            <p className="hero-desc">
              Escucha las mejores estaciones de radio en streaming de alta calidad.
              Sin anuncios, sin registros, directo al oído. La nueva era de la comunicación digital está aquí.
            </p>

            <div className="hero-filters">
              <div className="hero-search-wrapper">
                <input
                  type="text"
                  placeholder="Buscar estación..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="hero-search"
                />
                <span className="hero-search-icon">🔍</span>
              </div>
              <div className="hero-genres">
                {genres.map(g => (
                  <button
                    key={g}
                    onClick={() => setSelectedGenre(g)}
                    className={`hero-genre-btn ${selectedGenre === g ? 'active' : ''}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Decorative rings */}
          <div className="hero-decoration" aria-hidden>
            <div className="hero-ring hero-ring--1" />
            <div className="hero-ring hero-ring--2" />
            <div className="hero-ring hero-ring--3" />
            <span className="hero-ring-icon">🎵</span>
          </div>
        </section>

        {/* Stations */}
        <section className="ceo-section" id="stations">
          <h2 className="section-title">Estaciones Destacadas</h2>

          {loading && (
            <div className="ceo-state">
              <div className="ceo-spinner" />
              <p>Cargando estaciones...</p>
            </div>
          )}

          {error && (
            <div className="ceo-state ceo-state--error">
              <p>⚠️ {error}</p>
              <button onClick={loadStations} className="ceo-retry-btn">Reintentar</button>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="ceo-state">
              <p>No se encontraron estaciones</p>
              {stations.length === 0 && <small>Agregá estaciones desde el panel de administración</small>}
            </div>
          )}

          <div className="stations-grid">
            {filtered.map((station) => {
              const genre = station.genre || 'Default';
              const color = GENRE_COLORS[genre] || GENRE_COLORS.Default;
              const icon = GENRE_ICONS[genre] || GENRE_ICONS.Default;
              const playing = isPlaying(station);
              const loading_ = isLoading(station);
              const active = isActive(station);

              return (
                <div
                  key={station.id}
                  className={`station-card ${active ? 'station-card--active' : ''}`}
                  style={{ '--card-accent': color } as React.CSSProperties}
                >
                  <div className="station-card__header">
                    <span className="station-card__icon">{icon}</span>
                    <span className="station-card__status">
                      {loading_ && <span className="status-dot status-dot--loading" />}
                      {playing && <span className="status-dot status-dot--live" />}
                    </span>
                  </div>
                  <h3 className="station-card__name">{station.name}</h3>
                  <p className="station-card__desc">{station.description || 'Streaming en vivo'}</p>
                  <div className="station-card__meta">
                    {station.genre && (
                      <span className="station-card__badge" style={{ background: color }}>
                        {station.genre.toUpperCase()}
                      </span>
                    )}
                    <span className="station-card__kbps">{station.bitrate} KBPS</span>
                  </div>
                  <button
                    className="station-card__btn"
                    onClick={() => handleStationClick(station)}
                    style={active ? { background: color, borderColor: color, color: '#fff' } : { borderColor: color, color: color }}
                  >
                    <span className="station-card__btn-icon">
                      {loading_ ? '⏳' : playing ? '⏸' : '▶'}
                    </span>
                    {loading_ ? 'Cargando...' : playing ? 'Pausar' : 'Escuchar'}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Community */}
        <section className="ceo-section" id="community">
          <div className="community-header">
            <div>
              <h2 className="section-title" style={{ marginBottom: '8px' }}>Comunidad CEO</h2>
              <p className="community-sub">
                Sigue nuestra tendencia en{' '}
                <a href="https://instagram.com/ceomultimedios" target="_blank" rel="noreferrer" className="community-handle">
                  @ceomultimedios
                </a>
              </p>
            </div>
            <a
              href="https://instagram.com/ceomultimedios"
              target="_blank"
              rel="noreferrer"
              className="community-ig-btn"
            >
              <span>⬡</span> Visítanos en Instagram
            </a>
          </div>

          <div className="community-grid">
            {COMMUNITY_ITEMS.map((item, i) => (
              <div key={i} className="community-item" style={{ background: item.bg }}>
                <div className="community-item__overlay">
                  <div className="community-item__visual">
                    {['🎙️', '🎚️', '🎧', '🎷', '🎬', '🎤'][i]}
                  </div>
                </div>
                <div className="community-item__label">{item.label}</div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
