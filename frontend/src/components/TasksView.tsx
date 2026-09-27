import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { MaintenanceTaskItem } from '../types';
import { theme, cardStyle, badgeStyle, inputStyle, getDeptColor, getPriorityBadge } from '../theme';

export function TasksView({ tasks }: { tasks: MaintenanceTaskItem[] }) {
  const [deptFilter, setDeptFilter] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const deptUpper = (t.department_id || '').toUpperCase();
      const matchDept = deptFilter === 'ALL' ||
        (deptFilter === 'CIVIL' && (deptUpper.includes('CIVIL') || deptUpper.includes('ENG'))) ||
        (deptFilter === 'S&T' && (deptUpper.includes('S&T') || deptUpper.includes('SMT') || deptUpper.includes('SIGNAL'))) ||
        (deptFilter === 'TRD' && (deptUpper.includes('TRD') || deptUpper.includes('OHE'))) ||
        (deptFilter === 'OPERATING' && (deptUpper.includes('OPERAT') || deptUpper.includes('TRAFFIC'))) ||
        (deptFilter === 'ELECTRICAL' && deptUpper.includes('ELECT')) ||
        (deptFilter === 'MECHANICAL' && deptUpper.includes('MECH')) ||
        (deptFilter === 'TRACK_MACHINE' && (deptUpper.includes('MACHINE') || deptUpper.includes('TRACK_M'))) ||
        deptUpper.includes(deptFilter);

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
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
          Unified Multi-Department Maintenance Repository
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#cbd5e1' }}>
          Integrated tasks from Track Management System (TMS), Signalling Maintenance (SMMS), and Traction Distribution (TDMS).
        </p>
      </div>

      <div style={{
        ...cardStyle,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: 14
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
          <span style={{ fontSize: 12, color: theme.textMuted, fontWeight: 600 }}>Department:</span>
          <select
            style={{ ...inputStyle, width: 200 }}
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
          >
            <option value="ALL">All Departments</option>
            <option value="CIVIL">Engineering</option>
            <option value="S&T">S&T</option>
            <option value="TRD">Electrical / TRD</option>
          </select>
        </div>
      </div>

      <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(241, 245, 249, 0.85)', borderBottom: `1px solid ${theme.border}` }}>
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
                  <tr
                    key={t.id || idx}
                    style={{
                      borderBottom: `1px solid ${theme.border}`,
                      background: idx % 2 === 0 ? 'transparent' : 'rgba(241, 245, 249, 0.5)'
                    }}
                  >
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
                  <td colSpan={9} style={{ padding: 36, textAlign: 'center', color: theme.textDim }}>
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
