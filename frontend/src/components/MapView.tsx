import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, Popup, useMap } from 'react-leaflet';
import { Radio, RefreshCw, AlertCircle, MapPin } from 'lucide-react';
import { Station, Section, RouteAnalysisResult } from '../types';
import { theme, cardStyle, getCoords } from '../theme';

function RecenterMap({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center && Number.isFinite(center[0]) && Number.isFinite(center[1])) {
      map.flyTo(center, Math.max(map.getZoom(), 6), { duration: 0.7 });
    }
  }, [center, map]);
  return null;
}

interface MapViewProps {
  stations: Station[];
  sections: Section[];
  selectedStation: Station | null;
  onSelectStation: (s: Station) => void;
  routeAnalysis: RouteAnalysisResult | null;
}

export function MapView({
  stations,
  sections,
  selectedStation,
  onSelectStation,
  routeAnalysis
}: MapViewProps) {
  const [tileError, setTileError] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  // Validate coordinates strictly: finite and within valid geographic bounds
  const validStations = useMemo(() => {
    return stations.filter(s => {
      const coords = getCoords(s);
      return coords !== null;
    });
  }, [stations]);

  const stationMap = useMemo(() => {
    const map = new Map<string, Station>();
    validStations.forEach(s => {
      if (s.code && !map.has(s.code)) {
        map.set(s.code, s);
      }
    });
    return map;
  }, [validStations]);

  // Section lines for map
  const sectionLines = useMemo(() => {
    return sections
      .map(sec => {
        const fromSt = stationMap.get(sec.station_from);
        const toSt = stationMap.get(sec.station_to);
        if (fromSt && toSt) {
          const c1 = getCoords(fromSt);
          const c2 = getCoords(toSt);
          if (c1 && c2) {
            return {
              id: sec.id,
              positions: [c1, c2] as [number, number][],
              from: fromSt,
              to: toSt,
              dist: sec.distance_km
            };
          }
        }
        return null;
      })
      .filter((s): s is { id: string; positions: [number, number][]; from: Station; to: Station; dist: number } => s !== null);
  }, [sections, stationMap]);

  const selectedCoords = useMemo(() => getCoords(selectedStation), [selectedStation]);

  const analyzedRouteLine = useMemo(() => {
    if (!routeAnalysis) return null;
    const cFrom = getCoords(routeAnalysis.from_station);
    const cTo = getCoords(routeAnalysis.to_station);
    if (cFrom && cTo) {
      return [cFrom, cTo] as [number, number][];
    }
    return null;
  }, [routeAnalysis]);

  // Selected stations to display on map (prioritizing stations with sections, major junctions, and selected)
  const displayStations = useMemo(() => {
    const priorityCodes = new Set<string>();
    if (selectedStation?.code) priorityCodes.add(selectedStation.code);
    ['NDLS', 'MTJ', 'AGC', 'GWL', 'BVI', 'BCT', 'CNB', 'HWH', 'BPL', 'ET', 'BSL', 'CSMT'].forEach(c => priorityCodes.add(c));
    sections.forEach(sec => {
      if (sec.station_from) priorityCodes.add(sec.station_from);
      if (sec.station_to) priorityCodes.add(sec.station_to);
    });

    const prioritized: Station[] = [];
    const others: Station[] = [];

    validStations.forEach(s => {
      if (priorityCodes.has(s.code)) {
        prioritized.push(s);
      } else {
        others.push(s);
      }
    });

    return [...prioritized, ...others.slice(0, Math.max(0, 300 - prioritized.length))];
  }, [validStations, sections, selectedStation]);

  return (
    <div style={{ ...cardStyle, padding: 0, overflow: 'hidden', height: 620, display: 'flex', flexDirection: 'column' }}>
      <div style={{
        padding: '12px 18px',
        background: theme.cardHeader,
        borderBottom: `1px solid ${theme.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 8
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700 }}>
          <Radio size={16} color={theme.cyan} />
          Centralized Traffic Control (CTC) Corridor Display
          <span style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, marginLeft: 8 }}>
            ({validStations.length} nodes · {sections.length} corridor sections)
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {selectedStation && (
            <span style={{ fontSize: 11, color: theme.cyan, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={13} />
              Selected: {selectedStation.name} ({selectedStation.code})
            </span>
          )}
          <button
            onClick={() => setResetKey(k => k + 1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 8px',
              fontSize: 11,
              fontWeight: 600,
              background: theme.surface,
              border: `1px solid ${theme.border}`,
              borderRadius: 4,
              color: theme.text,
              cursor: 'pointer'
            }}
            title="Recenter CTC display to National Capital corridor"
          >
            <RefreshCw size={12} />
            Recenter Map
          </button>
        </div>
      </div>

      {tileError && (
        <div style={{
          padding: '6px 14px',
          background: 'rgba(245, 158, 11, 0.1)',
          borderBottom: `1px solid ${theme.border}`,
          fontSize: 11,
          color: '#d97706',
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
          <AlertCircle size={14} />
          Base map tiles unavailable (restricted network / offline). Station markers and corridor geometry remain fully active.
        </div>
      )}

      <div style={{ flex: 1, position: 'relative', width: '100%', minHeight: 480 }}>
        {validStations.length === 0 ? (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8fafc',
            flexDirection: 'column',
            gap: 8,
            zIndex: 1000
          }}>
            <RefreshCw size={24} className="animate-spin" color={theme.cyan} />
            <span style={{ fontSize: 13, color: theme.textMuted }}>
              Loading station coordinates from Indian Railways network...
            </span>
          </div>
        ) : (
          <MapContainer
            key={resetKey}
            center={selectedCoords || [28.6423, 77.2200]}
            zoom={6}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%', minHeight: 480, background: '#f8fafc' }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors &copy; CARTO"
              url="https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png"
              eventHandlers={{
                tileerror: () => setTileError(true)
              }}
            />

            <RecenterMap center={selectedCoords} />

            {/* Corridor Section Polylines */}
            {sectionLines.map(sec => (
              <Polyline
                key={sec.id}
                positions={sec.positions}
                color="#2563eb"
                weight={3}
                opacity={0.65}
                dashArray="5, 8"
              >
                <Popup>
                  <div style={{ color: '#0f172a', fontSize: 12 }}>
                    <strong>Corridor: {sec.id}</strong><br />
                    {sec.from.name} ({sec.from.code}) ↔ {sec.to.name} ({sec.to.code})<br />
                    Distance: {sec.dist} km
                  </div>
                </Popup>
              </Polyline>
            ))}

            {/* Analyzed Route Polyline Highlight */}
            {analyzedRouteLine && (
              <Polyline
                positions={analyzedRouteLine}
                color={routeAnalysis?.block_required ? theme.red : theme.green}
                weight={6}
                opacity={0.9}
              >
                <Popup>
                  <div style={{ color: '#0f172a', fontSize: 12 }}>
                    <strong>{routeAnalysis?.verdict}</strong><br />
                    {routeAnalysis?.summary}
                  </div>
                </Popup>
              </Polyline>
            )}

            {/* Station Circle Markers */}
            {displayStations.map(s => {
              const coords = getCoords(s);
              if (!coords) return null;
              const isSelected = selectedStation?.code === s.code;
              const isMajor = ['NDLS', 'MTJ', 'AGC', 'GWL', 'BVI', 'BCT', 'CNB', 'HWH'].includes(s.code);
              const latNum = Number(s.lat);
              const lonNum = Number(s.lon);
              const latDisplay = Number.isFinite(latNum) ? latNum.toFixed(4) : 'N/A';
              const lonDisplay = Number.isFinite(lonNum) ? lonNum.toFixed(4) : 'N/A';

              return (
                <CircleMarker
                  key={s.code}
                  center={coords}
                  radius={isSelected ? 9 : isMajor ? 7 : 4}
                  pathOptions={{
                    color: isSelected ? '#fbbf24' : isMajor ? theme.cyan : '#475569',
                    fillColor: isSelected ? '#f59e0b' : isMajor ? '#0284c7' : '#ffffff',
                    fillOpacity: 0.9,
                    weight: isSelected ? 3 : 1
                  }}
                  eventHandlers={{
                    click: () => onSelectStation(s)
                  }}
                >
                  <Popup>
                    <div style={{ color: '#0f172a', fontSize: 12 }}>
                      <strong>{s.name} ({s.code})</strong><br />
                      Lat: {latDisplay}, Lon: {lonDisplay}<br />
                      <button
                        onClick={() => onSelectStation(s)}
                        style={{
                          marginTop: 6,
                          padding: '3px 8px',
                          background: '#2563eb',
                          color: '#fff',
                          border: 0,
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: 11
                        }}
                      >
                        Select Station
                      </button>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        )}
      </div>
    </div>
  );
}
