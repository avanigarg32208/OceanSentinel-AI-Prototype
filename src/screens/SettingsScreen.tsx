import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, Badge, Btn, StatRow } from '../components/UI';
import { IconSettings, IconUser, IconServer, IconSatellite, IconShip } from '../components/Icons';

export default function SettingsScreen() {
  const [saved, setSaved] = useState(false);
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 20, height: '100%', overflowY: 'auto', boxSizing: 'border-box', maxWidth: 900 }}>
      <Card style={{ padding: '12px 0 0' }}>
        <CardHeader><CardTitle icon={<IconUser size={15} />}>User Profile</CardTitle></CardHeader>
        <div style={{ padding: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { label: 'Full Name', value: 'Commander A. Ramos' },
              { label: 'Agency ID', value: 'ICS-A-04821' },
              { label: 'Email', value: 'a.ramos@maritime.gov' },
              { label: 'Role', value: 'Senior Analyst — Environmental Intelligence' },
              { label: 'Agency', value: 'Indian Coast Guard' },
              { label: 'Clearance', value: 'UNCLASSIFIED (Demo)' },
            ].map(f => (
              <div key={f.label}>
                <label style={{ fontSize: 11, color: '#6b8aaa', display: 'block', marginBottom: 6, fontWeight: 600 }}>{f.label}</label>
                <input defaultValue={f.value} style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: '#0a1e35', border: '1px solid #1a3050', color: '#e2eaf5', fontSize: 12, outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }} />
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader><CardTitle icon={<IconSatellite size={15} />}>Satellite Configuration</CardTitle><Badge variant="detected">Mock</Badge></CardHeader>
        <div style={{ padding: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { label: 'Data Source', value: 'Sentinel-1 SAR (Mock)' },
              { label: 'Processing Level', value: 'L1-SLC → L2-GRD' },
              { label: 'Polarization', value: 'VV + VH' },
              { label: 'Resolution', value: '10m × 10m' },
              { label: 'Acquisition Mode', value: 'IW (Interferometric Wide)' },
              { label: 'Scene Refresh', value: 'Every 12 hours (Mock)' },
            ].map(f => (
              <div key={f.label}>
                <label style={{ fontSize: 11, color: '#6b8aaa', display: 'block', marginBottom: 6, fontWeight: 600 }}>{f.label}</label>
                <input defaultValue={f.value} style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: '#0a1e35', border: '1px solid #1a3050', color: '#e2eaf5', fontSize: 12, outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }} />
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader><CardTitle icon={<IconShip size={15} />}>AIS Correlation Settings</CardTitle></CardHeader>
        <div style={{ padding: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            {[
              { label: 'Spatial Radius (km)', value: '25' },
              { label: 'Temporal Window (min)', value: '60' },
              { label: 'Min Confidence (%)', value: '75' },
              { label: 'Spatial Weight', value: '0.35' },
              { label: 'Temporal Weight', value: '0.30' },
              { label: 'Trajectory Weight', value: '0.25' },
            ].map(f => (
              <div key={f.label}>
                <label style={{ fontSize: 11, color: '#6b8aaa', display: 'block', marginBottom: 6, fontWeight: 600 }}>{f.label}</label>
                <input defaultValue={f.value} type="number" style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: '#0a1e35', border: '1px solid #1a3050', color: '#e2eaf5', fontSize: 12, outline: 'none', fontFamily: 'JetBrains Mono, monospace', boxSizing: 'border-box' }} />
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div style={{ display: 'flex', gap: 12 }}>
        <Btn variant="primary" onClick={save}>
          {saved ? '✓ Settings Saved' : 'Save Changes'}
        </Btn>
        <Btn variant="ghost">Reset to Defaults</Btn>
      </div>
    </div>
  );
}
