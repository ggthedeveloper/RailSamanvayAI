import { CSSProperties } from 'react';
import { AxiosError } from 'axios';
import { Station } from './types';

export const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const theme = {
  bg: '#f8fafc',
  surface: '#ffffff',
  card: '#ffffff',
  cardHeader: '#f8fafc',
  border: '#e2e8f0',
  borderLight: '#cbd5e1',
  cyan: '#0284c7', // sharper sky-600 for contrast
  blue: '#2563eb', // solid corporate royal blue
  amber: '#d97706', // amber-600
  green: '#16a34a', // green-600
  red: '#dc2626',   // red-600
  purple: '#7c3aed', // violet-600
  text: '#0f172a',
  textMuted: '#475569',
  textDim: '#64748b'
};

export const cardStyle: CSSProperties = {
  background: theme.card,
  border: `1px solid ${theme.border}`,
  borderRadius: 12,
  padding: 20,
  boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.04)'
};

export const badgeStyle = (bg: string, fg: string): CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '3px 9px',
  borderRadius: 6,
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.02em',
  background: bg,
  color: fg,
  border: `1px solid ${fg}28`
});

export const inputStyle: CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '9px 12px',
  background: '#ffffff',
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  color: theme.text,
  fontSize: 13,
  outline: 'none',
  transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
};

export const buttonPrimary: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  padding: '9px 16px',
  background: '#2563eb',
  color: '#ffffff',
  border: '1px solid #1d4ed8',
  borderRadius: 8,
  fontWeight: 600,
  fontSize: 13,
  cursor: 'pointer',
  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  transition: 'all 0.15s ease'
};

export const buttonSecondary: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  padding: '9px 16px',
  background: '#ffffff',
  color: '#334155',
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  fontWeight: 600,
  fontSize: 13,
  cursor: 'pointer',
  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
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

export function getDeptColor(dept: string): { bg: string; text: string } {
  const d = (dept || '').toUpperCase();
  if (d.includes('ENG') || d.includes('CIVIL') || d.includes('TRACK')) {
    return { bg: 'rgba(14, 165, 233, 0.1)', text: '#0284c7' }; // sky 600
  }
  if (d.includes('SMT') || d.includes('S&T') || d.includes('SIGNAL')) {
    return { bg: 'rgba(245, 158, 11, 0.1)', text: '#d97706' }; // amber 600
  }
  if (d.includes('TRD') || d.includes('OHE') || d.includes('ELECT')) {
    return { bg: 'rgba(16, 185, 129, 0.1)', text: '#059669' }; // emerald 600
  }
  return { bg: 'rgba(139, 92, 246, 0.1)', text: '#7c3aed' }; // violet 600
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
        bg: 'rgba(239, 68, 68, 0.10)',
        border: 'rgba(239, 68, 68, 0.35)',
        badgeBg: 'rgba(239, 68, 68, 0.18)',
        badge: badgeStyle('rgba(239, 68, 68, 0.18)', '#dc2626')
      };
    case 'MEDIUM':
      return {
        level: 'MEDIUM' as const,
        color: '#ca8a04', // Yellow / Amber
        bg: 'rgba(234, 179, 8, 0.10)',
        border: 'rgba(234, 179, 8, 0.35)',
        badgeBg: 'rgba(234, 179, 8, 0.18)',
        badge: badgeStyle('rgba(234, 179, 8, 0.18)', '#ca8a04')
      };
    case 'LOW':
    default:
      return {
        level: 'LOW' as const,
        color: '#16a34a', // Green
        bg: 'rgba(22, 163, 74, 0.10)',
        border: 'rgba(22, 163, 74, 0.35)',
        badgeBg: 'rgba(22, 163, 74, 0.18)',
        badge: badgeStyle('rgba(22, 163, 74, 0.18)', '#16a34a')
      };
  }
}

export function getPriorityBadge(priority: string) {
  const p = (priority || '').toUpperCase();
  if (p.includes('P1') || p.includes('CRITICAL') || p.includes('HIGH') || p.includes('URGENT')) {
    return badgeStyle('rgba(239, 68, 68, 0.15)', '#dc2626'); // Red
  }
  if (p.includes('P2') || p.includes('MEDIUM') || p.includes('WARNING') || p.includes('MODERATE') || p.includes('SCHEDULED')) {
    return badgeStyle('rgba(234, 179, 8, 0.18)', '#ca8a04'); // Yellow
  }
  return badgeStyle('rgba(22, 163, 74, 0.15)', '#16a34a'); // Green (Low / Normal / Routine / P3 / P4)
}

