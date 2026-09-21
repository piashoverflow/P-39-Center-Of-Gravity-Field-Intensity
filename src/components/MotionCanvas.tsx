import React, { useRef, useEffect, useState } from 'react';
import { SimulationParams, TelemetryState, Language, AppTheme } from '../types';
import { drawRoundRect, drawVectorArrow, fmtNum, fmtSci } from '../utils/physics';
import { t } from '../utils/i18n';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Maximize2, 
  Minimize2 
} from 'lucide-react';

interface MotionCanvasProps {
  language: Language;
  theme: AppTheme;
  params: SimulationParams;
  telemetry: TelemetryState;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStep: () => void;
  onReset: () => void;
  onToggleSlowMo: () => void;
}

export const MotionCanvas: React.FC<MotionCanvasProps> = ({
  language,
  params,
  telemetry,
  isPlaying,
  onTogglePlay,
  onStep,
  onReset,
  onToggleSlowMo,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerDimensions, setContainerDimensions] = useState<{ width: number; height: number }>({
    width: 800,
    height: 520,
  });
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const w = Math.round(entry.contentRect.width);
      const h = Math.max(480, Math.min(640, Math.round(entry.contentRect.width * 0.58)));
      setContainerDimensions({ width: w, height: h });
    });

    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const { width, height } = containerDimensions;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Background
    ctx.fillStyle = '#0b0f19';
    ctx.fillRect(0, 0, width, height);

    if (params.showGrid) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    // ==========================================
    // PRESET 1: CG vs CM DIVERGENCE
    // ==========================================
    if (params.preset === 'cg_vs_cm') {
      const groundY = height - 60;
      const towerW = 34;
      const towerH = Math.min(height - 130, (params.towerHeightKm / 4000) * (height - 150) + 120);
      const towerX = width * 0.42 - towerW / 2;

      // Earth Ground
      ctx.fillStyle = '#0369a1';
      ctx.fillRect(0, groundY, width, 60);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(width, groundY);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Plus Jakarta Sans';
      ctx.textAlign = 'center';
      ctx.fillText(language === 'bn' ? 'ভূপৃষ্ঠ (Earth Surface, y = 0, g = 9.81 m/s²)' : 'Earth Surface (y = 0, g = 9.81 m/s²)', width * 0.5, groundY + 35);

      // Tower / Space Elevator structure
      ctx.fillStyle = 'rgba(147, 51, 234, 0.2)';
      drawRoundRect(ctx, towerX, groundY - towerH, towerW, towerH, 6);
      ctx.fill();
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Truss cross-bracing inside tower
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
      ctx.lineWidth = 1;
      const numTruss = 10;
      for (let i = 0; i < numTruss; i++) {
        const y1 = (groundY - towerH) + (towerH / numTruss) * i;
        const y2 = (groundY - towerH) + (towerH / numTruss) * (i + 1);
        ctx.beginPath();
        ctx.moveTo(towerX, y1);
        ctx.lineTo(towerX + towerW, y2);
        ctx.moveTo(towerX + towerW, y1);
        ctx.lineTo(towerX, y2);
        ctx.stroke();
      }

      // Height Marker on left
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(towerX - 25, groundY);
      ctx.lineTo(towerX - 25, groundY - towerH);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#c084fc';
      ctx.font = 'bold 11px JetBrains Mono';
      ctx.textAlign = 'right';
      ctx.fillText(`H = ${params.towerHeightKm} km`, towerX - 32, (groundY - towerH / 2));

      // 1. Center of Mass (CM): y = H / 2 (always geometric center)
      const cmPixY = groundY - towerH * 0.5;
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.arc(towerX + towerW / 2, cmPixY, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // CM Label line
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(towerX + towerW + 5, cmPixY);
      ctx.lineTo(towerX + towerW + 45, cmPixY);
      ctx.stroke();
      ctx.fillStyle = '#06b6d4';
      ctx.font = 'bold 11px Plus Jakarta Sans';
      ctx.textAlign = 'left';
      ctx.fillText(`ভরকেন্দ্র CM (y = ${fmtNum(telemetry.yCM, 1)} km)`, towerX + towerW + 52, cmPixY + 4);

      // 2. Center of Gravity (CG)
      const cgFrac = params.isUniformGravity ? 0.5 : telemetry.yCG / (params.towerHeightKm || 1);
      const cgPixY = groundY - towerH * cgFrac;

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(towerX + towerW / 2, cgPixY, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // CG Label line
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(towerX + towerW + 5, cgPixY);
      ctx.lineTo(towerX + towerW + 45, cgPixY);
      ctx.stroke();
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 11px Plus Jakarta Sans';
      ctx.fillText(`ভারকেন্দ্র CG (y = ${fmtNum(telemetry.yCG, 1)} km)`, towerX + towerW + 52, cgPixY + 4);

      // Divergence note
      if (!params.isUniformGravity && telemetry.deltaY > 1) {
        ctx.fillStyle = '#f43f5e';
        ctx.font = 'bold 12px Plus Jakarta Sans';
        ctx.textAlign = 'center';
        ctx.fillText(`⚠️ অ-সুষম মহাকর্ষে ভারকেন্দ্র ভরকেন্দ্রের নিচে অবস্থান করে: Δy = ${fmtNum(telemetry.deltaY, 2)} km`, width * 0.5, 40);
      }

      // Animated Inspection Elevator Car on tower
      const carFrac = isPlaying ? 0.5 + 0.42 * Math.sin(telemetry.elapsedTime * 1.2) : 0.5;
      const carY = groundY - towerH * carFrac;
      ctx.fillStyle = '#f59e0b';
      drawRoundRect(ctx, towerX + towerW / 2 - 8, carY - 6, 16, 12, 3);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Local g sensor reading on moving car
      const carHeightKm = params.towerHeightKm * carFrac;
      const carG = 9.81 * Math.pow(6371 / (6371 + carHeightKm), 2);
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 9px JetBrains Mono';
      ctx.textAlign = 'left';
      ctx.fillText(`g(y) = ${fmtNum(carG, 2)} N/kg`, towerX + towerW / 2 + 12, carY + 3);
    }

    // ==========================================
    // PRESET 2: FIELD LINES
    // ==========================================
    else if (params.preset === 'field_lines') {
      const centerX = width * 0.45;
      const centerY = height * 0.5;

      // Equipotential circles
      for (let r = 50; r <= 200; r += 35) {
        ctx.strokeStyle = 'rgba(147, 51, 234, 0.2)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Inward Radial Field Lines
      const numLines = 16;
      for (let i = 0; i < numLines; i++) {
        const angle = (i / numLines) * Math.PI * 2;
        const x1 = centerX + Math.cos(angle) * 35;
        const y1 = centerY + Math.sin(angle) * 35;
        const x2 = centerX + Math.cos(angle) * 210;
        const y2 = centerY + Math.sin(angle) * 210;

        ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x1, y1);
        ctx.stroke();

        // Arrow head pointing inward
        const midX = centerX + Math.cos(angle) * 110;
        const midY = centerY + Math.sin(angle) * 110;
        drawVectorArrow(ctx, midX + Math.cos(angle) * 15, midY + Math.sin(angle) * 15, midX - Math.cos(angle) * 15, midY - Math.sin(angle) * 15, '#c084fc', '', 6);
      }

      // Central Body
      ctx.fillStyle = '#6366f1';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#a5b4fc';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px Plus Jakarta Sans';
      ctx.textAlign = 'center';
      ctx.fillText('M', centerX, centerY + 3);

      // Probe Particle
      const probeR = Math.min(210, Math.max(45, (params.probeDist / 25) * 200));
      const probeAngle = telemetry.elapsedTime * 0.4;
      const px = centerX + probeR * Math.cos(probeAngle);
      const py = centerY + probeR * Math.sin(probeAngle);

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(px, py, 7, 0, Math.PI * 2);
      ctx.fill();

      // Field intensity vector pointing inward
      const eLen = Math.min(60, Math.max(15, telemetry.eFieldMag * 5 + 15));
      drawVectorArrow(ctx, px, py, px - eLen * Math.cos(probeAngle), py - eLen * Math.sin(probeAngle), '#22c55e', `E⃗ = ${fmtNum(telemetry.eFieldMag, 2)} N/kg`, 8);
    }

    // ==========================================
    // PRESET 3: LAGRANGE L1 NULL POINT
    // ==========================================
    else if (params.preset === 'lagrange_null') {
      const centerY = height * 0.5;
      const m1X = width * 0.22;
      const m2X = width * 0.78;
      const sepPix = m2X - m1X;

      // Connecting axis
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(m1X, centerY);
      ctx.lineTo(m2X, centerY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Body 1 (Earth M1)
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(m1X, centerY, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Plus Jakarta Sans';
      ctx.textAlign = 'center';
      ctx.fillText('M₁ (Earth)', m1X, centerY + 45);

      // Body 2 (Moon M2)
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.arc(m2X, centerY, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.fillText('M₂ (Moon)', m2X, centerY + 35);

      // Lagrange L1 Null Point marker
      const nullFrac = telemetry.nullPointX / (params.separationDist || 1);
      const l1PixX = m1X + sepPix * nullFrac;

      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(l1PixX, centerY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ca8a04';
      ctx.stroke();

      ctx.font = 'bold 11px JetBrains Mono';
      ctx.fillStyle = '#fef08a';
      ctx.fillText('L1 (E_net = 0)', l1PixX, centerY - 15);

      // Probe
      const probeFrac = params.probePos / (params.separationDist || 1);
      const drift = isPlaying ? Math.sin(telemetry.elapsedTime * 2.0) * 18 : 0;
      const probeX = m1X + sepPix * probeFrac + drift;

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(probeX, centerY, 7, 0, Math.PI * 2);
      ctx.fill();

      // Field vector towards M1 (E1)
      const e1Len = Math.min(50, Math.max(8, telemetry.e1 * 12));
      drawVectorArrow(ctx, probeX, centerY, probeX - e1Len, centerY, '#38bdf8', 'E⃗₁', 6);

      // Field vector towards M2 (E2)
      const e2Len = Math.min(50, Math.max(8, telemetry.e2 * 12));
      drawVectorArrow(ctx, probeX, centerY, probeX + e2Len, centerY, '#ec4899', 'E⃗₂', 6);

      // Status
      if (Math.abs(telemetry.netE) < 0.1) {
        ctx.fillStyle = '#22c55e';
        ctx.font = 'bold 13px Plus Jakarta Sans';
        ctx.fillText('✨ নিরপেক্ষ বিন্দুতে স্থাপিত: E_net = 0 N/kg (মহাকর্ষীয় বল ভারসাম্য)', width * 0.5, height - 30);
      }
    }

    // ==========================================
    // PRESET 4: CONTINUOUS RING AXIAL FIELD
    // ==========================================
    else if (params.preset === 'continuous_ring') {
      const centerX = width * 0.32;
      const centerY = height * 0.5;
      const ringA = Math.min(height * 0.35, params.ringRadius * 15 + 40);

      // Perspective Ring Ellipse
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, 24, ringA, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Center
      ctx.fillStyle = '#a855f7';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
      ctx.fill();

      // Symmetry Axis
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(centerX - 30, centerY);
      ctx.lineTo(width - 30, centerY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Peak field point marker: x = a / sqrt(2)
      const peakXDist = (params.ringRadius / Math.SQRT2) * 20;
      const peakPixX = centerX + peakXDist;
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(peakPixX, centerY - 25);
      ctx.lineTo(peakPixX, centerY + 25);
      ctx.stroke();
      ctx.font = '10px JetBrains Mono';
      ctx.fillStyle = '#86efac';
      ctx.textAlign = 'center';
      ctx.fillText('x = a/√2 (Max E)', peakPixX, centerY - 32);

      // Probe along axis executing SHM oscillation through ring center
      const shmPhase = isPlaying ? Math.cos(telemetry.elapsedTime * 2.5) : 1;
      const probeXDist = params.axialX * 20 * shmPhase;
      const pPixX = centerX + probeXDist;

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(pPixX, centerY, 7, 0, Math.PI * 2);
      ctx.fill();

      // Field vector towards ring center
      if (Math.abs(probeXDist) > 2) {
        const ringELen = Math.min(60, Math.max(10, telemetry.ringE * 8));
        const dir = probeXDist > 0 ? -1 : 1;
        drawVectorArrow(ctx, pPixX, centerY, pPixX + dir * ringELen, centerY, '#f43f5e', `E_x = ${fmtNum(telemetry.ringE, 2)}`, 7);
      }
    }
  }, [containerDimensions, params, telemetry, language]);

  return (
    <div ref={containerRef} className="flex-1 w-full flex flex-col gap-3">
      <div className="relative w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-md">
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: `${containerDimensions.height}px` }}
          className="block"
        />

        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-600 transition-colors"
            title={isFullScreen ? t(language, 'exitFullScreen') : t(language, 'fullScreen')}
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Control Deck */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePlay}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? t(language, 'pause') : t(language, 'play')}</span>
          </button>

          <button
            onClick={onStep}
            disabled={isPlaying}
            className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-800 rounded-xl text-xs font-bold transition-colors border border-slate-200"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{t(language, 'step')}</span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors border border-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t(language, 'reset')}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSlowMo}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              params.slowMo
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            🐢 {t(language, 'slowMo')}
          </button>
        </div>
      </div>
    </div>
  );
};
