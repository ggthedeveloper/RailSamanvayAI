import React, { useState } from 'react';
import { Printer, FileText, CheckCircle2, ShieldCheck, X, AlertTriangle, Clock, UserCheck, Shield } from 'lucide-react';
import { PlanTask } from '../types';
import { theme, cardStyle, badgeStyle, inputStyle, getDeptColor, buttonPrimary, buttonSecondary } from '../theme';

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
  const [activeTab, setActiveTab] = useState<'cards' | 'table'>('cards');

  const approvedCount = plans.filter(p => p.approval_status === 'APPROVED').length;
  const pendingCount = plans.filter(p => !p.approval_status || p.approval_status === 'PENDING_APPROVAL').length;

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Possession Sign-Off &amp; Authorization
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#cbd5e1' }}>
            Official digital possession sign-off under Indian Railways General Rules (GR &amp; SR).
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{
            display: 'flex',
            background: 'rgba(7, 20, 42, 0.75)',
            backdropFilter: 'blur(12px)',
            padding: 3,
            borderRadius: 8,
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <button
              onClick={() => setActiveTab('cards')}
              style={{
                padding: '6px 12px',
                border: 0,
                borderRadius: 6,
                background: activeTab === 'cards' ? theme.blue : 'transparent',
                color: activeTab === 'cards' ? '#ffffff' : '#cbd5e1',
                fontWeight: activeTab === 'cards' ? 700 : 500,
                fontSize: 12,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Sign-Off Cards
            </button>
            <button
              onClick={() => setActiveTab('table')}
              style={{
                padding: '6px 12px',
                border: 0,
                borderRadius: 6,
                background: activeTab === 'table' ? theme.blue : 'transparent',
                color: activeTab === 'table' ? '#ffffff' : '#cbd5e1',
                fontWeight: activeTab === 'table' ? 700 : 500,
                fontSize: 12,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Master Register
            </button>
          </div>

          {approvedCount > 0 && (
            <button
              onClick={() => setSelectedTaskForSlip(plans.find(p => p.approval_status === 'APPROVED') || plans[0])}
              style={{ ...buttonPrimary, padding: '7px 14px', fontSize: 12 }}
            >
              <Printer size={14} />
              Print Sanction Memo
            </button>
          )}
        </div>
      </div>

      {/* Authorizing Controller Configuration */}
      <div style={{
        ...cardStyle,
        padding: 20,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16
      }}>
        <div>
          <label style={{ display: 'block', fontSize: 11, color: theme.textMuted, fontWeight: 700, marginBottom: 5 }}>
            Authorizing Controller Name
          </label>
          <input
            style={inputStyle}
            value={approverName}
            onChange={e => setApproverName(e.target.value)}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 11, color: theme.textMuted, fontWeight: 700, marginBottom: 5 }}>
            Designated Authority Role
          </label>
          <select
            style={inputStyle}
            value={approverRole}
            onChange={e => setApproverRole(e.target.value)}
          >
            <option value="Chief Controller">Chief Controller (Operating)</option>
            <option value="Section Controller">Section Controller</option>
            <option value="Station Master">Station Master</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 11, color: theme.textMuted, fontWeight: 700, marginBottom: 5 }}>
            Standard Endorsement Remarks
          </label>
          <input
            style={inputStyle}
            value={approvalRemarks}
            onChange={e => setApprovalRemarks(e.target.value)}
          />
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
        <div style={{ ...cardStyle, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 11, color: theme.textMuted, fontWeight: 600 }}>Total Requisitions</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: theme.text }}>{plans.length}</div>
          </div>
          <Shield size={22} color="#2563eb" />
        </div>

        <div style={{ ...cardStyle, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 11, color: theme.textMuted, fontWeight: 600 }}>Authorized Possessions</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#16a34a' }}>{approvedCount}</div>
          </div>
          <CheckCircle2 size={22} color="#16a34a" />
        </div>

        <div style={{ ...cardStyle, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 11, color: theme.textMuted, fontWeight: 600 }}>Awaiting Controller Sign-Off</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#d97706' }}>{pendingCount}</div>
          </div>
          <Clock size={22} color="#d97706" />
        </div>
      </div>

      {/* VIEW MODE 1: ACTIONABLE POSSESSION CARDS */}
      {activeTab === 'cards' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 18
        }}>
          {plans.map((p, idx) => {
            const isApproved = p.approval_status === 'APPROVED';
            const deptColor = getDeptColor(p.department);
            const timeStr = `${p.window_start ? p.window_start.substring(11, 16) : '23:00'} - ${p.window_end ? p.window_end.substring(11, 16) : '02:00'}`;

            return (
              <div key={idx} style={{
                ...cardStyle,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderLeft: `4px solid ${isApproved ? '#16a34a' : '#d97706'}`
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: theme.text }}>
                      Block: {p.block_id}
                    </span>
                    <span style={badgeStyle(
                      isApproved ? 'rgba(22, 163, 74, 0.12)' : 'rgba(245, 158, 11, 0.14)',
                      isApproved ? '#16a34a' : '#d97706'
                    )}>
                      {isApproved ? '✓ AUTHORIZED' : '⏳ PENDING APPROVAL'}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '12px 14px', background: 'rgba(241, 245, 249, 0.75)', border: '1px solid rgba(226, 232, 240, 0.8)', borderRadius: 10, marginBottom: 14 }}>
                    <div>
                      <span style={{ fontSize: 11, color: theme.textDim, display: 'block' }}>Section</span>
                      <strong style={{ fontSize: 13, color: theme.text }}>{p.section_id}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: 11, color: theme.textDim, display: 'block' }}>Department</span>
                      <span style={badgeStyle(deptColor.bg, deptColor.text)}>{p.department}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: 11, color: theme.textDim, display: 'block' }}>Requested By</span>
                      <strong style={{ fontSize: 12, color: theme.text }}>{p.approved_by || 'Section Planner'}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: 11, color: theme.textDim, display: 'block' }}>Time &amp; Date</span>
                      <strong style={{ fontSize: 12, color: theme.text }}>{p.date} ({timeStr})</strong>
                    </div>
                  </div>

                  <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 14 }}>
                    <strong>Task:</strong> {p.task_type} ({p.duration || p.required_duration_min} min)
                    {p.is_joint_possession && (
                      <span style={{ marginLeft: 8, color: '#16a34a', fontWeight: 700 }}>• Joint Block</span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, paddingTop: 12, borderTop: `1px solid ${theme.border}` }}>
                  {!isApproved ? (
                    <button
                      onClick={() => onApproveTask(p.task_id, 'APPROVED')}
                      disabled={approvingTaskId === p.task_id}
                      style={{
                        ...buttonPrimary,
                        flex: 1,
                        background: '#16a34a',
                        borderColor: '#15803d',
                        padding: '8px 12px',
                        fontSize: 12
                      }}
                    >
                      Authorize Possession
                    </button>
                  ) : (
                    <button
                      onClick={() => onApproveTask(p.task_id, 'REJECTED')}
                      disabled={approvingTaskId === p.task_id}
                      style={{
                        ...buttonSecondary,
                        flex: 1,
                        color: '#dc2626',
                        borderColor: '#fca5a5',
                        background: '#fef2f2',
                        padding: '8px 12px',
                        fontSize: 12
                      }}
                    >
                      Revoke Authorization
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedTaskForSlip(p)}
                    style={{
                      ...buttonSecondary,
                      padding: '8px 12px',
                      fontSize: 12
                    }}
                    title="View Sanction Notice"
                  >
                    <FileText size={14} />
                    Memo
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW MODE 2: MASTER REGISTER TABLE */}
      {activeTab === 'table' && (
        <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(241, 245, 249, 0.85)', borderBottom: `1px solid ${theme.border}` }}>
                  {['Task ID', 'Corridor / Section', 'Department', 'Possession Mode', 'Task Type', 'Window Time', 'Duration', 'Sign-Off Status', 'Authorized By', 'Action'].map((h, i) => (
                    <th key={i} style={{ padding: '12px 14px', color: theme.textMuted, fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {plans.slice(0, 40).map((p, idx) => {
                  const isApproved = p.approval_status === 'APPROVED';
                  const deptColor = getDeptColor(p.department);
                  return (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: `1px solid ${theme.border}`,
                        background: idx % 2 === 0 ? 'transparent' : 'rgba(241, 245, 249, 0.5)'
                      }}
                    >
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: theme.blue }}>{p.task_id}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 600 }}>{p.section_id}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={badgeStyle(deptColor.bg, deptColor.text)}>{p.department}</span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        {p.is_joint_possession ? (
                          <span style={badgeStyle('rgba(16, 185, 129, 0.15)', theme.green)}>
                            ⚡ JOINT
                          </span>
                        ) : (
                          <span style={{ fontSize: 11, color: theme.textDim }}>Single</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 14px' }}>{p.task_type}</td>
                      <td style={{ padding: '12px 14px', color: theme.textDim }}>
                        {p.date} ({p.window_start ? p.window_start.substring(11, 16) : '23:00'} - {p.window_end ? p.window_end.substring(11, 16) : '02:00'})
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 700 }}>{p.duration || p.required_duration_min} min</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={badgeStyle(
                          isApproved ? 'rgba(22, 163, 74, 0.12)' : 'rgba(245, 158, 11, 0.14)',
                          isApproved ? '#16a34a' : '#d97706'
                        )}>
                          {isApproved ? '✓ AUTHORIZED' : '⏳ PENDING'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', color: theme.textMuted }}>
                        {p.approved_by || 'Chief Controller'}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {!isApproved ? (
                            <button
                              onClick={() => onApproveTask(p.task_id, 'APPROVED')}
                              disabled={approvingTaskId === p.task_id}
                              style={{
                                padding: '5px 10px',
                                background: '#16a34a',
                                color: '#fff',
                                border: 0,
                                borderRadius: 6,
                                fontWeight: 700,
                                cursor: 'pointer',
                                fontSize: 11
                              }}
                            >
                              Authorize
                            </button>
                          ) : (
                            <button
                              onClick={() => onApproveTask(p.task_id, 'REJECTED')}
                              disabled={approvingTaskId === p.task_id}
                              style={{
                                padding: '5px 10px',
                                background: '#fef2f2',
                                color: '#dc2626',
                                border: '1px solid #fca5a5',
                                borderRadius: 6,
                                fontWeight: 700,
                                cursor: 'pointer',
                                fontSize: 11
                              }}
                            >
                              Revoke
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SANCTION MEMO MODAL */}
      {selectedTaskForSlip && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: 20
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 16,
            padding: '28px',
            maxWidth: 640,
            width: '100%',
            boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
            position: 'relative'
          }}>
            <button
              onClick={() => setSelectedTaskForSlip(null)}
              style={{ position: 'absolute', right: 18, top: 18, background: 'none', border: 0, cursor: 'pointer', color: '#64748b' }}
            >
              <X size={20} />
            </button>

            <div style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', paddingBottom: 14, marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b' }}>
                INDIAN RAILWAYS • OPERATING DEPARTMENT
              </div>
              <h2 style={{ margin: '4px 0 0', fontSize: 18, fontWeight: 900, color: '#0f172a' }}>
                TRAIN TRAFFIC &amp; POWER BLOCK SANCTION MEMO
              </h2>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                Rule 4.19 / General &amp; Subsidiary Rules (GR &amp; SR) Compliance
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, fontSize: 12, marginBottom: 18, color: '#000000' }}>
              <div><strong>Sanction Memo ID:</strong> {selectedTaskForSlip.task_id}-MEMO</div>
              <div><strong>Block ID:</strong> {selectedTaskForSlip.block_id}</div>
              <div><strong>Corridor Section:</strong> {selectedTaskForSlip.section_id}</div>
              <div><strong>Department:</strong> {selectedTaskForSlip.department}</div>
              <div><strong>Date of Block:</strong> {selectedTaskForSlip.date}</div>
              <div><strong>Granted Window:</strong> {selectedTaskForSlip.window_start ? selectedTaskForSlip.window_start.substring(11, 16) : '23:00'} to {selectedTaskForSlip.window_end ? selectedTaskForSlip.window_end.substring(11, 16) : '02:00'} ({selectedTaskForSlip.duration} min)</div>
              <div><strong>Authorized Officer:</strong> {approverName} ({approverRole})</div>
              <div><strong>Joint Possession:</strong> {selectedTaskForSlip.is_joint_possession ? 'Yes (Combined Possession)' : 'No'}</div>
            </div>

            <div style={{ padding: 12, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, marginBottom: 18, color: '#000000' }}>
              <strong>Endorsement Remarks:</strong> {approvalRemarks}
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                onClick={() => window.print()}
                style={buttonPrimary}
              >
                <Printer size={15} />
                Print Official Slip
              </button>
              <button
                onClick={() => setSelectedTaskForSlip(null)}
                style={buttonSecondary}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
