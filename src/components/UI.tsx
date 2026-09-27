import React from 'react';

// Shared UI primitives

export function Card({ children, style, className }: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <div style={{
      background: '#071526',
      border: '1px solid #1a3050',
      borderRadius: 8,
      ...style,
    }} className={className}>
      {children}
    </div>
  );
}

export function CardHeader({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      padding: '12px 16px',
      borderBottom: '1px solid #1a3050',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      ...style,
    }}>
      {children}
    </div>
  );
}

export function CardTitle({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {icon && <span style={{ color: '#00d4ff', opacity: 0.8 }}>{icon}</span>}
      <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 14, color: '#e2eaf5', letterSpacing: 0.5 }}>
        {children}
      </span>
    </div>
  );
}

type BadgeVariant = 'critical' | 'high' | 'medium' | 'low' | 'online' | 'investigating' | 'resolved' | 'detected' | 'false-positive' | 'default';

const badgeColors: Record<BadgeVariant, { bg: string; color: string; border: string }> = {
  critical: { bg: '#ff3b3b22', color: '#ff3b3b', border: '#ff3b3b44' },
  high: { bg: '#ff8c0022', color: '#ff8c00', border: '#ff8c0044' },
  medium: { bg: '#ffd70022', color: '#ffd700', border: '#ffd70044' },
  low: { bg: '#00d4ff22', color: '#00d4ff', border: '#00d4ff44' },
  online: { bg: '#00e57a22', color: '#00e57a', border: '#00e57a44' },
  investigating: { bg: '#ffd70022', color: '#ffd700', border: '#ffd70044' },
  resolved: { bg: '#00e57a22', color: '#00e57a', border: '#00e57a44' },
  detected: { bg: '#00d4ff22', color: '#00d4ff', border: '#00d4ff44' },
  'false-positive': { bg: '#4a6a8a22', color: '#8aaac8', border: '#4a6a8a44' },
  default: { bg: '#1a305022', color: '#8aaac8', border: '#1a305044' },
};

export function Badge({ variant = 'default', children }: { variant?: BadgeVariant; children: React.ReactNode }) {
  const c = badgeColors[variant];
  return (
    <span style={{
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      borderRadius: 4, padding: '2px 7px',
      fontSize: 10, fontWeight: 700, letterSpacing: 0.8,
      fontFamily: 'JetBrains Mono, monospace',
      textTransform: 'uppercase' as const,
    }}>
      {children}
    </span>
  );
}

type BtnVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';

const btnStyles: Record<BtnVariant, React.CSSProperties> = {
  primary: { background: '#00d4ff', color: '#030d1a', fontWeight: 700 },
  secondary: { background: '#0a1e35', color: '#00d4ff', border: '1px solid #00d4ff44' },
  danger: { background: '#ff3b3b22', color: '#ff3b3b', border: '1px solid #ff3b3b44' },
  ghost: { background: 'transparent', color: '#8aaac8' },
  outline: { background: 'transparent', color: '#e2eaf5', border: '1px solid #1a3050' },
};

export function Btn({
  variant = 'primary', children, onClick, icon, style, disabled,
}: {
  variant?: BtnVariant;
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '7px 14px', borderRadius: 6, border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer', fontSize: 12, fontWeight: 600,
        fontFamily: 'Inter, sans-serif', transition: 'all 0.15s', letterSpacing: 0.3,
        opacity: disabled ? 0.5 : 1,
        ...btnStyles[variant],
        ...style,
      }}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}

export function ConfidenceBar({ value, color }: { value: number; color?: string }) {
  const c = color || (value > 85 ? '#00e57a' : value > 60 ? '#ffd700' : '#ff8c00');
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: '#8aaac8' }}>Confidence</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: c, fontFamily: 'JetBrains Mono, monospace' }}>
          {value.toFixed(1)}%
        </span>
      </div>
      <div style={{ height: 4, background: '#1a3050', borderRadius: 2 }}>
        <div style={{ height: 4, width: `${value}%`, background: c, borderRadius: 2, transition: 'width 1s ease' }} />
      </div>
    </div>
  );
}

export function StatRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #1a305033' }}>
      <span style={{ fontSize: 12, color: '#6b8aaa' }}>{label}</span>
      <span style={{ fontSize: 12, color: '#e2eaf5', fontFamily: mono ? 'JetBrains Mono, monospace' : 'Inter, sans-serif', fontWeight: 500 }}>
        {value}
      </span>
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 700, color: '#4a6a8a',
      letterSpacing: 2, fontFamily: 'JetBrains Mono, monospace',
      textTransform: 'uppercase' as const, marginBottom: 8,
    }}>
      {children}
    </div>
  );
}

export function Dot({ color = '#00e57a' }: { color?: string }) {
  return (
    <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
  );
}

export function KpiCard({
  label, value, sub, color, icon,
}: {
  label: string; value: string; sub?: string; color?: string; icon?: React.ReactNode;
}) {
  return (
    <Card style={{ padding: '14px 16px', flex: 1, minWidth: 140 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 10, color: '#4a6a8a', fontFamily: 'JetBrains Mono, monospace', letterSpacing: 1.5, marginBottom: 6, textTransform: 'uppercase' }}>
            {label}
          </div>
          <div style={{
            fontFamily: 'Rajdhani, sans-serif', fontWeight: 700,
            fontSize: 28, color: color || '#e2eaf5', lineHeight: 1,
          }}>
            {value}
          </div>
          {sub && <div style={{ fontSize: 11, color: '#4a6a8a', marginTop: 4 }}>{sub}</div>}
        </div>
        {icon && (
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: (color || '#00d4ff') + '18',
            border: `1px solid ${(color || '#00d4ff')}33`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: color || '#00d4ff',
          }}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
