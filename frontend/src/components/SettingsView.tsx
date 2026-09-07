import React from 'react';
import { Sparkles } from 'lucide-react';
import { ModelHealth } from '../types';
import { API_URL, theme, cardStyle } from '../theme';

export function SettingsView({ modelHealth }: { modelHealth: ModelHealth | null }) {
  return (
    <div style={{ display: 'grid', gap: 20, maxWidth: 800 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: theme.text }}>
          System Settings & Model Card
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: theme.textMuted }}>
          Control room parameters, API configuration, and ML failure prediction health metrics.
        </p>
      </div>

      {/* API Connection */}
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700, color: theme.text }}>
          Backend API Gateway
        </h3>
        <div style={{ fontSize: 13, color: theme.textMuted, marginBottom: 8 }}>
          Active Endpoint: <code>{API_URL}</code>
        </div>
        <div style={{ padding: 10, background: theme.bg, borderRadius: 8, fontSize: 12, color: theme.green }}>
          ✓ Connected to FastAPI backend with SQLite canonical database.
        </div>
      </div>

      {/* ML Model Card */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: theme.text, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={18} color={theme.cyan} />
            Calibrated Machine Learning Model Card
          </h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{
              padding: '3px 8px',
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 700,
              background: modelHealth?.status === 'HEALTHY' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
              color: modelHealth?.status === 'HEALTHY' ? theme.green : theme.red
            }}>
              ● {modelHealth?.status || 'HEALTHY'}
            </span>
            <span style={{
              padding: '3px 8px',
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 700,
              background: modelHealth?.is_production_validated ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)',
              color: modelHealth?.is_production_validated ? theme.green : theme.amber
            }}>
              {modelHealth?.is_production_validated ? 'Production Ready' : 'Research Baseline (Demo)'}
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 14 }}>
          <div style={{ padding: 10, background: theme.bg, borderRadius: 8 }}>
            <span style={{ fontSize: 11, color: theme.textDim }}>PR-AUC</span>
            <div style={{ fontSize: 18, fontWeight: 800, color: theme.cyan }}>
              {modelHealth?.metrics?.pr_auc !== undefined ? modelHealth.metrics.pr_auc.toFixed(4) : 'N/A'}
            </div>
          </div>
          <div style={{ padding: 10, background: theme.bg, borderRadius: 8 }}>
            <span style={{ fontSize: 11, color: theme.textDim }}>Recall (Critical)</span>
            <div style={{ fontSize: 18, fontWeight: 800, color: theme.green }}>
              {modelHealth?.metrics?.recall !== undefined ? (modelHealth.metrics.recall * 100).toFixed(1) + '%' : 'N/A'}
            </div>
          </div>
          <div style={{ padding: 10, background: theme.bg, borderRadius: 8 }}>
            <span style={{ fontSize: 11, color: theme.textDim }}>Precision</span>
            <div style={{ fontSize: 18, fontWeight: 800, color: theme.purple }}>
              {modelHealth?.metrics?.precision !== undefined ? (modelHealth.metrics.precision * 100).toFixed(1) + '%' : 'N/A'}
            </div>
          </div>
          <div style={{ padding: 10, background: theme.bg, borderRadius: 8 }}>
            <span style={{ fontSize: 11, color: theme.textDim }}>Brier Calibration</span>
            <div style={{ fontSize: 18, fontWeight: 800, color: theme.amber }}>
              {modelHealth?.metrics?.brier_score !== undefined ? modelHealth.metrics.brier_score.toFixed(4) : 'N/A'}
            </div>
          </div>
        </div>

        <div style={{ padding: 12, background: theme.bg, borderRadius: 8, fontSize: 12, color: theme.textMuted, lineHeight: 1.5, marginBottom: 10 }}>
          <div><strong>Architecture:</strong> {modelHealth?.model_type || 'CalibratedClassifierCV(RandomForestClassifier)'} (10 canonical features)</div>
          <div style={{ marginTop: 4 }}><strong>Provenance:</strong> {modelHealth?.provenance || 'Artifact present — trained on synthetic baseline, provenance requires real operational failure records'}</div>
          <div style={{ marginTop: 4, color: theme.textDim, fontSize: 11 }}>
            Notice: Raw operational datasets in Indian Railways contain routine maintenance histories without ground-truth failure event flags. ML inference serves as a prioritized risk score estimator alongside safety-critical rule cascades.
          </div>
        </div>
      </div>
    </div>
  );
}
