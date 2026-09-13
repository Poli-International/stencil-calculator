import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronDown } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const { t } = useApp();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: t('faqQ1'),
      a: t('faqA1')
    },
    {
      q: t('faqQ2'),
      a: t('faqA2')
    },
    {
      q: t('faqQ3'),
      a: t('faqA3')
    },
    {
      q: t('faqQ4'),
      a: t('faqA4')
    },
    {
      q: t('faqQ5'),
      a: t('faqA5')
    }
  ];

  return (
    <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
      <div>
        <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
          <span>❓</span>
          <span>{t('faqHeader')}</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-0.5">
          {t('faqSubtitle')}
        </p>
      </div>

      <div className="space-y-2.5 pt-2">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-800/20"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex justify-between items-center gap-3 cursor-pointer hover:bg-slate-100/60 dark:hover:bg-slate-800/50 transition"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200 dark:border-slate-800 pt-3 font-medium">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
