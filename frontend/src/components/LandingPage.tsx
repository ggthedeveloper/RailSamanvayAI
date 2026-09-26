import React, { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Train, ShieldCheck, Activity, MapPin, Layers, ListTodo,
  Calendar, Compass, AlertTriangle, FileCheck, Database,
  Settings, Cpu, Play, CheckCircle2, ArrowRight, Wrench,
  Zap, Radio, Sliders, BarChart3, Users, Sparkles, Lock,
  Mail, User as UserIcon, ExternalLink, RefreshCw, LucideIcon
} from 'lucide-react';
import { API_URL, GOOGLE_MAPS_API_KEY, theme, cardStyle, badgeStyle, inputStyle, buttonPrimary, buttonSecondary, apiError } from '../theme';

interface LandingPageProps {
  setToken: (token: string) => void;
}

interface DepartmentRole {
  id: string;
  department: string;
  departmentCategory: 'operating' | 'engineering' | 'snt' | 'electrical' | 'other' | 'executive';
  userRole: string;
  isPrimary?: boolean;
  badge: string;
  badgeBg: string;
  badgeColor: string;
  icon: LucideIcon;
  accentColor: string;
  whatTheyDo: string;
  keyResponsibilities: string[];
  systemCapabilities: string[];
  defaultEmail: string;
  defaultName: string;
}

export function LandingPage({ setToken }: LandingPageProps) {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Form State
  const [email, setEmail] = useState<string>('chief.controller@railsamanvay.gov.in');
  const [password, setPassword] = useState<string>('admin123');
  const [fullName, setFullName] = useState<string>('Chief Controller');
  const [selectedRoleName, setSelectedRoleName] = useState<string>('Chief Controller');

  const departmentRoles: DepartmentRole[] = [
    {
      id: 'operating',
      department: 'Operating / Traffic',
      departmentCategory: 'operating',
      userRole: 'Chief Controller / Dy. Chief Controller / Section Controller',
      isPrimary: true,
      badge: 'PRIMARY OPERATIONAL USER',
      badgeBg: 'rgba(37, 99, 235, 0.12)',
      badgeColor: '#2563eb',
      icon: Sliders,
      accentColor: '#2563eb',
      whatTheyDo: 'Primary user — reviews optimized blocks, checks train-operation impact, modifies/approves plan.',
      keyResponsibilities: [
        'Reviews Google OR-Tools CP-SAT generated maintenance block schedules across national corridors.',
        'Assesses train-operation punctuality loss, freight transit impact, and path conflicts in real time.',
        'Adjusts block start/end times and issues formal electronic possession approvals with digital remarks.'
      ],
      systemCapabilities: [
        'Central Operations Overview & Live CTC Corridor Map',
        'Multi-Department Joint Possession Verification',
        'Dynamic Conflict Resolution & Section Overlap Alerter',
        'Official Possession Sign-Off Workspace'
      ],
      defaultEmail: 'chief.controller@railsamanvay.gov.in',
      defaultName: 'Chief Controller (Operating)'
    },
    {
      id: 'engineering',
      department: 'Engineering',
      departmentCategory: 'engineering',
      userRole: 'Engineering/Track maintenance planner',
      badge: 'CIVIL & TRACK INFRASTRUCTURE',
      badgeBg: 'rgba(217, 119, 6, 0.12)',
      badgeColor: '#d97706',
      icon: Wrench,
      accentColor: '#d97706',
      whatTheyDo: 'Submits track/bridge/civil maintenance requirements.',
      keyResponsibilities: [
        'Registers track renewal, rail fracture inspection, sleeper replacement, and bridge rehabilitation blocks.',
        'Schedules heavy mechanized equipment including Track Relaying Trains (TRT), BCMs, and mechanised tamping crews.',
        'Flags safety-critical track defects and tracks days overdue to prioritize emergency possessions.'
      ],
      systemCapabilities: [
        'Track Asset Risk Ranking via 30-Day Failure Prediction ML',
        'Heavy Machine Gang Allocation & Dependency Tagging',
        'Corridor Speed Restriction & Single Line Working Coordinators',
        'Historical Asset Degradation Tracking'
      ],
      defaultEmail: 'eng.planner@railsamanvay.gov.in',
      defaultName: 'Track Maintenance Planner'
    },
    {
      id: 'snt',
      department: 'S&T',
      departmentCategory: 'snt',
      userRole: 'S&T maintenance planner',
      badge: 'SIGNALLING & TELECOM',
      badgeBg: 'rgba(124, 58, 237, 0.12)',
      badgeColor: '#7c3aed',
      icon: Radio,
      accentColor: '#7c3aed',
      whatTheyDo: 'Submits signalling/telecommunication maintenance requirements.',
      keyResponsibilities: [
        'Schedules periodic servicing for Point Machines, Electronic Interlocking (EI), Axle Counters, and Relay Gangs.',
        'Coordinates optical fibre cable (OFC) maintenance and track circuit replacement blocks.',
        'Bundles signalling possessions synchronously with Engineering track blocks to eliminate secondary line closure.'
      ],
      systemCapabilities: [
        'Automated Joint-Possession Bundling with Engineering',
        'Critical Point Machine & Signal Failure Risk Analytics',
        'Signalling Relay Gang Resource Scheduling',
        'Electronic Interlocking Safety Interlock Validation'
      ],
      defaultEmail: 'snt.planner@railsamanvay.gov.in',
      defaultName: 'S&T Maintenance Planner'
    },
    {
      id: 'electrical',
      department: 'Electrical / TRD',
      departmentCategory: 'electrical',
      userRole: 'TRD/OHE maintenance planner',
      badge: 'TRACTION & OHE POWER',
      badgeBg: 'rgba(2, 132, 199, 0.12)',
      badgeColor: '#0284c7',
      icon: Zap,
      accentColor: '#0284c7',
      whatTheyDo: 'Submits traction/OHE maintenance requirements.',
      keyResponsibilities: [
        'Requests power blocks for 25kV AC overhead catenary inspection, insulator cleaning, and contact wire replacement.',
        'Deploys Tower Wagon gangs and traction sub-station maintenance crews during low-density night windows.',
        'Coordinates traction feeder isolation with Section Controllers to safeguard electric loco passages.'
      ],
      systemCapabilities: [
        'Traction Power Block Catenary Isolation Scheduler',
        'Tower Wagon Gang Route-Tracking & Availability Engine',
        'Peak Hours Avoidance Rule Enforcer (06:00-10:00 & 17:00-21:00)',
        'Joint TRD + Civil Line Closure Optimisation'
      ],
      defaultEmail: 'trd.planner@railsamanvay.gov.in',
      defaultName: 'TRD/OHE Maintenance Planner'
    },
    {
      id: 'other',
      department: 'Other maintenance departments',
      departmentCategory: 'other',
      userRole: 'Departmental planner',
      badge: 'SUPPORT & ROLLING STOCK',
      badgeBg: 'rgba(16, 185, 129, 0.12)',
      badgeColor: '#16a34a',
      icon: Layers,
      accentColor: '#16a34a',
      whatTheyDo: 'Submits relevant maintenance requirements/resources.',
      keyResponsibilities: [
        'Submits Carriage & Wagon (C&W) rolling stock inspection line occupation slots and yard maintenance needs.',
        'Coordinates special breakdown crane movements, rail-cum-road vehicle transits, and track safety trials.',
        'Manages multi-departmental auxiliary equipment allocation across divisional yard sections.'
      ],
      systemCapabilities: [
        'Rolling Stock Maintenance Track Allocation',
        'Special Machine Transit Slot Coordination',
        'Cross-Department Equipment Clash Detector',
        'Auxiliary Crew & Resource Deployment Matrix'
      ],
      defaultEmail: 'dept.planner@railsamanvay.gov.in',
      defaultName: 'Departmental Planner (C&W / Mech)'
    },
    {
      id: 'executive',
      department: 'Higher Operations Management',
      departmentCategory: 'executive',
      userRole: 'Sr.DOM / authorized officer',
      badge: 'EXECUTIVE OVERSIGHT',
      badgeBg: 'rgba(15, 23, 42, 0.08)',
      badgeColor: '#0f172a',
      icon: BarChart3,
      accentColor: '#0f172a',
      whatTheyDo: 'Oversight / approval depending on workflow.',
      keyResponsibilities: [
        'Maintains high-level oversight over division-wide corridor punctuality and asset availability metrics.',
        'Resolves escalated inter-departmental conflicts when track demands collide with high-priority freight/passenger paths.',
        'Authorizes major corridor mega-blocks and reviews system-wide optimization performance KPIs.'
      ],
      systemCapabilities: [
        'Executive Corridor Availability KPI Dashboard',
        'Division-Wide Maintenance Backlog Trend Analytics',
        'Mega-Block Exception Approval & Audit Trail',
        'Automated Provenance & Compliance Audit Logs'
      ],
      defaultEmail: 'sr.dom@railsamanvay.gov.in',
      defaultName: 'Sr. DOM (Authorized Officer)'
    }
  ];

  const filteredRoles = selectedCategory === 'all'
    ? departmentRoles
    : departmentRoles.filter(r => r.departmentCategory === selectedCategory);

  const handleQuickLoginAsRole = async (role: DepartmentRole) => {
    setEmail(role.defaultEmail);
    setPassword('admin123');
    setFullName(role.defaultName);
    setSelectedRoleName(role.userRole);

    setAuthLoading(true);
    setAuthError('');

    try {
      const form = new URLSearchParams({
        username: role.defaultEmail.trim().toLowerCase(),
        password: 'admin123'
      });
      const { data } = await axios.post<{ access_token: string }>(
        `${API_URL}/auth/token`,
        form,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        setToken(data.access_token);
        navigate('/overview');
      }
    } catch {
      // Fallback: try default seeded admin credentials if needed
      try {
        const form = new URLSearchParams({
          username: 'debosmita12@gmail.com',
          password: 'admin123'
        });
        const { data } = await axios.post<{ access_token: string }>(
          `${API_URL}/auth/token`,
          form,
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        if (data.access_token) {
          localStorage.setItem('token', data.access_token);
          setToken(data.access_token);
          navigate('/overview');
        }
      } catch (err2) {
        setAuthError(apiError(err2, 'Authentication failed. Please check the backend connection.'));
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    const cleanEmail = email.trim().toLowerCase();
    try {
      if (activeTab === 'register') {
        await axios.post(`${API_URL}/auth/register`, {
          email: cleanEmail,
          password,
          full_name: fullName.trim() || 'Indian Railways Officer'
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
      navigate('/overview');
    } catch (err) {
      setAuthError(apiError(err, 'Authentication failed. Please verify your credentials.'));
    } finally {
      setAuthLoading(false);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: theme.text, fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* ------------------------------------------------------------------ */}
      {/* TOP GOVERNMENT OF INDIA & SIH BANNER */}
      {/* ------------------------------------------------------------------ */}
      <div style={{
        background: '#0f172a',
        color: '#94a3b8',
        fontSize: 11,
        padding: '6px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #1e293b',
        flexWrap: 'wrap',
        gap: 8
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: '#38bdf8', fontWeight: 700 }}>
            🇮🇳 GOVERNMENT OF INDIA
          </span>
          <span>•</span>
          <span>MINISTRY OF RAILWAYS</span>
          <span>•</span>
          <span style={{ color: '#f59e0b', fontWeight: 600 }}>
            Smart India Hackathon 2026 — Problem Statement SIH26027
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#22c55e', fontWeight: 600 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
            Google OR-Tools CP-SAT & Google Maps Connected
          </span>
          <span>FastAPI v1.0</span>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* MAIN NAVIGATION BAR */}
      {/* ------------------------------------------------------------------ */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${theme.border}`,
        padding: '12px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44,
            height: 44,
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
              <span style={{ fontSize: 20, fontWeight: 800, color: theme.text, letterSpacing: '-0.02em' }}>
                RailSamanvayAI
              </span>
              <span style={{
                fontSize: 10,
                fontWeight: 800,
                background: '#dbeafe',
                color: '#1d4ed8',
                padding: '2px 6px',
                borderRadius: 4
              }}>
                IR-BLOCK-AI
              </span>
            </div>
            <div style={{ fontSize: 11, color: theme.textDim, fontWeight: 600, letterSpacing: '0.02em' }}>
              Automatic Block Planning & Multi-Department Synergy Engine
            </div>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 24, fontSize: 13, fontWeight: 600 }}>
          <button
            onClick={() => scrollToSection('hero')}
            style={{ background: 'none', border: 0, color: theme.textMuted, cursor: 'pointer', padding: '6px 0' }}
          >
            Overview
          </button>
          <button
            onClick={() => scrollToSection('roles')}
            style={{ background: 'none', border: 0, color: theme.blue, cursor: 'pointer', padding: '6px 0', fontWeight: 700 }}
          >
            Departmental Roles
          </button>
          <button
            onClick={() => scrollToSection('matrix')}
            style={{ background: 'none', border: 0, color: theme.textMuted, cursor: 'pointer', padding: '6px 0' }}
          >
            Role Matrix
          </button>
          <button
            onClick={() => scrollToSection('workflow')}
            style={{ background: 'none', border: 0, color: theme.textMuted, cursor: 'pointer', padding: '6px 0' }}
          >
            Planning Workflow
          </button>
          <button
            onClick={() => scrollToSection('signin')}
            style={{
              ...buttonPrimary,
              padding: '8px 16px',
              fontSize: 12,
              borderRadius: 8
            }}
          >
            <Lock size={13} />
            Enter Control Room
          </button>
        </nav>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* HERO SECTION */}
      {/* ------------------------------------------------------------------ */}
      <section id="hero" style={{
        position: 'relative',
        padding: '64px 28px 72px',
        overflow: 'hidden',
        background: '#0f172a',
        color: '#ffffff'
      }}>
        {/* Background Image Layer */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: "url('/train_landscape.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.28,
          zIndex: 0
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(15,23,42,0.7) 0%, rgba(15,23,42,0.95) 100%)',
          zIndex: 1
        }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '5px 14px',
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            borderRadius: 30,
            fontSize: 12,
            fontWeight: 700,
            color: '#38bdf8',
            marginBottom: 20
          }}>
            <Sparkles size={14} />
            Next-Generation Decision Support for Indian Railways
          </div>

          <h1 style={{
            fontSize: 44,
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            margin: '0 auto 18px',
            maxWidth: 960
          }}>
            AI-Powered Automatic Block Planning to Maximize Track Asset Availability
          </h1>

          <p style={{
            fontSize: 16,
            color: '#94a3b8',
            maxWidth: 780,
            margin: '0 auto 32px',
            lineHeight: 1.6
          }}>
            Eliminate multi-departmental friction across Indian Railways. RailSamanvayAI integrates 
            <strong> 30-Day Failure Risk Prediction</strong>, <strong>Google OR-Tools CP-SAT Synergy Optimisation</strong>, 
            and <strong>Geospatial CTC Visualisation</strong> to deliver safe, feasible, conflict-free maintenance blocks.
          </p>

          {/* Quick CTA Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 48 }}>
            <button
              onClick={() => handleQuickLoginAsRole(departmentRoles[0])}
              style={{
                ...buttonPrimary,
                padding: '12px 24px',
                fontSize: 14,
                borderRadius: 9,
                boxShadow: '0 4px 20px rgba(37, 99, 235, 0.4)'
              }}
            >
              <Train size={16} />
              Launch as Chief Controller (Primary User)
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => scrollToSection('roles')}
              style={{
                ...buttonSecondary,
                padding: '12px 22px',
                fontSize: 14,
                borderRadius: 9,
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <Users size={16} />
              Explore Departmental User Roles
            </button>
          </div>

          {/* 4 Feature Metrics Banner */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 16,
            textAlign: 'left'
          }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 10, padding: 18 }}>
              <div style={{ color: '#38bdf8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                Multi-Department Synergy
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#ffffff' }}>4 Core Sectors</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                Civil Track, Signalling & Telecom, Traction TRD, and Traffic Control unified.
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 10, padding: 18 }}>
              <div style={{ color: '#4ade80', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                Predictive Risk Engine
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#ffffff' }}>30-Day Horizon</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                Calibrated ML model predicts asset-failure probability before disruptions occur.
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 10, padding: 18 }}>
              <div style={{ color: '#fbbf24', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                Constraint Programming
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#ffffff' }}>Google OR-Tools</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                CP-SAT solver bundles joint possessions and saves up to 45% corridor closure time.
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 10, padding: 18 }}>
              <div style={{ color: '#c084fc', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                Geospatial CTC Display
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#ffffff' }}>Google Maps</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                Dynamic Roadmap, Satellite Hybrid, Terrain, & OpenRailwayMap track overlay.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* DEPARTMENTAL ROLES & USER TYPES (THE REQUESTED CORE SECTION) */}
      {/* ------------------------------------------------------------------ */}
      <section id="roles" style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '3px 10px',
            borderRadius: 20,
            background: 'rgba(37, 99, 235, 0.1)',
            color: '#2563eb',
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginBottom: 8
          }}>
            <Users size={13} />
            User Roles & Departmental Workspaces
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: theme.text, letterSpacing: '-0.02em', margin: '0 0 10px' }}>
            Who Uses RailSamanvayAI & What They Do
          </h2>
          <p style={{ fontSize: 14, color: theme.textMuted, maxWidth: 720, margin: '0 auto' }}>
            Each railway department plays a specialized, mission-critical role in the block planning lifecycle. 
            Select any role below to explore their operational scope and launch their dedicated workspace.
          </p>
        </div>

        {/* Department Filter Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          flexWrap: 'wrap',
          marginBottom: 32
        }}>
          {[
            { id: 'all', label: 'All Departments (6)' },
            { id: 'operating', label: 'Operating / Traffic (Primary)' },
            { id: 'engineering', label: 'Engineering' },
            { id: 'snt', label: 'S&T' },
            { id: 'electrical', label: 'Electrical / TRD' },
            { id: 'other', label: 'Other Departments' },
            { id: 'executive', label: 'Higher Management' }
          ].map(tab => {
            const isSelected = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: isSelected ? '1px solid #2563eb' : `1px solid ${theme.border}`,
                  background: isSelected ? '#2563eb' : '#ffffff',
                  color: isSelected ? '#ffffff' : theme.textMuted,
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 2px 8px rgba(37, 99, 235, 0.25)' : 'none'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Roles Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 20
        }}>
          {filteredRoles.map(role => {
            const Icon = role.icon;
            return (
              <div
                key={role.id}
                style={{
                  ...cardStyle,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: `4px solid ${role.accentColor}`,
                  position: 'relative',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                }}
              >
                <div>
                  {/* Card Header: Department & Category Badge */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 38,
                        height: 38,
                        borderRadius: 8,
                        background: `${role.accentColor}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `1px solid ${role.accentColor}30`
                      }}>
                        <Icon size={20} color={role.accentColor} />
                      </div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: theme.text }}>
                          {role.department}
                        </div>
                        <div style={{ fontSize: 11, color: theme.textDim }}>
                          Departmental Entity
                        </div>
                      </div>
                    </div>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: 6,
                      fontSize: 10,
                      fontWeight: 800,
                      letterSpacing: '0.04em',
                      background: role.badgeBg,
                      color: role.badgeColor,
                      border: `1px solid ${role.badgeColor}33`
                    }}>
                      {role.badge}
                    </span>
                  </div>

                  {/* User Role Title */}
                  <div style={{
                    padding: '8px 12px',
                    background: '#f8fafc',
                    border: `1px solid ${theme.border}`,
                    borderRadius: 8,
                    marginBottom: 14
                  }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: theme.textDim, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Designated User Role
                    </span>
                    <div style={{ fontSize: 13, fontWeight: 800, color: role.isPrimary ? '#1d4ed8' : theme.text, marginTop: 2 }}>
                      {role.userRole}
                    </div>
                  </div>

                  {/* What They Do In Your System */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: theme.cyan, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                      What They Do In RailSamanvayAI
                    </div>
                    <p style={{
                      margin: 0,
                      fontSize: 13,
                      lineHeight: 1.5,
                      color: role.isPrimary ? '#0f172a' : theme.textMuted,
                      fontWeight: role.isPrimary ? 600 : 400
                    }}>
                      {role.whatTheyDo}
                    </p>
                  </div>

                  {/* Key Operational Tasks */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: theme.textDim, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                      Key Responsibilities & Inputs
                    </div>
                    <div style={{ display: 'grid', gap: 6 }}>
                      {role.keyResponsibilities.map((resp, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: theme.textMuted, lineHeight: 1.4 }}>
                          <CheckCircle2 size={13} color={role.accentColor} style={{ marginTop: 2, flexShrink: 0 }} />
                          <span>{resp}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* System Tools Available */}
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: theme.textDim, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                      Tailored System Tools
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {role.systemCapabilities.map((cap, idx) => (
                        <span key={idx} style={{
                          padding: '2px 7px',
                          background: '#ffffff',
                          border: `1px solid ${theme.border}`,
                          borderRadius: 4,
                          fontSize: 10,
                          fontWeight: 600,
                          color: theme.textMuted
                        }}>
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Direct Action: Launch as Role */}
                <div style={{
                  paddingTop: 14,
                  borderTop: `1px solid ${theme.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8
                }}>
                  <div style={{ fontSize: 11, color: theme.textDim }}>
                    Pre-seeded Account:<br />
                    <code style={{ fontSize: 10, color: theme.text }}>{role.defaultEmail}</code>
                  </div>
                  <button
                    onClick={() => handleQuickLoginAsRole(role)}
                    disabled={authLoading}
                    style={{
                      ...buttonPrimary,
                      padding: '8px 14px',
                      fontSize: 11,
                      borderRadius: 6,
                      background: role.isPrimary ? '#2563eb' : '#ffffff',
                      color: role.isPrimary ? '#ffffff' : '#0f172a',
                      border: role.isPrimary ? '1px solid #1d4ed8' : `1px solid ${theme.borderLight}`
                    }}
                  >
                    {authLoading ? (
                      <RefreshCw size={12} className="animate-spin" />
                    ) : (
                      <ArrowRight size={12} />
                    )}
                    Sign In as Role
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* OFFICIAL ROLE COMPARISON MATRIX TABLE */}
      {/* ------------------------------------------------------------------ */}
      <section id="matrix" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 64px' }}>
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: theme.text, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileCheck size={20} color="#2563eb" />
                Departmental Role Matrix & Responsibility Directory
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: theme.textMuted }}>
                Formal mapping of departmental user roles to functional block planning capabilities in RailSamanvayAI.
              </p>
            </div>
            <span style={badgeStyle('rgba(37,99,235,0.1)', '#2563eb')}>
              SIH26027 Specification Compliant
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: `2px solid ${theme.border}` }}>
                  <th style={{ padding: '10px 14px', fontWeight: 800, color: theme.text, width: '22%' }}>Department</th>
                  <th style={{ padding: '10px 14px', fontWeight: 800, color: theme.text, width: '28%' }}>User Role</th>
                  <th style={{ padding: '10px 14px', fontWeight: 800, color: theme.text, width: '38%' }}>What they do in your system</th>
                  <th style={{ padding: '10px 14px', fontWeight: 800, color: theme.text, width: '12%', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {departmentRoles.map((role, idx) => (
                  <tr
                    key={role.id}
                    style={{
                      borderBottom: `1px solid ${theme.border}`,
                      background: idx % 2 === 0 ? '#ffffff' : '#f8fafc'
                    }}
                  >
                    <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                      <div style={{ fontWeight: 800, color: theme.text }}>
                        {role.department}
                      </div>
                      <span style={{
                        display: 'inline-block',
                        marginTop: 4,
                        padding: '2px 6px',
                        borderRadius: 4,
                        fontSize: 9,
                        fontWeight: 700,
                        background: role.badgeBg,
                        color: role.badgeColor
                      }}>
                        {role.badge}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                      <div style={{ fontWeight: 700, color: role.isPrimary ? '#1d4ed8' : '#334155' }}>
                        {role.userRole}
                      </div>
                      <div style={{ fontSize: 11, color: theme.textDim, marginTop: 2 }}>
                        {role.defaultEmail}
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', verticalAlign: 'top', lineHeight: 1.5, color: theme.textMuted }}>
                      {role.isPrimary ? (
                        <span>
                          <strong style={{ color: '#1d4ed8' }}>Primary user</strong> — reviews optimized blocks, checks train-operation impact, modifies/approves plan.
                        </span>
                      ) : (
                        role.whatTheyDo
                      )}
                    </td>
                    <td style={{ padding: '12px 14px', verticalAlign: 'top', textAlign: 'center' }}>
                      <button
                        onClick={() => handleQuickLoginAsRole(role)}
                        disabled={authLoading}
                        style={{
                          padding: '6px 10px',
                          background: role.isPrimary ? '#2563eb' : '#f1f5f9',
                          color: role.isPrimary ? '#ffffff' : '#0f172a',
                          border: role.isPrimary ? '1px solid #1d4ed8' : `1px solid ${theme.border}`,
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        Enter Portal
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* END-TO-END PLANNING WORKFLOW PIPELINE */}
      {/* ------------------------------------------------------------------ */}
      <section id="workflow" style={{ background: '#ffffff', borderTop: `1px solid ${theme.border}`, borderBottom: `1px solid ${theme.border}`, padding: '64px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '3px 10px',
              borderRadius: 20,
              background: 'rgba(2, 132, 199, 0.1)',
              color: '#0284c7',
              fontSize: 11,
              fontWeight: 800,
              textTransform: 'uppercase',
              marginBottom: 8
            }}>
              <Compass size={13} />
              Collaborative Planning Lifecycle
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: theme.text, margin: '0 0 10px' }}>
              How Departments Synchronize Across the 5-Stage Pipeline
            </h2>
            <p style={{ fontSize: 13, color: theme.textMuted, maxWidth: 680, margin: '0 auto' }}>
              From initial demand registration to high-level executive authorization, every action is audited and transparent.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
            position: 'relative'
          }}>
            {[
              {
                step: '01',
                title: 'Department Submission',
                role: 'Track, S&T, TRD Planners',
                desc: 'Maintenance engineers submit section demands, machine crew needs, and duration requirements.',
                icon: ListTodo,
                color: '#d97706'
              },
              {
                step: '02',
                title: 'ML Failure Risk Estimation',
                role: 'Calibrated AI Model',
                desc: 'RandomForest model evaluates condition score, defect history, and overdue days to output failure probability.',
                icon: Cpu,
                color: '#16a34a'
              },
              {
                step: '03',
                title: 'CP-SAT Joint Bundling',
                role: 'Google OR-Tools Engine',
                desc: 'Solver bundles overlapping blocks across departments into single joint possessions, saving line downtime.',
                icon: Layers,
                color: '#2563eb'
              },
              {
                step: '04',
                title: 'Controller Review & Plan',
                role: 'Chief Controller (Operating)',
                desc: 'Primary user inspects plan against train movement paths on Google Maps CTC Display, resolves conflicts, and signs off.',
                icon: Sliders,
                color: '#7c3aed'
              },
              {
                step: '05',
                title: 'Executive Oversight',
                role: 'Sr. DOM / Authorized Officer',
                desc: 'Higher operations management verifies division punctuality compliance and grants final block execution sanction.',
                icon: ShieldCheck,
                color: '#0f172a'
              }
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.step} style={{
                  ...cardStyle,
                  background: '#f8fafc',
                  padding: 18,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <span style={{ fontSize: 22, fontWeight: 900, color: item.color }}>
                        {item.step}
                      </span>
                      <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: 6,
                        background: `${item.color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Icon size={16} color={item.color} />
                      </div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: theme.text, marginBottom: 4 }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: item.color, marginBottom: 8 }}>
                      {item.role}
                    </div>
                    <p style={{ margin: 0, fontSize: 12, color: theme.textMuted, lineHeight: 1.5 }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* INTEGRATED SIGN-IN PORTAL SECTION */}
      {/* ------------------------------------------------------------------ */}
      <section id="signin" style={{ maxWidth: 1000, margin: '0 auto', padding: '64px 24px' }}>
        <div style={{
          ...cardStyle,
          padding: '36px 32px',
          boxShadow: '0 10px 40px rgba(15,23,42,0.08)',
          border: '1px solid #cbd5e1'
        }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 54,
              height: 54,
              borderRadius: '50%',
              background: '#eff6ff',
              border: '2px solid #bfdbfe',
              color: '#2563eb',
              marginBottom: 10
            }}>
              <Lock size={24} />
            </div>
            <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: theme.text }}>
              Central Operations Access Portal
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: theme.textMuted }}>
              Sign in with your official Indian Railways credentials or click any quick-access departmental role.
            </p>
          </div>

          {/* Quick Role Fill Pills */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: theme.textDim, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, textAlign: 'center' }}>
              One-Click Role Selection
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 8 }}>
              {departmentRoles.map(role => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => {
                    setEmail(role.defaultEmail);
                    setPassword('admin123');
                    setFullName(role.defaultName);
                    setSelectedRoleName(role.userRole);
                  }}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: email === role.defaultEmail ? `2px solid ${role.accentColor}` : `1px solid ${theme.border}`,
                    background: email === role.defaultEmail ? `${role.accentColor}10` : '#ffffff',
                    color: theme.text,
                    fontSize: 11,
                    fontWeight: 600,
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <strong style={{ color: role.accentColor }}>{role.department}:</strong> {role.userRole.split('/')[0]}
                  </div>
                  {email === role.defaultEmail && (
                    <CheckCircle2 size={14} color={role.accentColor} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Login / Register Form */}
          <form onSubmit={handleFormSubmit} style={{ maxWidth: 440, margin: '0 auto', display: 'grid', gap: 14 }}>
            {authError && (
              <div style={{
                padding: '10px 14px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 8,
                color: theme.red,
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
                <AlertTriangle size={14} />
                <span>{authError}</span>
              </div>
            )}

            {activeTab === 'register' && (
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: theme.text, marginBottom: 5 }}>
                  Officer Full Name & Title
                </label>
                <div style={{ position: 'relative' }}>
                  <UserIcon size={15} color={theme.textDim} style={{ position: 'absolute', left: 12, top: 12 }} />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Chief Controller"
                    required
                    style={{ ...inputStyle, paddingLeft: 34 }}
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: theme.text, marginBottom: 5 }}>
                Official Railway Email ID
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} color={theme.textDim} style={{ position: 'absolute', left: 12, top: 12 }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="officer@railsamanvay.gov.in"
                  required
                  style={{ ...inputStyle, paddingLeft: 34 }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: theme.text, marginBottom: 5 }}>
                Authorization Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} color={theme.textDim} style={{ position: 'absolute', left: 12, top: 12 }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ ...inputStyle, paddingLeft: 34 }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              style={{
                ...buttonPrimary,
                padding: '12px',
                fontSize: 14,
                width: '100%',
                marginTop: 6
              }}
            >
              {authLoading ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  Verifying Railway Credentials...
                </>
              ) : (
                <>
                  <Train size={15} />
                  {activeTab === 'login' ? 'Authorize & Enter Control Room' : 'Register Officer Credentials'}
                </>
              )}
            </button>

            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <button
                type="button"
                onClick={() => {
                  setActiveTab(t => t === 'login' ? 'register' : 'login');
                  setAuthError('');
                }}
                style={{
                  background: 'none',
                  border: 0,
                  color: theme.blue,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {activeTab === 'login' ? 'Need a new departmental account? Register here' : 'Already registered? Return to Sign In'}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* FOOTER */}
      {/* ------------------------------------------------------------------ */}
      <footer style={{
        background: '#0f172a',
        color: '#94a3b8',
        padding: '48px 24px 32px',
        borderTop: '1px solid #1e293b'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 32, marginBottom: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#ffffff', marginBottom: 12 }}>
              <Train size={22} color="#38bdf8" />
              <span style={{ fontSize: 18, fontWeight: 900 }}>RailSamanvayAI</span>
            </div>
            <p style={{ margin: 0, fontSize: 12, lineHeight: 1.6, color: '#64748b' }}>
              Decision-support prototype designed for Smart India Hackathon 2026 under the Ministry of Railways (SIH26027).
              Combines Machine Learning, Google OR-Tools CP-SAT, and Google Maps geospatial visualization.
            </p>
          </div>

          <div>
            <div style={{ color: '#ffffff', fontSize: 13, fontWeight: 800, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Development Team
            </div>
            <div style={{ display: 'grid', gap: 6, fontSize: 12 }}>
              <div><strong>Debosmita Mukhopadhyay</strong> — Team Leader</div>
              <div><strong>Gaurav Gautam</strong> — Team Member</div>
              <div><strong>Shashwat Sahu</strong> — Team Member</div>
              <div><strong>Parinita Ramsagar</strong> — Team Member</div>
              <div><strong>Likhita Ganga</strong> — Team Member</div>
              <div><strong>Shubham Sagar</strong> — Team Member</div>
            </div>
          </div>

          <div>
            <div style={{ color: '#ffffff', fontSize: 13, fontWeight: 800, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Technology Framework
            </div>
            <div style={{ display: 'grid', gap: 6, fontSize: 12, color: '#64748b' }}>
              <div>Optimisation: <strong>Google OR-Tools CP-SAT</strong></div>
              <div>Geospatial: <strong>Google Maps Platform & Leaflet</strong></div>
              <div>Backend API: <strong>FastAPI & SQLite / PostgreSQL</strong></div>
              <div>Frontend: <strong>React 18 & TypeScript</strong></div>
            </div>
          </div>
        </div>

        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          paddingTop: 20,
          borderTop: '1px solid #1e293b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 11,
          color: '#64748b',
          flexWrap: 'wrap',
          gap: 10
        }}>
          <div>
            © 2026 RailSamanvayAI · Ministry of Railways, Government of India. All rights reserved.
          </div>
          <div>
            Prototype for Smart India Hackathon SIH26027. Academic & Decision-Support System.
          </div>
        </div>
      </footer>
    </div>
  );
}
