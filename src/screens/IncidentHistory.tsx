import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, Badge, Btn } from '../components/UI';
import { IconHistory, IconFilter, IconSearch, IconEye, IconReport } from '../components/Icons';
import type { Screen } from '../types';

const ALL_INCIDENTS = [
  { id: 'INC-2026-014', date: '2026-09-10 14:32', location: 'Arabian Sea', area: 18.42, conf: 94.7, vessel: 'MV Ocean Star', corrScore: 92, status: 'investigating' as const, severity: 'critical' as const },
  { id: 'INC-2026-013', date: '2026-09-10 11:18', location: 'Gulf of Oman', area: 7.83, conf: 87.2, vessel: 'MV Blue Horizon', corrScore: 68, status: 'investigating' as const, severity: 'high' as const },
  { id: 'INC-2026-012', date: '2026-09-09 08:44', location: 'Lakshadweep Sea', area: 3.21, conf: 79.8, vessel: 'MV Indus Pride', corrScore: 61, status: 'detected' as const, severity: 'medium' as const },
  { id: 'INC-2026-011', date: '2026-09-08 17:05', location: 'Bay of Bengal', area: 12.67, conf: 91.4, vessel: 'MV Eastern Wind', corrScore: 85, status: 'resolved' as const, severity: 'high' as const },
  { id: 'INC-2026-010', date: '2026-09-07 09:32', location: 'Arabian Sea', area: 2.10, conf: 63.1, vessel: '—', corrScore: 0, status: 'false-positive' as const, severity: 'low' as const },
  { id: 'INC-2026-009', date: '2026-09-06 14:21', location: 'Gulf of Oman', area: 9.44, conf: 88.9, vessel: 'MV Sea Giant', corrScore: 79, status: 'resolved' as const, severity: 'high' as const },
  { id: 'INC-2026-008', date: '2026-09-05 06:11', location: 'Andaman Sea', area: 4.55, conf: 82.4, vessel: 'MV Malay Star', corrScore: 57, status: 'resolved' as const, severity: 'medium' as const },
  { id: 'INC-2026-007', date: '2026-09-04 20:44', location: 'Arabian Sea', area: 22.1, conf: 96.2, vessel: 'MV Tanker X-12', corrScore: 91, status: 'resolved' as const, severity: 'critical' as const },
  { id: 'INC-2026-006', date: '2026-09-03 12:55', location: 'Strait of Hormuz', area: 6.80, conf: 85.1, vessel: 'MV Gulf Runner', corrScore: 73, status: 'resolved' as const, severity: 'high' as const },
  { id: 'INC-2026-005', date: '2026-09-02 09:12', location: 'Indian Ocean', area: 31.4, conf: 93.7, vessel: 'MV Pacific Dawn', corrScore: 88, status: 'resolved' as const, severity: 'critical' as const },
  { id: 'INC-2026-004', date: '2026-09-01 16:38', location: 'Bay of Bengal', area: 1.88, conf: 58.2, vessel: '—', corrScore: 0, status: 'false-positive' as const, severity: 'low' as const },
  { id: 'INC-2026-003', date: '2026-08-31 08:04', location: 'Gulf of Oman', area: 14.3, conf: 90.1, vessel: 'MV Coastal Dream', corrScore: 82, status: 'resolved' as const, severity: 'high' as const },
];

type StatusFilter = 'all' | 'investigating' | 'detected' | 'resolved' | 'false-positive';
type SeverityFilter = 'all' | 'critical' | 'high' | 'medium' | 'low';

interface Props { onNavigate: (s: Screen) => void; }

export default function IncidentHistory({ onNavigate }: Props) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('all');
  const [sortCol, setSortCol] = useState<string>('date');
  const [sortDesc, setSortDesc] = useState(true);

  const filtered = ALL_INCIDENTS.filter(inc => {
    if (search && !inc.id.toLowerCase().includes(search.toLowerCase()) &&
        !inc.location.toLowerCase().includes(search.toLowerCase()) &&
        !inc.vessel.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'all' && inc.status !== statusFilter) return false;
    if (severityFilter !== 'all' && inc.severity !== severityFilter) return false;
    return true;
  });

  const STATUS_LABEL: Record<string, string> = {
    investigating: 'Investigating', detected: 'Detected',
    resolved: 'Resolved', 'false-positive': 'False Positive',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 20, height: '100%', overflowY: 'auto', boxSizing: 'border-box' }}>
      {/* Filters */}
      <Card style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <IconFilter size={15} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#0a1e35', border: '1px solid #1a3050', borderRadius: 6, padding: '6px 12px', flex: 1, maxWidth: 280 }}>
            <IconSearch size={13} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search incidents, vessels, locations..."
              style={{ background: 'transparent', border: 'none', outline: 'none', color: '#8aaac8', fontSize: 12, flex: 1, fontFamily: 'Inter, sans-serif' }} />
          </div>

          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#4a6a8a' }}>Status:</span>
            <div style={{ display: 'flex', borderRadius: 6, overflow: 'hidden', border: '1px solid #1a3050' }}>
              {(['all', 'investigating', 'detected', 'resolved', 'false-positive'] as StatusFilter[]).map(s => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  style={{
                    padding: '4px 10px', border: 'none', cursor: 'pointer', fontSize: 10,
                    background: statusFilter === s ? '#00d4ff22' : 'transparent',
                    color: statusFilter === s ? '#00d4ff' : '#6b8aaa',
                    fontFamily: 'JetBrains Mono, monospace',
                  }}>
                  {s === 'all' ? 'All' : s === 'false-positive' ? 'FP' : STATUS_LABEL[s]}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#4a6a8a' }}>Severity:</span>
            <div style={{ display: 'flex', borderRadius: 6, overflow: 'hidden', border: '1px solid #1a3050' }}>
              {(['all', 'critical', 'high', 'medium', 'low'] as SeverityFilter[]).map(s => (
                <button key={s} onClick={() => setSeverityFilter(s)}
                  style={{
                    padding: '4px 10px', border: 'none', cursor: 'pointer', fontSize: 10,
                    background: severityFilter === s ? '#00d4ff22' : 'transparent',
                    color: severityFilter === s ? '#00d4ff' : '#6b8aaa',
                    fontFamily: 'JetBrains Mono, monospace', textTransform: 'capitalize',
                  }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginLeft: 'auto', fontSize: 12, color: '#4a6a8a', fontFamily: 'JetBrains Mono, monospace' }}>
            {filtered.length} / {ALL_INCIDENTS.length} incidents
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card style={{ flex: 1 }}>
        <CardHeader>
          <CardTitle icon={<IconHistory size={15} />}>Incident History</CardTitle>
          <Badge variant="default">Mock Data · Demonstration Only</Badge>
        </CardHeader>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1a3050' }}>
                {['Incident ID', 'Date / Time', 'Location', 'Spill Area', 'Confidence', 'Vessel', 'Corr. Score', 'Severity', 'Status', 'Actions'].map(h => (
                  <th key={h}
                    onClick={() => { setSortCol(h.toLowerCase()); setSortDesc(s => !s); }}
                    style={{
                      padding: '10px 14px', textAlign: 'left',
                      color: '#4a6a8a', fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 10, letterSpacing: 1, fontWeight: 600,
                      cursor: 'pointer', userSelect: 'none',
                      whiteSpace: 'nowrap',
                    }}>
                    {h} {sortCol === h.toLowerCase() && (sortDesc ? '↓' : '↑')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((inc, i) => (
                <tr key={inc.id}
                  style={{
                    borderBottom: '1px solid #1a305033',
                    background: i % 2 === 0 ? 'transparent' : '#060f2033',
                    cursor: 'pointer',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#0a1e35'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? 'transparent' : '#060f2033'}
                  onClick={() => onNavigate('incident')}
                >
                  <td style={{ padding: '10px 14px', color: '#00d4ff', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 600 }}>{inc.id}</td>
                  <td style={{ padding: '10px 14px', color: '#8aaac8', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, whiteSpace: 'nowrap' }}>{inc.date}</td>
                  <td style={{ padding: '10px 14px', color: '#e2eaf5' }}>{inc.location}</td>
                  <td style={{ padding: '10px 14px', color: '#ff8c00', fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap' }}>{inc.area.toFixed(2)} km²</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ color: inc.conf > 85 ? '#00e57a' : inc.conf > 70 ? '#ffd700' : '#ff8c00', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
                      {inc.conf.toFixed(1)}%
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', color: inc.vessel === '—' ? '#4a6a8a' : '#e2eaf5', fontSize: 11 }}>{inc.vessel}</td>
                  <td style={{ padding: '10px 14px' }}>
                    {inc.corrScore > 0 ? (
                      <span style={{ color: inc.corrScore > 80 ? '#ff3b3b' : inc.corrScore > 60 ? '#ffd700' : '#8aaac8', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
                        {inc.corrScore}%
                      </span>
                    ) : <span style={{ color: '#4a6a8a' }}>—</span>}
                  </td>
                  <td style={{ padding: '10px 14px' }}><Badge variant={inc.severity}>{inc.severity}</Badge></td>
                  <td style={{ padding: '10px 14px' }}><Badge variant={inc.status}>{STATUS_LABEL[inc.status]}</Badge></td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
                      <button onClick={() => onNavigate('incident')} style={{ background: '#00d4ff22', border: '1px solid #00d4ff33', borderRadius: 4, padding: '3px 8px', cursor: 'pointer', color: '#00d4ff', fontSize: 10 }}>
                        <IconEye size={11} />
                      </button>
                      <button onClick={() => onNavigate('report')} style={{ background: '#1a305022', border: '1px solid #1a3050', borderRadius: 4, padding: '3px 8px', cursor: 'pointer', color: '#8aaac8', fontSize: 10 }}>
                        <IconReport size={11} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
