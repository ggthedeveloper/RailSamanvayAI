import React from 'react';
import {
  Activity, AlertTriangle, Layers, ListTodo, ShieldAlert,
  Calendar, Zap, Cpu, BarChart3, AlertOctagon, CheckCircle2, Play, RefreshCw, Clock
} from 'lucide-react';
import { PlanTask, MaintenanceTaskItem, ConflictItem, BlockWindowItem } from '../types';
import { theme, cardStyle, badgeStyle, buttonPrimary } from '../theme';

interface OverviewViewProps {
  totalTasks: number;
  plans: PlanTask[];
  tasks: MaintenanceTaskItem[];
  blocks: BlockWindowItem[];
  conflicts: ConflictItem[];
  optStatus: string;
  optObjective: number;
  optimizing: boolean;
  onRunOptimizer: () => void;
  onNavigateToConflicts: () => void;
}

export function OverviewView({
  totalTasks,
  plans,
  tasks,
  blocks,
  conflicts,
  optStatus,
  optObjective,
  optimizing,
  onRunOptimizer,
  onNavigateToConflicts
}: OverviewViewProps) {
  const scheduledCount = plans.length;
  const blocksUsedCount = new Set(plans.map(p => p.block_id)).size;
  const safetyCriticalScheduled = plans.filter(p => p.safety_critical).length;
  const overdueCriticalCount = tasks.filter(t => t.safety_critical && (t.overdue_days || 0) > 0).length;
  const criticalConflictsCount = conflicts.filter(c => c.severity === 'CRITICAL').length;

  // Joint Possessions (Multi-Department Synergy) & Real Downtime Overlap
  const jointTasksCount = plans.filter(p => p.is_joint_possession).length;
  const blockTaskMap = new Map<string, PlanTask[]>();
  plans.forEach(p => {
    if (!blockTaskMap.has(p.block_id)) blockTaskMap.set(p.block_id, []);
    blockTaskMap.get(p.block_id)!.push(p);
  });

  let totalDowntimeSavedMin = 0;
  let jointBlocksCount = 0;
  blockTaskMap.forEach(blockTasks => {
    if (blockTasks.length > 1) {
      jointBlocksCount++;
      const durations = blockTasks.map(t => t.duration || t.required_duration_min || 0);
      const sumDur = durations.reduce((a, b) => a + b, 0);
      const maxDur = Math.max(...durations);
      totalDowntimeSavedMin += Math.max(0, sumDur - maxDur);
    }
  });
  const totalDowntimeSavedHours = (totalDowntimeSavedMin / 60).toFixed(1);

  const engCount = plans.filter(p => (p.department || '').includes('ENG') || (p.department || '').includes('CIVIL')).length;
  const smtCount = plans.filter(p => (p.department || '').includes('SMT') || (p.department || '').includes('S&T')).length;
  const trdCount = plans.filter(p => (p.department || '').includes('TRD') || (p.department || '').includes('OHE')).length;

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: theme.text }}>
            Central Operations Overview
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: theme.textMuted }}>
            Multi-department fixed infrastructure maintenance coordination across Engineering, S&T, and TRD.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onRunOptimizer} disabled={optimizing} style={buttonPrimary}>
            {optimizing ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} fill="#ffffff" />}
            Re-Optimize Schedule
          </button>
        </div>
      </div>

      {/* Top Operational KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
        {[
          {
            title: 'Maintenance Demands',
            val: totalTasks || plans.length,
            sub: 'TMS, SMMS, TDMS & BDMS Feeds',
            icon: ListTodo,
            color: theme.cyan
          },
          {
            title: 'Optimized Block Assignments',
            val: scheduledCount,
            sub: `${Math.round((scheduledCount / (totalTasks || plans.length || 1)) * 100)}% Scheduled via CP-SAT`,
            icon: Layers,
            color: theme.blue
          },
          {
            title: 'Joint Possessions Bundled',
            val: `${jointBlocksCount} Joint Blocks`,
            sub: `${jointTasksCount} Cross-Dept Tasks Combined`,
            icon: Zap,
            color: theme.green
          },
          {
            title: 'Corridor Downtime Saved',
            val: `${totalDowntimeSavedHours} Hours`,
            sub: `${totalDowntimeSavedMin} min line closure eliminated`,
            icon: Clock,
            color: theme.purple
          },
          {
            title: 'Block Windows Utilized',
            val: blocksUsedCount,
            sub: `Out of ${blocks.length} available windows`,
            icon: Calendar,
            color: theme.cyan
          },
          {
            title: 'Safety-Critical Scheduled',
            val: safetyCriticalScheduled,
            sub: 'Zero safety constraints violated',
            icon: ShieldAlert,
            color: theme.green
          },
          {
            title: 'Overdue Critical Assets',
            val: overdueCriticalCount,
            sub: 'Priority 1 immediate block required',
            icon: AlertOctagon,
            color: overdueCriticalCount > 0 ? theme.red : theme.green
          },
          {
            title: 'OR-Tools CP-SAT Status',
            val: optStatus,
            sub: `Objective: ${optObjective.toLocaleString()}`,
            icon: Cpu,
            color: optStatus === 'OPTIMAL' ? theme.green : theme.amber
          }
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} style={{ ...cardStyle, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, textTransform: 'uppercase' }}>
                  {kpi.title}
                </span>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: `${kpi.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={16} color={kpi.color} />
                </div>
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: theme.text, letterSpacing: '-0.02em' }}>
                {kpi.val}
              </div>
              <div style={{ fontSize: 11, color: theme.textDim, marginTop: 4 }}>
                {kpi.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* Department Breakdown & Priority Exceptions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(320px, 1fr)', gap: 20 }}>
        {/* Department Distribution */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: theme.text, display: 'flex', alignItems: 'center', gap: 8 }}>
            <BarChart3 size={18} color={theme.cyan} />
            Multi-Department Fixed Infrastructure Coordination
          </h3>

          <div style={{ display: 'grid', gap: 14 }}>
            {[
              {
                name: 'Engineering (CIVIL / Track Management)',
                system: 'TMS',
                count: engCount,
                color: theme.cyan,
                desc: 'Track Renewal, Ballast Tamping, Point & Rail Testing'
              },
              {
                name: 'Signal & Telecommunication (S&T)',
                system: 'SMMS',
                count: smtCount,
                color: theme.amber,
                desc: 'Electronic Interlocking, Point Machines, Track Circuits'
              },
              {
                name: 'Traction Distribution (TRD / OHE)',
                system: 'TDMS',
                count: trdCount,
                color: theme.green,
                desc: 'Catenary & Contact Wire, Isolator Maintenance, Power Blocks'
              }
            ].map((d, i) => {
              const pct = Math.round((d.count / (scheduledCount || 1)) * 100);
              return (
                <div key={i} style={{ padding: 14, background: theme.bg, borderRadius: 8, border: `1px solid ${theme.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div>
                      <strong style={{ fontSize: 13, color: theme.text }}>{d.name}</strong>
                      <span style={{ marginLeft: 8, ...badgeStyle(`${d.color}20`, d.color) }}>
                        {d.system} Feed
                      </span>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 800, color: d.color }}>
                      {d.count} tasks ({pct}%)
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: theme.textDim, marginBottom: 8 }}>
                    {d.desc}
                  </div>
                  <div style={{ height: 6, width: '100%', background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: d.color, borderRadius: 3 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Operational Exceptions */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: theme.text, display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertOctagon size={18} color={theme.red} />
              Priority Operational Exceptions
            </h3>
            <button
              onClick={onNavigateToConflicts}
              style={{ background: 'none', border: 0, color: theme.cyan, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}
            >
              View All ({conflicts.length}) →
            </button>
          </div>

          <div style={{ display: 'grid', gap: 10 }}>
            {conflicts.slice(0, 4).map((c, i) => (
              <div key={i} style={{
                padding: 12,
                background: c.severity === 'CRITICAL' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                border: `1px solid ${c.severity === 'CRITICAL' ? theme.red : theme.amber}44`,
                borderRadius: 8
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={badgeStyle(
                    c.severity === 'CRITICAL' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(245, 158, 11, 0.25)',
                    c.severity === 'CRITICAL' ? theme.red : theme.amber
                  )}>
                    {c.severity}
                  </span>
                  <span style={{ fontSize: 10, color: theme.textDim }}>
                    {c.section_id}
                  </span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: theme.text }}>
                  {c.title}
                </div>
                <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 4 }}>
                  {c.description}
                </div>
              </div>
            ))}

            {conflicts.length === 0 && (
              <div style={{ padding: 24, textAlign: 'center', color: theme.textDim, fontSize: 13 }}>
                <CheckCircle2 size={32} color={theme.green} style={{ margin: '0 auto 8px' }} />
                No active operational exceptions detected.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
