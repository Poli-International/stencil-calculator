import React from 'react';
import { useApp } from '../context/AppContext';
import { bodyPartsDatabase } from '../data/bodyParts';
import { Copy } from 'lucide-react';

export const ModalsContainer: React.FC = () => {
  const { openModal, setOpenModal, showToast, t } = useApp();

  if (!openModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      {/* HOW TO MEASURE GUIDE MODAL */}
      {openModal === 'how_to_measure' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>📏</span>
              <span>{t('modalMeasureTitle')}</span>
            </h3>
            <button
              onClick={() => setOpenModal(null)}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-h-[70vh] overflow-y-auto pr-1">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800 space-y-1">
              <strong className="text-blue-900 dark:text-blue-200 font-extrabold text-sm block">
                {t('modalMeasureStep1Title')}
              </strong>
              <p>
                {t('modalMeasureStep1Desc')}
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
              <strong className="text-slate-900 dark:text-white font-extrabold text-sm block">
                {t('modalMeasureStep2Title')}
              </strong>
              <p>
                {t('modalMeasureStep2Desc')}
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
              <strong className="text-slate-900 dark:text-white font-extrabold text-sm block">
                {t('modalMeasureStep3Title')}
              </strong>
              <p>
                {t('modalMeasureStep3Desc')}
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setOpenModal(null)}
              className="py-2 px-5 text-xs font-bold bg-blue-600 text-white rounded-xl shadow-xs cursor-pointer hover:bg-blue-700 transition"
            >
              {t('btnGotIt')}
            </button>
          </div>
        </div>
      )}

      {/* CURVATURE MATH GUIDE MODAL */}
      {openModal === 'stencil_guide' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>📐</span>
              <span>{t('modalMathTitle')}</span>
            </h3>
            <button
              onClick={() => setOpenModal(null)}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-h-[70vh] overflow-y-auto pr-1">
            <p>
              {t('modalMathIntro')}
            </p>

            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl font-mono text-center text-xs font-bold text-slate-900 dark:text-white">
              Apparent Width = 2 × R × sin(Arc Width / (2 × R))
            </div>

            <p>
              {t('modalMathConclusion')}
            </p>
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setOpenModal(null)}
              className="py-2 px-5 text-xs font-bold bg-blue-600 text-white rounded-xl shadow-xs cursor-pointer hover:bg-blue-700 transition"
            >
              {t('btnCloseGuide')}
            </button>
          </div>
        </div>
      )}

      {/* ANATOMY REFERENCE MODAL */}
      {openModal === 'anatomy_ref' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>🦴</span>
              <span>{t('modalAnatomyTitle')}</span>
            </h3>
            <button
              onClick={() => setOpenModal(null)}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="overflow-x-auto max-h-[60vh]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  <th className="p-2.5 font-bold">{t('thBodyZone')}</th>
                  <th className="p-2.5 font-bold">{t('thAvgCircumference')}</th>
                  <th className="p-2.5 font-bold">{t('thCurvatureFactor')}</th>
                  <th className="p-2.5 font-bold">{t('thWrapThreshold')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {Object.entries(bodyPartsDatabase).map(([k, item]) => (
                  <tr key={k} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-2.5 font-extrabold text-slate-900 dark:text-white">{t('bp_' + k) || item.name}</td>
                    <td className="p-2.5">{item.circumference_average} cm</td>
                    <td className="p-2.5 text-blue-600 font-bold">{item.curvature_factor}×</td>
                    <td className="p-2.5">{item.wrap_threshold}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setOpenModal(null)}
              className="py-2 px-5 text-xs font-bold bg-blue-600 text-white rounded-xl shadow-xs cursor-pointer hover:bg-blue-700 transition"
            >
              {t('btnDone')}
            </button>
          </div>
        </div>
      )}

      {/* EMBED MODAL */}
      {openModal === 'embed_modal' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>💻</span>
              <span>{t('modalEmbedTitle')}</span>
            </h3>
            <button
              onClick={() => setOpenModal(null)}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <p className="text-slate-600 dark:text-slate-400">
              {t('modalEmbedDesc')}
            </p>

            <textarea
              readOnly
              rows={3}
              value={`<iframe src="${window.location.origin}" width="100%" height="800" frameborder="0" title="${t('appTitle')}"></iframe>`}
              className="w-full p-3 bg-slate-950 text-emerald-400 font-mono text-xs rounded-xl border border-slate-800"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => {
                navigator.clipboard.writeText(`<iframe src="${window.location.origin}" width="100%" height="800" frameborder="0" title="${t('appTitle')}"></iframe>`);
                showToast(t('toastEmbedCopied'), 'success');
              }}
              className="py-2 px-5 text-xs font-bold bg-blue-600 text-white rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer hover:bg-blue-700 transition"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{t('btnCopyCode')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
