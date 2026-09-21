import React from 'react';
import { MathView } from './MathView';
import { P39Mode } from '../types';
import { BookOpen, X } from 'lucide-react';

interface MathFormulaOverlayProps {
  mode: P39Mode;
  show: boolean;
  onClose: () => void;
  lang: 'en' | 'bn';
}

export const MathFormulaOverlay: React.FC<MathFormulaOverlayProps> = ({
  mode,
  show,
  onClose,
  lang,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl max-w-3xl w-full p-6 text-slate-100 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-6 h-6 text-indigo-400" />
          <h2 className="text-xl font-bold text-white">
            {lang === 'bn' ? 'P-39 গাণিতিক সমীকরণ ও বিশ্লেষণ' : 'P-39 Mathematical Derivations & Field Physics'}
          </h2>
        </div>

        <div className="space-y-6 text-sm">
          {/* CG vs CM */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h3 className="text-indigo-400 font-bold text-base">
              {lang === 'bn' ? '১. ভারকেন্দ্র (CG) বনাম ভরকেন্দ্র (CM)' : '1. Center of Gravity (CG) vs. Center of Mass (CM)'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-900 rounded-lg">
                <div className="text-xs text-slate-400 mb-1">{lang === 'bn' ? 'ভরকেন্দ্র (Center of Mass)' : 'Center of Mass'}</div>
                <MathView math="\vec{R}_{\text{CM}} = \frac{\sum m_i \vec{r}_i}{\sum m_i}" block />
                <p className="text-[11px] text-slate-400 mt-1">
                  {lang === 'bn' ? 'বস্তুর ভরের ভৌগোলিক কেন্দ্রবিন্দু।' : 'Geometric centroid of mass distribution.'}
                </p>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg">
                <div className="text-xs text-slate-400 mb-1">{lang === 'bn' ? 'ভারকেন্দ্র (Center of Gravity)' : 'Center of Gravity'}</div>
                <MathView math="\vec{R}_{\text{CG}} = \frac{\sum m_i g_i \vec{r}_i}{\sum m_i g_i}" block />
                <p className="text-[11px] text-slate-400 mt-1">
                  {lang === 'bn' ? 'বস্তুর মোট ওজনের ক্রিয়া বিন্দু।' : 'Point of action of total gravitational weight.'}
                </p>
              </div>
            </div>
            <div className="p-2.5 bg-indigo-950/40 border border-indigo-500/30 rounded-lg text-xs text-indigo-300">
              {lang === 'bn'
                ? 'সুষম মহাকর্ষীয় ক্ষেত্রে (g_i = g): CG ও CM একই বিন্দুতে অবস্থান করে। কিন্তু অতি উচ্চ কাঠামোর জন্য পৃথিবীর অভিকর্ষের পরিবর্তনের কারণে CG সর্বদা CM-এর নিচে থাকে।'
                : 'In a uniform gravitational field (g_i = g): CG ≡ CM. In an inverse-square gradient, lower parts experience higher g, shifting CG strictly below CM.'}
            </div>
          </div>

          {/* Field Intensity */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="text-cyan-400 font-bold text-base">
              {lang === 'bn' ? '২. মহাকর্ষীয় ক্ষেত্র প্রাবল্য (Gravitational Field Intensity)' : '2. Gravitational Field Intensity E'}
            </h3>
            <p className="text-slate-300">
              {lang === 'bn'
                ? 'মহাকর্ষীয় ক্ষেত্রের কোনো বিন্দুতে একক ধনাত্মক ভর স্থাপন করলে তা যে আকর্ষণ বল অনুভব করে:'
                : 'Force experienced per unit mass placed at a point in the gravitational field:'}
            </p>
            <div className="p-3 bg-slate-900 rounded-lg text-center font-mono text-cyan-300">
              <MathView math="\vec{E} = \frac{\vec{F}}{m_0} = - \frac{GM}{r^2} \hat{r} = - \frac{GM}{r^3} \vec{r}" block />
            </div>
            <p className="text-xs text-slate-400">
              {lang === 'bn'
                ? 'একক: N/kg অথবা m/s² (এটি মূলত ঐ বিন্দুতে অভিকর্ষজ ত্বরণ g-এর সমান)।'
                : 'Units: N/kg or m/s² (numerically equal to gravitational acceleration g).'}
            </p>
          </div>

          {/* Superposition & Null Point */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="text-amber-400 font-bold text-base">
              {lang === 'bn' ? '৩. উপরিলেপন নীতি ও নিরপেক্ষ বিন্দু (Null Point)' : '3. Superposition Principle & Null Point'}
            </h3>
            <div className="p-3 bg-slate-900 rounded-lg text-center font-mono text-amber-300">
              <MathView math="\vec{E}_{\text{net}} = \sum_{i=1}^n \vec{E}_i = -G \sum_{i=1}^n \frac{M_i}{r_i^2}\hat{r}_i" block />
            </div>
            <p className="text-slate-300 text-xs mt-2">
              {lang === 'bn'
                ? 'দুটি ভর M₁ ও M₂-এর মধ্যবর্তী নিরপেক্ষ বিন্দুতে নিট প্রাবল্য শূন্য: E₁ = E₂'
                : 'At the neutral / null point between two masses M₁ and M₂, net field intensity vanishes: E₁ = E₂'}
            </p>
            <div className="p-2.5 bg-slate-900 rounded-lg text-center font-mono text-emerald-400">
              <MathView math="x = \frac{d}{1 + \sqrt{M_2 / M_1}}" block />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
