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
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
}

function RecenterController({
  center,
  recenterTrigger
}: {
  center: [number, number] | null;
  recenterTrigger: number;
}) {
  const map = useMap();

  // Handle map resizing on initial render and window changes
  useEffect(() => {
    const handleResize = () => {
      map.invalidateSize();
    };
    const timer1 = setTimeout(handleResize, 100);
    const timer2 = setTimeout(handleResize, 400);
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener('resize', handleResize);
    };
  }, [map]);

  // Recenter when station selection changes
  useEffect(() => {
    if (center && Number.isFinite(center[0]) && Number.isFinite(center[1])) {
      map.flyTo(center, Math.max(map.getZoom(), 7), { duration: 0.6 });
    }
  }, [center, map]);

  // Explicit recenter to national capital corridor
  useEffect(() => {
    if (recenterTrigger > 0) {
      const target = center || [28.6423, 77.2200];
      map.flyTo(target, 6, { duration: 0.6 });
    }
  }, [recenterTrigger, center, map]);

  return null;
}

export function MapView({
  stations,
  sections,
  selectedStation,
  onSelectStation,
  routeAnalysis,
  loading = false,
  error = '',
  onRetry
}: MapViewProps) {
  const [tileError, setTileError] = useState(false);
  const [recenterTrigger, setRecenterTrigger] = useState(0);

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
      type RailNode = { code: string; distance: number; previous: string | null };
      const distances = new Map<string, RailNode>();
      const queue: string[] = [];
      stationMap.forEach(station => {
        distances.set(station.code, {
          code: station.code,
          distance: station.code === routeAnalysis.from_station.code ? 0 : Infinity,
          previous: null
        });
      });

      const connections = new Map<string, { code: string; distance: number }[]>();
      sections.forEach(section => {
        if (!stationMap.has(section.station_from) || !stationMap.has(section.station_to)) return;
        const distance = Number.isFinite(Number(section.distance_km))
          ? Number(section.distance_km)
          : 0;
        if (!connections.has(section.station_from)) connections.set(section.station_from, []);
        if (!connections.has(section.station_to)) connections.set(section.station_to, []);
        connections.get(section.station_from)?.push({ code: section.station_to, distance });
        connections.get(section.station_to)?.push({ code: section.station_from, distance });
      });

      queue.push(routeAnalysis.from_station.code);
      const visited = new Set<string>();
      while (queue.length > 0) {
        queue.sort((a, b) => (distances.get(a)?.distance ?? Infinity) - (distances.get(b)?.distance ?? Infinity));
        const current = queue.shift();
        if (!current || visited.has(current)) continue;
        visited.add(current);
        if (current === routeAnalysis.to_station.code) break;

        connections.get(current)?.forEach(neighbor => {
          const currentDistance = distances.get(current)?.distance ?? Infinity;
          const neighborNode = distances.get(neighbor.code);
          const candidateDistance = currentDistance + neighbor.distance;
          if (neighborNode && candidateDistance < neighborNode.distance) {
            neighborNode.distance = candidateDistance;
            neighborNode.previous = current;
            queue.push(neighbor.code);
          }
        });
      }

      const pathCodes: string[] = [];
      let currentCode: string | null = routeAnalysis.to_station.code;
      while (currentCode) {
        pathCodes.unshift(currentCode);
        currentCode = distances.get(currentCode)?.previous ?? null;
      }

      if (pathCodes[0] === routeAnalysis.from_station.code) {
        const path = pathCodes
          .map(code => stationMap.get(code))
          .map(station => station ? getCoords(station) : null)
          .filter((coords): coords is [number, number] => coords !== null);
        if (path.length > 1) return path;
      }

      return [cFrom, cTo] as [number, number][];
    }
    return null;
  }, [routeAnalysis, sections, stationMap]);

  // Keep the initial map focused on the loaded operating corridors rather than every station record.
  const displayStations = useMemo(() => {
    const visibleCodes = new Set<string>();
    if (selectedStation?.code) visibleCodes.add(selectedStation.code);
    if (routeAnalysis?.from_station.code) visibleCodes.add(routeAnalysis.from_station.code);
    if (routeAnalysis?.to_station.code) visibleCodes.add(routeAnalysis.to_station.code);
    ['NDLS', 'MTJ', 'AGC', 'GWL', 'BVI', 'BCT', 'CNB', 'HWH', 'BPL', 'ET', 'BSL', 'CSMT'].forEach(c => visibleCodes.add(c));
    sections.forEach(sec => {
      if (sec.station_from) visibleCodes.add(sec.station_from);
      if (sec.station_to) visibleCodes.add(sec.station_to);
    });

    return validStations.filter(station => visibleCodes.has(station.code));
  }, [validStations, sections, selectedStation, routeAnalysis]);

  // 4-state lifecycle resolution
  const isStateLoading = loading && validStations.length === 0;
  const isStateError = !loading && Boolean(error) && validStations.length === 0;
  const isStateEmpty = !loading && !error && validStations.length === 0;
  const isStateReady = validStations.length > 0;

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
            onClick={() => setRecenterTrigger(k => k + 1)}
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
        {/* STATE 1: LOADING */}
        {isStateLoading && (
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
        )}

        {/* STATE 2: ERROR */}
        {isStateError && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8fafc',
            flexDirection: 'column',
            gap: 12,
            padding: 24,
            textAlign: 'center',
            zIndex: 1000
          }}>
            <AlertCircle size={32} color={theme.red} />
            <span style={{ fontSize: 14, fontWeight: 700, color: theme.red }}>
              Unable to load railway station coordinates
            </span>
            <span style={{ fontSize: 12, color: theme.textMuted, maxWidth: 420 }}>
              {error || 'Network error encountered while connecting to operations feed.'}
            </span>
            {onRetry && (
              <button
                onClick={onRetry}
                style={{
                  marginTop: 6,
                  padding: '6px 14px',
                  background: theme.blue,
                  color: '#fff',
                  border: 0,
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Retry Station Feed
              </button>
            )}
          </div>
        )}

        {/* STATE 3: EMPTY */}
        {isStateEmpty && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8fafc',
            flexDirection: 'column',
            gap: 12,
            padding: 24,
            textAlign: 'center',
            zIndex: 1000
          }}>
            <MapPin size={32} color={theme.textDim} />
            <span style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>
              No valid station coordinates available
            </span>
            <span style={{ fontSize: 12, color: theme.textMuted, maxWidth: 420 }}>
              The railway repository contains {stations.length} station records, but none contain valid geographic coordinates within operational boundaries.
            </span>
          </div>
        )}

        {/* STATE 4: READY */}
        {isStateReady && (
          <MapContainer
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
            <TileLayer
              attribution="Railway overlay &copy; OpenRailwayMap contributors"
              url="https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png"
              opacity={0.75}
            />

            <RecenterController center={selectedCoords} recenterTrigger={recenterTrigger} />

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
            {analyzedRouteLine && (() => {
              const riskProb = routeAnalysis?.risk_probability ?? 0;
              const riskColor = riskProb >= 65 ? '#dc2626' : riskProb >= 35 ? '#ca8a04' : '#16a34a';
              const riskTier = riskProb >= 65 ? 'HIGH RISK' : riskProb >= 35 ? 'MEDIUM RISK' : 'LOW RISK';

              return (
                <Polyline
                  positions={analyzedRouteLine}
                  color={riskColor}
                  weight={6}
                  opacity={0.9}
                >
                  <Popup>
                    <div style={{ color: '#0f172a', fontSize: 12 }}>
                      <div style={{
                        display: 'inline-block',
                        padding: '2px 7px',
                        borderRadius: 4,
                        fontSize: 10,
                        fontWeight: 800,
                        background: `${riskColor}22`,
                        color: riskColor,
                        marginBottom: 4
                      }}>
                        {riskTier} · {riskProb}%
                      </div>
                      <br />
                      <strong>{routeAnalysis?.verdict}</strong><br />
                      {routeAnalysis?.summary}
                    </div>
                  </Popup>
                </Polyline>
              );
            })()}

            {/* Station Circle Markers */}
            {displayStations.map((s, idx) => {
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
                  key={`marker_${s.code}_${idx}`}
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
