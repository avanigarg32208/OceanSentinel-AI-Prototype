import React from 'react';
import { Card, CardHeader, CardTitle, KpiCard, Badge } from '../components/UI';
import { IconAnalytics, IconWave, IconShip, IconSatellite, IconAlert } from '../components/Icons';

// Simple SVG chart components
function LineChart({ data, color = '#00d4ff', height = 120 }: { data: number[]; color?: string; height?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 100 / (data.length - 1);
  const pts = data.map((v, i) => `${i * w},${height - ((v - min) / range) * (height - 20) - 10}`).join(' ');
  const areaPath = `M 0,${height} L 0,${height - ((data[0] - min) / range) * (height - 20) - 10} ${data.map((v, i) => `L ${i * w},${height - ((v - min) / range) * (height - 20) - 10}`).join(' ')} L ${100},${height} Z`;

  return (
    <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" width="100%" height={height}>
      <defs>
        <linearGradient id={`lineGrad${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#lineGrad${color.replace('#', '')})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
      {data.map((v, i) => (
        <circle key={i} cx={i * w} cy={height - ((v - min) / range) * (height - 20) - 10} r="2.5"
          fill={color} vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  );
}

function BarChart({ data, colors, labels, height = 120 }: {
  data: number[]; colors?: string[]; labels?: string[]; height?: number;
}) {
  const max = Math.max(...data);
  const bw = 100 / data.length;
  return (
    <svg viewBox={`0 0 100 ${height + 16}`} preserveAspectRatio="none" width="100%" height={height + 16}>
      {data.map((v, i) => {
        const bh = (v / max) * height;
        const c = colors ? colors[i % colors.length] : '#00d4ff';
        return (
          <g key={i}>
            <rect x={i * bw + bw * 0.1} y={height - bh} width={bw * 0.8} height={bh} fill={c} rx="1" opacity="0.85" />
            {labels && (
              <text x={i * bw + bw / 2} y={height + 12} fill="#4a6a8a" fontSize="5" fontFamily="JetBrains Mono, monospace"
                textAnchor="middle">{labels[i]}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function DonutChart({ segments, size = 120 }: { segments: { value: number; color: string; label: string }[]; size?: number }) {
  const total = segments.reduce((s, v) => s + v.value, 0);
  let offset = 0;
  const r = 40; const cx = size / 2; const cy = size / 2;
  const circum = 2 * Math.PI * r;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {segments.map((seg, i) => {
        const dash = (seg.value / total) * circum;
        const el = (
          <circle key={i} cx={cx} cy={cy} r={r}
            fill="none" stroke={seg.color} strokeWidth="18"
            strokeDasharray={`${dash} ${circum - dash}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${cx} ${cy})`}
            opacity="0.85"
          />
        );
        offset += dash;
        return el;
      })}
      <circle cx={cx} cy={cy} r={30} fill="#071526" />
      <text x={cx} y={cy - 5} textAnchor="middle" fill="#e2eaf5" fontSize="12" fontFamily="Rajdhani, sans-serif" fontWeight="700">{total}</text>
      <text x={cx} y={cy + 8} textAnchor="middle" fill="#4a6a8a" fontSize="7" fontFamily="JetBrains Mono, monospace">TOTAL</text>
    </svg>
  );
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
const SPILLS_BY_MONTH = [4, 6, 3, 8, 5, 11, 9, 14, 12];
const CONFIDENCE_DIST = [2, 3, 5, 8, 14, 22, 18, 12, 7, 4];
const VESSEL_CORR = [68, 72, 74, 71, 78, 83, 81, 88, 92];

export default function Analytics() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 20, height: '100%', overflowY: 'auto', boxSizing: 'border-box' }}>
      {/* KPI row */}
      <div style={{ display: 'flex', gap: 12 }}>
        <KpiCard label="Avg Detection Confidence" value="89.4%" color="#00e57a" icon={<IconSatellite size={16} />} sub="↑2.3% vs last month" />
        <KpiCard label="Avg Response Time" value="4.2 hr" color="#00d4ff" icon={<IconAlert size={16} />} sub="Time to investigation" />
        <KpiCard label="Confirmed Incidents" value="47" color="#ff8c00" icon={<IconWave size={16} />} sub="This year (2026)" />
        <KpiCard label="Investigations Completed" value="34" color="#ffd700" icon={<IconShip size={16} />} sub="72% completion rate" />
        <KpiCard label="False Positive Rate" value="8.3%" color="#4a6a8a" icon={<IconAnalytics size={16} />} sub="↓1.1% improvement" />
      </div>

      {/* Charts row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <Card>
          <CardHeader>
            <CardTitle icon={<IconAnalytics size={15} />}>Oil Spill Detections — Monthly Trend (2026)</CardTitle>
            <Badge variant="detected">YTD: 72</Badge>
          </CardHeader>
          <div style={{ padding: '12px 16px 16px' }}>
            <div style={{ display: 'flex', gap: 24, marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 10, color: '#4a6a8a', fontFamily: 'JetBrains Mono, monospace', marginBottom: 2 }}>PEAK MONTH</div>
                <div style={{ fontSize: 18, fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: '#ff8c00' }}>Aug (14)</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#4a6a8a', fontFamily: 'JetBrains Mono, monospace', marginBottom: 2 }}>AVG/MONTH</div>
                <div style={{ fontSize: 18, fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: '#00d4ff' }}>8.0</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#4a6a8a', fontFamily: 'JetBrains Mono, monospace', marginBottom: 2 }}>TREND</div>
                <div style={{ fontSize: 18, fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: '#ff3b3b' }}>↑ +18%</div>
              </div>
            </div>
            <LineChart data={SPILLS_BY_MONTH} color="#ff8c00" height={130} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              {MONTHS.map(m => <span key={m} style={{ fontSize: 9, color: '#4a6a8a', fontFamily: 'JetBrains Mono, monospace' }}>{m}</span>)}
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader><CardTitle>Incident Status Breakdown</CardTitle></CardHeader>
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <DonutChart segments={[
              { value: 7, color: '#ff3b3b', label: 'Active' },
              { value: 12, color: '#ffd700', label: 'Investigating' },
              { value: 23, color: '#00e57a', label: 'Resolved' },
              { value: 5, color: '#4a6a8a', label: 'False Positive' },
            ]} size={140} />
            <div style={{ marginTop: 12, width: '100%' }}>
              {[
                { label: 'Active Alerts', value: 7, color: '#ff3b3b' },
                { label: 'Investigating', value: 12, color: '#ffd700' },
                { label: 'Resolved', value: 23, color: '#00e57a' },
                { label: 'False Positive', value: 5, color: '#4a6a8a' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: s.color }} />
                  <span style={{ fontSize: 11, color: '#8aaac8', flex: 1 }}>{s.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: s.color, fontFamily: 'JetBrains Mono, monospace' }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Charts row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        <Card>
          <CardHeader><CardTitle>Detection Confidence Distribution</CardTitle></CardHeader>
          <div style={{ padding: '12px 16px 16px' }}>
            <BarChart
              data={CONFIDENCE_DIST}
              colors={['#ff3b3b', '#ff3b3b', '#ff8c00', '#ff8c00', '#ffd700', '#00e57a', '#00e57a', '#00d4ff', '#00d4ff', '#00d4ff']}
              labels={['50', '55', '60', '65', '70', '75', '80', '85', '90', '95']}
              height={120}
            />
            <div style={{ marginTop: 8, fontSize: 10, color: '#4a6a8a', textAlign: 'center', fontFamily: 'JetBrains Mono, monospace' }}>
              Confidence Score (%)
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader><CardTitle>AIS Correlation Score Trend</CardTitle></CardHeader>
          <div style={{ padding: '12px 16px 16px' }}>
            <LineChart data={VESSEL_CORR} color="#00d4ff" height={120} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              {MONTHS.map(m => <span key={m} style={{ fontSize: 9, color: '#4a6a8a', fontFamily: 'JetBrains Mono, monospace' }}>{m}</span>)}
            </div>
            <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 9, color: '#4a6a8a', fontFamily: 'JetBrains Mono, monospace' }}>AVG SCORE</div>
                <div style={{ fontSize: 16, fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: '#00d4ff' }}>79.7%</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 9, color: '#4a6a8a', fontFamily: 'JetBrains Mono, monospace' }}>LATEST</div>
                <div style={{ fontSize: 16, fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: '#00e57a' }}>92%</div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader><CardTitle>Spill Area Distribution (km²)</CardTitle></CardHeader>
          <div style={{ padding: '12px 16px 16px' }}>
            <BarChart
              data={[18, 12, 9, 7, 5, 4, 3, 2]}
              colors={['#ff3b3b', '#ff8c00', '#ff8c00', '#ffd700', '#ffd700', '#00d4ff', '#00d4ff', '#8aaac8']}
              labels={['<2', '2-5', '5-10', '10-15', '15-20', '20-30', '30-50', '>50']}
              height={120}
            />
            <div style={{ marginTop: 8, fontSize: 10, color: '#4a6a8a', textAlign: 'center', fontFamily: 'JetBrains Mono, monospace' }}>
              Spill Area Bins
            </div>
          </div>
        </Card>
      </div>

      {/* High risk zones */}
      <Card>
        <CardHeader>
          <CardTitle icon={<IconAlert size={15} />}>High-Risk Maritime Zones</CardTitle>
          <Badge variant="high">Based on 2026 data</Badge>
        </CardHeader>
        <div style={{ padding: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {[
              { zone: 'Arabian Sea', incidents: 28, risk: 'HIGH', color: '#ff3b3b', pct: 88 },
              { zone: 'Gulf of Oman', incidents: 16, risk: 'HIGH', color: '#ff8c00', pct: 72 },
              { zone: 'Bay of Bengal', incidents: 11, risk: 'MEDIUM', color: '#ffd700', pct: 54 },
              { zone: 'Lakshadweep Sea', incidents: 8, risk: 'MEDIUM', color: '#ffd700', pct: 42 },
              { zone: 'Strait of Hormuz', incidents: 6, risk: 'MEDIUM', color: '#ffd700', pct: 35 },
              { zone: 'Indian Ocean', incidents: 4, risk: 'LOW', color: '#00d4ff', pct: 22 },
              { zone: 'Andaman Sea', incidents: 3, risk: 'LOW', color: '#00d4ff', pct: 16 },
              { zone: 'Malabar Coast', incidents: 2, risk: 'LOW', color: '#8aaac8', pct: 10 },
            ].map(z => (
              <div key={z.zone} style={{ padding: '12px 14px', background: '#0a1e35', borderRadius: 6, border: `1px solid ${z.color}33` }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#e2eaf5', marginBottom: 4 }}>{z.zone}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 10, color: '#4a6a8a' }}>{z.incidents} incidents</span>
                  <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: z.color, fontWeight: 700 }}>{z.risk}</span>
                </div>
                <div style={{ height: 3, background: '#1a3050', borderRadius: 2 }}>
                  <div style={{ height: 3, width: `${z.pct}%`, background: z.color, borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
