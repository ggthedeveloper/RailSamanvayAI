import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Train,
  ArrowRight,
  Activity,
  Sliders,
  CalendarCheck
} from 'lucide-react';

interface LandingPageProps {
  setToken?: (token: string) => void;
}

export function LandingPage({ setToken }: LandingPageProps = {}) {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  // Check if user already holds a valid authentication session
  const hasToken = Boolean(localStorage.getItem('token'));

  const handleEnterPlatform = () => {
    if (hasToken) {
      navigate('/overview');
    } else {
      navigate('/login');
    }
  };

  const scrollToAbout = () => {
    const el = document.getElementById('about');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
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
      backgroundColor: '#070b14',
      color: '#ffffff',
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      overflowX: 'hidden'
    }}>
      {/* ------------------------------------------------------------------ */}
      {/* NAVBAR */}
      {/* ------------------------------------------------------------------ */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 72,
        padding: '0 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 100,
        transition: 'all 0.25s ease',
        background: isScrolled
          ? 'rgba(7, 11, 20, 0.94)'
          : 'linear-gradient(to bottom, rgba(7, 11, 20, 0.8) 0%, transparent 100%)',
        backdropFilter: isScrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(12px)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent'
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
            background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <Train size={22} color="#ffffff" strokeWidth={2} />
          </div>
          <div>
            <span style={{
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#ffffff'
            }}>
              RailSamanvayAI
            </span>
          </div>
        </div>

        {/* Right: Minimal Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <button
            onClick={scrollToAbout}
            style={{
              background: 'none',
              border: 0,
              color: '#94a3b8',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: 6,
              transition: 'color 0.15s ease'
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
          >
            About
          </button>

          <button
            onClick={handleEnterPlatform}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '9px 18px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(8px)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#2563eb';
              e.currentTarget.style.borderColor = '#3b82f6';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(37, 99, 235, 0.3)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {hasToken ? 'Open Dashboard' : 'Login'}
            <ArrowRight size={14} />
          </button>
        </nav>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* HERO SECTION */}
      {/* ------------------------------------------------------------------ */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '110px 24px 60px',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}>
        {/* Background Railway Visual with Cinematic Dark Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: "url('/train_landscape.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.36,
          zIndex: 0
        }} />

        {/* Multi-stage Gradient Overlay for Perfect Contrast */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 45%, rgba(7, 11, 20, 0.6) 0%, rgba(7, 11, 20, 0.95) 85%, #070b14 100%)',
          zIndex: 1
        }} />

        {/* Subtle Decorative Track Line */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 1,
          background: 'linear-gradient(90deg, transparent 0%, rgba(37, 99, 235, 0.3) 50%, transparent 100%)',
          zIndex: 2
        }} />

        {/* Hero Content Container */}
        <div style={{
          position: 'relative',
          zIndex: 3,
          maxWidth: 880,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* Hierarchy Item 1: Small Indian Railways Accent */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '6px 14px',
            borderRadius: 30,
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            marginBottom: 26,
            backdropFilter: 'blur(8px)',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
          }}>
            {/* Subtle Indian Tricolour Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ff9933' }} />
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ffffff' }} />
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#138808' }} />
            </div>
            <span style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#e2e8f0'
            }}>
              INDIAN RAILWAYS
            </span>
          </div>

          {/* Hierarchy Item 2: Main Heading */}
          <h1 style={{
            fontSize: 'clamp(44px, 8vw, 76px)',
            fontWeight: 900,
            letterSpacing: '-0.035em',
            lineHeight: 1.06,
            margin: '0 0 20px',
            color: '#ffffff',
            textShadow: '0 4px 30px rgba(0, 0, 0, 0.6)'
          }}>
            RailSamanvayAI
          </h1>

          {/* Hierarchy Item 3: Subtitle */}
          <h2 style={{
            fontSize: 'clamp(18px, 3.5vw, 26px)',
            fontWeight: 600,
            lineHeight: 1.35,
            color: '#cbd5e1',
            margin: '0 0 16px',
            maxWidth: 680,
            letterSpacing: '-0.01em'
          }}>
            AI-Powered Automatic Block Planning
            <br />
            for Railway Maintenance
          </h2>

          {/* Hierarchy Item 4: Supporting Sentence */}
          <p style={{
            fontSize: 'clamp(14px, 2.2vw, 17px)',
            fontWeight: 400,
            lineHeight: 1.6,
            color: '#94a3b8',
            margin: '0 0 38px',
            maxWidth: 620
          }}>
            Smarter maintenance planning for safer and more efficient railway operations.
          </p>

          {/* Hierarchy Item 5: Primary Button */}
          <button
            onClick={handleEnterPlatform}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              padding: '16px 38px',
              fontSize: 16,
              fontWeight: 800,
              color: '#ffffff',
              background: '#2563eb',
              border: '1px solid #3b82f6',
              borderRadius: 10,
              cursor: 'pointer',
              boxShadow: '0 6px 26px rgba(37, 99, 235, 0.45)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              marginBottom: 32
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 32px rgba(37, 99, 235, 0.6)';
              e.currentTarget.style.background = '#1d4ed8';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 26px rgba(37, 99, 235, 0.45)';
              e.currentTarget.style.background = '#2563eb';
            }}
          >
            Enter Platform →
          </button>

          {/* Hierarchy Item 6 & 7: Developed by Steel Bytes 800 & Smart India Hackathon 2026 */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6
          }}>
            <div style={{
              fontSize: 15,
              fontWeight: 700,
              color: '#f8fafc',
              letterSpacing: '0.01em',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <span>Developed by</span>
              <span style={{
                color: '#38bdf8',
                fontWeight: 800,
                textDecoration: 'none'
              }}>
                Steel Bytes 800
              </span>
            </div>

            <div style={{
              fontSize: 13,
              fontWeight: 500,
              color: '#94a3b8'
            }}>
              Smart India Hackathon 2026
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECOND SECTION: ONLY ONE SIMPLE SECTION */}
      {/* ------------------------------------------------------------------ */}
      <section style={{
        padding: '100px 24px 110px',
        backgroundColor: '#0a0f1d',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          {/* Section Heading */}
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{
              fontSize: 'clamp(28px, 4.5vw, 40px)',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              color: '#ffffff',
              margin: '0 0 14px'
            }}>
              Smarter Railway Maintenance Planning
            </h2>
            <div style={{
              width: 48,
              height: 3,
              background: '#2563eb',
              borderRadius: 2,
              margin: '0 auto'
            }} />
          </div>

          {/* Three Minimal Columns */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 36
          }}>
            {/* Column 1: PREDICT */}
            <div style={{
              padding: '36px 30px',
              borderRadius: 14,
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              transition: 'transform 0.2s ease, border-color 0.2s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.35)';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.07)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <div style={{
                width: 46,
                height: 46,
                borderRadius: 10,
                background: 'rgba(56, 189, 248, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 22,
                color: '#38bdf8'
              }}>
                <Activity size={24} strokeWidth={2} />
              </div>

              <div style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#38bdf8',
                marginBottom: 6
              }}>
                PREDICT
              </div>

              <h3 style={{
                fontSize: 22,
                fontWeight: 700,
                color: '#ffffff',
                margin: '0 0 10px',
                letterSpacing: '-0.01em'
              }}>
                Asset Risk
              </h3>

              <p style={{
                fontSize: 15,
                lineHeight: 1.6,
                color: '#94a3b8',
                margin: 0
              }}>
                Identify assets requiring attention.
              </p>
            </div>

            {/* Column 2: PRIORITISE */}
            <div style={{
              padding: '36px 30px',
              borderRadius: 14,
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              transition: 'transform 0.2s ease, border-color 0.2s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.35)';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.07)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <div style={{
                width: 46,
                height: 46,
                borderRadius: 10,
                background: 'rgba(245, 158, 11, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 22,
                color: '#f59e0b'
              }}>
                <Sliders size={24} strokeWidth={2} />
              </div>

              <div style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#f59e0b',
                marginBottom: 6
              }}>
                PRIORITISE
              </div>

              <h3 style={{
                fontSize: 22,
                fontWeight: 700,
                color: '#ffffff',
                margin: '0 0 10px',
                letterSpacing: '-0.01em'
              }}>
                Maintenance Needs
              </h3>

              <p style={{
                fontSize: 15,
                lineHeight: 1.6,
                color: '#94a3b8',
                margin: 0
              }}>
                Focus maintenance where it matters most.
              </p>
            </div>

            {/* Column 3: OPTIMISE */}
            <div style={{
              padding: '36px 30px',
              borderRadius: 14,
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              transition: 'transform 0.2s ease, border-color 0.2s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.35)';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.07)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <div style={{
                width: 46,
                height: 46,
                borderRadius: 10,
                background: 'rgba(16, 185, 129, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 22,
                color: '#10b981'
              }}>
                <CalendarCheck size={24} strokeWidth={2} />
              </div>

              <div style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#10b981',
                marginBottom: 6
              }}>
                OPTIMISE
              </div>

              <h3 style={{
                fontSize: 22,
                fontWeight: 700,
                color: '#ffffff',
                margin: '0 0 10px',
                letterSpacing: '-0.01em'
              }}>
                Maintenance Blocks
              </h3>

              <p style={{
                fontSize: 15,
                lineHeight: 1.6,
                color: '#94a3b8',
                margin: 0
              }}>
                Generate feasible maintenance block plans.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* FINAL CTA */}
      {/* ------------------------------------------------------------------ */}
      <section style={{
        padding: '90px 24px',
        textAlign: 'center',
        background: '#070b14',
        position: 'relative'
      }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(26px, 4vw, 36px)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            margin: '0 0 24px'
          }}>
            Ready to plan better?
          </h2>

          <button
            onClick={handleEnterPlatform}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: '15px 34px',
              fontSize: 16,
              fontWeight: 800,
              color: '#ffffff',
              background: '#2563eb',
              border: '1px solid #3b82f6',
              borderRadius: 10,
              cursor: 'pointer',
              boxShadow: '0 6px 24px rgba(37, 99, 235, 0.4)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.background = '#1d4ed8';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(37, 99, 235, 0.55)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.background = '#2563eb';
              e.currentTarget.style.boxShadow = '0 6px 24px rgba(37, 99, 235, 0.4)';
            }}
          >
            Enter RailSamanvayAI →
          </button>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* FOOTER */}
      {/* ------------------------------------------------------------------ */}
      <footer id="about" style={{
        padding: '50px 24px 40px',
        backgroundColor: '#04070d',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        color: '#64748b',
        textAlign: 'center',
        fontSize: 13,
        lineHeight: 1.8
      }}>
        <div style={{
          maxWidth: 640,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12
        }}>
          {/* Logo & Name */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: '#ffffff',
            fontWeight: 800,
            fontSize: 17
          }}>
            <Train size={18} color="#38bdf8" />
            <span>RailSamanvayAI</span>
          </div>

          {/* Credits */}
          <div style={{ color: '#cbd5e1', fontWeight: 600 }}>
            Developed by <span style={{ color: '#38bdf8', fontWeight: 700 }}>Steel Bytes 800</span>
          </div>

          <div style={{ color: '#94a3b8' }}>
            Smart India Hackathon 2026
          </div>

          <div style={{
            fontSize: 12,
            color: '#64748b',
            letterSpacing: '0.04em',
            paddingTop: 8,
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            width: '100%',
            maxWidth: 320
          }}>
            Problem Statement: SIH26027
          </div>
        </div>
      </footer>
    </div>
  );
}
