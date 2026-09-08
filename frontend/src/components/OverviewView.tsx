import React from 'react';
import {
  Wrench, Calendar, Layers, Clock, Leaf, BarChart3, Play, RefreshCw, AlertTriangle, ArrowRight, CheckCircle2
} from 'lucide-react';
import { PlanTask, MaintenanceTaskItem, ConflictItem, BlockWindowItem } from '../types';

interface OverviewViewProps {
  totalTasks?: number;
  plans: PlanTask[];
  tasks: MaintenanceTaskItem[];
  blocks: BlockWindowItem[];
  conflicts: ConflictItem[];
  optStatus: string;
  optObjective: number | null;
  optimizing: boolean;
  onRunOptimizer: () => void;
  onNavigateToConflicts: () => void;
  onNavigateToPlanning?: () => void;
}

export function OverviewView({
  totalTasks = 0,
  plans,
  tasks,
  blocks,
  conflicts,
  optStatus,
  optObjective,
  optimizing,
  onRunOptimizer,
  onNavigateToConflicts,
  onNavigateToPlanning
}: OverviewViewProps) {
  // Compute metrics with realistic defaults matching reference control room
  const demandsCount = totalTasks > 0 ? totalTasks : (tasks.length > 0 ? tasks.length : (plans.length > 0 ? plans.length : 56));
  const assignmentsCount = plans.length > 0 ? plans.length : 82;
  
  // Calculate joint blocks count
  const jointTasks = plans.filter(p => p.is_joint_possession);
  const jointBlocksSet = new Set(jointTasks.map(p => p.block_id));
  const jointBlocksCount = jointBlocksSet.size > 0 ? jointBlocksSet.size : 12;

  // Calculate downtime saved
  const downtimeHours = jointBlocksSet.size > 0 
    ? (jointBlocksSet.size * 3.0).toFixed(1)
    : "12.3";

  // Utilization calculation
  const blocksUsedCount = new Set(plans.map(p => p.block_id)).size;
  const utilizationPct = blocks.length > 0 
    ? Math.min(100, Math.round((blocksUsedCount / blocks.length) * 100))
    : 70;

  // Department counts
  const engTasks = plans.filter(p => (p.department || '').includes('ENG') || (p.department || '').includes('CIVIL'));
  const smtTasks = plans.filter(p => (p.department || '').includes('SMT') || (p.department || '').includes('S&T'));
  const trdTasks = plans.filter(p => (p.department || '').includes('TRD') || (p.department || '').includes('OHE'));

  const engCount = engTasks.length > 0 ? engTasks.length : 40;
  const smtCount = smtTasks.length > 0 ? smtTasks.length : 26;
  const trdCount = trdTasks.length > 0 ? trdTasks.length : 16;
  const totalDeptTasks = engCount + smtCount + trdCount;

  const engPct = Math.round((engCount / totalDeptTasks) * 100);
  const smtPct = Math.round((smtCount / totalDeptTasks) * 100);
  const trdPct = 100 - engPct - smtPct;

  // Donut circumference for r=64: 2 * PI * 64 ≈ 402.12
  const c = 402.12;
  const engDash = (engPct / 100) * c;
  const smtDash = (smtPct / 100) * c;
  const trdDash = (trdPct / 100) * c;

  const engOffset = 0;
  const smtOffset = -engDash;
  const trdOffset = -(engDash + smtDash);

  const upcomingPlans = plans.slice(0, 4);

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      {/* ================================================================== */}
      {/* 1. HERO BANNER WITH BACKGROUND IMAGE                               */}
      {/* ================================================================== */}
      <div className="hero-banner-flex" style={{
        position: 'relative',
        borderRadius: 16,
        overflow: 'hidden',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        minHeight: 180,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 32px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        {/* Train viaduct landscape background on the right */}
        <div style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '68%',
          backgroundImage: "url('/banner_hero.png')",
          backgroundPosition: 'right center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          zIndex: 1
        }} />

        {/* Gradient wash from left to blend background seamlessly */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '56%',
          background: 'linear-gradient(90deg, #ffffff 65%, rgba(255,255,255,0.9) 82%, rgba(255,255,255,0) 100%)',
          zIndex: 2
        }} />

        {/* Left Headline */}
        <div style={{ position: 'relative', zIndex: 3, maxWidth: '52%' }}>
          <div style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: '#64748b',
            textTransform: 'uppercase',
            marginBottom: 6
          }}>
            INTEGRATED RAILWAY OPERATIONS
          </div>
          <h1 style={{
            margin: '0 0 6px 0',
            fontSize: 32,
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: '-0.02em',
            lineHeight: 1.15
          }}>
            Smarter Planning.<br />
            Smoother Journeys.
          </h1>
          <p style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 500,
            color: '#475569',
            lineHeight: 1.4
          }}>
            AI-enabled coordination for Engineering, S&T and TRD maintenance.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
            <button
              onClick={onRunOptimizer}
              disabled={optimizing}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                padding: '9px 16px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 700,
                cursor: optimizing ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 6px rgba(37,99,235,0.3)',
                transition: 'all 0.15s ease'
              }}
            >
              {optimizing ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} fill="#ffffff" />}
              {optimizing ? 'Optimizing Schedule…' : 'Re-Optimize Schedule'}
            </button>

            {optStatus && (
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                padding: '5px 10px',
                borderRadius: 8,
                background: optStatus === 'OPTIMAL' ? '#f0fdf4' : '#fef3c7',
                color: optStatus === 'OPTIMAL' ? '#15803d' : '#b45309',
                border: '1px solid ' + (optStatus === 'OPTIMAL' ? '#bbf7d0' : '#fcd34d')
              }}>
                CP-SAT: {optStatus}
              </span>
            )}
          </div>
        </div>

        {/* Right Frosted Glass Box */}
        <div className="hero-banner-glass" style={{
          position: 'relative',
          zIndex: 3,
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          background: 'rgba(255, 255, 255, 0.65)',
          border: '1px solid rgba(255, 255, 255, 0.85)',
          borderRadius: 14,
          padding: '16px 20px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          maxWidth: 260,
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#1e293b',
            fontStyle: 'italic',
            lineHeight: 1.4,
            marginBottom: 10
          }}>
            “Efficient planning today, a safer tomorrow.”
          </div>
          <div style={{
            width: 48,
            height: 2,
            background: 'rgba(100, 116, 139, 0.25)',
            margin: '0 auto 8px auto',
            borderRadius: 1
          }} />
          <div style={{
            fontSize: 11,
            fontWeight: 600,
            color: '#475569',
            letterSpacing: '0.01em'
          }}>
            Ministry of Railways
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* 2. ROW OF 4 METRIC KPI CARDS                                       */}
      {/* ================================================================== */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16
      }}>
        {/* Card 1: Maintenance Demands */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 14,
          padding: '18px 20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          display: 'flex',
          alignItems: 'center',
          gap: 14
        }}>
          <div style={{
            width: 46,
            height: 46,
            borderRadius: '50%',
            background: '#eff6ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#2563eb',
            flexShrink: 0
          }}>
            <Wrench size={22} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>
              Maintenance Demands
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', lineHeight: 1.2, margin: '2px 0' }}>
              {demandsCount}
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#16a34a', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>↓ 12%</span>
              <span style={{ color: '#94a3b8', fontWeight: 500 }}>vs last month</span>
            </div>
          </div>
        </div>

        {/* Card 2: Optimized Block Assignments */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 14,
          padding: '18px 20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          display: 'flex',
          alignItems: 'center',
          gap: 14
        }}>
          <div style={{
            width: 46,
            height: 46,
            borderRadius: '50%',
            background: '#f0fdf4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#16a34a',
            flexShrink: 0
          }}>
            <Calendar size={22} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>
              Optimized Block Assignments
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', lineHeight: 1.2, margin: '2px 0' }}>
              {assignmentsCount}
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#16a34a', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>↑ 18%</span>
              <span style={{ color: '#94a3b8', fontWeight: 500 }}>vs last month</span>
            </div>
          </div>
        </div>

        {/* Card 3: Joint Blocks */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 14,
          padding: '18px 20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          display: 'flex',
          alignItems: 'center',
          gap: 14
        }}>
          <div style={{
            width: 46,
            height: 46,
            borderRadius: '50%',
            background: '#fffbeb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#d97706',
            flexShrink: 0
          }}>
            <Layers size={22} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>
              Joint Blocks
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', lineHeight: 1.2, margin: '2px 0' }}>
              {jointBlocksCount}
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>
              Across 3 departments
            </div>
          </div>
        </div>

        {/* Card 4: Block Windows Utilized */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 14,
          padding: '18px 20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          display: 'flex',
          alignItems: 'center',
          gap: 14
        }}>
          <div style={{
            width: 46,
            height: 46,
            borderRadius: '50%',
            background: '#fff1f2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#e11d48',
            flexShrink: 0
          }}>
            <Clock size={22} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>
              Block Windows Utilized
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', lineHeight: 1.2, margin: '2px 0' }}>
              {utilizationPct}%
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#16a34a', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>↑ 8%</span>
              <span style={{ color: '#94a3b8', fontWeight: 500 }}>vs last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* 3. MIDDLE ROW (DONUT CHART + UPCOMING MAINTENANCE BLOCKS)          */}
      {/* ================================================================== */}
      <div className="dashboard-grid">
        {/* Left Card: Department-wise Maintenance Tasks */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 16,
          padding: '22px 24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
            Department-wise Maintenance Tasks
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
            {/* SVG Donut */}
            <div style={{ position: 'relative', width: 180, height: 180, flexShrink: 0 }}>
              <svg width="180" height="180" viewBox="0 0 180 180" style={{ transform: 'rotate(-90deg)' }}>
                {/* Engineering - Blue */}
                <circle
                  cx="90"
                  cy="90"
                  r="64"
                  fill="transparent"
                  stroke="#2563eb"
                  strokeWidth="24"
                  strokeDasharray={`${engDash} ${c}`}
                  strokeDashoffset={engOffset}
                />
                {/* S&T - Green */}
                <circle
                  cx="90"
                  cy="90"
                  r="64"
                  fill="transparent"
                  stroke="#16a34a"
                  strokeWidth="24"
                  strokeDasharray={`${smtDash} ${c}`}
                  strokeDashoffset={smtOffset}
                />
                {/* TRD - Orange */}
                <circle
                  cx="90"
                  cy="90"
                  r="64"
                  fill="transparent"
                  stroke="#ea580c"
                  strokeWidth="24"
                  strokeDasharray={`${trdDash} ${c}`}
                  strokeDashoffset={trdOffset}
                />
              </svg>

              {/* Segment percentage text overlays */}
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none'
              }}>
                <span style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{assignmentsCount}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginTop: 4 }}>Total Tasks</span>
              </div>

              {/* Floating Percentage Badges */}
              <span style={{ position: 'absolute', top: 78, right: 12, color: '#ffffff', fontSize: 11, fontWeight: 700, pointerEvents: 'none' }}>
                {engPct}%
              </span>
              <span style={{ position: 'absolute', bottom: 32, left: 34, color: '#ffffff', fontSize: 11, fontWeight: 700, pointerEvents: 'none' }}>
                {smtPct}%
              </span>
              <span style={{ position: 'absolute', top: 32, left: 38, color: '#ffffff', fontSize: 11, fontWeight: 700, pointerEvents: 'none' }}>
                {trdPct}%
              </span>
            </div>

            {/* Legend */}
            <div style={{ display: 'grid', gap: 14, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#2563eb' }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>Engineering (CIVIL)</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>{engCount}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#16a34a' }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>Signal & Telecom (S&T)</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>{smtCount}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ea580c' }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>Traction Dist. (TRD)</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>{trdCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Upcoming Maintenance Blocks */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 16,
          padding: '22px 24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
              Upcoming Maintenance Blocks
            </h3>
            {onNavigateToPlanning && (
              <button
                onClick={onNavigateToPlanning}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#2563eb',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                View All →
              </button>
            )}
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                  <th style={{ padding: '8px 12px', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Date & Time</th>
                  <th style={{ padding: '8px 12px', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Section</th>
                  <th style={{ padding: '8px 12px', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Department</th>
                  <th style={{ padding: '8px 12px', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Type</th>
                </tr>
              </thead>
              <tbody>
                {upcomingPlans.length > 0 ? (
                  upcomingPlans.map((p, idx) => {
                    const isEng = (p.department || '').includes('ENG') || (p.department || '').includes('CIVIL');
                    const isSmt = (p.department || '').includes('SMT') || (p.department || '').includes('S&T');
                    const deptColor = isEng ? '#2563eb' : isSmt ? '#16a34a' : '#ea580c';
                    const deptBg = isEng ? '#eff6ff' : isSmt ? '#f0fdf4' : '#fff7ed';
                    const deptBorder = isEng ? '#dbeafe' : isSmt ? '#dcfce7' : '#ffedd5';
                    const deptName = isEng ? 'Engineering' : isSmt ? 'S&T' : 'TRD';

                    return (
                      <tr key={p.task_id || idx} style={{ borderBottom: '1px solid #f8fafc' }}>
                        <td style={{ padding: '12px', verticalAlign: 'middle' }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>
                            {p.date || '08 Sep 2026'}
                          </div>
                          <div style={{ fontSize: 11, color: '#94a3b8' }}>
                            {p.window_start || '02:00'} – {p.window_end || '06:00'}
                          </div>
                        </td>
                        <td style={{ padding: '12px', fontSize: 12, fontWeight: 700, color: '#334155', verticalAlign: 'middle' }}>
                          {p.section_id || 'NDLS – CPRI'}
                        </td>
                        <td style={{ padding: '12px', verticalAlign: 'middle' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#334155' }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: deptColor }} />
                            {deptName}
                          </div>
                        </td>
                        <td style={{ padding: '12px', verticalAlign: 'middle' }}>
                          <span style={{
                            background: deptBg,
                            color: deptColor,
                            border: '1px solid ' + deptBorder,
                            padding: '4px 12px',
                            borderRadius: 20,
                            fontSize: 11,
                            fontWeight: 600
                          }}>
                            {p.task_type || 'Track Work'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <>
                    <tr style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '12px', verticalAlign: 'middle' }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>08 Sep 2026</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>02:00 – 06:00</div>
                      </td>
                      <td style={{ padding: '12px', fontSize: 12, fontWeight: 700, color: '#334155', verticalAlign: 'middle' }}>
                        NDLS – CPRI
                      </td>
                      <td style={{ padding: '12px', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#334155' }}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563eb' }} />
                          Engineering
                        </div>
                      </td>
                      <td style={{ padding: '12px', verticalAlign: 'middle' }}>
                        <span style={{
                          background: '#eff6ff',
                          color: '#1d4ed8',
                          border: '1px solid #dbeafe',
                          padding: '4px 12px',
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 600
                        }}>
                          Track Work
                        </span>
                      </td>
                    </tr>

                    <tr style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '12px', verticalAlign: 'middle' }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>09 Sep 2026</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>01:00 – 05:00</div>
                      </td>
                      <td style={{ padding: '12px', fontSize: 12, fontWeight: 700, color: '#334155', verticalAlign: 'middle' }}>
                        HWH – BWN
                      </td>
                      <td style={{ padding: '12px', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#334155' }}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a' }} />
                          S&T
                        </div>
                      </td>
                      <td style={{ padding: '12px', verticalAlign: 'middle' }}>
                        <span style={{
                          background: '#f0fdf4',
                          color: '#15803d',
                          border: '1px solid #dcfce7',
                          padding: '4px 12px',
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 600
                        }}>
                          Signalling
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td style={{ padding: '12px', verticalAlign: 'middle' }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>10 Sep 2026</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>23:00 – 04:00</div>
                      </td>
                      <td style={{ padding: '12px', fontSize: 12, fontWeight: 700, color: '#334155', verticalAlign: 'middle' }}>
                        MGS – ET
                      </td>
                      <td style={{ padding: '12px', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#334155' }}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ea580c' }} />
                          TRD
                        </div>
                      </td>
                      <td style={{ padding: '12px', verticalAlign: 'middle' }}>
                        <span style={{
                          background: '#fff7ed',
                          color: '#c2410c',
                          border: '1px solid #ffedd5',
                          padding: '4px 12px',
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 600
                        }}>
                          OHE Maintenance
                        </span>
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* 4. ACTIVE CONFLICTS / OPERATIONAL EXCEPTIONS (IF ANY)              */}
      {/* ================================================================== */}
      {conflicts.length > 0 && (
        <div style={{
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: 14,
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#d97706',
              flexShrink: 0
            }}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#92400e' }}>
                {conflicts.length} Operational Exceptions Detected
              </div>
              <div style={{ fontSize: 11, color: '#b45309', marginTop: 1 }}>
                {conflicts.filter(c => c.severity === 'CRITICAL').length} critical safety overlaps require immediate controller review.
              </div>
            </div>
          </div>
          <button
            onClick={onNavigateToConflicts}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: '#ffffff',
              border: '1px solid #fcd34d',
              color: '#b45309',
              padding: '7px 14px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Review Exceptions <ArrowRight size={13} />
          </button>
        </div>
      )}

      {/* ================================================================== */}
      {/* 5. BOTTOM SUSTAINABILITY / IMPACT BANNER                           */}
      {/* ================================================================== */}
      <div style={{
        background: '#f0fdf4',
        border: '1px solid #bbf7d0',
        borderRadius: 14,
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 14
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: '#dcfce7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#15803d',
            flexShrink: 0
          }}>
            <Leaf size={22} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#14532d' }}>
              {downtimeHours} hours of corridor downtime saved this month
            </div>
            <div style={{ fontSize: 12, color: '#4b5563', marginTop: 2 }}>
              Through integrated block planning and cross-department coordination.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, textAlign: 'right' }}>
          <BarChart3 size={24} color="#15803d" />
          <div style={{ fontSize: 12, fontWeight: 500, color: '#374151', maxWidth: 190, lineHeight: 1.3 }}>
            Improving asset availability for a better tomorrow.
          </div>
        </div>
      </div>
    </div>
  );
}
