import React, { FormEvent, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Train, Shield, AlertTriangle, RefreshCw,
  Mail, KeyRound, User, ArrowLeft, Eye, EyeOff,
  ChevronDown, Building2, UserCheck, Target
} from 'lucide-react';
import { API_URL, apiError } from '../theme';

type RoleType = 'planner' | 'controller';

export const RAILWAY_DEPARTMENTS = [
  { value: 'Engineering', label: 'Engineering' },
  { value: 'S&T', label: 'S&T' },
  { value: 'Electrical / TRD', label: 'Electrical / TRD' }
];

interface RegisterProps {
  setToken: (token: string) => void;
}

export function Register({ setToken }: RegisterProps) {
  const navigate = useNavigate();

  // Role Selection State (Default to Section Planner)
  const [selectedRole, setSelectedRole] = useState<RoleType>('planner');

  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('');
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

    if (selectedRole === 'planner' && !department) {
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
      if (selectedRole === 'planner' && department) {
        localStorage.setItem('user_department', department);
      } else {
        localStorage.removeItem('user_department');
      }
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
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      color: '#0f172a',
      overflowX: 'hidden'
    }}>
      {/* ------------------------------------------------------------------ */}
      {/* TOP HEADER                                                         */}
      {/* ------------------------------------------------------------------ */}
      <header style={{
        position: 'relative',
        zIndex: 10,
        padding: '16px 36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        background: 'rgba(7, 20, 42, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: '#2563eb',
            boxShadow: '0 2px 10px rgba(37, 99, 235, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Train size={22} color="#ffffff" strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#93c5fd', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              INDIAN RAILWAYS
            </div>
            <div style={{ fontSize: 19, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              RailSamanvayAI
            </div>
          </div>
        </div>

        <Link
          to="/login"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 18px',
            borderRadius: 9999,
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.22)',
            color: '#ffffff',
            fontSize: 13,
            fontWeight: 600,
            textDecoration: 'none',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
          }}
        >
          <ArrowLeft size={14} />
          Back to Login
        </Link>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* MAIN SINGLE UNIFIED DARK GLASS CONTAINER                           */}
      {/* ------------------------------------------------------------------ */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '36px 24px',
        boxSizing: 'border-box'
      }}>
        <div className="auth-unified-container">
          <div className="auth-unified-grid">
            {/* LEFT COLUMN: BRANDING, SYSTEM HIGHLIGHTS & CREDITS */}
            <div style={{ color: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                {/* Government of India Insignia Tag */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '5px 14px',
                  borderRadius: 9999,
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                  border: '1px solid rgba(255, 255, 255, 0.20)',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: '#ffffff',
                  marginBottom: 16
                }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 8px #38bdf8' }} />
                  Government of India • Ministry of Railways
                </div>

                <div style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: '#38bdf8',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: 6
                }}>
                  INDIAN RAILWAYS
                </div>

                <h1 style={{
                  fontSize: 'clamp(32px, 3.8vw, 44px)',
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1,
                  margin: '0 0 10px',
                  color: '#ffffff'
                }}>
                  RailSamanvayAI
                </h1>

                <p style={{
                  fontSize: 15,
                  lineHeight: 1.5,
                  color: '#cbd5e1',
                  margin: '0 0 24px',
                  maxWidth: 490
                }}>
                  AI-Powered Automatic Block Planning for Railway Maintenance
                </p>

                {/* 3 Core Highlights (Dark Translucent Feature Cards) */}
                <div style={{ display: 'grid', gap: 12, maxWidth: 520, marginBottom: 24 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    background: 'rgba(7, 20, 42, 0.70)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    padding: '12px 16px',
                    borderRadius: 14,
                    border: '1px solid rgba(255, 255, 255, 0.14)'
                  }}>
                    <div style={{
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      background: '#1d4ed8',
                      boxShadow: '0 4px 12px rgba(29, 78, 216, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Target size={22} color="#ffffff" strokeWidth={2.2} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>
                        Precision Block Allocation
                      </div>
                      <div style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.45, marginTop: 2 }}>
                        Automated conflict-free maintenance windows harmonized across Operating, Engineering, S&amp;T, and TRD divisions.
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    background: 'rgba(7, 20, 42, 0.70)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    padding: '12px 16px',
                    borderRadius: 14,
                    border: '1px solid rgba(255, 255, 255, 0.14)'
                  }}>
                    <div style={{
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      background: '#1d4ed8',
                      boxShadow: '0 4px 12px rgba(29, 78, 216, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Shield size={22} color="#ffffff" strokeWidth={2.2} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>
                        Corridor Safety &amp; Punctuality
                      </div>
                      <div style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.45, marginTop: 2 }}>
                        Constraint-optimized machine scheduling preserving trunk passenger &amp; freight timetables with live conflict telemetry.
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    background: 'rgba(7, 20, 42, 0.70)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    padding: '12px 16px',
                    borderRadius: 14,
                    border: '1px solid rgba(255, 255, 255, 0.14)'
                  }}>
                    <div style={{
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      background: '#1d4ed8',
                      boxShadow: '0 4px 12px rgba(29, 78, 216, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <UserCheck size={22} color="#ffffff" strokeWidth={2.2} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>
                        Unified Digital Authorization
                      </div>
                      <div style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.45, marginTop: 2 }}>
                        Role-specific possession sign-offs for Chief Controllers and Section Planners under Indian Railways General Rules.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Attribution & SIH Details */}
              <div style={{
                fontSize: 12,
                color: '#cbd5e1',
                paddingTop: 14,
                borderTop: '1px solid rgba(255, 255, 255, 0.16)'
              }}>
                Developed by <strong style={{ color: '#ffffff' }}>The Steel Bytes 800</strong> • Smart India Hackathon 2026 • <strong style={{ color: '#38bdf8' }}>SIH26027</strong>
              </div>
            </div>

            {/* RIGHT COLUMN: WHITE INTEGRATED REGISTRATION CARD */}
            <div style={{
              background: '#ffffff',
              borderRadius: 20,
              padding: '28px 26px',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.20)',
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box',
              width: '100%',
              alignSelf: 'stretch'
            }}>
              {/* Card Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                <div style={{
                  width: 42,
                  height: 42,
                  borderRadius: 10,
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Train size={24} color="#2563eb" />
                </div>
                <div>
                  <h2 style={{
                    margin: 0,
                    fontSize: 22,
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    color: '#0f172a'
                  }}>
                    Create Account
                  </h2>
                  <p style={{
                    margin: '2px 0 0',
                    fontSize: 12,
                    color: '#64748b',
                    fontWeight: 500
                  }}>
                    Register for Central Operations Console Access
                  </p>
                </div>
              </div>

              {/* Role Selection */}
              <div style={{ marginBottom: 12 }}>
                <div style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#475569',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: 6
                }}>
                  ACCOUNT ROLE
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 6,
                  background: '#f1f5f9',
                  padding: 4,
                  borderRadius: 10,
                  border: '1px solid #e2e8f0'
                }}>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('planner')}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: 0,
                      background: selectedRole === 'planner' ? '#2563eb' : 'transparent',
                      color: selectedRole === 'planner' ? '#ffffff' : '#475569',
                      boxShadow: selectedRole === 'planner' ? '0 2px 6px rgba(37, 99, 235, 0.35)' : 'none',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6
                    }}
                  >
                    <UserCheck size={14} />
                    Section Planner
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('controller');
                      setDepartment('');
                    }}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: 0,
                      background: selectedRole === 'controller' ? '#2563eb' : 'transparent',
                      color: selectedRole === 'controller' ? '#ffffff' : '#475569',
                      boxShadow: selectedRole === 'controller' ? '0 2px 6px rgba(37, 99, 235, 0.35)' : 'none',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6
                    }}
                  >
                    <Shield size={14} />
                    Chief Controller
                  </button>
                </div>
              </div>

              {/* Error Banner */}
              {error && (
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  padding: '10px 12px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: 8,
                  color: '#dc2626',
                  fontSize: 12,
                  lineHeight: 1.45,
                  marginBottom: 12
                }}>
                  <AlertTriangle size={15} color="#dc2626" style={{ flexShrink: 0, marginTop: 1 }} />
                  <span>{error}</span>
                </div>
              )}

              {/* Registration Form */}
              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 11 }}>
                {/* Full Name */}
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
                    marginBottom: 5
                  }}>
                    <User size={13} color="#2563eb" />
                    Full Name &amp; Designation
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Rajesh Sharma, SSE / P-Way"
                    required
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '8px 12px',
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

                {/* Section Planner: Railway Department (ONLY 3 CHOICES) */}
                {selectedRole === 'planner' && (
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
                      marginBottom: 5
                    }}>
                      <Building2 size={13} color="#2563eb" />
                      Railway Department
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={department}
                        onChange={e => setDepartment(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          padding: '8px 36px 8px 12px',
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
                        <option value="" disabled style={{ color: '#94a3b8' }}>Select Department</option>
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
                )}

                {/* Email */}
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
                    marginBottom: 5
                  }}>
                    <Mail size={13} color="#2563eb" />
                    Railway Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="user@railway.gov.in"
                    required
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '8px 12px',
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

                {/* Password & Confirm Password */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
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
                      marginBottom: 5
                    }}>
                      <KeyRound size={13} color="#2563eb" />
                      Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        minLength={6}
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          padding: '8px 32px 8px 12px',
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
                          right: 8,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 0,
                          color: '#94a3b8',
                          cursor: 'pointer',
                          padding: 2,
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

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
                      marginBottom: 5
                    }}>
                      Confirm
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
                        padding: '8px 12px',
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
                    padding: '11px 16px',
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: 9,
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.40)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => {
                    if (!loading) e.currentTarget.style.background = '#1d4ed8';
                  }}
                  onMouseLeave={e => {
                    if (!loading) e.currentTarget.style.background = 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)';
                  }}
                >
                  {loading ? <RefreshCw size={16} className="animate-spin" /> : <Shield size={16} />}
                  {loading ? 'Registering Console Account…' : 'Complete Registration'}
                </button>
              </form>

              {/* Bottom Login Link */}
              <div style={{
                marginTop: 16,
                paddingTop: 12,
                borderTop: '1px solid #f1f5f9',
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
      </div>
    </div>
  );
}
