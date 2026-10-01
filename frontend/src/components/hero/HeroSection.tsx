import React from 'react';
import { HeroScene } from '../3d/HeroScene';
import { ArrowRight, Sparkles, ShieldCheck, Play, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import type { DailyMetrics } from '../../types/fitness';

interface HeroSectionProps {
  metrics: DailyMetrics;
  onStartJourney: () => void;
  onExplore: () => void;
  onSelectMetric: (metric: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  metrics,
  onStartJourney,
  onExplore,
  onSelectMetric,
}) => {
  return (
    <section className="relative min-h-[92vh] pt-28 pb-16 flex flex-col justify-center overflow-hidden">
      {/* Background ambient decorative grid lines and glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-prana-500/10 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Trust Badge / Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-panel border border-prana-500/30 text-xs font-semibold text-prana-600 dark:text-prana-400 mb-6 shadow-glow-prana"
          >
            <span className="w-2 h-2 rounded-full bg-prana-500 dark:bg-prana-400 animate-pulse" />
            <span>Built for Indian lifestyles • Powered by AI</span>
            <span className="hidden sm:inline text-slate-400 dark:text-slate-500">•</span>
            <span className="hidden sm:inline text-slate-600 dark:text-slate-300 font-normal">Next-Gen Health Tech</span>
          </motion.div>

          {/* Main Hero Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight leading-[1.1] text-slate-900 dark:text-white"
          >
            Your Health.{' '}
            <span className="text-gradient-surya block sm:inline">
              One Intelligent Saathi.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed font-normal"
          >
            AI-powered fitness, nutrition and family wellness — built for the way India eats, moves and lives.
          </motion.p>

          {/* Call to Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <button
              onClick={onStartJourney}
              className="px-8 py-4 rounded-full font-bold text-sm bg-gradient-to-r from-prana-500 via-emerald-500 to-emerald-600 text-slate-950 hover:from-prana-400 hover:to-emerald-400 shadow-glow-prana transition-all duration-300 flex items-center gap-2.5 active:scale-95 group"
            >
              <span>Start Your Journey</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={onExplore}
              className="px-7 py-4 rounded-full font-semibold text-sm glass-panel text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-white/15 transition-all duration-300 flex items-center gap-2 active:scale-95 group hover:border-surya-500/50"
            >
              <Zap className="w-4 h-4 text-surya-500 dark:text-surya-400 transition-transform group-hover:scale-110" />
              <span>Explore FitIshh</span>
            </button>
          </motion.div>

          {/* Quick interactive hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-4 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-prana-600 dark:text-prana-400" />
            <span>Interactive 3D Body: Hover cursor to shift perspective or click any floating card</span>
          </motion.div>
        </div>

        {/* 3D Scene Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-2 w-full"
        >
          <HeroScene metrics={metrics} onSelectMetric={onSelectMetric} />
        </motion.div>
      </div>
    </section>
  );
};
