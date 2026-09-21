import React, { useState } from 'react';
import { Header } from './components/Header';
import { SimulationCanvas } from './components/SimulationCanvas';
import { ControlDeck } from './components/ControlDeck';
import { MathFormulaOverlay } from './components/MathFormulaOverlay';
import { P39Mode, FieldGridParams, NullPointParams, CgCmParams, SuperpositionParams } from './types';

export default function App() {
  const [mode, setMode] = useState<P39Mode>('field_vector_grid');
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);
  const [showMath, setShowMath] = useState<boolean>(false);
  const [lang, setLang] = useState<'en' | 'bn'>('bn');
  const [time, setTime] = useState<number>(0);

  const [fieldParams, setFieldParams] = useState<FieldGridParams>({
    m1: 50,
    m2: 30,
    gridResolution: 35,
    showFieldLines: true,
    showPotentialHeatmap: false,
  });

  const [nullParams, setNullParams] = useState<NullPointParams>({
    m1Ratio: 81, // Earth
    m2Ratio: 1, // Moon
    totalDistanceKm: 384400,
    testMassDisplaced: 0.5,
  });

  const [cgCmParams, setCgCmParams] = useState<CgCmParams>({
    structureHeightKm: 800,
    earthRadiusKm: 6371,
    structureType: 'uniform_rod',
  });

  const [superParams, setSuperParams] = useState<SuperpositionParams>({
    geometry: 'triangle',
    massValue: 40,
    probeAngleDeg: 45,
  });

  const handleReset = () => {
    setTime(0);
  };

  return (
    <div className="min-h-screen bg-[#060714] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Header
        mode={mode}
        setMode={setMode}
        isRunning={isRunning}
        setIsRunning={setIsRunning}
        onReset={handleReset}
        speed={speed}
        setSpeed={setSpeed}
        showMath={showMath}
        setShowMath={setShowMath}
        lang={lang}
        setLang={setLang}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-3 md:p-5 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 flex flex-col items-center justify-center">
          <SimulationCanvas
            mode={mode}
            isRunning={isRunning}
            speed={speed}
            fieldParams={fieldParams}
            nullParams={nullParams}
            cgCmParams={cgCmParams}
            superParams={superParams}
            time={time}
            setTime={setTime}
            lang={lang}
          />
        </div>

        <div className="lg:col-span-1">
          <ControlDeck
            mode={mode}
            fieldParams={fieldParams}
            setFieldParams={setFieldParams}
            nullParams={nullParams}
            setNullParams={setNullParams}
            cgCmParams={cgCmParams}
            setCgCmParams={setCgCmParams}
            superParams={superParams}
            setSuperParams={setSuperParams}
            lang={lang}
          />
        </div>
      </main>

      <MathFormulaOverlay
        mode={mode}
        show={showMath}
        onClose={() => setShowMath(false)}
        lang={lang}
      />

      {/* Footer */}
      <footer className="bg-slate-950/80 border-t border-slate-900 px-4 py-2.5 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
            <span className="font-mono text-slate-400">P-39 Gravitational Field & CG Dynamics Lab</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Developed by</span>
            <span className="font-bold text-indigo-400">Shamsuddin Piash</span>
            <span>• BUET ME '25</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
