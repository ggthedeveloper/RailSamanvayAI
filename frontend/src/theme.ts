import { CSSProperties } from 'react';
import { AxiosError } from 'axios';
import { Station } from './types';

export const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyCubQwLYG5L59LJawYmwhbSnYqCf70fT2s';

export const theme = {
  bg: 'transparent',
  surface: 'rgba(255, 255, 255, 0.95)',
  card: 'rgba(255, 255, 255, 0.95)',
  cardHeader: 'rgba(248, 250, 252, 0.88)',
  border: 'rgba(226, 232, 240, 0.80)',
  borderLight: 'rgba(203, 213, 225, 0.65)',
  cyan: '#0284c7', // sharper sky-600
  blue: '#2563eb', // solid corporate railway blue
  blueDark: '#1d4ed8', // deep railway blue
  brightBlue: '#2f6bff',
  navy: '#071426', // deep navy
  darkNavy: '#0b1830',
  navyCard: 'rgba(7, 20, 42, 0.82)',
  secondaryBlue: '#60a5fa',
  amber: '#d97706', // amber-600
  green: '#16a34a', // green-600
  red: '#dc2626',   // red-600
  purple: '#7c3aed', // violet-600
  text: '#0f172a',
  textLight: '#f8fafc',
  textMuted: '#64748b',
  textDim: '#94a3b8'
};

export const cardStyle: CSSProperties = {
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(18px)',
  WebkitBackdropFilter: 'blur(18px)',
  border: '1px solid rgba(255, 255, 255, 0.70)',
  borderRadius: 18,
  padding: 24,
  boxShadow: '0 16px 45px rgba(0, 0, 0, 0.16)',
  boxSizing: 'border-box'
};

export const whiteGlassCardStyle: CSSProperties = {
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(18px)',
  WebkitBackdropFilter: 'blur(18px)',
  border: '1px solid rgba(255, 255, 255, 0.70)',
  borderRadius: 18,
  padding: 24,
  boxShadow: '0 16px 45px rgba(0, 0, 0, 0.16)',
  color: '#0f172a',
  boxSizing: 'border-box'
};

export const darkGlassCardStyle: CSSProperties = {
  background: 'rgba(7, 20, 42, 0.82)',
  backdropFilter: 'blur(18px)',
  WebkitBackdropFilter: 'blur(18px)',
  border: '1px solid rgba(255, 255, 255, 0.16)',
  borderRadius: 18,
  padding: 24,
  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.28)',
  color: '#ffffff',
  boxSizing: 'border-box'
};

export const glassCardStyle = darkGlassCardStyle;

export const badgeStyle = (bg: string, fg: string): CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px 10px',
  borderRadius: 6,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.02em',
  background: bg,
  color: fg,
  border: `1px solid ${fg}35`
});

export const inputStyle: CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '10px 14px',
  background: '#ffffff',
  border: '1px solid #cbd5e1',
  borderRadius: 10,
  color: '#0f172a',
  fontSize: 13,
  outline: 'none',
  transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
};

export const buttonPrimary: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  padding: '10px 18px',
  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
  color: '#ffffff',
  border: '1px solid rgba(255, 255, 255, 0.25)',
  borderRadius: 9,
  fontWeight: 700,
  fontSize: 13,
  cursor: 'pointer',
  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
  transition: 'all 0.15s ease'
};

export const buttonSecondary: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  padding: '10px 18px',
  background: 'rgba(255, 255, 255, 0.90)',
  backdropFilter: 'blur(8px)',
  color: '#1e293b',
  border: '1px solid #cbd5e1',
  borderRadius: 9,
  fontWeight: 600,
  fontSize: 13,
  cursor: 'pointer',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.15s ease'
};

export const buttonDarkGlass: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  padding: '10px 18px',
  background: 'rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(8px)',
  color: '#ffffff',
  border: '1px solid rgba(255, 255, 255, 0.22)',
  borderRadius: 9,
  fontWeight: 600,
  fontSize: 13,
  cursor: 'pointer',
  transition: 'all 0.15s ease'
};

export function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export function apiError(error: unknown, fallback: string): string {
  const detail = (error as AxiosError<{ detail?: string }>).response?.data?.detail;
  return typeof detail === 'string' ? detail : fallback;
}

export function getCoords(s?: Station | null): [number, number] | null {
  if (!s) return null;
  const lat = Number(s.lat);
  const lon = Number(s.lon);
  if (Number.isFinite(lat) && Number.isFinite(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
    return [lat, lon];
  }
  return null;
}

export const PRIMARY_DEPARTMENTS = [
  'Engineering',
  'S&T',
  'Electrical / TRD'
] as const;

export function getDeptColor(dept: string): { bg: string; text: string; border: string } {
  const d = (dept || '').toUpperCase();
  if (d.includes('ENG') || d.includes('CIVIL') || d.includes('P-WAY') || d.includes('PERMANENT')) {
    return { bg: 'rgba(2, 132, 199, 0.12)', text: '#0284c7', border: 'rgba(2, 132, 199, 0.30)' }; // Engineering
  }
  if (d.includes('SMT') || d.includes('S&T') || d.includes('SIGNAL') || d.includes('TELECOM')) {
    return { bg: 'rgba(217, 119, 6, 0.12)', text: '#d97706', border: 'rgba(217, 119, 6, 0.30)' }; // S&T
  }
  if (d.includes('TRD') || d.includes('OHE') || d.includes('TRACTION') || d.includes('ELECTRICAL')) {
    return { bg: 'rgba(5, 150, 105, 0.12)', text: '#059669', border: 'rgba(5, 150, 105, 0.30)' }; // Electrical / TRD
  }
  return { bg: 'rgba(37, 99, 235, 0.12)', text: '#2563eb', border: 'rgba(37, 99, 235, 0.30)' };
}

export function getRiskLevel(risk: number | string | undefined | null): 'HIGH' | 'MEDIUM' | 'LOW' {
  if (risk === undefined || risk === null) return 'LOW';
  if (typeof risk === 'number') {
    const val = risk <= 1.0 ? risk * 100 : risk;
    if (val >= 65) return 'HIGH';
    if (val >= 35) return 'MEDIUM';
    return 'LOW';
  }
  const str = String(risk).toUpperCase();
  if (str.includes('HIGH') || str.includes('CRITICAL') || str.includes('URGENT') || str.includes('P1')) {
    return 'HIGH';
  }
  if (str.includes('MED') || str.includes('WARN') || str.includes('MODERATE') || str.includes('SCHEDULED') || str.includes('P2')) {
    return 'MEDIUM';
  }
  return 'LOW';
}

export function getRiskTheme(risk: number | string | undefined | null) {
  const level = getRiskLevel(risk);
  switch (level) {
    case 'HIGH':
      return {
        level: 'HIGH' as const,
        color: '#dc2626', // Red
        bg: 'rgba(239, 68, 68, 0.12)',
        border: 'rgba(239, 68, 68, 0.35)',
        badgeBg: 'rgba(239, 68, 68, 0.18)',
        badge: badgeStyle('rgba(239, 68, 68, 0.18)', '#dc2626')
      };
    case 'MEDIUM':
      return {
        level: 'MEDIUM' as const,
        color: '#ca8a04', // Yellow / Amber
        bg: 'rgba(234, 179, 8, 0.12)',
        border: 'rgba(234, 179, 8, 0.35)',
        badgeBg: 'rgba(234, 179, 8, 0.18)',
        badge: badgeStyle('rgba(234, 179, 8, 0.18)', '#ca8a04')
      };
    case 'LOW':
    default:
      return {
        level: 'LOW' as const,
        color: '#16a34a', // Green
        bg: 'rgba(22, 163, 74, 0.12)',
        border: 'rgba(22, 163, 74, 0.35)',
        badgeBg: 'rgba(22, 163, 74, 0.18)',
        badge: badgeStyle('rgba(22, 163, 74, 0.18)', '#16a34a')
      };
  }
}

export function getPriorityBadge(priority: string) {
  const p = (priority || '').toUpperCase();
  if (p.includes('P1') || p.includes('CRITICAL') || p.includes('HIGH') || p.includes('URGENT')) {
    return badgeStyle('rgba(239, 68, 68, 0.14)', '#dc2626'); // Red
  }
  if (p.includes('P2') || p.includes('MEDIUM') || p.includes('WARNING') || p.includes('MODERATE') || p.includes('SCHEDULED')) {
    return badgeStyle('rgba(234, 179, 8, 0.16)', '#ca8a04'); // Yellow / Amber
  }
  return badgeStyle('rgba(22, 163, 74, 0.14)', '#16a34a'); // Green (Low / Normal / Routine / P3 / P4)
}
