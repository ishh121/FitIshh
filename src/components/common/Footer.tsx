import React from 'react';
import { Shield, Sparkles, Heart, Activity, ArrowUpRight } from 'lucide-react';
import { BrandWordmark } from './BrandWordmark';

export const Footer: React.FC<{ onNavigate: (view: any) => void; onOpenAICoach: () => void }> = ({
  onNavigate,
  onOpenAICoach,
}) => {
  return (
    <footer className="relative border-t border-slate-200 dark:border-white/10 bg-stone-100 dark:bg-obsidian-950 pt-16 pb-12 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-prana-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-200 dark:border-white/10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-prana-500 to-emerald-700 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-white dark:bg-obsidian-950 rounded-[10px] flex items-center justify-center">
                  <span className="font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-prana-400 to-surya-400 text-sm">
                    FI
                  </span>
                </div>
              </div>
              <BrandWordmark className="font-display font-bold text-xl text-slate-900 dark:text-white" />
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-prana-500/20 text-prana-400 border border-prana-500/30">
                INDIA-FIRST
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              India's intelligent health companion. Merging cutting-edge AI vision with deep cultural understanding of ghar ka khana, family wellness, and holistic longevity.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1.5 text-prana-400">
                <span className="w-2 h-2 rounded-full bg-prana-400 animate-ping" />
                <span className="text-prana-700 dark:text-prana-400">Live in India</span>
              </span>
              <span>•</span>
                <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                ABDM & Ayushman Bharat Compliant Design
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300">Capabilities</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-prana-400 transition-colors">
                  Fitness & Step Tracking
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('nutrition')} className="hover:text-prana-400 transition-colors">
                  AI Desi Meal Scanner
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('nutrition')} className="hover:text-prana-400 transition-colors">
                  Ghee & Glycemic Estimator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('family')} className="hover:text-prana-400 transition-colors">
                  Parivaar Health Hub
                </button>
              </li>
              <li>
                <button onClick={onOpenAICoach} className="hover:text-surya-400 transition-colors flex items-center gap-1">
                  Saathi AI Health Coach <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Culture & Science */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300">Ethos & Science</h4>
            <div className="p-4 rounded-xl glass-panel-subtle space-y-2 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5">
              <div className="flex items-center gap-2 text-surya-700 dark:text-surya-400 font-medium">
                <Sparkles className="w-4 h-4" />
                <span>Ayurveda + Modern AI</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Calibrated against ICMR-NIN nutritional standards for Indian dietary habits (rotis, pulses, rice, tadka & spices).
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} FitIshh Technologies Inc. Built with reverence for Indian health & longevity.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-slate-400 transition-colors">Privacy Shield</a>
            <a href="#terms" className="hover:text-slate-400 transition-colors">Terms of Wellness</a>
            <a href="#security" className="hover:text-slate-400 transition-colors">Health Data Encryption</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
