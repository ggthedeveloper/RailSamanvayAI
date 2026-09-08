import React from 'react';
import { DataIntegration } from '../types';
import { theme, cardStyle, badgeStyle } from '../theme';

export function IntegrationsView({ integrations }: { integrations: DataIntegration[] }) {
  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: theme.text }}>
          Railway IT Data Integration Matrix
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: theme.textMuted }}>
          Operational database synchronization status across core Indian Railways systems (Imported feeds).
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
        {integrations.map(feed => (
          <div key={feed.id} style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={badgeStyle(
                feed.status === 'CONNECTED' ? 'rgba(16, 185, 129, 0.2)' : feed.status === 'READY' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                feed.status === 'CONNECTED' ? theme.green : feed.status === 'READY' ? theme.cyan : theme.red
              )}>
                ● {feed.status === 'CONNECTED' ? 'IMPORTED & ACTIVE' : feed.status}
              </span>
              <span style={{ fontSize: 11, color: theme.textDim }}>
                Latency: {feed.latency_ms} ms
              </span>
            </div>

            <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 700, color: theme.text }}>
              {feed.name}
            </h3>
            <div style={{ fontSize: 12, color: theme.cyan, fontWeight: 600, marginBottom: 10 }}>
              Managing Department: {feed.department}
            </div>

            <div style={{ padding: 10, background: theme.bg, borderRadius: 8, marginBottom: 12 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: theme.text }}>
                {feed.record_count.toLocaleString()} Records
              </div>
              <div style={{ fontSize: 11, color: theme.textDim, marginTop: 2 }}>
                {feed.detail}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: theme.textDim }}>
              <span>Protocol: {feed.protocol}</span>
              <span>Last Sync: {feed.last_sync}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
