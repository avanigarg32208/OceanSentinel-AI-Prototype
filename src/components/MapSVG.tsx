import React from 'react';
import { m3Spills } from '../data/m3Spills';

interface MapSVGProps {
  width?: number | string;
  height?: number | string;
  showSpill?: boolean;
  showVessels?: boolean;
  showTracks?: boolean;
  showRadius?: boolean;
  showSatelliteFootprint?: boolean;
  highlightVessel?: number;
  style?: React.CSSProperties;
}

const VESSELS = [
  { id: 1, x: 495, y: 275, name: 'MV Ocean Star', mmsi: '419000001', color: '#ff3b3b' },
  { id: 2, x: 470, y: 310, name: 'MV Blue Horizon', mmsi: '419000002', color: '#ffd700' },
  { id: 3, x: 555, y: 325, name: 'MV Sea Guardian', mmsi: '419000003', color: '#8aaac8' },
  { id: 4, x: 580, y: 255, name: 'MV Sunrise', mmsi: '419000004', color: '#4a6a8a' },
];

const TRACKS = [
  [{ x: 430, y: 230 }, { x: 460, y: 255 }, { x: 490, y: 272 }, { x: 495, y: 275 }, { x: 510, y: 285 }, { x: 530, y: 300 }],
  [{ x: 400, y: 340 }, { x: 430, y: 330 }, { x: 455, y: 318 }, { x: 470, y: 310 }, { x: 490, y: 300 }],
  [{ x: 600, y: 280 }, { x: 580, y: 300 }, { x: 565, y: 315 }, { x: 555, y: 325 }, { x: 545, y: 335 }],
  [{ x: 620, y: 220 }, { x: 600, y: 235 }, { x: 585, y: 248 }, { x: 580, y: 255 }, { x: 570, y: 265 }],
];

const TRACK_COLORS = ['#ff3b3b', '#ffd700', '#8aaac8', '#4a6a8a'];

/*
 * M3 contains bounding boxes in 640x640 image coordinates.
 * We convert the center of each bounding box into the 800x500
 * SVG coordinate system.
 *
 * IMPORTANT:
 * These are IMAGE-SPACE positions, NOT latitude/longitude.
 */
const M3_DETECTIONS = m3Spills.map((spill) => {
  const centerX = (spill.bbox_xmin + spill.bbox_xmax) / 2;
  const centerY = (spill.bbox_ymin + spill.bbox_ymax) / 2;

  return {
    id: spill.spill_id,
    x: (centerX / spill.image_width) * 800,
    y: (centerY / spill.image_height) * 500,
    area: spill.bbox_area_pixels,
    imageName: spill.image_name,
    objectIndex: spill.object_index,
  };
});

function ptPath(pts: { x: number; y: number }[]) {
  return pts
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');
}

export default function MapSVG({
  width = '100%',
  height = '100%',
  showSpill = true,
  showVessels = true,
  showTracks = false,
  showRadius = false,
  showSatelliteFootprint = false,
  highlightVessel,
  style,
}: MapSVGProps) {
  return (
    <svg
      viewBox="0 0 800 500"
      width={width}
      height={height}
      style={{ display: 'block', ...style }}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <radialGradient id="oceanGrad" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#071e3d" />
          <stop offset="100%" stopColor="#030d1a" />
        </radialGradient>

        <radialGradient id="radiusGrad" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
        </radialGradient>

        <filter id="spillBlur">
          <feGaussianBlur stdDeviation="3" />
        </filter>

        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Ocean background */}
      <rect width="800" height="500" fill="url(#oceanGrad)" />

      {/* Ocean depth contours */}
      {[1, 2, 3].map((i) => (
        <ellipse
          key={i}
          cx="400"
          cy="250"
          rx={180 + i * 60}
          ry={120 + i * 40}
          fill="none"
          stroke="#0d2744"
          strokeWidth="1"
          opacity={0.5 - i * 0.1}
        />
      ))}

      {/* Grid */}
      {[0, 100, 200, 300, 400, 500, 600, 700, 800].map((x) => (
        <line
          key={`gx${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={500}
          stroke="#0d2744"
          strokeWidth="0.5"
        />
      ))}

      {[0, 100, 200, 300, 400, 500].map((y) => (
        <line
          key={`gy${y}`}
          x1={0}
          y1={y}
          x2={800}
          y2={y}
          stroke="#0d2744"
          strokeWidth="0.5"
        />
      ))}

      {/* M3 image-space label */}
      <g transform="translate(20, 20)">
        <rect
          x="0"
          y="0"
          width="205"
          height="48"
          rx="5"
          fill="#060f20"
          stroke="#00d4ff"
          strokeWidth="1"
          opacity="0.95"
        />

        <text
          x="12"
          y="19"
          fill="#00d4ff"
          fontSize="11"
          fontFamily="JetBrains Mono, monospace"
          fontWeight="600"
        >
          M3 OIL DETECTIONS
        </text>

        <text
          x="12"
          y="36"
          fill="#8aaac8"
          fontSize="9"
          fontFamily="JetBrains Mono, monospace"
        >
          {M3_DETECTIONS.length} objects • IMAGE SPACE
        </text>
      </g>

      {/* Satellite footprint */}
      {showSatelliteFootprint && (
        <rect
          x="300"
          y="140"
          width="350"
          height="230"
          rx="8"
          fill="#00d4ff04"
          stroke="#00d4ff"
          strokeWidth="1"
          strokeDasharray="6 4"
          opacity="0.5"
        />
      )}

      {/* Investigation radius */}
      {showRadius && (
        <>
          <circle
            cx="400"
            cy="250"
            r="80"
            fill="url(#radiusGrad)"
            stroke="#00d4ff"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.5"
          />

          <circle
            cx="400"
            cy="250"
            r="40"
            fill="none"
            stroke="#00d4ff"
            strokeWidth="0.5"
            strokeDasharray="2 3"
            opacity="0.3"
          />
        </>
      )}

      {/* Vessel tracks */}
      {showTracks &&
        TRACKS.map((track, i) => {
          const isHighlighted =
            highlightVessel === undefined || highlightVessel === i + 1;

          return (
            <path
              key={i}
              d={ptPath(track)}
              fill="none"
              stroke={TRACK_COLORS[i]}
              strokeWidth={highlightVessel === i + 1 ? 2.5 : 1.5}
              strokeDasharray={i > 0 ? '5 3' : undefined}
              opacity={isHighlighted ? 0.85 : 0.25}
            />
          );
        })}

      {/* Track arrows */}
      {showTracks &&
        TRACKS.map((track, i) => {
          const end = track[track.length - 1];
          const prev = track[track.length - 2];

          const dx = end.x - prev.x;
          const dy = end.y - prev.y;
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);

          return (
            <polygon
              key={`arr${i}`}
              points="0,-4 8,0 0,4"
              fill={TRACK_COLORS[i]}
              opacity={
                highlightVessel === undefined || highlightVessel === i + 1
                  ? 0.8
                  : 0.2
              }
              transform={`translate(${end.x},${end.y}) rotate(${angle})`}
            />
          );
        })}

      {/* ========================================================= */}
      {/* REAL M3 SPILL DETECTIONS                                  */}
      {/* ========================================================= */}

      {showSpill &&
        M3_DETECTIONS.map((spill, index) => (
          <g key={spill.id}>
            {/* Detection glow */}
            <circle
              cx={spill.x}
              cy={spill.y}
              r="12"
              fill="#ff8c00"
              opacity="0.12"
              filter="url(#spillBlur)"
            />

            {/* Detection marker */}
            <circle
              cx={spill.x}
              cy={spill.y}
              r="5"
              fill="#ff8c00"
              stroke="#ff3b3b"
              strokeWidth="1.5"
            />

            {/* Detection number */}
            <text
              x={spill.x + 9}
              y={spill.y - 7}
              fill="#ff8c00"
              fontSize="8"
              fontFamily="JetBrains Mono, monospace"
              fontWeight="600"
            >
              M3-{String(index + 1).padStart(2, '0')}
            </text>

            {/* Details for first few detections */}
            {index < 4 && (
              <g transform={`translate(${spill.x + 9}, ${spill.y + 4})`}>
                <rect
                  x="0"
                  y="0"
                  width="145"
                  height="34"
                  rx="3"
                  fill="#060f20"
                  stroke="#ff8c00"
                  strokeWidth="0.7"
                  opacity="0.92"
                />

                <text
                  x="6"
                  y="12"
                  fill="#ff8c00"
                  fontSize="8"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {spill.id}
                </text>

                <text
                  x="6"
                  y="24"
                  fill="#8aaac8"
                  fontSize="7"
                  fontFamily="JetBrains Mono, monospace"
                >
                  BBox: {spill.area.toLocaleString()} px²
                </text>
              </g>
            )}
          </g>
        ))}

      {/* Vessel markers */}
      {showVessels &&
        VESSELS.map((v) => {
          const isHighlighted = highlightVessel === v.id;
          const isFirst = v.id === 1;

          return (
            <g
              key={v.id}
              transform={`translate(${v.x},${v.y})`}
              filter={
                isHighlighted || isFirst ? 'url(#glow)' : undefined
              }
            >
              {isFirst && (
                <circle
                  cx={0}
                  cy={0}
                  r={12}
                  fill="none"
                  stroke="#ff3b3b"
                  strokeWidth="1.5"
                  opacity="0.5"
                >
                  <animate
                    attributeName="r"
                    values="12;20;12"
                    dur="2s"
                    repeatCount="indefinite"
                  />

                  <animate
                    attributeName="opacity"
                    values="0.5;0;0.5"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}

              <polygon
                points="0,-6 5,4 0,2 -5,4"
                fill={v.color}
                opacity={
                  isHighlighted || !highlightVessel ? 1 : 0.4
                }
              />

              <text
                x={8}
                y={-8}
                fill={v.color}
                fontSize="9"
                fontFamily="JetBrains Mono, monospace"
                opacity={
                  isHighlighted || !highlightVessel ? 1 : 0.4
                }
              >
                {v.name.replace('MV ', '')}
              </text>
            </g>
          );
        })}

      {/* Bottom status */}
      <g transform="translate(20, 465)">
        <rect
          x="0"
          y="-20"
          width="250"
          height="28"
          rx="4"
          fill="#060f20"
          stroke="#264870"
          strokeWidth="1"
          opacity="0.9"
        />

        <circle
          cx="12"
          cy="-6"
          r="4"
          fill="#ff8c00"
        />

        <text
          x="22"
          y="-3"
          fill="#8aaac8"
          fontSize="8"
          fontFamily="JetBrains Mono, monospace"
        >
          M3 DATASET • GEOLOCATION UNAVAILABLE
        </text>
      </g>

      {/* North arrow - visual orientation only */}
      <g transform="translate(760, 40)">
        <polygon
          points="0,-12 5,8 0,4 -5,8"
          fill="#264870"
        />

        <text
          x={0}
          y={20}
          fill="#264870"
          fontSize="9"
          fontFamily="JetBrains Mono, monospace"
          textAnchor="middle"
        >
          N
        </text>
      </g>
    </svg>
  );
}