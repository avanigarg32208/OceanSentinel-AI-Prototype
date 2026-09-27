import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, Badge, Dot } from '../components/UI';
import { IconServer, IconDatabase, IconCpu, IconActivity, IconSatellite, IconShip, IconReport, IconGlobe } from '../components/Icons';

const SERVICES = [
  { name: 'AI Detection Engine', icon: <IconCpu size={16} />, status: 'online', uptime: '99.97%', lastSync: '< 1s', responseTime: '42 ms', desc: 'OceanSentinel YOLO v2 · GPU inference', load: 34 },
  { name: 'PostgreSQL Database', icon: <IconDatabase size={16} />, status: 'online', uptime: '99.99%', lastSync: '< 1s', responseTime: '3 ms', desc: 'Primary · 14.2 GB used of 500 GB', load: 18 },
  { name: 'PostGIS Spatial Engine', icon: <IconGlobe size={16} />, status: 'online', uptime: '99.99%', lastSync: '< 1s', responseTime: '8 ms', desc: 'Geometry indexing · 1.2M features', load: 22 },
  { name: 'AIS Processing Pipeline', icon: <IconShip size={16} />, status: 'online', uptime: '99.91%', lastSync: '4 s', responseTime: '145 ms', desc: 'Mock feed · 1,847 messages/min', load: 61 },
  { name: 'Satellite Processing Pipeline', icon: <IconSatellite size={16} />, status: 'online', uptime: '99.84%', lastSync: '2 min', responseTime: '1.2 s', desc: 'Sentinel-1 SAR · L1→L2 pipeline', load: 48 },
  { name: 'Report Generator', icon: <IconReport size={16} />, status: 'online', uptime: '100%', lastSync: '—', responseTime: '920 ms', desc: 'PDF / HTML / DOCX output', load: 5 },
  { name: 'API Gateway', icon: <IconServer size={16} />, status: 'online', uptime: '99.98%', lastSync: '< 1s', responseTime: '12 ms', desc: 'REST + WebSocket · TLS 1.3', load: 27 },
  { name: 'Geolocation Engine', icon: <IconGlobe size={16} />, status: 'online', uptime: '99.95%', lastSync: '< 1s', responseTime: '85 ms', desc: 'SAR geocoding · WGS84 · EPSG:4326', load: 15 },
];

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const w = 100 / (data.length - 1);
  const pts = data.map((v, i) => `${i * w},${40 - (v / max) * 38}`).join(' ');
  return (
    <svg viewBox="0 0 100 40" width="80" height="28">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" opacity="0.8" />
    </svg>
  );
}

function genHistory() {
  return Array.from({ length: 20 }, () => 20 + Math.random() * 60);
}

export default function SystemStatus() {
  const [histories] = useState(() => SERVICES.map(() => genHistory()));
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(v => v + 1), 3000);
    return () => clearInterval(t);
  }, []);

  const overall = [
    { label: 'System Health', value: '100%', color: '#00e57a' },
    { label: 'Avg Response', value: '31 ms', color: '#00d4ff' },
    { label: 'DB Queries/s', value: '1,284', color: '#ffd700' },
    { label: 'API Requests/m', value: '2,847', color: '#8aaac8' },
    { label: 'AIS Messages/m', value: '1,847', color: '#00d4ff' },
    { label: 'Detections Today', value: '12', color: '#ff8c00' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 20, height: '100%', overflowY: 'auto', boxSizing: 'border-box' }}>
      {/* Overall status */}
      <Card style={{ padding: '14px 20px' }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#00e57a', boxShadow: '0 0 10px #00e57a' }} />
            <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 18, color: '#e2eaf5' }}>All Systems Operational</span>
          </div>
          <div style={{ width: 1, height: 32, background: '#1a3050' }} />
          {overall.map(o => (
            <div key={o.label}>
              <div style={{ fontSize: 10, color: '#4a6a8a', fontFamily: 'JetBrains Mono, monospace', marginBottom: 2 }}>{o.label}</div>
              <div style={{ fontSize: 18, fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: o.color }}>{o.value}</div>
            </div>
          ))}
          <div style={{ marginLeft: 'auto', fontSize: 11, color: '#4a6a8a', fontFamily: 'JetBrains Mono, monospace', textAlign: 'right' }}>
            <div>Last checked: Just now</div>
            <div style={{ color: '#ffd700', marginTop: 2 }}>⚠ Mock system — demonstration only</div>
          </div>
        </div>
      </Card>

      {/* Service grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {SERVICES.map((svc, i) => (
          <Card key={svc.name} style={{ padding: 16 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{
                width: 38, height: 38, borderRadius: 8, flexShrink: 0,
                background: '#00e57a18', border: '1px solid #00e57a33',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00e57a',
              }}>
                {svc.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#e2eaf5', marginBottom: 2 }}>{svc.name}</div>
                    <div style={{ fontSize: 10, color: '#4a6a8a' }}>{svc.desc}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <Dot color="#00e57a" />
                    <Badge variant="online">Online</Badge>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 16, marginTop: 10, marginBottom: 10 }}>
                  {[
                    { label: 'Uptime', value: svc.uptime },
                    { label: 'Response', value: svc.responseTime },
                    { label: 'Last Sync', value: svc.lastSync },
                  ].map(m => (
                    <div key={m.label}>
                      <div style={{ fontSize: 9, color: '#4a6a8a', fontFamily: 'JetBrains Mono, monospace', letterSpacing: 0.8, marginBottom: 2 }}>{m.label}</div>
                      <div style={{ fontSize: 13, fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: '#e2eaf5' }}>{m.value}</div>
                    </div>
                  ))}
                  <div style={{ marginLeft: 'auto' }}>
                    <div style={{ fontSize: 9, color: '#4a6a8a', fontFamily: 'JetBrains Mono, monospace', marginBottom: 4 }}>LOAD</div>
                    <Sparkline data={histories[i]} color="#00d4ff" />
                  </div>
                </div>

                {/* Load bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 9, color: '#4a6a8a', fontFamily: 'JetBrains Mono, monospace' }}>CPU/LOAD</span>
                    <span style={{ fontSize: 9, color: svc.load > 70 ? '#ff8c00' : '#00e57a', fontFamily: 'JetBrains Mono, monospace' }}>{svc.load}%</span>
                  </div>
                  <div style={{ height: 3, background: '#1a3050', borderRadius: 2 }}>
                    <div style={{
                      height: 3, borderRadius: 2, transition: 'width 1s ease',
                      width: `${svc.load}%`,
                      background: svc.load > 70 ? '#ff8c00' : '#00e57a',
                    }} />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Activity log */}
      <Card>
        <CardHeader>
          <CardTitle icon={<IconActivity size={15} />}>System Activity Log</CardTitle>
          <Badge variant="online">Live</Badge>
        </CardHeader>
        <div style={{ padding: '0 16px 16px', maxHeight: 200, overflowY: 'auto' }}>
          {[
            { time: '16:02:41', level: 'INFO', msg: 'Report RPT-2026-2847 generated for incident INC-2026-014' },
            { time: '15:48:02', level: 'WARN', msg: 'AIS feed latency spike: 145ms (threshold: 200ms)' },
            { time: '15:32:18', level: 'INFO', msg: 'Correlation analysis completed: 3 vessels ranked for INC-2026-014' },
            { time: '15:01:44', level: 'INFO', msg: 'Sentinel-1 scene S1A_IW_2026 ingested and processed (L2-GRD)' },
            { time: '14:48:09', level: 'ALERT', msg: 'HIGH PRIORITY: MV Ocean Star (MMSI 419000001) flagged — correlation score 92%' },
            { time: '14:32:07', level: 'ALERT', msg: 'Oil spill detected: 18.42 km² · 18.42°N 64.31°E · 94.7% confidence' },
            { time: '14:31:54', level: 'INFO', msg: 'AI detection inference completed in 3.42s (OceanSentinel YOLO v2)' },
            { time: '14:30:10', level: 'INFO', msg: 'Satellite scene preprocessing complete: despeckle + calibration + normalization' },
            { time: '14:28:33', level: 'INFO', msg: 'New SAR scene queued for AI detection pipeline' },
            { time: '14:15:00', level: 'INFO', msg: 'AIS feed sync: 1,847 position reports ingested (last 60 min)' },
          ].map((entry, i) => {
            const levelColor: Record<string, string> = { INFO: '#00d4ff', WARN: '#ffd700', ALERT: '#ff3b3b', ERROR: '#ff3b3b' };
            return (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '6px 0', borderBottom: '1px solid #1a305022', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>
                <span style={{ color: '#4a6a8a', flexShrink: 0 }}>{entry.time}</span>
                <span style={{ color: levelColor[entry.level] || '#8aaac8', flexShrink: 0, width: 40 }}>[{entry.level}]</span>
                <span style={{ color: '#8aaac8' }}>{entry.msg}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
