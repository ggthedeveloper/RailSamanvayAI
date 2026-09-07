import React, { FormEvent, useState, useMemo } from 'react';
import axios from 'axios';
import { Sparkles, RefreshCw, AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import { Station, RouteAnalysisResult } from '../types';
import { API_URL, theme, cardStyle, inputStyle, buttonPrimary, badgeStyle, apiError, authHeaders } from '../theme';

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

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label style={{ fontSize: 12, color: theme.text, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={safetyCritical}
              onChange={e => setSafetyCritical(e.target.checked)}
              style={{ accentColor: theme.red }}
            />
            Safety-Critical Infrastructure Asset
          </label>
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

      {routeAnalysis && (
        <div style={{
          marginTop: 16,
          padding: 16,
          background: routeAnalysis.block_required ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)',
          border: `1px solid ${routeAnalysis.block_required ? theme.red : theme.green}44`,
          borderRadius: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
            <span style={badgeStyle(
              routeAnalysis.block_required ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
              routeAnalysis.block_required ? theme.red : theme.green
            )}>
              {routeAnalysis.verdict}
            </span>
            <span style={{ fontSize: 12, fontWeight: 800, color: routeAnalysis.block_required ? theme.red : theme.green }}>
              {routeAnalysis.risk_probability}% Risk
            </span>
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

          <div style={{ fontSize: 11, color: theme.textMuted }}>
            {routeAnalysis.summary}
          </div>
        </div>
      )}
    </div>
  );
}
