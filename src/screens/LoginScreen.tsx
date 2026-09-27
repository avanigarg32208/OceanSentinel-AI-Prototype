import React, { useState } from 'react';
import { IconWave, IconUser, IconEye } from '../components/Icons';

interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 1200);
  };

  return (
    <div style={{
      display: 'flex', height: '100%',
      fontFamily: 'Inter, sans-serif',
      background: '#030d1a',
    }}>
      {/* Left panel */}
      <div style={{
        flex: 1, position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(160deg, #030d1a 0%, #071e3d 50%, #030d1a 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '60px 80px',
        borderRight: '1px solid #1a3050',
      }}>
        {/* Animated rings */}
        {[200, 340, 480, 620].map((r, i) => (
          <div key={r} style={{
            position: 'absolute', left: '50%', top: '50%',
            width: r, height: r,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            border: `1px solid #00d4ff`,
            opacity: 0.04 + i * 0.02,
          }} />
        ))}

        {/* Satellite path SVG */}
        <svg style={{ position: 'absolute', inset: 0 }} width="100%" height="100%" viewBox="0 0 600 800">
          <defs>
            <radialGradient id="grd" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* ocean grid */}
          {[0,60,120,180,240,300,360,420,480,540,600].map(x => (
            <line key={x} x1={x} y1={0} x2={x} y2={800} stroke="#0d2744" strokeWidth="0.5" />
          ))}
          {[0,80,160,240,320,400,480,560,640,720,800].map(y => (
            <line key={y} x1={0} y1={y} x2={600} y2={y} stroke="#0d2744" strokeWidth="0.5" />
          ))}
          {/* satellite orbit */}
          <ellipse cx="300" cy="400" rx="220" ry="160" fill="none" stroke="#00d4ff" strokeWidth="0.7" strokeDasharray="4 6" opacity="0.3" />
          {/* satellite dot */}
          <circle cx="520" cy="290" r="5" fill="#00d4ff" opacity="0.7">
            <animateMotion dur="20s" repeatCount="indefinite">
              <mpath href="#orbit" />
            </animateMotion>
          </circle>
          <ellipse id="orbit" cx="300" cy="400" rx="220" ry="160" />
          {/* spill glow */}
          <circle cx="290" cy="430" r="40" fill="url(#grd)" />
          <ellipse cx="290" cy="430" rx="28" ry="16" fill="#ff8c00" opacity="0.2" />
          {/* vessel tracks */}
          <path d="M 180 320 L 240 370 L 290 430" stroke="#ff3b3b" strokeWidth="1" fill="none" strokeDasharray="4 3" opacity="0.4" />
          <path d="M 400 360 L 340 400 L 290 430" stroke="#ffd700" strokeWidth="1" fill="none" strokeDasharray="4 3" opacity="0.3" />
          {/* coord labels */}
          {['18°N', '20°N', '22°N'].map((l, i) => (
            <text key={l} x="16" y={530 - i * 100} fill="#1a3050" fontSize="10" fontFamily="JetBrains Mono, monospace">{l}</text>
          ))}
          {['62°E', '64°E', '66°E'].map((l, i) => (
            <text key={l} x={100 + i * 180} y={790} fill="#1a3050" fontSize="10" fontFamily="JetBrains Mono, monospace">{l}</text>
          ))}
        </svg>

        {/* Logo */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 48 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 12,
              background: 'linear-gradient(135deg, #00d4ff22, #00d4ff44)',
              border: '1px solid #00d4ff66',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <IconWave size={26} className="" style={{ color: '#00d4ff' } as React.CSSProperties} />
            </div>
            <div>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 28, color: '#e2eaf5', letterSpacing: 2 }}>
                OCEAN<span style={{ color: '#00d4ff' }}>SENTINEL</span> AI
              </div>
              <div style={{ fontSize: 11, color: '#4a6a8a', letterSpacing: 3, fontFamily: 'JetBrains Mono, monospace' }}>
                MARITIME INTELLIGENCE
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 40 }}>
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 42, fontWeight: 700, color: '#e2eaf5', lineHeight: 1.2, marginBottom: 16 }}>
              Detect.<br />
              <span style={{ color: '#00d4ff' }}>Correlate.</span><br />
              Protect.
            </div>
            <div style={{ fontSize: 14, color: '#6b8aaa', lineHeight: 1.7, maxWidth: 380 }}>
              AI-Powered Maritime Oil Spill Detection &amp; Vessel Attribution for government agencies, coast guards, and environmental response teams.
            </div>
          </div>

          {/* Feature pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {['SAR Satellite Analysis', 'AIS Correlation', 'AI Detection', 'Vessel Attribution', 'Incident Reporting'].map(f => (
              <span key={f} style={{
                padding: '4px 10px', borderRadius: 20,
                background: '#00d4ff11', border: '1px solid #00d4ff33',
                fontSize: 11, color: '#8aaac8',
              }}>{f}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{
        width: 420, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', padding: 40,
        background: '#060f20',
      }}>
        <div style={{ width: '100%', maxWidth: 340 }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 22, color: '#e2eaf5', marginBottom: 6 }}>
              Secure Access Portal
            </div>
            <div style={{ fontSize: 12, color: '#4a6a8a' }}>
              Maritime Environmental Intelligence Platform
            </div>
          </div>

          {/* Form */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, color: '#6b8aaa', display: 'block', marginBottom: 6, fontWeight: 600, letterSpacing: 0.5 }}>
              EMAIL / AGENCY ID
            </label>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="analyst@maritime.gov"
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 6,
                background: '#0a1e35', border: '1px solid #1a3050',
                color: '#e2eaf5', fontSize: 13, outline: 'none',
                fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ fontSize: 11, color: '#6b8aaa', display: 'block', marginBottom: 6, fontWeight: 600, letterSpacing: 0.5 }}>
              PASSWORD
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%', padding: '10px 36px 10px 12px', borderRadius: 6,
                  background: '#0a1e35', border: '1px solid #1a3050',
                  color: '#e2eaf5', fontSize: 13, outline: 'none',
                  fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
                }}
              />
              <button onClick={() => setShowPw(!showPw)} style={{
                position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: '#4a6a8a',
              }}>
                <IconEye size={15} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12, color: '#6b8aaa' }}>
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                style={{ accentColor: '#00d4ff' }} />
              Remember me
            </label>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#00d4ff', fontSize: 12 }}>
              Forgot password?
            </button>
          </div>

          <button
            onClick={handleLogin}
            style={{
              width: '100%', padding: '11px', borderRadius: 6, border: 'none',
              background: loading ? '#00b8e0' : '#00d4ff',
              color: '#030d1a', fontWeight: 700, fontSize: 13,
              cursor: 'pointer', marginBottom: 12, fontFamily: 'Rajdhani, sans-serif',
              letterSpacing: 1, transition: 'all 0.2s',
            }}
          >
            {loading ? 'AUTHENTICATING...' : 'SIGN IN'}
          </button>

          <button
            onClick={onLogin}
            style={{
              width: '100%', padding: '11px', borderRadius: 6,
              background: 'transparent', color: '#8aaac8',
              border: '1px solid #1a3050', fontWeight: 600, fontSize: 12,
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            }}
          >
            Demo Mode — No credentials required
          </button>

          <div style={{ marginTop: 32, padding: '12px', borderRadius: 6, background: '#0a1e35', border: '1px solid #1a3050' }}>
            <div style={{ fontSize: 10, color: '#4a6a8a', lineHeight: 1.5 }}>
              <span style={{ color: '#ffd700', fontWeight: 700 }}>⚠ PROTOTYPE:</span> This is a demonstration system using mock data only. Not connected to live satellite or AIS feeds. For hackathon evaluation purposes.
            </div>
          </div>

          <div style={{ marginTop: 20, textAlign: 'center', fontSize: 10, color: '#264870' }}>
            OceanSentinel AI v2.1.4 · Classification: UNCLASSIFIED // DEMO
          </div>
        </div>
      </div>
    </div>
  );
}
