import React from 'react';
import type { DailyMetrics } from '../../types/fitness';
import { X, Sparkles, Footprints, Utensils, Droplets, Moon, Activity, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ScorePillar {
  name: string;
  sanskrit: string;
  score: number;
  maxScore: number;
  weight: string;
  icon: React.ReactNode;
  color: string;
  status: string;
  insight: string;
  tip: string;
}

interface WellnessScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: DailyMetrics;
}

export const WellnessScoreModal: React.FC<WellnessScoreModalProps> = ({
  isOpen,
  onClose,
  metrics,
}) => {
  const percentage = (value: number, goal: number) => goal > 0
    ? Math.min(100, Math.round((value / goal) * 100))
    : 0;
  const sleepMinutes = metrics.sleepHours * 60 + metrics.sleepMinutes;
  const scorePillars: ScorePillar[] = [
    {
      name: 'Movement', sanskrit: 'गतिशीलता (Vyayama)',
      score: Math.round((percentage(metrics.steps, metrics.stepsGoal) + percentage(metrics.activeMinutes, metrics.activeMinutesGoal)) / 2),
      maxScore: 100, weight: '25%', icon: <Footprints className="w-4 h-4 text-prana-400" />, color: '#10B981',
      status: metrics.steps || metrics.activeMinutes ? 'Goal progress' : 'No data yet',
      insight: `${metrics.steps.toLocaleString()} steps and ${metrics.activeMinutes} active minutes recorded.`,
      tip: 'Movement progress is based only on activity recorded in your account.',
    },
    {
      name: 'Nutrition', sanskrit: 'आहार (Aahara)',
      score: percentage(metrics.proteinGrams, metrics.proteinGoalGrams),
      maxScore: 100, weight: '25%', icon: <Utensils className="w-4 h-4 text-surya-400" />, color: '#F59E0B',
      status: metrics.proteinGrams ? 'Goal progress' : 'No data yet',
      insight: `${metrics.proteinGrams}g protein recorded toward your ${metrics.proteinGoalGrams}g target.`,
      tip: 'Nutrition totals update when meals are saved to your account.',
    },
    {
      name: 'Hydration', sanskrit: 'जल तत्व (Jala)',
      score: percentage(metrics.waterLiters, metrics.waterGoalLiters),
      maxScore: 100, weight: '15%', icon: <Droplets className="w-4 h-4 text-cyan-400" />, color: '#06B6D4',
      status: metrics.waterLiters ? 'Goal progress' : 'No data yet',
      insight: `${metrics.waterLiters} L recorded toward your ${metrics.waterGoalLiters} L target.`,
      tip: 'Hydration progress uses water entries recorded to your account.',
    },
    {
      name: 'Sleep', sanskrit: 'निद्रा (Nidra)',
      score: percentage(sleepMinutes, 480),
      maxScore: 100, weight: '20%', icon: <Moon className="w-4 h-4 text-indigo-400" />, color: '#818CF8',
      status: sleepMinutes ? 'Goal progress' : 'No data yet',
      insight: `${metrics.sleepHours}h ${metrics.sleepMinutes}m sleep duration recorded.`,
      tip: 'Sleep stages are not available until a source records them.',
    },
    {
      name: 'Recovery', sanskrit: 'ओजस (Ojas & HRV)',
      score: 0,
      maxScore: 100, weight: '15%', icon: <Activity className="w-4 h-4 text-emerald-400" />, color: '#34D399',
      status: metrics.heartRate ? 'Reading recorded' : 'No data yet',
      insight: metrics.heartRate ? `Latest recorded heart rate: ${metrics.heartRate} bpm.` : 'No recovery or heart-rate data recorded.',
      tip: 'Recovery scoring is unavailable without recorded recovery data.',
    },
  ];
  const totalScore = metrics.dailyScore;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[var(--color-overlay)] backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="wellness-score-title"
          className="relative w-full max-w-2xl bg-white dark:bg-obsidian-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-6 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-200 dark:border-white/10 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1.5 rounded-lg bg-prana-500/20 text-prana-400">
                  <Sparkles className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold text-prana-700 dark:text-prana-400 uppercase tracking-wider">
                  Holistic Prana Score Diagnostic
                </span>
              </div>
              <h2 id="wellness-score-title" className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white">
                Daily Wellness Score: <span className="text-gradient-prana">{totalScore} / 100</span>
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Goal progress from your saved data. This is not a medical assessment.
              </p>
            </div>

            <button
              onClick={onClose}
              aria-label="Close wellness score"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-prana-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Overall Score Dial Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-prana-50 via-white to-amber-50 dark:from-prana-950/80 dark:via-slate-900 dark:to-surya-950/60 border border-prana-500/30 flex items-center justify-between flex-wrap gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-prana-800 dark:text-prana-300 uppercase tracking-wide">
                Optimal Vitality Status
              </span>
              <div className="text-lg font-bold text-slate-900 dark:text-white">Your recorded data</div>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                Unrecorded measurements remain at zero until you add them.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-3xl font-display font-black text-slate-900 dark:text-white">{totalScore}</div>
                <span className="text-[10px] text-prana-700 dark:text-prana-400 font-bold uppercase">Current score</span>
              </div>
            </div>
          </div>

          {/* 5 Pillars Breakdown */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              The 5 Pillars of Daily Wellness
            </h3>

            <div className="space-y-3">
              {scorePillars.map((pillar) => (
                <div
                  key={pillar.name}
                  className="p-4 rounded-2xl bg-stone-50 dark:bg-obsidian-950/70 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/15 transition-all space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/5">
                        {pillar.icon}
                      </span>
                      <div>
                        <span className="font-bold text-sm text-slate-900 dark:text-white">{pillar.name}</span>
                        <span className="text-[11px] text-slate-600 dark:text-slate-400 ml-1.5">({pillar.sanskrit})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="text-xs text-slate-600 dark:text-slate-400">Weight: {pillar.weight}</span>
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full border"
                        style={{
                          color: pillar.color,
                          borderColor: `${pillar.color}40`,
                          backgroundColor: `${pillar.color}15`,
                        }}
                      >
                        {pillar.score} / {pillar.maxScore}
                      </span>
                    </div>
                  </div>

                  {/* Meter bar */}
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800/80 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pillar.score}%`,
                        backgroundColor: pillar.color,
                      }}
                    />
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300">{pillar.insight}</p>

                  <div className="pt-1 flex items-center gap-1.5 text-[11px] text-surya-800 dark:text-surya-400 bg-surya-500/10 p-2 rounded-xl border border-surya-500/20">
                    <Zap className="w-3.5 h-3.5 shrink-0" />
                    <span><strong>Proactive Desi Tip:</strong> {pillar.tip}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
            <span className="text-xs text-slate-600 dark:text-slate-400">Values use your saved account data</span>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full font-bold text-xs bg-prana-500 text-obsidian-950 hover:bg-prana-400 transition-colors shadow-glow-prana"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
