import React from 'react';
import { Card, CardHeader, CardTitle, Badge, Btn, StatRow, SectionLabel, ConfidenceBar } from '../components/UI';
import MapSVG from '../components/MapSVG';
import { IconShip, IconMap, IconReport, IconAlert } from '../components/Icons';
import type { Screen } from '../types';

const TIMELINE = [
  { time: '14:10 UTC', event: 'Vessel enters investigation zone', type: 'info', detail: 'Speed: 12.5 kn · Course: 085°' },
  { time: '14:24 UTC', event: 'Vessel approaches spill location', type: 'warning', detail: 'Distance to spill: 4.1 km · Speed reduces to 8.2 kn' },
  { time: '14:32 UTC', event: 'Satellite detects oil slick', type: 'critical', detail: 'Sentinel-1 SAR acquisition · 18.42 km² · 94.7% confidence' },
  { time: '14:40 UTC', event: 'Vessel exits high-correlation zone', type: 'warning', detail: 'Accelerates to 14.8 kn · Course: 092°' },
  { time: '14:48 UTC', event: 'Correlation engine flags vessel', type: 'critical', detail: 'OceanSentinel AI assigns score: 92% · Status: HIGH PRIORITY' },
  { time: '15:10 UTC', event: 'Investigation initiated', type: 'info', detail: 'Incident INC-2026-014 created · Analyst notified' },
];

const TYPE_COLORS: Record<string, string> = {
  critical: '#ff3b3b', warning: '#ff8c00', info: '#00d4ff',
};

interface Props { onNavigate: (s: Screen) => void; }

export default function VesselIntelligence({ onNavigate }: Props) {
  return (
    <div style={{ display: 'flex', gap: 16, padding: 20, height: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
      {/* Left */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0, overflowY: 'auto' }}>
        {/* Vessel header */}
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
            <div style={{
              width: 60, height: 60, borderRadius: 12,
              background: '#ff3b3b18', border: '1px solid #ff3b3b44',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#ff3b3b', flexShrink: 0,
            }}>
              <IconShip size={30} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 26, color: '#e2eaf5' }}>MV Ocean Star</div>
                <Badge variant="critical">Under Investigation</Badge>
              </div>
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                {[
                  { label: 'MMSI', value: '419000001' },
                  { label: 'IMO', value: 'IMO-9743821' },
                  { label: 'Flag', value: 'India (IN)' },
                  { label: 'Type', value: 'Chemical Tanker' },
                  { label: 'GT', value: '28,450 GT' },
                  { label: 'Built', value: '2018' },
                ].map(f => (
                  <div key={f.label}>
                    <div style={{ fontSize: 9, color: '#4a6a8a', fontFamily: 'JetBrains Mono, monospace', letterSpacing: 1 }}>{f.label}</div>
                    <div style={{ fontSize: 13, color: '#e2eaf5', fontWeight: 600 }}>{f.value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: '#4a6a8a', fontFamily: 'JetBrains Mono, monospace', letterSpacing: 1, marginBottom: 4 }}>CURRENT STATUS</div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'flex-end', marginBottom: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffd700' }} />
                <span style={{ fontSize: 13, color: '#ffd700', fontWeight: 700 }}>AIS Active</span>
              </div>
              <div style={{ fontSize: 12, color: '#8aaac8', fontFamily: 'JetBrains Mono, monospace' }}>
                18.41°N 64.28°E<br />
                12.5 kn · 085°
              </div>
            </div>
          </div>
        </Card>

        {/* Track map */}
        <Card style={{ height: 280, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <CardHeader>
            <CardTitle icon={<IconMap size={15} />}>Historical AIS Track — MV Ocean Star</CardTitle>
            <span style={{ fontSize: 11, color: '#4a6a8a', fontFamily: 'JetBrains Mono, monospace' }}>2026-09-10 · ±2hr window</span>
          </CardHeader>
          <div style={{ flex: 1, background: '#030d1a', overflow: 'hidden' }}>
            <MapSVG showSpill showVessels showTracks showRadius highlightVessel={1} style={{ width: '100%', height: '100%' }} />
          </div>
        </Card>

        {/* Evidence timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Evidence Timeline</CardTitle>
            <Badge variant="investigating">6 Events</Badge>
          </CardHeader>
          <div style={{ padding: '12px 16px' }}>
            {TIMELINE.map((evt, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: TYPE_COLORS[evt.type],
                    boxShadow: `0 0 8px ${TYPE_COLORS[evt.type]}`,
                  }} />
                  {i < TIMELINE.length - 1 && (
                    <div style={{ width: 1, flex: 1, minHeight: 24, background: '#1a3050', margin: '3px 0' }} />
                  )}
                </div>
                <div style={{ flex: 1, paddingBottom: 4 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', marginBottom: 2 }}>
                    <span style={{ fontSize: 10, color: '#4a6a8a', fontFamily: 'JetBrains Mono, monospace' }}>{evt.time}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#e2eaf5' }}>{evt.event}</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#6b8aaa' }}>{evt.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Right panel */}
      <div style={{ width: 300, display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
        <Card>
          <CardHeader><CardTitle>Vessel Details</CardTitle></CardHeader>
          <div style={{ padding: 16 }}>
            <SectionLabel>IDENTIFICATION</SectionLabel>
            <StatRow label="Vessel Name" value="MV Ocean Star" />
            <StatRow label="MMSI" value="419000001" mono />
            <StatRow label="IMO Number" value="IMO-9743821" mono />
            <StatRow label="Call Sign" value="VTAR9" mono />
            <StatRow label="Flag State" value="India" />
            <StatRow label="Port of Registry" value="Mumbai, IN" />

            <div style={{ height: 12 }} />
            <SectionLabel>VESSEL SPECS</SectionLabel>
            <StatRow label="Type" value="Chemical Tanker" />
            <StatRow label="Gross Tonnage" value="28,450 GT" mono />
            <StatRow label="DWT" value="46,200 t" mono />
            <StatRow label="Length" value="183 m" mono />
            <StatRow label="Beam" value="32 m" mono />
            <StatRow label="Year Built" value="2018" mono />
            <StatRow label="Classification" value="Bureau Veritas" />

            <div style={{ height: 12 }} />
            <SectionLabel>LAST KNOWN POSITION</SectionLabel>
            <StatRow label="Position" value="18.41°N 64.28°E" mono />
            <StatRow label="Speed" value="12.5 knots" mono />
            <StatRow label="Course" value="085°" mono />
            <StatRow label="AIS Updated" value="14:52 UTC" mono />
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle icon={<IconAlert size={15} />}>Correlation Evidence</CardTitle>
            <Badge variant="critical">92% Match</Badge>
          </CardHeader>
          <div style={{ padding: 16 }}>
            {[
              { label: 'Spatial Proximity', value: 94, color: '#ff3b3b', desc: '3.2 km from spill center' },
              { label: 'Temporal Proximity', value: 91, color: '#ff8c00', desc: '8 minutes from detection' },
              { label: 'Trajectory Alignment', value: 88, color: '#ffd700', desc: 'Course intersects spill polygon' },
              { label: 'Detection Confidence', value: 94.7, color: '#00d4ff', desc: 'Source detection score' },
            ].map(e => (
              <div key={e.label} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: '#8aaac8' }}>{e.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: e.color, fontFamily: 'JetBrains Mono, monospace' }}>{e.value.toFixed(0)}%</span>
                </div>
                <div style={{ height: 4, background: '#1a3050', borderRadius: 2, marginBottom: 3 }}>
                  <div style={{ height: 4, width: `${e.value}%`, background: e.color, borderRadius: 2 }} />
                </div>
                <div style={{ fontSize: 10, color: '#4a6a8a' }}>{e.desc}</div>
              </div>
            ))}

            <div style={{ marginTop: 4, padding: '10px 12px', background: '#ff3b3b0a', border: '1px solid #ff3b3b33', borderRadius: 6 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#ff8c00', marginBottom: 4 }}>Overall Confidence: 92%</div>
              <div style={{ fontSize: 10, color: '#6b8aaa' }}>AI-assisted investigation score. Not admissible without expert verification.</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
              <Btn variant="primary" icon={<IconReport size={14} />} onClick={() => onNavigate('incident')}>
                View Incident
              </Btn>
              <Btn variant="secondary" onClick={() => onNavigate('report')}>
                Generate Report
              </Btn>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
