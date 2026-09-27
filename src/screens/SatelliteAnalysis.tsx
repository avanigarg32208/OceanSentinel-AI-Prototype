import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, Badge, Btn, StatRow, SectionLabel, ConfidenceBar } from '../components/UI';
import { IconSatellite, IconZoomIn, IconZoomOut, IconLayers, IconDownload, IconAIS, IconReport, IconMap } from '../components/Icons';
import type { Screen } from '../types';

interface Props { onNavigate: (s: Screen) => void; }

export default function SatelliteAnalysis({ onNavigate }: Props) {
  const [showOverlay, setShowOverlay] = useState(true);
  const [mode, setMode] = useState<'after' | 'before'>('after');
  const [zoom, setZoom] = useState(1);

  return (
    <div style={{ display: 'flex', gap: 16, padding: 20, height: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
      {/* Left: SAR image viewer */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
        <Card style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <CardHeader>
            <CardTitle icon={<IconSatellite size={15} />}>Sentinel-1 SAR Image Viewer</CardTitle>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {/* Before/after toggle */}
              <div style={{ display: 'flex', borderRadius: 6, overflow: 'hidden', border: '1px solid #1a3050' }}>
                {['before', 'after'].map(m => (
                  <button key={m}
                    onClick={() => setMode(m as 'before' | 'after')}
                    style={{
                      padding: '4px 12px', fontSize: 11, fontWeight: 600,
                      background: mode === m ? '#00d4ff22' : 'transparent',
                      color: mode === m ? '#00d4ff' : '#6b8aaa',
                      border: 'none', cursor: 'pointer',
                      fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase',
                    }}>
                    {m}
                  </button>
                ))}
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#8aaac8', cursor: 'pointer' }}>
                <input type="checkbox" checked={showOverlay} onChange={e => setShowOverlay(e.target.checked)} style={{ accentColor: '#00d4ff' }} />
                Detection Overlay
              </label>
            </div>
          </CardHeader>

          <div style={{ flex: 1, position: 'relative', background: '#020a14', overflow: 'hidden' }}>
            {/* SAR image simulation */}
            <svg viewBox="0 0 700 450" width="100%" height="100%" style={{ display: 'block' }} preserveAspectRatio="xMidYMid slice">
              <defs>
                <filter id="sarNoise">
                  <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
                  <feColorMatrix type="saturate" values="0" />
                  <feBlend in="SourceGraphic" mode="overlay" result="noisy" />
                </filter>
                <radialGradient id="sarBg" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="#1a2a3a" />
                  <stop offset="100%" stopColor="#060e1a" />
                </radialGradient>
                <radialGradient id="spillSar" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="#050e1c" stopOpacity="1" />
                  <stop offset="100%" stopColor="#0a1e35" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* SAR background texture - simulates ocean backscatter */}
              <rect width="700" height="450" fill="url(#sarBg)" />
              {/* Speckle pattern */}
              {Array.from({ length: 400 }).map((_, i) => (
                <rect key={i}
                  x={(i * 31 + i * 7) % 700}
                  y={(i * 17 + i * 13) % 450}
                  width={1 + (i % 3)} height={1 + (i % 2)}
                  fill={`rgba(${60 + (i % 60)},${80 + (i % 40)},${100 + (i % 30)},${0.2 + (i % 5) * 0.06})`}
                />
              ))}

              {/* Ocean waves (SAR texture) */}
              {Array.from({ length: 30 }).map((_, i) => (
                <path key={i}
                  d={`M ${i * 24} ${100 + i * 12} Q ${i * 24 + 12} ${95 + i * 12} ${i * 24 + 24} ${100 + i * 12}`}
                  fill="none" stroke="#1a2e44" strokeWidth="0.5" opacity="0.4"
                />
              ))}

              {/* Oil spill — dark patch (low backscatter) */}
              {mode === 'after' && (
                <>
                  <ellipse cx="380" cy="220" rx="80" ry="45"
                    fill="#030810" opacity="0.85" />
                  <path
                    d={`M 310 205 C 330 185 370 180 420 198 C 455 210 468 230 450 248 C 430 266 390 270 355 260 C 320 250 300 225 310 205 Z`}
                    fill="#040d1a" opacity="0.9"
                  />
                  {/* Spill boundary */}
                  <path
                    d={`M 310 205 C 330 185 370 180 420 198 C 455 210 468 230 450 248 C 430 266 390 270 355 260 C 320 250 300 225 310 205 Z`}
                    fill="none" stroke="#1a3a5a" strokeWidth="1.5" opacity="0.6"
                  />
                </>
              )}

              {/* AI Detection overlay */}
              {showOverlay && mode === 'after' && (
                <>
                  {/* Segmentation mask */}
                  <path
                    d={`M 310 205 C 330 185 370 180 420 198 C 455 210 468 230 450 248 C 430 266 390 270 355 260 C 320 250 300 225 310 205 Z`}
                    fill="#ff8c00" fillOpacity="0.25" stroke="#ff8c00" strokeWidth="2" strokeDasharray="6 3"
                  />
                  {/* Bounding box */}
                  <rect x={295} y={172} width={182} height={105} rx={3}
                    fill="none" stroke="#00d4ff" strokeWidth="1.5" strokeDasharray="8 4" />
                  {/* Corner ticks */}
                  {[[295, 172], [477, 172], [295, 277], [477, 277]].map(([x, y], i) => (
                    <g key={i}>
                      <line x1={x} y1={y} x2={x + (i % 2 === 0 ? 12 : -12)} y2={y} stroke="#00d4ff" strokeWidth="2" />
                      <line x1={x} y1={y} x2={x} y2={y + (i < 2 ? 12 : -12)} stroke="#00d4ff" strokeWidth="2" />
                    </g>
                  ))}
                  {/* Label */}
                  <rect x={295} y={152} width={130} height={18} rx={3} fill="#00d4ff" />
                  <text x={303} y={164} fill="#030d1a" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="700">
                    OIL SLICK · 94.7%
                  </text>
                  {/* Crosshair center */}
                  <line x1={386} y1={215} x2={386} y2={225} stroke="#00d4ff" strokeWidth="1" />
                  <line x1={381} y1={220} x2={391} y2={220} stroke="#00d4ff" strokeWidth="1" />
                </>
              )}

              {/* Vessel marker */}
              <polygon points="520,150 525,165 520,162 515,165" fill="#ffd700" />
              <text x={528} y={160} fill="#ffd700" fontSize="9" fontFamily="JetBrains Mono, monospace">MV Ocean Star</text>

              {/* Image metadata */}
              <rect x={10} y={10} width={200} height={60} rx={4} fill="#060f20" fillOpacity="0.85" stroke="#1a3050" strokeWidth="1" />
              <text x={18} y={26} fill="#4a6a8a" fontSize="9" fontFamily="JetBrains Mono, monospace">SENTINEL-1 SAR · IW MODE</text>
              <text x={18} y={38} fill="#8aaac8" fontSize="9" fontFamily="JetBrains Mono, monospace">2026-09-10 · 14:32:07 UTC</text>
              <text x={18} y={50} fill="#8aaac8" fontSize="9" fontFamily="JetBrains Mono, monospace">18.42°N  64.31°E</text>
              <text x={18} y={62} fill="#4a6a8a" fontSize="9" fontFamily="JetBrains Mono, monospace">Pass: ASCENDING · Orbit: 124</text>

              {/* Scale/compass */}
              <g transform="translate(620, 410)">
                <line x1={0} y1={0} x2={50} y2={0} stroke="#264870" strokeWidth="1.5" />
                <line x1={0} y1={-3} x2={0} y2={3} stroke="#264870" strokeWidth="1.5" />
                <line x1={50} y1={-3} x2={50} y2={3} stroke="#264870" strokeWidth="1.5" />
                <text x={25} y={-5} fill="#264870" fontSize="8" fontFamily="JetBrains Mono, monospace" textAnchor="middle">50 km</text>
              </g>
            </svg>

            {/* Zoom controls */}
            <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[<>+</>, <>−</>].map((c, i) => (
                <button key={i} onClick={() => setZoom(z => Math.max(0.5, Math.min(3, z + (i === 0 ? 0.25 : -0.25))))}
                  style={{ width: 32, height: 32, borderRadius: 6, background: '#060f20', border: '1px solid #1a3050', color: '#8aaac8', cursor: 'pointer', fontSize: 16 }}>
                  {c}
                </button>
              ))}
              <div style={{ fontSize: 9, color: '#4a6a8a', textAlign: 'center', fontFamily: 'JetBrains Mono, monospace' }}>
                {Math.round(zoom * 100)}%
              </div>
            </div>

            {/* Layer controls */}
            <div style={{ position: 'absolute', bottom: 16, left: 16 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {['VV', 'VH', 'RGB', 'FALSE COLOR'].map(l => (
                  <button key={l} style={{
                    padding: '3px 8px', borderRadius: 4,
                    background: l === 'VV' ? '#00d4ff22' : '#060f20',
                    border: `1px solid ${l === 'VV' ? '#00d4ff' : '#1a3050'}`,
                    color: l === 'VV' ? '#00d4ff' : '#6b8aaa',
                    fontSize: 10, cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace',
                  }}>{l}</button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Bottom metrics */}
        <Card style={{ padding: 16 }}>
          <SectionLabel>AI Analysis Metrics</SectionLabel>
          <div style={{ display: 'flex', gap: 20 }}>
            {[
              { label: 'Precision', value: 0.961 },
              { label: 'Recall', value: 0.934 },
              { label: 'F1 Score', value: 0.947 },
              { label: 'IoU Score', value: 0.891 },
            ].map(m => (
              <div key={m.label} style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: '#4a6a8a', marginBottom: 4, fontFamily: 'JetBrains Mono, monospace', letterSpacing: 1 }}>
                  {m.label.toUpperCase()}
                </div>
                <div style={{ fontSize: 22, fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: '#00d4ff', marginBottom: 4 }}>
                  {m.value.toFixed(3)}
                </div>
                <div style={{ height: 3, background: '#1a3050', borderRadius: 2 }}>
                  <div style={{ height: 3, width: `${m.value * 100}%`, background: '#00d4ff', borderRadius: 2 }} />
                </div>
              </div>
            ))}
            <div style={{ flex: 1, borderLeft: '1px solid #1a3050', paddingLeft: 20 }}>
              <div style={{ fontSize: 10, color: '#4a6a8a', marginBottom: 4, fontFamily: 'JetBrains Mono, monospace', letterSpacing: 1 }}>
                OBJECTS DETECTED
              </div>
              <div style={{ fontSize: 22, fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: '#ff8c00', marginBottom: 4 }}>3</div>
              <div style={{ fontSize: 10, color: '#6b8aaa' }}>1 oil slick · 2 sheens</div>
            </div>
            <div style={{ flex: 1, borderLeft: '1px solid #1a3050', paddingLeft: 20 }}>
              <div style={{ fontSize: 10, color: '#4a6a8a', marginBottom: 4, fontFamily: 'JetBrains Mono, monospace', letterSpacing: 1 }}>
                DETECTION AREA
              </div>
              <div style={{ fontSize: 22, fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: '#ff8c00', marginBottom: 4 }}>18.42</div>
              <div style={{ fontSize: 10, color: '#6b8aaa' }}>km² estimated</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Right panel */}
      <div style={{ width: 300, display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
        <Card>
          <CardHeader>
            <CardTitle>AI Detection Results</CardTitle>
            <Badge variant="critical">High Conf</Badge>
          </CardHeader>
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{ fontSize: 11, color: '#4a6a8a', marginBottom: 4, fontFamily: 'JetBrains Mono, monospace', letterSpacing: 1 }}>DETECTION CLASS</div>
              <div style={{ fontSize: 24, fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: '#ff8c00' }}>Oil Slick</div>
              <div style={{ fontSize: 11, color: '#6b8aaa' }}>Petroleum hydrocarbon signature</div>
            </div>

            <ConfidenceBar value={94.7} />

            <div style={{ height: 1, background: '#1a3050' }} />

            <StatRow label="Estimated Area" value="18.42 km²" mono />
            <StatRow label="Detection Class" value="Oil Slick" />
            <StatRow label="Model" value="OceanSentinel YOLO" />
            <StatRow label="Image Source" value="Sentinel-1 SAR" />
            <StatRow label="Acq. Time" value="2026-09-10 14:32 UTC" mono />
            <StatRow label="Location" value="18.42°N, 64.31°E" mono />
            <StatRow label="False-Pos. Risk" value="Low" />
            <StatRow label="Objects Count" value="3" mono />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
              <Btn variant="primary" icon={<IconMap size={14} />} onClick={() => onNavigate('geolocation')}>
                View Geolocation
              </Btn>
              <Btn variant="secondary" icon={<IconAIS size={14} />} onClick={() => onNavigate('ais')}>
                Correlate AIS
              </Btn>
              <Btn variant="outline" icon={<IconReport size={14} />} onClick={() => onNavigate('report')}>
                Generate Report
              </Btn>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scene Metadata</CardTitle>
          </CardHeader>
          <div style={{ padding: 16 }}>
            <StatRow label="Scene ID" value="S1A_IW_2026" mono />
            <StatRow label="Sensor Mode" value="IW (Interferometric)" />
            <StatRow label="Polarization" value="VV + VH" mono />
            <StatRow label="Resolution" value="10m × 10m" mono />
            <StatRow label="Orbit Dir." value="Ascending" />
            <StatRow label="Pass Number" value="124" mono />
            <StatRow label="Proc. Level" value="L1-SLC → L2-GRD" mono />
            <StatRow label="Ingested" value="2026-09-10 15:01 UTC" mono />
          </div>
        </Card>
      </div>
    </div>
  );
}
