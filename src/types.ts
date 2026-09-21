export type Language = 'bn' | 'en';
export type AppTheme = 'clean_bright' | 'midnight';
export type PresetMode = 'cg_vs_cm' | 'field_lines' | 'lagrange_null' | 'continuous_ring' | 'binary_system';

export interface SimulationParams {
  preset: PresetMode;
  theme: AppTheme;

  // 1. CG vs CM
  towerHeightKm: number; // km (100 to 4000 km)
  isUniformGravity: boolean;

  // 2. Single Mass Field Lines
  centralMass: number; // 10^24 kg (Earth = 5.97)
  probeDist: number; // 10^6 m (1 to 20)

  // 3. Lagrange L1 Null Point (Binary Masses)
  m1: number; // 10^24 kg (Earth = 5.97)
  m2: number; // 10^24 kg (Moon = 0.073)
  separationDist: number; // 10^6 m (384)
  probePos: number; // 10^6 m

  // 4. Continuous Mass Ring
  ringRadius: number; // 10^6 m
  ringMass: number; // 10^24 kg
  axialX: number; // 10^6 m

  // Visual Toggles
  showVectors: boolean;
  showFieldLines: boolean;
  showEquipotentials: boolean;
  showGrid: boolean;
  slowMo: boolean;
}

export interface TelemetryState {
  elapsedTime: number;

  // CG vs CM
  yCM: number; // km
  yCG: number; // km
  deltaY: number; // km

  // Field Intensity
  eFieldMag: number; // N/kg
  eFieldDir: number; // rad
  e1: number;
  e2: number;
  netE: number; // N/kg
  nullPointX: number; // 10^6 m

  // Ring
  ringE: number; // N/kg
  ringMaxE: number;
  ringMaxX: number;
}
