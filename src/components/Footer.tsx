import React from 'react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { t, setOpenModal } = useApp();

  return (
    <footer className="mt-12 pt-8 pb-12 border-t border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight">
                {t('appTitle')}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">
                v2.6.0
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('footerPublishedBy')}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-xs font-semibold">
            <button
              onClick={() => setOpenModal('how_to_measure')}
              className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
            >
              {t('navHowToMeasure')}
            </button>
            <button
              onClick={() => setOpenModal('stencil_guide')}
              className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
            >
              {t('navCurvatureGuide')}
            </button>
            <button
              onClick={() => setOpenModal('anatomy_ref')}
              className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
            >
              {t('navAnatomyRef')}
            </button>
            <button
              onClick={() => setOpenModal('embed_modal')}
              className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
            >
              {t('navEmbedWidget')}
            </button>
          </div>
        </div>

        {/* BioFlex / Standards citation compliance note */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
          <p>
            {t('footerComplianceNotice')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-2 text-[11px] text-slate-400">
          <p>{t('footerCopyright').replace('{year}', new Date().getFullYear().toString())}</p>
          <p>{t('footerZeroTracking')}</p>
        </div>
      </div>
    </footer>
  );
};
