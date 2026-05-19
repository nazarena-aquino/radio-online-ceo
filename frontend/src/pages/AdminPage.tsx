import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { stationsApi } from '../services/api';
import { useAuthStore } from '../store/authStore';
import type { Station } from '../types';
import './AdminPage.css';

const EMPTY_FORM = {
  name: '',
  description: '',
  stream_url: '',
  logo_url: '',
  genre: '',
  language: 'Español',
  bitrate: 128,
};

export default function AdminPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);
  const { logout, username } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => { loadStations(); }, []);

  const loadStations = async () => {
    try {
      const res = await stationsApi.getAll();
      setStations(res.data.data || []);
    } catch {
      showMessage('error', 'Error al cargar estaciones');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'ok' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.stream_url) {
      showMessage('error', 'Nombre y URL del stream son obligatorios');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await stationsApi.update(editing, form);
        showMessage('ok', 'Estación actualizada');
      } else {
        await stationsApi.create(form);
        showMessage('ok', 'Estación creada');
      }
      setForm(EMPTY_FORM);
      setEditing(null);
      loadStations();
    } catch {
      showMessage('error', 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (station: Station) => {
    setEditing(station.id);
    setForm({
      name: station.name,
      description: station.description || '',
      stream_url: station.stream_url,
      logo_url: station.logo_url || '',
      genre: station.genre || '',
      language: station.language,
      bitrate: station.bitrate,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Desactivar esta estación?')) return;
    try {
      await stationsApi.delete(id);
      showMessage('ok', 'Estación desactivada');
      loadStations();
    } catch {
      showMessage('error', 'Error al eliminar');
    }
  };

  const handleCancel = () => {
    setForm(EMPTY_FORM);
    setEditing(null);
  };

  return (
    <div className="admin">
      <header className="admin__header">
        <a href="/" className="admin__back">← Volver</a>
        <h1 className="admin__title">PANEL DE <span className="text-accent">ADMINISTRACIÓN</span></h1>
        <div className="admin__user">
          <span className="admin__username">👤 {username}</span>
          <button onClick={handleLogout} className="admin__logout-btn">Salir</button>
        </div>
      </header>

      {message && (
        <div className={`admin__toast admin__toast--${message.type}`}>
          {message.type === 'ok' ? '✓' : '✗'} {message.text}
        </div>
      )}

      <div className="admin__layout">
        {/* Form */}
        <section className="admin__form-section">
          <h2 className="admin__section-title">
            {editing ? '✏️ Editar Estación' : '➕ Nueva Estación'}
          </h2>
          <form onSubmit={handleSubmit} className="admin__form">
            <div className="admin__field">
              <label>Nombre *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Ej: Radio Latina"
                required
              />
            </div>

            <div className="admin__field">
              <label>URL del Stream *</label>
              <input
                type="url"
                value={form.stream_url}
                onChange={e => setForm({ ...form, stream_url: e.target.value })}
                placeholder="https://stream.ejemplo.com/radio"
                required
              />
              <small>URL del stream MP3/AAC/OGG. Ejemplo: https://stream.radioparadise.com/rock-320</small>
            </div>

            <div className="admin__field">
              <label>Descripción</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Describe tu estación..."
                rows={3}
              />
            </div>

            <div className="admin__row">
              <div className="admin__field">
                <label>Género</label>
                <input
                  type="text"
                  value={form.genre}
                  onChange={e => setForm({ ...form, genre: e.target.value })}
                  placeholder="Jazz, Rock, Pop..."
                  list="genres"
                />
                <datalist id="genres">
                  {['Jazz', 'Rock', 'Pop', 'Clásica', 'Electrónica', 'Reggaeton', 'Cumbia', 'Internacional'].map(g => (
                    <option key={g} value={g} />
                  ))}
                </datalist>
              </div>

              <div className="admin__field">
                <label>Bitrate (kbps)</label>
                <select value={form.bitrate} onChange={e => setForm({ ...form, bitrate: parseInt(e.target.value) })}>
                  <option value={64}>64 kbps</option>
                  <option value={128}>128 kbps</option>
                  <option value={192}>192 kbps</option>
                  <option value={256}>256 kbps</option>
                  <option value={320}>320 kbps</option>
                </select>
              </div>
            </div>

            <div className="admin__field">
              <label>URL del Logo (opcional)</label>
              <input
                type="url"
                value={form.logo_url}
                onChange={e => setForm({ ...form, logo_url: e.target.value })}
                placeholder="https://ejemplo.com/logo.png"
              />
            </div>

            <div className="admin__actions">
              {editing && (
                <button type="button" onClick={handleCancel} className="admin__btn admin__btn--cancel">
                  Cancelar
                </button>
              )}
              <button type="submit" disabled={saving} className="admin__btn admin__btn--save">
                {saving ? 'Guardando...' : editing ? 'Actualizar' : 'Crear Estación'}
              </button>
            </div>
          </form>
        </section>

        {/* List */}
        <section className="admin__list-section">
          <h2 className="admin__section-title">📡 Estaciones ({stations.length})</h2>
          {loading ? (
            <p className="admin__loading">Cargando...</p>
          ) : stations.length === 0 ? (
            <p className="admin__empty">No hay estaciones aún</p>
          ) : (
            <div className="admin__list">
              {stations.map(s => (
                <div key={s.id} className={`admin__item ${editing === s.id ? 'editing' : ''}`}>
                  <div className="admin__item-info">
                    <div className="admin__item-name">{s.name}</div>
                    <div className="admin__item-url">{s.stream_url}</div>
                    {s.genre && <span className="admin__item-badge">{s.genre}</span>}
                  </div>
                  <div className="admin__item-actions">
                    <button onClick={() => handleEdit(s)} className="admin__action-btn admin__action-btn--edit">
                      ✏️
                    </button>
                    <button onClick={() => handleDelete(s.id)} className="admin__action-btn admin__action-btn--del">
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Tips */}
      <section className="admin__tips">
        <h3 className="admin__section-title">💡 ¿Cómo obtener URLs de stream?</h3>
        <div className="admin__tips-grid">
          <div className="admin__tip">
            <strong>Radio Paradise</strong>
            <code>https://stream.radioparadise.com/rock-320</code>
          </div>
          <div className="admin__tip">
            <strong>SHOUTcast / Icecast</strong>
            <code>http://tu-servidor:8000/stream</code>
          </div>
          <div className="admin__tip">
            <strong>Zeno.fm (tu propia radio)</strong>
            <code>Regístrate en zeno.fm → obtén URL de stream</code>
          </div>
          <div className="admin__tip">
            <strong>Radio.net / TuneIn</strong>
            <code>Busca el stream directo con herramientas de desarrollador</code>
          </div>
        </div>
      </section>
    </div>
  );
}
