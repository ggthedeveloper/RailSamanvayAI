import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, Info, ShieldAlert, ArrowRight } from 'lucide-react';
import { ConflictItem } from '../types';
import { theme, cardStyle, badgeStyle } from '../theme';

export function ConflictsView({ conflicts }: { conflicts: ConflictItem[] }) {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filteredConflicts = conflicts.filter(c => {
    if (filterSeverity === 'ALL') return true;
    return c.severity === filterSeverity;
  });

  const criticalCount = conflicts.filter(c => c.severity === 'CRITICAL').length;
  const warningCount = conflicts.filter(c => c.severity === 'WARNING').length;
  const infoCount = conflicts.filter(c => c.severity === 'INFO').length;

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Operational Conflicts &amp; Alerts
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#cbd5e1' }}>
            Real-time constraint violation detector tracking timetable clashes, traction power interlocks, and corridor overlaps.
          </p>
        </div>

        {/* Severity Filters */}
        <div style={{
          display: 'flex',
          gap: 6,
          background: 'rgba(7, 20, 42, 0.75)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          padding: 4,
          borderRadius: 10
        }}>
          {[
            { id: 'ALL', label: `All (${conflicts.length})` },
            { id: 'CRITICAL', label: `Critical (${criticalCount})` },
            { id: 'WARNING', label: `Warning (${warningCount})` },
            { id: 'INFO', label: `Info (${infoCount})` }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setFilterSeverity(btn.id)}
              style={{
                padding: '6px 14px',
                border: 0,
                borderRadius: 7,
                background: filterSeverity === btn.id ? theme.blue : 'transparent',
                color: filterSeverity === btn.id ? '#ffffff' : '#cbd5e1',
                fontWeight: filterSeverity === btn.id ? 700 : 500,
                fontSize: 12,
                cursor: 'pointer',
                boxShadow: filterSeverity === btn.id ? '0 2px 6px rgba(37, 99, 235, 0.4)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conflict Cards */}
      <div style={{ display: 'grid', gap: 14 }}>
        {filteredConflicts.map((c, i) => {
          const isCrit = c.severity === 'CRITICAL';
          const isWarn = c.severity === 'WARNING';
          const borderColor = isCrit ? '#ef4444' : isWarn ? '#f59e0b' : '#38bdf8';
          const badgeBg = isCrit ? 'rgba(239, 68, 68, 0.1)' : isWarn ? 'rgba(245, 158, 11, 0.1)' : 'rgba(56, 189, 248, 0.1)';
          const badgeText = isCrit ? '#dc2626' : isWarn ? '#d97706' : '#0284c7';

          return (
            <div key={i} style={{
              ...cardStyle,
              padding: 20,
              borderLeft: `4px solid ${borderColor}`,
              display: 'flex',
              flexDirection: 'column',
              gap: 10
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <span style={badgeStyle(badgeBg, badgeText)}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: badgeText, marginRight: 5 }} />
                  {c.severity} SEVERITY
                </span>
                <span style={{ fontSize: 11, color: theme.textDim }}>
                  Corridor Section: <strong>{c.section_id}</strong> • {c.timestamp || 'Real-time telemetry'}
                </span>
              </div>

              <div>
                <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 700, color: theme.text }}>
                  {c.title}
                </h3>
                <p style={{ margin: 0, fontSize: 13, color: theme.textMuted, lineHeight: 1.5 }}>
                  {c.description}
                </p>
              </div>

              <div style={{
                padding: '10px 14px',
                background: 'rgba(241, 245, 249, 0.75)',
                borderRadius: 8,
                border: '1px solid rgba(226, 232, 240, 0.9)',
                fontSize: 12,
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginTop: 4
              }}>
                <Info size={15} color="#2563eb" style={{ flexShrink: 0 }} />
                <span><strong>Recommended Action:</strong> {c.suggested_action}</span>
              </div>
            </div>
          );
        })}

        {filteredConflicts.length === 0 && (
          <div style={{ ...cardStyle, textAlign: 'center', padding: '56px 24px' }}>
            <CheckCircle2 size={44} color="#16a34a" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 800, color: theme.text }}>
              Zero Active Operational Conflicts
            </h3>
            <p style={{ color: theme.textMuted, fontSize: 13, maxWidth: 500, margin: '0 auto' }}>
              All scheduled maintenance blocks satisfy corridor throughput, train timetable bounds, and traction power isolation limits.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
