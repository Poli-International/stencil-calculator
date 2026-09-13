import { PlacementTemplate } from '../types';

export const projectTemplatesDatabase: PlacementTemplate[] = [
  {
    id: 'traditional_half_sleeve',
    name: 'Traditional Half Sleeve',
    category: 'sleeves',
    body_parts: ['outer_upper_arm', 'inner_upper_arm'],
    dimensions_cm: { width: 34, height: 30 },
    dimensions_inches: { width: 13.4, height: 11.8 },
    difficulty: 'intermediate',
    notes: 'Classic placement. Wraps around entire upper arm. Plan for muscle flexion.'
  },
  {
    id: 'full_sleeve_japanese',
    name: 'Japanese Full Sleeve',
    category: 'sleeves',
    body_parts: ['outer_upper_arm', 'inner_upper_arm', 'forearm_outer', 'forearm_inner', 'wrist'],
    dimensions_cm: { width: 34, height: 56 },
    dimensions_inches: { width: 13.4, height: 22.0 },
    difficulty: 'advanced',
    notes: 'Large project. Traditional Japanese designs flow with body movement. Consider wraparound composition.'
  },
  {
    id: 'forearm_sleeve',
    name: 'Forearm Sleeve (Elbow to Wrist)',
    category: 'sleeves',
    body_parts: ['forearm_outer', 'forearm_inner', 'wrist'],
    dimensions_cm: { width: 26, height: 26 },
    dimensions_inches: { width: 10.2, height: 10.2 },
    difficulty: 'intermediate',
    notes: 'Popular first large piece. Relatively flat surface, good for detailed work.'
  },
  {
    id: 'full_back_piece',
    name: 'Full Back Piece',
    category: 'back',
    body_parts: ['back_upper', 'lower_back', 'full_back'],
    dimensions_cm: { width: 45, height: 60 },
    dimensions_inches: { width: 17.7, height: 23.6 },
    difficulty: 'advanced',
    notes: 'Massive project. Relatively flat canvas. Excellent for highly detailed work.'
  },
  {
    id: 'upper_back_panel',
    name: 'Upper Back Panel (Between Shoulders)',
    category: 'back',
    body_parts: ['back_upper'],
    dimensions_cm: { width: 35, height: 28 },
    dimensions_inches: { width: 13.8, height: 11.0 },
    difficulty: 'intermediate',
    notes: 'Popular placement. Flat surface, ideal for geometric or mandala designs.'
  },
  {
    id: 'chest_panel',
    name: 'Chest Panel (Pec to Pec)',
    category: 'chest',
    body_parts: ['chest'],
    dimensions_cm: { width: 38, height: 22 },
    dimensions_inches: { width: 15.0, height: 8.7 },
    difficulty: 'advanced',
    notes: 'Significant curvature. Design wraps over pectoral muscles.'
  },
  {
    id: 'thigh_panel',
    name: 'Thigh Panel (Outer)',
    category: 'legs',
    body_parts: ['outer_thigh'],
    dimensions_cm: { width: 28, height: 38 },
    dimensions_inches: { width: 11.0, height: 15.0 },
    difficulty: 'intermediate',
    notes: 'Large canvas. Consider standing vs sitting position during placement.'
  },
  {
    id: 'rib_panel',
    name: 'Rib / Side Panel',
    category: 'torso',
    body_parts: ['ribs'],
    dimensions_cm: { width: 22, height: 35 },
    dimensions_inches: { width: 8.7, height: 13.8 },
    difficulty: 'advanced',
    notes: 'Significant torso curvature. Breathing expands the rib cage during placement.'
  }
];
