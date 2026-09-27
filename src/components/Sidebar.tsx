import React from 'react';
import type { Screen } from '../types';
import {
  IconDashboard, IconSatellite, IconWave, IconAIS, IconShip,
  IconAlert, IconReport, IconAnalytics, IconSettings, IconHistory,
  IconServer, IconActivity, IconUser, IconDatabase, IconGlobe
} from './Icons';

interface SidebarProps {
  active: Screen;
  onNavigate: (s: Screen) => void;
}

const navItems: { id: Screen; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <IconDashboard /> },
  { id: 'satellite', label: 'Satellite Analysis', icon: <IconSatellite /> },
  { id: 'detection', label: 'Spill Detection', icon: <IconWave /> },
  { id: 'geolocation', label: 'Geolocation', icon: <IconGlobe /> },
  { id: 'ais', label: 'AIS Correlation', icon: <IconAIS /> },
  { id: 'vessel', label: 'Vessel Intelligence', icon: <IconShip /> },
  { id: 'incident', label: 'Incidents', icon: <IconAlert /> },
  { id: 'report', label: 'Reports', icon: <IconReport /> },
  { id: 'analytics', label: 'Analytics', icon: <IconAnalytics /> },
  { id: 'history', label: 'Incident History', icon: <IconHistory /> },
  { id: 'settings', label: 'Settings', icon: <IconSettings /> },
];

export default function Sidebar({ active, onNavigate }: SidebarProps) {
  return (
    <aside
      className="flex flex-col"
      style={{
        width: 220,
        minWidth: 220,
        background: '#060f20',
        borderRight: '1px solid #1a3050',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid #1a3050' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'linear-gradient(135deg, #00d4ff22, #00d4ff44)',
            border: '1px solid #00d4ff66',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <IconWave size={18} className="" style={{ color: '#00d4ff' } as React.CSSProperties} />
          </div>
          <div>
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 15, color: '#00d4ff', letterSpacing: 1 }}>
              OCEAN<span style={{ color: '#e2eaf5' }}>SENTINEL</span>
            </div>
            <div style={{ fontSize: 9, color: '#4a6a8a', letterSpacing: 1.5, fontFamily: 'JetBrains Mono, monospace' }}>AI Â· v2.1.4</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 8px', overflowY: 'auto' }}>
        {navItems.map(item => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', padding: '8px 10px', borderRadius: 6,
                background: isActive ? '#00d4ff18' : 'transparent',
                border: isActive ? '1px solid #00d4ff33' : '1px solid transparent',
                color: isActive ? '#00d4ff' : '#6b8aaa',
                cursor: 'pointer', fontSize: 13, fontWeight: isActive ? 600 : 400,
                transition: 'all 0.15s', marginBottom: 2, textAlign: 'left',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = '#ffffff08';
                  (e.currentTarget as HTMLElement).style.color = '#e2eaf5';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = '#6b8aaa';
                }
              }}
            >
              <span style={{ opacity: isActive ? 1 : 0.7 }}>{item.icon}</span>
              <span>{item.label}</span>
              {item.id === 'incident' && (
                <span style={{
                  marginLeft: 'auto', background: '#ff3b3b', color: '#fff',
                  fontSize: 10, fontWeight: 700, borderRadius: 10, padding: '1px 6px',
                  fontFamily: 'JetBrains Mono, monospace',
                }}>7</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom status */}
      <div style={{ borderTop: '1px solid #1a3050', padding: '12px 14px' }}>
        <div style={{ fontSize: 10, color: '#4a6a8a', fontFamily: 'JetBrains Mono, monospace', marginBottom: 8, letterSpacing: 1 }}>
          SYSTEM STATUS
        </div>
        {[
          { label: 'AI Engine', ok: true },
          { label: 'AIS Feed', ok: true, note: 'Mock' },
          { label: 'Satellite', ok: true, note: 'Mock' },
          { label: 'Database', ok: true },
        ].map(s => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00e57a', flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: '#6b8aaa' }}>{s.label}</span>
            {s.note && <span style={{ fontSize: 9, color: '#4a6a8a', marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace' }}>{s.note}</span>}
          </div>
        ))}
        <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid #1a3050', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: '#1a3050', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <IconUser size={14} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#e2eaf5', fontWeight: 600 }}>Team Zapped</div>
          </div>
        </div>
      </div>
    </aside>
  );
}



