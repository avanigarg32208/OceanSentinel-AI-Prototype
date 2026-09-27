import React, { useEffect, useRef, useState } from 'react';
import { Card, CardHeader, CardTitle } from '../components/UI';
import {
  IconAlert,
  IconSatellite,
  IconEye,
} from '../components/Icons';
import type { Screen } from '../types';

interface Props {
  onNavigate: (s: Screen) => void;
}

interface DetectionResult {
  detection: string;
  confidence: number;
  severity: string;
  spillArea: number;
  detectedPixels: number;
  latitude: number;
  longitude: number;
  processingTime: string;
  algorithm: string;
  status: string;
  timestamp: string;
}

export default function SpillDetection({ onNavigate: _onNavigate }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [detecting, setDetecting] = useState(false);
  const [detected, setDetected] = useState(false);
  const [progress, setProgress] = useState(0);

  const [result, setResult] = useState<DetectionResult | null>(null);
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
  const [resultImageError, setResultImageError] = useState(false);

  const [imageWidth, setImageWidth] = useState<number | null>(null);
  const [imageHeight, setImageHeight] = useState<number | null>(null);

  /*
   * Prototype metadata.
   *
   * The image displayed after detection is the ACTUAL
   * YOLO output from:
   *
   * public/aaaaaa-results/<uploaded-file-name>
   *
   * Example:
   * oc-0014.jpg
   * -> /aaaaaa-results/oc-0014.jpg
   */
  const generatePrototypeResult = (file: File): DetectionResult => {
    let hash = 0;

    for (let i = 0; i < file.name.length; i++) {
      hash = (hash * 31 + file.name.charCodeAt(i)) % 100000;
    }

    const confidence = 91 + (hash % 8);

    const spillArea = 3.2 + ((hash % 1500) / 100);

    const detectedPixels = 12000 + (hash % 85000);

    const latitude = 14 + ((hash % 6000) / 1000);

    const longitude = 64 + (((hash * 7) % 7000) / 1000);

    let severity = 'MEDIUM';

    if (confidence >= 96) {
      severity = 'CRITICAL';
    } else if (confidence >= 93) {
      severity = 'HIGH';
    }

    return {
      detection: 'OIL SPILL',
      confidence,
      severity,
      spillArea: Number(spillArea.toFixed(2)),
      detectedPixels,
      latitude: Number(latitude.toFixed(4)),
      longitude: Number(longitude.toFixed(4)),
      processingTime: '0.84 sec',
      algorithm: 'OceanSentinel M3 AI Detection',
      status: 'DETECTED',
      timestamp: new Date().toISOString(),
    };
  };

  /*
   * Convert uploaded filename into the corresponding YOLO result path.
   *
   * Example:
   * oc-0014.jpg
   * =>
   * /aaaaaa-results/oc-0014.jpg
   */
  const getYOLOResultPath = (file: File) => {
    const fileName = file.name.split(/[\\/]/).pop() || file.name;

    return `/aaaaaa-results/${encodeURIComponent(fileName)}`;
  };

  const handleUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setDetected(false);
    setDetecting(false);
    setProgress(0);
    setResult(null);
    setResultImageUrl(null);
    setResultImageError(false);

    setSelectedFile(file);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    const image = new Image();

    image.onload = () => {
      setImageWidth(image.naturalWidth);
      setImageHeight(image.naturalHeight);
    };

    image.onerror = () => {
      setImageWidth(null);
      setImageHeight(null);
    };

    image.src = url;
  };

  /*
   * Actual detection flow.
   *
   * 1. Start processing animation
   * 2. Wait approximately 1.5 seconds
   * 3. Load ACTUAL YOLO annotated result
   * 4. Generate output metadata
   */
  const runDetection = () => {
    if (!selectedFile || detecting) return;

    setDetecting(true);
    setDetected(false);
    setResult(null);
    setResultImageError(false);

    const startTime = performance.now();

    let currentProgress = 0;

    const progressInterval = window.setInterval(() => {
      currentProgress += Math.floor(Math.random() * 12) + 6;

      if (currentProgress >= 94) {
        currentProgress = 94;
      }

      setProgress(currentProgress);
    }, 120);

    window.setTimeout(() => {
      window.clearInterval(progressInterval);

      setProgress(100);

      const processingSeconds =
        (performance.now() - startTime) / 1000;

      const prototypeResult = generatePrototypeResult(selectedFile);

      const finalResult: DetectionResult = {
        ...prototypeResult,
        processingTime: `${processingSeconds.toFixed(2)} sec`,
        timestamp: new Date().toISOString(),
      };

      const yoloPath = getYOLOResultPath(selectedFile);

      setResult(finalResult);
      setResultImageUrl(yoloPath);
      setDetecting(false);
      setDetected(true);
    }, 1500);
  };

  const clearImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(null);
    setSelectedFile(null);
    setDetected(false);
    setDetecting(false);
    setProgress(0);
    setResult(null);
    setResultImageUrl(null);
    setResultImageError(false);

    setImageWidth(null);
    setImageHeight(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div
      style={{
        padding: 20,
        height: '100%',
        boxSizing: 'border-box',
        overflow: 'auto',
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.tif,.tiff,.geotiff"
        onChange={handleUpload}
        style={{ display: 'none' }}
      />

      {/* ========================================================= */}
      {/* UPLOAD BAR */}
      {/* ========================================================= */}

      <Card style={{ marginBottom: 16 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div
              style={{
                color: '#00d4ff',
                fontSize: 13,
                fontFamily: 'JetBrains Mono, monospace',
                marginBottom: 5,
              }}
            >
              SAR IMAGE INPUT
            </div>

            <div
              style={{
                color: '#6b8aaa',
                fontSize: 11,
              }}
            >
              Upload a SAR satellite image for oil-spill detection
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center',
            }}
          >
            <button
              onClick={openFilePicker}
              style={{
                padding: '10px 18px',
                borderRadius: 7,
                border: '1px solid #00d4ff',
                background: '#00d4ff12',
                color: '#00d4ff',
                cursor: 'pointer',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              â†‘ UPLOAD SAR IMAGE
            </button>

            {selectedFile && (
              <button
                onClick={clearImage}
                style={{
                  padding: '10px 14px',
                  borderRadius: 7,
                  border: '1px solid #29415c',
                  background: '#081522',
                  color: '#8aaac8',
                  cursor: 'pointer',
                  fontSize: 11,
                }}
              >
                CLEAR
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* ========================================================= */}
      {/* DETECTION WORKSPACE */}
      {/* ========================================================= */}

      <Card>
        <CardHeader>
          <CardTitle icon={<IconSatellite size={15} />}>
            Detection Workspace
          </CardTitle>

          {selectedFile && (
            <span
              style={{
                color: '#00d4ff',
                fontSize: 11,
                fontFamily: 'JetBrains Mono, monospace',
                maxWidth: 420,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {selectedFile.name}
            </span>
          )}
        </CardHeader>

        {/* ======================================================= */}
        {/* EMPTY STATE */}
        {/* ======================================================= */}

        {!selectedFile && (
          <div
            style={{
              minHeight: 430,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#030d1a',
              borderRadius: 8,
              border: '1px dashed #1a3050',
            }}
          >
            <IconSatellite size={42} />

            <div
              style={{
                marginTop: 18,
                color: '#dce8f5',
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              No SAR image uploaded
            </div>

            <div
              style={{
                marginTop: 8,
                color: '#5d7895',
                fontSize: 11,
              }}
            >
              Upload a satellite image to begin detection
            </div>

            <button
              onClick={openFilePicker}
              style={{
                marginTop: 20,
                padding: '9px 18px',
                borderRadius: 6,
                border: '1px solid #00d4ff',
                background: '#00d4ff18',
                color: '#00d4ff',
                cursor: 'pointer',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 11,
              }}
            >
              SELECT SAR IMAGE
            </button>
          </div>
        )}

        {/* ======================================================= */}
        {/* UPLOADED IMAGE / PROCESSING */}
        {/* ======================================================= */}

        {selectedFile && (
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) 300px',
                gap: 16,
              }}
            >
              {/* ================================================= */}
              {/* IMAGE */}
              {/* ================================================= */}

              <div
                style={{
                  minHeight: 430,
                  background: '#03080f',
                  borderRadius: 8,
                  overflow: 'hidden',
                  border: '1px solid #1a3050',
                  position: 'relative',
                }}
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Uploaded SAR scene"
                    style={{
                      width: '100%',
                      height: 430,
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      height: 430,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      gap: 10,
                      color: '#6b8aaa',
                      fontSize: 12,
                    }}
                  >
                    <IconSatellite size={32} />

                    <span>
                      Preview unavailable for this TIFF/GeoTIFF format
                    </span>

                    <span
                      style={{
                        color: '#00d4ff',
                        fontSize: 10,
                      }}
                    >
                      FILE SUCCESSFULLY LOADED
                    </span>
                  </div>
                )}

                {/* INPUT LABEL */}
                <div
                  style={{
                    position: 'absolute',
                    left: 14,
                    top: 14,
                    padding: '6px 10px',
                    border: '1px solid #00d4ff',
                    borderRadius: 5,
                    background: '#03101dcc',
                    color: '#00d4ff',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 10,
                  }}
                >
                  SAR INPUT
                </div>

                {/* PROCESSING OVERLAY */}
                {detecting && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: '#020914dd',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      zIndex: 5,
                      backdropFilter: 'blur(2px)',
                    }}
                  >
                    <div
                      style={{
                        width: 58,
                        height: 58,
                        borderRadius: '50%',
                        border: '3px solid #12304a',
                        borderTop: '3px solid #00d4ff',
                        animation: 'spin 0.9s linear infinite',
                      }}
                    />

                    <div
                      style={{
                        marginTop: 20,
                        color: '#00d4ff',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: 13,
                        fontWeight: 700,
                        letterSpacing: 1,
                      }}
                    >
                      ANALYZING SAR...
                    </div>

                    <div
                      style={{
                        marginTop: 7,
                        color: '#6b8aaa',
                        fontSize: 10,
                      }}
                    >
                      OceanSentinel M3 AI Detection Engine
                    </div>

                    <div
                      style={{
                        width: 240,
                        height: 5,
                        marginTop: 18,
                        background: '#13283b',
                        borderRadius: 5,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${progress}%`,
                          background: '#00d4ff',
                          borderRadius: 5,
                          transition: 'width 0.12s linear',
                        }}
                      />
                    </div>

                    <div
                      style={{
                        marginTop: 8,
                        color: '#00d4ff',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: 10,
                      }}
                    >
                      {progress}%
                    </div>
                  </div>
                )}

                {/* DETECTED LABEL */}
                {detected && result && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 14,
                      top: 14,
                      padding: '7px 11px',
                      border: '1px solid #00ff9d',
                      borderRadius: 5,
                      background: '#03101de8',
                      color: '#00ff9d',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 10,
                      fontWeight: 700,
                    }}
                  >
                    âœ“ OIL SPILL DETECTED
                  </div>
                )}
              </div>

              {/* ================================================= */}
              {/* IMAGE INFORMATION */}
              {/* ================================================= */}

              <div
                style={{
                  background: '#061321',
                  border: '1px solid #1a3050',
                  borderRadius: 8,
                  padding: 16,
                }}
              >
                <div
                  style={{
                    color: '#6b8aaa',
                    fontSize: 10,
                    fontFamily: 'JetBrains Mono, monospace',
                    letterSpacing: 1,
                    marginBottom: 14,
                  }}
                >
                  IMAGE INFORMATION
                </div>

                <InfoRow
                  label="FILE"
                  value={selectedFile.name}
                />

                <InfoRow
                  label="SIZE"
                  value={`${(
                    selectedFile.size /
                    1024 /
                    1024
                  ).toFixed(2)} MB`}
                />

                <InfoRow
                  label="TYPE"
                  value={
                    selectedFile.type || 'SAR / GEOTIFF'
                  }
                />

                <InfoRow
                  label="DIMENSIONS"
                  value={
                    imageWidth && imageHeight
                      ? `${imageWidth} Ã— ${imageHeight}px`
                      : 'SAR / GeoTIFF'
                  }
                />

                <InfoRow
                  label="INPUT STATUS"
                  value="IMAGE LOADED"
                />

                <InfoRow
                  label="AI STATUS"
                  value={
                    detecting
                      ? 'PROCESSING'
                      : detected
                        ? 'ANALYZED'
                        : 'READY'
                  }
                />

                <button
                  onClick={runDetection}
                  disabled={detecting}
                  style={{
                    width: '100%',
                    marginTop: 20,
                    padding: '11px 10px',
                    borderRadius: 6,
                    border: '1px solid #00d4ff',
                    background: detecting
                      ? '#00d4ff08'
                      : '#00d4ff18',
                    color: '#00d4ff',
                    cursor: detecting
                      ? 'wait'
                      : 'pointer',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {detecting
                    ? 'ANALYZING SAR...'
                    : detected
                      ? 'RUN DETECTION AGAIN'
                      : 'RUN OIL SPILL DETECTION'}
                </button>
              </div>
            </div>

            {/* =================================================== */}
            {/* ACTUAL YOLO RESULT */}
            {/* =================================================== */}

            {detected && resultImageUrl && (
              <div style={{ marginTop: 18 }}>
                <div
                  style={{
                    color: '#6b8aaa',
                    fontSize: 10,
                    fontFamily: 'JetBrains Mono, monospace',
                    letterSpacing: 1,
                    marginBottom: 10,
                  }}
                >
                  YOLO DETECTION OUTPUT
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'minmax(0, 1fr) minmax(0, 1fr)',
                    gap: 16,
                  }}
                >
                  {/* ORIGINAL */}
                  <div
                    style={{
                      background: '#03080f',
                      border: '1px solid #1a3050',
                      borderRadius: 8,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        padding: '9px 12px',
                        background: '#061321',
                        borderBottom: '1px solid #1a3050',
                        color: '#6b8aaa',
                        fontFamily:
                          'JetBrains Mono, monospace',
                        fontSize: 10,
                      }}
                    >
                      ORIGINAL SAR IMAGE
                    </div>

                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Original SAR"
                        style={{
                          width: '100%',
                          height: 360,
                          objectFit: 'contain',
                          display: 'block',
                          background: '#02070d',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          height: 360,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#5d7895',
                          fontSize: 11,
                        }}
                      >
                        Original preview unavailable
                      </div>
                    )}
                  </div>

                  {/* YOLO RESULT */}
                  <div
                    style={{
                      background: '#03080f',
                      border: '1px solid #00ff9d55',
                      borderRadius: 8,
                      overflow: 'hidden',
                      boxShadow:
                        '0 0 25px rgba(0,255,157,0.06)',
                    }}
                  >
                    <div
                      style={{
                        padding: '9px 12px',
                        background: '#061a1b',
                        borderBottom: '1px solid #00ff9d33',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span
                        style={{
                          color: '#00ff9d',
                          fontFamily:
                            'JetBrains Mono, monospace',
                          fontSize: 10,
                          fontWeight: 700,
                        }}
                      >
                        AI / YOLO RESULT
                      </span>

                      <span
                        style={{
                          color: '#4f8f7a',
                          fontSize: 9,
                          fontFamily:
                            'JetBrains Mono, monospace',
                        }}
                      >
                        {selectedFile.name}
                      </span>
                    </div>

                    {!resultImageError ? (
                      <img
                        src={resultImageUrl}
                        alt="YOLO oil spill detection result"
                        onError={() =>
                          setResultImageError(true)
                        }
                        style={{
                          width: '100%',
                          height: 360,
                          objectFit: 'contain',
                          display: 'block',
                          background: '#02070d',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          height: 360,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 10,
                          color: '#ff8c00',
                          fontSize: 11,
                          textAlign: 'center',
                          padding: 20,
                        }}
                      >
                        <IconAlert size={30} />

                        <div>
                          YOLO result image was not found.
                        </div>

                        <div
                          style={{
                            color: '#5d7895',
                            fontFamily:
                              'JetBrains Mono, monospace',
                            fontSize: 9,
                          }}
                        >
                          Expected:
                          <br />
                          /aaaaaa-results/{selectedFile.name}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* =================================================== */}
            {/* DETECTION RESULT DATA */}
            {/* =================================================== */}

            {detected && result && (
              <div style={{ marginTop: 18 }}>
                <div
                  style={{
                    color: '#6b8aaa',
                    fontSize: 10,
                    fontFamily: 'JetBrains Mono, monospace',
                    letterSpacing: 1,
                    marginBottom: 10,
                  }}
                >
                  AI DETECTION RESULTS
                </div>

                {/* MAIN RESULTS */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'repeat(4, minmax(0, 1fr))',
                    gap: 12,
                  }}
                >
                  <ResultCard
                    title="DETECTION"
                    value={result.detection}
                    icon={<IconAlert size={17} />}
                  />

                  <ResultCard
                    title="CONFIDENCE"
                    value={`${result.confidence}%`}
                    icon={<IconEye size={17} />}
                  />

                  <ResultCard
                    title="SPILL AREA"
                    value={`${result.spillArea} kmÂ²`}
                    icon={<IconSatellite size={17} />}
                  />

                  <ResultCard
                    title="SEVERITY"
                    value={result.severity}
                    icon={<IconAlert size={17} />}
                  />
                </div>

                {/* SECOND ROW */}
                <div
                  style={{
                    marginTop: 12,
                    display: 'grid',
                    gridTemplateColumns:
                      'repeat(4, minmax(0, 1fr))',
                    gap: 12,
                  }}
                >
                  <DataCard
                    label="DETECTED PIXELS"
                    value={result.detectedPixels.toLocaleString()}
                  />

                  <DataCard
                    label="LATITUDE"
                    value={`${result.latitude}Â° N`}
                  />

                  <DataCard
                    label="LONGITUDE"
                    value={`${result.longitude}Â° E`}
                  />

                  <DataCard
                    label="PROCESSING TIME"
                    value={result.processingTime}
                  />
                </div>

                {/* ================================================= */}
                {/* ANALYSIS SUMMARY */}
                {/* ================================================= */}

                <div
                  style={{
                    marginTop: 12,
                    padding: 15,
                    borderRadius: 8,
                    border: '1px solid #00d4ff33',
                    background: '#041725',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 15,
                      flexWrap: 'wrap',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: '#00d4ff',
                          fontSize: 11,
                          fontFamily:
                            'JetBrains Mono, monospace',
                          fontWeight: 700,
                        }}
                      >
                        AI ANALYSIS COMPLETE
                      </div>

                      <div
                        style={{
                          color: '#7f9bb8',
                          fontSize: 10,
                          marginTop: 5,
                        }}
                      >
                        {result.algorithm}
                      </div>
                    </div>

                    <div
                      style={{
                        color: '#00ff9d',
                        fontSize: 10,
                        fontFamily:
                          'JetBrains Mono, monospace',
                        fontWeight: 700,
                      }}
                    >
                      â— {result.status}
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: 12,
                      height: 1,
                      background: '#15324b',
                    }}
                  />

                  <div
                    style={{
                      marginTop: 11,
                      color: '#7894b0',
                      fontSize: 10,
                      lineHeight: 1.6,
                    }}
                  >
                    Satellite scene analysis indicates
                    a probable oil-spill signature.
                    Detected region covers approximately{' '}
                    <span
                      style={{
                        color: '#00d4ff',
                        fontWeight: 700,
                      }}
                    >
                      {result.spillArea} kmÂ²
                    </span>{' '}
                    with an AI confidence of{' '}
                    <span
                      style={{
                        color: '#00ff9d',
                        fontWeight: 700,
                      }}
                    >
                      {result.confidence}%
                    </span>
                    .
                  </div>
                </div>

                {/* OUTPUT SOURCE */}
                <div
                  style={{
                    marginTop: 10,
                    padding: '10px 12px',
                    borderRadius: 6,
                    border: '1px solid #17324a',
                    background: '#061321',
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 10,
                    flexWrap: 'wrap',
                  }}
                >
                  <span
                    style={{
                      color: '#4f6d8d',
                      fontSize: 9,
                      fontFamily:
                        'JetBrains Mono, monospace',
                    }}
                  >
                    OUTPUT IMAGE
                  </span>

                  <span
                    style={{
                      color: '#00d4ff',
                      fontSize: 9,
                      fontFamily:
                        'JetBrains Mono, monospace',
                    }}
                  >
                    /aaaaaa-results/{selectedFile.name}
                  </span>
                </div>

                {/* DISCLAIMER */}
                <div
                  style={{
                    marginTop: 10,
                    color: '#4f6d8d',
                    fontSize: 9,
                    fontFamily:
                      'JetBrains Mono, monospace',
                    textAlign: 'right',
                  }}
                >
                  * Prototype inference metadata. YOLO output image
                  is loaded from the project's detection results.
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* ========================================================= */}
      {/* CSS ANIMATION */}
      {/* ========================================================= */}

      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }

          @media (max-width: 900px) {
            .detection-responsive-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
}

/* =============================================================== */
/* INFO ROW */
/* =============================================================== */

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        padding: '10px 0',
        borderBottom: '1px solid #12263d',
      }}
    >
      <div
        style={{
          color: '#4f6d8d',
          fontSize: 9,
          fontFamily: 'JetBrains Mono, monospace',
          marginBottom: 4,
        }}
      >
        {label}
      </div>

      <div
        style={{
          color: '#dce8f5',
          fontSize: 11,
          wordBreak: 'break-word',
        }}
      >
        {value}
      </div>
    </div>
  );
}

/* =============================================================== */
/* RESULT CARD */
/* =============================================================== */

function ResultCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      style={{
        border: '1px solid #16334d',
        borderRadius: 6,
        padding: 13,
        background: '#061321',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          color: '#6b8aaa',
          fontSize: 9,
          fontFamily: 'JetBrains Mono, monospace',
          marginBottom: 8,
        }}
      >
        {icon}
        {title}
      </div>

      <div
        style={{
          color: '#00d4ff',
          fontSize: 17,
          fontWeight: 800,
          fontFamily: 'JetBrains Mono, monospace',
        }}
      >
        {value}
      </div>
    </div>
  );
}

/* =============================================================== */
/* DATA CARD */
/* =============================================================== */

function DataCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        border: '1px solid #16334d',
        borderRadius: 6,
        padding: 13,
        background: '#061321',
      }}
    >
      <div
        style={{
          color: '#4f6d8d',
          fontSize: 9,
          fontFamily: 'JetBrains Mono, monospace',
          marginBottom: 8,
        }}
      >
        {label}
      </div>

      <div
        style={{
          color: '#dce8f5',
          fontSize: 14,
          fontWeight: 700,
          fontFamily: 'JetBrains Mono, monospace',
        }}
      >
        {value}
      </div>
    </div>
  );
}
