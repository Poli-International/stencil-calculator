import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Breadcrumb } from './components/Breadcrumb';
import { TabNavigation } from './components/TabNavigation';
import { CurvatureCalculatorTab } from './components/CurvatureCalculatorTab';
import { PlacementGuideTab } from './components/PlacementGuideTab';
import { LineworkConverterTab } from './components/LineworkConverterTab';
import { TemplatesTab } from './components/TemplatesTab';
import { FaqSection } from './components/FaqSection';
import { FeedbackSection } from './components/FeedbackSection';
import { EmailNewsletterSection } from './components/EmailNewsletterSection';
import { Footer } from './components/Footer';
import { ModalsContainer } from './components/ModalsContainer';

const MainAppContent: React.FC = () => {
  const { activeTab, toasts } = useApp();

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* GLOBAL TOAST NOTIFICATIONS */}
      {toasts.length > 0 && (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`px-4 py-2.5 rounded-xl shadow-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 pointer-events-auto ${
                toast.type === 'success'
                  ? 'bg-emerald-600 text-white'
                  : toast.type === 'error'
                  ? 'bg-rose-600 text-white'
                  : 'bg-blue-600 text-white'
              }`}
            >
              <span>{toast.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* HEADER */}
      <Header />

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        <Breadcrumb />
        <TabNavigation />

        {/* ACTIVE TAB CONTENT */}
        <div className="transition-all duration-150">
          {activeTab === 'curvature' && <CurvatureCalculatorTab />}
          {activeTab === 'placement' && <PlacementGuideTab />}
          {activeTab === 'converter' && <LineworkConverterTab />}
          {activeTab === 'templates' && <TemplatesTab />}
        </div>

        {/* BOTTOM SECTIONS */}
        <div className="space-y-6 pt-6">
          <FaqSection />
          <FeedbackSection />
          <EmailNewsletterSection />
        </div>
      </main>

      {/* FOOTER */}
      <Footer />

      {/* MODALS CONTAINER */}
      <ModalsContainer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

export default App;
