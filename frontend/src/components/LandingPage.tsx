import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Train,
  Activity,
  Sliders,
  CalendarCheck,
  Layers,
  Radio,
  Zap,
  ShieldCheck,
  UserCheck,
  Menu,
  X
} from 'lucide-react';

interface LandingPageProps {
  setToken?: (token: string) => void;
}

export function LandingPage({ setToken }: LandingPageProps = {}) {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check existing authenticated session
  const hasToken = Boolean(localStorage.getItem('token'));

  const handleLoginClick = () => {
    if (hasToken) {
      navigate('/overview');
    } else {
      navigate('/login');
    }
  };

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#070c18',
      color: '#0f172a',
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      overflowX: 'hidden'
    }}>
      {/* ------------------------------------------------------------------ */}
      {/* 3. NAVBAR */}
      {/* ------------------------------------------------------------------ */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 68,
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 1000,
        transition: 'all 0.25s ease',
        background: isScrolled
          ? 'rgba(11, 20, 38, 0.94)'
          : 'rgba(11, 20, 38, 0.5)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid transparent'
      }}>
        {/* Left: Brand Identity */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          {/* Blue rounded icon */}
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(37, 99, 235, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <Train size={20} color="#ffffff" strokeWidth={2.2} />
          </div>
          <span style={{
            fontSize: 19,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#ffffff'
          }}>
            RailSamanvayAI
          </span>
        </div>

        {/* Right: Desktop Navigation — ONLY ONE action button: Login → */}
        <nav style={{
          display: 'none',
          alignItems: 'center',
          gap: 24
        }} className="desktop-nav">
          <button
            onClick={() => scrollTo('smarter-planning')}
            style={navLinkStyle}
          >
            About
          </button>
          <button
            onClick={() => scrollTo('users')}
            style={navLinkStyle}
          >
            Users
          </button>
          <button
            onClick={() => scrollTo('how-it-works')}
            style={navLinkStyle}
          >
            How It Works
          </button>
          <button
            onClick={() => scrollTo('team')}
            style={navLinkStyle}
          >
            Team
          </button>

          {/* Only Login button in top-right */}
          <button
            onClick={handleLoginClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 18px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              background: '#2563eb',
              color: '#ffffff',
              border: '1px solid #3b82f6',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.4)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#1d4ed8';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#2563eb';
            }}
          >
            Login →
          </button>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 0,
            color: '#ffffff',
            cursor: 'pointer',
            padding: 6
          }}
          className="mobile-nav-toggle"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 68,
          left: 0,
          right: 0,
          background: 'rgba(11, 20, 38, 0.98)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          zIndex: 999
        }}>
          <button onClick={() => scrollTo('smarter-planning')} style={mobileNavLinkStyle}>About</button>
          <button onClick={() => scrollTo('users')} style={mobileNavLinkStyle}>Users</button>
          <button onClick={() => scrollTo('how-it-works')} style={mobileNavLinkStyle}>How It Works</button>
          <button onClick={() => scrollTo('team')} style={mobileNavLinkStyle}>Team</button>
          <button
            onClick={handleLoginClick}
            style={{
              padding: '12px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 700,
              background: '#2563eb',
              color: '#ffffff',
              border: 0,
              cursor: 'pointer',
              textAlign: 'center'
            }}
          >
            Login →
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 4. HERO SECTION */}
      {/* ------------------------------------------------------------------ */}
      <section style={{
        position: 'relative',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        padding: '110px 48px 60px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        background: '#080f1e'
      }}>
        {/* Full-width High-Resolution (1920x1080) Indian Railways photographic background */}
        <picture style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0
        }}>
          <source srcSet="/indian_railway_hd.webp" type="image/webp" />
          <img
            src="/indian_railway_hd.jpg"
            alt="Indian Railways WAP-7 Locomotive on Track"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'right center',
              display: 'block'
            }}
          />
        </picture>

        {/* Professional translucent gradient overlay:
            Slightly stronger navy gradient on the left behind the text,
            while leaving the locomotive, tracks, and platform razor-sharp and clearly visible on the right */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(8, 15, 30, 0.92) 0%, rgba(8, 15, 30, 0.82) 38%, rgba(8, 15, 30, 0.35) 68%, rgba(8, 15, 30, 0.15) 100%)',
          zIndex: 1
        }} />

        {/* Hero Content positioned toward LEFT/CENTER-LEFT */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 680,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          textAlign: 'left'
        }}>
          {/* Small text: INDIAN RAILWAYS with tricolour accent line */}
          <div style={{ marginBottom: 14 }}>
            <span style={{
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#e2e8f0',
              display: 'block',
              marginBottom: 6
            }}>
              INDIAN RAILWAYS
            </span>
            {/* Subtle Indian Tricolour line */}
            <div style={{
              width: 65,
              height: 3,
              borderRadius: 2,
              background: 'linear-gradient(90deg, #ff9933 0%, #ff9933 33%, #ffffff 33%, #ffffff 66%, #138808 66%, #138808 100%)'
            }} />
          </div>

          {/* Main Large Heading */}
          <h1 style={{
            fontSize: 'clamp(44px, 5.5vw, 68px)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            lineHeight: 1.08,
            color: '#ffffff',
            margin: '0 0 16px',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
          }}>
            RailSamanvayAI
          </h1>

          {/* Subtitle */}
          <h2 style={{
            fontSize: 'clamp(20px, 2.8vw, 26px)',
            fontWeight: 700,
            lineHeight: 1.3,
            color: '#f8fafc',
            margin: '0 0 14px',
            letterSpacing: '-0.015em'
          }}>
            AI-Powered Automatic Block Planning
            <br />
            for Railway Maintenance
          </h2>

          {/* Supporting sentence */}
          <p style={{
            fontSize: 'clamp(14px, 1.8vw, 16px)',
            fontWeight: 400,
            lineHeight: 1.55,
            color: '#cbd5e1',
            margin: '0 0 28px',
            maxWidth: 580
          }}>
            Smarter maintenance planning for safer and more efficient railway operations.
          </p>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            flexWrap: 'wrap',
            marginBottom: 28
          }}>
            <button
              onClick={handleLoginClick}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '13px 28px',
                fontSize: 15,
                fontWeight: 800,
                color: '#ffffff',
                background: '#2563eb',
                border: '1px solid #3b82f6',
                borderRadius: 8,
                cursor: 'pointer',
                boxShadow: '0 4px 18px rgba(37, 99, 235, 0.45)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#1d4ed8';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#2563eb';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Enter Platform →
            </button>

            <button
              onClick={() => scrollTo('how-it-works')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '13px 22px',
                fontSize: 14,
                fontWeight: 700,
                color: '#ffffff',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                borderRadius: 8,
                cursor: 'pointer',
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
              Explore How It Works ↓
            </button>
          </div>

          {/* Attribution Box */}
          <div style={{
            borderLeft: '2px solid rgba(255, 255, 255, 0.35)',
            paddingLeft: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 3
          }}>
            <div style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#e2e8f0'
            }}>
              Developed by <strong style={{ color: '#38bdf8', fontWeight: 800 }}>The Steel Bytes 800</strong>
            </div>
            <div style={{
              fontSize: 12,
              color: '#94a3b8'
            }}>
              Smart India Hackathon 2026 • SIH26027
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 6. SECTION: SMARTER RAILWAY MAINTENANCE PLANNING */}
      {/* ------------------------------------------------------------------ */}
      <section id="smarter-planning" style={{
        padding: '70px 32px 80px',
        position: 'relative',
        background: 'linear-gradient(180deg, #f8fafc 0%, #edf3f8 100%)',
        borderTop: '1px solid #e2e8f0',
        borderBottom: '1px solid #e2e8f0'
      }}>
        {/* Subtle translucent railway tracks backdrop */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: "url('/train_landscape.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.05,
          pointerEvents: 'none'
        }} />

        <div style={{
          position: 'relative',
          maxWidth: 1140,
          margin: '0 auto'
        }}>
          {/* Section Heading & Subtitle */}
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <h2 style={{
              fontSize: 'clamp(28px, 3.8vw, 36px)',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              color: '#0f172a',
              margin: '0 0 10px'
            }}>
              Smarter Railway Maintenance Planning
            </h2>

            {/* Subtle saffron & blue underline accent bar */}
            <div style={{
              width: 54,
              height: 3,
              borderRadius: 2,
              background: 'linear-gradient(90deg, #ff9933 0%, #ff9933 50%, #2563eb 50%, #2563eb 100%)',
              margin: '0 auto 16px'
            }} />

            <p style={{
              fontSize: 15,
              lineHeight: 1.6,
              color: '#475569',
              maxWidth: 720,
              margin: '0 auto'
            }}>
              Identify risks, prioritise maintenance needs and generate feasible block plans to ensure safer and more reliable railway operations.
            </p>
          </div>

          {/* Three Feature Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
            gap: 24
          }}>
            {/* Card 1: PREDICT */}
            <div style={featureCardStyle}>
              {/* Soft pink/red icon box */}
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 10,
                background: 'rgba(239, 68, 68, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#dc2626',
                marginBottom: 16
              }}>
                <Activity size={24} strokeWidth={2.4} />
              </div>

              <div style={{
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#dc2626',
                marginBottom: 6
              }}>
                PREDICT
              </div>

              <h3 style={{
                fontSize: 21,
                fontWeight: 800,
                color: '#0f172a',
                margin: '0 0 10px',
                letterSpacing: '-0.015em'
              }}>
                Asset Risk
              </h3>

              <p style={{
                fontSize: 14,
                lineHeight: 1.6,
                color: '#475569',
                margin: 0
              }}>
                Identify assets requiring attention using risk-based analysis.
              </p>
            </div>

            {/* Card 2: PRIORITISE */}
            <div style={featureCardStyle}>
              {/* Soft amber icon box */}
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 10,
                background: 'rgba(245, 158, 11, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#d97706',
                marginBottom: 16
              }}>
                <Sliders size={24} strokeWidth={2.4} />
              </div>

              <div style={{
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#d97706',
                marginBottom: 6
              }}>
                PRIORITISE
              </div>

              <h3 style={{
                fontSize: 21,
                fontWeight: 800,
                color: '#0f172a',
                margin: '0 0 10px',
                letterSpacing: '-0.015em'
              }}>
                Maintenance Needs
              </h3>

              <p style={{
                fontSize: 14,
                lineHeight: 1.6,
                color: '#475569',
                margin: 0
              }}>
                Bring urgent and high-risk maintenance requirements to the forefront.
              </p>
            </div>

            {/* Card 3: OPTIMISE */}
            <div style={featureCardStyle}>
              {/* Soft green icon box */}
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 10,
                background: 'rgba(16, 185, 129, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#059669',
                marginBottom: 16
              }}>
                <CalendarCheck size={24} strokeWidth={2.4} />
              </div>

              <div style={{
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#059669',
                marginBottom: 6
              }}>
                OPTIMISE
              </div>

              <h3 style={{
                fontSize: 21,
                fontWeight: 800,
                color: '#0f172a',
                margin: '0 0 10px',
                letterSpacing: '-0.015em'
              }}>
                Maintenance Blocks
              </h3>

              <p style={{
                fontSize: 14,
                lineHeight: 1.6,
                color: '#475569',
                margin: 0
              }}>
                Generate feasible maintenance block plans under operational constraints.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 7. SECTION: WHO USES RAILSAMANVAYAI */}
      {/* ------------------------------------------------------------------ */}
      <section id="users" style={{
        padding: '80px 32px',
        position: 'relative',
        background: 'linear-gradient(180deg, #edf3f8 0%, #e2eaf2 100%)',
        borderBottom: '1px solid #cbd5e1'
      }}>
        {/* Subtle infrastructure depth */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: "url('/train_landscape.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.04,
          pointerEvents: 'none'
        }} />

        <div style={{
          position: 'relative',
          maxWidth: 1140,
          margin: '0 auto'
        }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <h2 style={{
              fontSize: 'clamp(28px, 3.8vw, 36px)',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              color: '#0f172a',
              margin: '0 0 10px',
              textTransform: 'uppercase'
            }}>
              WHO USES RAILSAMANVAYAI?
            </h2>

            <div style={{
              width: 50,
              height: 3,
              borderRadius: 2,
              background: '#2563eb',
              margin: '0 auto 16px'
            }} />

            <p style={{
              fontSize: 15,
              lineHeight: 1.6,
              color: '#475569',
              maxWidth: 680,
              margin: '0 auto'
            }}>
              Designed to support the teams involved in railway maintenance and block planning.
            </p>
          </div>

          {/* 4 Professional User Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 22
          }}>
            {/* User 1: OPERATING / TRAFFIC (Primary User) */}
            <div style={{
              ...userCardStyle,
              border: '2px solid #2563eb',
              background: 'rgba(255, 255, 255, 0.96)',
              boxShadow: '0 6px 24px rgba(37, 99, 235, 0.12)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16
              }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: 'rgba(37, 99, 235, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2563eb'
                }}>
                  <Train size={22} strokeWidth={2.2} />
                </div>
                <span style={{
                  padding: '3px 10px',
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 800,
                  background: '#2563eb',
                  color: '#ffffff',
                  letterSpacing: '0.04em'
                }}>
                  PRIMARY USER
                </span>
              </div>

              <h3 style={{
                fontSize: 18,
                fontWeight: 800,
                color: '#0f172a',
                margin: '0 0 6px',
                letterSpacing: '-0.01em'
              }}>
                OPERATING / TRAFFIC
              </h3>

              <div style={{
                fontSize: 12,
                fontWeight: 700,
                color: '#2563eb',
                marginBottom: 12,
                lineHeight: 1.4
              }}>
                Chief Controller · Deputy Chief Controller · Section Controller
              </div>

              <p style={{
                fontSize: 13,
                lineHeight: 1.6,
                color: '#475569',
                margin: 0
              }}>
                Reviews recommended maintenance blocks, considers operational impact and reviews the final plan.
              </p>
            </div>

            {/* User 2: ENGINEERING */}
            <div style={userCardStyle}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16
              }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: 'rgba(15, 23, 42, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0f172a'
                }}>
                  <Layers size={22} strokeWidth={2} />
                </div>
                <span style={{
                  padding: '3px 9px',
                  borderRadius: 20,
                  fontSize: 10,
                  fontWeight: 700,
                  background: '#f1f5f9',
                  color: '#475569',
                  border: '1px solid #cbd5e1'
                }}>
                  STAKEHOLDER
                </span>
              </div>

              <h3 style={{
                fontSize: 18,
                fontWeight: 800,
                color: '#0f172a',
                margin: '0 0 6px'
              }}>
                ENGINEERING
              </h3>

              <div style={{
                fontSize: 12,
                fontWeight: 700,
                color: '#64748b',
                marginBottom: 12
              }}>
                Engineering Maintenance Teams
              </div>

              <p style={{
                fontSize: 13,
                lineHeight: 1.6,
                color: '#475569',
                margin: 0
              }}>
                Provides track and infrastructure maintenance requirements for planning.
              </p>
            </div>

            {/* User 3: S&T */}
            <div style={userCardStyle}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16
              }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: 'rgba(2, 132, 199, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0284c7'
                }}>
                  <Radio size={22} strokeWidth={2} />
                </div>
                <span style={{
                  padding: '3px 9px',
                  borderRadius: 20,
                  fontSize: 10,
                  fontWeight: 700,
                  background: '#f1f5f9',
                  color: '#475569',
                  border: '1px solid #cbd5e1'
                }}>
                  STAKEHOLDER
                </span>
              </div>

              <h3 style={{
                fontSize: 18,
                fontWeight: 800,
                color: '#0f172a',
                margin: '0 0 6px'
              }}>
                S&T
              </h3>

              <div style={{
                fontSize: 12,
                fontWeight: 700,
                color: '#0284c7',
                marginBottom: 12
              }}>
                Signalling & Telecommunication Teams
              </div>

              <p style={{
                fontSize: 13,
                lineHeight: 1.6,
                color: '#475569',
                margin: 0
              }}>
                Provides signalling and telecommunications maintenance requirements.
              </p>
            </div>

            {/* User 4: ELECTRICAL / TRD */}
            <div style={userCardStyle}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16
              }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: 'rgba(217, 119, 6, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#d97706'
                }}>
                  <Zap size={22} strokeWidth={2} />
                </div>
                <span style={{
                  padding: '3px 9px',
                  borderRadius: 20,
                  fontSize: 10,
                  fontWeight: 700,
                  background: '#f1f5f9',
                  color: '#475569',
                  border: '1px solid #cbd5e1'
                }}>
                  STAKEHOLDER
                </span>
              </div>

              <h3 style={{
                fontSize: 18,
                fontWeight: 800,
                color: '#0f172a',
                margin: '0 0 6px'
              }}>
                ELECTRICAL / TRD
              </h3>

              <div style={{
                fontSize: 12,
                fontWeight: 700,
                color: '#d97706',
                marginBottom: 12
              }}>
                TRD / OHE Maintenance Teams
              </div>

              <p style={{
                fontSize: 13,
                lineHeight: 1.6,
                color: '#475569',
                margin: 0
              }}>
                Provides traction and electrical maintenance requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 8. SECTION: HOW IT WORKS */}
      {/* ------------------------------------------------------------------ */}
      <section id="how-it-works" style={{
        padding: '80px 32px',
        position: 'relative',
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: 54 }}>
            <h2 style={{
              fontSize: 'clamp(28px, 3.8vw, 36px)',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              color: '#0f172a',
              margin: '0 0 10px'
            }}>
              How RailSamanvayAI Works
            </h2>

            <div style={{
              width: 50,
              height: 3,
              borderRadius: 2,
              background: '#2563eb',
              margin: '0 auto 16px'
            }} />

            <p style={{
              fontSize: 15,
              lineHeight: 1.6,
              color: '#475569',
              maxWidth: 640,
              margin: '0 auto'
            }}>
              From maintenance requirements to a feasible block plan.
            </p>
          </div>

          {/* Horizontal Process Steps on Desktop */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: 16,
            marginBottom: 44
          }}>
            {/* Step 1: DATA */}
            <div style={workflowStepStyle}>
              <div style={stepNumberBadge}>1</div>
              <h3 style={stepTitleStyle}>DATA</h3>
              <p style={stepDescStyle}>
                Maintenance, asset and operational information
              </p>
            </div>

            {/* Step 2: RISK */}
            <div style={workflowStepStyle}>
              <div style={stepNumberBadge}>2</div>
              <h3 style={stepTitleStyle}>RISK</h3>
              <p style={stepDescStyle}>
                Identify higher-risk assets
              </p>
            </div>

            {/* Step 3: PRIORITISE */}
            <div style={workflowStepStyle}>
              <div style={stepNumberBadge}>3</div>
              <h3 style={stepTitleStyle}>PRIORITISE</h3>
              <p style={stepDescStyle}>
                Rank maintenance requirements
              </p>
            </div>

            {/* Step 4: OPTIMISE */}
            <div style={workflowStepStyle}>
              <div style={stepNumberBadge}>4</div>
              <h3 style={stepTitleStyle}>OPTIMISE</h3>
              <p style={stepDescStyle}>
                Generate feasible block schedules
              </p>
            </div>

            {/* Step 5: REVIEW */}
            <div style={workflowStepStyle}>
              <div style={stepNumberBadge}>5</div>
              <h3 style={stepTitleStyle}>REVIEW</h3>
              <p style={stepDescStyle}>
                Controller reviews and approves or modifies the recommendation
              </p>
            </div>
          </div>

          {/* Human Controller Decision-Support Governance Card */}
          <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            borderRadius: 14,
            padding: '28px 36px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 20,
            boxShadow: '0 8px 30px rgba(15, 23, 42, 0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, maxWidth: 720 }}>
              <div style={{
                width: 54,
                height: 54,
                borderRadius: 12,
                background: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                flexShrink: 0
              }}>
                <ShieldCheck size={28} />
              </div>
              <div>
                <div style={{
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#38bdf8',
                  marginBottom: 4
                }}>
                  DECISION SUPPORT ARCHITECTURE
                </div>
                <div style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: '#ffffff',
                  marginBottom: 6
                }}>
                  "AI recommends. The authorised controller decides."
                </div>
                <div style={{
                  fontSize: 13,
                  color: '#cbd5e1',
                  lineHeight: 1.5
                }}>
                  RailSamanvayAI ensures full Human-in-the-loop control. No maintenance block is enacted without explicit Section & Chief Controller verification.
                </div>
              </div>
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              borderRadius: 30,
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              fontSize: 12,
              fontWeight: 700,
              color: '#38bdf8'
            }}>
              <UserCheck size={16} />
              Controller-Approved Planning
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 9. SECTION: MEET STEEL BYTES 800 */}
      {/* ------------------------------------------------------------------ */}
      <section id="team" style={{
        padding: '80px 32px 90px',
        position: 'relative',
        background: 'linear-gradient(180deg, #f8fafc 0%, #edf3f8 100%)',
        borderBottom: '1px solid #cbd5e1'
      }}>
        <div style={{ maxWidth: 1040, margin: '0 auto' }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <h2 style={{
              fontSize: 'clamp(28px, 3.8vw, 36px)',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              color: '#0f172a',
              margin: '0 0 10px'
            }}>
              Meet The Steel Bytes 800
            </h2>

            <div style={{
              width: 50,
              height: 3,
              borderRadius: 2,
              background: '#2563eb',
              margin: '0 auto 16px'
            }} />

            <p style={{
              fontSize: 15,
              lineHeight: 1.6,
              color: '#475569',
              maxWidth: 580,
              margin: '0 auto'
            }}>
              The team behind RailSamanvayAI
            </p>
          </div>

          {/* 6 Developer Cards in 3x2 Grid — Steel Bytes 800 REMOVED from individual cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 22
          }}>
            {[
              { name: 'Gaurav Gautam', initials: 'GG' },
              { name: 'Debosmita Mukhopadhyay', initials: 'DM' },
              { name: 'Shashwat Sahu', initials: 'SS' },
              { name: 'Parinita Ramsagar', initials: 'PR' },
              { name: 'Likhitha Mylavarapu', initials: 'LM' },
              { name: 'Shubham Sagar', initials: 'SS' }
            ].map((member, idx) => (
              <div
                key={idx}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: '22px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#93c5fd';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Initials Avatar */}
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: 16,
                  fontWeight: 800,
                  letterSpacing: '0.02em',
                  flexShrink: 0,
                  boxShadow: '0 3px 10px rgba(37, 99, 235, 0.25)'
                }}>
                  {member.initials}
                </div>

                {/* Only Name, NO 'Steel Bytes 800' inside the card */}
                <div>
                  <div style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: '#0f172a'
                  }}>
                    {member.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 11. FOOTER (Natural transition from Meet Steel Bytes 800) */}
      {/* ------------------------------------------------------------------ */}
      <footer style={{
        background: '#070b16',
        color: '#94a3b8',
        padding: '40px 32px 30px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{
          maxWidth: 1140,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 24,
          paddingBottom: 28,
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          {/* Left: Brand Identity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 7,
              background: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Train size={18} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#ffffff' }}>
                RailSamanvayAI
              </div>
              <div style={{ fontSize: 11, color: '#64748b' }}>
                AI-Powered Automatic Block Planning for Railway Maintenance
              </div>
            </div>
          </div>

          {/* Center: Team & Hackathon credits */}
          <div style={{ textAlign: 'center', fontSize: 12 }}>
            <div style={{ color: '#cbd5e1', fontWeight: 600 }}>
              Developed by <strong style={{ color: '#38bdf8' }}>The Steel Bytes 800</strong>
            </div>
            <div style={{ color: '#64748b', marginTop: 2 }}>
              Smart India Hackathon 2026 • SIH26027
            </div>
          </div>

          {/* Right: Clean navigation links */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            fontSize: 13
          }}>
            <button onClick={() => scrollTo('smarter-planning')} style={footerLinkStyle}>About</button>
            <button onClick={() => scrollTo('users')} style={footerLinkStyle}>Users</button>
            <button onClick={() => scrollTo('how-it-works')} style={footerLinkStyle}>How It Works</button>
            <button onClick={() => scrollTo('team')} style={footerLinkStyle}>Team</button>
            <button onClick={handleLoginClick} style={{ ...footerLinkStyle, color: '#38bdf8', fontWeight: 700 }}>
              Login →
            </button>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div style={{
          maxWidth: 1140,
          margin: '0 auto',
          paddingTop: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          fontSize: 11,
          color: '#64748b'
        }}>
          <div>
            © 2026 RailSamanvayAI · Ministry of Railways, Government of India.
          </div>
          <div>
            Smart India Hackathon 2026 Prototype
          </div>
        </div>
      </footer>

      {/* Responsive media query styling */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-nav-toggle {
            display: none !important;
          }
        }
        @media (max-width: 767px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-nav-toggle {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}

// --------------------------------------------------------------------------
// REUSABLE STYLES
// --------------------------------------------------------------------------
const navLinkStyle: React.CSSProperties = {
  background: 'none',
  border: 0,
  color: '#cbd5e1',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  padding: '6px 10px',
  transition: 'color 0.15s ease'
};

const mobileNavLinkStyle: React.CSSProperties = {
  background: 'none',
  border: 0,
  color: '#cbd5e1',
  fontSize: 15,
  fontWeight: 600,
  cursor: 'pointer',
  padding: '8px 0',
  textAlign: 'left'
};

const footerLinkStyle: React.CSSProperties = {
  background: 'none',
  border: 0,
  color: '#94a3b8',
  cursor: 'pointer',
  padding: 0
};

const featureCardStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.92)',
  border: '1px solid rgba(226, 232, 240, 0.9)',
  borderRadius: 14,
  padding: '32px 28px',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
  transition: 'transform 0.15s ease, box-shadow 0.15s ease'
};

const userCardStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.88)',
  border: '1px solid #cbd5e1',
  borderRadius: 12,
  padding: '24px 22px',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
  display: 'flex',
  flexDirection: 'column'
};

const workflowStepStyle: React.CSSProperties = {
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: 12,
  padding: '22px 18px',
  textAlign: 'center',
  position: 'relative'
};

const stepNumberBadge: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: '50%',
  background: '#2563eb',
  color: '#ffffff',
  fontSize: 13,
  fontWeight: 800,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 12px'
};

const stepTitleStyle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 800,
  color: '#0f172a',
  letterSpacing: '0.04em',
  margin: '0 0 8px'
};

const stepDescStyle: React.CSSProperties = {
  fontSize: 12,
  lineHeight: 1.5,
  color: '#64748b',
  margin: 0
};
