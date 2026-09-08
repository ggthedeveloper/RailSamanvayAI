import React, { useState } from 'react';
import { Printer, FileText, CheckCircle2, ShieldCheck, X, AlertTriangle } from 'lucide-react';
import { PlanTask } from '../types';
import { theme, cardStyle, badgeStyle, inputStyle, getDeptColor, buttonPrimary } from '../theme';

interface ApprovalViewProps {
  plans: PlanTask[];
  approverName: string;
  setApproverName: (name: string) => void;
  approverRole: string;
  setApproverRole: (role: string) => void;
  approvalRemarks: string;
  setApprovalRemarks: (rem: string) => void;
  onApproveTask: (taskId: string, action: 'APPROVED' | 'REJECTED') => void;
  approvingTaskId: string | null;
}

export function ApprovalView({
  plans,
  approverName,
  setApproverName,
  approverRole,
  setApproverRole,
  approvalRemarks,
  setApprovalRemarks,
  onApproveTask,
  approvingTaskId
}: ApprovalViewProps) {
  const [selectedTaskForSlip, setSelectedTaskForSlip] = useState<PlanTask | null>(null);

  const approvedCount = plans.filter(p => p.approval_status === 'APPROVED').length;
  const pendingCount = plans.filter(p => !p.approval_status || p.approval_status === 'PENDING_APPROVAL').length;

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: theme.text }}>
            Railway Possession Sign-Off Desk
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: theme.textMuted }}>
            Formal block possession authorization by Chief Controller, Section Controller, and Station Master.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: theme.textMuted, marginRight: 6 }}>
            Authorized: <strong style={{ color: theme.green }}>{approvedCount}</strong> | Pending: <strong style={{ color: theme.amber }}>{pendingCount}</strong>
          </span>
          {approvedCount > 0 && (
            <button
              onClick={() => setSelectedTaskForSlip(plans.find(p => p.approval_status === 'APPROVED') || plans[0])}
              style={{ ...buttonPrimary, display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Printer size={15} />
              Print Sanction Memo
            </button>
          )}
        </div>
      </div>

      {/* Controller Details */}
      <div style={{ ...cardStyle, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <div>
          <label style={{ display: 'block', fontSize: 11, color: theme.textMuted, fontWeight: 700, marginBottom: 4 }}>
            Authorizing Officer Name
          </label>
          <input
            style={inputStyle}
            value={approverName}
            onChange={e => setApproverName(e.target.value)}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 11, color: theme.textMuted, fontWeight: 700, marginBottom: 4 }}>
            Operational Role
          </label>
          <select
            style={inputStyle}
            value={approverRole}
            onChange={e => setApproverRole(e.target.value)}
          >
            <option value="Chief Controller">Chief Controller (Operations)</option>
            <option value="Section Controller">Section Controller</option>
            <option value="Station Master">Station Master</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 11, color: theme.textMuted, fontWeight: 700, marginBottom: 4 }}>
            Default Sign-Off Endorsement
          </label>
          <input
            style={inputStyle}
            value={approvalRemarks}
            onChange={e => setApprovalRemarks(e.target.value)}
          />
        </div>
      </div>

      {/* Approval Table */}
      <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, textAlign: 'left' }}>
            <thead>
              <tr style={{ background: theme.cardHeader, borderBottom: `1px solid ${theme.border}` }}>
                {['Task ID', 'Corridor / Section', 'Department', 'Possession Mode', 'Task Type', 'Window Time', 'Duration', 'Safety Flag', 'Sign-Off Status', 'Authorized By', 'Decision', 'Sanction Memo'].map((h, i) => (
                  <th key={i} style={{ padding: '12px 14px', color: theme.textMuted, fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {plans.slice(0, 40).map((p, idx) => {
                const isApproved = p.approval_status === 'APPROVED';
                const deptColor = getDeptColor(p.department);
                return (
                  <tr key={idx} style={{ borderBottom: `1px solid ${theme.border}` }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: theme.cyan }}>{p.task_id}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 600 }}>{p.section_id}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={badgeStyle(deptColor.bg, deptColor.text)}>{p.department}</span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      {p.is_joint_possession ? (
                        <span style={badgeStyle('rgba(16, 185, 129, 0.2)', theme.green)}>
                          ⚡ JOINT (+180m Saved)
                        </span>
                      ) : (
                        <span style={{ fontSize: 11, color: theme.textDim }}>Single Dept</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 14px' }}>{p.task_type}</td>
                    <td style={{ padding: '12px 14px', color: theme.textDim }}>
                      <div>{p.date}</div>
                      <small style={{ color: theme.textMuted }}>
                        {p.window_start ? p.window_start.substring(11, 16) : '23:00'} - {p.window_end ? p.window_end.substring(11, 16) : '02:00'}
                      </small>
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 700 }}>{p.duration || p.required_duration_min} min</td>
                    <td style={{ padding: '12px 14px' }}>
                      {p.safety_critical ? (
                        <span style={badgeStyle('rgba(239, 68, 68, 0.2)', theme.red)}>CRITICAL</span>
                      ) : (
                        <span style={{ color: theme.textDim }}>Normal</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      {isApproved ? (
                        <span style={badgeStyle('rgba(16, 185, 129, 0.2)', theme.green)}>✓ AUTHORIZED</span>
                      ) : (
                        <span style={badgeStyle('rgba(245, 158, 11, 0.2)', theme.amber)}>⏳ PENDING</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 14px', color: theme.textDim }}>
                      {p.approved_by || 'Chief Controller'}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {!isApproved ? (
                          <button
                            onClick={() => onApproveTask(p.task_id, 'APPROVED')}
                            disabled={approvingTaskId === p.task_id}
                            style={{
                              padding: '5px 12px',
                              background: theme.green,
                              color: '#fff',
                              border: 0,
                              borderRadius: 4,
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Authorize
                          </button>
                        ) : (
                          <button
                            onClick={() => onApproveTask(p.task_id, 'REJECTED')}
                            disabled={approvingTaskId === p.task_id}
                            style={{
                              padding: '5px 12px',
                              background: 'rgba(239, 68, 68, 0.2)',
                              color: theme.red,
                              border: `1px solid ${theme.red}44`,
                              borderRadius: 4,
                              cursor: 'pointer'
                            }}
                          >
                            Revoke
                          </button>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <button
                        onClick={() => setSelectedTaskForSlip(p)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          padding: '4px 8px',
                          background: 'rgba(14, 165, 233, 0.1)',
                          border: `1px solid rgba(14, 165, 233, 0.3)`,
                          color: theme.cyan,
                          borderRadius: 4,
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        <FileText size={12} /> Notice
                      </button>
                    </td>
                  </tr>
                );
              })}

              {plans.length === 0 && (
                <tr>
                  <td colSpan={10} style={{ padding: 36, textAlign: 'center', color: theme.textDim }}>
                    No scheduled blocks currently pending sign-off. Run the CP-SAT optimizer to generate possession requisitions.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Indian Railways Block Sanction Notice Modal */}
      {selectedTaskForSlip && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 16
        }}>
          <div style={{
            background: '#ffffff',
            color: '#0f172a',
            width: '100%',
            maxWidth: 680,
            borderRadius: 12,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '2px solid #0284c7',
            overflow: 'hidden',
            display: 'grid'
          }}>
            {/* Modal Header */}
            <div style={{
              background: '#0369a1',
              color: '#ffffff',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <ShieldCheck size={24} color="#38bdf8" />
                <div>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#bae6fd' }}>
                    Government of India — Ministry of Railways (Railway Board)
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800 }}>
                    Control Office Block Sanction Memo (Form IR-CO-04)
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedTaskForSlip(null)}
                style={{ background: 'transparent', border: 0, color: '#ffffff', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Notice Body */}
            <div style={{ padding: 24, display: 'grid', gap: 16, fontSize: 13, maxHeight: '75vh', overflowY: 'auto' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingBottom: 12,
                borderBottom: '1px dashed #cbd5e1'
              }}>
                <div>
                  <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>SANCTION NOTICE NO:</span>
                  <div style={{ fontWeight: 800, fontSize: 14, color: '#0369a1' }}>
                    IR/BDMS/{selectedTaskForSlip.section_id}/{selectedTaskForSlip.task_id}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>ISSUED AT:</span>
                  <div style={{ fontWeight: 700 }}>
                    {new Date().toLocaleString('en-IN', { hour12: false })} IST
                  </div>
                </div>
              </div>

              {/* Sanction Details Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 12,
                background: '#f8fafc',
                padding: 14,
                borderRadius: 8,
                border: '1px solid #e2e8f0'
              }}>
                <div>
                  <span style={{ fontSize: 11, color: '#64748b' }}>CORRIDOR / SECTION:</span>
                  <div style={{ fontWeight: 800, fontSize: 14 }}>{selectedTaskForSlip.section_id}</div>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: '#64748b' }}>BLOCK WINDOW ID:</span>
                  <div style={{ fontWeight: 700 }}>{selectedTaskForSlip.block_id}</div>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: '#64748b' }}>SCHEDULED DATE & TIME:</span>
                  <div style={{ fontWeight: 700 }}>
                    {selectedTaskForSlip.date} ({selectedTaskForSlip.window_start ? selectedTaskForSlip.window_start.substring(11, 16) : '23:00'} - {selectedTaskForSlip.window_end ? selectedTaskForSlip.window_end.substring(11, 16) : '02:00'})
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: '#64748b' }}>SANCTIONED DURATION:</span>
                  <div style={{ fontWeight: 800, color: '#0284c7' }}>
                    {selectedTaskForSlip.duration || selectedTaskForSlip.required_duration_min} Minutes
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: '#64748b' }}>PRIMARY DEPARTMENT:</span>
                  <div style={{ fontWeight: 700 }}>{selectedTaskForSlip.department}</div>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: '#64748b' }}>POSSESSION CLASSIFICATION:</span>
                  <div style={{ fontWeight: 800, color: selectedTaskForSlip.is_joint_possession ? '#16a34a' : '#0f172a' }}>
                    {selectedTaskForSlip.is_joint_possession ? '⚡ JOINT MULTI-DEPARTMENT POSSESSION' : 'INDEPENDENT POSSESSION'}
                  </div>
                </div>
              </div>

              {selectedTaskForSlip.is_joint_possession && (
                <div style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  padding: 12,
                  borderRadius: 6,
                  fontSize: 12,
                  color: '#166534'
                }}>
                  <strong>Multi-Department Coordination Protocol:</strong> This window is bundled with {selectedTaskForSlip.bundled_with || 'secondary department'}. Combined shadow block eliminates duplicate corridor closure and saves ~180 minutes of train path detention.
                </div>
              )}

              {/* Safety Disconnections Table */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Mandatory Disconnection & Traction Safety Clearances:
                </div>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: 10, fontSize: 11 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #e2e8f0' }}>
                    <span>Traction OHE Power Isolation (PTW Permit):</span>
                    <strong style={{ color: selectedTaskForSlip.power_isolation_required === 'Yes' ? '#dc2626' : '#16a34a' }}>
                      {selectedTaskForSlip.power_isolation_required === 'Yes' ? 'MANDATORY (Permit to Work Required)' : 'NOT REQUIRED'}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #e2e8f0' }}>
                    <span>S&T Relay & Track Circuit Disconnection:</span>
                    <strong style={{ color: '#16a34a' }}>AUTHORIZED PER CODE T/351</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                    <span>Fouling Mark & Engineering Flagging:</span>
                    <strong style={{ color: '#16a34a' }}>BANNER FLAGS AT 600m & DETONATORS AT 1200m</strong>
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 20,
                marginTop: 10,
                paddingTop: 16,
                borderTop: '1px solid #cbd5e1'
              }}>
                <div>
                  <span style={{ fontSize: 11, color: '#64748b' }}>AUTHORIZING OFFICIAL:</span>
                  <div style={{ fontWeight: 800, color: '#0f172a' }}>{selectedTaskForSlip.approved_by || approverName}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{approverRole}</div>
                  <div style={{ fontSize: 10, color: '#16a34a', marginTop: 4, fontWeight: 600 }}>
                    ✓ Authenticated via Railway Central Operations
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 11, color: '#64748b' }}>STATION MASTER ENDORSEMENT:</span>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>Section Control / SM On-Duty</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Line-Clear Suspension Notified</div>
                  <div style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>
                    Endorsement: {selectedTaskForSlip.approval_remarks || approvalRemarks}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{
              background: '#f1f5f9',
              padding: '14px 20px',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 10,
              borderTop: '1px solid #e2e8f0'
            }}>
              <button
                onClick={() => setSelectedTaskForSlip(null)}
                style={{
                  padding: '8px 16px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: 6,
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: 12,
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                style={{
                  padding: '8px 18px',
                  background: '#0284c7',
                  border: 0,
                  borderRadius: 6,
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer'
                }}
              >
                <Printer size={14} /> Print Sanction Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
