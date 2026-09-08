import React, { useEffect, useState, useCallback } from 'react';
import { BrowserRouter, Navigate, Route, Routes, NavLink, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Train, RefreshCw, Clock, LogOut, Activity, MapPin, Layers,
  ListTodo, Calendar, Compass, AlertTriangle, FileCheck, Database,
  Settings, Cpu, Play, AlertOctagon
} from 'lucide-react';

import {
  Station, Section, PlanTask, MaintenanceTaskItem, AssetItem,
  BlockWindowItem, ConflictItem, DataIntegration, GoodsForecastItem,
  RouteAnalysisResult, ModelHealth
} from './types';
import { API_URL, theme, cardStyle, badgeStyle, buttonPrimary, authHeaders, apiError } from './theme';

import { ErrorBoundary } from './components/ErrorBoundary';
import { Login } from './components/Login';
import { MapView } from './components/MapView';
import { RouteAnalyzer } from './components/RouteAnalyzer';
import { OverviewView } from './components/OverviewView';
import { PlanningView } from './components/PlanningView';
import { TasksView } from './components/TasksView';
import { WeeklyView } from './components/WeeklyView';
import { MonthlyView } from './components/MonthlyView';
import { ConflictsView } from './components/ConflictsView';
import { ApprovalView } from './components/ApprovalView';
import { IntegrationsView } from './components/IntegrationsView';
import { SettingsView } from './components/SettingsView';

function ControlRoom({ token, onLogout }: { token: string; onLogout: () => void }) {
  // Navigation Hooks
  const navigate = useNavigate();
  const location = useLocation();

  // Core Data Stores
  const [stations, setStations] = useState<Station[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [plans, setPlans] = useState<PlanTask[]>([]);
  const [tasks, setTasks] = useState<MaintenanceTaskItem[]>([]);
  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [blocks, setBlocks] = useState<BlockWindowItem[]>([]);
  const [conflicts, setConflicts] = useState<ConflictItem[]>([]);
  const [integrations, setIntegrations] = useState<DataIntegration[]>([]);
  const [goodsForecasts, setGoodsForecasts] = useState<GoodsForecastItem[]>([]);
  const [modelHealth, setModelHealth] = useState<ModelHealth | null>(null);

  // States & Filters
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const [optStatus, setOptStatus] = useState<string>('');
  const [optObjective, setOptObjective] = useState<number | null>(null);
  const [selectedHorizon, setSelectedHorizon] = useState<'weekly' | 'monthly'>('weekly');
  const [objectiveProfile, setObjectiveProfile] = useState<string>('safety_first');
  const [lastOptimizedAt, setLastOptimizedAt] = useState<string>('Not run yet');
  const [errorBanner, setErrorBanner] = useState<string>('');
  const [stationsError, setStationsError] = useState<string>('');

  // Map & Route Analyzer Selection
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [routeFrom, setRouteFrom] = useState<string>('NDLS');
  const [routeTo, setRouteTo] = useState<string>('MTJ');
  const [routeAnalysis, setRouteAnalysis] = useState<RouteAnalysisResult | null>(null);

  // Approval Workspace Action State
  const [approverName, setApproverName] = useState<string>('Chief Controller');
  const [approverRole, setApproverRole] = useState<string>('Chief Controller');
  const [approvalRemarks, setApprovalRemarks] = useState<string>('Approved per Indian Railways Safety Regulations');
  const [approvingTaskId, setApprovingTaskId] = useState<string | null>(null);

  // Live Clock
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-IN', { hour12: false }) + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // ------------------------------------------------------------------------
  // DATA FETCHING (Decoupled from selectedStation to eliminate request storms)
  // ------------------------------------------------------------------------
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setErrorBanner('');
    setStationsError('');
    try {
      const headers = authHeaders(token);
      const [stRes, secRes, plRes, tskRes, astRes, blkRes, confRes, intRes, gfRes, mhRes] = await Promise.allSettled([
        axios.get<Station[]>(`${API_URL}/stations`, { headers }),
        axios.get<Section[]>(`${API_URL}/sections`, { headers }),
        axios.get<PlanTask[]>(`${API_URL}/plans/optimized`, { headers }),
        axios.get<MaintenanceTaskItem[]>(`${API_URL}/maintenance/tasks`, { headers }),
        axios.get<AssetItem[]>(`${API_URL}/assets`, { headers }),
        axios.get<BlockWindowItem[]>(`${API_URL}/blocks/availability`, { headers }),
        axios.get<ConflictItem[]>(`${API_URL}/plans/conflicts`, { headers }),
        axios.get<{ integrations: DataIntegration[] }>(`${API_URL}/data-integrations/status`, { headers }),
        axios.get<GoodsForecastItem[]>(`${API_URL}/goods-forecast?limit=100`, { headers }),
        axios.get<ModelHealth>(`${API_URL}/models/health`, { headers })
      ]);

      if (stRes.status === 'fulfilled') {
        const list = Array.isArray(stRes.value.data) ? stRes.value.data : [];
        setStations(list);
        if (list.length > 0) {
          setSelectedStation(prev => prev || list.find(s => s.code === 'NDLS') || list[0]);
        }
      } else {
        setStationsError(apiError(stRes.reason, 'Failed to load railway network stations.'));
      }

      if (secRes.status === 'fulfilled') setSections(Array.isArray(secRes.value.data) ? secRes.value.data : []);
      if (plRes.status === 'fulfilled') {
        const planList = Array.isArray(plRes.value.data) ? plRes.value.data : [];
        setPlans(planList);
        if (planList.length > 0) {
          setOptStatus(prev => prev || 'OPTIMAL');
          setLastOptimizedAt(prev => prev === 'Not run yet' ? 'Canonical Schedule' : prev);
        }
      }
      if (tskRes.status === 'fulfilled') setTasks(Array.isArray(tskRes.value.data) ? tskRes.value.data : []);
      if (astRes.status === 'fulfilled') setAssets(Array.isArray(astRes.value.data) ? astRes.value.data : []);
      if (blkRes.status === 'fulfilled') setBlocks(Array.isArray(blkRes.value.data) ? blkRes.value.data : []);
      if (confRes.status === 'fulfilled') setConflicts(Array.isArray(confRes.value.data) ? confRes.value.data : []);
      if (intRes.status === 'fulfilled' && intRes.value.data?.integrations) {
        setIntegrations(intRes.value.data.integrations);
      }
      if (gfRes.status === 'fulfilled') setGoodsForecasts(Array.isArray(gfRes.value.data) ? gfRes.value.data : []);
      if (mhRes.status === 'fulfilled') setModelHealth(mhRes.value.data);

    } catch (err) {
      setErrorBanner(apiError(err, 'Failed to synchronize with Central Operations server.'));
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // ------------------------------------------------------------------------
  // TRIGGER CP-SAT OPTIMIZER
  // ------------------------------------------------------------------------
  const handleRunOptimizer = async () => {
    setOptimizing(true);
    setErrorBanner('');
    try {
      const { data } = await axios.post<{
        status: string;
        objective_value: number;
        tasks_scheduled: number;
        blocks_used: number;
        horizon: string;
        solver: string;
        timestamp: string;
        plan: PlanTask[];
      }>(
        `${API_URL}/plans/generate`,
        {
          horizon: selectedHorizon,
          timeout_seconds: 30,
          objective_profile: objectiveProfile
        },
        { headers: authHeaders(token) }
      );

      setOptStatus(data.status || 'OPTIMAL');
      setOptObjective(data.objective_value || 0);
      setLastOptimizedAt(new Date().toLocaleTimeString('en-IN', { hour12: false }) + ' IST');
      if (Array.isArray(data.plan)) {
        setPlans(data.plan);
      } else {
        await fetchAllData();
      }

      // Re-fetch conflicts after re-planning
      try {
        const confRes = await axios.get<ConflictItem[]>(`${API_URL}/plans/conflicts`, { headers: authHeaders(token) });
        if (Array.isArray(confRes.data)) setConflicts(confRes.data);
      } catch {
        // non-blocking
      }
    } catch (err) {
      setErrorBanner(apiError(err, 'CP-SAT optimization run failed. Check solver constraints.'));
    } finally {
      setOptimizing(false);
    }
  };

  // ------------------------------------------------------------------------
  // POSSESSION APPROVAL
  // ------------------------------------------------------------------------
  const handleApproveTask = async (taskId: string, action: 'APPROVED' | 'REJECTED') => {
    setApprovingTaskId(taskId);
    try {
      await axios.post(
        `${API_URL}/plans/approve`,
        {
          task_id: taskId,
          action,
          approver: approverName,
          role: approverRole,
          remarks: approvalRemarks
        },
        { headers: authHeaders(token) }
      );

      // Local optimistic update
      setPlans(prev => prev.map(p => {
        if (p.task_id === taskId) {
          return {
            ...p,
            approval_status: action,
            approved_by: approverName,
            approval_remarks: approvalRemarks,
            approved_at: new Date().toLocaleTimeString('en-IN', { hour12: false }) + ' IST'
          };
        }
        return p;
      }));
    } catch (err) {
      setErrorBanner(apiError(err, 'Failed to record possession sign-off.'));
    } finally {
      setApprovingTaskId(null);
    }
  };

  const totalTasks = tasks.length;
  const blocksUsedCount = new Set(plans.map(p => p.block_id)).size;

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, color: theme.text, fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* ------------------------------------------------------------------ */}
      {/* TOP RAILWAY OPERATIONS CONTROL HEADER */}
      {/* ------------------------------------------------------------------ */}
      <header style={{
        height: 68,
        padding: '0 24px',
        background: '#ffffff',
        borderBottom: `1px solid ${theme.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <img
            src="/railway_logo.png"
            alt="Indian Railways"
            style={{
              width: 42,
              height: 42,
              borderRadius: '50%',
              objectFit: 'cover',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em', color: '#0f172a' }}>
                RailSamanvayAI
              </span>
              <span style={{
                padding: '2px 8px',
                borderRadius: 6,
                background: '#e0f2fe',
                color: '#0284c7',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.04em'
              }}>
                IR-BLOCK-AI v2.4
              </span>
            </div>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 500 }}>
              Automatic Railway Block Planning System · Ministry of Railways
            </div>
          </div>
        </div>

        {/* Status Indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Signal Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#475569', padding: '6px 12px', background: '#f8fafc', border: `1px solid ${theme.border}`, borderRadius: 8 }}>
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: optStatus === 'OPTIMAL' ? '#16a34a' : optStatus ? '#d97706' : '#94a3b8',
              boxShadow: optStatus ? `0 0 6px ${optStatus === 'OPTIMAL' ? '#16a34a' : '#d97706'}` : 'none'
            }} />
            <span style={{ fontWeight: 600 }}>
              {optStatus === 'OPTIMAL' ? 'CP-SAT Solver Optimal' : optStatus ? 'Fallback Rules Active' : 'Solver Idle (Not run yet)'}
            </span>
          </div>

          {/* Time Clock */}
          <div style={{
            padding: '6px 12px',
            background: '#f8fafc',
            border: `1px solid ${theme.border}`,
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 700,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            color: '#0f172a',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            <Clock size={14} color="#2563eb" />
            {currentTime}
          </div>

          {/* Refresh Action */}
          <button
            onClick={fetchAllData}
            title="Refresh All Feeds"
            style={{
              background: '#ffffff',
              border: `1px solid ${theme.borderLight}`,
              color: '#334155',
              padding: '7px 12px',
              borderRadius: 8,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              fontWeight: 600,
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Sync Feeds
          </button>

          {/* User Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 14, borderLeft: `1px solid ${theme.border}` }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>
                {approverName}
              </div>
              <div style={{ fontSize: 10, color: '#0284c7', fontWeight: 600 }}>
                Operations Controller
              </div>
            </div>
            <button
              onClick={onLogout}
              title="Sign Out"
              style={{
                background: 'rgba(220, 38, 38, 0.08)',
                border: '1px solid rgba(220, 38, 38, 0.2)',
                color: '#dc2626',
                padding: '7px 10px',
                borderRadius: 8,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 11,
                fontWeight: 700
              }}
            >
              <LogOut size={13} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* MAIN LAYOUT: SIDEBAR + WORKSPACE */}
      {/* ------------------------------------------------------------------ */}
      <div className="app-layout">
        {/* SIDEBAR NAVIGATION */}
        <aside style={{
          background: '#ffffff',
          borderRight: `1px solid ${theme.border}`,
          padding: '20px 14px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ padding: '0 10px 10px', fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Operations Navigation
            </div>

            <nav style={{ display: 'grid', gap: 4 }}>
              {[
                { path: '/overview', label: 'Overview', icon: Activity },
                { path: '/network', label: 'Network Map & AI', icon: MapPin },
                { path: '/planning', label: 'Block Planning', icon: Layers, badge: plans.length },
                { path: '/tasks', label: 'Maintenance Tasks', icon: ListTodo, badge: tasks.length },
                { path: '/weekly', label: 'Weekly Plan', icon: Calendar },
                { path: '/monthly', label: 'Monthly Rolling', icon: Compass },
                { path: '/conflicts', label: 'Conflicts & Alerts', icon: AlertTriangle, badge: conflicts.length, badgeColor: theme.red },
                { path: '/approval', label: 'Possession Sign-Off', icon: FileCheck },
                {
                  path: '/integrations',
                  label: 'Data Integrations',
                  icon: Database,
                  badge: integrations.length > 0 ? `${integrations.filter(i => i.status === 'CONNECTED').length}/${integrations.length}` : undefined
                },
                { path: '/settings', label: 'Solver & Config', icon: Settings }
              ].map(item => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '10px 12px',
                      border: `1px solid ${isActive ? '#bfdbfe' : 'transparent'}`,
                      borderRadius: 8,
                      background: isActive ? '#eff6ff' : 'transparent',
                      color: isActive ? '#1d4ed8' : '#475569',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: 13,
                      textDecoration: 'none',
                      boxSizing: 'border-box',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    })}
                  >
                    {({ isActive }) => (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <Icon size={16} color={isActive ? '#2563eb' : '#64748b'} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && (
                          <span style={{
                            padding: '2px 7px',
                            borderRadius: 12,
                            background: isActive ? '#dbeafe' : item.badgeColor ? `${item.badgeColor}15` : '#f1f5f9',
                            color: isActive ? '#1e40af' : item.badgeColor || '#64748b',
                            fontSize: 11,
                            fontWeight: 700
                          }}>
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Quick Solver Control Card in Sidebar */}
          <div style={{
            background: '#f8fafc',
            border: `1px solid ${theme.border}`,
            borderRadius: 10,
            padding: 14,
            marginTop: 20
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Cpu size={16} color="#2563eb" />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                OR-Tools CP-SAT
              </span>
            </div>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 12, lineHeight: 1.4 }}>
              Constraint Optimization Engine · Horizon: <strong>{selectedHorizon === 'weekly' ? '7-Day' : '30-Day'}</strong>
            </div>
            <button
              onClick={handleRunOptimizer}
              disabled={optimizing}
              style={{
                ...buttonPrimary,
                width: '100%',
                padding: '8px 12px',
                fontSize: 12
              }}
            >
              {optimizing ? (
                <>
                  <RefreshCw size={13} className="animate-spin" />
                  Solving Model…
                </>
              ) : (
                <>
                  <Play size={13} fill="#ffffff" />
                  Run CP-SAT Plan
                </>
              )}
            </button>
          </div>
        </aside>

        {/* WORKSPACE AREA */}
        <main style={{ padding: 24, overflowY: 'auto', maxHeight: 'calc(100vh - 68px)' }}>
          {errorBanner && (
            <div style={{
              padding: '12px 16px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${theme.red}`,
              borderRadius: 8,
              color: '#fca5a5',
              fontSize: 13,
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <AlertTriangle size={18} color={theme.red} />
                <span>{errorBanner}</span>
              </div>
              <button
                onClick={() => setErrorBanner('')}
                style={{ background: 'none', border: 0, color: '#fca5a5', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
          )}

          <Routes>
            <Route path="overview" element={
              <ErrorBoundary moduleName="Central Operations Overview">
                <OverviewView
                  totalTasks={totalTasks}
                  plans={plans}
                  tasks={tasks}
                  blocks={blocks}
                  conflicts={conflicts}
                  optStatus={optStatus}
                  optObjective={optObjective}
                  optimizing={optimizing}
                  onRunOptimizer={handleRunOptimizer}
                  onNavigateToConflicts={() => navigate('/conflicts')}
                  onNavigateToPlanning={() => navigate('/planning')}
                />
              </ErrorBoundary>
            } />

            <Route path="network" element={
              <ErrorBoundary moduleName="Network Map & AI Route Analyzer">
                <div style={{ display: 'grid', gap: 20 }}>
                  <div>
                    <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: theme.text }}>
                      Indian Railways Network Map & AI Route Analyzer
                    </h1>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: theme.textMuted }}>
                      Live geospatial corridor view ({stations.length} stations, {sections.length} active corridor sections) with calibrated failure-risk ML engine.
                    </p>
                  </div>

                  <div className="network-grid">
                    <MapView
                      stations={stations}
                      sections={sections}
                      selectedStation={selectedStation}
                      onSelectStation={(s) => {
                        setSelectedStation(s);
                        setRouteFrom(s.code);
                      }}
                      routeAnalysis={routeAnalysis}
                      loading={loading}
                      error={stationsError}
                      onRetry={fetchAllData}
                    />

                    <div style={{ display: 'grid', gap: 16 }}>
                      {selectedStation && (
                        <div style={cardStyle}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                            <div>
                              <span style={badgeStyle('rgba(56, 189, 248, 0.2)', theme.cyan)}>
                                STATION JUNCTION INSPECTOR
                              </span>
                              <h3 style={{ margin: '6px 0 0', fontSize: 18, fontWeight: 800, color: theme.text }}>
                                {selectedStation.name} ({selectedStation.code})
                              </h3>
                            </div>
                            <div style={{ fontSize: 11, color: theme.textDim }}>
                              Coordinates: {Number.isFinite(selectedStation.lat) ? selectedStation.lat.toFixed(4) : 'N/A'}, {Number.isFinite(selectedStation.lon) ? selectedStation.lon.toFixed(4) : 'N/A'}
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 12 }}>
                            <div style={{ padding: 10, background: theme.bg, borderRadius: 8 }}>
                              <span style={{ color: theme.textDim, display: 'block', marginBottom: 2 }}>Connected Sections</span>
                              <strong style={{ color: theme.text }}>
                                {sections.filter(sec => sec.station_from === selectedStation.code || sec.station_to === selectedStation.code).length} Corridors
                              </strong>
                            </div>
                            <div style={{ padding: 10, background: theme.bg, borderRadius: 8 }}>
                              <span style={{ color: theme.textDim, display: 'block', marginBottom: 2 }}>Pending Corridor Tasks</span>
                              <strong style={{ color: theme.cyan }}>
                                {plans.filter(p => (p.section_id || '').includes(selectedStation.code)).length} Scheduled Blocks
                              </strong>
                            </div>
                          </div>
                        </div>
                      )}

                      <RouteAnalyzer
                        stations={stations}
                        token={token}
                        fromStation={routeFrom}
                        setFromStation={setRouteFrom}
                        toStation={routeTo}
                        setToStation={setRouteTo}
                        routeAnalysis={routeAnalysis}
                        setRouteAnalysis={setRouteAnalysis}
                      />
                    </div>
                  </div>
                </div>
              </ErrorBoundary>
            } />

            <Route path="map" element={<Navigate to="/network" replace />} />

            <Route path="planning" element={
              <ErrorBoundary moduleName="Automatic Block Planning">
                <PlanningView
                  plans={plans}
                  totalTasks={totalTasks}
                  blocksUsedCount={blocksUsedCount}
                  selectedHorizon={selectedHorizon}
                  setSelectedHorizon={setSelectedHorizon}
                  objectiveProfile={objectiveProfile}
                  setObjectiveProfile={setObjectiveProfile}
                  optStatus={optStatus}
                  optObjective={optObjective}
                  lastOptimizedAt={lastOptimizedAt}
                  optimizing={optimizing}
                  onRunOptimizer={handleRunOptimizer}
                  onApproveTask={handleApproveTask}
                  approvingTaskId={approvingTaskId}
                />
              </ErrorBoundary>
            } />

            <Route path="tasks" element={
              <ErrorBoundary moduleName="Maintenance Tasks Repository">
                <TasksView tasks={tasks} />
              </ErrorBoundary>
            } />

            <Route path="weekly" element={
              <ErrorBoundary moduleName="Weekly Corridor Schedule">
                <WeeklyView plans={plans} />
              </ErrorBoundary>
            } />

            <Route path="monthly" element={
              <ErrorBoundary moduleName="Monthly Rolling Plan">
                <MonthlyView goodsForecasts={goodsForecasts} />
              </ErrorBoundary>
            } />

            <Route path="conflicts" element={
              <ErrorBoundary moduleName="Conflicts & Operational Alerts">
                <ConflictsView conflicts={conflicts} />
              </ErrorBoundary>
            } />

            <Route path="approval" element={
              <ErrorBoundary moduleName="Possession Sign-Off Desk">
                <ApprovalView
                  plans={plans}
                  approverName={approverName}
                  setApproverName={setApproverName}
                  approverRole={approverRole}
                  setApproverRole={setApproverRole}
                  approvalRemarks={approvalRemarks}
                  setApprovalRemarks={setApprovalRemarks}
                  onApproveTask={handleApproveTask}
                  approvingTaskId={approvingTaskId}
                />
              </ErrorBoundary>
            } />

            <Route path="integrations" element={
              <ErrorBoundary moduleName="Railway IT Data Integrations">
                <IntegrationsView integrations={integrations} />
              </ErrorBoundary>
            } />

            <Route path="settings" element={
              <ErrorBoundary moduleName="System Settings & Model Card">
                <SettingsView modelHealth={modelHealth} />
              </ErrorBoundary>
            } />

            <Route path="" element={<Navigate to="/overview" replace />} />
            <Route path="*" element={<Navigate to="/overview" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// ROOT ROUTER
// --------------------------------------------------------------------------
export default function App() {
  const [token, setToken] = useState<string>(() => localStorage.getItem('token') || '');

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={token ? <Navigate to="/overview" replace /> : <Login setToken={setToken} />}
        />
        <Route
          path="/*"
          element={
            token ? (
              <ControlRoom
                token={token}
                onLogout={() => {
                  localStorage.removeItem('token');
                  setToken('');
                }}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
