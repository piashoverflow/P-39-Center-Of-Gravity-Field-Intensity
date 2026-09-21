import React from 'react';
import { SimulationParams, Language } from '../types';
import { t } from '../utils/i18n';
import { 
  Sliders, 
  RotateCcw, 
  Target, 
  Layers, 
  CircleDot, 
  Disc, 
  Eye, 
  Compass, 
  Sparkles 
} from 'lucide-react';

interface ControlPanelProps {
  language: Language;
  params: SimulationParams;
  onChangeParams: (updater: (prev: SimulationParams) => SimulationParams) => void;
  onResetDefaults: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  language,
  params,
  onChangeParams,
  onResetDefaults,
}) => {
  const updateParam = <K extends keyof SimulationParams>(key: K, value: SimulationParams[K]) => {
    onChangeParams((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-full lg:w-72 xl:w-80 shrink-0 flex flex-col gap-3">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3.5 flex flex-col gap-3">
        {/* Header with Reset Defaults */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-50 text-purple-700 rounded-lg border border-purple-200">
              <Sliders className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-black text-slate-800 tracking-wider uppercase">
              {t(language, 'controlParameters')}
            </h2>
          </div>

          <button
            onClick={onResetDefaults}
            className="flex items-center gap-1 text-[11px] font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-200 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t(language, 'resetDefaults')}</span>
          </button>
        </div>

        {/* Tab 1: CG vs CM */}
        {params.preset === 'cg_vs_cm' && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-slate-700">{t(language, 'gravityFieldType')}</span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => updateParam('isUniformGravity', true)}
                  className={`px-2 py-1.5 rounded-xl text-xs font-bold border transition-all text-center ${
                    params.isUniformGravity
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  সুষম (CG ≡ CM)
                </button>
                <button
                  onClick={() => updateParam('isUniformGravity', false)}
                  className={`px-2 py-1.5 rounded-xl text-xs font-bold border transition-all text-center ${
                    !params.isUniformGravity
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  প্রাকৃতিক (CG &lt; CM)
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">{t(language, 'towerHeight')}</span>
                <span className="font-mono font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  H = {params.towerHeightKm} km
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="4000"
                step="50"
                value={params.towerHeightKm}
                onChange={(e) => updateParam('towerHeightKm', parseFloat(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Field Lines */}
        {params.preset === 'field_lines' && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">{t(language, 'centralMass')}</span>
                <span className="font-mono font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  M = {params.centralMass} × 10²⁴ kg
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="0.5"
                value={params.centralMass}
                onChange={(e) => updateParam('centralMass', parseFloat(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">{t(language, 'probeDist')}</span>
                <span className="font-mono font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  r = {params.probeDist} × 10⁶ m
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="25"
                step="0.5"
                value={params.probeDist}
                onChange={(e) => updateParam('probeDist', parseFloat(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Lagrange L1 Null Point */}
        {params.preset === 'lagrange_null' && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">{t(language, 'massM1')}</span>
                <span className="font-mono font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  {params.m1} × 10²⁴ kg
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="15"
                step="0.5"
                value={params.m1}
                onChange={(e) => updateParam('m1', parseFloat(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">{t(language, 'massM2')}</span>
                <span className="font-mono font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  {params.m2} × 10²⁴ kg
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="3"
                step="0.05"
                value={params.m2}
                onChange={(e) => updateParam('m2', parseFloat(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">{t(language, 'probePosition')}</span>
                <span className="font-mono font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  x = {params.probePos} × 10⁶ m
                </span>
              </div>
              <input
                type="range"
                min="20"
                max={params.separationDist - 20}
                step="2"
                value={params.probePos}
                onChange={(e) => updateParam('probePos', parseFloat(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            {/* Snap to Null Point */}
            <button
              onClick={() => {
                const nullX = params.separationDist / (1 + Math.sqrt(params.m2 / params.m1));
                updateParam('probePos', Math.round(nullX));
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl text-purple-800 text-xs font-bold transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>L1 নিরপেক্ষ বিন্দুতে সেট করুন (E_net = 0)</span>
            </button>
          </div>
        )}

        {/* Tab 4: Continuous Mass Ring */}
        {params.preset === 'continuous_ring' && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">{t(language, 'ringRadius')}</span>
                <span className="font-mono font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  a = {params.ringRadius} × 10⁶ m
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={params.ringRadius}
                onChange={(e) => updateParam('ringRadius', parseFloat(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">{t(language, 'axialX')}</span>
                <span className="font-mono font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  x = {params.axialX} × 10⁶ m
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                step="0.2"
                value={params.axialX}
                onChange={(e) => updateParam('axialX', parseFloat(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            {/* Snap to Peak Field Point */}
            <button
              onClick={() => {
                const maxX = params.ringRadius / Math.SQRT2;
                updateParam('axialX', parseFloat(maxX.toFixed(2)));
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl text-purple-800 text-xs font-bold transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>সর্বোচ্চ প্রাবল্যের দূরত্বে সেট করুন (x = a/√2)</span>
            </button>
          </div>
        )}

        {/* Visualizer Toggles */}
        <div className="border-t border-slate-200 pt-3 flex flex-col gap-2">
          <div className="text-[11px] font-black text-slate-700 tracking-wider uppercase flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-purple-600" />
            <span>{t(language, 'visualizerToggles')}</span>
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={params.showVectors}
              onChange={(e) => updateParam('showVectors', e.target.checked)}
              className="accent-purple-600 rounded"
            />
            <span>{t(language, 'showVectors')}</span>
          </label>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={params.showGrid}
              onChange={(e) => updateParam('showGrid', e.target.checked)}
              className="accent-purple-600 rounded"
            />
            <span>{t(language, 'showGrid')}</span>
          </label>
        </div>
      </div>
    </div>
  );
};
