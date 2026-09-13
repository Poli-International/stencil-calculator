import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { bodyPartsDatabase } from '../data/bodyParts';
import { Target, AlertCircle, CheckCircle, Sparkles, ZoomIn } from 'lucide-react';

export const PlacementGuideTab: React.FC = () => {
  const { unit, t, setOpenModal } = useApp();

  const [fitWidth, setFitWidth] = useState<number>(unit === 'inches' ? 6 : 15);
  const [fitBodyPart, setFitBodyPart] = useState<string>('forearm_outer');
  const [wrapPercentage, setWrapPercentage] = useState<number>(50);
  const [twistAngle, setTwistAngle] = useState<number>(0);
  const [selectedPhototype, setSelectedPhototype] = useState<number>(1);
  const [carbonType, setCarbonType] = useState<string>('purple');
  const [lightingMode, setLightingMode] = useState<string>('studio');
  const [zoneZoom, setZoneZoom] = useState<string>('full');
  const [heatmapView, setHeatmapView] = useState<'all' | 'anterior' | 'posterior'>('all');
  const [selectedHeatmapZone, setSelectedHeatmapZone] = useState<string>('forearm');

  const bp = bodyPartsDatabase[fitBodyPart] || bodyPartsDatabase.forearm_outer;
  const fitWidthCm = unit === 'inches' ? fitWidth * 2.54 : fitWidth;
  const calculatedWrapPct = Math.min(100, Math.round((fitWidthCm / bp.circumference_average) * 100));

  const isExcessiveWrap = calculatedWrapPct > bp.wrap_threshold;

  // Fitzpatrick phototypes with CSS custom properties
  const phototypes = [
    { id: 1, name: t('phototype1'), cssVar: 'var(--phototype-1)', contrast: t('contrastUltraHigh'), safe: true },
    { id: 2, name: t('phototype2'), cssVar: 'var(--phototype-2)', contrast: t('contrastHigh'), safe: true },
    { id: 3, name: t('phototype3'), cssVar: 'var(--phototype-3)', contrast: t('contrastOptimal'), safe: true },
    { id: 4, name: t('phototype4'), cssVar: 'var(--phototype-4)', contrast: t('contrastModerate'), safe: true },
    { id: 5, name: t('phototype5'), cssVar: 'var(--phototype-5)', contrast: t('contrastLow'), safe: false },
    { id: 6, name: t('phototype6'), cssVar: 'var(--phototype-6)', contrast: t('contrastLowVis'), safe: false }
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-base">
            2
          </div>
          <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
            {t('sec2Title')}
          </h2>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
          {t('sec2Subtitle')}
        </p>
      </div>

      {/* FORM & PLACEMENT CHECK */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            {t('lblFitWidth')} ({unit})
          </label>
          <input
            type="number"
            min="0.5"
            step="0.1"
            value={fitWidth}
            onChange={(e) => setFitWidth(parseFloat(e.target.value) || 0)}
            className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            {t('lblBodyPart')}
          </label>
          <select
            value={fitBodyPart}
            onChange={(e) => setFitBodyPart(e.target.value)}
            className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-slate-900 dark:text-white"
          >
            {Object.entries(bodyPartsDatabase).map(([k, item]) => (
              <option key={k} value={k}>
                {item.name} ({t('lblAvgCircumference')} {item.circumference_average}cm)
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            <span>{t('lblWrapPercentage')}</span>
            <span className="text-blue-600">{wrapPercentage}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={wrapPercentage}
            onChange={(e) => setWrapPercentage(parseInt(e.target.value))}
            className="w-full h-10 accent-blue-600 cursor-pointer"
          />
        </div>
      </div>

      {/* PLACEMENT RESULT CARD */}
      <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {isExcessiveWrap ? (
              <AlertCircle className="w-5 h-5 text-amber-500" />
            ) : (
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            )}
            <span className="font-extrabold text-sm text-slate-900 dark:text-white">
              {isExcessiveWrap
                ? t('cautionDesignWraps').replace('{pct}', calculatedWrapPct.toString()).replace('{bodyPart}', bp.name)
                : t('fitDesignOccupies').replace('{pct}', calculatedWrapPct.toString())}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {bp.placement_notes}
          </p>
        </div>

        <span
          className={`px-3 py-1.5 text-xs font-black rounded-xl self-start sm:self-auto uppercase tracking-wide ${
            isExcessiveWrap
              ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300'
              : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300'
          }`}
        >
          {isExcessiveWrap ? t('riskHeavyWrap') : t('riskOptimalPlane')}
        </span>
      </div>

      {/* SKIN STRETCH & PRONATION TWIST SIMULATOR */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>🔄</span>
              <span>{t('twistTitle')}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('twistSubtitle')}
            </p>
          </div>
          <span className="px-3 py-1 text-xs font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 rounded-full">
            {twistAngle === 0 ? t('twistRelaxedPos') : `${twistAngle}° (${twistAngle > 0 ? t('twistPronatedIn') : t('twistSupinatedOut')})`}
          </span>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between mb-1">
            <span>{t('lblTwistAngle')}</span>
            <span className="text-blue-600 font-extrabold">{twistAngle}°</span>
          </label>
          <input
            type="range"
            min="-45"
            max="45"
            value={twistAngle}
            onChange={(e) => setTwistAngle(parseInt(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
        </div>

        {/* Cylinder SVG Simulation */}
        <div className="w-full h-48 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center p-4">
          <svg viewBox="0 0 400 160" className="w-full max-w-md h-full">
            {/* Forearm cylinder background */}
            <defs>
              <linearGradient id="armSkinGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f8fafc" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#cbd5e1" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            <rect x="60" y="25" width="280" height="110" rx="30" fill="url(#armSkinGrad)" stroke="#94a3b8" strokeWidth="2" />
            
            {/* Dynamic twisted linework grid */}
            <g transform={`rotate(${twistAngle * 0.4}, 200, 80)`}>
              <rect x="130" y="45" width="140" height="70" rx="4" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeDasharray="4 2" />
              <line x1="200" y1="45" x2="200" y2="115" stroke="#2563eb" strokeWidth="2" />
              <line x1="130" y1="80" x2="270" y2="80" stroke="#2563eb" strokeWidth="2" />
              <circle cx="200" cy="80" r="18" fill="none" stroke="#2563eb" strokeWidth="2" />
            </g>

            {/* Muscle movement vector arrows */}
            <text x="200" y="150" textAnchor="middle" fontSize="11" fontWeight="700" fill="#64748b">
              {twistAngle === 0 ? t('twistRestingSymmetry') : t('twistShearDrift').replace('{deg}', Math.abs(twistAngle * 0.4).toFixed(1))}
            </text>
          </svg>
        </div>
      </div>

      {/* FITZPATRICK SKIN PHOTOTYPE & STENCIL CONTRAST VISUALIZER */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>🎨</span>
              <span>{t('phototypeTitle')}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('phototypeSubtitle')}
            </p>
          </div>
          <span className="px-3 py-1 text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 rounded-full">
            {phototypes[selectedPhototype - 1]?.contrast}
          </span>
        </div>

        {/* Phototype Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {phototypes.map((pt) => (
            <button
              key={pt.id}
              onClick={() => setSelectedPhototype(pt.id)}
              className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex items-center gap-2 ${
                selectedPhototype === pt.id
                  ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/50 ring-2 ring-blue-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
              }`}
            >
              <span className="w-5 h-5 rounded-full border border-slate-400/50 shrink-0" style={{ backgroundColor: pt.cssVar }} />
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{pt.name}</span>
            </button>
          ))}
        </div>

        {/* Phototype Simulation Canvas Box */}
        <div
          className="w-full h-36 rounded-xl p-4 flex items-center justify-between transition-colors border border-slate-300 dark:border-slate-700"
          style={{ backgroundColor: phototypes[selectedPhototype - 1]?.cssVar }}
        >
          <div className="p-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-lg border border-slate-300 dark:border-slate-700">
            <span className="text-xs font-black text-slate-900 dark:text-white block">
              {t('lblMelaninBg').replace('{type}', phototypes[selectedPhototype - 1]?.name)}
            </span>
            <span className="text-[11px] text-slate-600 dark:text-slate-300">
              {t('lblCarbonType').replace('{type}', carbonType === 'purple' ? t('carbonCrystalViolet') : carbonType === 'red' ? t('carbonS8Red') : t('carbonElectrumGreen'))}
            </span>
          </div>

          <div
            className="w-24 h-24 rounded-lg border-2 flex items-center justify-center font-black text-xs"
            style={{
              borderColor: carbonType === 'purple' ? 'var(--carbon-purple)' : carbonType === 'red' ? 'var(--carbon-red)' : 'var(--carbon-green)',
              color: carbonType === 'purple' ? 'var(--carbon-purple)' : carbonType === 'red' ? 'var(--carbon-red)' : 'var(--carbon-green)'
            }}
          >
            {t('stencilSampleText')}
          </div>
        </div>
      </div>
    </div>
  );
};
