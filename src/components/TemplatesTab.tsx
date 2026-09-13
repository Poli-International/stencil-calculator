import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { projectTemplatesDatabase } from '../data/templates';
import { PlacementTemplate } from '../types';
import { Search, ArrowRight, Eye, Box, Compass } from 'lucide-react';
import { Anatomical3DVisual } from './Anatomical3DVisual';

export const TemplatesTab: React.FC = () => {
  const { unit, t, applyTemplateToCalculator } = useApp();

  const [category, setCategory] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<PlacementTemplate | null>(null);
  const [modalShowLandmarks, setModalShowLandmarks] = useState<boolean>(true);

  const filtered = projectTemplatesDatabase.filter((tmpl) => {
    const matchesCategory = category === 'all' || tmpl.category === category;
    const matchesSearch =
      tmpl.name.toLowerCase().includes(search.toLowerCase()) ||
      tmpl.notes.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleApply = (tmpl: PlacementTemplate) => {
    applyTemplateToCalculator(tmpl);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-base">
            4
          </div>
          <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
            {t('sec4Title')}
          </h2>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
          {t('sec4Subtitle')}
        </p>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('placeholderSearchTemplates')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 dark:text-white"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-slate-900 dark:text-white cursor-pointer"
        >
          <option value="all">{t('optAllCategories')}</option>
          <option value="sleeves">{t('catSleeves')}</option>
          <option value="back">{t('catBack')}</option>
          <option value="chest">{t('catChest')}</option>
          <option value="legs">{t('catLegs')}</option>
          <option value="torso">{t('catTorso')}</option>
        </select>
      </div>

      {/* TEMPLATES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((tmpl) => (
          <div
            key={tmpl.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between hover:border-blue-500/50 transition duration-200 space-y-4"
          >
            <div>
              {/* 3D Anatomical SVG Visual Header */}
              <div className="mb-4">
                <Anatomical3DVisual
                  templateId={tmpl.id}
                  category={tmpl.category}
                  name={tmpl.name}
                  className="h-44 w-full"
                  interactive={true}
                />
              </div>

              <div className="flex justify-between items-start gap-2 mb-2">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white line-clamp-1">
                  {tmpl.name}
                </h3>
                <span
                  className={`px-2 py-0.5 text-[10px] font-black rounded-full uppercase tracking-wider ${
                    tmpl.difficulty === 'advanced'
                      ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'
                      : tmpl.difficulty === 'intermediate'
                      ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'
                      : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                  }`}
                >
                  {tmpl.difficulty}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                {tmpl.notes}
              </p>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs font-semibold">
                <span className="text-slate-400 text-[10px] block uppercase font-bold">{t('lblPlacementSize')}</span>
                <span className="text-slate-900 dark:text-white font-extrabold text-sm">
                  {unit === 'inches'
                    ? `${tmpl.dimensions_inches.width}" × ${tmpl.dimensions_inches.height}"`
                    : `${tmpl.dimensions_cm.width} × ${tmpl.dimensions_cm.height} cm`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setSelectedTemplate(tmpl)}
                className="flex-1 py-2 px-3 text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{t('btn3DView')}</span>
              </button>
              <button
                onClick={() => handleApply(tmpl)}
                className="py-2 px-3 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer"
                title={t('tooltipTransferCalc')}
              >
                <span>{t('btnCalculateStencil')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DETAIL MODAL WITH 3D ANATOMICAL INSPECTION */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {selectedTemplate.name}
                </h3>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
                  {unit === 'inches'
                    ? `${selectedTemplate.dimensions_inches.width}" × ${selectedTemplate.dimensions_inches.height}"`
                    : `${selectedTemplate.dimensions_cm.width} × ${selectedTemplate.dimensions_cm.height} cm`} • {selectedTemplate.difficulty}
                </span>
              </div>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center font-bold transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* High-Definition 3D Anatomical Visualizer */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Box className="w-4 h-4 text-blue-500" />
                  3D Anatomical Placement Simulation
                </span>
                <button
                  type="button"
                  onClick={() => setModalShowLandmarks(!modalShowLandmarks)}
                  className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:text-blue-500 flex items-center gap-1 cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>{modalShowLandmarks ? 'Hide Landmarks' : 'Show Landmarks'}</span>
                </button>
              </div>

              <Anatomical3DVisual
                templateId={selectedTemplate.id}
                category={selectedTemplate.category}
                name={selectedTemplate.name}
                className="h-56 w-full"
                interactive={true}
                showLandmarks={modalShowLandmarks}
              />
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong className="text-slate-900 dark:text-white block font-bold mb-0.5">{t('lblAnatomicalPlacement')}:</strong>
              {selectedTemplate.notes}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setSelectedTemplate(null)}
                className="py-2 px-4 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
              >
                {t('btnClose')}
              </button>
              <button
                onClick={() => {
                  handleApply(selectedTemplate);
                  setSelectedTemplate(null);
                }}
                className="py-2 px-4 text-xs font-bold bg-blue-600 text-white rounded-xl shadow-xs hover:bg-blue-700 transition cursor-pointer"
              >
                {t('btnCalculateStencilSize')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
