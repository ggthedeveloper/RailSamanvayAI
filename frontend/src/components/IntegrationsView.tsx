import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, Database, ArrowUpRight } from 'lucide-react';
import { DataIntegration } from '../types';
import { theme, cardStyle, badgeStyle, buttonSecondary } from '../theme';

export function IntegrationsView({ integrations }: { integrations: DataIntegration[] }) {
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [syncedIds, setSyncedIds] = useState<Record<string, string>>({});

  const handleSync = (id: string) => {
    setSyncingId(id);
    setTimeout(() => {
      setSyncingId(null);
      setSyncedIds(prev => ({ ...prev, [id]: 'Just now' }));
    }, 700);
  };

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Railway IT Data Integrations
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#cbd5e1' }}>
            Real-time synchronization across Control Office Application (COA), Freight Operations (FOIS), and Departmental Maintenance Systems.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18 }}>
        {integrations.map(feed => {
          const isConnected = feed.status === 'CONNECTED';
          const isSyncing = syncingId === feed.id;
          const displayLastSync = syncedIds[feed.id] || feed.last_sync;

          return (
            <div key={feed.id} style={{
              ...cardStyle,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: '#eff6ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#2563eb'
                    }}>
                      <Database size={16} />
                    </div>
                    <span style={badgeStyle(
                      isConnected ? 'rgba(22, 163, 74, 0.12)' : 'rgba(245, 158, 11, 0.14)',
                      isConnected ? '#16a34a' : '#d97706'
                    )}>
                      <span style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: isConnected ? '#16a34a' : '#d97706',
                        marginRight: 5
                      }} />
                      {isConnected ? 'LIVE & CONNECTED' : feed.status}
                    </span>
                  </div>

                  <span style={{ fontSize: 11, color: theme.textDim }}>
                    Latency: {feed.latency_ms} ms
                  </span>
                </div>

                <h3 style={{ margin: '0 0 4px', fontSize: 17, fontWeight: 800, color: theme.text }}>
                  {feed.name}
                </h3>
                <div style={{ fontSize: 12, color: theme.blue, fontWeight: 600, marginBottom: 14 }}>
                  Department: {feed.department}
                </div>

                <div style={{ padding: '14px 16px', background: 'rgba(241, 245, 249, 0.75)', borderRadius: 12, border: '1px solid rgba(226, 232, 240, 0.9)', marginBottom: 14 }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: theme.text, letterSpacing: '-0.02em' }}>
                    {feed.record_count.toLocaleString()} Records
                  </div>
                  <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 4 }}>
                    {feed.detail}
                  </div>
                </div>
              </div>

              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 11,
                  color: theme.textDim,
                  paddingTop: 12,
                  borderTop: `1px solid ${theme.border}`,
                  marginBottom: 14
                }}>
                  <span>Protocol: <strong>{feed.protocol}</strong></span>
                  <span>Last Sync: <strong>{displayLastSync}</strong></span>
                </div>

                <button
                  type="button"
                  onClick={() => handleSync(feed.id)}
                  disabled={isSyncing}
                  style={{
                    ...buttonSecondary,
                    width: '100%',
                    padding: '8px 14px',
                    fontSize: 12
                  }}
                >
                  <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
                  {isSyncing ? 'Synchronizing…' : 'Sync Feed Now'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
