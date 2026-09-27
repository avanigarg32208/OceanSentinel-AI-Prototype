import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  Badge,
  Btn,
  StatRow,
  ConfidenceBar,
} from '../components/UI';

import {
  IconMap,
  IconAIS,
  IconDownload,
  IconTarget,
} from '../components/Icons';

import type { Screen } from '../types';

interface Props {
  onNavigate: (s: Screen) => void;
}

interface SpillInfo {
  image: string;
  confidence: number;
  latitude: number;
  longitude: number;
  area: number;
}

export default function Geolocation({ onNavigate }: Props) {
  const [spill, setSpill] = useState<SpillInfo>({
    image: 'class_1_00001.jpg',
    confidence: 98,
    latitude: 14.671,
    longitude: 68.697,
    area: 9.91,
  });

  useEffect(() => {
    const savedImage = localStorage.getItem(
      'oceansentinel_selected_image'
    );

    if (savedImage) {
      setSpill((previous) => ({
        ...previous,
        image: savedImage,
      }));
    }
  }, []);

  return (
    <div
      style={{
        height: '100%',
        overflowY: 'auto',
        padding: 20,
        boxSizing: 'border-box',
        background: '#020b16',
      }}
    >
      {/* HEADER */}
      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: '#e2eaf5',
              fontFamily: 'Rajdhani, sans-serif',
            }}
          >
            Spill Geolocation
          </div>

          <div
            style={{
              marginTop: 4,
              fontSize: 12,
              color: '#53799c',
            }}
          >
            Satellite-derived spill position and investigation zone
          </div>
        </div>

        <Badge variant="medium">
          INVESTIGATION ZONE ACTIVE
        </Badge>
      </div>

      {/* IMAGE + LOCATION */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          marginBottom: 16,
        }}
      >
        {/* DETECTED IMAGE */}
        <Card style={{ overflow: 'hidden' }}>
          <CardHeader>
            <CardTitle icon={<IconMap size={15} />}>
              Detected Spill Image
            </CardTitle>

            <span
              style={{
                fontSize: 10,
                color: '#4a6a8a',
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              {spill.image}
            </span>
          </CardHeader>

          <div
            style={{
              height: 420,
              background: '#000914',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 12,
            }}
          >
            <img
              src={`/aaaaaa-results/${encodeURIComponent(
                spill.image
              )}`}
              alt="Detected oil spill"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                borderRadius: 6,
              }}
              onError={(e) => {
                const target = e.currentTarget;

                if (
                  target.src.includes('/aaaaaa-results/')
                ) {
                  target.src = `/m3-images/${encodeURIComponent(
                    spill.image
                  )}`;
                }
              }}
            />
          </div>
        </Card>

        {/* LOCATION */}
        <Card style={{ overflow: 'hidden' }}>
          <CardHeader>
            <CardTitle icon={<IconTarget size={15} />}>
              Spill Location
            </CardTitle>

            <Badge variant="critical">
              OIL SPILL DETECTED
            </Badge>
          </CardHeader>

          <div style={{ padding: 16 }}>
            {/* COORDINATES */}
            <div
              style={{
                background: '#081b30',
                border: '1px solid #173452',
                borderRadius: 8,
                padding: 20,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontSize: 10,
                      color: '#52799b',
                      fontFamily: 'JetBrains Mono, monospace',
                      letterSpacing: 1,
                    }}
                  >
                    LATITUDE
                  </div>

                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 700,
                      color: '#00d4ff',
                      fontFamily: 'Rajdhani, sans-serif',
                      marginTop: 5,
                    }}
                  >
                    {spill.latitude.toFixed(4)}°
                  </div>

                  <div
                    style={{
                      color: '#6b8aaa',
                      fontSize: 11,
                    }}
                  >
                    N
                  </div>
                </div>

                <div
                  style={{
                    width: 1,
                    background: '#1a3050',
                  }}
                />

                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontSize: 10,
                      color: '#52799b',
                      fontFamily: 'JetBrains Mono, monospace',
                      letterSpacing: 1,
                    }}
                  >
                    LONGITUDE
                  </div>

                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 700,
                      color: '#00d4ff',
                      fontFamily: 'Rajdhani, sans-serif',
                      marginTop: 5,
                    }}
                  >
                    {spill.longitude.toFixed(4)}°
                  </div>

                  <div
                    style={{
                      color: '#6b8aaa',
                      fontSize: 11,
                    }}
                  >
                    E
                  </div>
                </div>
              </div>
            </div>

            <ConfidenceBar
              value={spill.confidence}
              color="#00d4ff"
            />

            <div style={{ height: 15 }} />

            <StatRow
              label="Detection"
              value="OIL SPILL"
            />

            <StatRow
              label="AI Confidence"
              value={`${spill.confidence}%`}
              mono
            />

            <StatRow
              label="Estimated Area"
              value={`${spill.area.toFixed(2)} km²`}
              mono
            />

            <StatRow
              label="Source"
              value="Sentinel-1 SAR"
            />

            <StatRow
              label="AI Model"
              value="YOLO / M3"
            />

            <StatRow
              label="Geolocation"
              value="SAR Geocoding"
            />

            <StatRow
              label="Coordinate System"
              value="WGS84 / EPSG:4326"
              mono
            />

            <StatRow
              label="Investigation Radius"
              value="25 km"
              mono
            />

            <div
              style={{
                display: 'flex',
                gap: 8,
                marginTop: 18,
              }}
            >
              <Btn
                variant="primary"
                icon={<IconAIS size={14} />}
                onClick={() => onNavigate('ais')}
              >
                Correlate AIS
              </Btn>

              <Btn
                variant="outline"
                icon={<IconDownload size={14} />}
              >
                Export
              </Btn>
            </div>
          </div>
        </Card>
      </div>

      {/* INVESTIGATION MAP */}
      <Card style={{ overflow: 'hidden' }}>
        <CardHeader>
          <CardTitle icon={<IconMap size={15} />}>
            Investigation Zone — Arabian Sea
          </CardTitle>

          <Badge variant="medium">
            25 KM RADIUS
          </Badge>
        </CardHeader>

        <div
          style={{
            height: 390,
            position: 'relative',
            background:
              'radial-gradient(circle at 50% 50%, #0b2940 0%, #03111f 45%, #020914 100%)',
            overflow: 'hidden',
          }}
        >
          {/* GRID */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'linear-gradient(#12405a33 1px, transparent 1px), linear-gradient(90deg, #12405a33 1px, transparent 1px)',
              backgroundSize: '55px 55px',
            }}
          />

          {/* RADIUS */}
          <div
            style={{
              position: 'absolute',
              width: 230,
              height: 230,
              borderRadius: '50%',
              border: '2px solid #00d4ff',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              boxShadow:
                '0 0 35px #00d4ff55, inset 0 0 30px #00d4ff22',
            }}
          />

          {/* SPILL LOCATION */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: '#ff8c00',
              boxShadow:
                '0 0 10px #ff8c00, 0 0 35px #ff8c00aa',
            }}
          />

          {/* LABEL */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(25px, -55px)',
              background: '#061426',
              border: '1px solid #ff8c00',
              borderRadius: 5,
              padding: '8px 12px',
            }}
          >
            <div
              style={{
                color: '#ff9d00',
                fontSize: 11,
                fontFamily: 'JetBrains Mono, monospace',
                fontWeight: 700,
              }}
            >
              OIL SPILL
            </div>

            <div
              style={{
                color: '#8aaac8',
                fontSize: 10,
                marginTop: 3,
              }}
            >
              {spill.latitude.toFixed(4)}° N
              {'  '}
              {spill.longitude.toFixed(4)}° E
            </div>
          </div>

          {/* NEARBY VESSELS */}
          {[
            {
              name: 'MV Ocean Star',
              left: '36%',
              top: '42%',
              distance: '3.2 km',
            },
            {
              name: 'MV Blue Horizon',
              left: '64%',
              top: '55%',
              distance: '7.8 km',
            },
            {
              name: 'MV Sea Guardian',
              left: '70%',
              top: '37%',
              distance: '14.2 km',
            },
          ].map((v) => (
            <div
              key={v.name}
              style={{
                position: 'absolute',
                left: v.left,
                top: v.top,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  background: '#ffd700',
                  transform: 'rotate(45deg)',
                  boxShadow:
                    '0 0 12px #ffd700',
                }}
              />

              <div
                style={{
                  marginTop: 7,
                  whiteSpace: 'nowrap',
                  fontSize: 10,
                  color: '#ffd700',
                  fontFamily:
                    'JetBrains Mono, monospace',
                }}
              >
                {v.name}
              </div>

              <div
                style={{
                  fontSize: 9,
                  color: '#5e7f9e',
                  textAlign: 'center',
                }}
              >
                {v.distance}
              </div>
            </div>
          ))}

          {/* MAP INFO */}
          <div
            style={{
              position: 'absolute',
              left: 16,
              top: 16,
              background: '#061426dd',
              border: '1px solid #00d4ff',
              borderRadius: 6,
              padding: '10px 14px',
            }}
          >
            <div
              style={{
                color: '#00d4ff',
                fontSize: 11,
                fontFamily:
                  'JetBrains Mono, monospace',
                fontWeight: 700,
              }}
            >
              M3 OIL DETECTION
            </div>

            <div
              style={{
                color: '#6f94b4',
                fontSize: 10,
                marginTop: 4,
              }}
            >
              Arabian Sea • Sentinel-1 SAR
            </div>
          </div>

          {/* LEGEND */}
          <div
            style={{
              position: 'absolute',
              right: 16,
              top: 16,
              background: '#061426dd',
              border: '1px solid #1a3050',
              borderRadius: 6,
              padding: 12,
            }}
          >
            <div
              style={{
                color: '#52799b',
                fontSize: 9,
                letterSpacing: 1,
                marginBottom: 8,
                fontFamily:
                  'JetBrains Mono, monospace',
              }}
            >
              LEGEND
            </div>

            <div
              style={{
                color: '#ff8c00',
                fontSize: 10,
                marginBottom: 5,
              }}
            >
              ● Oil Spill
            </div>

            <div
              style={{
                color: '#00d4ff',
                fontSize: 10,
                marginBottom: 5,
              }}
            >
              ○ 25km Radius
            </div>

            <div
              style={{
                color: '#ffd700',
                fontSize: 10,
              }}
            >
              ◆ Nearby Vessel
            </div>
          </div>
        </div>
      </Card>

      {/* VESSEL PANEL */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(3, 1fr)',
          gap: 12,
          marginTop: 16,
        }}
      >
        {[
          {
            name: 'MV Ocean Star',
            mmsi: '419000001',
            distance: '3.2 km',
            status: 'HIGH PRIORITY',
          },
          {
            name: 'MV Blue Horizon',
            mmsi: '419000002',
            distance: '7.8 km',
            status: 'INVESTIGATING',
          },
          {
            name: 'MV Sea Guardian',
            mmsi: '419000003',
            distance: '14.2 km',
            status: 'MONITORING',
          },
        ].map((v) => (
          <Card key={v.mmsi} style={{ padding: 15 }}>
            <div
              style={{
                color: '#e2eaf5',
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              {v.name}
            </div>

            <div
              style={{
                color: '#4a6a8a',
                fontSize: 10,
                fontFamily:
                  'JetBrains Mono, monospace',
                marginTop: 4,
              }}
            >
              MMSI: {v.mmsi}
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 12,
              }}
            >
              <span
                style={{
                  color: '#6e91b0',
                  fontSize: 11,
                }}
              >
                Distance
              </span>

              <span
                style={{
                  color: '#00d4ff',
                  fontSize: 12,
                  fontFamily:
                    'JetBrains Mono, monospace',
                }}
              >
                {v.distance}
              </span>
            </div>

            <div
              style={{
                marginTop: 8,
                color:
                  v.status === 'HIGH PRIORITY'
                    ? '#ff4d4d'
                    : '#ffd700',
                fontSize: 10,
                fontFamily:
                  'JetBrains Mono, monospace',
              }}
            >
              {v.status}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}