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
  X,
  Target,
  Shield,
  ArrowRight,
  Clock,
  Sparkles,
  Wrench,
  Compass,
  FileCheck
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
      backgroundColor: 'transparent',
      color: '#0f172a',
      fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      overflowX: 'hidden'
    }}>
      {/* ------------------------------------------------------------------ */}
      {/* 1. TOP NAVBAR (MATCHES REFERENCE SCREENSHOTS)                       */}
      {/* ------------------------------------------------------------------ */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 68,
        padding: '0 36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 1000,
        transition: 'all 0.25s ease',
        background: isScrolled
          ? 'rgba(7, 20, 42, 0.95)'
          : 'rgba(7, 20, 42, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.14)'
      }}>
        {/* Left: Brand Identity */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(37, 99, 235, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.25)'
          }}>
            <Train size={22} color="#ffffff" strokeWidth={2.2} />
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            RailSamanvayAI
          </div>
        </div>

        {/* Right: Desktop Navigation */}
        <nav style={{
          display: 'none',
          alignItems: 'center',
          gap: 28
        }} className="desktop-nav">
          <button onClick={() => scrollTo('about')} style={navLinkStyle}>About</button>
          <button onClick={() => scrollTo('users')} style={navLinkStyle}>Users</button>
          <button onClick={() => scrollTo('how-it-works')} style={navLinkStyle}>How It Works</button>
          <button onClick={() => scrollTo('team')} style={navLinkStyle}>Team</button>

          <button
            onClick={handleLoginClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '9px 22px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              background: '#2563eb',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              boxShadow: '0 2px 10px rgba(37, 99, 235, 0.45)',
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
          background: 'rgba(7, 20, 42, 0.98)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.14)',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          zIndex: 999
        }}>
          <button onClick={() => scrollTo('about')} style={mobileNavLinkStyle}>About</button>
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
      {/* 2. FULL SCREEN HERO SECTION (MATCHES REFERENCE SCREENSHOT 1)      */}
      {/* ------------------------------------------------------------------ */}
      <section className="landing-hero-section" style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '110px 48px 60px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        background: '#080f1e'
      }}>
        {/* Full-width Indian Railways HD Photograph */}
        <picture style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <source srcSet="/indian_railway_hd.webp" type="image/webp" />
          <img
            src="/indian_railway_hd.jpg"
            alt="Indian Railways WAP-7 Locomotive, Platform & Varanasi Station Infrastructure"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'right center',
              display: 'block'
            }}
          />
        </picture>

        {/* Translucent overlay: preserves locomotive, tracks, platform while giving high contrast to text */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(7, 18, 38, 0.78) 0%, rgba(7, 18, 38, 0.65) 42%, rgba(7, 18, 38, 0.22) 75%, rgba(7, 18, 38, 0.10) 100%)',
          zIndex: 1
        }} />

        {/* Hero Content positioned toward LEFT */}
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
            <div style={{
              width: 65,
              height: 3,
              borderRadius: 2,
              background: 'linear-gradient(90deg, #ff9933 0%, #ff9933 33%, #ffffff 33%, #ffffff 66%, #138808 66%, #138808 100%)'
            }} />
          </div>

          {/* Main Large Heading */}
          <h1 style={{
            fontSize: 'clamp(30px, 8vw, 68px)',
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
            <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>
              Developed by <strong style={{ color: '#38bdf8', fontWeight: 800 }}>The Steel Bytes 800</strong>
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>
              Smart India Hackathon 2026 • SIH26027
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 3. SECTION A: SMARTER RAILWAY MAINTENANCE PLANNING (SCREENSHOT 2)  */}
      {/* ------------------------------------------------------------------ */}
      <section id="about" style={{
        padding: '90px 36px',
        position: 'relative',
        background: 'rgba(246, 249, 253, 0.92)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)'
      }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 54 }}>
            <h2 style={{
              fontSize: 'clamp(28px, 3.5vw, 42px)',
              fontWeight: 900,
              letterSpacing: '-0.025em',
              color: '#0f172a',
              margin: '0 0 14px'
            }}>
              Smarter Railway Maintenance Planning
            </h2>
            <div style={{
              width: 50,
              height: 3,
              borderRadius: 2,
              background: 'linear-gradient(90deg, #ea580c 0%, #2563eb 100%)',
              margin: '0 auto 16px auto'
            }} />
            <p style={{
              fontSize: 16,
              color: '#475569',
              maxWidth: 720,
              margin: '0 auto',
              lineHeight: 1.6
            }}>
              Identify risks, prioritise maintenance needs and generate feasible block plans to ensure safer and more reliable railway operations.
            </p>
          </div>

          {/* 3 Pillar Cards (White Glass) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 24
          }}>
            {/* 1. PREDICT */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.96)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.85)',
              borderRadius: 20,
              padding: '36px 30px',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: '#fef2f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#dc2626'
              }}>
                <Activity size={24} />
              </div>
              <div>
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
                <h3 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 10px' }}>
                  Asset Risk
                </h3>
                <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  Identify assets requiring attention using risk-based analysis.
                </p>
              </div>
            </div>

            {/* 2. PRIORITISE */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.96)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.85)',
              borderRadius: 20,
              padding: '36px 30px',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: '#fffbeb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#d97706'
              }}>
                <Sliders size={24} />
              </div>
              <div>
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
                <h3 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 10px' }}>
                  Maintenance Needs
                </h3>
                <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  Bring urgent and high-risk maintenance requirements to the forefront.
                </p>
              </div>
            </div>

            {/* 3. OPTIMISE */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.96)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.85)',
              borderRadius: 20,
              padding: '36px 30px',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: '#f0fdf4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#16a34a'
              }}>
                <CalendarCheck size={24} />
              </div>
              <div>
                <div style={{
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#16a34a',
                  marginBottom: 6
                }}>
                  OPTIMISE
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 10px' }}>
                  Maintenance Blocks
                </h3>
                <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  Generate feasible maintenance block plans under operational constraints.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 4. SECTION B: WHO USES RAILSAMANVAYAI? (SCREENSHOT 3)                */}
      {/* ------------------------------------------------------------------ */}
      <section id="users" style={{
        padding: '90px 36px',
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)'
      }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 54 }}>
            <h2 style={{
              fontSize: 'clamp(28px, 3.5vw, 42px)',
              fontWeight: 900,
              letterSpacing: '-0.025em',
              color: '#0f172a',
              margin: '0 0 14px'
            }}>
              WHO USES RAILSAMANVAYAI?
            </h2>
            <div style={{
              width: 50,
              height: 3,
              borderRadius: 2,
              background: '#2563eb',
              margin: '0 auto 16px auto'
            }} />
            <p style={{
              fontSize: 16,
              color: '#475569',
              maxWidth: 720,
              margin: '0 auto',
              lineHeight: 1.6
            }}>
              Designed to support the teams involved in railway maintenance and block planning.
            </p>
          </div>

          {/* 4 User Roles / Departments Cards (Exact match to Screenshot 3) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 20
          }}>
            {/* Card 1: Operating / Traffic (Primary User) */}
            <div style={{
              background: '#ffffff',
              border: '2px solid #2563eb',
              borderRadius: 18,
              padding: '28px 24px',
              boxShadow: '0 8px 30px rgba(37, 99, 235, 0.10)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: '#eff6ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2563eb'
                  }}>
                    <Train size={22} />
                  </div>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 800,
                    background: '#2563eb',
                    color: '#ffffff'
                  }}>
                    PRIMARY USER
                  </span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', margin: '0 0 6px', letterSpacing: '-0.01em' }}>
                  OPERATING / TRAFFIC
                </h3>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', marginBottom: 12, lineHeight: 1.4 }}>
                  Chief Controller · Deputy Chief Controller · Section Controller
                </div>
                <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  Reviews recommended maintenance blocks, considers operational impact and reviews the final plan.
                </p>
              </div>
            </div>

            {/* Card 2: Engineering (Stakeholder) */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 18,
              padding: '28px 24px',
              boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#475569'
                  }}>
                    <Layers size={22} />
                  </div>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 700,
                    background: '#f1f5f9',
                    color: '#475569',
                    border: '1px solid #e2e8f0'
                  }}>
                    STAKEHOLDER
                  </span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', margin: '0 0 6px', letterSpacing: '-0.01em' }}>
                  ENGINEERING
                </h3>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#0284c7', marginBottom: 12, lineHeight: 1.4 }}>
                  Engineering Maintenance Teams
                </div>
                <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  Provides track and infrastructure maintenance requirements for planning.
                </p>
              </div>
            </div>

            {/* Card 3: S&T (Stakeholder) */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 18,
              padding: '28px 24px',
              boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#475569'
                  }}>
                    <Radio size={22} />
                  </div>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 700,
                    background: '#f1f5f9',
                    color: '#475569',
                    border: '1px solid #e2e8f0'
                  }}>
                    STAKEHOLDER
                  </span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', margin: '0 0 6px', letterSpacing: '-0.01em' }}>
                  S&T
                </h3>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#d97706', marginBottom: 12, lineHeight: 1.4 }}>
                  Signalling &amp; Telecommunication Teams
                </div>
                <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  Provides signalling and telecommunications maintenance requirements.
                </p>
              </div>
            </div>

            {/* Card 4: Electrical / TRD (Stakeholder) */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 18,
              padding: '28px 24px',
              boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#475569'
                  }}>
                    <Zap size={22} />
                  </div>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 700,
                    background: '#f1f5f9',
                    color: '#475569',
                    border: '1px solid #e2e8f0'
                  }}>
                    STAKEHOLDER
                  </span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', margin: '0 0 6px', letterSpacing: '-0.01em' }}>
                  ELECTRICAL / TRD
                </h3>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#059669', marginBottom: 12, lineHeight: 1.4 }}>
                  TRD / OHE Maintenance Teams
                </div>
                <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  Provides traction and electrical maintenance requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 5. SECTION C: HOW RAILSAMANVAYAI WORKS (SCREENSHOT 4)              */}
      {/* ------------------------------------------------------------------ */}
      <section id="how-it-works" style={{
        padding: '90px 36px',
        position: 'relative',
        background: 'rgba(246, 249, 253, 0.94)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)'
      }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 54 }}>
            <h2 style={{
              fontSize: 'clamp(28px, 3.5vw, 42px)',
              fontWeight: 900,
              letterSpacing: '-0.025em',
              color: '#0f172a',
              margin: '0 0 14px'
            }}>
              How RailSamanvayAI Works
            </h2>
            <div style={{
              width: 50,
              height: 3,
              borderRadius: 2,
              background: '#2563eb',
              margin: '0 auto 16px auto'
            }} />
            <p style={{
              fontSize: 16,
              color: '#475569',
              maxWidth: 720,
              margin: '0 auto',
              lineHeight: 1.6
            }}>
              From maintenance requirements to a feasible block plan.
            </p>
          </div>

          {/* 5 Step Cards (Matches Screenshot 4) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
            marginBottom: 44
          }}>
            {[
              { num: '1', title: 'DATA', desc: 'Maintenance, asset and operational information' },
              { num: '2', title: 'RISK', desc: 'Identify higher-risk assets' },
              { num: '3', title: 'PRIORITISE', desc: 'Rank maintenance requirements' },
              { num: '4', title: 'OPTIMISE', desc: 'Generate feasible block schedules' },
              { num: '5', title: 'REVIEW', desc: 'Controller reviews and approves or modifies the recommendation' }
            ].map((step, idx) => (
              <div key={idx} style={{
                background: 'rgba(255, 255, 255, 0.96)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.85)',
                borderRadius: 16,
                padding: '28px 20px',
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: '#2563eb',
                  color: '#ffffff',
                  fontSize: 15,
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                  boxShadow: '0 2px 8px rgba(37, 99, 235, 0.35)'
                }}>
                  {step.num}
                </div>
                <div style={{
                  fontSize: 14,
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  color: '#0f172a',
                  marginBottom: 8
                }}>
                  {step.title}
                </div>
                <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>
                  {step.desc}
                </div>
              </div>
            ))}
          </div>

          {/* Decision Support Architecture Dark Glass Banner (Matches Screenshot 4) */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(7, 20, 42, 0.95) 0%, rgba(11, 28, 56, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            borderRadius: 18,
            padding: '28px 36px',
            color: '#ffffff',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 20
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, maxWidth: 760 }}>
              <div style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                flexShrink: 0,
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)'
              }}>
                <Shield size={26} />
              </div>
              <div>
                <div style={{
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  color: '#38bdf8',
                  textTransform: 'uppercase',
                  marginBottom: 4
                }}>
                  DECISION SUPPORT ARCHITECTURE
                </div>
                <div style={{
                  fontSize: 19,
                  fontWeight: 800,
                  color: '#ffffff',
                  marginBottom: 6,
                  letterSpacing: '-0.01em'
                }}>
                  "AI recommends. The authorised controller decides."
                </div>
                <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.55 }}>
                  RailSamanvayAI ensures full Human-in-the-loop control. No maintenance block is enacted without explicit Section &amp; Chief Controller verification.
                </div>
              </div>
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              borderRadius: 30,
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              fontSize: 12,
              fontWeight: 700,
              color: '#38bdf8',
              backdropFilter: 'blur(8px)'
            }}>
              <UserCheck size={16} />
              Controller-Approved Planning
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 6. SECTION D: TEAM (THE STEEL BYTES 800)                           */}
      {/* ------------------------------------------------------------------ */}
      <section id="team" style={{
        padding: '90px 36px',
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)'
      }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 54 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '5px 14px',
              borderRadius: 20,
              background: '#eff6ff',
              color: '#2563eb',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: 12
            }}>
              <Sparkles size={14} />
              Hackathon Project Team
            </div>
            <h2 style={{
              fontSize: 'clamp(28px, 3.5vw, 42px)',
              fontWeight: 900,
              letterSpacing: '-0.025em',
              color: '#0f172a',
              margin: '0 0 14px'
            }}>
              The Steel Bytes 800
            </h2>
            <div style={{
              width: 50,
              height: 3,
              borderRadius: 2,
              background: '#2563eb',
              margin: '0 auto 16px auto'
            }} />
            <p style={{
              fontSize: 16,
              color: '#475569',
              maxWidth: 680,
              margin: '0 auto'
            }}>
              Smart India Hackathon 2026 · Problem Statement: SIH26027 · Ministry of Railways
            </p>
          </div>

          {/* 6 Team Member Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 20
          }}>
            {[
              { name: 'Gaurav Gautam', initials: 'GG' },
              { name: 'Debosmita Mukhopadhyay', initials: 'DM' },
              { name: 'Shashwat Sahu', initials: 'SS' },
              { name: 'Parinita Ramsagar', initials: 'PR' },
              { name: 'Likhitha Mylavarapu', initials: 'LM' },
              { name: 'Shubham Sagar', initials: 'SS' }
            ].map((member, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: 16,
                  padding: '22px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
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
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: 16,
                  fontWeight: 800,
                  flexShrink: 0,
                  boxShadow: '0 3px 10px rgba(37, 99, 235, 0.25)'
                }}>
                  {member.initials}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>
                    {member.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 7. FOOTER                                                          */}
      {/* ------------------------------------------------------------------ */}
      <footer style={{
        background: 'rgba(7, 20, 42, 0.98)',
        backdropFilter: 'blur(20px)',
        color: '#94a3b8',
        padding: '48px 36px 32px',
        borderTop: '1px solid rgba(255, 255, 255, 0.12)'
      }}>
        <div style={{
          maxWidth: 1180,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 24,
          paddingBottom: 28,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {/* Brand Identity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Train size={20} />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#ffffff' }}>
                RailSamanvayAI
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>
                AI-Powered Automatic Block Planning for Railway Maintenance
              </div>
            </div>
          </div>

          {/* Center Attribution */}
          <div style={{ textAlign: 'center', fontSize: 12 }}>
            <div style={{ color: '#cbd5e1', fontWeight: 600 }}>
              Developed by <strong style={{ color: '#38bdf8' }}>The Steel Bytes 800</strong>
            </div>
            <div style={{ color: '#94a3b8', marginTop: 2 }}>
              Smart India Hackathon 2026 • <strong style={{ color: '#38bdf8' }}>SIH26027</strong>
            </div>
          </div>

          {/* Quick Links */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            fontSize: 13
          }}>
            <button onClick={() => scrollTo('about')} style={footerLinkStyle}>About</button>
            <button onClick={() => scrollTo('users')} style={footerLinkStyle}>Users</button>
            <button onClick={() => scrollTo('how-it-works')} style={footerLinkStyle}>How It Works</button>
            <button onClick={() => scrollTo('team')} style={footerLinkStyle}>Team</button>
            <button onClick={handleLoginClick} style={{ ...footerLinkStyle, color: '#38bdf8', fontWeight: 700 }}>
              Login →
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div style={{
          maxWidth: 1180,
          margin: '0 auto',
          paddingTop: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          fontSize: 12,
          color: '#64748b'
        }}>
          <div>
            © 2026 RailSamanvayAI • Ministry of Railways, Government of India.
          </div>
          <div>
            Smart India Hackathon 2026 Innovation Platform
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
