import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, Badge, Btn, StatRow, SectionLabel, ConfidenceBar } from '../components/UI';
import { IconAlert, IconSatellite, IconMap, IconAIS, IconShip, IconReport, IconPlus, IconDownload, IconCheck } from '../components/Icons';
import type { Screen } from '../types';

const EVIDENCE_STEPS = [
  { label: 'Satellite Detection', icon: <IconSatellite size={16} />, done: true, desc: 'Sentinel-1 SAR · 14:32 UTC' },
  { label: 'Spill Localization', icon: <IconMap size={16} />, done: true, desc: '18.42°N 64.31°E · 18.42 km²' },
  { label: 'AIS Search', icon: <IconAIS size={16} />, done: true, desc: '1,847 AIS records analyzed' },
  { label: 'Candidate Vessels', icon: <IconShip size={16} />, done: true, desc: '3 vessels in temporal window' },
  { label: 'Correlation Analysis', icon: <IconAlert size={16} />, done: true, desc: 'Spatial + temporal + trajectory' },
  { label: 'Responsible Vessel Ranking', icon: <IconReport size={16} />, done: true, desc: 'MV Ocean Star · 92% score' },
];

interface Props { onNavigate: (s: Screen) => void; }

export default function IncidentInvestigation({ onNavigate }: Props) {
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([
    { text: 'Vessel owner contacted via maritime authority. Awaiting response.', time: '15:30 UTC', author: 'Cdr. A. Ramos' },
    { text: 'Forwarded to regional coast guard for field verification.', time: '15:45 UTC', author: 'Cdr. A. Ramos' },
  ]);
  const [resolved, setResolved] = useState(false);

  const addNote = () => {
    if (!note.trim()) return;
    setNotes(n => [...n, { text: note, time: 'Now', author: 'Cdr. A. Ramos' }]);
    setNote('');
  };

  return (
    <div style={{ display: 'flex', gap: 16, padding: 20, height: '100%', boxSizing: 'border-box', overflowY: 'auto', flexDirection: 'column' }}>
      {/* Header bar */}
      <Card style={{ padding: '14px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 10, color: '#4a6a8a', fontFamily: 'JetBrains Mono, monospace', letterSpacing: 1, marginBottom: 2 }}>INCIDENT ID</div>
            <div style={{ fontSize: 22, fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: '#00d4ff' }}>INC-2026-014</div>
          </div>
          <div style={{ width: 1, height: 48, background: '#1a3050' }} />
          <div>
            <div style={{ fontSize: 10, color: '#4a6a8a', fontFamily: 'JetBrains Mono, monospace', marginBottom: 4 }}>STATUS</div>
            <Badge variant={resolved ? 'resolved' : 'investigating'}>{resolved ? 'RESOLVED' : 'UNDER INVESTIGATION'}</Badge>
          </div>
          <div>
            <div style={{ fontSize: 10, color: '#4a6a8a', fontFamily: 'JetBrains Mono, monospace', marginBottom: 4 }}>SEVERITY</div>
            <Badge variant="critical">CRITICAL</Badge>
          </div>
          <div>
            <div style={{ fontSize: 10, color: '#4a6a8a', fontFamily: 'JetBrains Mono, monospace', marginBottom: 4 }}>DETECTION CONFIDENCE</div>
            <span style={{ fontSize: 18, fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: '#00e57a' }}>94.7%</span>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <Btn variant="outline" icon={<IconPlus size={13} />} onClick={() => document.getElementById('note-input')?.focus()}>
              Add Note
            </Btn>
            <Btn variant="secondary" icon={<IconDownload size={13} />}>
              Export Evidence
            </Btn>
            <Btn variant="primary" icon={<IconReport size={13} />} onClick={() => onNavigate('report')}>
              Generate Report
            </Btn>
            <Btn variant={resolved ? 'ghost' : 'danger'} icon={<IconCheck size={13} />} onClick={() => setResolved(r => !r)}>
              {resolved ? 'Reopen' : 'Mark Resolved'}
            </Btn>
          </div>
        </div>
      </Card>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Incident summary */}
        <Card>
          <CardHeader><CardTitle icon={<IconAlert size={15} />}>Incident Summary</CardTitle></CardHeader>
          <div style={{ padding: 16 }}>
            <SectionLabel>DETECTION DETAILS</SectionLabel>
            <StatRow label="Detected At" value="2026-09-10 14:32 UTC" mono />
            <StatRow label="Detection Source" value="Sentinel-1 SAR" />
            <StatRow label="Location" value="18.42°N, 64.31°E" mono />
            <StatRow label="Spill Area" value="18.42 km²" mono />
            <StatRow label="Detection Confidence" value="94.7%" mono />
            <StatRow label="Classification" value="Oil Slick" />
            <StatRow label="Region" value="Arabian Sea" />
            <StatRow label="Nearest EEZ" value="India (312 km)" />
          </div>
        </Card>

        {/* AIS Correlation */}
        <Card>
          <CardHeader><CardTitle icon={<IconAIS size={15} />}>AIS Correlation Results</CardTitle></CardHeader>
          <div style={{ padding: 16 }}>
            <SectionLabel>CANDIDATE VESSELS</SectionLabel>
            {[
              { rank: 1, name: 'MV Ocean Star', mmsi: '419000001', score: 92, color: '#ff3b3b', priority: 'HIGH' },
              { rank: 2, name: 'MV Blue Horizon', mmsi: '419000002', score: 68, color: '#ff8c00', priority: 'MEDIUM' },
              { rank: 3, name: 'MV Sea Guardian', mmsi: '419000003', score: 42, color: '#ffd700', priority: 'LOW' },
            ].map(v => (
              <div key={v.mmsi} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #1a305033' }}>
                <span style={{ fontSize: 14, fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: v.color, width: 24 }}>#{v.rank}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: '#e2eaf5', fontWeight: 600 }}>{v.name}</div>
                  <div style={{ fontSize: 10, color: '#4a6a8a', fontFamily: 'JetBrains Mono, monospace' }}>MMSI: {v.mmsi}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14, fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: v.color }}>{v.score}%</div>
                  <div style={{ fontSize: 9, color: v.color, fontFamily: 'JetBrains Mono, monospace' }}>{v.priority}</div>
                </div>
              </div>
            ))}

            <div style={{ marginTop: 12, cursor: 'pointer' }} onClick={() => onNavigate('ais')}>
              <span style={{ fontSize: 12, color: '#00d4ff', textDecoration: 'underline' }}>→ View full AIS correlation analysis</span>
            </div>
          </div>
        </Card>

        {/* Vessel info */}
        <Card>
          <CardHeader>
            <CardTitle icon={<IconShip size={15} />}>Primary Suspect — Vessel Information</CardTitle>
            <Badge variant="critical">Rank #1</Badge>
          </CardHeader>
          <div style={{ padding: 16 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 12px', background: '#ff3b3b0a', border: '1px solid #ff3b3b22', borderRadius: 6, marginBottom: 14 }}>
              <IconShip size={20} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#e2eaf5', fontFamily: 'Rajdhani, sans-serif' }}>MV Ocean Star</div>
                <div style={{ fontSize: 11, color: '#6b8aaa' }}>Chemical Tanker · India · 28,450 GT</div>
              </div>
            </div>
            <StatRow label="MMSI" value="419000001" mono />
            <StatRow label="IMO" value="IMO-9743821" mono />
            <StatRow label="Distance from Spill" value="3.2 km" mono />
            <StatRow label="Time Difference" value="8 minutes" mono />
            <StatRow label="Track Match" value="94%" mono />
            <StatRow label="Correlation Score" value="92%" mono />
            <Btn variant="outline" style={{ marginTop: 12, fontSize: 11 }} onClick={() => onNavigate('vessel')}>
              → Full Vessel Intelligence
            </Btn>
          </div>
        </Card>

        {/* AI Confidence */}
        <Card>
          <CardHeader><CardTitle>AI Confidence Assessment</CardTitle></CardHeader>
          <div style={{ padding: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Spill Detection', value: 94.7, color: '#ff8c00' },
                { label: 'Geolocation Accuracy', value: 96.2, color: '#00d4ff' },
                { label: 'Vessel Correlation', value: 92.0, color: '#ff3b3b' },
                { label: 'False Positive Risk', value: 5.3, color: '#00e57a', invert: true },
              ].map(c => (
                <div key={c.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: '#8aaac8' }}>{c.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: c.color, fontFamily: 'JetBrains Mono, monospace' }}>
                      {c.invert ? `${c.value}% risk` : `${c.value}%`}
                    </span>
                  </div>
                  <div style={{ height: 4, background: '#1a3050', borderRadius: 2 }}>
                    <div style={{ height: 4, width: `${c.invert ? 100 - c.value : c.value}%`, background: c.color, borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, padding: '8px 12px', background: '#ffd70011', border: '1px solid #ffd70033', borderRadius: 6 }}>
              <div style={{ fontSize: 10, color: '#ffd700' }}>AI-generated preliminary assessment. Requires human verification before legal or regulatory action.</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Evidence pipeline */}
      <Card>
        <CardHeader><CardTitle>Investigation Workflow — Evidence Chain</CardTitle></CardHeader>
        <div style={{ padding: 20 }}>
          <div style={{ display: 'flex', gap: 0, alignItems: 'center' }}>
            {EVIDENCE_STEPS.map((step, i) => (
              <React.Fragment key={step.label}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: step.done ? '#00e57a18' : '#1a3050',
                    border: `2px solid ${step.done ? '#00e57a' : '#264870'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: step.done ? '#00e57a' : '#4a6a8a',
                    marginBottom: 8,
                  }}>
                    {step.done ? <IconCheck size={18} /> : step.icon}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: step.done ? '#e2eaf5' : '#6b8aaa', textAlign: 'center', marginBottom: 2 }}>
                    {step.label}
                  </div>
                  <div style={{ fontSize: 9, color: '#4a6a8a', textAlign: 'center', fontFamily: 'JetBrains Mono, monospace' }}>
                    {step.desc}
                  </div>
                </div>
                {i < EVIDENCE_STEPS.length - 1 && (
                  <div style={{ height: 2, flex: 0.4, background: '#00e57a44', margin: '-20px 0 0 0' }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader><CardTitle>Investigator Notes</CardTitle></CardHeader>
        <div style={{ padding: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
            {notes.map((n, i) => (
              <div key={i} style={{ padding: '10px 14px', background: '#0a1e35', borderRadius: 6, border: '1px solid #1a3050' }}>
                <div style={{ fontSize: 12, color: '#e2eaf5', marginBottom: 4 }}>{n.text}</div>
                <div style={{ fontSize: 10, color: '#4a6a8a', fontFamily: 'JetBrains Mono, monospace' }}>
                  {n.author} · {n.time}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              id="note-input"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Add investigation note..."
              onKeyDown={e => e.key === 'Enter' && addNote()}
              style={{
                flex: 1, padding: '8px 12px', borderRadius: 6,
                background: '#0a1e35', border: '1px solid #1a3050',
                color: '#e2eaf5', fontSize: 13, outline: 'none',
                fontFamily: 'Inter, sans-serif',
              }}
            />
            <Btn variant="primary" onClick={addNote} icon={<IconPlus size={13} />}>Add</Btn>
          </div>
        </div>
      </Card>
    </div>
  );
}
