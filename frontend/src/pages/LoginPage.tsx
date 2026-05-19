import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import './LoginPage.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const { login, isLoading, error, isAuthenticated, clearError } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/admin');
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await login(username, password);
    if (ok) navigate('/admin');
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">
          <span>📻</span>
        </div>

        <h1 className="login-title">RADIO<span className="text-accent">ADMIN</span></h1>
        <p className="login-subtitle">Panel de administración</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label>Usuario</label>
            <input
              type="text"
              value={username}
              onChange={e => { setUsername(e.target.value); clearError(); }}
              placeholder="admin"
              autoComplete="username"
              autoFocus
              disabled={isLoading}
            />
          </div>

          <div className="login-field">
            <label>Contraseña</label>
            <div className="login-pass-wrapper">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); clearError(); }}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="login-toggle-pass"
                onClick={() => setShowPass(v => !v)}
                tabIndex={-1}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <div className="login-error">
              ✗ {error}
            </div>
          )}

          <button type="submit" className="login-btn" disabled={isLoading || !username || !password}>
            {isLoading ? (
              <><span className="login-spinner" /> Verificando...</>
            ) : (
              'Ingresar'
            )}
          </button>
        </form>

        <a href="/" className="login-back">← Volver a la radio</a>
      </div>
    </div>
  );
}
