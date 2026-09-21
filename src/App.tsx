import React, { useState, useEffect, useRef } from 'react';
import { Language, PresetMode, AppTheme, SimulationParams, TelemetryState } from './types';
import { Header } from './components/Header';
import { ControlPanel } from './components/ControlPanel';
import { MotionCanvas } from './components/MotionCanvas';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { TheoryModal } from './components/TheoryModal';
import { G_UNIVERSAL, calculateYCG } from './utils/physics';

export default function App() {
  const [language, setLanguage] = useState<Language>('bn');
  const [theme, setTheme] = useState<AppTheme>('clean_bright');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const initialParams: SimulationParams = {
    preset: 'cg_vs_cm',
    theme: 'clean_bright',
    towerHeightKm: 1500, // 1500 km tall space elevator
    isUniformGravity: false,
    centralMass: 5.97, // 10^24 kg
    probeDist: 10, // 10^6 m
    m1: 5.97, // Earth
    m2: 0.073, // Moon
    separationDist: 384, // 10^6 m
    probePos: 340, // 10^6 m
    ringRadius: 4.0, // 10^6 m
    ringMass: 5.0, // 10^24 kg
    axialX: 2.83, // 10^6 m (a / sqrt(2) ≈ 2.83)
    showVectors: true,
    showFieldLines: true,
    showEquipotentials: true,
    showGrid: true,
    slowMo: false,
  };

  const [params, setParams] = useState<SimulationParams>(initialParams);

  // Compute Telemetry
  const computeTelemetry = (p: SimulationParams): TelemetryState => {
    // 1. CG vs CM
    const ycm = p.towerHeightKm * 0.5;
    const ycg = p.isUniformGravity ? ycm : calculateYCG(p.towerHeightKm);
    const dy = ycm - ycg;

    // 2. Field Intensity
    const rM = p.probeDist * 1e6;
    const emag = (G_UNIVERSAL * (p.centralMass * 1e24)) / (rM * rM);

    // 3. Lagrange
    const nullX = p.separationDist / (1 + Math.sqrt(p.m2 / p.m1));
    const pxM = p.probePos * 1e6;
    const dMinusPxM = (p.separationDist - p.probePos) * 1e6;
    const e1Val = (G_UNIVERSAL * (p.m1 * 1e24)) / (pxM * pxM || 1);
    const e2Val = (G_UNIVERSAL * (p.m2 * 1e24)) / (dMinusPxM * dMinusPxM || 1);
    const netEVal = e1Val - e2Val;

    // 4. Ring
    const aM = p.ringRadius * 1e6;
    const xM = p.axialX * 1e6;
    const ringEVal = (G_UNIVERSAL * (p.ringMass * 1e24) * xM) / Math.pow(aM * aM + xM * xM, 1.5);
    const maxXM = aM / Math.SQRT2;
    const ringMaxEVal = (2 * G_UNIVERSAL * (p.ringMass * 1e24)) / (3 * Math.sqrt(3) * aM * aM);

    return {
      elapsedTime: 0,
      yCM: ycm,
      yCG: ycg,
      deltaY: dy,
      eFieldMag: emag,
      eFieldDir: Math.PI,
      e1: e1Val,
      e2: e2Val,
      netE: netEVal,
      nullPointX: nullX,
      ringE: ringEVal,
      ringMaxE: ringMaxEVal,
      ringMaxX: p.ringRadius / Math.SQRT2,
    };
  };

  const [telemetry, setTelemetry] = useState<TelemetryState>(() => computeTelemetry(initialParams));

  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const handleReset = () => {
    setIsPlaying(false);
    lastTimeRef.current = null;
    setTelemetry(computeTelemetry(params));
  };

  const handleResetDefaults = () => {
    setIsPlaying(false);
    lastTimeRef.current = null;
    const restored = { ...initialParams, preset: params.preset };
    setParams(restored);
    setTelemetry(computeTelemetry(restored));
  };

  const handlePresetSelect = (newPreset: PresetMode) => {
    setIsPlaying(false);
    lastTimeRef.current = null;
    const next = { ...params, preset: newPreset };
    setParams(next);
    setTelemetry(computeTelemetry(next));
  };

  const handleStep = () => {
    setTelemetry((prev) => ({ ...prev, elapsedTime: prev.elapsedTime + 0.1 }));
  };

  const handleParamsUpdate = (updater: (prev: SimulationParams) => SimulationParams) => {
    setParams((prev) => {
      const next = updater(prev);
      setTelemetry(computeTelemetry(next));
      return next;
    });
  };

  // Animation Loop
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      lastTimeRef.current = null;
      return;
    }

    const loop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const dt = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      setTelemetry((prev) => ({
        ...prev,
        elapsedTime: prev.elapsedTime + dt * (params.slowMo ? 0.25 : 1.0),
      }));

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, params]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F8FAFC] text-slate-800">
      {/* 1. Udvash Header */}
      <Header
        language={language}
        onToggleLanguage={() => setLanguage((prev) => (prev === 'bn' ? 'en' : 'bn'))}
        preset={params.preset}
        onSelectPreset={handlePresetSelect}
        onOpenTheory={() => setIsModalOpen(true)}
        onReset={handleReset}
      />

      {/* 2. Main 3-Column Workspace */}
      <main className="max-w-[1780px] w-full mx-auto p-3 sm:p-4 flex-1 flex flex-col lg:flex-row gap-4 items-start">
        <ControlPanel
          language={language}
          params={params}
          onChangeParams={handleParamsUpdate}
          onResetDefaults={handleResetDefaults}
        />

        <MotionCanvas
          language={language}
          theme={theme}
          params={params}
          telemetry={telemetry}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying((prev) => !prev)}
          onStep={handleStep}
          onReset={handleReset}
          onToggleSlowMo={() => setParams((prev) => ({ ...prev, slowMo: !prev.slowMo }))}
        />

        <AnalyticsPanel
          language={language}
          params={params}
          telemetry={telemetry}
        />
      </main>

      {/* 3. Theory Modal */}
      <TheoryModal
        language={language}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
