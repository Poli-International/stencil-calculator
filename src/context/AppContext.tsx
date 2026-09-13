import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  LanguageCode,
  UnitSystem,
  StencilCalculationResult,
  SavedConfiguration,
  PlacementTemplate
} from '../types';
import { translations } from '../data/translations';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  unit: UnitSystem;
  setUnit: (u: UnitSystem) => void;
  darkMode: boolean;
  setDarkMode: (d: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeCalculation: StencilCalculationResult | null;
  setActiveCalculation: (calc: StencilCalculationResult | null) => void;
  savedConfigs: SavedConfiguration[];
  saveCurrentConfig: (name?: string) => void;
  deleteSavedConfig: (id: string) => void;
  clearAllConfigs: () => void;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  openModal: string | null;
  setOpenModal: (m: string | null) => void;
  presetTemplate: PlacementTemplate | null;
  applyTemplateToCalculator: (tmpl: PlacementTemplate) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>('en');
  const [unit, setUnit] = useState<UnitSystem>('cm');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('curvature');
  const [activeCalculation, setActiveCalculation] = useState<StencilCalculationResult | null>(null);
  const [savedConfigs, setSavedConfigs] = useState<SavedConfiguration[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [presetTemplate, setPresetTemplate] = useState<PlacementTemplate | null>(null);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('stencil_app_lang') as LanguageCode;
      if (savedLang && translations[savedLang]) {
        setLanguageState(savedLang);
      } else {
        const browserLang = navigator.language?.slice(0, 2) as LanguageCode;
        if (browserLang && translations[browserLang]) {
          setLanguageState(browserLang);
        }
      }

      const savedTheme = localStorage.getItem('stencil_theme');
      if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        setDarkMode(true);
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      const savedConfigsRaw = localStorage.getItem('stencil_saved_history_v2');
      if (savedConfigsRaw) {
        setSavedConfigs(JSON.parse(savedConfigsRaw));
      }
    } catch {
      // LocalStorage access errors gracefully handled
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('stencil_app_lang', lang);
      localStorage.setItem('selected_language', lang);
    } catch {}
  };

  const handleDarkMode = (val: boolean) => {
    setDarkMode(val);
    try {
      localStorage.setItem('stencil_theme', val ? 'dark' : 'light');
      if (val) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {}
  };

  const t = (key: string): string => {
    const dict = translations[language] || translations.en;
    return dict[key] || translations.en[key] || key;
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3800);
  };

  const saveCurrentConfig = (customName?: string) => {
    if (!activeCalculation) {
      showToast(t('toastPerformCalcFirst'), 'info');
      return;
    }
    const newConfig: SavedConfiguration = {
      id: 'cfg_' + Date.now(),
      name: customName || `${activeCalculation.bodyPartName} (${activeCalculation.originalWidth}×${activeCalculation.originalHeight}${activeCalculation.unit})`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tab: activeTab,
      calculation: activeCalculation
    };
    const updated = [newConfig, ...savedConfigs.slice(0, 4)];
    setSavedConfigs(updated);
    try {
      localStorage.setItem('stencil_saved_history_v2', JSON.stringify(updated));
    } catch {}
    showToast(t('toastConfigSaved'), 'success');
  };

  const deleteSavedConfig = (id: string) => {
    const updated = savedConfigs.filter((c) => c.id !== id);
    setSavedConfigs(updated);
    try {
      localStorage.setItem('stencil_saved_history_v2', JSON.stringify(updated));
    } catch {}
    showToast(t('toastConfigDeleted'), 'info');
  };

  const clearAllConfigs = () => {
    setSavedConfigs([]);
    try {
      localStorage.removeItem('stencil_saved_history_v2');
    } catch {}
    showToast(t('toastHistoryCleared'), 'info');
  };

  const applyTemplateToCalculator = (tmpl: PlacementTemplate) => {
    setPresetTemplate(tmpl);
    setActiveTab('curvature');
    showToast(t('toastTemplateLoaded').replace('{name}', tmpl.name), 'success');
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        unit,
        setUnit,
        darkMode,
        setDarkMode: handleDarkMode,
        activeTab,
        setActiveTab,
        activeCalculation,
        setActiveCalculation,
        savedConfigs,
        saveCurrentConfig,
        deleteSavedConfig,
        clearAllConfigs,
        toasts,
        showToast,
        openModal,
        setOpenModal,
        presetTemplate,
        applyTemplateToCalculator
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
