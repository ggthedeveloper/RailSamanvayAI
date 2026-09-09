import React, { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Train, ShieldCheck, RefreshCw, KeyRound, Mail, User, Sparkles } from 'lucide-react';
import { API_URL, theme, cardStyle, inputStyle, buttonPrimary, apiError } from '../theme';

export function Login({ setToken }: { setToken: (token: string) => void }) {
  const [email, setEmail] = useState('debosmita12@gmail.com');
  const [password, setPassword] = useState('admin123');
  const [fullName, setFullName] = useState('Chief Controller');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const cleanEmail = email.trim().toLowerCase();
      if (isRegister) {
        await axios.post(`${API_URL}/auth/register`, {
          email: cleanEmail,
          password,
          full_name: fullName.trim() || 'Chief Controller'
        });
      }

      const form = new URLSearchParams({ username: cleanEmail, password });
      const { data } = await axios.post<{ access_token: string }>(
        `${API_URL}/auth/token`,
        form,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      if (!data.access_token) {
        throw new Error('No access token received.');
      }

      localStorage.setItem('token', data.access_token);
      setToken(data.access_token);
      navigate('/');
    } catch (err) {
      setError(apiError(err, 'Authentication failed. Please verify your credentials.'));
    } finally {
      setLoading(false);
    }
  }

  const quickFill = (userEmail: string, pass: string, name: string) => {
    setEmail(userEmail);
    setPassword(pass);
    setFullName(name);
    setError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      background: '#0f172a',
      padding: 20,
      overflow: 'hidden'
    }}>
      {/* High-resolution Railway Background Image Layer */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: "url('/train_landscape.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.32,
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 40%, rgba(15,23,42,0.6) 0%, rgba(15,23,42,0.95) 100%)',
        zIndex: 1
      }} />

      <div style={{
        ...cardStyle,
        position: 'relative',
        zIndex: 2,
        width: '100%',
        maxWidth: 460,
        padding: '36px 32px',
        background: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `1px solid rgba(255, 255, 255, 0.8)`,
        boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
      }}>
        {/* Logo & Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: '#ffffff',
            boxShadow: '0 4px 18px rgba(37,99,235,0.2), 0 1px 3px rgba(0,0,0,0.08)',
            border: '2px solid #dbeafe',
            padding: 3,
            margin: '0 auto 14px auto'
          }}>
            <Train size={38} color={theme.blue} strokeWidth={1.8} aria-label="Railway" />
          </div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: theme.text, letterSpacing: '-0.02em' }}>
            RailSamanvayAI
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: 12, color: theme.blue, fontWeight: 700, letterSpacing: '0.06em' }}>
            AUTOMATIC RAILWAY BLOCK PLANNING SYSTEM
          </p>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            marginTop: 10,
            padding: '4px 10px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 20,
            fontSize: 11,
            color: theme.green,
            fontWeight: 600
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: theme.green, display: 'inline-block' }} />
            CENTRAL OPERATIONS CONTROL PORTAL
          </div>
        </div>

        {/* Quick Fill Preset Buttons */}
        <div style={{
          background: theme.bg,
          border: `1px solid ${theme.border}`,
          borderRadius: 8,
          padding: 10,
          marginBottom: 18,
          display: 'flex',
          flexDirection: 'column',
          gap: 6
        }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: theme.textDim, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Quick-Fill Demo Credentials
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={() => quickFill('debosmita12@gmail.com', 'admin123', 'Chief Controller')}
              style={{
                flex: 1,
                padding: '6px 8px',
                background: 'rgba(56, 189, 248, 0.1)',
                border: `1px solid ${theme.cyan}44`,
                borderRadius: 6,
                color: theme.cyan,
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5
              }}
            >
              <Sparkles size={12} />
              Admin (Chief Controller)
            </button>
            <button
              type="button"
              onClick={() => quickFill('shashwat75@gmail.com', '123456', 'Shashwat Sahu')}
              style={{
                flex: 1,
                padding: '6px 8px',
                background: 'rgba(167, 139, 250, 0.1)',
                border: `1px solid ${theme.purple}44`,
                borderRadius: 6,
                color: theme.purple,
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5
              }}
            >
              <User size={12} />
              Section Planner
            </button>
          </div>
        </div>

        {error && (
          <div style={{
            padding: 12,
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: 8,
            color: '#fca5a5',
            fontSize: 12,
            marginBottom: 16
          }}>
            {error}
          </div>
        )}

        <form onSubmit={submit} style={{ display: 'grid', gap: 14 }}>
          {isRegister && (
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: theme.textMuted, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase' }}>
                <User size={13} color={theme.cyan} />
                Full Name & Designation
              </label>
              <input
                style={inputStyle}
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. Chief Controller (Operating)"
                required
              />
            </div>
          )}

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: theme.textMuted, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase' }}>
              <Mail size={13} color={theme.cyan} />
              Railway Controller Email
            </label>
            <input
              style={inputStyle}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="debosmita12@gmail.com"
              required
            />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: theme.textMuted, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase' }}>
              <KeyRound size={13} color={theme.cyan} />
              Access Key / Password
            </label>
            <input
              style={inputStyle}
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            style={{ ...buttonPrimary, width: '100%', marginTop: 8 }}
            disabled={loading}
          >
            {loading ? <RefreshCw size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
            {loading ? 'Authenticating…' : isRegister ? 'Register Controller Account' : 'Sign In to Operations Console'}
          </button>
        </form>

        <div style={{ marginTop: 18, textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            style={{ background: 'none', border: 0, color: theme.cyan, fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isRegister ? 'Already registered? Sign in' : 'Create new Controller / Planner profile'}
          </button>
        </div>

        <div style={{ marginTop: 22, paddingTop: 14, borderTop: `1px solid ${theme.border}`, fontSize: 11, color: theme.textDim, textAlign: 'center' }}>
          Ministry of Railways · Problem ID: SIH26027
        </div>
      </div>
    </div>
  );
}
