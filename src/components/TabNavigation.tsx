import React from 'react';
import { useApp } from '../context/AppContext';
import { Ruler, Target, Image as ImageIcon, LayoutTemplate } from 'lucide-react';

export const TabNavigation: React.FC = () => {
  const { activeTab, setActiveTab, t } = useApp();

  const tabs = [
    { id: 'curvature', label: t('tabCurvature'), icon: Ruler },
    { id: 'placement', label: t('tabPlacement'), icon: Target },
    { id: 'converter', label: t('tabConverter'), icon: ImageIcon },
    { id: 'templates', label: t('tabTemplates'), icon: LayoutTemplate }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-4">
      <div className="flex overflow-x-auto no-scrollbar gap-2 p-1.5 bg-slate-200/80 dark:bg-slate-900/80 backdrop-blur rounded-2xl border border-slate-300/80 dark:border-slate-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
