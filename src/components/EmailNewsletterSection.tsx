import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, CheckCircle2, ShieldCheck } from 'lucide-react';

export const EmailNewsletterSection: React.FC = () => {
  const { t, showToast } = useApp();
  const [email, setEmail] = useState<string>('');
  const [subscribed, setSubscribed] = useState<boolean>(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    showToast(t('newsletterSuccess'), 'success');
  };

  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="space-y-1 max-w-xl">
        <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
          <Mail className="w-5 h-5" />
          <span>{t('newsletterTitle')}</span>
        </h2>
        <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed">
          {t('newsletterSubtitle')}
        </p>
      </div>

      <div className="w-full md:w-auto">
        {subscribed ? (
          <div className="p-3 bg-white/20 backdrop-blur rounded-xl flex items-center gap-2 text-xs font-bold text-white">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>{t('newsletterSuccess')}</span>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder={t('newsletterPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 px-3.5 bg-white/10 text-white placeholder:text-blue-200 border border-white/20 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:bg-white/20"
              required
            />
            <button
              type="submit"
              className="h-10 px-5 bg-white hover:bg-slate-100 text-blue-900 font-extrabold text-xs rounded-xl shadow-xs transition cursor-pointer shrink-0"
            >
              {t('btnSubscribe')}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
