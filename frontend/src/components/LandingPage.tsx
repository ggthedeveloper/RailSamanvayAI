import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Train, ShieldCheck, Activity, MapPin, Layers, ListTodo,
  Calendar, Compass, AlertTriangle, FileCheck, Database,
  Settings, Cpu, CheckCircle2, ArrowRight, Wrench,
  Zap, Radio, Sliders, BarChart3, Users, Sparkles,
  ExternalLink, Menu, X, UserCheck, Clock, ArrowDown,
  Lock, AlertOctagon, Terminal
} from 'lucide-react';
import { theme, cardStyle, badgeStyle, buttonPrimary, buttonSecondary } from '../theme';

interface LandingPageProps {
  setToken?: (token: string) => void;
}

export function LandingPage({ setToken }: LandingPageProps = {}) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Check existing authentication token
  const hasToken = Boolean(localStorage.getItem('token'));

  const handleEnterDashboard = () => {
    if (hasToken) {
      navigate('/overview');
    } else {
      navigate('/login');
    }
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      
      {/* ------------------------------------------------------------------ */}
      {/* TOP GOVERNMENT OF INDIA & SIH IDENTIFIER BAR */}
      {/* ------------------------------------------------------------------ */}
      <div style={{
        background: '#0f172a',
        color: '#94a3b8',
        fontSize: 11,
        padding: '7px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #1e293b',
        flexWrap: 'wrap',
        gap: 8
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ color: '#38bdf8', fontWeight: 800, letterSpacing: '0.04em' }}>
            🇮🇳 GOVERNMENT OF INDIA
          </span>
          <span style={{ color: '#475569' }}>•</span>
          <span style={{ color: '#cbd5e1', fontWeight: 600 }}>MINISTRY OF RAILWAYS</span>
          <span style={{ color: '#475569' }}>•</span>
          <span style={{ color: '#fbbf24', fontWeight: 700 }}>
            Smart India Hackathon 2026 — Problem Statement SIH26027
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#4ade80', fontWeight: 700 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
            AI Decision-Support System · Human-in-the-Loop
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* NAVBAR */}
      {/* ------------------------------------------------------------------ */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: isScrolled ? 'rgba(255, 255, 255, 0.98)' : '#ffffff',
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${isScrolled ? '#cbd5e1' : theme.border}`,
        boxShadow: isScrolled ? '0 4px 20px rgba(15, 23, 42, 0.06)' : 'none',
        padding: '14px 28px',
        transition: 'all 0.2s ease'
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Brand Logo */}
          <div
            onClick={() => scrollToSection('overview')}
            style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
          >
            <div style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
              border: '2px solid #bfdbfe'
            }}>
              <Train size={24} color="#ffffff" strokeWidth={2} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
                  RailSamanvayAI
                </span>
                <span style={{
                  fontSize: 10,
                  fontWeight: 800,
                  background: '#dbeafe',
                  color: '#1d4ed8',
                  padding: '2px 7px',
                  borderRadius: 4,
                  letterSpacing: '0.04em'
                }}>
                  SIH26027
                </span>
              </div>
              <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>
                AI Block Planning Decision Support
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav style={{ display: 'none', alignItems: 'center', gap: 28, fontSize: 13, fontWeight: 700 }} className="desktop-nav">
            <button
              onClick={() => scrollToSection('overview')}
              style={{ background: 'none', border: 0, color: '#475569', cursor: 'pointer', padding: '6px 0' }}
            >
              Overview
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              style={{ background: 'none', border: 0, color: '#475569', cursor: 'pointer', padding: '6px 0' }}
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('features')}
              style={{ background: 'none', border: 0, color: '#475569', cursor: 'pointer', padding: '6px 0' }}
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('technology')}
              style={{ background: 'none', border: 0, color: '#475569', cursor: 'pointer', padding: '6px 0' }}
            >
              Technology
            </button>
            <button
              onClick={() => scrollToSection('about')}
              style={{ background: 'none', border: 0, color: '#475569', cursor: 'pointer', padding: '6px 0' }}
            >
              About
            </button>
          </nav>

          {/* Action CTA & Mobile Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={handleEnterDashboard}
              style={{
                ...buttonPrimary,
                padding: '10px 18px',
                fontSize: 13,
                fontWeight: 700,
                borderRadius: 8,
                background: '#1d4ed8',
                border: '1px solid #1e40af'
              }}
            >
              Enter Control Dashboard →
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-toggle"
              style={{
                background: 'none',
                border: `1px solid ${theme.border}`,
                borderRadius: 8,
                padding: '8px',
                cursor: 'pointer',
                display: 'none',
                color: '#0f172a'
              }}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div style={{
            padding: '16px 0 8px',
            borderTop: `1px solid ${theme.border}`,
            marginTop: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            fontSize: 14,
            fontWeight: 600
          }}>
            <button onClick={() => scrollToSection('overview')} style={{ textAlign: 'left', background: 'none', border: 0, padding: '8px 12px', color: '#0f172a', cursor: 'pointer' }}>Overview</button>
            <button onClick={() => scrollToSection('how-it-works')} style={{ textAlign: 'left', background: 'none', border: 0, padding: '8px 12px', color: '#0f172a', cursor: 'pointer' }}>How It Works</button>
            <button onClick={() => scrollToSection('features')} style={{ textAlign: 'left', background: 'none', border: 0, padding: '8px 12px', color: '#0f172a', cursor: 'pointer' }}>Features</button>
            <button onClick={() => scrollToSection('technology')} style={{ textAlign: 'left', background: 'none', border: 0, padding: '8px 12px', color: '#0f172a', cursor: 'pointer' }}>Technology</button>
            <button onClick={() => scrollToSection('about')} style={{ textAlign: 'left', background: 'none', border: 0, padding: '8px 12px', color: '#0f172a', cursor: 'pointer' }}>About</button>
          </div>
        )}
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 1 — HERO SECTION */}
      {/* ------------------------------------------------------------------ */}
      <section id="overview" style={{
        background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)',
        borderBottom: `1px solid ${theme.border}`,
        padding: '60px 24px 80px'
      }}>
        <div style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 48,
          alignItems: 'center'
        }}>
          
          {/* Left Column: Heading & Positioning */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 12px',
              borderRadius: 20,
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              fontSize: 11,
              fontWeight: 800,
              color: '#1d4ed8',
              letterSpacing: '0.04em',
              marginBottom: 16
            }}>
              SMART INDIA HACKATHON 2026 • SIH26027
            </div>

            <h1 style={{
              fontSize: 44,
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              color: '#0f172a',
              margin: '0 0 10px'
            }}>
              AI-Powered Automatic Block Planning
            </h1>

            <div style={{
              fontSize: 28,
              fontWeight: 800,
              color: '#2563eb',
              letterSpacing: '-0.02em',
              marginBottom: 18
            }}>
              For Indian Railways
            </div>

            <p style={{
              fontSize: 15,
              lineHeight: 1.6,
              color: '#475569',
              marginBottom: 24,
              maxWidth: 580
            }}>
              Predict asset risk, prioritise maintenance, and generate feasible block plans while balancing railway operations, possession windows, crews and resource constraints.
            </p>

            {/* Supporting Micro-labels */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                color: '#1e293b'
              }}>
                <Activity size={13} color="#2563eb" />
                Risk-Aware
              </span>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                color: '#1e293b'
              }}>
                <Cpu size={13} color="#d97706" />
                Constraint-Driven
              </span>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                color: '#1e293b'
              }}>
                <UserCheck size={13} color="#16a34a" />
                Human-in-the-Loop
              </span>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <button
                onClick={handleEnterDashboard}
                style={{
                  ...buttonPrimary,
                  padding: '12px 24px',
                  fontSize: 14,
                  fontWeight: 800,
                  borderRadius: 8,
                  background: '#1d4ed8',
                  boxShadow: '0 4px 14px rgba(29, 78, 216, 0.3)'
                }}
              >
                Enter Control Dashboard →
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                style={{
                  ...buttonSecondary,
                  padding: '12px 20px',
                  fontSize: 14,
                  fontWeight: 700,
                  borderRadius: 8
                }}
              >
                Explore How It Works ↓
              </button>
            </div>
          </div>

          {/* Right Column: Railway Network Schematic & Planning Card Visual */}
          <div style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #cbd5e1',
            boxShadow: '0 12px 36px rgba(15, 23, 42, 0.08)',
            padding: 24,
            position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
                <span style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Operational Corridor Schematic
                </span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>
                Delhi–Kanpur Quadruple Track Corridor
              </span>
            </div>

            {/* Conceptual SVG Railway Network Diagram */}
            <div style={{ background: '#f8fafc', borderRadius: 10, padding: '16px 12px', border: '1px solid #e2e8f0', marginBottom: 16 }}>
              <svg viewBox="0 0 460 160" width="100%" height="auto" style={{ display: 'block' }}>
                {/* Up and Down Mainlines */}
                <line x1="30" y1="45" x2="430" y2="45" stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="6,4" />
                <line x1="30" y1="75" x2="430" y2="75" stroke="#64748b" strokeWidth="3" />
                <line x1="30" y1="105" x2="430" y2="105" stroke="#64748b" strokeWidth="3" />
                <line x1="30" y1="135" x2="430" y2="135" stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="6,4" />

                {/* Crossovers */}
                <line x1="120" y1="75" x2="160" y2="105" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3,3" />
                <line x1="300" y1="105" x2="340" y2="75" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3,3" />

                {/* Maintenance Possession Block Highlight on Section NDLS-GZB */}
                <rect x="70" y="66" width="160" height="18" rx="4" fill="#fef3c7" stroke="#d97706" strokeWidth="2" strokeDasharray="4,2" />
                <text x="150" y="79" fill="#b45309" fontSize="9" fontWeight="800" textAnchor="middle">
                  POSSESSION BLOCK: 23:00–03:00
                </text>

                {/* Station Nodes */}
                <circle cx="50" cy="75" r="7" fill="#1d4ed8" stroke="#ffffff" strokeWidth="2" />
                <text x="50" y="60" fill="#0f172a" fontSize="10" fontWeight="800" textAnchor="middle">NDLS</text>

                <circle cx="210" cy="75" r="7" fill="#1d4ed8" stroke="#ffffff" strokeWidth="2" />
                <text x="210" y="60" fill="#0f172a" fontSize="10" fontWeight="800" textAnchor="middle">GZB</text>

                <circle cx="330" cy="75" r="6" fill="#64748b" stroke="#ffffff" strokeWidth="2" />
                <text x="330" y="60" fill="#0f172a" fontSize="10" fontWeight="700" textAnchor="middle">ALJN</text>

                <circle cx="410" cy="75" r="7" fill="#1d4ed8" stroke="#ffffff" strokeWidth="2" />
                <text x="410" y="60" fill="#0f172a" fontSize="10" fontWeight="800" textAnchor="middle">CNB</text>

                {/* Down line station circles */}
                <circle cx="50" cy="105" r="5" fill="#1d4ed8" />
                <circle cx="210" cy="105" r="5" fill="#1d4ed8" />
                <circle cx="330" cy="105" r="4" fill="#64748b" />
                <circle cx="410" cy="105" r="5" fill="#1d4ed8" />
              </svg>
            </div>

            {/* Overlay Recommended Block Planning Card */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #bfdbfe',
              borderRadius: 10,
              padding: '14px 16px',
              backgroundAttachment: '#eff6ff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#15803d',
                  background: '#dcfce7',
                  padding: '3px 8px',
                  borderRadius: 6
                }}>
                  <CheckCircle2 size={13} />
                  Recommended Block Plan
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#1e40af' }}>
                  Google OR-Tools CP-SAT
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, fontSize: 12 }}>
                <div>
                  <div style={{ color: '#64748b', fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>Section</div>
                  <div style={{ fontWeight: 800, color: '#0f172a' }}>NDLS – GZB (Up Main)</div>
                </div>
                <div>
                  <div style={{ color: '#64748b', fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>Allocated Slot</div>
                  <div style={{ fontWeight: 800, color: '#0f172a' }}>23:00 – 03:00 (240 min)</div>
                </div>
                <div>
                  <div style={{ color: '#64748b', fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>Bundled Tasks</div>
                  <div style={{ fontWeight: 700, color: '#2563eb' }}>3 Tasks (TRD, Track, S&T)</div>
                </div>
                <div>
                  <div style={{ color: '#64748b', fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>Conflict Status</div>
                  <div style={{ fontWeight: 700, color: '#16a34a' }}>No Operational Conflict</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 2 — THE PROBLEM */}
      {/* ------------------------------------------------------------------ */}
      <section id="problem" style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', margin: '0 0 12px' }}>
            Railway Maintenance Is a Scheduling Problem
          </h2>
          <p style={{ fontSize: 15, color: '#475569', maxWidth: 740, margin: '0 auto', lineHeight: 1.6 }}>
            Maintenance activities compete for limited possession windows, crews, equipment and operating capacity. Planning must balance asset condition with the realities of railway operations.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 20
        }}>
          {[
            {
              title: 'Asset Failure Risk',
              question: 'Which assets require attention first?',
              desc: 'Estimating probabilistic degradation across track, signalling and catenary before in-service disruptions happen.',
              icon: AlertTriangle,
              color: '#dc2626'
            },
            {
              title: 'Maintenance Urgency',
              question: 'Which tasks cannot be delayed?',
              desc: 'Separating statutory safety-critical interventions and overdue compliance mandates from deferrable routine upkeep.',
              icon: Clock,
              color: '#d97706'
            },
            {
              title: 'Train Operations',
              question: 'When can infrastructure be taken out of service?',
              desc: 'Respecting passenger punctuality corridors and freight freight throughput without introducing secondary network bottlenecks.',
              icon: Train,
              color: '#2563eb'
            },
            {
              title: 'Possession Windows',
              question: 'When is a valid maintenance block available?',
              desc: 'Identifying non-peak traffic gaps (night slots or shadow paths) that match required maintenance activity durations.',
              icon: Calendar,
              color: '#0284c7'
            },
            {
              title: 'Crew & Resources',
              question: 'Are the required teams and resources available?',
              desc: 'Allocating heavy specialized equipment (Track Relaying Trains, Ballast Cleaners, Tower Wagons) without double-booking.',
              icon: Users,
              color: '#7c3aed'
            },
            {
              title: 'Concurrent Activities',
              question: 'Which maintenance tasks can safely be combined?',
              desc: 'Synchronizing multi-departmental possessions (Track + TRD + S&T) on identical track spans to minimize total line closures.',
              icon: Layers,
              color: '#16a34a'
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                style={{
                  ...cardStyle,
                  background: '#ffffff',
                  padding: 24,
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      background: `${item.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `1px solid ${item.color}30`
                    }}>
                      <Icon size={20} color={item.color} />
                    </div>
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Constraint {idx + 1}</span>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>{item.title}</div>
                    </div>
                  </div>

                  <div style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: item.color,
                    background: `${item.color}10`,
                    padding: '6px 10px',
                    borderRadius: 6,
                    marginBottom: 10
                  }}>
                    {item.question}
                  </div>

                  <p style={{ margin: 0, fontSize: 13, color: '#475569', lineHeight: 1.5 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 3 — HOW RAILSAMANVAYAI WORKS (PIPELINE) */}
      {/* ------------------------------------------------------------------ */}
      <section id="how-it-works" style={{
        background: '#ffffff',
        borderTop: `1px solid ${theme.border}`,
        borderBottom: `1px solid ${theme.border}`,
        padding: '80px 24px'
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '3px 10px',
              borderRadius: 20,
              background: '#eff6ff',
              color: '#1d4ed8',
              fontSize: 11,
              fontWeight: 800,
              textTransform: 'uppercase',
              marginBottom: 10
            }}>
              <Compass size={13} />
              System Architecture & Methodology
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', margin: '0 0 12px' }}>
              From Railway Data to an Actionable Block Plan
            </h2>
            <p style={{ fontSize: 15, color: '#475569', maxWidth: 720, margin: '0 auto' }}>
              A rigorous, sequential decision pipeline separating predictive failure modeling from combinatorial constraint satisfaction.
            </p>
          </div>

          {/* Connected 9-Step Pipeline */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: 12,
            marginBottom: 40
          }}>
            {[
              { step: '01', title: 'Railway & Maintenance Data', desc: 'Raw asset records, defect reports, track histories, traffic graphs.' },
              { step: '02', title: 'Data Preparation & Feature Eng.', desc: 'Normalization, 10 canonical features, condition scores, overdue days.' },
              { step: '03', title: 'Failure-Risk Prediction', desc: 'Calibrated classifier predicts 30-day failure likelihood probability.' },
              { step: '04', title: 'Maintenance Prioritisation', desc: 'Risk-weighted rank combining safety-critical flags and overdue days.' },
              { step: '05', title: 'Candidate Block Generation', desc: 'Feasible possession candidate windows mapped per corridor section.' },
              { step: '06', title: 'Constraint Validation', desc: 'Checking durations, non-overlapping rules, blackout peak hours.' },
              { step: '07', title: 'CP-SAT Optimisation', desc: 'Google OR-Tools solver explores optimal combinatorial assignments.' },
              { step: '08', title: 'Recommended Block Plan', desc: 'Mathematically optimal, bundled, conflict-free possession plan.' },
              { step: '09', title: 'Human Review & Final Schedule', desc: 'Chief Controller inspects, modifies, and sanctions electronic sign-off.' }
            ].map((st, i) => (
              <div
                key={st.step}
                style={{
                  ...cardStyle,
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: 10,
                  padding: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontSize: 18, fontWeight: 900, color: '#1d4ed8' }}>
                      {st.step}
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#64748b' }}>Stage {i + 1}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginBottom: 6, lineHeight: 1.3 }}>
                    {st.title}
                  </div>
                  <p style={{ margin: 0, fontSize: 11, color: '#64748b', lineHeight: 1.4 }}>
                    {st.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Two Highlighted Core Explanations */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 20
          }}>
            <div style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: 12,
              padding: 20
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Activity size={18} color="#2563eb" />
                <span style={{ fontSize: 13, fontWeight: 800, color: '#1e40af', textTransform: 'uppercase' }}>
                  Machine Learning Stage
                </span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
                ML answers:
              </div>
              <div style={{ fontSize: 14, color: '#1e3a8a', fontStyle: 'italic', fontWeight: 600 }}>
                “Which assets are at greater risk and require attention?”
              </div>
            </div>

            <div style={{
              background: '#fefce8',
              border: '1px solid #fef08a',
              borderRadius: 12,
              padding: 20
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Cpu size={18} color="#ca8a04" />
                <span style={{ fontSize: 13, fontWeight: 800, color: '#854d0e', textTransform: 'uppercase' }}>
                  Constraint Programming Stage
                </span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
                Optimisation answers:
              </div>
              <div style={{ fontSize: 14, color: '#713f12', fontStyle: 'italic', fontWeight: 600 }}>
                “When and how can the required maintenance be scheduled while satisfying operational constraints?”
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 4 — CORE INTELLIGENCE */}
      {/* ------------------------------------------------------------------ */}
      <section id="features" style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', margin: '0 0 12px' }}>
            The Intelligence Behind RailSamanvayAI
          </h2>
          <p style={{ fontSize: 15, color: '#475569', maxWidth: 700, margin: '0 auto' }}>
            Three core computational pillars working together to deliver reliable, controller-ready block schedules.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 24
        }}>
          {/* Card 1: Predictive Asset Risk */}
          <div style={{
            ...cardStyle,
            background: '#ffffff',
            padding: 28,
            border: '1px solid #e2e8f0',
            borderRadius: 14,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: '#eff6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
                border: '1px solid #bfdbfe'
              }}>
                <Activity size={22} color="#2563eb" />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 10px' }}>
                Predictive Asset Risk
              </h3>
              <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, margin: '0 0 20px' }}>
                Estimate the probability of future asset failure and use calibrated risk information to support maintenance prioritisation.
              </p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['Machine Learning', 'Risk Prediction', 'Probability Calibration'].map((t, idx) => (
                <span key={idx} style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#1e293b'
                }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Card 2: Constraint-Based Optimisation */}
          <div style={{
            ...cardStyle,
            background: '#ffffff',
            padding: 28,
            border: '1px solid #e2e8f0',
            borderRadius: 14,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: '#fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
                border: '1px solid #fde68a'
              }}>
                <Cpu size={22} color="#d97706" />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 10px' }}>
                Constraint-Based Optimisation
              </h3>
              <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, margin: '0 0 20px' }}>
                Generate feasible combinations of maintenance activities while respecting operational and resource constraints.
              </p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['Google OR-Tools', 'CP-SAT', 'Constraint Programming'].map((t, idx) => (
                <span key={idx} style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#1e293b'
                }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Card 3: Geospatial Planning */}
          <div style={{
            ...cardStyle,
            background: '#ffffff',
            padding: 28,
            border: '1px solid #e2e8f0',
            borderRadius: 14,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: '#f0fdf4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
                border: '1px solid #bbf7d0'
              }}>
                <MapPin size={22} color="#16a34a" />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 10px' }}>
                Geospatial Planning
              </h3>
              <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, margin: '0 0 20px' }}>
                Visualise assets, maintenance locations, railway corridors and proposed maintenance blocks in their network context.
              </p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['Leaflet', 'Railway Network', 'Spatial Planning'].map((t, idx) => (
                <span key={idx} style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#1e293b'
                }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 5 — CONTROL DASHBOARD PREVIEW */}
      {/* ------------------------------------------------------------------ */}
      <section style={{
        background: '#f1f5f9',
        borderTop: `1px solid ${theme.border}`,
        borderBottom: `1px solid ${theme.border}`,
        padding: '80px 24px'
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', margin: '0 0 8px' }}>
              Designed for Railway Control Rooms
            </h2>
            <p style={{ fontSize: 15, color: '#475569', margin: 0 }}>
              Turn complex planning data into a clear operational view.
            </p>
          </div>

          {/* Static Visual Mockup of Control Room Dashboard */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: 16,
            boxShadow: '0 20px 50px rgba(15, 23, 42, 0.08)',
            overflow: 'hidden'
          }}>
            {/* Dashboard Mockup Top Bar */}
            <div style={{
              background: '#0f172a',
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#ffffff',
              fontSize: 12
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Train size={18} color="#38bdf8" />
                <span style={{ fontWeight: 800 }}>RailSamanvayAI Central Traffic Control Room</span>
                <span style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', padding: '2px 8px', borderRadius: 12, fontSize: 10, fontWeight: 700 }}>
                  ● LIVE FEED
                </span>
              </div>
              <div style={{ color: '#94a3b8', fontSize: 11 }}>
                Station Nodes: 124 · Active Corridor Windows: 48
              </div>
            </div>

            {/* Dashboard Grid Modules with Callout Badges */}
            <div style={{ padding: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
              
              {/* Asset Risk Card */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 16, position: 'relative' }}>
                <span style={{ position: 'absolute', top: 12, right: 12, fontSize: 10, fontWeight: 800, background: '#fee2e2', color: '#dc2626', padding: '2px 8px', borderRadius: 4 }}>
                  Callout: Asset Risk
                </span>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>Asset Risk Distribution</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, textAlign: 'center' }}>
                  <div style={{ background: '#ffffff', padding: '10px 4px', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: '#dc2626' }}>14</div>
                    <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700 }}>HIGH RISK</div>
                  </div>
                  <div style={{ background: '#ffffff', padding: '10px 4px', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: '#d97706' }}>28</div>
                    <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700 }}>MEDIUM</div>
                  </div>
                  <div style={{ background: '#ffffff', padding: '10px 4px', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: '#16a34a' }}>82</div>
                    <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700 }}>STABLE</div>
                  </div>
                </div>
              </div>

              {/* Maintenance Tasks Card */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 16, position: 'relative' }}>
                <span style={{ position: 'absolute', top: 12, right: 12, fontSize: 10, fontWeight: 800, background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: 4 }}>
                  Callout: Maintenance Tasks
                </span>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>Registered Demand Queues</div>
                <div style={{ display: 'grid', gap: 6, fontSize: 11 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', background: '#ffffff', padding: '6px 10px', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                    <span>TRD OHE Insulator Overhaul (GZB)</span>
                    <strong style={{ color: '#dc2626' }}>Overdue: 5d</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', background: '#ffffff', padding: '6px 10px', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                    <span>Track Relaying TRT Renewal (NDLS)</span>
                    <strong style={{ color: '#d97706' }}>Overdue: 2d</strong>
                  </div>
                </div>
              </div>

              {/* Block Plan Card */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 16, position: 'relative' }}>
                <span style={{ position: 'absolute', top: 12, right: 12, fontSize: 10, fontWeight: 800, background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: 4 }}>
                  Callout: Block Plan
                </span>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>Optimized Block Allocations</div>
                <div style={{ fontSize: 11, color: '#475569', lineHeight: 1.4, background: '#ffffff', padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }}>
                  <strong>BLK_NDLS-GZB_0913_5:</strong> 23:00 to 03:00 (240 min). Allocated solver: Google OR-Tools CP-SAT. Joint possession saves 114 min line closure.
                </div>
              </div>

              {/* Resource Utilisation Card */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 16, position: 'relative' }}>
                <span style={{ position: 'absolute', top: 12, right: 12, fontSize: 10, fontWeight: 800, background: '#f0fdf4', color: '#16a34a', padding: '2px 8px', borderRadius: 4 }}>
                  Callout: Resource Utilisation
                </span>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>Crew & Machinery Deployment</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, background: '#ffffff', padding: '8px 10px', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                  <span>Tower Wagon Gang: <strong>85% Utilized</strong></span>
                  <span>Tamping Crew: <strong>Active (Slot #2)</strong></span>
                </div>
              </div>

              {/* Schedule Timeline Card */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 16, position: 'relative' }}>
                <span style={{ position: 'absolute', top: 12, right: 12, fontSize: 10, fontWeight: 800, background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: 4 }}>
                  Callout: Schedule
                </span>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>7-Day & 30-Day Rolling Horizons</div>
                <div style={{ fontSize: 11, color: '#475569', background: '#ffffff', padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }}>
                  Weekly corridor possession windows synced with dynamic goods train forecast and festival traffic slots.
                </div>
              </div>

              {/* Network Map Card */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 16, position: 'relative' }}>
                <span style={{ position: 'absolute', top: 12, right: 12, fontSize: 10, fontWeight: 800, background: '#eff6ff', color: '#1d4ed8', padding: '2px 8px', borderRadius: 4 }}>
                  Callout: Network Map
                </span>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>Geospatial CTC Map Module</div>
                <div style={{ fontSize: 11, color: '#475569', background: '#ffffff', padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }}>
                  OpenRailwayMap standard track vectors overlaid with dynamic Google Maps tile basemaps (Roadmap, Satellite, Terrain).
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 6 — HUMAN-IN-THE-LOOP */}
      {/* ------------------------------------------------------------------ */}
      <section style={{
        background: '#0f172a',
        color: '#ffffff',
        padding: '80px 24px'
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 12px',
            borderRadius: 20,
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            color: '#38bdf8',
            fontSize: 11,
            fontWeight: 800,
            textTransform: 'uppercase',
            marginBottom: 14
          }}>
            <ShieldCheck size={14} />
            Institutional Governance & Safety Compliance
          </div>

          <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-0.02em', margin: '0 0 16px' }}>
            AI Recommends. Controllers Decide.
          </h2>

          <p style={{
            fontSize: 16,
            lineHeight: 1.6,
            color: '#94a3b8',
            maxWidth: 760,
            margin: '0 auto 48px'
          }}>
            RailSamanvayAI is designed as a decision-support system. The AI generates a recommended maintenance plan, while the authorised human controller reviews, modifies or approves the final schedule.
          </p>

          {/* Sequential Decision Flow */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 12
          }}>
            {[
              { label: 'AI Prediction', role: 'Calibrated Classifier' },
              { label: 'Risk Assessment', role: 'Feature Ranking' },
              { label: 'Optimisation', role: 'Google OR-Tools' },
              { label: 'Recommendation', role: 'Joint Block Candidate' },
              { label: 'Human Review', role: 'Chief Controller', isHuman: true },
              { label: 'Approve / Modify', role: 'Electronic Sign-Off' },
              { label: 'Final Maintenance Plan', role: 'Operational Schedule' }
            ].map((node, i) => (
              <React.Fragment key={i}>
                <div style={{
                  background: node.isHuman ? '#1d4ed8' : 'rgba(255, 255, 255, 0.06)',
                  border: node.isHuman ? '2px solid #60a5fa' : '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: 10,
                  padding: '12px 16px',
                  textAlign: 'center',
                  minWidth: 120,
                  boxShadow: node.isHuman ? '0 0 20px rgba(59, 130, 246, 0.4)' : 'none'
                }}>
                  {node.isHuman ? (
                    <UserCheck size={20} color="#ffffff" style={{ margin: '0 auto 4px' }} />
                  ) : null}
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#ffffff' }}>{node.label}</div>
                  <div style={{ fontSize: 10, color: node.isHuman ? '#bfdbfe' : '#94a3b8', marginTop: 2 }}>{node.role}</div>
                </div>
                {i < 6 && (
                  <span style={{ color: '#64748b', fontSize: 16, fontWeight: 800 }}>→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 7 — WHO USES RAILSAMANVAYAI */}
      {/* ------------------------------------------------------------------ */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', margin: '0 0 12px' }}>
            Built for Collaborative Railway Maintenance Planning
          </h2>
          <p style={{ fontSize: 15, color: '#475569', maxWidth: 720, margin: '0 auto' }}>
            Designed around Indian Railways divisional structure with clear operational authority hierarchies.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
          
          {/* Primary User Card: OPERATING / TRAFFIC */}
          <div style={{
            ...cardStyle,
            background: '#ffffff',
            border: '2px solid #2563eb',
            borderRadius: 14,
            padding: 24,
            boxShadow: '0 4px 20px rgba(37, 99, 235, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 10, fontWeight: 800, background: '#2563eb', color: '#ffffff', padding: '3px 8px', borderRadius: 4 }}>
                PRIMARY DECISION USER
              </span>
              <Sliders size={20} color="#2563eb" />
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
              OPERATING / TRAFFIC
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', marginBottom: 12 }}>
              Chief Controller / Dy. Chief Controller / Section Controller
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: '#334155', margin: 0 }}>
              Reviews recommended maintenance blocks, evaluates operational impact and approves or modifies the final plan.
            </p>
          </div>

          {/* Supporting: ENGINEERING */}
          <div style={{ ...cardStyle, background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 10, fontWeight: 700, background: '#fef3c7', color: '#d97706', padding: '3px 8px', borderRadius: 4 }}>
                SUPPORTING USER
              </span>
              <Wrench size={20} color="#d97706" />
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
              ENGINEERING
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: '#475569', margin: 0 }}>
              Provides track and infrastructure maintenance requirements.
            </p>
          </div>

          {/* Supporting: S&T */}
          <div style={{ ...cardStyle, background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 10, fontWeight: 700, background: '#f3e8ff', color: '#7c3aed', padding: '3px 8px', borderRadius: 4 }}>
                SUPPORTING USER
              </span>
              <Radio size={20} color="#7c3aed" />
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
              S&T (Signal & Telecom)
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: '#475569', margin: 0 }}>
              Provides signalling and telecommunications maintenance requirements.
            </p>
          </div>

          {/* Supporting: ELECTRICAL / TRD */}
          <div style={{ ...cardStyle, background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 10, fontWeight: 700, background: '#e0f2fe', color: '#0284c7', padding: '3px 8px', borderRadius: 4 }}>
                SUPPORTING USER
              </span>
              <Zap size={20} color="#0284c7" />
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
              ELECTRICAL / TRD
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: '#475569', margin: 0 }}>
              Provides traction and electrical maintenance requirements.
            </p>
          </div>

          {/* Supporting: OTHER MAINTENANCE TEAMS */}
          <div style={{ ...cardStyle, background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 10, fontWeight: 700, background: '#dcfce7', color: '#16a34a', padding: '3px 8px', borderRadius: 4 }}>
                SUPPORTING USER
              </span>
              <Layers size={20} color="#16a34a" />
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
              OTHER MAINTENANCE TEAMS
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: '#475569', margin: 0 }}>
              Provide department-specific maintenance requirements and resource information.
            </p>
          </div>

          {/* Supporting: HIGHER OPERATIONS MANAGEMENT */}
          <div style={{ ...cardStyle, background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 10, fontWeight: 700, background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: 4 }}>
                EXECUTIVE OVERSIGHT
              </span>
              <BarChart3 size={20} color="#0f172a" />
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
              HIGHER OPERATIONS MANAGEMENT
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: '#475569', margin: 0 }}>
              Sr.DOM / authorized officers perform divisional oversight, KPI monitoring and final policy approval.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 8 — DATA TO DECISION (VISUAL PIPELINE) */}
      {/* ------------------------------------------------------------------ */}
      <section style={{
        background: '#ffffff',
        borderTop: `1px solid ${theme.border}`,
        borderBottom: `1px solid ${theme.border}`,
        padding: '80px 24px'
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', margin: '0 0 10px' }}>
            Data to Decision Pipeline
          </h2>
          <p style={{ fontSize: 14, color: '#64748b', marginBottom: 40 }}>
            How input infrastructure parameters are transformed into verified block sanctions.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 680, margin: '0 auto' }}>
            
            {/* Box 1: DATA */}
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 10, padding: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
                1. DATA
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                Asset Information • Maintenance Tasks • Failure Indicators • Train/Network Information • Possession Windows • Resources
              </div>
            </div>

            <div style={{ color: '#94a3b8', fontSize: 18, fontWeight: 900 }}>↓</div>

            {/* Box 2: RISK */}
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: '#dc2626', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
                2. RISK
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#991b1b' }}>
                Failure-Risk Prediction (Calibrated 30-Day Failure Likelihood)
              </div>
            </div>

            <div style={{ color: '#94a3b8', fontSize: 18, fontWeight: 900 }}>↓</div>

            {/* Box 3: PRIORITY */}
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: '#d97706', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
                3. PRIORITY
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#92400e' }}>
                Risk-Aware Maintenance Prioritisation (Dynamic Safety Cascade)
              </div>
            </div>

            <div style={{ color: '#94a3b8', fontSize: 18, fontWeight: 900 }}>↓</div>

            {/* Box 4: OPTIMISATION */}
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: '#2563eb', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
                4. OPTIMISATION
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#1e40af' }}>
                Constraint Validation + CP-SAT Scheduling (Google OR-Tools)
              </div>
            </div>

            <div style={{ color: '#94a3b8', fontSize: 18, fontWeight: 900 }}>↓</div>

            {/* Box 5: RECOMMENDATION */}
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: '#16a34a', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
                5. RECOMMENDATION
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#166534' }}>
                Feasible Maintenance Block Plan (Multi-Department Joint Possession)
              </div>
            </div>

            <div style={{ color: '#94a3b8', fontSize: 18, fontWeight: 900 }}>↓</div>

            {/* Box 6: HUMAN DECISION */}
            <div style={{ background: '#0f172a', color: '#ffffff', borderRadius: 10, padding: 18, border: '2px solid #38bdf8' }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: '#38bdf8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
                6. HUMAN DECISION
              </div>
              <div style={{ fontSize: 15, fontWeight: 900, color: '#ffffff' }}>
                Controller Review · Modify / Approve Final Plan
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 9 — KEY CAPABILITIES */}
      {/* ------------------------------------------------------------------ */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', margin: '0 0 10px' }}>
            Platform Key Capabilities
          </h2>
          <p style={{ fontSize: 15, color: '#475569', maxWidth: 640, margin: '0 auto' }}>
            High-performance operational capabilities built for Indian Railways demands.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 20
        }}>
          {[
            {
              title: 'Predictive Asset Risk',
              desc: 'Estimates 30-day failure likelihood probability across physical track, catenary, and signalling gear.',
              icon: Activity
            },
            {
              title: 'Risk-Aware Prioritisation',
              desc: 'Ranks maintenance backlog combining failure risk probabilities with statutory overdue thresholds.',
              icon: AlertTriangle
            },
            {
              title: 'Constraint Validation',
              desc: 'Rigidly verifies machine speeds, possession buffer periods, and peak-hour operational restrictions.',
              icon: CheckCircle2
            },
            {
              title: 'CP-SAT Block Optimisation',
              desc: 'Google OR-Tools solver resolves complex section sharing and bundles concurrent works seamlessly.',
              icon: Cpu
            },
            {
              title: 'Geospatial Planning',
              desc: 'Centralized Traffic Control mapping of 3,420+ network nodes with live rail route analysis.',
              icon: MapPin
            },
            {
              title: 'Schedule & Resource Management',
              desc: 'Coordinates Tower Wagon gangs and mechanised tamping crews across 7-day and 30-day horizons.',
              icon: Calendar
            }
          ].map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div
                key={idx}
                className="card-hover"
                style={{
                  ...cardStyle,
                  background: '#ffffff',
                  padding: 22,
                  border: '1px solid #e2e8f0',
                  borderRadius: 12
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: '#eff6ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #bfdbfe'
                  }}>
                    <Icon size={18} color="#2563eb" />
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>{cap.title}</div>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: '#475569', lineHeight: 1.5 }}>
                  {cap.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 10 — TECHNOLOGY */}
      {/* ------------------------------------------------------------------ */}
      <section id="technology" style={{
        background: '#ffffff',
        borderTop: `1px solid ${theme.border}`,
        borderBottom: `1px solid ${theme.border}`,
        padding: '80px 24px'
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', margin: '0 0 10px' }}>
              Technology Behind the Platform
            </h2>
            <p style={{ fontSize: 15, color: '#475569', maxWidth: 640, margin: '0 auto' }}>
              Built with open, modern, enterprise-grade engineering frameworks.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 20
          }}>
            <div style={{ background: '#f8fafc', padding: 20, borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', marginBottom: 8 }}>Frontend</div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#334155', lineHeight: 1.7 }}>
                <li>React 18</li>
                <li>Tailwind CSS</li>
                <li>Leaflet & Google Maps</li>
              </ul>
            </div>

            <div style={{ background: '#f8fafc', padding: 20, borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#16a34a', textTransform: 'uppercase', marginBottom: 8 }}>Backend</div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#334155', lineHeight: 1.7 }}>
                <li>FastAPI</li>
                <li>SQLAlchemy</li>
                <li>JWT Security</li>
              </ul>
            </div>

            <div style={{ background: '#f8fafc', padding: 20, borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#d97706', textTransform: 'uppercase', marginBottom: 8 }}>AI & Optimisation</div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#334155', lineHeight: 1.7 }}>
                <li>Scikit-learn / Calibrated</li>
                <li>Google OR-Tools CP-SAT</li>
                <li>Temporal Validation</li>
              </ul>
            </div>

            <div style={{ background: '#f8fafc', padding: 20, borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase', marginBottom: 8 }}>Data Storage</div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#334155', lineHeight: 1.7 }}>
                <li>SQLite Canonical</li>
                <li>PostgreSQL Ready</li>
                <li>Alembic Migrations</li>
              </ul>
            </div>

            <div style={{ background: '#f8fafc', padding: 20, borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', marginBottom: 8 }}>Deployment</div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#334155', lineHeight: 1.7 }}>
                <li>Vercel (Frontend)</li>
                <li>Render (API)</li>
                <li>Docker Ready</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 11 — CTA */}
      {/* ------------------------------------------------------------------ */}
      <section style={{
        background: '#0f172a',
        color: '#ffffff',
        padding: '72px 24px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: 840, margin: '0 auto' }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-0.02em', margin: '0 0 16px' }}>
            Turn Maintenance Data Into Better Block Plans
          </h2>
          <p style={{
            fontSize: 16,
            color: '#94a3b8',
            lineHeight: 1.6,
            margin: '0 auto 36px',
            maxWidth: 680
          }}>
            Use AI-assisted risk assessment and constraint-based optimisation to support safer, more coordinated maintenance planning.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
            <button
              onClick={handleEnterDashboard}
              style={{
                ...buttonPrimary,
                padding: '14px 28px',
                fontSize: 15,
                fontWeight: 800,
                borderRadius: 8,
                background: '#2563eb',
                boxShadow: '0 4px 20px rgba(37, 99, 235, 0.4)'
              }}
            >
              Enter Control Dashboard →
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              style={{
                ...buttonSecondary,
                padding: '14px 24px',
                fontSize: 15,
                fontWeight: 700,
                borderRadius: 8,
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              Explore How It Works
            </button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* FOOTER */}
      {/* ------------------------------------------------------------------ */}
      <footer id="about" style={{
        background: '#020617',
        color: '#94a3b8',
        padding: '48px 24px 32px',
        borderTop: '1px solid #1e293b'
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 32,
            paddingBottom: 36,
            borderBottom: '1px solid #1e293b'
          }}>
            <div style={{ maxWidth: 420 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#ffffff', marginBottom: 10 }}>
                <Train size={24} color="#38bdf8" />
                <span style={{ fontSize: 20, fontWeight: 900 }}>RailSamanvayAI</span>
              </div>
              <div style={{ fontSize: 13, color: '#cbd5e1', fontWeight: 700, marginBottom: 8 }}>
                AI-Powered Automatic Block Planning for Indian Railways
              </div>
              <p style={{ margin: 0, fontSize: 12, lineHeight: 1.6, color: '#64748b' }}>
                Smart India Hackathon 2026 • Problem Statement SIH26027.<br />
                Ministry of Railways, Government of India.
              </p>
            </div>

            <div>
              <div style={{ color: '#ffffff', fontSize: 13, fontWeight: 800, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Navigation
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
                <button onClick={() => scrollToSection('overview')} style={{ textAlign: 'left', background: 'none', border: 0, color: '#94a3b8', cursor: 'pointer', padding: 0 }}>Overview</button>
                <button onClick={() => scrollToSection('how-it-works')} style={{ textAlign: 'left', background: 'none', border: 0, color: '#94a3b8', cursor: 'pointer', padding: 0 }}>How It Works</button>
                <button onClick={() => scrollToSection('features')} style={{ textAlign: 'left', background: 'none', border: 0, color: '#94a3b8', cursor: 'pointer', padding: 0 }}>Features</button>
                <button onClick={() => scrollToSection('technology')} style={{ textAlign: 'left', background: 'none', border: 0, color: '#94a3b8', cursor: 'pointer', padding: 0 }}>Technology</button>
                <button onClick={handleEnterDashboard} style={{ textAlign: 'left', background: 'none', border: 0, color: '#38bdf8', fontWeight: 700, cursor: 'pointer', padding: 0 }}>Control Dashboard →</button>
              </div>
            </div>

            <div>
              <div style={{ color: '#ffffff', fontSize: 13, fontWeight: 800, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Development Team
              </div>
              <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.7 }}>
                <div><strong>Debosmita Mukhopadhyay</strong> — Team Leader</div>
                <div><strong>Gaurav Gautam</strong> — Team Member</div>
                <div><strong>Shashwat Sahu</strong> — Team Member</div>
                <div><strong>Parinita Ramsagar</strong> — Team Member</div>
                <div><strong>Likhita Ganga</strong> — Team Member</div>
                <div><strong>Shubham Sagar</strong> — Team Member</div>
              </div>
            </div>
          </div>

          <div style={{
            paddingTop: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 11,
            color: '#64748b',
            flexWrap: 'wrap',
            gap: 10
          }}>
            <div>
              © 2026 RailSamanvayAI · Ministry of Railways, Government of India.
            </div>
            <div>
              Predict. Prioritize. Optimize. Coordinate.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
