import { Language } from '../types';

export const translations = {
  bn: {
    // Header
    brandTitle: 'ভারকেন্দ্র ও মহাকর্ষীয় প্রাবল্য',
    brandSubtitle: 'ল্যাব',
    tabCGCM: 'ভারকেন্দ্র বনাম ভরকেন্দ্র (CG vs CM)',
    tabFieldLines: 'মহাকর্ষ বলরেখা ও প্রাবল্য',
    tabLagrange: 'ল্যাগ্রাঞ্জ L1 বিন্দু (Null Point)',
    tabRing: 'রিং এর অক্ষীয় প্রাবল্য (Ring E_x)',
    tabBinary: 'বাইনারি সিস্টেম ও উপপাতন',
    theoryButton: 'থিওরি ও সূত্রাবলী',
    udvashBadge: 'উদ্ভাস (Udvash)',

    // Controls
    controlParameters: 'কন্ট্রোল প্যারামিটারস',
    resetDefaults: 'ডিফল্ট রিসেট',
    towerHeight: 'টাওয়ার / স্পেস এলিভেটর উচ্চতা (H)',
    gravityFieldType: 'অভিকর্ষ ক্ষেত্রের প্রকৃতি:',
    uniformGravity: 'সুষম ক্ষেত্র (Uniform g: CG ≡ CM)',
    nonUniformGravity: 'প্রাকৃতিক পরিবর্তনশীল ক্ষেত্র (g ∝ 1/r²)',
    centralMass: 'কেন্দ্রীয় বস্তুর ভর (M)',
    probeDist: 'টেস্ট কণার দূরত্ব (r)',
    massM1: '১ম ভর M₁ (পৃথিবী)',
    massM2: '২য় ভর M₂ (চাঁদ)',
    probePosition: 'টেস্ট কণার অবস্থান (x)',
    ringRadius: 'রিং এর ব্যাসার্ধ (a)',
    axialX: 'অক্ষীয় দূরত্ব (x)',

    // Toggles
    visualizerToggles: 'ভিজ্যুয়ালাইজার অপশনস',
    showVectors: 'প্রাবল্য ভেক্টর (E⃗ Vectors)',
    showFieldLines: 'মহাকর্ষ বলরেখা (Field Lines)',
    showEquipotentials: 'সমবিভব তল (Equipotentials)',
    showGrid: 'স্থানাঙ্ক গ্রিড (Grid)',

    // Telemetry
    telemetryTitle: 'লাইভ পরিমাপ ও টেলিমেট্রি',
    yCM: 'ভরকেন্দ্রের উচ্চতা (y_CM = H/2)',
    yCG: 'ভারকেন্দ্রের উচ্চতা (y_CG)',
    deltaY: 'পার্থক্য (y_CM - y_CG)',
    netField: 'লব্ধি মহাকর্ষীয় প্রাবল্য (|E⃗|)',
    nullPointX: 'নিরপেক্ষ বিন্দু L1 (E_net = 0)',
    ringMaxField: 'সর্বোচ্চ প্রাবল্য (E_max at x = a/√2)',

    // Math Box
    exactMathTitle: 'গাণিতিক সমীকরণ ও বিশ্লেষণ',
    play: 'শুরু করুন',
    pause: 'থামুন',
    step: 'ধাপ (Step)',
    slowMo: '০.২৫x স্লো-মো',
    reset: 'রিসেট',
    fullScreen: 'পূর্ণ পর্দা',
    exitFullScreen: 'ছোট পর্দা',
  },
  en: {
    // Header
    brandTitle: 'Center of Gravity & Field Intensity',
    brandSubtitle: 'LAB',
    tabCGCM: 'CG vs CM Divergence',
    tabFieldLines: 'Field Lines & Intensity',
    tabLagrange: 'Lagrange L1 Null Point',
    tabRing: 'Ring Axial Intensity',
    tabBinary: 'Binary Vector Superposition',
    theoryButton: 'Theory & Derivations',
    udvashBadge: 'Udvash',

    // Controls
    controlParameters: 'Control Parameters',
    resetDefaults: 'Reset Defaults',
    towerHeight: 'Tower Height (H)',
    gravityFieldType: 'Gravity Field Nature:',
    uniformGravity: 'Uniform Field (CG ≡ CM)',
    nonUniformGravity: 'Non-Uniform Field (g ∝ 1/r²)',
    centralMass: 'Central Mass (M)',
    probeDist: 'Probe Distance (r)',
    massM1: 'Mass M₁ (Primary)',
    massM2: 'Mass M₂ (Secondary)',
    probePosition: 'Probe Position (x)',
    ringRadius: 'Ring Radius (a)',
    axialX: 'Axial Distance (x)',

    // Toggles
    visualizerToggles: 'Visualizer Options',
    showVectors: 'Intensity Vectors (E⃗)',
    showFieldLines: 'Field Lines',
    showEquipotentials: 'Equipotentials',
    showGrid: 'Coordinate Grid',

    // Telemetry
    telemetryTitle: 'Live Field Telemetry',
    yCM: 'Center of Mass (y_CM = H/2)',
    yCG: 'Center of Gravity (y_CG)',
    deltaY: 'Divergence (y_CM - y_CG)',
    netField: 'Net Field Intensity (|E⃗|)',
    nullPointX: 'Lagrange L1 Null Point',
    ringMaxField: 'Max Intensity (E_max at x = a/√2)',

    // Math Box
    exactMathTitle: 'Mathematical Proof & Substitutions',
    play: 'Play',
    pause: 'Pause',
    step: 'Step',
    slowMo: '0.25x Slow-Mo',
    reset: 'Reset',
    fullScreen: 'Fullscreen',
    exitFullScreen: 'Exit Fullscreen',
  },
};

export function t(lang: Language, key: keyof typeof translations['bn']): string {
  return translations[lang][key] || translations['bn'][key] || key;
}
