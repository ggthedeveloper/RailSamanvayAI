import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { MaintenanceTaskItem } from '../types';
import { theme, cardStyle, badgeStyle, inputStyle, getDeptColor, getPriorityBadge } from '../theme';

export function TasksView({ tasks }: { tasks: MaintenanceTaskItem[] }) {
  const [deptFilter, setDeptFilter] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchDept = deptFilter === 'ALL' || (t.department_id || '').toUpperCase().includes(deptFilter);
      const matchSearch =
        !search ||
        (t.id && t.id.toLowerCase().includes(search.toLowerCase())) ||
        (t.asset_id && t.asset_id.toLowerCase().includes(search.toLowerCase())) ||
        (t.task_type && t.task_type.toLowerCase().includes(search.toLowerCase()));
      return matchDept && matchSearch;
    });
  }, [tasks, deptFilter, search]);

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: theme.text }}>
          Unified Multi-Department Maintenance Repository
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: theme.textMuted }}>
          Integrated tasks from Track Management System (TMS), Signalling Maintenance (SMMS), and Traction Distribution (TDMS).
        </p>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: theme.surface,
        padding: 14,
        borderRadius: 10,
        border: `1px solid ${theme.border}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
          <Search size={16} color={theme.textDim} />
          <input
            style={inputStyle}
            placeholder="Search by Task ID, Asset ID, Task Type…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: theme.textMuted }}>Repository:</span>
          <select
            style={{ ...inputStyle, width: 170 }}
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
          >
            <option value="ALL">All Repositories</option>
            <option value="ENGINEERING">TMS (Track / Civil)</option>
            <option value="SMT">SMMS (Signals / S&T)</option>
            <option value="TRD">TDMS (Traction / TRD)</option>
          </select>
        </div>
      </div>

      <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, textAlign: 'left' }}>
            <thead>
              <tr style={{ background: theme.cardHeader, borderBottom: `1px solid ${theme.border}` }}>
                {['Task ID', 'Asset ID', 'Department', 'Task Classification', 'Priority', 'Duration', 'Overdue Days', 'Safety Flag', 'Gang / Crew Type'].map((h, i) => (
                  <th key={i} style={{ padding: '12px 14px', color: theme.textMuted, fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((t, idx) => {
                const deptColor = getDeptColor(t.department_id);
                const isOverdue = (t.overdue_days || 0) > 0;
                return (
                  <tr key={t.id || idx} style={{ borderBottom: `1px solid ${theme.border}` }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: theme.cyan }}>{t.id}</td>
                    <td style={{ padding: '12px 14px', color: theme.textDim }}>{t.asset_id}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={badgeStyle(deptColor.bg, deptColor.text)}>
                        {t.department_id}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', color: theme.text }}>{t.task_type}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={getPriorityBadge(t.priority_class)}>
                        {t.priority_class}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 600 }}>{t.required_duration_min} min</td>
                    <td style={{ padding: '12px 14px' }}>
                      {isOverdue ? (
                        <span style={{ color: theme.red, fontWeight: 800 }}>
                          +{t.overdue_days} days overdue
                        </span>
                      ) : (
                        <span style={{ color: theme.green }}>On Schedule</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      {t.safety_critical ? (
                        <span style={badgeStyle('rgba(239, 68, 68, 0.2)', theme.red)}>CRITICAL</span>
                      ) : (
                        <span style={{ color: theme.textDim }}>Normal</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 14px', color: theme.textDim }}>
                      {t.crew_type || 'Standard Track Gang'}
                    </td>
                  </tr>
                );
              })}

              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: 36, textAlign: 'center', color: theme.textDim }}>
                    {tasks.length === 0
                      ? 'No maintenance tasks loaded from TMS/SMMS/TDMS repositories.'
                      : 'No maintenance tasks match the current search query or repository filter.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
