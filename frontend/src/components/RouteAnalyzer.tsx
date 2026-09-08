import React, { FormEvent, useState, useMemo } from 'react';
import axios from 'axios';
import { Sparkles, RefreshCw, AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import { Station, RouteAnalysisResult } from '../types';
import { API_URL, theme, cardStyle, inputStyle, buttonPrimary, badgeStyle, apiError, authHeaders, getRiskTheme } from '../theme';

interface RouteAnalyzerProps {
  stations: Station[];
  token: string;
  fromStation: string;
  setFromStation: (code: string) => void;
  toStation: string;
  setToStation: (code: string) => void;
  routeAnalysis: RouteAnalysisResult | null;
  setRouteAnalysis: (res: RouteAnalysisResult | null) => void;
}

export function RouteAnalyzer({
  stations,
  token,
  fromStation,
  setFromStation,
  toStation,
  setToStation,
  routeAnalysis,
  setRouteAnalysis
}: RouteAnalyzerProps) {
  const [department, setDepartment] = useState<string>('ENGINEERING');
  const [conditionScore, setConditionScore] = useState<number>(0.55);
  const [overdueDays, setOverdueDays] = useState<number>(14);
  const [trafficLoad, setTrafficLoad] = useState<number>(130);
  const [safetyCritical, setSafetyCritical] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [stationSearch, setStationSearch] = useState<string>('');

  const validStations = useMemo(() => {
    return stations.filter(s => s.code && Number.isFinite(Number(s.lat)) && Number.isFinite(Number(s.lon)));
  }, [stations]);

  // Filtered station list for selection
  const filteredStationOptions = useMemo(() => {
    const q = stationSearch.toLowerCase().trim();
    if (!q) {
      // Prioritize key junction stations, then first 100 alphabetically
      const keyCodes = ['NDLS', 'MTJ', 'AGC', 'GWL', 'CNB', 'HWH', 'BCT', 'BVI', 'BPL', 'ET', 'BSL', 'CSMT', 'DDU', 'ALD'];
      const keySet = new Set(keyCodes);
      const topStations = validStations.filter(s => keySet.has(s.code));
      const otherStations = validStations.filter(s => !keySet.has(s.code)).slice(0, 150);
      return [...topStations, ...otherStations];
    }
    return validStations.filter(s =>
      s.code.toLowerCase().includes(q) || (s.name && s.name.toLowerCase().includes(q))
    ).slice(0, 150);
  }, [validStations, stationSearch]);

  const handleAnalyze = async (e: FormEvent) => {
    e.preventDefault();
    if (!fromStation || !toStation || fromStation === toStation) {
      setError('Select two distinct origin and destination stations.');
      return;
    }

    const fromExists = stations.some(s => s.code === fromStation);
    const toExists = stations.some(s => s.code === toStation);
    if (!fromExists || !toExists) {
      setError('Origin and destination stations must both exist in the railway network.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data } = await axios.post<RouteAnalysisResult>(
        `${API_URL}/routes/analyze`,
        {
          station_from: fromStation,
          station_to: toStation,
          department,
          condition_score: conditionScore,
          overdue_days: overdueDays,
          traffic_load: trafficLoad,
          safety_critical: safetyCritical
        },
        { headers: authHeaders(token) }
      );
      setRouteAnalysis(data);
    } catch (err) {
      setError(apiError(err, 'Route failure risk prediction failed.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={cardStyle}>
      <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: theme.text, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Sparkles size={18} color={theme.cyan} />
        AI Route Block Requirement Analyzer
      </h3>

      {error && (
        <div style={{ padding: 10, background: 'rgba(239, 68, 68, 0.15)', borderRadius: 6, color: '#dc2626', fontSize: 12, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      <div style={{ marginBottom: 10 }}>
        <input
          style={{ ...inputStyle, fontSize: 11, padding: '5px 10px' }}
          placeholder="Filter stations by code/name (e.g. NDLS, MTJ, Delhi)..."
          value={stationSearch}
          onChange={e => setStationSearch(e.target.value)}
        />
      </div>

      <form onSubmit={handleAnalyze} style={{ display: 'grid', gap: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: theme.textMuted, fontWeight: 700, marginBottom: 4 }}>
              Origin Station
            </label>
            <select
              style={inputStyle}
              value={fromStation}
              onChange={e => setFromStation(e.target.value)}
            >
              {filteredStationOptions.map(s => (
                <option key={s.code} value={s.code}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11, color: theme.textMuted, fontWeight: 700, marginBottom: 4 }}>
              Destination Station
            </label>
            <select
              style={inputStyle}
              value={toStation}
              onChange={e => setToStation(e.target.value)}
            >
              {filteredStationOptions.map(s => (
                <option key={s.code} value={s.code}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: theme.textMuted, fontWeight: 700, marginBottom: 4 }}>
              Department
            </label>
            <select
              style={inputStyle}
              value={department}
              onChange={e => setDepartment(e.target.value)}
            >
              <option value="ENGINEERING">ENGINEERING (Track)</option>
              <option value="SMT">S&T (Signals/Interlocking)</option>
              <option value="TRD">TRD (OHE Traction)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11, color: theme.textMuted, fontWeight: 700, marginBottom: 4 }}>
              Overdue Days: {overdueDays}d
            </label>
            <input
              type="number"
              min="0"
              max="90"
              style={inputStyle}
              value={overdueDays}
              onChange={e => setOverdueDays(Math.max(0, Number(e.target.value) || 0))}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: theme.textMuted, fontWeight: 700, marginBottom: 4 }}>
              Corridor Traffic Load ({trafficLoad} trains/day)
            </label>
            <input
              type="number"
              min="10"
              max="300"
              style={inputStyle}
              value={trafficLoad}
              onChange={e => setTrafficLoad(Math.max(10, Math.min(300, Number(e.target.value) || 120)))}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11, color: theme.textMuted, fontWeight: 700, marginBottom: 4 }}>
              Safety-Critical Asset Flag
            </label>
            <label style={{ fontSize: 12, color: theme.text, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', height: 38 }}>
              <input
                type="checkbox"
                checked={safetyCritical}
                onChange={e => setSafetyCritical(e.target.checked)}
                style={{ accentColor: theme.red }}
              />
              Safety Critical Infrastructure
            </label>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: theme.textMuted, marginBottom: 4 }}>
            <span>Asset Condition Score: <strong>{conditionScore.toFixed(2)}</strong></span>
            <span>{conditionScore < 0.6 ? 'Degraded Asset' : 'Stable Condition'}</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={conditionScore}
            onChange={e => setConditionScore(Number(e.target.value))}
            style={{ width: '100%', accentColor: theme.cyan }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ ...buttonPrimary, marginTop: 6 }}
        >
          {loading ? <RefreshCw size={15} className="animate-spin" /> : <Sparkles size={15} />}
          {loading ? 'Evaluating Corridor Risk…' : 'Run AI Route Risk Assessment'}
        </button>
      </form>

      {routeAnalysis && (() => {
        const risk = getRiskTheme(routeAnalysis.risk_probability);
        const prob = routeAnalysis.risk_probability;

        return (
          <div style={{
            marginTop: 16,
            padding: 16,
            background: risk.bg,
            border: `1px solid ${risk.border}`,
            borderRadius: 10,
            transition: 'all 0.2s ease'
          }}>
            {/* Top Risk Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  padding: '3px 9px',
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  background: risk.badgeBg,
                  color: risk.color,
                  border: `1px solid ${risk.border}`,
                  textTransform: 'uppercase'
                }}>
                  {risk.level} RISK
                </span>
                <span style={badgeStyle(risk.badgeBg, risk.color)}>
                  {routeAnalysis.verdict}
                </span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 800, color: risk.color }}>
                {prob}% Failure Risk
              </span>
            </div>

            {/* Visual 3-Tier Risk Color Meter */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, fontWeight: 700, marginBottom: 4 }}>
                <span style={{ color: risk.level === 'LOW' ? '#15803d' : theme.textDim, fontWeight: risk.level === 'LOW' ? 800 : 500 }}>
                  ● Low (&lt;35%)
                </span>
                <span style={{ color: risk.level === 'MEDIUM' ? '#ca8a04' : theme.textDim, fontWeight: risk.level === 'MEDIUM' ? 800 : 500 }}>
                  ● Medium (35–65%)
                </span>
                <span style={{ color: risk.level === 'HIGH' ? '#dc2626' : theme.textDim, fontWeight: risk.level === 'HIGH' ? 800 : 500 }}>
                  ● High (&ge;65%)
                </span>
              </div>
              <div style={{
                height: 8,
                borderRadius: 4,
                background: '#e2e8f0',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(100, Math.max(5, prob))}%`,
                  background: risk.color,
                  borderRadius: 4,
                  transition: 'width 0.4s ease, background 0.2s ease'
                }} />
              </div>
            </div>

            <div style={{ fontSize: 11, color: theme.textMuted, marginBottom: 8 }}>
              Method: <strong>{routeAnalysis.prediction_mode === 'calibrated_random_forest' ? 'Calibrated RF Baseline' : 'Deterministic Safety Rule'}</strong>
              {routeAnalysis.telemetry_source && ` · Telemetry: ${routeAnalysis.telemetry_source}`}
            </div>

            <div style={{ fontSize: 12, color: theme.text, marginBottom: 8 }}>
              <strong>Recommended Possession:</strong> {routeAnalysis.recommended_window} ({routeAnalysis.estimated_duration_min} min)
            </div>

            {routeAnalysis.departments_involved && routeAnalysis.departments_involved.length > 1 && (
              <div style={{ fontSize: 11, color: theme.cyan, marginBottom: 8 }}>
                <strong>Cross-Department Possessions:</strong> {routeAnalysis.departments_involved.join(' + ')}
              </div>
            )}

            {routeAnalysis.factors_increasing_risk && routeAnalysis.factors_increasing_risk.length > 0 && (
              <div style={{ fontSize: 11, color: '#dc2626', marginBottom: 6 }}>
                <strong>Risk Factors:</strong> {routeAnalysis.factors_increasing_risk.join('; ')}
              </div>
            )}

            {routeAnalysis.factors_reducing_risk && routeAnalysis.factors_reducing_risk.length > 0 && (
              <div style={{ fontSize: 11, color: '#15803d', marginBottom: 6 }}>
                <strong>Mitigating Factors:</strong> {routeAnalysis.factors_reducing_risk.join('; ')}
              </div>
            )}

            <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 6, borderTop: `1px solid ${theme.borderLight}`, paddingTop: 6 }}>
              {routeAnalysis.summary}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
