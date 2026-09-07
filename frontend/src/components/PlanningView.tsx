import React, { useState, useMemo } from 'react';
import { Layers, Play, RefreshCw, Search, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { PlanTask } from '../types';
import { theme, cardStyle, badgeStyle, inputStyle, buttonPrimary, getDeptColor, getPriorityBadge } from '../theme';

interface PlanningViewProps {
  plans: PlanTask[];
  totalTasks: number;
  blocksUsedCount: number;
  selectedHorizon: 'weekly' | 'monthly';
  setSelectedHorizon: (h: 'weekly' | 'monthly') => void;
  objectiveProfile: string;
  setObjectiveProfile: (p: string) => void;
  optStatus: string;
  optObjective: number;
  lastOptimizedAt: string;
  optimizing: boolean;
  onRunOptimizer: () => void;
  onApproveTask: (taskId: string, action: 'APPROVED' | 'REJECTED') => void;
  approvingTaskId: string | null;
}

export function PlanningView({
  plans,
  totalTasks,
  blocksUsedCount,
  selectedHorizon,
  setSelectedHorizon,
  objectiveProfile,
  setObjectiveProfile,
  optStatus,
  optObjective,
  lastOptimizedAt,
  optimizing,
  onRunOptimizer,
  onApproveTask,
  approvingTaskId
}: PlanningViewProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [deptFilter, setDeptFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [safetyOnly, setSafetyOnly] = useState<boolean>(false);
  const [approvalFilter, setApprovalFilter] = useState<string>('ALL');
  const [jointOnly, setJointOnly] = useState<boolean>(false);

  // Joint possession metrics with true calculated overlap duration
  const { jointBlocksCount, jointDowntimeHours } = useMemo(() => {
    const blockMap = new Map<string, PlanTask[]>();
    plans.forEach(p => {
      if (!blockMap.has(p.block_id)) blockMap.set(p.block_id, []);
      blockMap.get(p.block_id)!.push(p);
    });
    let savedMin = 0;
    let jointCount = 0;
    blockMap.forEach(tasksInBlock => {
      if (tasksInBlock.length > 1) {
        jointCount++;
        const durations = tasksInBlock.map(t => t.duration || t.required_duration_min || 0);
        const sumDur = durations.reduce((a, b) => a + b, 0);
        const maxDur = Math.max(...durations);
        savedMin += Math.max(0, sumDur - maxDur);
      }
    });
    return {
      jointBlocksCount: jointCount,
      jointDowntimeHours: (savedMin / 60).toFixed(1)
    };
  }, [plans]);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 15;

  const filteredPlans = useMemo(() => {
    return plans.filter(p => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        (p.task_id && p.task_id.toLowerCase().includes(q)) ||
        (p.section_id && p.section_id.toLowerCase().includes(q)) ||
        (p.asset_id && p.asset_id.toLowerCase().includes(q)) ||
        (p.task_type && p.task_type.toLowerCase().includes(q));

      const matchDept = deptFilter === 'ALL' || (p.department || '').toUpperCase() === deptFilter;
      const matchPriority = priorityFilter === 'ALL' || (p.priority || '').toUpperCase().includes(priorityFilter);
      const matchSafety = !safetyOnly || p.safety_critical === true;
      const matchJoint = !jointOnly || p.is_joint_possession === true;
      const matchApproval =
        approvalFilter === 'ALL' ||
        (approvalFilter === 'APPROVED' && p.approval_status === 'APPROVED') ||
        (approvalFilter === 'PENDING' && (!p.approval_status || p.approval_status === 'PENDING_APPROVAL')) ||
        (approvalFilter === 'REJECTED' && p.approval_status === 'REJECTED');

      return matchSearch && matchDept && matchPriority && matchSafety && matchJoint && matchApproval;
    });
  }, [plans, searchQuery, deptFilter, priorityFilter, safetyOnly, jointOnly, approvalFilter]);

  // Paginated subset
  const totalPages = Math.max(1, Math.ceil(filteredPlans.length / pageSize));

  // Reset or clamp currentPage if filter reduces page count
  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const paginatedPlans = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPlans.slice(start, start + pageSize);
  }, [filteredPlans, currentPage]);

  const resetFilters = () => {
    setSearchQuery('');
    setDeptFilter('ALL');
    setPriorityFilter('ALL');
    setSafetyOnly(false);
    setJointOnly(false);
    setApprovalFilter('ALL');
    setCurrentPage(1);
  };

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      {/* Header with Horizon Selector & Run Trigger */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: theme.text }}>
            Automatic Block Planning Workspace
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: theme.textMuted }}>
            Constraint optimization engine solving corridor possessions with Google OR-Tools CP-SAT.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Horizon Toggle */}
          <div style={{
            display: 'flex',
            background: theme.bg,
            border: `1px solid ${theme.border}`,
            borderRadius: 8,
            padding: 3
          }}>
            <button
              onClick={() => { setSelectedHorizon('weekly'); setCurrentPage(1); }}
              style={{
                padding: '7px 14px',
                border: 0,
                borderRadius: 6,
                background: selectedHorizon === 'weekly' ? theme.blue : 'transparent',
                color: selectedHorizon === 'weekly' ? '#fff' : theme.textMuted,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'background 0.15s ease'
              }}
            >
              Weekly Horizon (7-Day)
            </button>
            <button
              onClick={() => { setSelectedHorizon('monthly'); setCurrentPage(1); }}
              style={{
                padding: '7px 14px',
                border: 0,
                borderRadius: 6,
                background: selectedHorizon === 'monthly' ? theme.blue : 'transparent',
                color: selectedHorizon === 'monthly' ? '#fff' : theme.textMuted,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'background 0.15s ease'
              }}
            >
              Monthly Horizon (30-Day)
            </button>
          </div>

          {/* Objective Profile Selector */}
          <select
            style={{ ...inputStyle, width: 170 }}
            value={objectiveProfile}
            onChange={e => setObjectiveProfile(e.target.value)}
          >
            <option value="safety_first">Safety First (P1 Boost)</option>
            <option value="balanced">Balanced Corridor Flow</option>
            <option value="throughput">Max Task Throughput</option>
          </select>

          {/* Execute Button */}
          <button
            onClick={onRunOptimizer}
            disabled={optimizing}
            style={buttonPrimary}
          >
            {optimizing ? <RefreshCw size={15} className="animate-spin" /> : <Play size={15} fill="#ffffff" />}
            {optimizing ? 'Executing CP-SAT…' : 'Run CP-SAT Optimizer'}
          </button>
        </div>
      </div>

      {/* Optimization Execution Summary Banner */}
      <div style={{
        ...cardStyle,
        background: 'linear-gradient(135deg, rgba(14,165,233,0.05) 0%, rgba(14,165,233,0.1) 100%)',
        border: `1px solid ${theme.cyan}44`,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 16,
        padding: 18
      }}>
        <div>
          <span style={{ fontSize: 11, color: theme.textDim, fontWeight: 700, textTransform: 'uppercase' }}>
            Solver Engine
          </span>
          <div style={{ fontSize: 16, fontWeight: 800, color: theme.cyan, marginTop: 4 }}>
            Google OR-Tools CP-SAT
          </div>
          <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>
            Constraint Satisfaction Solver
          </div>
        </div>

        <div>
          <span style={{ fontSize: 11, color: theme.textDim, fontWeight: 700, textTransform: 'uppercase' }}>
            Optimization Status
          </span>
          <div style={{ fontSize: 16, fontWeight: 800, color: optStatus === 'OPTIMAL' ? theme.green : theme.amber, marginTop: 4 }}>
            ● {optStatus}
          </div>
          <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>
            Objective Value: {optObjective.toLocaleString()}
          </div>
        </div>

        <div>
          <span style={{ fontSize: 11, color: theme.textDim, fontWeight: 700, textTransform: 'uppercase' }}>
            Scheduled / Capacity
          </span>
          <div style={{ fontSize: 16, fontWeight: 800, color: theme.text, marginTop: 4 }}>
            {plans.length} Tasks Scheduled
          </div>
          <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>
            {blocksUsedCount} Corridor Blocks Used
          </div>
        </div>

        <div>
          <span style={{ fontSize: 11, color: theme.textDim, fontWeight: 700, textTransform: 'uppercase' }}>
            Multi-Dept Synergy
          </span>
          <div style={{ fontSize: 16, fontWeight: 800, color: theme.green, marginTop: 4 }}>
            {jointBlocksCount} Joint Blocks
          </div>
          <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>
            Saved {jointDowntimeHours}h Corridor Downtime
          </div>
        </div>

        <div>
          <span style={{ fontSize: 11, color: theme.textDim, fontWeight: 700, textTransform: 'uppercase' }}>
            Active Planning Horizon
          </span>
          <div style={{ fontSize: 16, fontWeight: 800, color: theme.purple, marginTop: 4 }}>
            {selectedHorizon === 'weekly' ? '7-Day Horizon' : '30-Day Rolling'}
          </div>
          <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>
            Last Run: {lastOptimizedAt}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexWrap: 'wrap',
        background: theme.surface,
        padding: 14,
        borderRadius: 10,
        border: `1px solid ${theme.border}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 220 }}>
          <Search size={16} color={theme.textDim} />
          <input
            style={inputStyle}
            placeholder="Search by Task ID, Section ID, Asset…"
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: theme.textMuted }}>Dept:</span>
          <select
            style={{ ...inputStyle, width: 130 }}
            value={deptFilter}
            onChange={e => { setDeptFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="ALL">All Depts</option>
            <option value="ENGINEERING">Engineering</option>
            <option value="SMT">S&T</option>
            <option value="TRD">TRD</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: theme.textMuted }}>Priority:</span>
          <select
            style={{ ...inputStyle, width: 100 }}
            value={priorityFilter}
            onChange={e => { setPriorityFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="ALL">All</option>
            <option value="P1">P1</option>
            <option value="P2">P2</option>
            <option value="P3">P3</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: theme.textMuted }}>Sign-Off:</span>
          <select
            style={{ ...inputStyle, width: 120 }}
            value={approvalFilter}
            onChange={e => { setApprovalFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="ALL">All Status</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING">Pending</option>
            <option value="REJECTED">Declined</option>
          </select>
        </div>

        <label style={{ fontSize: 12, color: theme.text, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={safetyOnly}
            onChange={e => { setSafetyOnly(e.target.checked); setCurrentPage(1); }}
            style={{ accentColor: theme.red }}
          />
          Safety Critical
        </label>

        <label style={{ fontSize: 12, color: theme.green, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontWeight: 700 }}>
          <input
            type="checkbox"
            checked={jointOnly}
            onChange={e => { setJointOnly(e.target.checked); setCurrentPage(1); }}
            style={{ accentColor: theme.green }}
          />
          ⚡ Joint Only (Combined Possessions)
        </label>

        {(searchQuery || deptFilter !== 'ALL' || priorityFilter !== 'ALL' || safetyOnly || jointOnly || approvalFilter !== 'ALL') && (
          <button
            onClick={resetFilters}
            style={{
              background: 'transparent',
              border: `1px solid ${theme.borderLight}`,
              color: theme.textMuted,
              padding: '7px 10px',
              borderRadius: 6,
              fontSize: 11,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <X size={12} /> Clear
          </button>
        )}
      </div>

      {/* Comprehensive Plan Table with Clean Pagination */}
      <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, textAlign: 'left' }}>
            <thead>
              <tr style={{ background: theme.cardHeader, borderBottom: `1px solid ${theme.border}` }}>
                {['Task ID', 'Block ID', 'Corridor / Section', 'Department', 'Task Type', 'Date / Window', 'Duration', 'Priority', 'Possession Mode', 'Safety', 'Status', 'Possession Authorization', 'Action'].map((h, i) => (
                  <th key={i} style={{ padding: '12px 14px', color: theme.textMuted, fontWeight: 700 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedPlans.map((row, idx) => {
                const deptColor = getDeptColor(row.department);
                const isApproved = row.approval_status === 'APPROVED';
                const isPending = !row.approval_status || row.approval_status === 'PENDING_APPROVAL';

                return (
                  <tr
                    key={row.task_id || idx}
                    style={{
                      borderBottom: `1px solid ${theme.border}`,
                      background: idx % 2 === 0 ? 'transparent' : 'rgba(241,245,249,0.5)'
                    }}
                  >
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: theme.cyan }}>
                      {row.task_id}
                    </td>
                    <td style={{ padding: '12px 14px', color: theme.textDim }}>
                      {row.block_id}
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: theme.text }}>
                      {row.section_id}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={badgeStyle(deptColor.bg, deptColor.text)}>
                        {row.department}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', color: theme.text }}>
                      {row.task_type}
                    </td>
                    <td style={{ padding: '12px 14px', color: theme.textDim }}>
                      <div>{row.date}</div>
                      <small style={{ color: theme.textMuted }}>
                        {row.window_start ? row.window_start.substring(11, 16) : '01:00'} - {row.window_end ? row.window_end.substring(11, 16) : '04:30'}
                      </small>
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: theme.text }}>
                      {row.duration || row.required_duration_min} min
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={getPriorityBadge(row.priority)}>
                        {row.priority}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      {row.is_joint_possession ? (
                        <div title={`Bundled with: ${row.bundled_with || 'Joint possession'}`}>
                          <span style={badgeStyle('rgba(16, 185, 129, 0.2)', theme.green)}>
                            ⚡ JOINT (+{row.downtime_saved_min || 180}m)
                          </span>
                          {row.bundled_with && (
                            <div style={{ fontSize: 10, color: theme.textDim, marginTop: 2, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {row.bundled_with}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span style={{ fontSize: 11, color: theme.textDim }}>Single Dept</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      {row.safety_critical ? (
                        <span style={badgeStyle('rgba(239, 68, 68, 0.25)', theme.red)}>
                          CRITICAL
                        </span>
                      ) : (
                        <span style={{ color: theme.textDim }}>Normal</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={badgeStyle(
                        row.planning_status === 'OPTIMAL' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                        row.planning_status === 'OPTIMAL' ? theme.green : theme.cyan
                      )}>
                        {row.planning_status || 'OPTIMIZED'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      {isApproved ? (
                        <span style={badgeStyle('rgba(16, 185, 129, 0.2)', theme.green)}>
                          ✓ AUTHORIZED
                        </span>
                      ) : isPending ? (
                        <span style={badgeStyle('rgba(245, 158, 11, 0.2)', theme.amber)}>
                          ⏳ PENDING SIGN-OFF
                        </span>
                      ) : (
                        <span style={badgeStyle('rgba(239, 68, 68, 0.2)', theme.red)}>
                          DECLINED
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      {isApproved ? (
                        <button
                          onClick={() => onApproveTask(row.task_id, 'REJECTED')}
                          disabled={approvingTaskId === row.task_id}
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: theme.red,
                            borderRadius: 4,
                            padding: '4px 8px',
                            fontSize: 11,
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Revoke
                        </button>
                      ) : (
                        <button
                          onClick={() => onApproveTask(row.task_id, 'APPROVED')}
                          disabled={approvingTaskId === row.task_id}
                          style={{
                            background: 'rgba(16, 185, 129, 0.15)',
                            border: '1px solid rgba(16, 185, 129, 0.4)',
                            color: theme.green,
                            borderRadius: 4,
                            padding: '4px 8px',
                            fontSize: 11,
                            cursor: 'pointer',
                            fontWeight: 700
                          }}
                        >
                          Authorize
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredPlans.length === 0 && (
                <tr>
                  <td colSpan={12} style={{ padding: 36, textAlign: 'center', color: theme.textDim }}>
                    No matching scheduled blocks found. Try adjusting the search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Clean Pagination Bar */}
        <div style={{
          padding: '12px 16px',
          background: theme.cardHeader,
          borderTop: `1px solid ${theme.border}`,
          fontSize: 12,
          color: theme.textMuted,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10
        }}>
          <div>
            Showing {Math.min(filteredPlans.length, (currentPage - 1) * pageSize + 1)} - {Math.min(filteredPlans.length, currentPage * pageSize)} of {filteredPlans.length} filtered blocks ({plans.length} total)
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              style={{
                background: theme.surface,
                border: `1px solid ${theme.border}`,
                color: currentPage <= 1 ? theme.textDim : theme.text,
                padding: '5px 10px',
                borderRadius: 6,
                fontSize: 12,
                cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <ChevronLeft size={14} /> Previous
            </button>

            <span style={{ fontSize: 12, color: theme.text, fontWeight: 700, padding: '0 6px' }}>
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              style={{
                background: theme.surface,
                border: `1px solid ${theme.border}`,
                color: currentPage >= totalPages ? theme.textDim : theme.text,
                padding: '5px 10px',
                borderRadius: 6,
                fontSize: 12,
                cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
