import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { bodyPartsDatabase } from '../data/bodyParts';
import { calculateCurvature } from '../utils/calculations';
import { generateStencilPdf } from '../utils/pdfGenerator';
import {
  Lock,
  Unlock,
  Ruler,
  FileDown,
  Printer,
  Share2,
  Copy,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  Scissors
} from 'lucide-react';

export const CurvatureCalculatorTab: React.FC = () => {
  const {
    unit,
    t,
    activeCalculation,
    setActiveCalculation,
    saveCurrentConfig,
    savedConfigs,
    deleteSavedConfig,
    clearAllConfigs,
    setOpenModal,
    showToast,
    presetTemplate
  } = useApp();

  // Mode state
  const [calcMode, setCalcMode] = useState<'standard' | 'full_sleeve'>('standard');
  const [designWidth, setDesignWidth] = useState<number>(unit === 'inches' ? 6 : 15);
  const [designHeight, setDesignHeight] = useState<number>(unit === 'inches' ? 8 : 20);
  const [bodyPart, setBodyPart] = useState<string>('outer_upper_arm');
  const [orientation, setOrientation] = useState<string>('vertical');
  const [aspectLocked, setAspectLocked] = useState<boolean>(true);
  const [aspectRatio, setAspectRatio] = useState<number>(1.33);

  // Apply preset template when set
  useEffect(() => {
    if (presetTemplate) {
      const w = unit === 'inches' ? presetTemplate.dimensions_inches.width : presetTemplate.dimensions_cm.width;
      const h = unit === 'inches' ? presetTemplate.dimensions_inches.height : presetTemplate.dimensions_cm.height;
      setDesignWidth(w);
      setDesignHeight(h);
      if (presetTemplate.body_parts && presetTemplate.body_parts[0]) {
        setBodyPart(presetTemplate.body_parts[0]);
      }
      setAspectRatio(h / w);
    }
  }, [presetTemplate, unit]);

  // Drag box states
  const [boxOpacity, setBoxOpacity] = useState<number>(80);
  const [dragHistory, setDragHistory] = useState<{ w: number; h: number }[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Dermal Elasticity vs Age state
  const [clientAge, setClientAge] = useState<number>(28);
  const [elasticityZone, setElasticityZone] = useState<string>('outer_upper_arm');

  // Transfer Gel Dosage state
  const [dispensedGelMl, setDispensedGelMl] = useState<number>(1.2);
  const [gelBrand, setGelBrand] = useState<string>('stencil_stuff');
  const [skinHydration, setSkinHydration] = useState<string>('normal');

  // Paper Layout Optimizer state
  const [paperFormat, setPaperFormat] = useState<'a4' | 'letter' | 'spirit14'>('a4');
  const [printMargin, setPrintMargin] = useState<number>(0.5);
  const [packingStrategy, setPackingStrategy] = useState<'auto' | 'portrait' | 'landscape'>('auto');
  const [showGridLines, setShowGridLines] = useState<boolean>(true);
  const [overlapMode, setOverlapMode] = useState<boolean>(false);
  const [nestingAlgorithm, setNestingAlgorithm] = useState<string>('auto_optimal');
  const [overlapSeam, setOverlapSeam] = useState<number>(1.0);
  const [historyUnitView, setHistoryUnitView] = useState<'cm' | 'inches' | 'dual'>('cm');

  // Full Sleeve Continuous Taper inputs
  const [sleeveShoulderCirc, setSleeveShoulderCirc] = useState<number>(40);
  const [sleeveBicepCirc, setSleeveBicepCirc] = useState<number>(34);
  const [sleeveElbowCirc, setSleeveElbowCirc] = useState<number>(28);
  const [sleeveForearmCirc, setSleeveForearmCirc] = useState<number>(26);
  const [sleeveWristCirc, setSleeveWristCirc] = useState<number>(17);
  const [sleeveUpperArmLength, setSleeveUpperArmLength] = useState<number>(30);
  const [sleeveForearmLength, setSleeveForearmLength] = useState<number>(26);
  const [sleeveWrapCoverage, setSleeveWrapCoverage] = useState<number>(1.0);
  const [sleeveFlexionMargin, setSleeveFlexionMargin] = useState<number>(0.04);
  const [sleeveDartRelief, setSleeveDartRelief] = useState<boolean>(true);

  // Execute initial calculation
  useEffect(() => {
    handleCalculate();
  }, [designWidth, designHeight, bodyPart, orientation, unit]);

  const handleCalculate = () => {
    if (designWidth <= 0 || designHeight <= 0) return;
    const res = calculateCurvature(designWidth, designHeight, unit, bodyPart, orientation);
    setActiveCalculation(res);
  };

  const handleWidthChange = (val: number) => {
    setDesignWidth(val);
    if (aspectLocked && aspectRatio > 0) {
      setDesignHeight(parseFloat((val * aspectRatio).toFixed(1)));
    }
  };

  const handleHeightChange = (val: number) => {
    setDesignHeight(val);
    if (aspectLocked && aspectRatio > 0) {
      setDesignWidth(parseFloat((val / aspectRatio).toFixed(1)));
    }
  };

  const toggleAspectLock = () => {
    if (!aspectLocked) {
      setAspectRatio(designHeight / designWidth);
    }
    setAspectLocked(!aspectLocked);
  };

  const handleAutoFitBody = () => {
    const bp = bodyPartsDatabase[bodyPart];
    if (bp) {
      const standardWidth = unit === 'inches' ? parseFloat((bp.circumference_average * 0.4 / 2.54).toFixed(1)) : parseFloat((bp.circumference_average * 0.4).toFixed(1));
      const standardHeight = unit === 'inches' ? parseFloat((standardWidth * 1.33).toFixed(1)) : parseFloat((standardWidth * 1.33).toFixed(1));
      setDesignWidth(standardWidth);
      setDesignHeight(standardHeight);
      showToast(t('toastAppliedToCalculator'), 'info');
    }
  };

  // Gel Bleed Warning calculation
  const targetSurfaceAreaCm2 = activeCalculation ? activeCalculation.surfaceAreaCm2 : 300;
  const optimalGelMinMl = parseFloat((targetSurfaceAreaCm2 * 0.0035).toFixed(2));
  const optimalGelMaxMl = parseFloat((targetSurfaceAreaCm2 * 0.0055).toFixed(2));
  const isGelExcessive = dispensedGelMl > optimalGelMaxMl * 1.3;
  const isGelInsufficient = dispensedGelMl < optimalGelMinMl * 0.7;

  // Elasticity calculations
  const elasticityLossPct = Math.max(0, Math.min(60, (clientAge - 20) * 0.85));
  const ageAdjustedElasticity = (100 - elasticityLossPct).toFixed(1);
  const stretchCompensationFactor = (10 + elasticityLossPct * 0.25).toFixed(1);

  return (
    <div className="space-y-6">
      {/* SECTION 1: HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-base">
              1
            </div>
            <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              {t('sec1Title')}
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            {t('sec1Subtitle')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setOpenModal('anatomy_visualizer')}
            className="px-3.5 py-2 text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900 transition flex items-center gap-1.5 cursor-pointer"
          >
            🗺️ {t('btnAnatomyVisualizer')}
          </button>
          <button
            onClick={() => setOpenModal('quick_anatomy')}
            className="px-3.5 py-2 text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900 transition flex items-center gap-1.5 cursor-pointer"
          >
            🧬 {t('btnQuickAnatomyRef')}
          </button>
          <button
            onClick={() => setOpenModal('stencil_guide')}
            className="px-3.5 py-2 text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900 transition flex items-center gap-1.5 cursor-pointer"
          >
            📋 {t('btnStencilAppGuide')}
          </button>
          <button
            onClick={() => setOpenModal('how_to_measure')}
            className="px-3.5 py-2 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-1.5 cursor-pointer"
          >
            📏 {t('btnHowToMeasure')}
          </button>
        </div>
      </div>

      {/* CALCULATION MODE SWITCHER */}
      <div className="flex bg-slate-200/80 dark:bg-slate-800/80 p-1 rounded-xl max-w-md border border-slate-300 dark:border-slate-700">
        <button
          onClick={() => setCalcMode('standard')}
          className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
            calcMode === 'standard'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          📐 {t('btnModeStandard')}
        </button>
        <button
          onClick={() => setCalcMode('full_sleeve')}
          className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
            calcMode === 'full_sleeve'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          ⚡ {t('btnModeFullSleeve')}
        </button>
      </div>

      {/* FULL SLEEVE MODE ACCORDION */}
      {calcMode === 'full_sleeve' ? (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border-2 border-indigo-500/40 dark:border-indigo-500/30 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                💪 CONTINUOUS MULTI-JOINT PROJECT MATRIX
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                {t('sleeveModeTitle')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t('sleeveModeSubtitle')}
              </p>
            </div>
            <span className="px-3 py-1 text-xs font-bold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full border border-indigo-200 dark:border-indigo-800">
              5 Landmark Zones
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Circumferences */}
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {t('lblAnatomicalCircumferences')}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">{t('lblShoulderCirc')} (cm)</label>
                  <input
                    type="number"
                    value={sleeveShoulderCirc}
                    onChange={(e) => setSleeveShoulderCirc(parseFloat(e.target.value) || 0)}
                    className="w-full mt-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">{t('lblBicepCirc')} (cm)</label>
                  <input
                    type="number"
                    value={sleeveBicepCirc}
                    onChange={(e) => setSleeveBicepCirc(parseFloat(e.target.value) || 0)}
                    className="w-full mt-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-rose-600 dark:text-rose-400">{t('lblElbowCirc')} (cm)</label>
                  <input
                    type="number"
                    value={sleeveElbowCirc}
                    onChange={(e) => setSleeveElbowCirc(parseFloat(e.target.value) || 0)}
                    className="w-full mt-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-emerald-600 dark:text-emerald-400">{t('lblForearmCirc')} (cm)</label>
                  <input
                    type="number"
                    value={sleeveForearmCirc}
                    onChange={(e) => setSleeveForearmCirc(parseFloat(e.target.value) || 0)}
                    className="w-full mt-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-amber-600 dark:text-amber-400">{t('lblWristCirc')} (cm)</label>
                  <input
                    type="number"
                    value={sleeveWristCirc}
                    onChange={(e) => setSleeveWristCirc(parseFloat(e.target.value) || 0)}
                    className="w-full mt-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Heights & Parameters */}
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {t('lblVerticalJointParams')}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">{t('lblUpperArmLength')} (cm)</label>
                  <input
                    type="number"
                    value={sleeveUpperArmLength}
                    onChange={(e) => setSleeveUpperArmLength(parseFloat(e.target.value) || 0)}
                    className="w-full mt-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">{t('lblForearmLength')} (cm)</label>
                  <input
                    type="number"
                    value={sleeveForearmLength}
                    onChange={(e) => setSleeveForearmLength(parseFloat(e.target.value) || 0)}
                    className="w-full mt-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-bold"
                  />
                </div>
              </div>

              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg border border-indigo-200 dark:border-indigo-800 flex justify-between items-center text-xs">
                <span className="font-bold text-indigo-900 dark:text-indigo-200">{t('lblTotalSleeveLength')}:</span>
                <span className="font-extrabold text-indigo-600 dark:text-indigo-400 text-sm">
                  {(sleeveUpperArmLength + sleeveForearmLength).toFixed(1)} cm / {((sleeveUpperArmLength + sleeveForearmLength) / 2.54).toFixed(1)} in
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* STANDARD CURVATURE CALCULATOR CARD */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        {/* Proportional Scaling Lock Bar */}
        <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
            <span>{t('propScaling')}</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">1 : {aspectRatio.toFixed(2)}</span>
          </div>
          <button
            onClick={toggleAspectLock}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
              aspectLocked
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            {aspectLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            <span>{aspectLocked ? t('aspectLocked') : t('aspectUnlocked')}</span>
          </button>
        </div>

        {/* Interactive Drag-Handle Resize Visual Stage */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              {t('dragBoxHeader')}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleAutoFitBody}
                className="px-2.5 py-1 text-xs font-bold bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 rounded-lg hover:bg-sky-200 dark:hover:bg-sky-900 transition cursor-pointer"
              >
                📐 {t('btnAutoFitBody')}
              </button>
              <span className="px-2.5 py-1 text-xs font-extrabold bg-blue-600 text-white rounded-full">
                {designWidth} × {designHeight} {unit}
              </span>
            </div>
          </div>

          {/* Interactive Visual Stage Canvas Box */}
          <div className="relative w-full h-44 bg-white dark:bg-slate-950 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center overflow-hidden select-none">
            <div
              style={{
                width: `${Math.min(280, Math.max(100, designWidth * 12))}px`,
                height: `${Math.min(150, Math.max(70, designHeight * 7))}px`,
                opacity: boxOpacity / 100
              }}
              className="relative bg-blue-500/15 dark:bg-blue-500/25 border-2 border-blue-600 rounded-lg flex flex-col items-center justify-center p-2 text-center transition-all"
            >
              <span className="text-xs font-extrabold text-blue-700 dark:text-blue-300">
                {designWidth} {unit} × {designHeight} {unit}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                {t('dragHint')}
              </span>
            </div>
          </div>
        </div>

        {/* Inputs Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t('lblDesignWidth')} ({unit})
            </label>
            <input
              type="number"
              min="0.5"
              step="0.1"
              value={designWidth}
              onChange={(e) => handleWidthChange(parseFloat(e.target.value) || 0)}
              className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t('lblDesignHeight')} ({unit})
            </label>
            <input
              type="number"
              min="0.5"
              step="0.1"
              value={designHeight}
              onChange={(e) => handleHeightChange(parseFloat(e.target.value) || 0)}
              className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t('lblBodyPart')}
            </label>
            <select
              value={bodyPart}
              onChange={(e) => setBodyPart(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {Object.entries(bodyPartsDatabase).map(([key, bp]) => (
                <option key={key} value={key}>
                  {t('bp_' + key) || bp.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t('lblOrientation')}
            </label>
            <select
              value={orientation}
              onChange={(e) => setOrientation(e.target.value)}
              className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="vertical">{t('orientVertical')}</option>
              <option value="horizontal">{t('orientHorizontal')}</option>
              <option value="wraparound">{t('orientWraparound')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* RESULTS DISPLAY CARDS */}
      {activeCalculation && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border-2 border-blue-500/40 dark:border-blue-500/30 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>📏</span>
              <span>{t('resultsTitle')}</span>
            </h3>
            <span className="px-3 py-1 text-xs font-extrabold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-800 self-start sm:self-auto">
              Curvature Factor: +{Math.round((activeCalculation.curvatureFactor - 1) * 100)}%
            </span>
          </div>

          {/* 4 Big Output Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{t('lblOriginalSize')}</span>
              <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                {activeCalculation.originalWidth} × {activeCalculation.originalHeight} {activeCalculation.unit}
              </p>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">{t('lblFlatArtwork')}</span>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800">
              <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase">{t('lblAdjustedSize')}</span>
              <p className="text-xl font-black text-blue-600 dark:text-blue-400 mt-1">
                {activeCalculation.adjustedWidth} × {activeCalculation.adjustedHeight} {activeCalculation.unit}
              </p>
              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">{t('lblPrintOnStencil')}</span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{t('lblPrintAt')}</span>
              <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                {activeCalculation.printerScalePercent}%
              </p>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">{t('lblDriverScale')}</span>
            </div>

            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase">{t('lblActionSuite')}</span>
                <p className="text-xs text-emerald-800 dark:text-emerald-200 font-medium mt-1">
                  {t('lblReadyToPrint')}
                </p>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => generateStencilPdf(activeCalculation)}
                  className="flex-1 py-2 text-xs font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>{t('btnPdf')}</span>
                </button>
                <button
                  onClick={() => saveCurrentConfig()}
                  className="flex-1 py-2 text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:opacity-90 transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>💾</span>
                  <span>{t('btnSave')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Thermal Paper Match & Needle Grouping Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                <Printer className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{t('lblThermalPaperMatch')}</span>
              </div>
              <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                {activeCalculation.paperType === 'single_sheet' && t('thermalSingleSheet')}
                {activeCalculation.paperType === 'spirit_14' && t('thermalSpiritReq')}
                {activeCalculation.paperType === 'grid_tiling' && t('thermalGridTiling')}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {activeCalculation.paperType === 'single_sheet' && t('thermalSingleDesc')}
                {activeCalculation.paperType === 'spirit_14' && t('thermalSpiritDesc')}
                {activeCalculation.paperType === 'grid_tiling' && t('thermalGridDesc')}
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{t('suppliesTitle')}</span>
              </div>
              <div className="text-xs space-y-0.5 pt-1 text-slate-600 dark:text-slate-400 font-medium">
                <div>✏️ <strong className="text-slate-900 dark:text-white">{t('lblLining')}</strong> {activeCalculation.liningNeedles}</div>
                <div>🖌️ <strong className="text-slate-900 dark:text-white">{t('lblShading')}</strong> {activeCalculation.shadingNeedles}</div>
                <div>🧪 <strong className="text-slate-900 dark:text-white">{t('lblPrep')}</strong> {activeCalculation.inkCapsPrep}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: DERMAL ELASTICITY VS AGE COMPENSATION CHART */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>📈</span>
              <span>{t('dermalElasticityTitle')}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('dermalElasticitySubtitle')}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/60 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800">
            <span className="text-xs font-bold text-blue-700 dark:text-blue-300">{t('lblClientAge')}</span>
            <input
              type="range"
              min="18"
              max="80"
              value={clientAge}
              onChange={(e) => setClientAge(parseInt(e.target.value))}
              className="w-24 accent-blue-600 cursor-pointer"
            />
            <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">{clientAge} yrs</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 font-bold block">{t('lblAgeElasticity')}</span>
            <span className="text-base font-black text-slate-900 dark:text-white">{ageAdjustedElasticity}%</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{t('lblCollagenBaseline')}</span>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800">
            <span className="text-blue-700 dark:text-blue-300 font-bold block">{t('lblStretchMultiplier')}</span>
            <span className="text-base font-black text-blue-600 dark:text-blue-400">+{stretchCompensationFactor}%</span>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 block">{t('lblWidthCompensation')}</span>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800">
            <span className="text-amber-700 dark:text-amber-300 font-bold block">{t('lblLangersAnisotropy')}</span>
            <span className="text-base font-black text-amber-600 dark:text-amber-400">{t('lblLangersValue')}</span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 block">{t('lblLongitudinalCompliance')}</span>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <span className="text-emerald-700 dark:text-emerald-300 font-bold block">{t('lblTensileStatus')}</span>
            <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
              {clientAge < 35 ? t('statusDenseResilient') : clientAge < 55 ? t('statusModerateElastic') : t('statusFragileDermis')}
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block">{t('lblRecoilFactor')}</span>
          </div>
        </div>
      </div>

      {/* SECTION 3: TRANSFER GEL DOSAGE OPTIMIZER */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>🧴</span>
              <span>{t('gelOptimizerTitle')}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('gelOptimizerSubtitle')}
            </p>
          </div>
          <span className="px-3 py-1 text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 rounded-full">
            {t('lblSurfaceArea')} {targetSurfaceAreaCm2} cm²
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">{t('lblGelFormula')}</label>
            <select
              value={gelBrand}
              onChange={(e) => setGelBrand(e.target.value)}
              className="w-full h-9 px-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-semibold"
            >
              <option value="stencil_stuff">{t('optGelStencilStuff')}</option>
              <option value="anchored">{t('optGelAnchored')}</option>
              <option value="electrum">{t('optGelElectrum')}</option>
              <option value="dermalize">{t('optGelDermalize')}</option>
            </select>
          </div>
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">{t('lblSkinSebumType')}</label>
            <select
              value={skinHydration}
              onChange={(e) => setSkinHydration(e.target.value)}
              className="w-full h-9 px-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-semibold"
            >
              <option value="normal">{t('optSebumNormal')}</option>
              <option value="oily">{t('optSebumOily')}</option>
              <option value="dry">{t('optSebumDry')}</option>
            </select>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">{t('lblDispensedVolume')}</label>
              <span className="font-extrabold text-blue-600">{dispensedGelMl} mL</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="3.5"
              step="0.1"
              value={dispensedGelMl}
              onChange={(e) => setDispensedGelMl(parseFloat(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Live Warning Banner */}
        {isGelExcessive ? (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-xl flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-200">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-black">{t('gelWarningBleedTitle')}</strong>
              {t('gelWarningBleedDesc')}
            </div>
          </div>
        ) : isGelInsufficient ? (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-black">{t('gelWarningLiftingTitle')}</strong>
              {t('gelWarningLiftingDesc')}
            </div>
          </div>
        ) : (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800 dark:text-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-black">{t('gelOptimalTitle')}</strong>
              {/* t() takes a key and nothing else, so the second argument was
                  silently dropped and the reader saw a literal "{min} - {max}".
                  Every other placeholder in this app is substituted with
                  .replace(), so this one is too. */}
              {t('gelOptimalDesc')
                .replace('{min}', String(optimalGelMinMl))
                .replace('{max}', String(optimalGelMaxMl))}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 4: SAVED CONFIGURATIONS & COMPARISON */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>💾</span>
              <span>{t('historyTitle')}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('historySubtitle')}
            </p>
          </div>
          {savedConfigs.length > 0 && (
            <button
              onClick={clearAllConfigs}
              className="px-3 py-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-lg hover:bg-rose-100 transition cursor-pointer"
            >
              {t('clearSavedHistory')}
            </button>
          )}
        </div>

        {savedConfigs.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs font-medium">
            {t('historyEmptyText')}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                  <th className="p-2.5 font-bold">{t('thNamePreset')}</th>
                  <th className="p-2.5 font-bold">{t('thBodyLocation')}</th>
                  <th className="p-2.5 font-bold">{t('thFlatSize')}</th>
                  <th className="p-2.5 font-bold text-blue-600 dark:text-blue-400">{t('thAdjustedSize')}</th>
                  <th className="p-2.5 font-bold">{t('thScale')}</th>
                  <th className="p-2.5 font-bold">{t('thAction')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {savedConfigs.map((cfg) => (
                  <tr key={cfg.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-2.5 font-bold text-slate-900 dark:text-white">{cfg.name}</td>
                    <td className="p-2.5 text-slate-600 dark:text-slate-400">{cfg.calculation?.bodyPartName || '-'}</td>
                    <td className="p-2.5 text-slate-600 dark:text-slate-400">
                      {cfg.calculation?.originalWidth} × {cfg.calculation?.originalHeight} {cfg.calculation?.unit}
                    </td>
                    <td className="p-2.5 font-bold text-blue-600 dark:text-blue-400">
                      {cfg.calculation?.adjustedWidth} × {cfg.calculation?.adjustedHeight} {cfg.calculation?.unit}
                    </td>
                    <td className="p-2.5 font-semibold text-slate-700 dark:text-slate-300">
                      {cfg.calculation?.printerScalePercent}%
                    </td>
                    <td className="p-2.5">
                      <button
                        onClick={() => deleteSavedConfig(cfg.id)}
                        className="text-rose-600 hover:text-rose-700 font-bold cursor-pointer"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
