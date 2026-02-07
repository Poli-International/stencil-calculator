// Placement Templates Database
// Pre-built templates for common tattoo placements and projects

const placementTemplates = {
  // ===== SLEEVE TEMPLATES =====
  traditional_half_sleeve: {
    name: 'Traditional Half Sleeve',
    category: 'sleeves',
    body_parts: ['outer_upper_arm', 'inner_upper_arm'],
    estimated_dimensions: {
      width: 28,
      height: 25,
      unit: 'cm'
    },
    session_plan: {
      total_sessions: 3,
      sessions: [
        { session: 1, focus: 'Outline entire sleeve', hours: 4 },
        { session: 2, focus: 'Shading and color (outer)', hours: 5 },
        { session: 3, focus: 'Shading and color (inner), touch-ups', hours: 4 }
      ]
    },
    difficulty: 'intermediate',
    notes: 'Classic placement. Wraps around entire upper arm. Plan for muscle flexion.'
  },

  full_sleeve_japanese: {
    name: 'Japanese Full Sleeve',
    category: 'sleeves',
    body_parts: ['full_sleeve', 'shoulder'],
    estimated_dimensions: {
      width: 26,
      height: 55,
      unit: 'cm'
    },
    session_plan: {
      total_sessions: 6,
      sessions: [
        { session: 1, focus: 'Shoulder and upper arm outline', hours: 4 },
        { session: 2, focus: 'Elbow and forearm outline', hours: 4 },
        { session: 3, focus: 'Shoulder shading and color', hours: 5 },
        { session: 4, focus: 'Upper arm and elbow color', hours: 5 },
        { session: 5, focus: 'Forearm shading and color', hours: 5 },
        { session: 6, focus: 'Touch-ups and blending', hours: 3 }
      ]
    },
    difficulty: 'advanced',
    notes: 'Large project. Traditional Japanese designs flow with body movement. Consider wraparound composition.'
  },

  forearm_sleeve: {
    name: 'Forearm Sleeve (Elbow to Wrist)',
    category: 'sleeves',
    body_parts: ['forearm_outer', 'forearm_inner'],
    estimated_dimensions: {
      width: 24,
      height: 28,
      unit: 'cm'
    },
    session_plan: {
      total_sessions: 2,
      sessions: [
        { session: 1, focus: 'Outline and initial shading', hours: 4 },
        { session: 2, focus: 'Color and detail work', hours: 4 }
      ]
    },
    difficulty: 'beginner',
    notes: 'Popular first large piece. Relatively flat surface, good for detailed work.'
  },

  // ===== BACK PIECES =====
  full_back_piece: {
    name: 'Full Back Piece',
    category: 'back',
    body_parts: ['full_back'],
    estimated_dimensions: {
      width: 40,
      height: 50,
      unit: 'cm'
    },
    session_plan: {
      total_sessions: 8,
      sessions: [
        { session: 1, focus: 'Upper back outline', hours: 4 },
        { session: 2, focus: 'Mid back outline', hours: 4 },
        { session: 3, focus: 'Lower back outline', hours: 4 },
        { session: 4, focus: 'Upper section shading', hours: 5 },
        { session: 5, focus: 'Mid section shading', hours: 5 },
        { session: 6, focus: 'Lower section shading', hours: 5 },
        { session: 7, focus: 'Color and details (if applicable)', hours: 6 },
        { session: 8, focus: 'Final touch-ups and blending', hours: 3 }
      ]
    },
    difficulty: 'advanced',
    notes: 'Massive project. Relatively flat canvas. Excellent for highly detailed work.'
  },

  upper_back_panel: {
    name: 'Upper Back Panel (Between Shoulders)',
    category: 'back',
    body_parts: ['upper_back'],
    estimated_dimensions: {
      width: 30,
      height: 25,
      unit: 'cm'
    },
    session_plan: {
      total_sessions: 2,
      sessions: [
        { session: 1, focus: 'Outline and initial work', hours: 4 },
        { session: 2, focus: 'Shading, color, and details', hours: 5 }
      ]
    },
    difficulty: 'intermediate',
    notes: 'Popular placement. Flat surface, ideal for geometric or mandala designs.'
  },

  lower_back_piece: {
    name: 'Lower Back Piece',
    category: 'back',
    body_parts: ['lower_back'],
    estimated_dimensions: {
      width: 35,
      height: 20,
      unit: 'cm'
    },
    session_plan: {
      total_sessions: 2,
      sessions: [
        { session: 1, focus: 'Outline entire design', hours: 3 },
        { session: 2, focus: 'Shading and color', hours: 4 }
      ]
    },
    difficulty: 'beginner',
    notes: 'Symmetrical designs work well. Relatively flat surface.'
  },

  // ===== CHEST PIECES =====
  chest_panel: {
    name: 'Chest Panel (Pec to Pec)',
    category: 'chest',
    body_parts: ['chest'],
    estimated_dimensions: {
      width: 35,
      height: 25,
      unit: 'cm'
    },
    session_plan: {
      total_sessions: 3,
      sessions: [
        { session: 1, focus: 'Center and right side outline', hours: 4 },
        { session: 2, focus: 'Left side outline and initial shading', hours: 4 },
        { session: 3, focus: 'Complete shading and color', hours: 5 }
      ]
    },
    difficulty: 'intermediate',
    notes: 'Significant curvature. Design wraps over pectoral muscles. Painful area.'
  },

  single_pec: {
    name: 'Single Pec/Side Chest',
    category: 'chest',
    body_parts: ['chest'],
    estimated_dimensions: {
      width: 20,
      height: 20,
      unit: 'cm'
    },
    session_plan: {
      total_sessions: 2,
      sessions: [
        { session: 1, focus: 'Outline and initial shading', hours: 3 },
        { session: 2, focus: 'Complete shading and color', hours: 4 }
      ]
    },
    difficulty: 'beginner',
    notes: 'Popular asymmetric placement. Curves over pec muscle.'
  },

  // ===== THIGH PIECES =====
  thigh_panel: {
    name: 'Thigh Panel (Outer or Inner)',
    category: 'legs',
    body_parts: ['outer_thigh'],
    estimated_dimensions: {
      width: 25,
      height: 35,
      unit: 'cm'
    },
    session_plan: {
      total_sessions: 3,
      sessions: [
        { session: 1, focus: 'Outline entire piece', hours: 4 },
        { session: 2, focus: 'Initial shading and color', hours: 5 },
        { session: 3, focus: 'Final shading, color, details', hours: 5 }
      ]
    },
    difficulty: 'intermediate',
    notes: 'Large canvas. Consider sitting position during design and healing.'
  },

  full_leg_sleeve: {
    name: 'Full Leg Sleeve (Hip to Ankle)',
    category: 'legs',
    body_parts: ['full_leg_sleeve'],
    estimated_dimensions: {
      width: 38,
      height: 90,
      unit: 'cm'
    },
    session_plan: {
      total_sessions: 8,
      sessions: [
        { session: 1, focus: 'Upper thigh outline', hours: 4 },
        { session: 2, focus: 'Lower thigh and knee outline', hours: 4 },
        { session: 3, focus: 'Calf outline', hours: 4 },
        { session: 4, focus: 'Upper thigh shading and color', hours: 5 },
        { session: 5, focus: 'Knee and upper calf color', hours: 5 },
        { session: 6, focus: 'Lower calf and ankle color', hours: 5 },
        { session: 7, focus: 'Detail work and blending', hours: 5 },
        { session: 8, focus: 'Touch-ups', hours: 3 }
      ]
    },
    difficulty: 'advanced',
    notes: 'Massive project. Variable curvature. Plan for long-term commitment.'
  },

  // ===== RIB PIECES =====
  rib_panel: {
    name: 'Rib/Side Panel',
    category: 'torso',
    body_parts: ['ribs'],
    estimated_dimensions: {
      width: 20,
      height: 30,
      unit: 'cm'
    },
    session_plan: {
      total_sessions: 3,
      sessions: [
        { session: 1, focus: 'Outline (take breaks for pain)', hours: 3 },
        { session: 2, focus: 'Initial shading', hours: 4 },
        { session: 3, focus: 'Final shading and color', hours: 4 }
      ]
    },
    difficulty: 'advanced',
    notes: 'Very painful area. Extreme curvature. Breathing affects stencil and design. Multiple short sessions recommended.'
  },

  // ===== SMALL/MEDIUM STANDALONE PIECES =====
  shoulder_cap: {
    name: 'Shoulder Cap',
    category: 'standalone',
    body_parts: ['shoulder'],
    estimated_dimensions: {
      width: 15,
      height: 15,
      unit: 'cm'
    },
    session_plan: {
      total_sessions: 1,
      sessions: [
        { session: 1, focus: 'Complete piece', hours: 3 }
      ]
    },
    difficulty: 'intermediate',
    notes: 'Round surface. Design wraps over deltoid muscle. Popular for mandalas or circular designs.'
  },

  calf_panel: {
    name: 'Calf Panel',
    category: 'standalone',
    body_parts: ['calf'],
    estimated_dimensions: {
      width: 15,
      height: 25,
      unit: 'cm'
    },
    session_plan: {
      total_sessions: 2,
      sessions: [
        { session: 1, focus: 'Outline and initial shading', hours: 3 },
        { session: 2, focus: 'Complete shading and color', hours: 4 }
      ]
    },
    difficulty: 'beginner',
    notes: 'Popular placement. Muscle definition affects appearance. Good visibility.'
  },

  inner_forearm: {
    name: 'Inner Forearm Panel',
    category: 'standalone',
    body_parts: ['forearm_inner'],
    estimated_dimensions: {
      width: 10,
      height: 20,
      unit: 'cm'
    },
    session_plan: {
      total_sessions: 1,
      sessions: [
        { session: 1, focus: 'Complete piece', hours: 3 }
      ]
    },
    difficulty: 'beginner',
    notes: 'Very popular first tattoo placement. Relatively flat when arm extended. High visibility.'
  },

  neck_side_piece: {
    name: 'Side Neck Piece',
    category: 'standalone',
    body_parts: ['neck_side'],
    estimated_dimensions: {
      width: 8,
      height: 12,
      unit: 'cm'
    },
    session_plan: {
      total_sessions: 1,
      sessions: [
        { session: 1, focus: 'Complete piece', hours: 2 }
      ]
    },
    difficulty: 'advanced',
    notes: 'Highly visible placement. Painful. Head movement affects healing. Not recommended for first tattoo.'
  },

  hand_top_piece: {
    name: 'Top of Hand',
    category: 'standalone',
    body_parts: ['hand_top'],
    estimated_dimensions: {
      width: 8,
      height: 10,
      unit: 'cm'
    },
    session_plan: {
      total_sessions: 1,
      sessions: [
        { session: 1, focus: 'Complete piece (expect faster fading)', hours: 2 }
      ]
    },
    difficulty: 'advanced',
    notes: 'Fades faster due to constant hand washing and sun exposure. May need touch-ups. Painful over tendons.'
  }
};

// Helper function to get template by key
function getTemplate(key) {
  return placementTemplates[key] || null;
}

// Helper function to get templates by category
function getTemplatesByCategory(category) {
  const results = [];
  for (const [key, template] of Object.entries(placementTemplates)) {
    if (template.category === category) {
      results.push({ key: key, ...template });
    }
  }
  return results;
}

// Helper function to get all categories
function getTemplateCategories() {
  const categories = new Set();
  for (const template of Object.values(placementTemplates)) {
    categories.add(template.category);
  }
  return Array.from(categories);
}

// Helper function to calculate total session hours
function calculateTotalHours(templateKey) {
  const template = getTemplate(templateKey);
  if (!template || !template.session_plan) return 0;

  return template.session_plan.sessions.reduce((total, session) => {
    return total + session.hours;
  }, 0);
}

// Helper function to get estimated cost range (based on hourly rate)
function calculateEstimatedCost(templateKey, hourlyRate = 150) {
  const totalHours = calculateTotalHours(templateKey);
  return {
    hours: totalHours,
    cost_low: totalHours * hourlyRate,
    cost_high: totalHours * (hourlyRate + 50), // Range of $50 per hour variance
    currency: 'USD'
  };
}

// Helper function to generate session timeline
function generateSessionTimeline(templateKey, weeksPerSession = 4) {
  const template = getTemplate(templateKey);
  if (!template || !template.session_plan) return null;

  const timeline = [];
  let cumulativeWeeks = 0;

  template.session_plan.sessions.forEach((session, index) => {
    if (index > 0) {
      cumulativeWeeks += weeksPerSession;
    }

    timeline.push({
      session_number: session.session,
      week: cumulativeWeeks,
      focus: session.focus,
      hours: session.hours,
      healing_note: index < template.session_plan.sessions.length - 1
        ? `Allow ${weeksPerSession} weeks healing before next session`
        : 'Final session - follow aftercare for 4-6 weeks'
    });
  });

  return {
    total_weeks: cumulativeWeeks + (weeksPerSession * 1.5), // Add final healing time
    sessions: timeline
  };
}
