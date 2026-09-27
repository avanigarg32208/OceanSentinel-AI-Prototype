import React, { useState } from 'react';
import type { Screen } from './types';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';

import LoginScreen from './screens/LoginScreen';
import Dashboard from './screens/Dashboard';
import SatelliteAnalysis from './screens/SatelliteAnalysis';
import SpillDetection from './screens/SpillDetection';
import Geolocation from './screens/Geolocation';
import AISCorrelation from './screens/AISCorrelation';
import VesselIntelligence from './screens/VesselIntelligence';
import IncidentInvestigation from './screens/IncidentInvestigation';
import ReportGeneration from './screens/ReportGeneration';
import Analytics from './screens/Analytics';
import IncidentHistory from './screens/IncidentHistory';
import SystemStatus from './screens/SystemStatus';
import SettingsScreen from './screens/SettingsScreen';

const SCREEN_TITLES: Record<Screen, { title: string; subtitle?: string }> = {
  login: { title: 'OceanSentinel AI' },
  dashboard: { title: 'Maritime Intelligence Command Center', subtitle: 'Real-time environmental monitoring and vessel attribution' },
  satellite: { title: 'Satellite Analysis', subtitle: 'Sentinel-1 SAR imagery processing and AI detection workspace' },
  detection: { title: 'AI Spill Detection', subtitle: 'Automated deep-learning oil spill detection pipeline' },
  geolocation: { title: 'Spill Geolocation', subtitle: 'Satellite-derived spill position and investigation zone' },
  ais: { title: 'AIS Vessel Correlation', subtitle: 'Spatial-temporal vessel attribution analysis' },
  vessel: { title: 'Vessel Intelligence', subtitle: 'MV Ocean Star · MMSI: 419000001 · Under Investigation' },
  incident: { title: 'Incident Investigation', subtitle: 'INC-2026-014 · Critical · Arabian Sea · 2026-09-10' },
  report: { title: 'Generate Investigation Report', subtitle: 'AI-assisted incident documentation — requires human verification' },
  analytics: { title: 'Environmental Intelligence Analytics', subtitle: 'Detection trends, vessel correlation statistics, and risk zones' },
  history: { title: 'Incident History', subtitle: 'Searchable archive of all maritime oil spill incidents' },
  status: { title: 'System Status', subtitle: 'Health monitoring for all OceanSentinel AI subsystems' },
  settings: { title: 'Settings', subtitle: 'System configuration and user preferences' },
};

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [screen, setScreen] = useState<Screen>('dashboard');

  const navigate = (s: string) => setScreen(s as Screen);

  if (!loggedIn) {
    return (
      <div style={{ height: '100%', fontFamily: 'Inter, sans-serif' }}>
        <LoginScreen onLogin={() => setLoggedIn(true)} />
      </div>
    );
  }

  const meta = SCREEN_TITLES[screen];

  const renderScreen = () => {
    switch (screen) {
      case 'dashboard': return <Dashboard onNavigate={navigate} />;
      case 'satellite': return <SatelliteAnalysis onNavigate={navigate} />;
      case 'detection': return <SpillDetection onNavigate={() => {}} />;
      case 'geolocation': return <Geolocation onNavigate={navigate} />;
      case 'ais': return <AISCorrelation onNavigate={navigate} />;
      case 'vessel': return <VesselIntelligence onNavigate={navigate} />;
      case 'incident': return <IncidentInvestigation onNavigate={navigate} />;
      case 'report': return <ReportGeneration />;
      case 'analytics': return <Analytics />;
      case 'history': return <IncidentHistory onNavigate={navigate} />;
      case 'status': return <SystemStatus />;
      case 'settings': return <SettingsScreen />;
      default: return <Dashboard onNavigate={navigate} />;
    }
  };

  return (
    <div style={{
      display: 'flex', height: '100%',
      background: '#030d1a', fontFamily: 'Inter, sans-serif', overflow: 'hidden',
    }}>
      <Sidebar active={screen} onNavigate={navigate} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <TopBar title={meta.title} subtitle={meta.subtitle} onNavigate={navigate} />
        <main style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          {renderScreen()}
        </main>
      </div>
    </div>
  );
}
