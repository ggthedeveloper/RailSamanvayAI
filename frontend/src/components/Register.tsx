import React, { FormEvent, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Train, Shield, CheckCircle2, AlertTriangle, RefreshCw,
  Mail, KeyRound, User, Lock, ArrowLeft, Eye, EyeOff,
  ChevronDown, Building2
} from 'lucide-react';
import { API_URL, apiError } from '../theme';

export const RAILWAY_DEPARTMENTS = [
  { value: 'engineering', label: 'Engineering / Permanent Way (P-Way)' },
  { value: 'trd', label: 'Traction Distribution (TRD)' },
  { value: 'snt', label: 'Signal & Telecom (S&T)' },
];

interface RegisterProps {
  setToken: (token: string) => void;
}

export function Register({ setToken }: RegisterProps) {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('engineering');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();

    if (!cleanName) {
      setError('Please provide your full name and railway designation.');
      return;
    }

    if (!department) {
      setError('Please select your railway department.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }

    setLoading(true);

    try {
      // 1. Call Register endpoint
      const registerRes = await axios.post<{ access_token: string; token_type: string }>(
        `${API_URL}/auth/register`,
        {
          email: cleanEmail,
          password,
          full_name: cleanName
        }
      );

      let token = registerRes.data?.access_token;

      // 2. Fallback to token endpoint if needed
      if (!token) {
        const form = new URLSearchParams({ username: cleanEmail, password });
        const tokenRes = await axios.post<{ access_token: string }>(
          `${API_URL}/auth/token`,
          form,
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        token = tokenRes.data.access_token;
      }

      if (!token) {
        throw new Error('Registration completed, but failed to retrieve session token.');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user_department', department);
      setToken(token);
      navigate('/overview');
    } catch (err) {
      setError(apiError(err, 'Failed to complete registration. Email may already be registered.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      background: '#0a1728',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      color: '#0f172a',
      overflowX: 'hidden'
    }}>
      {/* ------------------------------------------------------------------ */}
      {/* CLEAR HD INDIAN RAILWAYS PHOTOGRAPH (WAP-7 LOCOMOTIVE & INFRASTRUCTURE) */}
      {/* ------------------------------------------------------------------ */}
      <picture style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none'
      }}>
        <source srcSet="/indian_railway_hd.webp" type="image/webp" />
        <img
          src="/indian_railway_hd.jpg"
          alt="Indian Railways Locomotive & Platform Infrastructure"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 40%',
            display: 'block'
          }}
        />
      </picture>

      {/* Subtle Translucent Navy Overlay (0.48 - 0.58) preserving photograph visibility */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(90deg, rgba(7, 20, 40, 0.62) 0%, rgba(7, 20, 40, 0.50) 45%, rgba(7, 20, 40, 0.44) 100%)',
        zIndex: 1,
        pointerEvents: 'none'
      }} />

      {/* ------------------------------------------------------------------ */}
      {/* TOP HEADER */}
      {/* ------------------------------------------------------------------ */}
      <header style={{
        position: 'relative',
        zIndex: 10,
        padding: '18px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        background: 'rgba(7, 20, 40, 0.40)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: '#ffffff',
            boxShadow: '0 2px 10px rgba(37, 99, 235, 0.35)',
            border: '1.5px solid #dbeafe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Train size={24} color="#1d4ed8" strokeWidth={2} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#93c5fd', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              INDIAN RAILWAYS
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              RailSamanvayAI
            </div>
          </div>
        </div>

        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '7px 14px',
            borderRadius: 7,
            background: 'rgba(255, 255, 255, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.22)',
            color: '#f1f5f9',
            fontSize: 12,
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.22)';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
            e.currentTarget.style.color = '#f1f5f9';
          }}
        >
          <ArrowLeft size={14} />
          Back to Overview
        </Link>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* MAIN 2-COLUMN SECTION */}
      {/* ------------------------------------------------------------------ */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px 20px',
        boxSizing: 'border-box'
      }}>
        <div style={{
          width: '100%',
          maxWidth: 1120,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 48,
          alignItems: 'center'
        }}>
          {/* LEFT COLUMN: BRANDING & SYSTEM OVERVIEW */}
          <div style={{ color: '#ffffff', padding: '10px 4px' }}>
            {/* Government of India Insignia Tag */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '5px 12px',
              borderRadius: 20,
              background: 'rgba(255, 255, 255, 0.14)',
              border: '1px solid rgba(255, 255, 255, 0.24)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: '#bfdbfe',
              marginBottom: 16
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#38bdf8' }} />
              GOVERNMENT OF INDIA • MINISTRY OF RAILWAYS
            </div>

            <div style={{
              fontSize: 14,
              fontWeight: 700,
              color: '#93c5fd',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: 4
            }}>
              INDIAN RAILWAYS
            </div>

            <h1 style={{
              fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: 900,
              letterSpacing: '-0.025em',
              lineHeight: 1.15,
              margin: '0 0 14px',
              color: '#ffffff',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}>
              RailSamanvayAI
            </h1>

            <p style={{
              fontSize: 16,
              lineHeight: 1.55,
              color: '#e2e8f0',
              margin: '0 0 28px',
              maxWidth: 480,
              textShadow: '0 1px 4px rgba(0,0,0,0.25)'
            }}>
              AI-Powered Automatic Block Planning for Railway Maintenance
            </p>

            {/* 3 Core Highlights */}
            <div style={{ display: 'grid', gap: 16, maxWidth: 500, marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'rgba(37, 99, 235, 0.35)',
                  border: '1px solid rgba(147, 197, 253, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: 2
                }}>
                  <CheckCircle2 size={16} color="#93c5fd" />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc' }}>
                    Section Planner Workspace
                  </div>
                  <div style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.45, marginTop: 2 }}>
                    Submit and schedule track, bridge, S&amp;T, and overhead electrical maintenance tasks directly into the central optimization pipeline.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'rgba(37, 99, 235, 0.35)',
                  border: '1px solid rgba(147, 197, 253, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: 2
                }}>
                  <Shield size={16} color="#93c5fd" />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc' }}>
                    Automated Deconfliction
                  </div>
                  <div style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.45, marginTop: 2 }}>
                    OR-Tools CP-SAT engine verifies machine availability, gang assignments, and line capacity to prevent train operational delays.
                  </div>
                </div>
              </div>
            </div>

            {/* Team Attribution & SIH Details */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              paddingTop: 18,
              borderTop: '1px solid rgba(255, 255, 255, 0.16)',
              fontSize: 12,
              color: '#cbd5e1'
            }}>
              <div>
                Developed by <strong style={{ color: '#ffffff' }}>The Steel Bytes 800</strong>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
              <div>
                Smart India Hackathon 2026 • <strong style={{ color: '#38bdf8' }}>SIH26027</strong>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: REGISTRATION CARD */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.9)',
            borderRadius: 16,
            padding: '34px 30px',
            boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.38)',
            width: '100%',
            maxWidth: 480,
            justifySelf: 'center',
            boxSizing: 'border-box'
          }}>
            {/* Card Header */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <User size={20} color="#2563eb" />
                </div>
                <div>
                  <h2 style={{
                    margin: 0,
                    fontSize: 22,
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    color: '#0f172a'
                  }}>
                    Create Your Account
                  </h2>
                  <p style={{
                    margin: '2px 0 0',
                    fontSize: 12,
                    color: '#64748b',
                    fontWeight: 500
                  }}>
                    Section Maintenance Planning Console Access
                  </p>
                </div>
              </div>
            </div>

            {/* Restricted Role Indicator */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 10,
              padding: '12px 14px',
              marginBottom: 16
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 6
              }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Register As
                </span>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '3px 8px',
                  borderRadius: 6,
                  background: '#e0f2fe',
                  color: '#0369a1',
                  fontSize: 11,
                  fontWeight: 700
                }}>
                  <Lock size={11} />
                  Section Planner
                </span>
              </div>
              <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.4 }}>
                Chief Controller and System Admin accounts are restricted and provisioned exclusively by Central Operations Administration.
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                padding: '11px 13px',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 8,
                color: '#dc2626',
                fontSize: 12,
                lineHeight: 1.45,
                marginBottom: 16
              }}>
                <AlertTriangle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: 1 }} />
                <span>{error}</span>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 14 }}>
              {/* Full Name & Designation */}
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#475569',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: 6
                }}>
                  <User size={13} color="#2563eb" />
                  Full Name &amp; Designation
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Gaurav Gautam (SSE / P-Way)"
                  required
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '10px 12px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: 8,
                    color: '#0f172a',
                    fontSize: 13,
                    outline: 'none',
                    transition: 'border-color 0.15s ease'
                  }}
                  onFocus={e => (e.target.style.borderColor = '#2563eb')}
                  onBlur={e => (e.target.style.borderColor = '#cbd5e1')}
                />
              </div>

              {/* Railway Department Dropdown */}
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#475569',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: 6
                }}>
                  <Building2 size={13} color="#2563eb" />
                  Railway Department
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={department}
                    onChange={e => {
                      setDepartment(e.target.value);
                      if (error === 'Please select your railway department.') setError('');
                    }}
                    required
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '10px 36px 10px 12px',
                      background: '#ffffff',
                      border: error && !department ? '1.5px solid #dc2626' : '1px solid #cbd5e1',
                      borderRadius: 8,
                      color: department ? '#0f172a' : '#64748b',
                      fontSize: 13,
                      fontWeight: department ? 600 : 400,
                      outline: 'none',
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      cursor: 'pointer',
                      transition: 'border-color 0.15s ease'
                    }}
                    onFocus={e => (e.target.style.borderColor = '#2563eb')}
                    onBlur={e => (e.target.style.borderColor = error && !department ? '#dc2626' : '#cbd5e1')}
                  >
                    <option value="" disabled style={{ color: '#94a3b8' }}>Select your department</option>
                    {RAILWAY_DEPARTMENTS.map(d => (
                      <option key={d.value} value={d.value} style={{ color: '#0f172a', fontWeight: 500 }}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    color="#64748b"
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Official Email */}
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#475569',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: 6
                }}>
                  <Mail size={13} color="#2563eb" />
                  Official Railway Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="planner@railway.gov.in"
                  required
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '10px 12px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: 8,
                    color: '#0f172a',
                    fontSize: 13,
                    outline: 'none',
                    transition: 'border-color 0.15s ease'
                  }}
                  onFocus={e => (e.target.style.borderColor = '#2563eb')}
                  onBlur={e => (e.target.style.borderColor = '#cbd5e1')}
                />
              </div>

              {/* Password */}
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#475569',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: 6
                }}>
                  <KeyRound size={13} color="#2563eb" />
                  Password (min 6 characters)
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '10px 38px 10px 12px',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: 8,
                      color: '#0f172a',
                      fontSize: 13,
                      outline: 'none',
                      transition: 'border-color 0.15s ease'
                    }}
                    onFocus={e => (e.target.style.borderColor = '#2563eb')}
                    onBlur={e => (e.target.style.borderColor = '#cbd5e1')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: 10,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 0,
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: 4,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#475569',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: 6
                }}>
                  <KeyRound size={13} color="#2563eb" />
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '10px 12px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: 8,
                    color: '#0f172a',
                    fontSize: 13,
                    outline: 'none',
                    transition: 'border-color 0.15s ease'
                  }}
                  onFocus={e => (e.target.style.borderColor = '#2563eb')}
                  onBlur={e => (e.target.style.borderColor = '#cbd5e1')}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '12px 18px',
                  background: '#2563eb',
                  color: '#ffffff',
                  border: '1px solid #1d4ed8',
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 2px 6px rgba(37, 99, 235, 0.35)',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={e => {
                  if (!loading) e.currentTarget.style.background = '#1d4ed8';
                }}
                onMouseLeave={e => {
                  if (!loading) e.currentTarget.style.background = '#2563eb';
                }}
              >
                {loading ? <RefreshCw size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                {loading ? 'Creating Account…' : 'Create Account'}
              </button>
            </form>

            {/* Bottom Links */}
            <div style={{
              marginTop: 20,
              paddingTop: 16,
              borderTop: '1px solid #e2e8f0',
              textAlign: 'center',
              fontSize: 13,
              color: '#475569'
            }}>
              Already have an account?{' '}
              <Link
                to="/login"
                style={{
                  color: '#2563eb',
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
                onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
              >
                Sign In →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* MINIMAL FOOTER */}
      {/* ------------------------------------------------------------------ */}
      <footer style={{
        position: 'relative',
        zIndex: 10,
        padding: '16px 24px',
        textAlign: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
        background: 'rgba(7, 20, 40, 0.60)',
        fontSize: 12,
        color: '#cbd5e1'
      }}>
        RailSamanvayAI • The Steel Bytes 800 • SIH26027
      </footer>
    </div>
  );
}
