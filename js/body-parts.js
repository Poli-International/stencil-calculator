// Body Part Curvature Database
// Curvature factors for stencil sizing compensation

const bodyPartCurvature = {
  // ===== ARMS =====
  outer_upper_arm: {
    name: 'Outer Upper Arm (Shoulder to Elbow)',
    curvature_factor: 1.15,
    description: 'Moderate curvature around bicep',
    wrap_threshold: 50,
    placement_notes: 'Design wraps around bicep. Consider muscle flexion.',
    recommended_orientation: ['vertical', 'wraparound'],
    circumference_average: 33 // cm
  },

  inner_upper_arm: {
    name: 'Inner Upper Arm',
    curvature_factor: 1.18,
    description: 'Higher curvature on inner bicep/tricep area',
    wrap_threshold: 45,
    placement_notes: 'More sensitive area. Skin stretches more when arm extended.',
    recommended_orientation: ['vertical'],
    circumference_average: 33
  },

  forearm_outer: {
    name: 'Outer Forearm',
    curvature_factor: 1.12,
    description: 'Slight curvature, relatively flat surface',
    wrap_threshold: 55,
    placement_notes: 'Popular placement. Good visibility. Less distortion.',
    recommended_orientation: ['vertical', 'horizontal'],
    circumference_average: 26
  },

  forearm_inner: {
    name: 'Inner Forearm',
    curvature_factor: 1.14,
    description: 'Moderate curvature with muscle definition',
    wrap_threshold: 50,
    placement_notes: 'Flatter when arm extended. Consider wrist movement.',
    recommended_orientation: ['vertical'],
    circumference_average: 26
  },

  wrist: {
    name: 'Wrist',
    curvature_factor: 1.20,
    description: 'Small circumference, high curvature',
    wrap_threshold: 40,
    placement_notes: 'Very small area. Wraps significantly. Wrist movement affects design.',
    recommended_orientation: ['wraparound', 'horizontal'],
    circumference_average: 16
  },

  full_sleeve: {
    name: 'Full Sleeve (Shoulder to Wrist)',
    curvature_factor: 1.18,
    description: 'Variable curvature across entire arm',
    wrap_threshold: 45,
    placement_notes: 'Large project. Plan sessions for shoulder, bicep, elbow, forearm separately.',
    recommended_orientation: ['vertical', 'wraparound'],
    circumference_average: 29 // average
  },

  half_sleeve: {
    name: 'Half Sleeve (Shoulder to Elbow OR Elbow to Wrist)',
    curvature_factor: 1.15,
    description: 'Moderate curvature, large canvas',
    wrap_threshold: 50,
    placement_notes: 'Popular size. Can be upper (shoulder-elbow) or lower (elbow-wrist).',
    recommended_orientation: ['vertical', 'wraparound'],
    circumference_average: 29
  },

  // ===== LEGS =====
  outer_thigh: {
    name: 'Outer Thigh',
    curvature_factor: 1.14,
    description: 'Moderate curvature, large flat surface',
    wrap_threshold: 55,
    placement_notes: 'Large canvas. Good for detailed work. Consider sitting position.',
    recommended_orientation: ['vertical', 'horizontal'],
    circumference_average: 55
  },

  inner_thigh: {
    name: 'Inner Thigh',
    curvature_factor: 1.20,
    description: 'Higher curvature, sensitive area',
    wrap_threshold: 45,
    placement_notes: 'Sensitive placement. Skin stretches significantly when legs move.',
    recommended_orientation: ['vertical'],
    circumference_average: 55
  },

  calf: {
    name: 'Calf',
    curvature_factor: 1.16,
    description: 'Moderate curvature with muscle definition',
    wrap_threshold: 50,
    placement_notes: 'Popular placement. Muscle flexion affects design appearance.',
    recommended_orientation: ['vertical', 'horizontal'],
    circumference_average: 38
  },

  shin: {
    name: 'Shin/Front of Lower Leg',
    curvature_factor: 1.12,
    description: 'Relatively flat, bony area',
    wrap_threshold: 55,
    placement_notes: 'Flatter surface but bonier. Can be more painful.',
    recommended_orientation: ['vertical'],
    circumference_average: 38
  },

  ankle: {
    name: 'Ankle',
    curvature_factor: 1.22,
    description: 'Small area, high curvature',
    wrap_threshold: 40,
    placement_notes: 'Very small area. Bony. Significant wrapping. Foot movement affects design.',
    recommended_orientation: ['wraparound', 'horizontal'],
    circumference_average: 23
  },

  full_leg_sleeve: {
    name: 'Full Leg Sleeve (Hip to Ankle)',
    curvature_factor: 1.17,
    description: 'Variable curvature, very large project',
    wrap_threshold: 45,
    placement_notes: 'Massive project. Plan multiple sessions: thigh, knee, calf, ankle.',
    recommended_orientation: ['vertical', 'wraparound'],
    circumference_average: 45 // average
  },

  // ===== TORSO =====
  chest: {
    name: 'Chest',
    curvature_factor: 1.20,
    description: 'Significant curvature across pectoral area',
    wrap_threshold: 40,
    placement_notes: 'Curves significantly. Design stretches across pecs. Breathing affects appearance.',
    recommended_orientation: ['horizontal', 'diagonal'],
    circumference_average: 100 // full chest circumference
  },

  ribs: {
    name: 'Ribs/Side',
    curvature_factor: 1.25,
    description: 'Very high curvature, wraps from back to front',
    wrap_threshold: 35,
    placement_notes: 'Extreme curvature. Painful area. Breathing and movement affect design significantly.',
    recommended_orientation: ['vertical', 'diagonal'],
    circumference_average: 90
  },

  stomach: {
    name: 'Stomach/Abdomen',
    curvature_factor: 1.18,
    description: 'Moderate curvature, varies with body type',
    wrap_threshold: 45,
    placement_notes: 'Skin elasticity varies. Weight changes affect design. Consider body position.',
    recommended_orientation: ['horizontal', 'vertical'],
    circumference_average: 85
  },

  lower_back: {
    name: 'Lower Back',
    curvature_factor: 1.14,
    description: 'Relatively flat surface with slight curve',
    wrap_threshold: 50,
    placement_notes: 'Popular large-scale placement. Relatively flat canvas.',
    recommended_orientation: ['horizontal', 'vertical'],
    circumference_average: 90
  },

  upper_back: {
    name: 'Upper Back (Between Shoulders)',
    curvature_factor: 1.12,
    description: 'Flatter surface, good for detailed work',
    wrap_threshold: 55,
    placement_notes: 'Excellent canvas for detailed designs. Relatively low distortion.',
    recommended_orientation: ['horizontal', 'vertical'],
    circumference_average: 95
  },

  shoulder: {
    name: 'Shoulder/Deltoid',
    curvature_factor: 1.22,
    description: 'Round surface, wraps over muscle',
    wrap_threshold: 40,
    placement_notes: 'Very round surface. Design wraps from front to back. Arm movement affects appearance.',
    recommended_orientation: ['wraparound', 'circular'],
    circumference_average: 40 // shoulder circumference
  },

  full_back: {
    name: 'Full Back (Neck to Waist)',
    curvature_factor: 1.15,
    description: 'Large canvas, variable curvature',
    wrap_threshold: 50,
    placement_notes: 'Massive project. Relatively flat center with curves at sides. Multiple sessions required.',
    recommended_orientation: ['vertical', 'horizontal'],
    circumference_average: 92
  },

  // ===== NECK & HEAD =====
  neck_front: {
    name: 'Front of Neck',
    curvature_factor: 1.20,
    description: 'Curved surface, visible area',
    wrap_threshold: 40,
    placement_notes: 'Highly visible. Sensitive area. Swallowing and head movement affect design.',
    recommended_orientation: ['vertical', 'small'],
    circumference_average: 35
  },

  neck_side: {
    name: 'Side of Neck',
    curvature_factor: 1.18,
    description: 'Moderate curvature, popular placement',
    wrap_threshold: 45,
    placement_notes: 'Popular placement. Head movement affects visibility and healing.',
    recommended_orientation: ['vertical', 'small'],
    circumference_average: 35
  },

  neck_back: {
    name: 'Back of Neck',
    curvature_factor: 1.16,
    description: 'Moderate curvature at base of skull',
    wrap_threshold: 45,
    placement_notes: 'Often extends into hairline. Head movement during healing.',
    recommended_orientation: ['horizontal', 'small'],
    circumference_average: 35
  },

  behind_ear: {
    name: 'Behind Ear',
    curvature_factor: 1.25,
    description: 'Very small, highly curved area',
    wrap_threshold: 30,
    placement_notes: 'Tiny placement. Bony. Wraps significantly. Difficult to place stencil.',
    recommended_orientation: ['small', 'vertical'],
    circumference_average: 12
  },

  // ===== HANDS & FEET =====
  hand_top: {
    name: 'Top of Hand',
    curvature_factor: 1.22,
    description: 'Curved surface with prominent tendons',
    wrap_threshold: 40,
    placement_notes: 'Bony area with tendons. Hand movement affects design. Fades faster.',
    recommended_orientation: ['horizontal', 'diagonal'],
    circumference_average: 21
  },

  fingers: {
    name: 'Fingers',
    curvature_factor: 1.30,
    description: 'Very small, extreme curvature',
    wrap_threshold: 25,
    placement_notes: 'Tiny area. Wraps around finger. Constant movement. Fades quickly.',
    recommended_orientation: ['wraparound', 'small'],
    circumference_average: 6 // per finger
  },

  foot_top: {
    name: 'Top of Foot',
    curvature_factor: 1.20,
    description: 'Curved surface, bony area',
    wrap_threshold: 40,
    placement_notes: 'Bony placement. Foot movement and footwear affect healing and visibility.',
    recommended_orientation: ['horizontal', 'vertical'],
    circumference_average: 24
  }
};

// Helper function to get body part by key
function getBodyPart(key) {
  return bodyPartCurvature[key] || null;
}

// Helper function to get all body parts in a category
function getBodyPartsByCategory() {
  return {
    arms: ['outer_upper_arm', 'inner_upper_arm', 'forearm_outer', 'forearm_inner', 'wrist', 'full_sleeve', 'half_sleeve'],
    legs: ['outer_thigh', 'inner_thigh', 'calf', 'shin', 'ankle', 'full_leg_sleeve'],
    torso: ['chest', 'ribs', 'stomach', 'lower_back', 'upper_back', 'shoulder', 'full_back'],
    neck_head: ['neck_front', 'neck_side', 'neck_back', 'behind_ear'],
    hands_feet: ['hand_top', 'fingers', 'foot_top']
  };
}

// Helper function to get curvature factor
function getCurvatureFactor(bodyPartKey, orientation = 'vertical') {
  const bodyPart = getBodyPart(bodyPartKey);
  if (!bodyPart) return 1.0; // Default no adjustment

  let factor = bodyPart.curvature_factor;

  // Adjust factor based on orientation
  if (orientation === 'wraparound') {
    factor *= 1.10; // 10% more compensation for wraparound designs
  } else if (orientation === 'horizontal') {
    factor *= 1.05; // 5% more compensation for horizontal orientation
  }

  return factor;
}

// Helper function to check if design fits within body part
function checkDesignFit(bodyPartKey, designWidth, orientation) {
  const bodyPart = getBodyPart(bodyPartKey);
  if (!bodyPart) return { fits: false, message: 'Invalid body part' };

  const circumference = bodyPart.circumference_average;
  const halfCircumference = circumference * 0.5; // Maximum practical width

  // Calculate what percentage of circumference the design uses
  const wrapPercentage = (designWidth / circumference) * 100;

  if (wrapPercentage > 100) {
    return {
      fits: false,
      wrapPercentage: wrapPercentage.toFixed(1),
      message: `Design is too large! It would wrap ${wrapPercentage.toFixed(1)}% around the body part.`
    };
  } else if (wrapPercentage > bodyPart.wrap_threshold) {
    return {
      fits: true,
      wrapPercentage: wrapPercentage.toFixed(1),
      message: `Design will wrap ${wrapPercentage.toFixed(1)}% around body part. Consider significant distortion.`,
      warning: true
    };
  } else {
    return {
      fits: true,
      wrapPercentage: wrapPercentage.toFixed(1),
      message: `Design fits well! Uses ${wrapPercentage.toFixed(1)}% of circumference.`,
      warning: false
    };
  }
}
