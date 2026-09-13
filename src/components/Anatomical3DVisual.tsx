import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

interface Anatomical3DVisualProps {
  templateId: string;
  category: string;
  name: string;
  className?: string;
  interactive?: boolean;
  showLandmarks?: boolean;
}

export const Anatomical3DVisual: React.FC<Anatomical3DVisualProps> = ({
  templateId,
  category,
  name,
  className = '',
  interactive = false,
  showLandmarks = false
}) => {
  const { t } = useApp();
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [highlightZone, setHighlightZone] = useState<boolean>(true);

  // Unique gradient and filter IDs to prevent DOM collision across multiple cards
  const idPrefix = `anat-3d-${templateId}`;

  return (
    <div className={`relative overflow-hidden rounded-xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-slate-800 shadow-inner group ${className}`}>
      {/* Interactive Controls Overlay if interactive */}
      {interactive && (
        <div className="absolute top-2 right-2 z-20 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded-lg border border-slate-700/60 text-[10px] text-slate-300 font-bold">
          <button
            type="button"
            onClick={() => setWireframe(!wireframe)}
            className={`px-1.5 py-0.5 rounded transition ${wireframe ? 'bg-blue-600 text-white' : 'hover:text-white'}`}
          >
            {t('btn3DGrid')}
          </button>
          <span className="text-slate-600">|</span>
          <button
            type="button"
            onClick={() => setHighlightZone(!highlightZone)}
            className={`px-1.5 py-0.5 rounded transition ${highlightZone ? 'bg-indigo-600 text-white' : 'hover:text-white'}`}
          >
            {t('btnPlacement')}
          </button>
        </div>
      )}

      {/* 3D Anatomical SVG Render */}
      <svg
        viewBox="0 0 400 240"
        className="w-full h-full object-contain select-none transition-transform duration-500 group-hover:scale-[1.02]"
        aria-label={`3D Anatomical placement for ${name}`}
      >
        <defs>
          {/* Global Volumetric Skin Gradients */}
          <linearGradient id={`${idPrefix}-skin-cylinder`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="25%" stopColor="#334155" />
            <stop offset="50%" stopColor="#475569" />
            <stop offset="75%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          <linearGradient id={`${idPrefix}-specular-glow`} x1="30%" y1="0%" x2="70%" y2="100%">
            <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#64748b" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.8" />
          </linearGradient>

          {/* Tattoo Stencil Overlay Gradients */}
          <linearGradient id={`${idPrefix}-tattoo-ink`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#6366f1" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient id={`${idPrefix}-stencil-mesh`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.1" />
          </linearGradient>

          <radialGradient id={`${idPrefix}-depth-shadow`} cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="#000000" stopOpacity="0" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0.8" />
          </radialGradient>

          {/* Tattoo Stencil Patterns */}
          <pattern id={`${idPrefix}-grid-pattern`} width="12" height="12" patternUnits="userSpaceOnUse">
            <path d="M 12 0 L 0 0 0 12" fill="none" stroke="#0284c7" strokeWidth="0.5" strokeOpacity="0.3" />
          </pattern>
        </defs>

        {/* Ambient Dark Grid Backdrop */}
        <rect width="400" height="240" fill="#090d16" />
        
        {/* Isometric 3D floor grid lines */}
        <g stroke="#1e293b" strokeWidth="0.75" strokeOpacity="0.5">
          <line x1="0" y1="210" x2="400" y2="210" />
          <line x1="0" y1="225" x2="400" y2="225" />
          <line x1="80" y1="240" x2="140" y2="190" />
          <line x1="160" y1="240" x2="220" y2="190" />
          <line x1="240" y1="240" x2="300" y2="190" />
          <line x1="320" y1="240" x2="380" y2="190" />
        </g>

        {/* Specific 3D Model Rendering based on templateId / category */}
        {renderTemplateModel(templateId, category, idPrefix, wireframe, highlightZone, showLandmarks, t)}

        {/* Outer Vignette for realistic depth */}
        <rect width="400" height="240" fill={`url(#${idPrefix}-depth-shadow)`} pointerEvents="none" />

        {/* 3D Anatomical Zone Badge */}
        <g transform="translate(14, 24)">
          <rect x="0" y="0" width="84" height="20" rx="6" fill="#0f172a" fillOpacity="0.85" stroke="#334155" strokeWidth="0.8" />
          <circle cx="10" cy="10" r="3.5" fill="#38bdf8" />
          <text x="20" y="14" fill="#94a3b8" fontSize="9" fontWeight="700" fontFamily="sans-serif" letterSpacing="0.5">
            3D MODEL
          </text>
        </g>
      </svg>
    </div>
  );
};

// Sub-renderer for accurate anatomical structures
function renderTemplateModel(
  templateId: string,
  category: string,
  idPrefix: string,
  wireframe: boolean,
  highlightZone: boolean,
  showLandmarks: boolean,
  t: (k: string) => string
) {
  switch (templateId) {
    case 'traditional_half_sleeve':
      return renderTraditionalHalfSleeve(idPrefix, wireframe, highlightZone, showLandmarks, t);
    case 'full_sleeve_japanese':
      return renderJapaneseFullSleeve(idPrefix, wireframe, highlightZone, showLandmarks, t);
    case 'forearm_sleeve':
      return renderForearmSleeve(idPrefix, wireframe, highlightZone, showLandmarks, t);
    case 'full_back_piece':
      return renderFullBackPiece(idPrefix, wireframe, highlightZone, showLandmarks, t);
    case 'upper_back_panel':
      return renderUpperBackPanel(idPrefix, wireframe, highlightZone, showLandmarks, t);
    case 'chest_panel':
      return renderChestPanel(idPrefix, wireframe, highlightZone, showLandmarks, t);
    case 'thigh_panel':
      return renderThighPanel(idPrefix, wireframe, highlightZone, showLandmarks, t);
    case 'rib_panel':
      return renderRibPanel(idPrefix, wireframe, highlightZone, showLandmarks, t);
    default:
      // Fallback by category
      if (category === 'sleeves') return renderTraditionalHalfSleeve(idPrefix, wireframe, highlightZone, showLandmarks, t);
      if (category === 'back') return renderFullBackPiece(idPrefix, wireframe, highlightZone, showLandmarks, t);
      if (category === 'chest') return renderChestPanel(idPrefix, wireframe, highlightZone, showLandmarks, t);
      if (category === 'legs') return renderThighPanel(idPrefix, wireframe, highlightZone, showLandmarks, t);
      return renderRibPanel(idPrefix, wireframe, highlightZone, showLandmarks, t);
  }
}

/** 1. TRADITIONAL HALF SLEEVE (Upper Arm 3D Cylinder & Deltoid-to-Elbow Wrap) */
function renderTraditionalHalfSleeve(idPrefix: string, wireframe: boolean, highlightZone: boolean, showLandmarks: boolean, t: (k: string) => string) {
  return (
    <g transform="translate(40, 10)">
      {/* Drop shadow underneath limb */}
      <ellipse cx="160" cy="205" rx="80" ry="14" fill="#000000" fillOpacity="0.6" filter="blur(4px)" />

      {/* Shoulder / Deltoid Muscle Volume */}
      <path
        d="M 120 30 C 150 15, 180 18, 205 38 C 215 50, 218 70, 214 95 L 105 95 C 102 70, 105 48, 120 30 Z"
        fill={`url(#${idPrefix}-skin-cylinder)`}
        stroke="#475569"
        strokeWidth="1.5"
      />

      {/* Upper Arm Bicep / Tricep 3D Cylinder Body */}
      <path
        d="M 105 95 C 98 120, 100 150, 108 175 L 208 175 C 216 150, 218 120, 214 95 Z"
        fill={`url(#${idPrefix}-skin-cylinder)`}
        stroke="#475569"
        strokeWidth="1.5"
      />

      {/* Elbow Joint articulation & Forearm transition */}
      <path
        d="M 108 175 C 112 190, 118 200, 125 210 L 190 210 C 198 200, 204 190, 208 175 Z"
        fill="#1e293b"
        stroke="#334155"
        strokeWidth="1.2"
      />

      {/* 3D Anatomical Curvature Cross-Section Rings (Showing Cylinder Form) */}
      <g stroke="#64748b" strokeWidth="0.8" fill="none" strokeDasharray={wireframe ? 'none' : '2,2'} opacity={wireframe ? 0.8 : 0.4}>
        <ellipse cx="160" cy="45" rx="42" ry="10" />
        <ellipse cx="160" cy="95" rx="54" ry="13" />
        <ellipse cx="158" cy="135" rx="56" ry="14" />
        <ellipse cx="158" cy="175" rx="50" ry="12" />
        {/* Longitudinal meridian curvature lines */}
        <path d="M 160 22 C 162 90, 160 140, 158 210" />
        <path d="M 130 32 C 126 90, 124 140, 130 205" />
        <path d="M 190 32 C 194 90, 192 140, 186 205" />
      </g>

      {/* 3D Half Sleeve Tattoo Stencil Wrap (Deltoid to Elbow) */}
      {highlightZone && (
        <g>
          {/* Stencil Base Mesh on Cylinder with 3D Contour */}
          <path
            d="M 112 55 C 135 42, 185 42, 208 55 C 215 90, 216 135, 206 165 C 180 178, 135 178, 110 165 C 100 135, 102 90, 112 55 Z"
            fill={`url(#${idPrefix}-stencil-mesh)`}
            stroke="#0284c7"
            strokeWidth="1.5"
          />

          {/* Traditional Tattoo Motif inside 3D wrap (Japanese Peony / Windbars / Waves) */}
          <g stroke={`url(#${idPrefix}-tattoo-ink)`} strokeWidth="1.6" fill="none" opacity="0.95">
            {/* Upper Deltoid Windbars */}
            <path d="M 125 65 C 145 58, 175 62, 195 72" />
            <path d="M 120 80 C 145 72, 178 78, 202 90" />
            
            {/* Center Motif (Peony Petals & Flow Curve) */}
            <circle cx="160" cy="115" r="14" fill="#0284c7" fillOpacity="0.2" strokeWidth="1.8" />
            <path d="M 152 110 C 158 102, 166 102, 168 112 C 172 120, 160 126, 154 120 Z" fill="#38bdf8" fillOpacity="0.3" />
            <path d="M 142 115 C 135 105, 142 95, 150 100" />
            <path d="M 178 115 C 185 105, 178 95, 170 100" />
            <path d="M 160 130 C 150 140, 170 140, 160 130" />

            {/* Lower Waves wrapping around bicep */}
            <path d="M 115 135 C 135 145, 155 130, 175 142 C 190 150, 198 140, 203 148" />
            <path d="M 118 152 C 140 160, 165 148, 185 158 C 195 162, 200 158, 204 162" />

            {/* Dimensional Registration Crosshairs */}
            <g stroke="#38bdf8" strokeWidth="1">
              <path d="M 160 48 L 160 56 M 156 52 L 164 52" />
              <path d="M 160 168 L 160 176 M 156 172 L 164 172" />
            </g>
          </g>

          {/* Caliper Dimension Guides */}
          <g stroke="#38bdf8" strokeWidth="1" strokeDasharray="2,2" opacity="0.8">
            <line x1="90" y1="55" x2="108" y2="55" />
            <line x1="90" y1="165" x2="106" y2="165" />
            <line x1="90" y1="55" x2="90" y2="165" strokeDasharray="none" strokeWidth="1.2" />
            <text x="82" y="115" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="end">
              30 cm
            </text>
          </g>
        </g>
      )}

      {/* Specular 3D highlight down bicep crest */}
      <path
        d="M 152 40 C 154 90, 153 140, 150 175"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.25"
        filter="blur(2px)"
      />

      {/* Anatomical Landmark Labels */}
      {showLandmarks && (
        <g fill="#94a3b8" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
          <circle cx="205" cy="40" r="2.5" fill="#38bdf8" />
          <text x="212" y="43">{t('landmarkDeltoidApex')}</text>

          <circle cx="102" cy="115" r="2.5" fill="#38bdf8" />
          <text x="45" y="118">{t('landmarkBicepPeak')}</text>

          <circle cx="125" cy="208" r="2.5" fill="#38bdf8" />
          <text x="135" y="222">{t('landmarkOlecranon')}</text>
        </g>
      )}
    </g>
  );
}

/** 2. JAPANESE FULL SLEEVE (Full Articulated Arm: Shoulder -> Bicep -> Elbow -> Forearm -> Wrist) */
function renderJapaneseFullSleeve(idPrefix: string, wireframe: boolean, highlightZone: boolean, showLandmarks: boolean, t: (k: string) => string) {
  return (
    <g transform="translate(30, 8)">
      {/* Realistic 3D Full Arm Mesh Silhouette */}
      <ellipse cx="170" cy="215" rx="90" ry="12" fill="#000000" fillOpacity="0.6" filter="blur(4px)" />

      {/* Shoulder Cap */}
      <path
        d="M 130 18 C 160 10, 195 12, 220 28 C 230 40, 232 58, 228 78 L 118 78 C 114 55, 118 32, 130 18 Z"
        fill={`url(#${idPrefix}-skin-cylinder)`}
        stroke="#475569"
        strokeWidth="1.5"
      />

      {/* Upper Arm Bicep */}
      <path
        d="M 118 78 C 112 95, 114 118, 122 135 L 222 135 C 228 118, 230 95, 228 78 Z"
        fill={`url(#${idPrefix}-skin-cylinder)`}
        stroke="#475569"
        strokeWidth="1.5"
      />

      {/* Elbow Transition Bridge */}
      <path
        d="M 122 135 C 124 148, 128 156, 134 162 L 210 162 C 216 156, 220 148, 222 135 Z"
        fill="#1e293b"
        stroke="#334155"
        strokeWidth="1.2"
      />

      {/* Forearm Tapering to Wrist */}
      <path
        d="M 134 162 C 138 178, 145 195, 150 215 L 194 215 C 199 195, 206 178, 210 162 Z"
        fill={`url(#${idPrefix}-skin-cylinder)`}
        stroke="#475569"
        strokeWidth="1.5"
      />

      {/* 3D Wireframe Rings across entire 56cm limb */}
      <g stroke="#64748b" strokeWidth="0.8" fill="none" strokeDasharray={wireframe ? 'none' : '2,2'} opacity={wireframe ? 0.8 : 0.35}>
        <ellipse cx="175" cy="30" rx="46" ry="10" />
        <ellipse cx="173" cy="78" rx="55" ry="12" />
        <ellipse cx="172" cy="115" rx="53" ry="12" />
        <ellipse cx="172" cy="148" rx="46" ry="10" />
        <ellipse cx="172" cy="180" rx="36" ry="9" />
        <ellipse cx="172" cy="215" rx="22" ry="6" />
        {/* Curvature spines */}
        <path d="M 175 12 C 176 80, 174 150, 172 215" />
      </g>

      {/* Full Sleeve Japanese Tattoo Placement */}
      {highlightZone && (
        <g>
          {/* Stencil continuous cylinder envelope */}
          <path
            d="M 124 35 C 150 25, 200 25, 224 38 C 230 80, 226 125, 220 140 C 216 160, 206 185, 194 212 C 180 216, 164 216, 150 212 C 138 185, 128 160, 124 140 C 116 125, 114 80, 124 35 Z"
            fill={`url(#${idPrefix}-stencil-mesh)`}
            stroke="#0284c7"
            strokeWidth="1.5"
          />

          {/* Japanese Dragon & Cloud / Windbar Motifs wrapping around 3D cylinder */}
          <g stroke={`url(#${idPrefix}-tattoo-ink)`} strokeWidth="1.5" fill="none">
            {/* Dragon Head at Deltoid/Chest bridge */}
            <path d="M 155 45 C 165 38, 185 40, 195 48 C 205 56, 190 65, 175 62 Z" fill="#0284c7" fillOpacity="0.25" />
            <circle cx="180" cy="50" r="2" fill="#38bdf8" />
            <path d="M 190 44 C 196 36, 204 38, 208 45" strokeWidth="1.8" />
            <path d="M 160 52 C 150 50, 142 54, 138 60" />

            {/* Dragon Body Spines wrapping around bicep */}
            <path d="M 175 62 C 160 75, 145 90, 155 105 C 165 120, 195 110, 205 125" strokeWidth="2.2" stroke="#38bdf8" />
            <path d="M 180 70 L 186 65 M 168 82 L 174 77 M 152 98 L 158 93 M 165 112 L 171 107" />

            {/* Elbow Mikiri Wind & Water Waves */}
            <path d="M 125 138 C 145 130, 175 142, 195 134 C 208 138, 218 132, 222 142" />
            <path d="M 128 152 C 148 144, 172 154, 190 148 C 202 152, 210 148, 216 156" />

            {/* Forearm Scalework & Tail wrapping into wrist cuff */}
            <path d="M 142 168 C 158 178, 185 170, 198 182" />
            <path d="M 146 185 C 162 195, 178 188, 192 198" />
            <path d="M 152 205 C 165 210, 180 206, 192 210" strokeWidth="2" />

            {/* Wrist Cuff Trim Line */}
            <line x1="150" y1="212" x2="194" y2="212" stroke="#38bdf8" strokeWidth="1.8" />
          </g>

          {/* Caliper Height Guide */}
          <g stroke="#38bdf8" strokeWidth="1" strokeDasharray="2,2" opacity="0.8">
            <line x1="100" y1="35" x2="120" y2="35" />
            <line x1="100" y1="212" x2="145" y2="212" />
            <line x1="100" y1="35" x2="100" y2="212" strokeDasharray="none" strokeWidth="1.2" />
            <text x="92" y="125" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="end">
              56 cm
            </text>
          </g>
        </g>
      )}

      {/* 3D Volume Highlights */}
      <path d="M 168 25 C 170 90, 168 160, 166 210" stroke="#ffffff" strokeWidth="2.5" opacity="0.2" filter="blur(1.5px)" />

      {showLandmarks && (
        <g fill="#94a3b8" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
          <circle cx="228" cy="28" r="2.5" fill="#38bdf8" />
          <text x="234" y="32">{t('landmarkAcromion')}</text>

          <circle cx="120" cy="148" r="2.5" fill="#38bdf8" />
          <text x="50" y="152">{t('landmarkCubitalFossa')}</text>

          <circle cx="194" cy="214" r="2.5" fill="#38bdf8" />
          <text x="202" y="217">{t('landmarkRadialStyloid')}</text>
        </g>
      )}
    </g>
  );
}

/** 3. FOREARM SLEEVE (Elbow to Wrist 3D Volumetric Cylinder) */
function renderForearmSleeve(idPrefix: string, wireframe: boolean, highlightZone: boolean, showLandmarks: boolean, t: (k: string) => string) {
  return (
    <g transform="translate(45, 12)">
      <ellipse cx="155" cy="205" rx="75" ry="12" fill="#000000" fillOpacity="0.6" filter="blur(4px)" />

      {/* Forearm Muscular Cylinder (Flexor & Extensor Curves) */}
      <path
        d="M 105 35 C 135 20, 175 20, 205 35 C 215 75, 210 120, 195 165 C 190 185, 185 200, 180 210 L 130 210 C 125 200, 120 185, 115 165 C 100 120, 95 75, 105 35 Z"
        fill={`url(#${idPrefix}-skin-cylinder)`}
        stroke="#475569"
        strokeWidth="1.5"
      />

      {/* 3D Cross-Section Rings */}
      <g stroke="#64748b" strokeWidth="0.8" fill="none" strokeDasharray={wireframe ? 'none' : '2,2'} opacity={wireframe ? 0.8 : 0.4}>
        <ellipse cx="155" cy="35" rx="50" ry="12" />
        <ellipse cx="155" cy="85" rx="54" ry="13" />
        <ellipse cx="155" cy="140" rx="46" ry="11" />
        <ellipse cx="155" cy="180" rx="35" ry="8" />
        <ellipse cx="155" cy="210" rx="25" ry="6" />
        <path d="M 155 22 C 156 80, 155 150, 155 210" />
      </g>

      {/* Forearm Stencil Placement */}
      {highlightZone && (
        <g>
          <path
            d="M 110 50 C 135 38, 175 38, 200 50 C 206 90, 202 135, 190 170 C 185 188, 180 198, 175 204 C 160 208, 145 208, 135 204 C 130 198, 125 188, 120 170 C 108 135, 104 90, 110 50 Z"
            fill={`url(#${idPrefix}-stencil-mesh)`}
            stroke="#0284c7"
            strokeWidth="1.5"
          />

          {/* Geometric Mandala / Realism Wrap Lines */}
          <g stroke={`url(#${idPrefix}-tattoo-ink)`} strokeWidth="1.5" fill="none">
            {/* Center Mandala Motif */}
            <circle cx="155" cy="110" r="22" strokeWidth="1.8" stroke="#38bdf8" />
            <polygon points="155,90 172,110 155,130 138,110" strokeWidth="1.5" fill="#0284c7" fillOpacity="0.2" />
            <circle cx="155" cy="110" r="8" fill="#38bdf8" fillOpacity="0.4" />
            
            {/* Symmetrical Radiating Stippling / Filigree */}
            <path d="M 155 88 L 155 60 M 155 132 L 155 160" strokeDasharray="2,2" />
            <path d="M 136 110 L 115 110 M 174 110 L 195 110" strokeDasharray="2,2" />

            {/* Geometric Bands top & bottom */}
            <path d="M 118 68 C 140 58, 170 58, 192 68" />
            <path d="M 120 78 C 140 68, 170 68, 190 78" />
            <path d="M 126 182 C 142 176, 168 176, 184 182" />
            <path d="M 130 196 C 144 190, 166 190, 180 196" strokeWidth="1.8" />
          </g>

          {/* Caliper Guide */}
          <g stroke="#38bdf8" strokeWidth="1" strokeDasharray="2,2" opacity="0.8">
            <line x1="85" y1="50" x2="105" y2="50" />
            <line x1="85" y1="204" x2="130" y2="204" />
            <line x1="85" y1="50" x2="85" y2="204" strokeDasharray="none" strokeWidth="1.2" />
            <text x="77" y="130" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="end">
              26 cm
            </text>
          </g>
        </g>
      )}

      <path d="M 150 35 C 152 90, 150 150, 148 205" stroke="#ffffff" strokeWidth="2.5" opacity="0.2" filter="blur(1.5px)" />

      {showLandmarks && (
        <g fill="#94a3b8" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
          <circle cx="102" cy="40" r="2.5" fill="#38bdf8" />
          <text x="35" y="44">{t('landmarkMedialEpicondyle')}</text>

          <circle cx="180" cy="208" r="2.5" fill="#38bdf8" />
          <text x="188" y="212">{t('landmarkUlnarHead')}</text>
        </g>
      )}
    </g>
  );
}

/** 4. FULL BACK PIECE (3D Posterior Torso, Scapulae, Spine Curvature & Gluteal Boundary) */
function renderFullBackPiece(idPrefix: string, wireframe: boolean, highlightZone: boolean, showLandmarks: boolean, t: (k: string) => string) {
  return (
    <g transform="translate(30, 8)">
      <ellipse cx="170" cy="218" rx="100" ry="12" fill="#000000" fillOpacity="0.6" filter="blur(4px)" />

      {/* 3D Anatomical Back Silhouette (Neck, Trapezius, Scapular flare, Lats, Waist taper, Gluteal shelf) */}
      <path
        d="M 148 18 C 155 15, 185 15, 192 18 C 210 24, 235 32, 260 48 C 268 70, 265 100, 255 130 C 248 150, 238 170, 235 190 C 232 205, 230 215, 215 220 C 190 224, 150 224, 125 220 C 110 215, 108 205, 105 190 C 102 170, 92 150, 85 130 C 75 100, 72 70, 80 48 C 105 32, 130 24, 148 18 Z"
        fill={`url(#${idPrefix}-skin-cylinder)`}
        stroke="#475569"
        strokeWidth="1.5"
      />

      {/* Spine Centerline Furrow */}
      <path d="M 170 20 C 171 70, 169 140, 170 220" stroke="#0f172a" strokeWidth="2.5" opacity="0.6" />

      {/* Scapular Plates (Left & Right Muscle Curves) */}
      <path d="M 115 55 C 130 50, 145 65, 140 95 C 130 110, 115 105, 110 85 Z" fill="#334155" fillOpacity="0.3" stroke="#475569" strokeWidth="0.8" />
      <path d="M 225 55 C 210 50, 195 65, 200 95 C 210 110, 225 105, 230 85 Z" fill="#334155" fillOpacity="0.3" stroke="#475569" strokeWidth="0.8" />

      {/* 3D Torso Curvature Grid */}
      <g stroke="#64748b" strokeWidth="0.8" fill="none" strokeDasharray={wireframe ? 'none' : '2,2'} opacity={wireframe ? 0.8 : 0.35}>
        <path d="M 85 55 C 135 70, 205 70, 255 55" />
        <path d="M 80 95 C 135 115, 205 115, 260 95" />
        <path d="M 88 135 C 135 155, 205 155, 252 135" />
        <path d="M 102 175 C 135 190, 205 190, 238 175" />
        <path d="M 115 210 C 145 220, 195 220, 225 210" />
      </g>

      {/* Full Back Stencil Placement Overlay */}
      {highlightZone && (
        <g>
          {/* Master 45x60cm Master Canvas Boundary */}
          <path
            d="M 152 28 C 190 24, 215 35, 245 52 C 252 80, 248 115, 238 140 C 230 162, 224 185, 218 208 C 190 216, 150 216, 122 208 C 116 185, 110 162, 102 140 C 92 115, 88 80, 95 52 C 125 35, 150 24, 152 28 Z"
            fill={`url(#${idPrefix}-stencil-mesh)`}
            stroke="#0284c7"
            strokeWidth="1.8"
          />

          {/* Master Full Back Composition (Monumental Phoenix / Ryu Motif & Clouds) */}
          <g stroke={`url(#${idPrefix}-tattoo-ink)`} strokeWidth="1.6" fill="none">
            {/* Central Master Spine Subject */}
            <circle cx="170" cy="115" r="28" strokeWidth="2" fill="#0284c7" fillOpacity="0.25" stroke="#38bdf8" />
            <path d="M 170 70 C 150 85, 150 145, 170 160 C 190 145, 190 85, 170 70 Z" fill="#6366f1" fillOpacity="0.2" />
            
            {/* Wing / Cloud Sweeps across Scapulae */}
            <path d="M 160 85 C 135 65, 105 70, 98 88 C 115 95, 140 92, 155 105" strokeWidth="1.8" />
            <path d="M 180 85 C 205 65, 235 70, 242 88 C 225 95, 200 92, 185 105" strokeWidth="1.8" />

            {/* Lower Back Waves & Gluteal Boundary Taper */}
            <path d="M 108 155 C 135 170, 165 155, 190 168 C 210 160, 225 170, 230 160" />
            <path d="M 115 180 C 140 195, 170 180, 195 192 C 215 185, 222 195, 224 190" strokeWidth="2" />

            {/* Alignment Grid Registration Ticks */}
            <line x1="170" y1="20" x2="170" y2="34" stroke="#38bdf8" strokeWidth="2" />
            <line x1="170" y1="202" x2="170" y2="216" stroke="#38bdf8" strokeWidth="2" />
            <line x1="88" y1="120" x2="102" y2="120" stroke="#38bdf8" strokeWidth="2" />
            <line x1="238" y1="120" x2="252" y2="120" stroke="#38bdf8" strokeWidth="2" />
          </g>

          {/* Caliper Dimensions */}
          <g stroke="#38bdf8" strokeWidth="1" strokeDasharray="2,2" opacity="0.8">
            <line x1="60" y1="35" x2="90" y2="35" />
            <line x1="60" y1="210" x2="115" y2="210" />
            <line x1="60" y1="35" x2="60" y2="210" strokeDasharray="none" strokeWidth="1.2" />
            <text x="52" y="125" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="end">
              60 cm
            </text>
          </g>
        </g>
      )}

      {showLandmarks && (
        <g fill="#94a3b8" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
          <circle cx="170" cy="22" r="2.5" fill="#38bdf8" />
          <text x="176" y="25">{t('landmarkC7Vertebra')}</text>

          <circle cx="110" cy="85" r="2.5" fill="#38bdf8" />
          <text x="35" y="88">{t('landmarkScapularSpine')}</text>

          <circle cx="125" cy="216" r="2.5" fill="#38bdf8" />
          <text x="55" y="226">{t('landmarkIliacCrest')}</text>
        </g>
      )}
    </g>
  );
}

/** 5. UPPER BACK PANEL (Inter-Scapular Geometric / Mandala Diamond) */
function renderUpperBackPanel(idPrefix: string, wireframe: boolean, highlightZone: boolean, showLandmarks: boolean, t: (k: string) => string) {
  return (
    <g transform="translate(35, 12)">
      <ellipse cx="165" cy="205" rx="90" ry="12" fill="#000000" fillOpacity="0.6" filter="blur(4px)" />

      {/* Upper Torso & Shoulders Anatomy */}
      <path
        d="M 140 25 C 150 20, 180 20, 190 25 C 215 32, 245 42, 270 65 C 275 95, 268 135, 255 165 C 235 180, 200 190, 165 190 C 130 190, 95 180, 75 165 C 62 135, 55 95, 60 65 C 85 42, 115 32, 140 25 Z"
        fill={`url(#${idPrefix}-skin-cylinder)`}
        stroke="#475569"
        strokeWidth="1.5"
      />

      {/* Trapezius Muscle Contours */}
      <path d="M 140 25 L 165 90 L 190 25" stroke="#334155" strokeWidth="1.2" fill="none" />
      <line x1="165" y1="22" x2="165" y2="190" stroke="#0f172a" strokeWidth="2" opacity="0.6" />

      {/* Upper Back Panel Stencil */}
      {highlightZone && (
        <g>
          <path
            d="M 165 42 L 235 105 L 165 168 L 95 105 Z"
            fill={`url(#${idPrefix}-stencil-mesh)`}
            stroke="#0284c7"
            strokeWidth="1.8"
          />

          {/* Sacred Geometry Mandala */}
          <g stroke={`url(#${idPrefix}-tattoo-ink)`} strokeWidth="1.5" fill="none">
            <circle cx="165" cy="105" r="32" strokeWidth="1.8" stroke="#38bdf8" />
            <circle cx="165" cy="105" r="20" strokeWidth="1.2" />
            <circle cx="165" cy="105" r="8" fill="#38bdf8" fillOpacity="0.4" />
            
            {/* Hexagonal Star Petals */}
            <polygon points="165,75 191,90 191,120 165,135 139,120 139,90" strokeWidth="1.4" />
            <polygon points="165,80 186,117 144,117" strokeWidth="1" fill="#6366f1" fillOpacity="0.2" />
            <polygon points="165,130 186,93 144,93" strokeWidth="1" fill="#6366f1" fillOpacity="0.2" />

            {/* Ray extensions to diamond corners */}
            <line x1="165" y1="73" x2="165" y2="46" stroke="#38bdf8" strokeWidth="1.8" />
            <line x1="165" y1="137" x2="165" y2="164" stroke="#38bdf8" strokeWidth="1.8" />
            <line x1="133" y1="105" x2="98" y2="105" stroke="#38bdf8" strokeWidth="1.8" />
            <line x1="197" y1="105" x2="232" y2="105" stroke="#38bdf8" strokeWidth="1.8" />
          </g>

          {/* Caliper Dimensions */}
          <g stroke="#38bdf8" strokeWidth="1" strokeDasharray="2,2" opacity="0.8">
            <line x1="85" y1="42" x2="155" y2="42" />
            <line x1="85" y1="168" x2="155" y2="168" />
            <line x1="85" y1="42" x2="85" y2="168" strokeDasharray="none" strokeWidth="1.2" />
            <text x="77" y="110" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="end">
              28 cm
            </text>
          </g>
        </g>
      )}

      {showLandmarks && (
        <g fill="#94a3b8" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
          <circle cx="165" cy="24" r="2.5" fill="#38bdf8" />
          <text x="172" y="27">{t('landmarkSpineAxis')}</text>

          <circle cx="85" cy="105" r="2.5" fill="#38bdf8" />
          <text x="30" y="108">{t('landmarkLeftScapula')}</text>

          <circle cx="245" cy="105" r="2.5" fill="#38bdf8" />
          <text x="252" y="108">{t('landmarkRightScapula')}</text>
        </g>
      )}
    </g>
  );
}

/** 6. CHEST PANEL (Anterior Pectoral Plates & Clavicle Ridge) */
function renderChestPanel(idPrefix: string, wireframe: boolean, highlightZone: boolean, showLandmarks: boolean, t: (k: string) => string) {
  return (
    <g transform="translate(30, 10)">
      <ellipse cx="170" cy="210" rx="95" ry="12" fill="#000000" fillOpacity="0.6" filter="blur(4px)" />

      {/* Anterior Torso Silhouette (Neck, Shoulders, Dual Pec Plates, Sternum Notch, Rib Arch) */}
      <path
        d="M 145 20 C 155 18, 185 18, 195 20 C 220 28, 245 40, 265 60 C 270 90, 265 130, 255 160 C 235 185, 205 195, 170 195 C 135 195, 105 185, 85 160 C 75 130, 70 90, 75 60 C 95 40, 120 28, 145 20 Z"
        fill={`url(#${idPrefix}-skin-cylinder)`}
        stroke="#475569"
        strokeWidth="1.5"
      />

      {/* Clavicle Bone Ridges & Sternum Notch */}
      <path d="M 145 28 C 158 35, 165 38, 170 38 C 175 38, 182 35, 195 28" stroke="#64748b" strokeWidth="1.5" fill="none" />
      <path d="M 145 28 C 120 32, 95 45, 80 55" stroke="#64748b" strokeWidth="1.2" fill="none" />
      <path d="M 195 28 C 220 32, 245 45, 260 55" stroke="#64748b" strokeWidth="1.2" fill="none" />

      {/* Dual Convex Pectoral Muscle Plates */}
      <path d="M 166 45 C 145 45, 105 60, 100 105 C 105 135, 140 145, 166 135 Z" fill="#334155" fillOpacity="0.3" stroke="#475569" strokeWidth="0.8" />
      <path d="M 174 45 C 195 45, 235 60, 240 105 C 235 135, 200 145, 174 135 Z" fill="#334155" fillOpacity="0.3" stroke="#475569" strokeWidth="0.8" />

      {/* Sternum Centerline */}
      <line x1="170" y1="38" x2="170" y2="185" stroke="#0f172a" strokeWidth="2.5" opacity="0.6" />

      {/* Chest Stencil Overlay (Pec-to-Pec Panel) */}
      {highlightZone && (
        <g>
          {/* Bilateral Chest Panel Envelope */}
          <path
            d="M 95 55 C 135 48, 160 52, 170 65 C 180 52, 205 48, 245 55 C 255 95, 248 138, 232 148 C 205 158, 175 142, 170 120 C 165 142, 135 158, 108 148 C 92 138, 85 95, 95 55 Z"
            fill={`url(#${idPrefix}-stencil-mesh)`}
            stroke="#0284c7"
            strokeWidth="1.8"
          />

          {/* Symmetrical Eagle / Japanese Hannya & Floral Chest Motif */}
          <g stroke={`url(#${idPrefix}-tattoo-ink)`} strokeWidth="1.6" fill="none">
            {/* Sternum Centerpiece Knot / Heart */}
            <circle cx="170" cy="95" r="14" strokeWidth="1.8" fill="#0284c7" fillOpacity="0.3" stroke="#38bdf8" />
            <path d="M 170 85 C 162 75, 150 82, 155 92 C 160 102, 170 110, 170 110 C 170 110, 180 102, 185 92 C 190 82, 178 75, 170 85 Z" fill="#6366f1" fillOpacity="0.4" />

            {/* Left Pec Wing / Floral Flow */}
            <path d="M 156 90 C 135 75, 110 80, 104 98 C 115 115, 135 125, 155 120" strokeWidth="1.8" />
            <path d="M 148 72 C 130 62, 112 68, 108 78" />

            {/* Right Pec Wing / Floral Flow */}
            <path d="M 184 90 C 205 75, 230 80, 236 98 C 225 115, 205 125, 185 120" strokeWidth="1.8" />
            <path d="M 192 72 C 210 62, 228 68, 232 78" />

            {/* Symmetrical Crosshairs */}
            <line x1="170" y1="48" x2="170" y2="60" stroke="#38bdf8" strokeWidth="1.8" />
            <line x1="170" y1="130" x2="170" y2="142" stroke="#38bdf8" strokeWidth="1.8" />
          </g>

          {/* Caliper Width */}
          <g stroke="#38bdf8" strokeWidth="1" strokeDasharray="2,2" opacity="0.8">
            <line x1="95" y1="35" x2="95" y2="55" />
            <line x1="245" y1="35" x2="245" y2="55" />
            <line x1="95" y1="35" x2="245" y2="35" strokeDasharray="none" strokeWidth="1.2" />
            <text x="170" y="30" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
              38 cm (Pec to Pec)
            </text>
          </g>
        </g>
      )}

      {showLandmarks && (
        <g fill="#94a3b8" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
          <circle cx="170" cy="38" r="2.5" fill="#38bdf8" />
          <text x="176" y="41">{t('landmarkSuprasternalNotch')}</text>

          <circle cx="102" cy="115" r="2.5" fill="#38bdf8" />
          <text x="40" y="118">{t('landmarkLeftPecMargin')}</text>

          <circle cx="238" cy="115" r="2.5" fill="#38bdf8" />
          <text x="245" y="118">{t('landmarkRightPecMargin')}</text>
        </g>
      )}
    </g>
  );
}

/** 7. THIGH PANEL (Outer Leg / Vastus Lateralis 3D Convex Cylinder) */
function renderThighPanel(idPrefix: string, wireframe: boolean, highlightZone: boolean, showLandmarks: boolean, t: (k: string) => string) {
  return (
    <g transform="translate(45, 10)">
      <ellipse cx="155" cy="210" rx="80" ry="12" fill="#000000" fillOpacity="0.6" filter="blur(4px)" />

      {/* 3D Muscular Thigh Cylinder (Greater Trochanter -> Vastus Lateralis -> Knee Patella Bridge) */}
      <path
        d="M 110 25 C 135 15, 175 15, 200 25 C 218 65, 222 120, 215 165 C 210 185, 202 205, 192 215 L 128 215 C 120 205, 115 185, 110 165 C 98 120, 95 65, 110 25 Z"
        fill={`url(#${idPrefix}-skin-cylinder)`}
        stroke="#475569"
        strokeWidth="1.5"
      />

      {/* Vastus Lateralis Muscle Belly Ridge */}
      <path d="M 125 35 C 115 90, 118 150, 135 195" stroke="#334155" strokeWidth="1.5" fill="none" />

      {/* 3D Wireframe Rings */}
      <g stroke="#64748b" strokeWidth="0.8" fill="none" strokeDasharray={wireframe ? 'none' : '2,2'} opacity={wireframe ? 0.8 : 0.4}>
        <ellipse cx="155" cy="25" rx="45" ry="10" />
        <ellipse cx="158" cy="75" rx="58" ry="13" />
        <ellipse cx="160" cy="125" rx="56" ry="13" />
        <ellipse cx="160" cy="175" rx="48" ry="11" />
        <ellipse cx="160" cy="215" rx="32" ry="8" />
        <path d="M 155 15 C 160 80, 160 150, 160 215" />
      </g>

      {/* Outer Thigh Stencil Placement */}
      {highlightZone && (
        <g>
          <path
            d="M 118 45 C 145 35, 182 35, 205 45 C 215 85, 212 135, 202 175 C 185 188, 145 188, 128 175 C 114 135, 110 85, 118 45 Z"
            fill={`url(#${idPrefix}-stencil-mesh)`}
            stroke="#0284c7"
            strokeWidth="1.8"
          />

          {/* Large Vertical Composition (Neotraditional Portrait / Dagger & Florals) */}
          <g stroke={`url(#${idPrefix}-tattoo-ink)`} strokeWidth="1.6" fill="none">
            {/* Centerpiece Subject Frame */}
            <ellipse cx="162" cy="105" rx="26" ry="36" strokeWidth="1.8" stroke="#38bdf8" fill="#0284c7" fillOpacity="0.2" />
            <path d="M 162 60 L 162 150" stroke="#38bdf8" strokeWidth="2" />
            <polygon points="162,55 156,72 168,72" fill="#38bdf8" />
            
            {/* Floral Accents wrapping quad curve */}
            <circle cx="162" cy="105" r="12" fill="#6366f1" fillOpacity="0.4" />
            <path d="M 132 100 C 140 85, 155 90, 162 105" strokeWidth="1.5" />
            <path d="M 192 100 C 184 85, 169 90, 162 105" strokeWidth="1.5" />
            <path d="M 140 145 C 150 160, 175 160, 185 145" strokeWidth="1.8" />
          </g>

          {/* Caliper Dimensions */}
          <g stroke="#38bdf8" strokeWidth="1" strokeDasharray="2,2" opacity="0.8">
            <line x1="90" y1="45" x2="115" y2="45" />
            <line x1="90" y1="175" x2="125" y2="175" />
            <line x1="90" y1="45" x2="90" y2="175" strokeDasharray="none" strokeWidth="1.2" />
            <text x="82" y="115" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="end">
              38 cm
            </text>
          </g>
        </g>
      )}

      {showLandmarks && (
        <g fill="#94a3b8" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
          <circle cx="112" cy="30" r="2.5" fill="#38bdf8" />
          <text x="45" y="34">{t('landmarkGreaterTrochanter')}</text>

          <circle cx="160" cy="215" r="2.5" fill="#38bdf8" />
          <text x="168" y="218">{t('landmarkSuperiorPatella')}</text>
        </g>
      )}
    </g>
  );
}

/** 8. RIB / SIDE PANEL (Lateral Flank & Oblique Respiration Curve) */
function renderRibPanel(idPrefix: string, wireframe: boolean, highlightZone: boolean, showLandmarks: boolean, t: (k: string) => string) {
  return (
    <g transform="translate(45, 10)">
      <ellipse cx="155" cy="210" rx="80" ry="12" fill="#000000" fillOpacity="0.6" filter="blur(4px)" />

      {/* Lateral Flank Profile Silhouette (Axilla / Latissimus -> Ribcage convex curve -> Waist taper -> Iliac Crest) */}
      <path
        d="M 115 25 C 145 20, 180 22, 200 35 C 218 70, 214 125, 202 165 C 195 185, 188 200, 180 215 L 125 215 C 120 200, 112 185, 105 165 C 92 125, 96 70, 115 25 Z"
        fill={`url(#${idPrefix}-skin-cylinder)`}
        stroke="#475569"
        strokeWidth="1.5"
      />

      {/* Intercostal Rib Striations (Showing Respiration Arc) */}
      <g stroke="#64748b" strokeWidth="1" opacity="0.4" fill="none">
        <path d="M 115 65 C 145 78, 180 72, 205 60" />
        <path d="M 110 88 C 145 102, 180 95, 208 82" />
        <path d="M 105 112 C 145 125, 180 118, 205 105" />
        <path d="M 102 135 C 140 148, 175 142, 200 128" />
        <path d="M 105 158 C 140 170, 172 165, 195 150" />
      </g>

      {/* Side Rib Panel Stencil Placement */}
      {highlightZone && (
        <g>
          {/* Dynamic Lateral Envelope */}
          <path
            d="M 125 45 C 155 40, 185 45, 195 55 C 205 90, 200 135, 188 175 C 170 185, 140 185, 122 175 C 110 135, 112 90, 125 45 Z"
            fill={`url(#${idPrefix}-stencil-mesh)`}
            stroke="#0284c7"
            strokeWidth="1.8"
          />

          {/* Flowing Script / Ornamental Snake & Botanical Rib Wrap */}
          <g stroke={`url(#${idPrefix}-tattoo-ink)`} strokeWidth="1.6" fill="none">
            {/* S-Curve Anatomical Flow Line */}
            <path
              d="M 160 52 C 185 75, 135 105, 170 135 C 188 152, 145 170, 155 178"
              strokeWidth="2.2"
              stroke="#38bdf8"
            />
            {/* Intertwined Foliage / Blossoms */}
            <circle cx="165" cy="85" r="10" fill="#6366f1" fillOpacity="0.3" />
            <circle cx="150" cy="120" r="12" fill="#0284c7" fillOpacity="0.3" />
            <path d="M 140 75 C 152 82, 168 80, 175 72" />
            <path d="M 135 115 C 148 122, 165 118, 172 110" />
            <path d="M 145 155 C 158 162, 172 158, 180 150" />

            {/* Respiration dynamic expansion indicator lines */}
            <path d="M 188 85 L 198 85 M 193 80 L 198 85 L 193 90" stroke="#38bdf8" strokeWidth="1.2" />
            <path d="M 112 85 L 102 85 M 107 80 L 102 85 L 107 90" stroke="#38bdf8" strokeWidth="1.2" />
          </g>

          {/* Caliper Dimensions */}
          <g stroke="#38bdf8" strokeWidth="1" strokeDasharray="2,2" opacity="0.8">
            <line x1="85" y1="45" x2="120" y2="45" />
            <line x1="85" y1="175" x2="120" y2="175" />
            <line x1="85" y1="45" x2="85" y2="175" strokeDasharray="none" strokeWidth="1.2" />
            <text x="77" y="115" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="end">
              35 cm
            </text>
          </g>
        </g>
      )}

      {showLandmarks && (
        <g fill="#94a3b8" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
          <circle cx="120" cy="30" r="2.5" fill="#38bdf8" />
          <text x="55" y="34">{t('landmarkAxillaMargin')}</text>

          <circle cx="180" cy="210" r="2.5" fill="#38bdf8" />
          <text x="188" y="214">{t('landmarkIliacCrest')}</text>
        </g>
      )}
    </g>
  );
}
