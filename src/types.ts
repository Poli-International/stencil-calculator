/**
 * Types & Interfaces for Tattoo Stencil Calculator (Poli International)
 */

export type LanguageCode = 'en' | 'fr' | 'it' | 'de' | 'es' | 'pt' | 'nl';
export type UnitSystem = 'cm' | 'inches';

export interface BodyPartCurvature {
  name: string;
  curvature_factor: number;
  description: string;
  wrap_threshold: number;
  placement_notes: string;
  recommended_orientation: string[];
  circumference_average: number; // in cm
  category: 'arms' | 'legs' | 'torso' | 'head' | 'extremities';
  epidermal_thickness_mm: number;
  dermal_thickness_mm: number;
  elasticity_rating: 'Low' | 'Moderate' | 'High' | 'Extreme';
  vascularity_index: 'Low' | 'Moderate' | 'High';
  recommended_needle_depth_mm: string;
  stretch_technique: string;
}

export interface StencilCalculationResult {
  originalWidth: number;
  originalHeight: number;
  adjustedWidth: number;
  adjustedHeight: number;
  unit: UnitSystem;
  bodyPartKey: string;
  bodyPartName: string;
  orientation: string;
  curvatureFactor: number;
  widthScalePercent: number;
  heightScalePercent: number;
  printerScalePercent: number;
  surfaceAreaCm2: number;
  surfaceAreaIn2: number;
  wrapPercentage: number;
  paperType: 'single_sheet' | 'spirit_14' | 'grid_tiling';
  gridCols?: number;
  gridRows?: number;
  totalSheets?: number;
  liningNeedles: string;
  shadingNeedles: string;
  inkCapsPrep: string;
  timestamp: string;
}

export interface PlacementTemplate {
  id: string;
  name: string;
  category: 'sleeves' | 'back' | 'chest' | 'legs' | 'torso' | 'standalone';
  body_parts: string[];
  dimensions_cm: { width: number; height: number };
  dimensions_inches: { width: number; height: number };
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  notes: string;
}

export interface SavedConfiguration {
  id: string;
  name: string;
  timestamp: string;
  tab: string;
  calculation?: StencilCalculationResult;
  placement?: {
    width: number;
    bodyPart: string;
    wrapPercentage: number;
  };
}
