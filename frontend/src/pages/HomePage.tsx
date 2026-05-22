import { useEffect, useState, useRef } from 'react';
import { stationsApi } from '../services/api';
import type { Station } from '../types';
import { useRadioStore } from '../store/radioStore';
import './HomePage.css';

// ── Color per genre ──────────────────────────────────────────────────────────
const GENRE_COLOR: Record<string, string> = {
  Jazz:        '#CC6600',
  Rock:        '#17B0DE',
  Pop:         '#5700C4',
  Clásica:     '#17B0DE',
  Electrónica: '#5700C4',
  Reggaeton:   '#CC6600',
  Cumbia:      '#890187',
  Internacional:'#CC6600',
  Default:     '#CC6600',
};

// ── Background image per genre ───────────────────────────────────────────────
const GENRE_IMAGE: Record<string, string> = {
  Jazz:         '/images/hero-jazz.png',
  Clásica:      '/images/hero-clasica.png',
  Rock:         '/images/hero-rock.png',
  Pop:          '/images/hero-pop.png',
  Electrónica:  '/images/hero-electronica.png',
  Reggaeton:    '/images/hero-pop.png',
  Cumbia:       '/images/hero-pop.png',
  Internacional:'/images/hero-jazz.png',
  Default:      '/images/hero-rock.png',
};



// ── Tiny inline SVG icons ────────────────────────────────────────────────────
const PlayIcon  = () => <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>;
const PauseIcon = () => <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>;
const SearchIcon= () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-3.5-3.5" strokeLinecap="round"/></svg>;
const ArrowIcon = () => <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const SignalIcon= () => <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 17a8 8 0 0 1 14 0M8 14a4.5 4.5 0 0 1 8 0M11 11a1.5 1.5 0 0 1 2 0" strokeLinecap="round"/></svg>;
const HeartIcon = () => <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 5.65-7 10-7 10Z"/></svg>;
const InstaIcon = () => <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor"/></svg>;

// ── Equalizer bars ───────────────────────────────────────────────────────────
function Equalizer({ active = true, color = 'currentColor', size = 13 }) {
  return (
    <span aria-hidden="true" className="eq-wrap" style={{ height: size }}>
      {[0,1,2,3].map(i => (
        <span key={i} className={`eq-bar ${active ? 'eq-bar--active' : ''}`}
          style={{ background: color, height: size,
            animationDuration: `${0.7 + (i % 3) * 0.18}s`,
            animationDelay: `${i * 0.12}s` }}
        />
      ))}
    </span>
  );
}

// ── Artwork disc tile ────────────────────────────────────────────────────────
function ArtworkTile({ accent = '#CC6600', size = 80 }) {
  return (
    <div className="artwork-tile" style={{ width: size, height: size,
      background: `linear-gradient(135deg, ${accent} 0%, #2A1A10 100%)` }}>
      <svg viewBox="0 0 80 80" aria-hidden="true" style={{ position:'absolute',inset:0,width:'100%',height:'100%' }}>
        <circle cx="40" cy="40" r="28" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="1"/>
        <circle cx="40" cy="40" r="20" fill="none" stroke="rgba(255,255,255,.22)" strokeWidth="1"/>
        <circle cx="40" cy="40" r="12" fill="none" stroke="rgba(255,255,255,.28)" strokeWidth="1"/>
        <circle cx="40" cy="40" r="4"  fill="#fff" opacity=".9"/>
      </svg>
    </div>
  );
}

// ── Logo ─────────────────────────────────────────────────────────────────────
function Logo() {
  return (
    <div className="logo">
      <svg width="190" height="44" viewBox="0 0 380 88" aria-label="CEO FM — MultiMedios Radio">
        <defs>
          <linearGradient id="logo-purple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7B5EA7"/>
            <stop offset="100%" stopColor="#5B3F8A"/>
          </linearGradient>
          <linearGradient id="logo-blue" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4BA8D4"/>
            <stop offset="100%" stopColor="#3A8FBE"/>
          </linearGradient>
          <clipPath id="logo-clip">
            <circle cx="30" cy="44" r="28"/>
          </clipPath>
        </defs>
        {/* Purple circle badge */}
        <circle cx="30" cy="44" r="28" fill="url(#logo-purple)"/>
        {/* CEO text */}
        <text x="30" y="40" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="13" fill="#ffffff" letterSpacing="0.5">CEO</text>
        {/* Wave arcs */}
        <g clipPath="url(#logo-clip)">
          <circle cx="30" cy="52" r="5"  fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5"/>
          <circle cx="30" cy="52" r="10" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"/>
          <circle cx="30" cy="52" r="15" fill="none" stroke="rgba(255,255,255,0.2)"  strokeWidth="1.5"/>
        </g>
        {/* MultiMedios */}
        <text x="70" y="38" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="28" fill="url(#logo-blue)" letterSpacing="-0.5">MultiMedios</text>
        {/* FM badge */}
        <rect x="71" y="46" width="38" height="17" rx="4" fill="#CC6600"/>
        <text x="90" y="58" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="10" fill="#ffffff" letterSpacing="1">FM</text>
        {/* Radio waves */}
        <path d="M117 50 Q123 44 117 38" fill="none" stroke="#CC6600" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M122 53 Q130 44 122 35" fill="none" stroke="#CC6600" strokeWidth="1.8" strokeLinecap="round" opacity="0.65"/>
        <path d="M127 56 Q138 44 127 32" fill="none" stroke="#CC6600" strokeWidth="1.8" strokeLinecap="round" opacity="0.35"/>
        {/* Tagline */}
        <text x="71" y="76" fontFamily="Inter, sans-serif" fontWeight="500" fontSize="9" fill="#888888" letterSpacing="2">INNOVACIÓN &amp; TENDENCIA</text>
      </svg>
    </div>
  );
}

export default function HomePage() {
  const [stations, setStations]   = useState<Station[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [q, setQ]                 = useState('');
  const [genre, setGenre]         = useState('Todos');
  const [heroIdx, setHeroIdx]     = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { currentStation, status, setStation, pause, play } = useRadioStore();
  const isPlayingGlobal = status === 'playing';
  const accent = '#CC6600';

  useEffect(() => { loadStations(); }, []);

  // Hero auto-advance
  useEffect(() => {
    if (heroPaused || stations.length === 0) return;
    timerRef.current = setTimeout(() => setHeroIdx(i => (i + 1) % stations.length), 5200);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [heroIdx, heroPaused, stations.length]);

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
    const matchG = genre === 'Todos' || s.genre === genre;
    const k = q.trim().toLowerCase();
    const matchQ = !k || s.name.toLowerCase().includes(k) || (s.description || '').toLowerCase().includes(k);
    return matchG && matchQ;
  });

  const handlePlay = (station?: Station) => {
    if (!station) {
      if (currentStation) isPlayingGlobal ? pause() : play();
      return;
    }
    if (currentStation?.id === station.id) {
      isPlayingGlobal ? pause() : play();
    } else {
      setStation(station);
    }
  };

  const heroStation = stations[heroIdx] ?? null;
  const heroColor   = heroStation ? (GENRE_COLOR[heroStation.genre || ''] || accent) : accent;

  // Sync heroColor to CSS custom property so Player and other components can use it
  useEffect(() => {
    document.documentElement.style.setProperty('--hero-color', heroColor);
  }, [heroColor]);

  const SCHEDULE = [
    { time:'06:00', title:'Mañana en vivo',    host:'Lucía M.',   live:false },
    { time:'09:00', title:'La Mesa Redonda',   host:'Iván C.',    live:false },
    { time:'12:00', title:'Mediodía Musical',  host:'Camila R.',  live:true  },
    { time:'15:00', title:'Tarde Indie',       host:'Bruno L.',   live:false },
    { time:'18:00', title:'Hora Pico',         host:'D. Salgado', live:false },
    { time:'21:00', title:'Sesión Nocturna',   host:'Mateo Q.',   live:false },
  ];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="onda-root">
      {/* ── TopBar ─────────────────────────────────── */}
      <header className="onda-topbar">
        <div className="onda-topbar__inner">
          <button className="onda-topbar__menu" onClick={() => setSidebarOpen(v => !v)}>☰</button>
          <Logo />
          <nav className="onda-topbar__nav">
            <button className="onda-topbar__link" onClick={() => scrollTo('section-live')}>En vivo</button>
            <button className="onda-topbar__link" onClick={() => scrollTo('section-stations')}>Estaciones</button>
            <button className="onda-topbar__link" onClick={() => scrollTo('section-schedule')}>Programación</button>
          </nav>
          <div className="onda-topbar__pill">
            <span className="onda-topbar__dot onda-topbar__dot--green" />
            <span>En vivo</span>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────── */}
      <section className="onda-hero-wrap" id="section-live">
        <div
          className="onda-hero"
          onMouseEnter={() => setHeroPaused(true)}
          onMouseLeave={() => setHeroPaused(false)}
        >
          {/* Backdrop per slide */}
          {stations.map((s, i) => {
            const c    = GENRE_COLOR[s.genre || ''] || accent;
            const img  = GENRE_IMAGE[s.genre || ''] || GENRE_IMAGE.Default;
            return (
              <div key={s.id} className="onda-hero__bg" style={{ opacity: i === heroIdx ? 1 : 0 }}>
                {/* Photo background */}
                <div className="onda-hero__bg-photo" style={{ backgroundImage: `url(${img})` }} />
                {/* Color tint overlay */}
                <div className="onda-hero__bg-tint" style={{
                  background: `
                    radial-gradient(60% 80% at 80% 20%, ${c}99, transparent 65%),
                    linear-gradient(135deg, rgba(10,6,3,.82) 0%, rgba(10,6,3,.55) 50%, rgba(10,6,3,.2) 100%)
                  `,
                }} />
                {/* Giant italic station name */}
                <div className="onda-hero__bg-text">{s.name}</div>
                {/* Dark scrim for text legibility */}
                <div className="onda-hero__scrim" />
              </div>
            );
          })}

          {/* Content grid */}
          <div className="onda-hero__content">
            {/* Left: headline */}
            <div className="onda-hero__left">
              <h1 className="onda-hero__h1">
                Tu música<br />
                <span style={{ fontFamily:'Inter', fontWeight:800, fontStyle:'normal', letterSpacing:'-.03em' }}>EN VIVO,</span><br />
                <span style={{ fontFamily:'Inter', fontWeight:800, fontStyle:'normal', color: heroColor, transition:'color .6s ease' }}>sin pausa.</span>
              </h1>
              <p className="onda-hero__desc">
                Tus estaciones favoritas en streaming de alta calidad.
                Sin registros, sin anuncios — directo al oído.
              </p>
              <div className="onda-hero__btns">
                <button className="onda-hero__btn-primary"
                  style={{ background: heroColor, boxShadow: `0 14px 32px -12px ${heroColor}` }}
                  onClick={() => heroStation && handlePlay(heroStation)}
                >
                  <span className="onda-hero__btn-icon">
                    {isPlayingGlobal && currentStation?.id === heroStation?.id ? <PauseIcon /> : <PlayIcon />}
                  </span>
                  {isPlayingGlobal && currentStation?.id === heroStation?.id ? 'Pausar' : 'Escuchar en vivo'}
                </button>

              </div>
            </div>

            {/* Right: now-playing card */}
            {heroStation && (
              <div className="onda-hero__right">
                <div className="onda-hero__card">
                  <div className="onda-hero__card-top">
                    <span className="onda-hero__card-label">
                      <Equalizer active={isPlayingGlobal} color={heroColor} size={11} />
                      Sonando ahora
                    </span>
                    <span className="onda-hero__card-genre">{heroStation.genre}</span>
                  </div>
                  <div className="onda-hero__card-station" style={{ color: heroColor }}>{heroStation.name}</div>
                  <div className="onda-hero__card-track">{heroStation.description || 'En vivo'}</div>
                  <div className="onda-hero__card-progress">
                    <div className="onda-hero__card-bar">
                      <div className="onda-hero__card-fill" style={{ background: heroColor, width: '58%' }} />
                    </div>
                    <div className="onda-hero__card-meta">
                      <span>EN VIVO</span>
                      <span><SignalIcon /> {heroStation.bitrate} kbps</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Slider controls */}
          {stations.length > 1 && (
            <div className="onda-hero__controls">
              <div className="onda-hero__nav">
                <button className="onda-hero__nav-btn" onClick={() => setHeroIdx(i => (i - 1 + stations.length) % stations.length)}>‹</button>
                <button className="onda-hero__nav-btn" onClick={() => setHeroIdx(i => (i + 1) % stations.length)}>›</button>
                <div className="onda-hero__divider" />
                
              </div>
              <div className="onda-hero__dots">
                {stations.map((_, i) => (
                  <button key={i} aria-label={`Slide ${i+1}`} onClick={() => setHeroIdx(i)}
                    className="onda-hero__dot"
                    style={{ width: i === heroIdx ? 26 : 8, background: i === heroIdx ? heroColor : 'rgba(255,255,255,.22)' }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Progress line */}
          <div className="onda-hero__progress-line">
            <div key={`${heroIdx}-${isPlayingGlobal}`}
              className={`onda-hero__progress-fill ${!heroPaused && isPlayingGlobal ? 'onda-hero__progress-fill--anim' : ''}`}
              style={{ background: heroColor }}
            />
          </div>

          {/* Ticker */}
          <div className="onda-hero__ticker">
            <div className="onda-hero__ticker-inner">
              {[0,1,2].map(k => (
                <span key={k}>
                  {stations.map(s => (
                    <span key={s.id} className="onda-hero__ticker-item">
                      <span style={{ color: heroColor, fontWeight: 700 }}>● {s.name.toUpperCase()}</span>
                      &nbsp;&nbsp;{(s.description || '').toUpperCase()}&nbsp;·&nbsp;{s.bitrate} kbps
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Body layout ────────────────────────────── */}
      <div className="onda-body">
        {/* Sidebar */}
        {sidebarOpen && <div className="onda-sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
        <aside className={`onda-sidebar ${sidebarOpen ? 'onda-sidebar--open' : ''}`}>
          <div className="onda-sidebar__section-label">Explora</div>
          <ul className="onda-sidebar__list">
            {[
              { label:'En vivo',      meta:`${stations.length} estaciones`, section:'section-live'     },
              { label:'Estaciones',   meta:'',                               section:'section-stations' },
              { label:'Programación', meta:'hoy',                            section:'section-schedule' },
            ].map(item => (
              <li key={item.label}>
                <a
                  href="#"
                  className="onda-sidebar__link"
                  onClick={e => { e.preventDefault(); scrollTo(item.section); setSidebarOpen(false); }}
                >
                  <span>{item.label}</span>
                  {item.meta && <span className="onda-sidebar__meta">{item.meta}</span>}
                </a>
              </li>
            ))}
          </ul>
          <div className="onda-sidebar__divider" />
          <div className="onda-sidebar__section-label">Tu sintonía</div>
          {currentStation ? (
            <div className="onda-sidebar__now">
              <div className="onda-sidebar__now-disc" style={{
                background: `linear-gradient(135deg, ${GENRE_COLOR[currentStation.genre || ''] || accent} 0%, #1a0a04 100%)`,
                boxShadow: `0 2px 10px -4px ${GENRE_COLOR[currentStation.genre || ''] || accent}`,
              }}>
                <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
                  <circle cx="20" cy="20" r="12" fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="1"/>
                  <circle cx="20" cy="20" r="7"  fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="1"/>
                  <circle cx="20" cy="20" r="2.5" fill="rgba(255,255,255,.8)"/>
                </svg>
              </div>
              <div className="onda-sidebar__now-info">
                <div className="onda-sidebar__now-name">{currentStation.name}</div>
                <div className="onda-sidebar__now-meta">{currentStation.genre} · {currentStation.bitrate} kbps</div>
              </div>
            </div>
          ) : (
            <div className="onda-sidebar__now-empty">Ninguna estación activa</div>
          )}
        </aside>

        {/* Main content */}
        <div className="onda-main">
          {/* Stations header */}
          <div id="section-stations" />
          <div className="onda-stations-header">
            <div>
              <div className="onda-label">Catálogo</div>
              <h2 className="onda-section-title">Estaciones destacadas</h2>
            </div>
            {/* Filter bar */}
            <div className="onda-filter">
              <div className="onda-filter__search">
                <SearchIcon />
                <input value={q} onChange={e => setQ(e.target.value)}
                  placeholder="Buscar estación, género…"
                  className="onda-filter__input" />
                <span className="onda-filter__kbd">⌘K</span>
              </div>
              <div className="onda-filter__genres">
                {genres.map(g => (
                  <button key={g} onClick={() => setGenre(g)}
                    className={`onda-filter__chip ${genre === g ? 'onda-filter__chip--active' : ''}`}
                    style={genre === g ? { background: heroColor, borderColor: heroColor, color:'#fff' } : {}}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* States */}
          {loading && (
            <div className="onda-state">
              <div className="onda-spinner" />
              <span>Cargando estaciones…</span>
            </div>
          )}
          {error && (
            <div className="onda-state onda-state--error">
              <span>⚠️ {error}</span>
              <button className="onda-retry" onClick={loadStations}>Reintentar</button>
            </div>
          )}

          {/* Cards grid */}
          {!loading && !error && (
            <div className="onda-grid">
              {filtered.length === 0 ? (
                <div className="onda-empty">Sin coincidencias. Probá con otro género.</div>
              ) : filtered.map(s => {
                const c      = GENRE_COLOR[s.genre || ''] || heroColor;
                const img    = GENRE_IMAGE[s.genre || ''] || GENRE_IMAGE.Default;
                const active = currentStation?.id === s.id;
                const playing = active && isPlayingGlobal;
                return (
                  <article key={s.id}
                    className={`onda-card ${active ? 'onda-card--active' : ''}`}
                    style={{
                      '--card-c': c,
                      borderColor: active ? c : 'transparent',
                      boxShadow: active ? `0 20px 48px -20px ${c}66` : undefined,
                    } as React.CSSProperties}>

                    {/* Photo header */}
                    <div className="onda-card__photo" style={{ backgroundImage: `url(${img})` }}>
                      <div className="onda-card__photo-tint" style={{ background: `linear-gradient(135deg, ${c}CC 0%, ${c}44 100%)` }} />
                      <div className="onda-card__photo-top">
                        <span className="onda-card__genre-pill">{s.genre || 'Radio'}</span>
                        <button className="onda-card__heart" aria-label="favorito"><HeartIcon /></button>
                      </div>
                      <div className="onda-card__photo-bottom">
                        <ArtworkTile accent={c} size={44} />
                      </div>
                    </div>

                    {/* Body */}
                    <div className="onda-card__body">
                      <div className="onda-card__name">{s.name}</div>
                      <div className="onda-card__desc">{s.description || 'Streaming en vivo'}</div>

                      <div className="onda-card__meta">
                        <span className="onda-card__live-badge">
                          <span className="onda-card__live-dot" />
                          en vivo
                        </span>
                        <span className="onda-card__kbps">{s.bitrate} kbps</span>
                      </div>

                      <button className="onda-card__btn"
                        style={{
                          background: playing ? c : 'transparent',
                          color: playing ? '#fff' : c,
                          borderColor: c,
                        }}
                        onClick={() => handlePlay(s)}>
                        {playing
                          ? <><PauseIcon /> <span>Sonando</span></>
                          : <><PlayIcon />  <span>Escuchar</span></>}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Schedule strip */}
          {!loading && (
            <div className="onda-schedule" id="section-schedule">
              <div className="onda-schedule__header">
                <div>
                  <div className="onda-label">Hoy · programación</div>
                  <h3 className="onda-section-title" style={{ fontSize:22 }}>Programación de la semana</h3>
                </div>
                <button className="onda-schedule__more">Ver semana completa <ArrowIcon /></button>
              </div>
              <div className="onda-schedule__grid scroll">
                {SCHEDULE.map(p => (
                  <div key={p.title} className="onda-schedule__item"
                    style={{ borderColor: p.live ? heroColor : undefined,
                      background: p.live ? heroColor + '10' : undefined }}>
                    <div className="onda-schedule__item-top">
                      <span className="onda-schedule__time" style={p.live ? { color: heroColor } : {}}>{p.time}</span>
                      {p.live && (
                        <span className="onda-schedule__live" style={{ color: heroColor }}>
                          <span className="onda-schedule__live-dot" style={{ background: heroColor }} /> Live
                        </span>
                      )}
                    </div>
                    <div className="onda-schedule__title">{p.title}</div>
                    <div className="onda-schedule__host">con {p.host}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Community */}
          <div className="onda-community">
            <div className="onda-community__text">
              <div className="onda-community__label" style={{ color: heroColor }}>Comunidad CEO</div>
              <h3 className="onda-community__title">Súbete a la frecuencia.</h3>
              <p className="onda-community__desc">
                Seguí nuestras estaciones.
                CEO es una radio independiente sostenida por su comunidad.
              </p>
            </div>
            <div className="onda-community__actions">
              
              <a
                href="https://www.instagram.com/ceomultimedios/"
                target="_blank"
                rel="noreferrer"
                className="onda-community__btn-fill"
                style={{ background: heroColor }}
              >
                Visitanos en Instagram <ArrowIcon />
              </a>
            </div>
          </div>

        </div>{/* /onda-main */}
      </div>{/* /onda-body */}
    </div>
  );
}
