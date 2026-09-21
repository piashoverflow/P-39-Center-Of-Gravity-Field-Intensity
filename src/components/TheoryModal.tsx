import React from 'react';
import { Language } from '../types';
import { t } from '../utils/i18n';
import { X, BookOpen, GraduationCap } from 'lucide-react';

interface TheoryModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
}

export const TheoryModal: React.FC<TheoryModalProps> = ({
  language,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-5 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5 text-slate-900">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl border border-purple-200">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                {language === 'bn' ? 'তত্ত্ব ও সমীকরণ বিশ্লেষণ (P-39)' : 'Theory & Derivations (P-39)'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                HSC Physics 1st Paper, Chapter 6: ভারকেন্দ্র, মহাকর্ষীয় ক্ষেত্র ও প্রাবল্য
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6 text-slate-700 text-sm leading-relaxed">
          {/* Section 1: CG vs CM */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
              ১. ভারকেন্দ্র (Center of Gravity) বনাম ভরকেন্দ্র (Center of Mass)
            </h3>
            <p>
              <strong>ভরকেন্দ্র (Center of Mass - CM):</strong> কোনো বস্তুর সমগ্র ভর যে বিন্দুতে কেন্দ্রীভূত আছে বলে বিবেচনা করা যায়, তাকে ভরকেন্দ্র বলে: <strong>y_CM = (∑ m_i y_i) / M</strong>। এটি অভিকর্ষ ক্ষেত্রের ওপর নির্ভর করে না।
            </p>
            <p>
              <strong>ভারকেন্দ্র (Center of Gravity - CG):</strong> কোনো বস্তুর বিভিন্ন অংশের ওপর ক্রিয়াশীল সমান্তরাল অভিকর্ষ বলসমূহের লব্ধি যে নির্দিষ্ট বিন্দুর মধ্য দিয়ে ক্রিয়া করে: <strong>y_CG = [∫ y · g(y) dm] / [∫ g(y) dm]</strong>।
            </p>
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs font-bold text-purple-950">
              ★ সুষম মহাকর্ষীয় ক্ষেত্রে (g = ধ্রুবক): CG ও CM একই বিন্দুতে সমাপতিত হয় (CG ≡ CM)।<br/>
              ★ অসম বা পরিবর্তনশীল মহাকর্ষীয় ক্ষেত্রে (g ∝ 1/r²): উচ্চতা বাড়লে g কমে, ফলে বস্তুর নিচের অংশ ওপরের অংশের চেয়ে বেশি ভারী অনুভূত হয়। তাই <strong>ভারকেন্দ্র ভরকেন্দ্রের নিচে অবস্থান করে (y_CG &lt; y_CM)</strong>!
            </div>
          </div>

          {/* Section 2: Gravitational Field & Intensity */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              ২. মহাকর্ষীয় ক্ষেত্র ও প্রাবল্য (Gravitational Field Intensity)
            </h3>
            <p>
              মহাকর্ষীয় ক্ষেত্রের কোনো বিন্দুতে একক ভরের কোনো বস্তু স্থাপন করলে তা যে পরিমাণ আকর্ষণ বল অনুভব করে, তাকে ঐ বিন্দুর মহাকর্ষীয় প্রাবল্য E⃗ বলে:
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-center text-xs font-bold text-slate-900">
              E⃗ = F⃗ / m₀ = - (GM / r²) · r̂
            </div>
            <p className="text-xs text-slate-600">
              প্রাবল্য একটি ভেক্টর রাশি। এর মাত্রা [LT⁻²] এবং একক N/kg বা m/s² (অভিকর্ষজ ত্বরণের সমতুল্য)।
            </p>
          </div>

          {/* Section 3: Lagrange L1 Null Point */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              ৩. নিরপেক্ষ বিন্দু বা ল্যাগ্রাঞ্জ L1 বিন্দু (Lagrange L1 Null Point)
            </h3>
            <p>
              দুটি ভর M₁ ও M₂ এর মধ্যবর্তী দূরত্ব D হলে, তাদের সংযোগকারী রেখার যে বিন্দুতে দুটি ভরের মহাকর্ষীয় প্রাবল্য পরস্পর সমান ও বিপরীতমুখী হয়, সেখানে লব্ধি প্রাবল্য E_net = 0 হয়:
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-center text-xs font-bold text-slate-900">
              GM₁ / x² = GM₂ / (D - x)²  ➔  x = D / [1 + √(M₂ / M₁)]
            </div>
          </div>

          {/* Section 4: Ring Axial Field */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-600" />
              ৪. সুষম রিং এর অক্ষীয় প্রাবল্য (Axial Intensity of a Ring)
            </h3>
            <p>
              a ব্যাসার্ধ এবং M ভরের একটি বৃত্তাকার রিং-এর কেন্দ্র হতে অক্ষ বরাবর x দূরত্বে মহাকর্ষীয় প্রাবল্য:
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-center text-xs font-bold text-slate-900">
              E_x = GMx / (a² + x²)^(3/2)
            </div>
            <p className="text-xs text-slate-700">
              ★ কেন্দ্রে (x = 0): E_x = 0 (প্রতিসাম্যের কারণে)।<br/>
              ★ সর্বোচ্চ প্রাবল্য: dE/dx = 0 করে পাওয়া যায় <strong>x = a / √2</strong>। তখন E_max = 2GM / (3√3 a²)।
            </p>
          </div>

          {/* Section 5: Udvash Admission Tips */}
          <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border border-red-200 space-y-2">
            <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
              <GraduationCap className="w-4 h-4" />
              <span>উদ্ভাস ভর্তি পরীক্ষা স্পেশাল টিপস (BUET / Medical / DU Admission)</span>
            </div>
            <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
              <li>মহাকর্ষীয় প্রাবল্য এবং বিভবের মধ্যে সম্পর্ক: <strong>E = - dV/dr</strong> (বিভব হ্রাসের হারই প্রাবল্য)।</li>
              <li>পৃথিবী ও চাঁদের মধ্যবর্তী নিরপেক্ষ বিন্দু চাঁদের কাছাকাছি অবস্থান করে, কারণ M_moon ≪ M_earth।</li>
              <li>উপপাতন নীতি (Principle of Superposition): একাধিক কণার ক্ষেত্রে কোনো বিন্দুতে মোট প্রাবল্য প্রতিটি কণার জন্য সৃষ্ট পৃথক প্রাবল্যের <strong>ভেক্টর যোগফল</strong>: E⃗_net = ∑ E⃗_i।</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
