import React, { useEffect, useMemo, useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  Badge,
  Btn,
  StatRow,
} from '../components/UI';
import MapSVG from '../components/MapSVG';
import { IconAIS, IconShip } from '../components/Icons';
import type { Screen } from '../types';

type CorrelationMode =
  | 'TIME_AND_DISTANCE'
  | 'TEMPORAL_ONLY';

interface VesselCandidate {
  spill_id: string;
  image_name: string;
  spill_timestamp_utc: string;
  mmsi: string;
  ais_timestamp_utc: string;
  ais_latitude: number | null;
  ais_longitude: number | null;
  sog: number | null;
  cog: number | null;
  time_difference_minutes: number;
  distance_km: number | null;
  temporal_score: number;
  spatial_score: number;
  correlation_score: number;
  correlation_mode: CorrelationMode;
  rank: number;
}

interface CorrelationSummary {
  module: string;
  spill_records: number;
  ais_records: number;
  candidate_records: number;
  time_window_minutes: number;
  geolocated_spill_records: number;
  correlation_modes: Record<string, number>;
}

interface Props {
  onNavigate: (s: Screen) => void;
}

const PRIORITY_COLORS: Record<string, string> = {
  critical: '#ff3b3b',
  high: '#ff8c00',
  medium: '#ffd700',
};

function getSeverity(
  score: number
): 'critical' | 'high' | 'medium' {
  if (score >= 0.8) return 'critical';
  if (score >= 0.5) return 'high';
  return 'medium';
}

function getPriority(score: number): string {
  if (score >= 0.8) return 'HIGH PRIORITY';
  if (score >= 0.5) return 'MEDIUM PRIORITY';
  return 'LOW PRIORITY';
}

function formatScore(score: number): string {
  if (!Number.isFinite(score)) return 'N/A';

  return `${Math.round(score * 100)}%`;
}

function formatDistance(
  distance: number | null
): string {
  if (
    distance === null ||
    !Number.isFinite(distance)
  ) {
    return 'N/A';
  }

  return `${distance.toFixed(2)} km`;
}

function formatTime(minutes: number): string {
  if (!Number.isFinite(minutes)) {
    return 'N/A';
  }

  if (minutes < 1) {
    return `${Math.round(minutes * 60)} sec`;
  }

  return `${minutes.toFixed(1)} min`;
}

function formatTimestamp(
  timestamp: string
): string {
  if (!timestamp) return 'N/A';

  return timestamp
    .replace('T', ' ')
    .replace('+00:00', ' UTC');
}

function parseNullableNumber(
  value: string | undefined
): number | null {
  if (
    value === undefined ||
    value.trim() === '' ||
    value === 'None' ||
    value === 'null' ||
    value === 'undefined'
  ) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : null;
}

/**
 * Converts CSV text into typed correlation modes.
 *
 * This explicit return type fixes the TypeScript issue where
 * row.correlation_mode was inferred as a generic string.
 */
function parseCorrelationMode(
  value: string | undefined
): CorrelationMode {
  if (
    value?.trim() ===
    'TIME_AND_DISTANCE'
  ) {
    return 'TIME_AND_DISTANCE';
  }

  return 'TEMPORAL_ONLY';
}

/**
 * Small CSV parser.
 *
 * Handles normal comma-separated CSV and quoted fields.
 */
function parseCSV(
  text: string
): Record<string, string>[] {
  const rows: string[][] = [];

  let row: string[] = [];
  let field = '';
  let insideQuotes = false;

  for (
    let i = 0;
    i < text.length;
    i += 1
  ) {
    const char = text[i];
    const next = text[i + 1];

    if (
      char === '"' &&
      insideQuotes &&
      next === '"'
    ) {
      field += '"';
      i += 1;
      continue;
    }

    if (char === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (
      char === ',' &&
      !insideQuotes
    ) {
      row.push(field);
      field = '';
      continue;
    }

    if (
      (char === '\n' ||
        char === '\r') &&
      !insideQuotes
    ) {
      if (
        char === '\r' &&
        next === '\n'
      ) {
        i += 1;
      }

      row.push(field);
      field = '';

      if (
        row.some(
          (value) =>
            value.trim() !== ''
        )
      ) {
        rows.push(row);
      }

      row = [];
      continue;
    }

    field += char;
  }

  if (
    field.length > 0 ||
    row.length > 0
  ) {
    row.push(field);

    if (
      row.some(
        (value) =>
          value.trim() !== ''
      )
    ) {
      rows.push(row);
    }
  }

  if (rows.length < 2) {
    return [];
  }

  const headers = rows[0].map(
    (header) => header.trim()
  );

  return rows.slice(1).map(
    (values) => {
      const result: Record<
        string,
        string
      > = {};

      headers.forEach(
        (header, index) => {
          result[header] =
            values[index]?.trim() ??
            '';
        }
      );

      return result;
    }
  );
}

export default function AISCorrelation({
  onNavigate,
}: Props) {
  const [candidates, setCandidates] =
    useState<VesselCandidate[]>([]);

  const [summary, setSummary] =
    useState<CorrelationSummary | null>(
      null
    );

  const [selectedVessel, setSelectedVessel] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadCorrelationData() {
      try {
        setLoading(true);
        setError(null);

        const [
          candidateResponse,
          summaryResponse,
        ] = await Promise.all([
          fetch('/vessel_candidates.csv'),
          fetch('/correlation_summary.json'),
        ]);

        if (!candidateResponse.ok) {
          throw new Error(
            'Unable to load vessel_candidates.csv'
          );
        }

        if (!summaryResponse.ok) {
          throw new Error(
            'Unable to load correlation_summary.json'
          );
        }

        const csvText =
          await candidateResponse.text();

        const summaryData =
          (await summaryResponse.json()) as CorrelationSummary;

        const rows =
          parseCSV(csvText);

        const parsed: VesselCandidate[] =
          rows
            .map((row): VesselCandidate => ({
              spill_id:
                row.spill_id ?? '',

              image_name:
                row.image_name ?? '',

              spill_timestamp_utc:
                row.spill_timestamp_utc ??
                '',

              mmsi:
                row.mmsi ?? '',

              ais_timestamp_utc:
                row.ais_timestamp_utc ??
                '',

              ais_latitude:
                parseNullableNumber(
                  row.ais_latitude
                ),

              ais_longitude:
                parseNullableNumber(
                  row.ais_longitude
                ),

              sog:
                parseNullableNumber(
                  row.sog
                ),

              cog:
                parseNullableNumber(
                  row.cog
                ),

              time_difference_minutes:
                Number(
                  row.time_difference_minutes
                ),

              distance_km:
                parseNullableNumber(
                  row.distance_km
                ),

              temporal_score:
                Number(
                  row.temporal_score
                ),

              spatial_score:
                Number(
                  row.spatial_score
                ),

              correlation_score:
                Number(
                  row.correlation_score
                ),

              correlation_mode:
                parseCorrelationMode(
                  row.correlation_mode
                ),

              rank:
                Number(row.rank),
            }))
            .filter(
              (
                candidate
              ) =>
                candidate.spill_id &&
                candidate.mmsi &&
                Number.isFinite(
                  candidate.correlation_score
                )
            );

        setCandidates(parsed);
        setSummary(summaryData);

        if (parsed.length > 0) {
          setSelectedVessel(
            parsed[0].mmsi
          );
        }
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load correlation data'
        );
      } finally {
        setLoading(false);
      }
    }

    loadCorrelationData();
  }, []);

  /*
   * The generated M4 output is ordered by spill_id.
   * We use the first spill represented in the
   * candidate file as the active spill.
   */
  const activeSpillId =
    candidates[0]?.spill_id ??
    null;

  const rankedCandidates =
    useMemo(() => {
      if (!activeSpillId) {
        return [];
      }

      return candidates
        .filter(
          (candidate) =>
            candidate.spill_id ===
            activeSpillId
        )
        .sort(
          (a, b) =>
            a.rank - b.rank
        );
    }, [
      candidates,
      activeSpillId,
    ]);

  const selected =
    rankedCandidates.find(
      (candidate) =>
        candidate.mmsi ===
        selectedVessel
    );

  const selectedColor = selected
    ? PRIORITY_COLORS[
        getSeverity(
          selected.correlation_score
        )
      ]
    : '#00d4ff';

  const temporalOnlyCount =
    summary?.correlation_modes
      ?.TEMPORAL_ONLY ?? 0;

  const spatialCorrelationCount =
    summary?.correlation_modes
      ?.TIME_AND_DISTANCE ?? 0;

  return (
    <div
      style={{
        display: 'flex',
        gap: 16,
        padding: 20,
        height: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* ========================= */}
      {/* LEFT SIDE */}
      {/* ========================= */}

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          minWidth: 0,
        }}
      >
        {/* MAP */}

        <Card
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <CardHeader>
            <CardTitle
              icon={
                <IconAIS size={15} />
              }
            >
              AIS Vessel Track Correlation Map
            </CardTitle>

            <div
              style={{
                fontSize: 10,
                color: '#6b8aaa',
                fontFamily:
                  'JetBrains Mono, monospace',
              }}
            >
              M4 BACKEND WINDOW:{' '}
              {summary
                ? `${summary.time_window_minutes} MIN`
                : '...'}
            </div>
          </CardHeader>

          <div
            style={{
              flex: 1,
              position: 'relative',
              background: '#030d1a',
            }}
          >
            <MapSVG
              showSpill
              showVessels
              showTracks
              showRadius
              highlightVessel={
                selected?.rank ?? 1
              }
              style={{
                width: '100%',
                height: '100%',
              }}
            />

            {/* CANDIDATE LEGEND */}

            <div
              style={{
                position: 'absolute',
                top: 12,
                left: 12,
                background:
                  '#060f20dd',
                border:
                  '1px solid #1a3050',
                borderRadius: 6,
                padding:
                  '10px 14px',
                minWidth: 220,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: '#4a6a8a',
                  fontFamily:
                    'JetBrains Mono, monospace',
                  letterSpacing: 1,
                  marginBottom: 8,
                }}
              >
                M4 VESSEL CANDIDATES
              </div>

              {rankedCandidates.length ===
              0 ? (
                <div
                  style={{
                    fontSize: 11,
                    color: '#6b8aaa',
                  }}
                >
                  No candidates available
                </div>
              ) : (
                rankedCandidates
                  .slice(0, 5)
                  .map((v) => {
                    const severity =
                      getSeverity(
                        v.correlation_score
                      );

                    const color =
                      PRIORITY_COLORS[
                        severity
                      ];

                    return (
                      <div
                        key={`${v.spill_id}-${v.mmsi}`}
                        style={{
                          display:
                            'flex',
                          alignItems:
                            'center',
                          gap: 8,
                          marginBottom: 6,
                          cursor:
                            'pointer',
                        }}
                        onClick={() =>
                          setSelectedVessel(
                            v.mmsi
                          )
                        }
                      >
                        <div
                          style={{
                            width: 20,
                            height: 2,
                            background:
                              color,
                            borderRadius: 1,
                          }}
                        />

                        <span
                          style={{
                            fontSize: 11,
                            color:
                              selectedVessel ===
                              v.mmsi
                                ? '#e2eaf5'
                                : '#8aaac8',
                          }}
                        >
                          MMSI {v.mmsi}
                        </span>

                        <span
                          style={{
                            fontSize: 10,
                            color,
                            fontFamily:
                              'JetBrains Mono, monospace',
                            marginLeft:
                              'auto',
                          }}
                        >
                          {formatScore(
                            v.correlation_score
                          )}
                        </span>
                      </div>
                    );
                  })
              )}
            </div>

            {/* CURRENT MODE */}

            <div
              style={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                background:
                  '#060f20dd',
                border:
                  '1px solid #00d4ff33',
                borderRadius: 5,
                padding:
                  '7px 11px',
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: '#00d4ff',
                  fontFamily:
                    'JetBrains Mono, monospace',
                }}
              >
                WINDOW: ±
                {summary?.time_window_minutes ??
                  'N/A'} MIN
              </div>

              <div
                style={{
                  fontSize: 9,
                  color: '#6b8aaa',
                  marginTop: 3,
                }}
              >
                Backend-generated M4 correlation
              </div>
            </div>
          </div>
        </Card>

        {/* METHODOLOGY */}

        <Card
          style={{
            padding: 16,
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: '#4a6a8a',
              fontFamily:
                'JetBrains Mono, monospace',
              letterSpacing: 1.5,
              marginBottom: 10,
            }}
          >
            CORRELATION METHODOLOGY
          </div>

          <div
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: '#00d4ff',
                fontFamily:
                  'JetBrains Mono, monospace',
                background:
                  '#00d4ff11',
                padding:
                  '8px 16px',
                borderRadius: 6,
                border:
                  '1px solid #00d4ff33',
              }}
            >
              Score = Temporal × 0.40 +
              Spatial × 0.60
            </div>

            <div
              style={{
                fontSize: 11,
                color: '#6b8aaa',
                flex: 1,
                lineHeight: 1.5,
              }}
            >
              M4 ranks vessels using
              temporal proximity and,
              when spill coordinates are
              available, spatial proximity.
              The current dataset has no
              geolocated spill records, so
              all current matches are{' '}
              <strong
                style={{
                  color: '#ffd700',
                }}
              >
                temporal-only
              </strong>
              .
            </div>
          </div>
        </Card>
      </div>

      {/* ========================= */}
      {/* RIGHT SIDE */}
      {/* ========================= */}

      <div
        style={{
          width: 340,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          overflowY: 'auto',
        }}
      >
        {/* CANDIDATES */}

        <Card>
          <CardHeader>
            <CardTitle
              icon={
                <IconShip size={15} />
              }
            >
              Potential Vessel Candidates
            </CardTitle>

            <Badge variant="high">
              {rankedCandidates.length}
            </Badge>
          </CardHeader>

          {loading && (
            <div
              style={{
                padding: 20,
                color: '#6b8aaa',
                fontSize: 12,
              }}
            >
              Loading M4 correlation results...
            </div>
          )}

          {error && (
            <div
              style={{
                margin: 12,
                padding: 12,
                background:
                  '#ff3b3b11',
                border:
                  '1px solid #ff3b3b44',
                borderRadius: 6,
                color: '#ff8c00',
                fontSize: 11,
                lineHeight: 1.5,
              }}
            >
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            rankedCandidates.length ===
              0 && (
              <div
                style={{
                  padding: 20,
                  color: '#6b8aaa',
                  fontSize: 12,
                }}
              >
                No vessel candidates found.
              </div>
            )}

          <div
            style={{
              padding: 12,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {rankedCandidates.map((v) => {
              const isSelected =
                selectedVessel ===
                v.mmsi;

              const severity =
                getSeverity(
                  v.correlation_score
                );

              const color =
                PRIORITY_COLORS[
                  severity
                ];

              const priority =
                getPriority(
                  v.correlation_score
                );

              return (
                <div
                  key={`${v.spill_id}-${v.mmsi}`}
                  onClick={() =>
                    setSelectedVessel(
                      v.mmsi
                    )
                  }
                  style={{
                    padding: 14,
                    borderRadius: 8,
                    cursor:
                      'pointer',
                    background:
                      isSelected
                        ? '#0d2744'
                        : '#0a1e35',
                    border: `1px solid ${
                      isSelected
                        ? color
                        : '#1a3050'
                    }`,
                    transition:
                      'all 0.15s',
                  }}
                >
                  {/* HEADER */}

                  <div
                    style={{
                      display: 'flex',
                      justifyContent:
                        'space-between',
                      alignItems:
                        'flex-start',
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        gap: 10,
                        alignItems:
                          'center',
                      }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          background:
                            color + '22',
                          border:
                            `1px solid ${color}44`,
                          display:
                            'flex',
                          alignItems:
                            'center',
                          justifyContent:
                            'center',
                          fontSize: 13,
                          fontFamily:
                            'Rajdhani, sans-serif',
                          fontWeight: 700,
                          color,
                        }}
                      >
                        #{v.rank}
                      </div>

                      <div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color:
                              '#e2eaf5',
                          }}
                        >
                          MMSI {v.mmsi}
                        </div>

                        <div
                          style={{
                            fontSize: 10,
                            color:
                              '#4a6a8a',
                            fontFamily:
                              'JetBrains Mono, monospace',
                            marginTop: 2,
                          }}
                        >
                          {v.correlation_mode ===
                          'TEMPORAL_ONLY'
                            ? 'TEMPORAL ONLY'
                            : 'TIME + DISTANCE'}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        padding:
                          '2px 8px',
                        borderRadius: 4,
                        background:
                          color + '22',
                        border:
                          `1px solid ${color}44`,
                        fontSize: 9,
                        color,
                        fontWeight: 700,
                        fontFamily:
                          'JetBrains Mono, monospace',
                      }}
                    >
                      {priority}
                    </div>
                  </div>

                  {/* DATA GRID */}

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        '1fr 1fr',
                      gap: 8,
                      marginBottom: 10,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 9,
                          color:
                            '#4a6a8a',
                          fontFamily:
                            'JetBrains Mono, monospace',
                          marginBottom: 2,
                        }}
                      >
                        TIME DIFFERENCE
                      </div>

                      <div
                        style={{
                          fontSize: 14,
                          fontFamily:
                            'Rajdhani, sans-serif',
                          fontWeight: 700,
                          color:
                            '#e2eaf5',
                        }}
                      >
                        {formatTime(
                          v.time_difference_minutes
                        )}
                      </div>
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: 9,
                          color:
                            '#4a6a8a',
                          fontFamily:
                            'JetBrains Mono, monospace',
                          marginBottom: 2,
                        }}
                      >
                        DISTANCE
                      </div>

                      <div
                        style={{
                          fontSize: 14,
                          fontFamily:
                            'Rajdhani, sans-serif',
                          fontWeight: 700,
                          color:
                            v.distance_km ===
                            null
                              ? '#6b8aaa'
                              : '#e2eaf5',
                        }}
                      >
                        {formatDistance(
                          v.distance_km
                        )}
                      </div>
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: 9,
                          color:
                            '#4a6a8a',
                          fontFamily:
                            'JetBrains Mono, monospace',
                          marginBottom: 2,
                        }}
                      >
                        TEMPORAL SCORE
                      </div>

                      <div
                        style={{
                          fontSize: 14,
                          fontFamily:
                            'Rajdhani, sans-serif',
                          fontWeight: 700,
                          color:
                            '#e2eaf5',
                        }}
                      >
                        {formatScore(
                          v.temporal_score
                        )}
                      </div>
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: 9,
                          color:
                            '#4a6a8a',
                          fontFamily:
                            'JetBrains Mono, monospace',
                          marginBottom: 2,
                        }}
                      >
                        CORRELATION SCORE
                      </div>

                      <div
                        style={{
                          fontSize: 16,
                          fontFamily:
                            'Rajdhani, sans-serif',
                          fontWeight: 700,
                          color,
                        }}
                      >
                        {formatScore(
                          v.correlation_score
                        )}
                      </div>
                    </div>
                  </div>

                  {/* SCORE BAR */}

                  <div
                    style={{
                      height: 3,
                      background:
                        '#1a3050',
                      borderRadius: 2,
                    }}
                  >
                    <div
                      style={{
                        height: 3,
                        width: `${Math.min(
                          Math.max(
                            v.correlation_score *
                              100,
                            0
                          ),
                          100
                        )}%`,
                        background: color,
                        borderRadius: 2,
                      }}
                    />
                  </div>

                  {/* SELECTED DETAILS */}

                  {isSelected && (
                    <>
                      <div
                        style={{
                          marginTop: 10,
                          padding: 9,
                          background:
                            '#020b15',
                          borderRadius: 5,
                          border:
                            '1px solid #1a3050',
                        }}
                      >
                        <div
                          style={{
                            fontSize: 9,
                            color:
                              '#4a6a8a',
                            fontFamily:
                              'JetBrains Mono, monospace',
                            marginBottom: 5,
                          }}
                        >
                          AIS POSITION REPORT
                        </div>

                        <div
                          style={{
                            fontSize: 10,
                            color:
                              '#8aaac8',
                            lineHeight:
                              1.6,
                            fontFamily:
                              'JetBrains Mono, monospace',
                          }}
                        >
                          TIME:{' '}
                          {formatTimestamp(
                            v.ais_timestamp_utc
                          )}
                          <br />
                          POSITION:{' '}
                          {v.ais_latitude ??
                            'N/A'}
                          ,{' '}
                          {v.ais_longitude ??
                            'N/A'}
                          <br />
                          SOG:{' '}
                          {v.sog !==
                          null
                            ? `${v.sog} kn`
                            : 'N/A'}
                          <br />
                          COG:{' '}
                          {v.cog !==
                          null
                            ? `${v.cog}°`
                            : 'N/A'}
                        </div>
                      </div>

                      <Btn
                        variant="primary"
                        style={{
                          width: '100%',
                          marginTop: 10,
                          justifyContent:
                            'center',
                          fontSize: 11,
                        }}
                        onClick={() =>
                          onNavigate(
                            'vessel'
                          )
                        }
                      >
                        View Vessel Intelligence
                      </Btn>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* PARAMETERS */}

        <Card
          style={{
            padding: 16,
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: '#4a6a8a',
              fontFamily:
                'JetBrains Mono, monospace',
              letterSpacing: 1,
              marginBottom: 10,
            }}
          >
            CORRELATION PARAMETERS
          </div>

          <StatRow
            label="Selected spill"
            value={
              selected?.spill_id ??
              'No selection'
            }
            mono
          />

          <StatRow
            label="Detection time"
            value={
              selected
                ? formatTimestamp(
                    selected.spill_timestamp_utc
                  )
                : 'N/A'
            }
            mono
          />

          <StatRow
            label="M4 temporal window"
            value={
              summary
                ? `±${summary.time_window_minutes} minutes`
                : 'N/A'
            }
            mono
          />

          <StatRow
            label="AIS records analyzed"
            value={
              summary
                ? String(
                    summary.ais_records
                  )
                : 'N/A'
            }
            mono
          />

          <StatRow
            label="Spill records"
            value={
              summary
                ? String(
                    summary.spill_records
                  )
                : 'N/A'
            }
            mono
          />

          <StatRow
            label="Candidate records"
            value={
              summary
                ? String(
                    summary.candidate_records
                  )
                : 'N/A'
            }
            mono
          />

          <StatRow
            label="Geolocated spills"
            value={
              summary
                ? String(
                    summary.geolocated_spill_records
                  )
                : 'N/A'
            }
            mono
          />

          <StatRow
            label="Temporal-only matches"
            value={String(
              temporalOnlyCount
            )}
            mono
          />

          <StatRow
            label="Spatial matches"
            value={String(
              spatialCorrelationCount
            )}
            mono
          />

          <StatRow
            label="Correlation engine"
            value="OceanSentinel M4"
          />

          {/* DATA LIMITATION */}

          <div
            style={{
              marginTop: 12,
              padding:
                '10px 12px',
              background:
                '#ffd7000d',
              border:
                '1px solid #ffd70033',
              borderRadius: 6,
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: '#ffd700',
                fontWeight: 700,
                marginBottom: 4,
              }}
            >
              DATA LIMITATION
            </div>

            <div
              style={{
                fontSize: 10,
                color: '#8aaac8',
                lineHeight: 1.5,
              }}
            >
              M3 currently reports 0
              geolocated spill records.
              Therefore M4 is operating in
              temporal-only mode for the
              current dataset. Spatial
              scoring will activate when
              valid spill coordinates are
              available.
            </div>
          </div>

          {/* DISCLAIMER */}

          <div
            style={{
              marginTop: 10,
              padding:
                '8px 12px',
              background:
                '#ff3b3b11',
              border:
                '1px solid #ff3b3b33',
              borderRadius: 6,
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: '#ff8c00',
                lineHeight: 1.5,
              }}
            >
              Correlation scores are
              AI-assisted investigation
              aids. They are not legal proof
              and require human expert review
              and formal chain-of-custody
              procedures.
            </div>
          </div>
        </Card>

        {/* SELECTED VESSEL SUMMARY */}

        {selected && (
          <Card
            style={{
              padding: 16,
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: '#4a6a8a',
                fontFamily:
                  'JetBrains Mono, monospace',
                letterSpacing: 1,
                marginBottom: 10,
              }}
            >
              SELECTED VESSEL
            </div>

            <div
              style={{
                display: 'flex',
                alignItems:
                  'center',
                justifyContent:
                  'space-between',
                marginBottom: 10,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 18,
                    color:
                      '#e2eaf5',
                    fontWeight: 700,
                    fontFamily:
                      'Rajdhani, sans-serif',
                  }}
                >
                  MMSI {selected.mmsi}
                </div>

                <div
                  style={{
                    fontSize: 10,
                    color:
                      '#6b8aaa',
                    fontFamily:
                      'JetBrains Mono, monospace',
                  }}
                >
                  Rank #{selected.rank}
                </div>
              </div>

              <div
                style={{
                  textAlign:
                    'right',
                }}
              >
                <div
                  style={{
                    fontSize: 22,
                    color:
                      selectedColor,
                    fontWeight: 700,
                    fontFamily:
                      'Rajdhani, sans-serif',
                  }}
                >
                  {formatScore(
                    selected.correlation_score
                  )}
                </div>

                <div
                  style={{
                    fontSize: 9,
                    color:
                      '#6b8aaa',
                  }}
                >
                  CORRELATION
                </div>
              </div>
            </div>

            <div
              style={{
                height: 4,
                background:
                  '#1a3050',
                borderRadius: 3,
              }}
            >
              <div
                style={{
                  height: 4,
                  width: `${Math.min(
                    Math.max(
                      selected.correlation_score *
                        100,
                      0
                    ),
                    100
                  )}%`,
                  background:
                    selectedColor,
                  borderRadius: 3,
                }}
              />
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}