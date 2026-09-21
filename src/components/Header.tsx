import React from 'react';
import { Play, Pause, RotateCcw, Target, Grid, Building2, Layers, Sparkles } from 'lucide-react';
import { P39Mode } from '../types';

interface HeaderProps {
  mode: P39Mode;
  setMode: (mode: P39Mode) => void;
  isRunning: boolean;
  setIsRunning: (running: boolean | ((prev: boolean) => boolean)) => void;
  onReset: () => void;
  speed: number;
  setSpeed: (speed: number) => void;
  showMath: boolean;
  setShowMath: (show: boolean | ((prev: boolean) => boolean)) => void;
  lang: 'en' | 'bn';
  setLang: (lang: 'en' | 'bn') => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  setMode,
  isRunning,
  setIsRunning,
  onReset,
  speed,
  setSpeed,
  showMath,
  setShowMath,
  lang,
  setLang,
}) => {
  const modes = [
    {
      id: 'field_vector_grid' as P39Mode,
      labelEn: 'Field Vector Grid & Flux',
      labelBn: 'মহাকর্ষ বলরেখা ও ভেক্টর ক্ষেত্র',
      icon: Grid,
    },
    {
      id: 'null_point_hunter' as P39Mode,
      labelEn: 'Null Point (E_net = 0)',
      labelBn: 'নিরপেক্ষ বিন্দু (ল্যাগ্রাঞ্জ L1)',
      icon: Target,
    },
    {
      id: 'cg_vs_cm_divergence' as P39Mode,
      labelEn: 'CG vs CM Divergence',
      labelBn: 'ভারকেন্দ্র (CG) বনাম ভরকেন্দ্র (CM)',
      icon: Building2,
    },
    {
      id: 'superposition_principle' as P39Mode,
      labelEn: 'Field Superposition',
      labelBn: 'উপরিলেপন নীতি (ভেক্টর যোগ)',
      icon: Layers,
    },
  ];

  return (
    <header className="bg-slate-900/90 border-b border-indigo-500/20 backdrop-blur-md sticky top-0 z-40 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Target className="w-6 h-6 text-white animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-bold font-mono bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
                P-39
              </span>
              <h1 className="text-lg font-bold text-white tracking-wide">
                {lang === 'bn' ? 'ভারকেন্দ্র, মহাকর্ষীয় ক্ষেত্র ও প্রাবল্য' : 'Center of Gravity, Gravitational Field & Intensity'}
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              {lang === 'bn'
                ? 'CG বনাম CM ব্যবধান • ক্ষেত্র প্রাবল্য E = -GM/r² • উপরিলেপন নীতি • নিরপেক্ষ বিন্দু (Lagrange L1)'
                : "CG vs CM Divergence • Field Intensity E = -GM/r² • Principle of Superposition • Neutral Point"}
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 gap-1 overflow-x-auto max-w-full">
          {modes.map((m) => {
            const Icon = m.icon;
            const active = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  active
                    ? 'bg-indigo-500 text-white font-bold shadow-md shadow-indigo-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? m.labelBn : m.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning((p) => !p)}
            className={`p-2 rounded-lg text-white font-medium flex items-center gap-1 transition-all ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 shadow-md'
                : 'bg-emerald-500 hover:bg-emerald-600 shadow-md'
            }`}
            title={isRunning ? 'Pause' : 'Start'}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={onReset}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowMath((p) => !p)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              showMath
                ? 'bg-purple-600/30 text-purple-300 border-purple-500/50 shadow-sm'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>{lang === 'bn' ? 'গাণিতিক তত্ত্ব' : 'Math Theory'}</span>
          </button>

          <button
            onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-amber-400"
          >
            {lang === 'en' ? 'বাংলা' : 'EN'}
          </button>
        </div>
      </div>
    </header>
  );
};
