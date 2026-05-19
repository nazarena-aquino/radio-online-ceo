import { useEffect, useState } from 'react';
import { stationsApi } from '../services/api';
import type { Station } from '../types';
import StationCard from '../components/StationCard';
import './HomePage.css';

export default function HomePage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('Todos');

  useEffect(() => {
    loadStations();
  }, []);

  const loadStations = async () => {
    try {
      setLoading(true);
      const res = await stationsApi.getAll();
      setStations(res.data.data || []);
    } catch {
      setError('No se pudo conectar al servidor. Asegúrate de que el backend está corriendo.');
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

  return (
    <div className="home">
      {/* Header */}
      <header className="home__header">
        <div className="home__header-inner">
          <div className="home__logo">
            <span className="home__logo-icon">📻</span>
            <div>
              <h1 className="home__title">RADIO<span className="text-accent">ONLINE</span></h1>
              <p className="home__subtitle">Transmisión en vivo · 24/7</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="home__hero">
        <div className="home__hero-inner">
          <div className="home__hero-tag">● EN VIVO AHORA</div>
          <h2 className="home__hero-title">Tu música.<br />Sin interrupciones.</h2>
          <p className="home__hero-text">
            Escucha las mejores estaciones de radio en streaming de alta calidad.
            Sin anuncios, sin registros, directo al oído.
          </p>
        </div>
        <div className="home__hero-decoration">
          <div className="hero-ring ring-1" />
          <div className="hero-ring ring-2" />
          <div className="hero-ring ring-3" />
          <span className="hero-center-icon">🎵</span>
        </div>
      </section>

      {/* Filters */}
      <div className="home__filters">
        <input
          type="text"
          placeholder="Buscar estación..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="home__search"
        />
        <div className="home__genres">
          {genres.map(g => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`home__genre-btn ${selectedGenre === g ? 'active' : ''}`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="home__main">
        {loading && (
          <div className="home__loading">
            <div className="home__spinner" />
            <p>Cargando estaciones...</p>
          </div>
        )}

        {error && (
          <div className="home__error">
            <p>⚠️ {error}</p>
            <button onClick={loadStations} className="home__retry-btn">Reintentar</button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="home__empty">
            <p>No se encontraron estaciones</p>
            {stations.length === 0 && (
              <small>Agrega estaciones desde el panel de administración</small>
            )}
          </div>
        )}

        <div className="home__grid">
          {filtered.map((station, i) => (
            <div key={station.id} style={{ animationDelay: `${i * 0.05}s` }}>
              <StationCard station={station} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
