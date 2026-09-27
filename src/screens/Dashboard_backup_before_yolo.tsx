import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  Badge,
  Btn,
  KpiCard,
} from '../components/UI';
import MapSVG from '../components/MapSVG';
import {
  IconAlert,
  IconWave,
  IconShip,
  IconSatellite,
  IconReport,
  IconMap,
  IconEye,
  IconChevronRight,
} from '../components/Icons';
import type { Screen } from '../types';
import { m3Spills } from '../data/m3Spills';
import { loadAllData } from '../data/dataLoader';
type AlertSeverity = 'critical' | 'high' | 'medium';

const ALERTS: {
  id: string;
  type: string;
  severity: AlertSeverity;
  time: string;
  location: string;
  confidence: number | null;
  desc: string;
}[] = m3Spills.slice(0, 4).map((spill) => ({
  id: spill.spill_id,
  type: 'Oil Spill Detected',
  severity: 'medium',
  time: `${new Date(spill.timestamp_utc)
    .toISOString()
    .slice(11, 16)} UTC`,
  location:
    spill.latitude !== null && spill.longitude !== null
      ? `${spill.latitude.toFixed(4)}°N ${spill.longitude.toFixed(4)}°E`
      : 'Location not available',
  confidence: spill.confidence,
  desc: `Oil detection from ${spill.image_name}. Bounding-box area: ${spill.bbox_area_pixels.toLocaleString()} pixels.`,
}));

const INCIDENTS = [
  {
    id: 'INC-2026-014',
    detected: '2026-09-10 14:32',
    location: 'Arabian Sea',
    area: '18.42 km²',
    conf: 94.7,
    vessel: 'MV Ocean Star',
    status: 'investigating' as const,
  },
  {
    id: 'INC-2026-013',
    detected: '2026-09-10 11:18',
    location: 'Gulf of Oman',
    area: '7.83 km²',
    conf: 87.2,
    vessel: 'MV Blue Horizon',
    status: 'investigating' as const,
  },
  {
    id: 'INC-2026-012',
    detected: '2026-09-09 08:44',
    location: 'Lakshadweep Sea',
    area: '3.21 km²',
    conf: 79.8,
    vessel: 'MV Indus Pride',
    status: 'detected' as const,
  },
  {
    id: 'INC-2026-011',
    detected: '2026-09-08 17:05',
    location: 'Bay of Bengal',
    area: '12.67 km²',
    conf: 91.4,
    vessel: 'MV Eastern Wind',
    status: 'resolved' as const,
  },
  {
    id: 'INC-2026-010',
    detected: '2026-09-07 09:32',
    location: 'Arabian Sea',
    area: '2.10 km²',
    conf: 63.1,
    vessel: '—',
    status: 'false-positive' as const,
  },
  {
    id: 'INC-2026-009',
    detected: '2026-09-06 14:21',
    location: 'Gulf of Oman',
    area: '9.44 km²',
    conf: 88.9,
    vessel: 'MV Sea Giant',
    status: 'resolved' as const,
  },
];

interface DashboardProps {
  onNavigate: (s: Screen) => void;
}

const M3_SPILL_COUNT = m3Spills.length;

const M3_SCENE_COUNT = new Set(
  m3Spills.map((spill) => spill.image_name)
).size;

const M3_SCENE_IMAGES = [
  'class_1_00001.jpg',
  'class_1_00002.jpg',
  'class_1_00003.jpg',
  'class_1_00004.jpg',
  'class_1_00005.jpg',
  'class_1_00006.jpg',
  'class_1_00007.jpg',
  'class_1_00008.jpg',
  'class_1_00009.jpg',
  'class_1_00010.jpg',
  'class_1_00011.jpg',
  'class_1_00012.jpg',
  'class_1_00013.jpg',
  'class_1_00014.jpg',
  'class_1_00015.jpg',
  'class_1_00016.jpg',
  'class_1_00017.jpg',
  'class_1_00018.jpg',
  'class_1_00019.jpg',
  'class_1_00020.jpg',
];

const M3_TOTAL_AREA_PIXELS = m3Spills.reduce(
  (sum, spill) => sum + spill.bbox_area_pixels,
  0
);

export default function Dashboard({ onNavigate }: DashboardProps) {

  const [realData, setRealData] = useState<{
    ais: any[];
    vessels: any[];
    spills: any[];
  }>({
    ais: [],
    vessels: [],
    spills: [],
  });

  const [hoveredAlert, setHoveredAlert] = useState<string | null>(null);

  useEffect(() => {
    loadAllData()
      .then((data) => {
        setRealData(data);

        console.log('OceanSentinel prototype data loaded:', {
          AIS: data.ais.length,
          Vessels: data.vessels.length,
          Spills: data.spills.length,
        });
      })
      .catch((error) => {
        console.error('Failed to load prototype data:', error);
      });
  }, []);

  const AIS_COUNT = realData.ais.length;
  const VESSEL_COUNT = realData.vessels.length;
  const SPILL_COUNT = realData.spills.length;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        padding: 20,
        height: '100%',
        overflowY: 'auto',
        boxSizing: 'border-box',
      }}
    >
      {/* =========================================================
          KPI ROW
      ========================================================= */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 12,
        }}
      >
        <KpiCard
          label="Spill Detections"
          value={String(M3_SPILL_COUNT)}
          color="#ff3b3b"
          icon={<IconAlert size={16} />}
          sub="M3 detected objects"
        />

        <KpiCard
          label="Satellite Scenes"
          value={String(M3_SCENE_COUNT)}
          color="#ff8c00"
          icon={<IconWave size={16} />}
          sub="Unique SAR images"
        />

        <KpiCard
          label="Vessels Correlated"
          value="0"
          color="#ffd700"
          icon={<IconShip size={16} />}
          sub="No M3 correlation"
        />

        <KpiCard
          label="Confidence"
          value="N/A"
          color="#00e57a"
          icon={<IconSatellite size={16} />}
          sub="Not available in M3"
        />

        <KpiCard
          label="Coverage Area"
          value="N/A"
          color="#00d4ff"
          icon={<IconMap size={16} />}
          sub="Area unavailable"
        />

        <KpiCard
          label="Reports Generated"
          value="0"
          color="#8aaac8"
          icon={<IconReport size={16} />}
          sub="No report data in M3"
        />
      </div>

      {/* =========================================================
          MAIN MAP + PRIORITY ALERTS
      ========================================================= */}
      <div
        style={{
          display: 'flex',
          gap: 16,
          flex: 1,
          minHeight: 0,
          alignItems: 'stretch',
        }}
      >
        {/* =======================================================
            MAP
        ======================================================= */}
        <Card
          style={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <CardHeader>
            <CardTitle icon={<IconMap size={15} />}>
              Maritime Surveillance Area — Arabian Sea Sector
            </CardTitle>

            <div
              style={{
                display: 'flex',
                gap: 8,
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              {[
                {
                  label: '● Oil Spill',
                  color: '#ff8c00',
                },
                {
                  label: '● Vessel',
                  color: '#00d4ff',
                },
                {
                  label: '● SAR Coverage',
                  color: '#1a3050',
                },
              ].map((item) => (
                <span
                  key={item.label}
                  style={{
                    fontSize: 10,
                    color: item.color,
                    fontFamily:
                      'JetBrains Mono, monospace',
                  }}
                >
                  {item.label}
                </span>
              ))}

              <Btn
                variant="ghost"
                style={{
                  fontSize: 10,
                  padding: '3px 8px',
                }}
              >
                Full Screen
              </Btn>
            </div>
          </CardHeader>

          {/* Map wrapper */}
          <div
            style={{
              height: 300,
              minHeight: 300,
              position: 'relative',
              background: '#030d1a',
              overflow: 'hidden',
            }}
          >
            <MapSVG
              showSpill
              showVessels
              showSatelliteFootprint
              width="100%"
              height="300px"
            />

            {/* Map layer controls */}
            <div
              style={{
                position: 'absolute',
                top: 12,
                left: 12,
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                zIndex: 5,
              }}
            >
              {[
                'Satellite Coverage',
                'Oil Spill Layer',
                'Vessel Tracks',
                'AIS Heatmap',
              ].map((label, index) => (
                <label
                  key={label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    cursor: 'pointer',
                    fontSize: 11,
                    color: '#8aaac8',
                    background: '#060f20dd',
                    padding: '4px 8px',
                    borderRadius: 4,
                    border: '1px solid #1a3050',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  <input
                    type="checkbox"
                    defaultChecked={index < 2}
                    style={{
                      accentColor: '#00d4ff',
                    }}
                  />
                  {label}
                </label>
              ))}
            </div>

            {/* Map controls */}
            <div
              style={{
                position: 'absolute',
                bottom: 12,
                right: 12,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                zIndex: 5,
              }}
            >
              {['+', '−', '⌖'].map((control) => (
                <button
                  key={control}
                  type="button"
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 6,
                    background: '#060f20',
                    border: '1px solid #1a3050',
                    color: '#8aaac8',
                    cursor: 'pointer',
                    fontSize: 14,
                  }}
                >
                  {control}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* =======================================================
            PRIORITY ALERTS
        ======================================================= */}
        <div
          style={{
            width: 320,
            minWidth: 280,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <Card
            style={{
              flex: 1,
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <CardHeader>
              <CardTitle icon={<IconAlert size={15} />}>
                Priority Alerts
              </CardTitle>

              <Badge variant="critical">
                7 Active
              </Badge>
            </CardHeader>

            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: 12,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              {ALERTS.map((alert) => (
                <div
                  key={alert.id}
                  style={{
                    padding: 12,
                    borderRadius: 6,
                    background:
                      hoveredAlert === alert.id
                        ? '#0a1e35'
                        : '#071526',
                    border: `1px solid ${
                      alert.severity === 'critical'
                        ? '#ff3b3b44'
                        : alert.severity === 'high'
                        ? '#ff8c0044'
                        : '#ffd70044'
                    }`,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={() =>
                    setHoveredAlert(alert.id)
                  }
                  onMouseLeave={() =>
                    setHoveredAlert(null)
                  }
                  onClick={() =>
                    onNavigate('incident')
                  }
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent:
                        'space-between',
                      marginBottom: 4,
                    }}
                  >
                    <Badge
                      variant={alert.severity}
                    >
                      {alert.severity}
                    </Badge>

                    <span
                      style={{
                        fontSize: 10,
                        color: '#4a6a8a',
                        fontFamily:
                          'JetBrains Mono, monospace',
                      }}
                    >
                      {alert.time}
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#e2eaf5',
                      marginBottom: 4,
                    }}
                  >
                    {alert.type}
                  </div>

                  <div
                    style={{
                      fontSize: 11,
                      color: '#6b8aaa',
                      marginBottom: 8,
                    }}
                  >
                    {alert.location}
                  </div>

                  <div
                    style={{
                      fontSize: 10,
                      color: '#506f8d',
                      marginBottom: 8,
                      lineHeight: 1.5,
                    }}
                  >
                    {alert.desc}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent:
                        'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        color: '#4a6a8a',
                        fontFamily:
                          'JetBrains Mono, monospace',
                      }}
                    >
                      Conf:{' '}
                      <span
                        style={{
                          color: '#00e57a',
                        }}
                      >
                        {alert.confidence !== null
                          ? `${alert.confidence}%`
                          : 'N/A'}
                      </span>
                    </span>

                    <Btn
                      variant="secondary"
                      style={{
                        fontSize: 10,
                        padding: '3px 8px',
                      }}
                      onClick={() =>
                        onNavigate('incident')
                      }
                    >
                      <IconEye size={11} />
                      View
                    </Btn>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* =========================================================
          RECENT INCIDENTS
      ========================================================= */}
      <Card>
        <CardHeader>
          <CardTitle icon={<IconReport size={15} />}>
            Recent Incidents
          </CardTitle>

          <Btn
            variant="outline"
            style={{
              fontSize: 11,
              padding: '4px 10px',
            }}
            onClick={() =>
              onNavigate('history')
            }
          >
            View All
            <IconChevronRight size={12} />
          </Btn>
        </CardHeader>

        <div
          style={{
            overflowX: 'auto',
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: 12,
              minWidth: 900,
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom:
                    '1px solid #1a3050',
                }}
              >
                {[
                  'Incident ID',
                  'Detected At',
                  'Location',
                  'Spill Size',
                  'Confidence',
                  'Suspected Vessel',
                  'Status',
                ].map((header) => (
                  <th
                    key={header}
                    style={{
                      padding: '10px 14px',
                      textAlign: 'left',
                      color: '#4a6a8a',
                      fontFamily:
                        'JetBrains Mono, monospace',
                      fontSize: 10,
                      letterSpacing: 1,
                      fontWeight: 600,
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {INCIDENTS.map((incident, index) => (
                <tr
                  key={incident.id}
                  style={{
                    borderBottom:
                      '1px solid #1a305033',
                    background:
                      index % 2 === 0
                        ? 'transparent'
                        : '#060f2033',
                    cursor: 'pointer',
                  }}
                  onClick={() =>
                    onNavigate('incident')
                  }
                >
                  <td
                    style={{
                      padding: '10px 14px',
                      color: '#00d4ff',
                      fontFamily:
                        'JetBrains Mono, monospace',
                      fontSize: 11,
                    }}
                  >
                    {incident.id}
                  </td>

                  <td
                    style={{
                      padding: '10px 14px',
                      color: '#8aaac8',
                      fontFamily:
                        'JetBrains Mono, monospace',
                      fontSize: 11,
                    }}
                  >
                    {incident.detected}
                  </td>

                  <td
                    style={{
                      padding: '10px 14px',
                      color: '#e2eaf5',
                    }}
                  >
                    {incident.location}
                  </td>

                  <td
                    style={{
                      padding: '10px 14px',
                      color: '#ff8c00',
                      fontFamily:
                        'JetBrains Mono, monospace',
                    }}
                  >
                    {incident.area}
                  </td>

                  <td
                    style={{
                      padding: '10px 14px',
                    }}
                  >
                    <span
                      style={{
                        color:
                          incident.conf > 85
                            ? '#00e57a'
                            : '#ffd700',
                        fontFamily:
                          'JetBrains Mono, monospace',
                        fontWeight: 700,
                      }}
                    >
                      {incident.conf}%
                    </span>
                  </td>

                  <td
                    style={{
                      padding: '10px 14px',
                      color:
                        incident.vessel === '—'
                          ? '#4a6a8a'
                          : '#e2eaf5',
                    }}
                  >
                    {incident.vessel}
                  </td>

                  <td
                    style={{
                      padding: '10px 14px',
                    }}
                  >
                    <Badge
                      variant={incident.status}
                    >
                      {incident.status.replace(
                        '-',
                        ' '
                      )}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* =========================================================
          M3 DATASET SCENE GALLERY
      ========================================================= */}
      <Card
        style={{
          marginTop: 0,
          padding: 0,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: 20,
            background: '#061525',
            border: '1px solid #12324a',
            borderRadius: 12,
          }}
        >
          {/* Gallery header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <div>
              <h3
                style={{
                  margin: 0,
                  color: '#00d9ff',
                  fontSize: 16,
                }}
              >
                M3 — Real Oil Spill Scenes
              </h3>

              <p
                style={{
                  margin: '5px 0 0',
                  color: '#7189a5',
                  fontSize: 12,
                }}
              >
                Satellite / AI detection dataset ·{' '}
                {M3_SCENE_IMAGES.length} scenes
              </p>
            </div>

            <span
              style={{
                color: '#00d9ff',
                fontSize: 13,
                fontFamily:
                  'JetBrains Mono, monospace',
              }}
            >
              {M3_SCENE_IMAGES.length} IMAGES
            </span>
          </div>

          {/* Dataset statistics */}
          <div
            style={{
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
              marginBottom: 16,
            }}
          >
            <div
              style={{
                padding: '8px 12px',
                background: '#020b14',
                border:
                  '1px solid #17344a',
                borderRadius: 6,
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: '#4a6a8a',
                  fontFamily:
                    'JetBrains Mono, monospace',
                }}
              >
                M3 SPILLS
              </div>

              <div
                style={{
                  marginTop: 2,
                  fontSize: 15,
                  color: '#ff8c00',
                  fontWeight: 700,
                }}
              >
                {M3_SPILL_COUNT}
              </div>
            </div>

            <div
              style={{
                padding: '8px 12px',
                background: '#020b14',
                border:
                  '1px solid #17344a',
                borderRadius: 6,
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: '#4a6a8a',
                  fontFamily:
                    'JetBrains Mono, monospace',
                }}
              >
                UNIQUE SCENES
              </div>

              <div
                style={{
                  marginTop: 2,
                  fontSize: 15,
                  color: '#00d9ff',
                  fontWeight: 700,
                }}
              >
                {M3_SCENE_COUNT}
              </div>
            </div>

            <div
              style={{
                padding: '8px 12px',
                background: '#020b14',
                border:
                  '1px solid #17344a',
                borderRadius: 6,
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: '#4a6a8a',
                  fontFamily:
                    'JetBrains Mono, monospace',
                }}
              >
                TOTAL PIXEL AREA
              </div>

              <div
                style={{
                  marginTop: 2,
                  fontSize: 15,
                  color: '#ffd700',
                  fontWeight: 700,
                }}
              >
                {M3_TOTAL_AREA_PIXELS.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Scene grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fill, minmax(150px, 1fr))',
              gap: 10,
            }}
          >
            {M3_SCENE_IMAGES.map(
              (imageName, index) => (
                <div
                  key={imageName}
                  style={{
                    background: '#020b14',
                    border:
                      '1px solid #17344a',
                    borderRadius: 8,
                    overflow: 'hidden',
                    transition:
                      'border-color 0.15s, transform 0.15s',
                  }}
                >
                  {/* Scene image */}
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      aspectRatio: '1 / 1',
                      background: '#030d1a',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={`/m3-images/${imageName}`}
                      alt={`M3 oil spill scene ${imageName}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        display: 'block',
                        background: '#030d1a',
                      }}
                    />

                    {/* Scene number */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 6,
                        left: 6,
                        padding:
                          '3px 6px',
                        borderRadius: 4,
                        background:
                          '#030d1add',
                        border:
                          '1px solid #00d4ff55',
                        color: '#00d4ff',
                        fontSize: 9,
                        fontFamily:
                          'JetBrains Mono, monospace',
                      }}
                    >
                      M3-{String(index + 1).padStart(
                        2,
                        '0'
                      )}
                    </div>
                  </div>

                  {/* File name */}
                  <div
                    style={{
                      padding:
                        '7px 8px',
                      color: '#7fa1bd',
                      fontSize: 10,
                      fontFamily:
                        'JetBrains Mono, monospace',
                      whiteSpace:
                        'nowrap',
                      overflow: 'hidden',
                      textOverflow:
                        'ellipsis',
                    }}
                    title={imageName}
                  >
                    {imageName}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}