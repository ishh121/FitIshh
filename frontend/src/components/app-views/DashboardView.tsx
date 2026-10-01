import React, { useState } from 'react';
import type { DailyMetrics, WorkoutSession, WeeklyStepDay } from '../../types/fitness';
import { WellnessOrb3D } from '../3d/WellnessOrb3D';
import { HealthSummaryCards } from '../dashboard/HealthSummaryCards';
import { WellnessScoreModal } from '../dashboard/WellnessScoreModal';
import { ActivityChart } from '../dashboard/ActivityChart';
import { NutritionSnapshot } from '../dashboard/NutritionSnapshot';
import { QuickActions } from '../dashboard/QuickActions';
import { Bot, Sparkles, ArrowRight, Award, ShieldCheck, ChevronRight, MessageSquare, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardViewProps {
  userName: string;
  metrics: DailyMetrics;
  workouts: WorkoutSession[];
  weeklySteps: WeeklyStepDay[];
  onToggleWorkout: (id: string) => void;
  onUpdateMetrics: (metrics: DailyMetrics) => void;
  onOpenAICoach: () => void;
  onNavigate?: (view: any) => void;
  onNavigateToSuggester?: () => void;
  onNavigateToScanner?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userName,
  metrics,
  workouts,
  weeklySteps,
  onToggleWorkout,
  onUpdateMetrics,
  onOpenAICoach,
  onNavigate,
  onNavigateToSuggester,
  onNavigateToScanner,
}) => {
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);

  const handleAddWater = () => {
    onUpdateMetrics({
      ...metrics,
      waterLiters: Number((metrics.waterLiters + 0.25).toFixed(2)),
    });
  };

  const handleQuickLogWorkout = () => {
    const incomplete = workouts.find((w) => !w.completed);
    if (incomplete) {
      onToggleWorkout(incomplete.id);
    }
  };

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-9 animate-in fade-in duration-300">
      {/* 1. TOP SECTION: Greeting + 3D Wellness Orb + Daily Score Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-200 dark:border-white/10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        {/* Background ambient lighting */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-prana-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-surya-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* User Greeting & Subtext */}
        <div className="space-y-3 z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-xs font-semibold text-prana-600 dark:text-prana-400 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-prana-500 dark:bg-prana-400 animate-pulse" />
            <span>Personal wellness overview</span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-slate-900 dark:text-white tracking-tight">
              Welcome, {userName}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1 font-normal">
              Here's how you're doing today.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <Award className="w-4 h-4 text-surya-600 dark:text-surya-400" />
              <strong>{metrics.streakDays}-Day Consistency Streak</strong>
            </span>
            <span>•</span>
            <span className="text-prana-600 dark:text-prana-400">Step goal: {Math.round((metrics.steps / metrics.stepsGoal) * 100)}% complete</span>
          </div>
        </div>

        {/* 3D Wellness Orb + Clickable Score Badge */}
        <div className="flex items-center gap-4 sm:gap-6 z-10 shrink-0 flex-wrap justify-center">
          {/* Three.js 3D Wellness Orb */}
          <div className="flex flex-col items-center">
            <WellnessOrb3D score={metrics.dailyScore} />
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium -mt-2">Prana Core</span>
          </div>

          {/* Clickable Wellness Score Pill */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsScoreModalOpen(true)}
            className="p-5 rounded-3xl glass-panel-glow border border-prana-500/40 cursor-pointer shadow-glow-prana flex flex-col justify-between group hover:border-prana-400 transition-all text-center sm:text-left min-w-[190px]"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-prana-600 dark:text-prana-400 uppercase tracking-wider">
                Wellness Score
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </div>

            <div className="flex items-baseline gap-1.5 justify-center sm:justify-start">
              <span className="text-4xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                {metrics.dailyScore}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">/ 100</span>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
              <span>{metrics.dailyScore ? 'Score available' : 'No score yet'}</span>
              <span className="text-prana-600 dark:text-prana-400 font-semibold group-hover:underline">Inspect ↗</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 2. CONVERSATIONAL "YOUR AI SAATHI" FLOATING/FEATURED ASSISTANT CARD */}
      <motion.div
        whileHover={{ y: -2 }}
        className="p-5 sm:p-6 rounded-3xl glass-panel border border-surya-500/30 bg-gradient-to-r from-surya-500/10 via-amber-500/5 to-prana-500/10 dark:from-surya-950/40 dark:via-obsidian-900 dark:to-prana-950/20 shadow-glow-surya flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-surya-500 to-amber-600 p-0.5 shrink-0 shadow-lg flex items-center justify-center">
            <div className="w-full h-full bg-white dark:bg-obsidian-950 rounded-[14px] flex items-center justify-center">
              <Bot className="w-6 h-6 text-surya-500 dark:text-surya-400" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Your AI Saathi</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surya-500/20 text-surya-700 dark:text-surya-400 border border-surya-500/30">
                Supportive • Real-time
              </span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed max-w-3xl">
                {metrics.steps || metrics.activeMinutes
                  ? `You've logged ${metrics.steps.toLocaleString()} steps and ${metrics.activeMinutes} active minutes today.`
                  : 'No activity has been logged today. Your dashboard will reflect your data as you record it.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
          <button
            onClick={onOpenAICoach}
            className="px-4 py-2.5 rounded-full text-xs font-bold bg-surya-500 text-slate-950 hover:bg-surya-400 transition-all flex items-center gap-1.5 shadow-md active:scale-95 whitespace-nowrap"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat with Saathi</span>
          </button>
        </div>
      </motion.div>

      {/* 3. DAILY HEALTH SUMMARY CARDS (6 Vitals with Animated Rings & 3D Depth) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-prana-600 dark:text-prana-400" />
            <span>Daily Vitals Summary (Animated 3D Telemetry)</span>
          </h2>
          <span className="text-xs text-slate-500">Live Apple Health / Wearable Sync</span>
        </div>

        <HealthSummaryCards metrics={metrics} onAddWater={handleAddWater} />
      </div>

      {/* 4. LARGE 3D QUICK ACTIONS */}
      <QuickActions
        onScanMeal={() => (onNavigateToScanner ? onNavigateToScanner() : onNavigate ? onNavigate('nutrition') : onOpenAICoach())}
        onSuggestMeal={() => (onNavigateToSuggester ? onNavigateToSuggester() : onNavigate ? onNavigate('nutrition') : onOpenAICoach())}
        onLogWorkout={handleQuickLogWorkout}
        onAddWater={handleAddWater}
        onViewFamily={() => (onNavigate ? onNavigate('family') : onOpenAICoach())}
      />

      {/* 5. INTERACTIVE WEEKLY ACTIVITY CHART */}
      <ActivityChart weeklySteps={weeklySteps} streakDays={metrics.streakDays} />

      {/* 6. INDIAN NUTRITION SNAPSHOT */}
      <NutritionSnapshot
        onNavigateToNutrition={() => (onNavigate ? onNavigate('nutrition') : onOpenAICoach())}
      />

      {/* Detailed Wellness Score Breakdown Modal */}
      <WellnessScoreModal
        isOpen={isScoreModalOpen}
        onClose={() => setIsScoreModalOpen(false)}
        metrics={metrics}
      />
    </div>
  );
};
