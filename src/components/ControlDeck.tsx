import React from 'react';
import { P39Mode, FieldGridParams, NullPointParams, CgCmParams, SuperpositionParams } from '../types';
import { Sliders, Target, Grid, Building2, Layers } from 'lucide-react';

interface ControlDeckProps {
  mode: P39Mode;
  fieldParams: FieldGridParams;
  setFieldParams: React.Dispatch<React.SetStateAction<FieldGridParams>>;
  nullParams: NullPointParams;
  setNullParams: React.Dispatch<React.SetStateAction<NullPointParams>>;
  cgCmParams: CgCmParams;
  setCgCmParams: React.Dispatch<React.SetStateAction<CgCmParams>>;
  superParams: SuperpositionParams;
  setSuperParams: React.Dispatch<React.SetStateAction<SuperpositionParams>>;
  lang: 'en' | 'bn';
}

export const ControlDeck: React.FC<ControlDeckProps> = ({
  mode,
  fieldParams,
  setFieldParams,
  nullParams,
  setNullParams,
  cgCmParams,
  setCgCmParams,
  superParams,
  setSuperParams,
  lang,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800">
        <Sliders className="w-4 h-4 text-indigo-400" />
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          {lang === 'bn' ? 'প্যারামিটার ও কন্ট্রোল' : 'Controls & Configuration'}
        </h2>
      </div>

      {/* MODE 1: FIELD GRID */}
      {mode === 'field_vector_grid' && (
        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>{lang === 'bn' ? 'ভর M₁ (× 10²⁴ kg)' : 'Mass M₁ (× 10²⁴ kg)'}</span>
              <span className="font-mono text-indigo-400">{fieldParams.m1}</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={fieldParams.m1}
              onChange={(e) => setFieldParams((p) => ({ ...p, m1: parseFloat(e.target.value) }))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>{lang === 'bn' ? 'ভর M₂ (× 10²⁴ kg)' : 'Mass M₂ (× 10²⁴ kg)'}</span>
              <span className="font-mono text-pink-400">{fieldParams.m2}</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={fieldParams.m2}
              onChange={(e) => setFieldParams((p) => ({ ...p, m2: parseFloat(e.target.value) }))}
              className="w-full accent-pink-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>{lang === 'bn' ? 'গ্রিড ঘনত্ব (Grid Step)' : 'Vector Grid Step'}</span>
              <span className="font-mono text-cyan-400">{fieldParams.gridResolution} px</span>
            </div>
            <input
              type="range"
              min="25"
              max="50"
              step="5"
              value={fieldParams.gridResolution}
              onChange={(e) => setFieldParams((p) => ({ ...p, gridResolution: parseInt(e.target.value, 10) }))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
            {lang === 'bn'
              ? '💡 টিপ: ক্যানভাসে M₁ অথবা M₂-কে মাউস দিয়ে ড্র্যাগ করে ইচ্ছামতো স্থানে সরিয়ে ভেক্টর বলরেখার রূপান্তর দেখুন।'
              : '💡 Tip: Drag M₁ or M₂ anywhere on the canvas to see real-time vector field reconfiguration.'}
          </div>
        </div>
      )}

      {/* MODE 2: NULL POINT HUNTER */}
      {mode === 'null_point_hunter' && (
        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>{lang === 'bn' ? 'প্রোব অবস্থান (Probe Distance)' : 'Probe Position'}</span>
              <span className="font-mono text-emerald-400">
                {(nullParams.testMassDisplaced * nullParams.totalDistanceKm).toFixed(0)} km
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.95"
              step="0.005"
              value={nullParams.testMassDisplaced}
              onChange={(e) =>
                setNullParams((p) => ({ ...p, testMassDisplaced: parseFloat(e.target.value) }))
              }
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <button
            onClick={() => setNullParams((p) => ({ ...p, testMassDisplaced: 0.90 }))}
            className="w-full py-2 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/50 rounded-lg font-bold text-xs transition-all shadow-md shadow-emerald-500/10"
          >
            {lang === 'bn' ? '🎯 অটো-স্ন্যাপ: নিরপেক্ষ বিন্দু (L1)' : '🎯 Auto-Snap to L1 Null Point'}
          </button>

          <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1 text-[11px] text-slate-400">
            <div className="text-cyan-400 font-bold">{lang === 'bn' ? 'পৃথিবী-চাঁদ অনুপাত:' : 'Earth-Moon Ratio:'}</div>
            <div>M_Earth = 81 · M_Moon</div>
            <div>x / (d - x) = √(81 / 1) = 9</div>
            <div>x = 0.90 d (৩,৪৫,৯৬০ km)</div>
          </div>
        </div>
      )}

      {/* MODE 3: CG VS CM */}
      {mode === 'cg_vs_cm_divergence' && (
        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>{lang === 'bn' ? 'মেগা-টাওয়ার উচ্চতা H (km)' : 'Tower Height H (km)'}</span>
              <span className="font-mono text-purple-400">{cgCmParams.structureHeightKm} km</span>
            </div>
            <input
              type="range"
              min="100"
              max="2000"
              step="50"
              value={cgCmParams.structureHeightKm}
              onChange={(e) =>
                setCgCmParams((p) => ({ ...p, structureHeightKm: parseFloat(e.target.value) }))
              }
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {[200, 500, 1000, 2000].map((h) => (
              <button
                key={h}
                onClick={() => setCgCmParams((p) => ({ ...p, structureHeightKm: h }))}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-slate-300 font-mono text-[10px]"
              >
                H = {h} km
              </button>
            ))}
          </div>

          <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-[11px] text-slate-400 leading-relaxed">
            {lang === 'bn'
              ? '💡 মেগা-কাঠামোতে নিচের অংশের উপর অভিকর্ষের টান বেশি হওয়ায় ভারকেন্দ্র (CG) সর্বদা ভরকেন্দ্রের (CM) কিছুটা নিচে নেমে আসে।'
              : '💡 Due to Earth gravity gradient, lower sections weigh more, shifting the center of gravity below the center of mass.'}
          </div>
        </div>
      )}

      {/* MODE 4: SUPERPOSITION */}
      {mode === 'superposition_principle' && (
        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>{lang === 'bn' ? 'প্রোব কোণ (Probe Angle)' : 'Probe Angle (Degrees)'}</span>
              <span className="font-mono text-cyan-400">{superParams.probeAngleDeg}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              step="5"
              value={superParams.probeAngleDeg}
              onChange={(e) =>
                setSuperParams((p) => ({ ...p, probeAngleDeg: parseFloat(e.target.value) }))
              }
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>{lang === 'bn' ? 'কৌণিক ভর স্কেল' : 'Vertex Mass Scale'}</span>
              <span className="font-mono text-indigo-400">{superParams.massValue}</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="10"
              value={superParams.massValue}
              onChange={(e) =>
                setSuperParams((p) => ({ ...p, massValue: parseFloat(e.target.value) }))
              }
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
