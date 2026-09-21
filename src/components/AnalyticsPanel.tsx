import React, { useRef, useEffect } from 'react';
import { SimulationParams, TelemetryState, Language } from '../types';
import { t } from '../utils/i18n';
import { fmtNum, fmtSci, G_UNIVERSAL } from '../utils/physics';
import { 
  Activity, 
  BarChart3, 
  Zap, 
  Target, 
  Layers, 
  Disc 
} from 'lucide-react';

interface AnalyticsPanelProps {
  language: Language;
  params: SimulationParams;
  telemetry: TelemetryState;
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({
  language,
  params,
  telemetry,
}) => {
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = chartCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, w, h);

    // Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(35, 10);
    ctx.lineTo(35, h - 20);
    ctx.lineTo(w - 10, h - 20);
    ctx.stroke();

    ctx.font = '9px JetBrains Mono';
    ctx.fillStyle = '#94a3b8';

    // 1. CG vs CM: g(y) decrease with altitude
    if (params.preset === 'cg_vs_cm') {
      ctx.fillText('g (m/s²)', 40, 18);
      ctx.fillText('y (km)', w - 35, h - 6);

      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x <= w - 45; x += 3) {
        const yKm = (x / (w - 45)) * params.towerHeightKm;
        const gVal = params.isUniformGravity ? 9.81 : 9.81 * Math.pow(6371 / (6371 + yKm), 2);
        const yPix = (h - 20) - (gVal / 9.81) * (h - 35);
        if (x === 0) ctx.moveTo(35 + x, yPix);
        else ctx.lineTo(35 + x, yPix);
      }
      ctx.stroke();
    } 
    // 2. Ring axial field E_x curve
    else if (params.preset === 'continuous_ring') {
      ctx.fillText('E (N/kg)', 40, 18);
      ctx.fillText('x (10⁶m)', w - 40, h - 6);

      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2;
      ctx.beginPath();
      const a = params.ringRadius;
      for (let x = 0; x <= w - 45; x += 2) {
        const simX = (x / (w - 45)) * 15;
        const eVal = simX / Math.pow(a * a + simX * simX, 1.5);
        const maxEVal = (a / Math.SQRT2) / Math.pow(a * a + (a * a) / 2, 1.5);
        const yPix = (h - 20) - (eVal / (maxEVal || 1)) * (h - 35);
        if (x === 0) ctx.moveTo(35 + x, yPix);
        else ctx.lineTo(35 + x, yPix);
      }
      ctx.stroke();

      // Current x point
      const curXRatio = params.axialX / 15;
      const curE = params.axialX / Math.pow(a * a + params.axialX * params.axialX, 1.5);
      const maxEVal = (a / Math.SQRT2) / Math.pow(a * a + (a * a) / 2, 1.5);
      const ptX = 35 + curXRatio * (w - 45);
      const ptY = (h - 20) - (curE / (maxEVal || 1)) * (h - 35);

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(Math.min(w - 12, ptX), Math.max(12, ptY), 4.5, 0, Math.PI * 2);
      ctx.fill();
    }
    // 3. Lagrange L1 curve
    else if (params.preset === 'lagrange_null') {
      ctx.fillText('E_net', 40, 18);
      ctx.fillText('x', w - 25, h - 6);

      // Horizontal zero axis
      const midY = (h - 20) * 0.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.beginPath();
      ctx.moveTo(35, midY);
      ctx.lineTo(w - 10, midY);
      ctx.stroke();

      // Zero-crossing curve
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 2; x <= w - 47; x += 2) {
        const frac = x / (w - 45);
        const simX = frac * params.separationDist;
        const e1 = (params.m1 * 10) / (simX * simX);
        const e2 = (params.m2 * 10) / ((params.separationDist - simX) * (params.separationDist - simX));
        const net = Math.max(-5, Math.min(5, e1 - e2));
        const yPix = midY - (net / 5) * (midY - 15);
        if (x === 2) ctx.moveTo(35 + x, yPix);
        else ctx.lineTo(35 + x, yPix);
      }
      ctx.stroke();
    }
  }, [params, telemetry]);

  return (
    <div className="w-full lg:w-80 xl:w-96 shrink-0 flex flex-col gap-3">
      {/* 1. Live Telemetry Metrics */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3.5 flex flex-col gap-3">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <div className="p-1.5 bg-purple-50 text-purple-700 rounded-lg border border-purple-200">
            <Activity className="w-4 h-4" />
          </div>
          <h2 className="text-xs font-black text-slate-800 tracking-wider uppercase">
            {t(language, 'telemetryTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {params.preset === 'cg_vs_cm' && (
            <>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase">{t(language, 'yCM')}</span>
                <span className="font-mono font-black text-cyan-700 text-sm mt-0.5">
                  {fmtNum(telemetry.yCM, 1)} km
                </span>
              </div>

              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase">{t(language, 'yCG')}</span>
                <span className="font-mono font-black text-amber-700 text-sm mt-0.5">
                  {fmtNum(telemetry.yCG, 1)} km
                </span>
              </div>

              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col col-span-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase">{t(language, 'deltaY')}</span>
                <span className="font-mono font-black text-rose-700 text-sm mt-0.5">
                  Δy = {fmtNum(telemetry.deltaY, 2)} km ({fmtNum(telemetry.deltaY * 1000, 0)} m)
                </span>
              </div>
            </>
          )}

          {params.preset === 'field_lines' && (
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col col-span-2">
              <span className="text-[10px] text-slate-500 font-bold uppercase">{t(language, 'netField')}</span>
              <span className="font-mono font-black text-purple-700 text-base mt-0.5">
                |E⃗| = {fmtNum(telemetry.eFieldMag, 3)} N/kg
              </span>
            </div>
          )}

          {params.preset === 'lagrange_null' && (
            <>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase">E₁ (M₁)</span>
                <span className="font-mono font-black text-sky-700 text-xs mt-0.5">
                  {fmtNum(telemetry.e1, 3)} N/kg
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase">E₂ (M₂)</span>
                <span className="font-mono font-black text-pink-700 text-xs mt-0.5">
                  {fmtNum(telemetry.e2, 3)} N/kg
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col col-span-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase">{t(language, 'nullPointX')}</span>
                <span className="font-mono font-black text-emerald-700 text-sm mt-0.5">
                  x_L1 = {fmtNum(telemetry.nullPointX, 1)} × 10⁶ m
                </span>
              </div>
            </>
          )}

          {params.preset === 'continuous_ring' && (
            <>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase">বর্তমান E_x</span>
                <span className="font-mono font-black text-purple-700 text-sm mt-0.5">
                  {fmtNum(telemetry.ringE, 3)} N/kg
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase">সর্বোচ্চ E_max</span>
                <span className="font-mono font-black text-emerald-700 text-sm mt-0.5">
                  {fmtNum(telemetry.ringMaxE, 3)} N/kg
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col col-span-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase">সর্বোচ্চ দূরত্বের স্থান (x_peak)</span>
                <span className="font-mono font-black text-slate-900 text-xs mt-0.5">
                  x = a / √2 = {fmtNum(telemetry.ringMaxX, 2)} × 10⁶ m
                </span>
              </div>
            </>
          )}
        </div>

        {/* Real-time Graph */}
        <div className="mt-1 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
            <BarChart3 className="w-3 h-3" />
            <span>প্রাবল্য ও বিভব চিত্র গ্রাফ</span>
          </span>
          <div className="w-full h-28 bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
            <canvas ref={chartCanvasRef} width={320} height={112} className="w-full h-full block" />
          </div>
        </div>
      </div>

      {/* 2. Step-by-Step Mathematical Proof */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3.5 flex flex-col gap-2.5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <div className="p-1 bg-amber-50 text-amber-700 rounded-md border border-amber-200">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-black text-slate-800 tracking-wider uppercase">
            {t(language, 'exactMathTitle')}
          </h3>
        </div>

        {params.preset === 'cg_vs_cm' && (
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-purple-800 font-black block">y_CG = ∫ y·g(y)dm / ∫ g(y)dm</span>
              <p className="text-slate-600 font-medium">
                উচ্চতা বৃদ্ধির সাথে সাথে g(y) কমে যায়, ফলে নিচের অংশে ভারী টান থাকে।
              </p>
              <p className="text-slate-900 font-black text-xs mt-1">
                y_CG = {fmtNum(telemetry.yCG, 1)} km &lt; y_CM = {fmtNum(telemetry.yCM, 1)} km
              </p>
            </div>
          </div>
        )}

        {params.preset === 'lagrange_null' && (
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-purple-800 font-black block">E_net = GM₁/x² - GM₂/(D-x)² = 0</span>
              <p className="text-slate-600 font-medium">
                x = D / [1 + √(M₂/M₁)]
              </p>
              <p className="text-emerald-800 font-black text-xs mt-1">
                x_L1 = {fmtNum(telemetry.nullPointX, 1)} × 10⁶ m
              </p>
            </div>
          </div>
        )}

        {params.preset === 'continuous_ring' && (
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-purple-800 font-black block">E_x = GMx / (a² + x²)^(3/2)</span>
              <p className="text-slate-600 font-medium">
                dE_x / dx = 0  ➔  x = a / √2
              </p>
              <p className="text-emerald-800 font-black text-xs mt-1">
                E_max = 2GM / (3√3 a²)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
