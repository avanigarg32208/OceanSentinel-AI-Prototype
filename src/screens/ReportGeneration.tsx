import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, Badge, Btn, StatRow } from '../components/UI';
import { IconReport, IconDownload, IconShare, IconPrint, IconCheck, IconWave } from '../components/Icons';

export default function ReportGeneration() {
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);

  const generate = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 1500);
  };

  return (
    <div style={{ display: 'flex', gap: 16, padding: 20, height: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
      {/* Report preview */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0, overflowY: 'auto' }}>
        {/* Report document */}
        <div style={{ background: '#f8f9fa', borderRadius: 8, overflow: 'hidden', border: '1px solid #dee2e6', minHeight: 800 }}>
          {/* Report header */}
          <div style={{ background: '#030d1a', color: '#e2eaf5', padding: '24px 32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: '#00d4ff22', border: '1px solid #00d4ff66', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconWave size={20} />
                </div>
                <div>
                  <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 20, color: '#00d4ff', letterSpacing: 1 }}>
                    OCEANSENTINEL AI
                  </div>
                  <div style={{ fontSize: 10, color: '#4a6a8a', letterSpacing: 2, fontFamily: 'JetBrains Mono, monospace' }}>
                    MARITIME ENVIRONMENTAL INTELLIGENCE
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: '#4a6a8a', fontFamily: 'JetBrains Mono, monospace' }}>Classification: UNCLASSIFIED // DEMO</div>
                <div style={{ fontSize: 11, color: '#4a6a8a', fontFamily: 'JetBrains Mono, monospace' }}>Report ID: RPT-2026-2847</div>
                <div style={{ fontSize: 11, color: '#4a6a8a', fontFamily: 'JetBrains Mono, monospace' }}>Generated: 2026-09-10 16:02 UTC</div>
              </div>
            </div>
            <div style={{ borderTop: '1px solid #1a3050', paddingTop: 16 }}>
              <div style={{ fontSize: 22, fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, marginBottom: 4 }}>
                Maritime Oil Spill Incident Report
              </div>
              <div style={{ fontSize: 13, color: '#8aaac8' }}>
                Incident INC-2026-014 · Arabian Sea Sector · AI-Assisted Investigation
              </div>
            </div>
          </div>

          {/* Report body */}
          <div style={{ padding: '24px 32px', fontFamily: 'Inter, sans-serif' }}>
            {/* Disclaimer banner */}
            <div style={{ padding: '10px 16px', background: '#fff3cd', border: '1px solid #ffc107', borderRadius: 6, marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ fontSize: 16 }}>⚠</span>
              <div style={{ fontSize: 12, color: '#664d03' }}>
                <strong>AI-generated preliminary assessment.</strong> This report was produced by an automated AI system using mock data for demonstration purposes.
                <strong> Requires human expert verification</strong> before any operational, legal, or regulatory action.
              </div>
            </div>

            {/* Incident snapshot */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
              {[
                { label: 'Incident ID', value: 'INC-2026-014' },
                { label: 'Date / Time', value: '2026-09-10 14:32 UTC' },
                { label: 'Location', value: '18.42°N, 64.31°E' },
                { label: 'Detection Source', value: 'Sentinel-1 SAR' },
                { label: 'Spill Area', value: '18.42 km²' },
                { label: 'Detection Confidence', value: '94.7%' },
              ].map(f => (
                <div key={f.label} style={{ padding: '10px 14px', background: '#f1f3f4', borderRadius: 6, border: '1px solid #dee2e6' }}>
                  <div style={{ fontSize: 10, color: '#6c757d', fontFamily: 'JetBrains Mono, monospace', marginBottom: 3 }}>{f.label.toUpperCase()}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#212529' }}>{f.value}</div>
                </div>
              ))}
            </div>

            {/* Section 1: Evidence summary */}
            <h3 style={{ fontSize: 15, fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: '#212529', borderBottom: '2px solid #0d6efd', paddingBottom: 6, marginBottom: 14 }}>
              1. Satellite Evidence
            </h3>
            <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
              {/* Thumbnail placeholder */}
              <div style={{ width: 200, height: 130, borderRadius: 6, background: '#1a2a3a', border: '1px solid #dee2e6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
                <svg viewBox="0 0 200 130" width="200" height="130">
                  <rect width="200" height="130" fill="#0e1e2e" />
                  {Array.from({ length: 80 }).map((_, i) => (
                    <rect key={i} x={(i * 31) % 200} y={(i * 17) % 130} width={1} height={1} fill={`rgba(${50 + i % 40},${70 + i % 30},${90 + i % 20},0.3)`} />
                  ))}
                  <ellipse cx="100" cy="65" rx="35" ry="22" fill="#020810" opacity="0.9" />
                  <path d="M70 58 C80 48 100 46 124 55 C136 61 140 72 132 80 C122 90 100 92 82 86 C65 80 62 68 70 58 Z"
                    fill="#ff8c00" fillOpacity="0.25" stroke="#ff8c00" strokeWidth="1.5" />
                  <rect x={60} y={40} width={82} height={52} rx={2} fill="none" stroke="#00d4ff" strokeWidth="1" strokeDasharray="4 3" />
                  <rect x={60} y={30} width={60} height={10} rx={2} fill="#00d4ff" />
                  <text x={65} y={38} fill="#030d1a" fontSize="6" fontFamily="JetBrains Mono, monospace" fontWeight="700">OIL SLICK · 94.7%</text>
                </svg>
                <div style={{ position: 'absolute', bottom: 4, left: 0, right: 0, textAlign: 'center', fontSize: 8, color: '#8aaac8', fontFamily: 'JetBrains Mono, monospace' }}>
                  Sentinel-1 SAR · 2026-09-10
                </div>
              </div>
              <div>
                <p style={{ fontSize: 13, color: '#343a40', lineHeight: 1.7, margin: 0 }}>
                  Sentinel-1A synthetic aperture radar (SAR) imagery acquired on 2026-09-10 at 14:32 UTC detected a high-confidence oil slick
                  in the Arabian Sea at coordinates 18.42°N, 64.31°E. The OceanSentinel YOLO v2 deep-learning model processed the scene
                  and identified 3 oil-related objects with a primary slick area of 18.42 km².
                </p>
                <p style={{ fontSize: 13, color: '#343a40', lineHeight: 1.7, margin: '8px 0 0' }}>
                  The detection achieved a confidence score of 94.7% with a false-positive risk rated as Low, based on ensemble model
                  agreement, backscatter signature analysis, and contextual wind speed data (Beaufort 3).
                </p>
              </div>
            </div>

            {/* Section 2: AIS */}
            <h3 style={{ fontSize: 15, fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: '#212529', borderBottom: '2px solid #0d6efd', paddingBottom: 6, marginBottom: 14 }}>
              2. AIS Trajectory Analysis &amp; Vessel Attribution
            </h3>
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 13, color: '#343a40', lineHeight: 1.7, margin: '0 0 12px' }}>
                AIS records covering a ±60-minute temporal window and 25 km spatial radius around the spill location were analyzed.
                A total of 1,847 AIS position reports from 3 candidate vessels were processed by the correlation engine.
              </p>
              {/* Correlation mini-chart */}
              <div style={{ background: '#f1f3f4', border: '1px solid #dee2e6', borderRadius: 6, padding: '14px 20px', marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#343a40', marginBottom: 12 }}>Correlation Score Comparison</div>
                {[
                  { name: 'MV Ocean Star', score: 92, color: '#dc3545' },
                  { name: 'MV Blue Horizon', score: 68, color: '#fd7e14' },
                  { name: 'MV Sea Guardian', score: 42, color: '#ffc107' },
                ].map(v => (
                  <div key={v.name} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontSize: 12, color: '#343a40' }}>{v.name}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: v.color, fontFamily: 'JetBrains Mono, monospace' }}>{v.score}%</span>
                    </div>
                    <div style={{ height: 6, background: '#dee2e6', borderRadius: 3 }}>
                      <div style={{ height: 6, width: `${v.score}%`, background: v.color, borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Summary */}
            <h3 style={{ fontSize: 15, fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: '#212529', borderBottom: '2px solid #0d6efd', paddingBottom: 6, marginBottom: 14 }}>
              3. AI-Generated Assessment Summary
            </h3>
            <div style={{ padding: '14px 18px', background: '#e8f4f8', border: '1px solid #b8daff', borderRadius: 6, marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: '#004085', fontWeight: 700, marginBottom: 8, fontFamily: 'JetBrains Mono, monospace', letterSpacing: 0.8 }}>
                AI-GENERATED · UNVERIFIED
              </div>
              <p style={{ fontSize: 13, color: '#212529', lineHeight: 1.7, margin: 0 }}>
                Satellite imagery indicates a high-confidence oil slick in the Arabian Sea investigation zone (18.42°N, 64.31°E) acquired 2026-09-10 14:32 UTC.
                AIS trajectory analysis identified <strong>MV Ocean Star</strong> (MMSI: 419000001, Flag: India) as the highest-ranked candidate vessel
                based on spatial proximity (3.2 km), temporal proximity (8 minutes), and trajectory alignment (94% track match).
                The AI-assigned correlation score of 92% classifies this as a high-priority investigation target.
              </p>
              <p style={{ fontSize: 13, color: '#212529', lineHeight: 1.7, margin: '8px 0 0' }}>
                This assessment is preliminary and AI-generated. It does not constitute legal evidence of wrongdoing.
                Human expert review, field verification, and formal chain-of-custody documentation are required before any regulatory or legal action.
              </p>
            </div>

            {/* Signature block */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #dee2e6', paddingTop: 20 }}>
              <div>
                <div style={{ fontSize: 11, color: '#6c757d', marginBottom: 4 }}>Prepared by AI System</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#212529' }}>OceanSentinel AI v2.1.4</div>
                <div style={{ fontSize: 11, color: '#6c757d' }}>Automated Report Generator</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#6c757d', marginBottom: 4 }}>Pending Human Verification</div>
                <div style={{ width: 180, height: 1, background: '#343a40', marginBottom: 4 }} />
                <div style={{ fontSize: 11, color: '#6c757d' }}>Analyst Signature / Date</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: controls */}
      <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
        <Card>
          <CardHeader><CardTitle icon={<IconReport size={15} />}>Report Generation</CardTitle></CardHeader>
          <div style={{ padding: 16 }}>
            <div style={{ fontSize: 11, color: '#4a6a8a', fontFamily: 'JetBrains Mono, monospace', letterSpacing: 1, marginBottom: 10 }}>REPORT OPTIONS</div>
            {[
              { label: 'Incident Summary', checked: true },
              { label: 'Satellite Evidence', checked: true },
              { label: 'Spill Geolocation Map', checked: true },
              { label: 'AIS Correlation Analysis', checked: true },
              { label: 'Vessel Intelligence', checked: true },
              { label: 'Evidence Timeline', checked: true },
              { label: 'AI Confidence Metrics', checked: true },
              { label: 'Investigator Notes', checked: false },
            ].map(opt => (
              <label key={opt.label} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12, color: '#8aaac8', marginBottom: 8 }}>
                <input type="checkbox" defaultChecked={opt.checked} style={{ accentColor: '#00d4ff' }} />
                {opt.label}
              </label>
            ))}

            <div style={{ height: 1, background: '#1a3050', margin: '12px 0' }} />

            <div style={{ fontSize: 11, color: '#4a6a8a', fontFamily: 'JetBrains Mono, monospace', letterSpacing: 1, marginBottom: 10 }}>FORMAT</div>
            <div style={{ display: 'flex', borderRadius: 6, overflow: 'hidden', border: '1px solid #1a3050', marginBottom: 14 }}>
              {['PDF', 'HTML', 'DOCX'].map((f, i) => (
                <button key={f} style={{
                  flex: 1, padding: '6px', border: 'none', cursor: 'pointer', fontSize: 11,
                  background: i === 0 ? '#00d4ff22' : 'transparent',
                  color: i === 0 ? '#00d4ff' : '#6b8aaa',
                  fontFamily: 'JetBrains Mono, monospace',
                }}>{f}</button>
              ))}
            </div>

            <Btn variant="primary" style={{ width: '100%', justifyContent: 'center', marginBottom: 8 }} onClick={generate}
              disabled={generating}>
              {generating ? 'Generating...' : generated ? 'Regenerate Report' : 'Generate PDF'}
            </Btn>

            {generated && (
              <>
                <Btn variant="secondary" style={{ width: '100%', justifyContent: 'center', marginBottom: 8 }} icon={<IconDownload size={13} />}>
                  Download Report
                </Btn>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Btn variant="outline" style={{ flex: 1, justifyContent: 'center', fontSize: 11 }} icon={<IconShare size={12} />}>Share</Btn>
                  <Btn variant="outline" style={{ flex: 1, justifyContent: 'center', fontSize: 11 }} icon={<IconPrint size={12} />}>Print</Btn>
                </div>
                <div style={{ marginTop: 10, padding: '8px 12px', background: '#00e57a11', border: '1px solid #00e57a33', borderRadius: 6, display: 'flex', gap: 8, alignItems: 'center' }}>
                  <IconCheck size={14} />
                  <span style={{ fontSize: 11, color: '#00e57a' }}>Report generated successfully</span>
                </div>
              </>
            )}
          </div>
        </Card>

        <Card style={{ padding: 16 }}>
          <div style={{ fontSize: 11, color: '#4a6a8a', fontFamily: 'JetBrains Mono, monospace', letterSpacing: 1, marginBottom: 10 }}>REPORT METADATA</div>
          <StatRow label="Report ID" value="RPT-2026-2847" mono />
          <StatRow label="Incident" value="INC-2026-014" mono />
          <StatRow label="Classification" value="UNCLASSIFIED" />
          <StatRow label="Author" value="AI Auto-Report" />
          <StatRow label="Analyst" value="Cdr. A. Ramos" />
          <StatRow label="Pages" value="8" mono />
          <StatRow label="Generated" value="2026-09-10 16:02 UTC" mono />
        </Card>
      </div>
    </div>
  );
}
