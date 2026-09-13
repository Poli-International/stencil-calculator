import React from 'react';
import { useApp } from '../context/AppContext';
import { LanguageCode, UnitSystem } from '../types';
import { Compass, Printer, Moon, Sun } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    unit,
    setUnit,
    darkMode,
    setDarkMode,
    setOpenModal,
    t
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-500/20">
            P
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-base sm:text-lg">
                POLI INTERNATIONAL
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-800">
                PRO SUITE
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-1 hidden md:block">
              {t('appSubtitle')}
            </p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Language Selector */}
          <select
            aria-label={t('selectLanguage')}
            value={language}
            onChange={(e) => setLanguage(e.target.value as LanguageCode)}
            className="h-9 px-2 sm:px-2.5 text-xs sm:text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <option value="en">🇬🇧 EN</option>
            <option value="fr">🇫🇷 FR</option>
            <option value="it">🇮🇹 IT</option>
            <option value="de">🇩🇪 DE</option>
            <option value="es">🇪🇸 ES</option>
            <option value="pt">🇵🇹 PT</option>
            <option value="nl">🇳🇱 NL</option>
          </select>

          {/* Unit Toggle */}
          <select
            aria-label={t('unitSystemAria')}
            value={unit}
            onChange={(e) => setUnit(e.target.value as UnitSystem)}
            className="h-9 px-2 sm:px-2.5 text-xs sm:text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <option value="cm">{t('unitMetric')}</option>
            <option value="inches">{t('unitImperial')}</option>
          </select>

          {/* Action Buttons */}
          <button
            onClick={() => setOpenModal('how_to_measure')}
            className="h-9 px-2.5 sm:px-3 text-xs sm:text-sm font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition hidden sm:flex items-center gap-1.5 cursor-pointer"
            title={t('measurementGuideTitle')}
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t('guideButton')}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="h-9 px-2.5 text-xs sm:text-sm font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition hidden sm:flex items-center gap-1.5 cursor-pointer"
            title={t('printSettingsTitle')}
          >
            <Printer className="w-3.5 h-3.5" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="h-9 w-9 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
            aria-label={t('toggleDarkMode')}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>
    </header>
  );
};
