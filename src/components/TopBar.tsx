import React, { useState, useEffect } from 'react';
import { IconSearch, IconBell, IconUser } from './Icons';

interface TopBarProps {
  title: string;
  subtitle?: string;
  onNavigate: (s: string) => void;
}

export default function TopBar({ title, subtitle, onNavigate }: TopBarProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');
  const timeStr = `${pad(time.getUTCHours())}:${pad(time.getUTCMinutes())}:${pad(time.getUTCSeconds())} UTC`;
  const dateStr = `${time.toUTCString().slice(0, 16)}`;

  return (
    <header style={{
      height: 56, minHeight: 56,
      background: '#060f20',
      borderBottom: '1px solid #1a3050',
      display: 'flex', alignItems: 'center',
      padding: '0 20px', gap: 16,
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 17, color: '#e2eaf5', letterSpacing: 0.5 }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 11, color: '#4a6a8a', marginTop: 1 }}>{subtitle}</div>
        )}
      </div>

      {/* Search */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: '#0a1e35', border: '1px solid #1a3050',
        borderRadius: 6, padding: '6px 12px', width: 220,
      }}>
        <IconSearch size={14} />
        <input
          placeholder="Search incidents, vessels..."
          style={{
            background: 'transparent', border: 'none', outline: 'none',
            color: '#8aaac8', fontSize: 12, width: '100%',
            fontFamily: 'Inter, sans-serif',
          }}
        />
      </div>

      {/* Time */}
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#4a6a8a', textAlign: 'right' }}>
        <div style={{ color: '#8aaac8' }}>{timeStr}</div>
        <div style={{ fontSize: 10 }}>{dateStr}</div>
      </div>

      {/* Alerts badge */}
      <button
        onClick={() => onNavigate('incident')}
        style={{
          position: 'relative', background: 'transparent', border: 'none',
          cursor: 'pointer', color: '#6b8aaa', padding: 6,
        }}
      >
        <IconBell size={18} />
        <span style={{
          position: 'absolute', top: 0, right: 0,
          background: '#ff3b3b', color: '#fff',
          fontSize: 9, fontWeight: 700, borderRadius: 8, padding: '1px 4px',
          fontFamily: 'JetBrains Mono, monospace',
        }}>7</span>
      </button>

      {/* Status dot */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00e57a' }} />
        <span style={{ fontSize: 11, color: '#4a6a8a' }}>ONLINE</span>
      </div>

      {/* User */}
      <div style={{
        width: 30, height: 30, borderRadius: '50%',
        background: '#1a3050', display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: '#8aaac8',
      }}>
        <IconUser size={15} />
      </div>
    </header>
  );
}
