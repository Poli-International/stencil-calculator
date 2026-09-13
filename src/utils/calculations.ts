import { bodyPartsDatabase } from '../data/bodyParts';
import { UnitSystem, StencilCalculationResult } from '../types';

export function calculateCurvature(
  width: number,
  height: number,
  unit: UnitSystem,
  bodyPartKey: string,
  orientation: string
): StencilCalculationResult {
  const bp = bodyPartsDatabase[bodyPartKey] || bodyPartsDatabase.outer_upper_arm;
  let factor = bp.curvature_factor;

  if (orientation === 'horizontal') {
    factor *= 1.05;
  } else if (orientation === 'wraparound') {
    factor *= 1.10;
  }

  const adjustedWidth = parseFloat((width * factor).toFixed(1));
  const heightFactor = 1 + (factor - 1) * 0.4;
  const adjustedHeight = parseFloat((height * heightFactor).toFixed(1));

  const widthScalePercent = Math.round((adjustedWidth / width) * 100);
  const heightScalePercent = Math.round((adjustedHeight / height) * 100);
  const printerScalePercent = widthScalePercent;

  // Surface areas
  const widthCm = unit === 'inches' ? width * 2.54 : width;
  const heightCm = unit === 'inches' ? height * 2.54 : height;
  const surfaceAreaCm2 = parseFloat((widthCm * heightCm).toFixed(1));
  const surfaceAreaIn2 = parseFloat((surfaceAreaCm2 / 6.4516).toFixed(1));

  const circumferenceCm = bp.circumference_average;
  const wrapPercentage = Math.min(100, Math.round((widthCm / circumferenceCm) * 100));

  // Determine Paper Type
  let paperType: 'single_sheet' | 'spirit_14' | 'grid_tiling' = 'single_sheet';
  let gridCols = 1;
  let gridRows = 1;
  let totalSheets = 1;

  const adjWidthCm = unit === 'inches' ? adjustedWidth * 2.54 : adjustedWidth;
  const adjHeightCm = unit === 'inches' ? adjustedHeight * 2.54 : adjustedHeight;

  if (adjWidthCm <= 20 && adjHeightCm <= 28) {
    paperType = 'single_sheet';
  } else if (adjWidthCm <= 20 && adjHeightCm <= 34.5) {
    paperType = 'spirit_14';
  } else {
    paperType = 'grid_tiling';
    gridCols = Math.ceil(adjWidthCm / 19);
    gridRows = Math.ceil(adjHeightCm / 27);
    totalSheets = gridCols * gridRows;
  }

  // Needle recommendations based on surface area
  let liningNeedles = '03RL - 07RL (0.30mm Long Taper)';
  let shadingNeedles = '07RS, 15CM (Curved Magnum)';
  let inkCapsPrep = '2x Small (#9), 2x Medium (#13)';

  if (surfaceAreaCm2 > 400) {
    liningNeedles = '07RL - 11RL Bold Line & 03RL Tight Detail';
    shadingNeedles = '15CM, 23M1, 27M1 Large Magnum Saturation';
    inkCapsPrep = '2x Small (#9), 4x Medium (#13), 2x Large (#16)';
  } else if (surfaceAreaCm2 > 180) {
    liningNeedles = '05RL - 09RL Standard Outlining';
    shadingNeedles = '09RS, 15CM Smooth Shading Magnum';
    inkCapsPrep = '2x Small (#9), 3x Medium (#13)';
  }

  return {
    originalWidth: width,
    originalHeight: height,
    adjustedWidth,
    adjustedHeight,
    unit,
    bodyPartKey,
    bodyPartName: bp.name,
    orientation,
    curvatureFactor: parseFloat(factor.toFixed(2)),
    widthScalePercent,
    heightScalePercent,
    printerScalePercent,
    surfaceAreaCm2,
    surfaceAreaIn2,
    wrapPercentage,
    paperType,
    gridCols,
    gridRows,
    totalSheets,
    liningNeedles,
    shadingNeedles,
    inkCapsPrep,
    timestamp: new Date().toISOString()
  };
}

export function convertUnits(val: number, from: UnitSystem, to: UnitSystem): number {
  if (from === to) return val;
  if (from === 'inches' && to === 'cm') {
    return parseFloat((val * 2.54).toFixed(1));
  }
  return parseFloat((val / 2.54).toFixed(1));
}
