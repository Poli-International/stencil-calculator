import React from 'react';
import { useApp } from '../context/AppContext';
import { ChevronRight } from 'lucide-react';

export const Breadcrumb: React.FC = () => {
  const { t } = useApp();

  return (
    <nav aria-label={t('ariaBreadcrumb')} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <ol className="flex items-center space-x-2 text-xs font-medium text-slate-500 dark:text-slate-400">
        <li>
          <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
            {t('navHome')}
          </a>
        </li>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <li>
          <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
            {t('navInnovation')}
          </a>
        </li>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <li className="font-bold text-slate-900 dark:text-slate-200" aria-current="page">
          {t('appTitle')}
        </li>
      </ol>
    </nav>
  );
};
