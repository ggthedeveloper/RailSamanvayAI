import React, { useMemo } from 'react';
import { Calendar, Clock, ShieldAlert, Zap, AlertCircle } from 'lucide-react';
import { PlanTask } from '../types';
import { theme, cardStyle, badgeStyle, getDeptColor, getPriorityBadge } from '../theme';

function formatTime(isoOrTime?: string): string {
  if (!isoOrTime) return '--:--';
  if (isoOrTime.includes('T')) {
    const timePart = isoOrTime.split('T')[1];
    return timePart.substring(0, 5);
  }
  return isoOrTime.substring(0, 5);
}

function formatDateLabel(dateStr: string): string {
  try {
    const d = new Date(dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

export function WeeklyView({ plans }: { plans: PlanTask[] }) {
  // Group plans by their actual date
  const groupedByDate = useMemo(() => {
    const map = new Map<string, PlanTask[]>();
    plans.forEach(p => {
      let d = p.date;
      if (!d && p.window_start) {
        d = p.window_start.includes('T') ? p.window_start.split('T')[0] : p.window_start.substring(0, 10);
      }
      if (!d) d = 'Unassigned Horizon';
      if (!map.has(d)) map.set(d, []);
      map.get(d)!.push(p);
    });

    // Sort chronologically
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [plans]);

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: theme.text }}>
          Weekly 7-Day Corridor Possession Schedule
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: theme.textMuted }}>
          Corridor-by-corridor breakdown of scheduled line blocks, power isolations, and joint multi-department slots.
        </p>
      </div>

      {groupedByDate.length === 0 && (
        <div style={{ ...cardStyle, padding: 36, textAlign: 'center', color: theme.textMuted }}>
          <AlertCircle size={36} color={theme.amber} style={{ margin: '0 auto 12px' }} />
          <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 700, color: theme.text }}>
            No Possessions Scheduled
          </h3>
          <p style={{ margin: 0, fontSize: 13 }}>
            Run the CP-SAT Optimizer from the Block Planning workspace to generate this week's possession schedule.
          </p>
        </div>
      )}

      <div style={{ display: 'grid', gap: 16 }}>
        {groupedByDate.map(([dateStr, dayTasks], dIdx) => {
          const jointCount = dayTasks.filter(t => t.is_joint_possession).length;
          const safetyCount = dayTasks.filter(t => t.safety_critical).length;
          const totalDurationMin = dayTasks.reduce((acc, t) => acc + (t.duration || t.required_duration_min || 0), 0);

          return (
            <div key={dIdx} style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Calendar size={18} color={theme.cyan} />
                  <strong style={{ fontSize: 15, color: theme.text }}>
                    {formatDateLabel(dateStr)}
                  </strong>
                  <span style={badgeStyle('rgba(56, 189, 248, 0.15)', theme.cyan)}>
                    {dayTasks.length} Scheduled {dayTasks.length === 1 ? 'Task' : 'Tasks'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12 }}>
                  {jointCount > 0 && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: theme.green, fontWeight: 700 }}>
                      <Zap size={13} /> {jointCount} Joint Possession{jointCount > 1 ? 's' : ''}
                    </span>
                  )}
                  {safetyCount > 0 && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: theme.red, fontWeight: 700 }}>
                      <ShieldAlert size={13} /> {safetyCount} Safety Critical
                    </span>
                  )}
                  <span style={{ color: theme.textDim }}>
                    Total Work: {totalDurationMin}m
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                {dayTasks.map((t, i) => {
                  const deptColor = getDeptColor(t.department);
                  const timeStart = formatTime(t.window_start);
                  const timeEnd = formatTime(t.window_end);

                  return (
                    <div key={i} style={{
                      padding: 12,
                      background: theme.bg,
                      border: `1px solid ${theme.border}`,
                      borderRadius: 8
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={badgeStyle(deptColor.bg, deptColor.text)}>
                          {t.department}
                        </span>
                        <span style={{ fontSize: 11, color: theme.cyan, fontWeight: 700 }}>
                          {t.duration || t.required_duration_min} min
                        </span>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: theme.text }}>
                        {t.section_id}
                      </div>
                      <div style={{ fontSize: 11, color: theme.textDim, margin: '4px 0', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={12} />
                        <span>Slot: {timeStart} - {timeEnd}</span>
                      </div>
                      <div style={{ fontSize: 11, color: theme.textMuted, marginBottom: 6 }}>
                        {t.task_type}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 6, borderTop: `1px solid ${theme.border}` }}>
                        <span style={getPriorityBadge(t.priority)}>{t.priority}</span>
                        <span style={{ fontSize: 10, color: t.approval_status === 'APPROVED' ? theme.green : theme.amber, fontWeight: 600 }}>
                          {t.approval_status === 'APPROVED' ? '✓ Authorized' : '⏳ Pending'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
