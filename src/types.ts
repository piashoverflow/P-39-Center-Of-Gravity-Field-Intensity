export type P39Mode = 'field_vector_grid' | 'null_point_hunter' | 'cg_vs_cm_divergence' | 'superposition_principle';

export interface FieldGridParams {
  m1: number; // 10^24 kg
  m2: number;
  gridResolution: number; // density of vector arrows
  showFieldLines: boolean;
  showPotentialHeatmap: boolean;
}

export interface NullPointParams {
  m1Ratio: number; // e.g. 81 for Earth
  m2Ratio: number; // e.g. 1 for Moon
  totalDistanceKm: number; // 384,400 km
  testMassDisplaced: number;
}

export interface CgCmParams {
  structureHeightKm: number; // 100 to 2000 km
  earthRadiusKm: number; // 6371 km
  structureType: 'uniform_rod' | 'tapered_tower';
}

export interface SuperpositionParams {
  geometry: 'line' | 'triangle' | 'square';
  massValue: number;
  probeAngleDeg: number;
}
