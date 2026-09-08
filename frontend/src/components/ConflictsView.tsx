import React, { useState } from 'react';
import { CheckCircle2, Info } from 'lucide-react';
import { ConflictItem } from '../types';
import { theme, cardStyle, badgeStyle } from '../theme';

export function ConflictsView({ conflicts }: { conflicts: ConflictItem[] }) {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filteredConflicts = conflicts.filter(c => {
    if (filterSeverity === 'ALL') return true;
    return c.severity === filterSeverity;
  });

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: theme.text }}>
            Operational Conflicts & Exception Center
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: theme.textMuted }}>
            Automated constraint violation checker detecting block overruns, freight bottleneck collisions, and multi-department overlaps.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map(s => (
            <button
              key={s}
              onClick={() => setFilterSeverity(s)}
              style={{
                padding: '6px 12px',
                border: `1px solid ${filterSeverity === s ? theme.blue : theme.border}`,
                borderRadius: 6,
                background: filterSeverity === s ? theme.blue : theme.surface,
                color: filterSeverity === s ? '#fff' : theme.textMuted,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gap: 14 }}>
        {filteredConflicts.map((c, i) => (
          <div key={i} style={{
            ...cardStyle,
            borderLeft: `4px solid ${c.severity === 'CRITICAL' ? '#dc2626' : c.severity === 'WARNING' ? '#ca8a04' : '#16a34a'}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={badgeStyle(
                c.severity === 'CRITICAL' ? 'rgba(239, 68, 68, 0.15)' : c.severity === 'WARNING' ? 'rgba(234, 179, 8, 0.18)' : 'rgba(22, 163, 74, 0.15)',
                c.severity === 'CRITICAL' ? '#dc2626' : c.severity === 'WARNING' ? '#ca8a04' : '#16a34a'
              )}>
                {c.severity} SEVERITY
              </span>
              <span style={{ fontSize: 11, color: theme.textDim }}>
                Corridor: {c.section_id} · {c.timestamp}
              </span>
            </div>

            <h3 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 700, color: theme.text }}>
              {c.title}
            </h3>
            <p style={{ margin: '0 0 10px', fontSize: 13, color: theme.textMuted }}>
              {c.description}
            </p>

            <div style={{
              padding: 10,
              background: theme.bg,
              borderRadius: 6,
              fontSize: 12,
              color: theme.cyan,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <Info size={15} />
              <span><strong>Fail-Safe Action:</strong> {c.suggested_action}</span>
            </div>
          </div>
        ))}

        {filteredConflicts.length === 0 && (
          <div style={{ ...cardStyle, textAlign: 'center', padding: 48 }}>
            <CheckCircle2 size={48} color={theme.green} style={{ margin: '0 auto 12px' }} />
            <h3 style={{ margin: 0, color: theme.text }}>Zero Active Conflicts</h3>
            <p style={{ color: theme.textMuted, fontSize: 13 }}>
              All scheduled blocks satisfy corridor capacity, crew availability, and train timetable bounds.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
