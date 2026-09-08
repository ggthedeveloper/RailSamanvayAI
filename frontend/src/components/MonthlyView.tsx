import React from 'react';
import { GoodsForecastItem } from '../types';
import { theme, cardStyle, badgeStyle } from '../theme';

export function MonthlyView({ goodsForecasts }: { goodsForecasts: GoodsForecastItem[] }) {
  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: theme.text }}>
          Monthly Rolling Corridor Plan (30-Day Outlook)
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: theme.textMuted }}>
          Macro corridor density analysis cross-referenced with freight train forecasts from FOIS/COA.
        </p>
      </div>

      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: theme.text }}>
          High-Density Corridor Possessions vs Freight Traffic
        </h3>

        <div style={{ display: 'grid', gap: 12 }}>
          {goodsForecasts.slice(0, 10).map((gf, i) => (
            <div key={i} style={{
              padding: 14,
              background: theme.bg,
              borderRadius: 8,
              border: `1px solid ${theme.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <strong style={{ fontSize: 14, color: theme.text }}>Corridor: {gf.corridor_id}</strong>
                  <span style={badgeStyle(
                    gf.density_tier === 'High' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                    gf.density_tier === 'High' ? theme.red : theme.cyan
                  )}>
                    {gf.density_tier} Density Tier
                  </span>
                </div>
                <div style={{ fontSize: 11, color: theme.textDim, marginTop: 4 }}>
                  Zone: {gf.zone} · Horizon: {gf.forecast_horizon_days} Days · Date: {gf.forecast_date ? gf.forecast_date.substring(0, 10) : 'Active Month'} · Source: {gf.data_source || 'FOIS / COA'}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: theme.amber }}>
                  {gf.predicted_goods_trains} Freight Trains/Day
                </div>
                <div style={{ fontSize: 11, color: theme.textDim, marginTop: 2 }}>
                  Confidence Interval: {gf.lower_bound} – {gf.upper_bound} trains
                </div>
              </div>
            </div>
          ))}

          {goodsForecasts.length === 0 && (
            <div style={{ padding: 36, textAlign: 'center', color: theme.textDim }}>
              No freight traffic forecast records available from FOIS/COA feeds.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
