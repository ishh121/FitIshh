import React, { useState } from 'react';
import type { WeeklyStepDay } from '../../types/fitness';
import { TrendingUp, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DAY_NAMES: Record<string, string> = {
  Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday',
  Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday',
};

export const ActivityChart: React.FC<{ weeklySteps: WeeklyStepDay[]; streakDays: number }> = ({ weeklySteps, streakDays }) => {
  const todayIndex = (new Date().getDay() + 6) % 7;
  const [selectedDay, setSelectedDay] = useState<string>(weeklySteps[todayIndex]?.day ?? 'Sun');
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);

  const activeDetail = weeklySteps.find((day) => day.day === selectedDay) ?? weeklySteps[todayIndex];
  const maxSteps = Math.max(1, ...weeklySteps.map((day) => Math.max(day.steps, day.goal)));

  if (!activeDetail) return null;

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-prana-500/20 text-prana-600 dark:text-prana-400">
              <TrendingUp className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-prana-600 dark:text-prana-400 uppercase tracking-wider">
              Interactive Activity Explorer
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
            Weekly Step & Calorie Rhythm
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click a day to inspect its saved activity totals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-surya-500/20 text-surya-700 dark:text-surya-400 border border-surya-500/30 flex items-center gap-1.5 shadow-glow-surya">
            <Award className="w-3.5 h-3.5" />
            <span>{streakDays ? `${streakDays}-Day Consistency Streak` : 'No streak yet'}</span>
          </span>
        </div>
      </div>

      {/* Interactive Bar Chart */}
      <div className="pt-6 pb-2">
        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-44 sm:h-52 border-b border-slate-200 dark:border-white/10 pb-4">
          {weeklySteps.map((stepDay) => {
            const isSelected = selectedDay === stepDay.day;
            const isHovered = hoveredDay === stepDay.day;
            const heightPercent = Math.min(100, Math.round((stepDay.steps / maxSteps) * 100));

            return (
              <div
                key={stepDay.day}
                onClick={() => setSelectedDay(stepDay.day)}
                onMouseEnter={() => setHoveredDay(stepDay.day)}
                onMouseLeave={() => setHoveredDay(null)}
                className="flex flex-col items-center gap-2 h-full justify-end cursor-pointer group relative"
              >
                {/* Floating tooltip on hover */}
                {(isHovered || isSelected) && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-12 z-20 px-2.5 py-1 rounded-lg bg-white dark:bg-obsidian-950 border border-slate-200 dark:border-white/20 text-center shadow-xl pointer-events-none whitespace-nowrap"
                  >
                    <span className="text-xs font-black text-slate-900 dark:text-white block">
                      {stepDay.steps.toLocaleString()}
                    </span>
                    <span className="text-[9px] text-slate-500 dark:text-slate-400">kadam</span>
                  </motion.div>
                )}

                {/* The Bar */}
                <motion.div
                  layout
                  className={`w-full rounded-2xl transition-all duration-300 relative overflow-hidden ${
                    isSelected
                      ? 'bg-gradient-to-t from-prana-600 via-prana-500 to-surya-400 shadow-glow-prana ring-2 ring-white/30'
                      : stepDay.isPeak
                      ? 'bg-gradient-to-t from-emerald-600/70 to-prana-500/70 hover:from-emerald-500 hover:to-prana-400'
                      : 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                >
                  {/* Subtle inner highlight */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-white/40" />
                </motion.div>

                {/* Day label */}
                <span
                  className={`text-xs font-semibold transition-colors ${
                    isSelected ? 'text-prana-600 dark:text-prana-400 font-bold scale-110' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                  }`}
                >
                  {stepDay.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Detailed Breakdown */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeDetail.day}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-obsidian-950/70 border border-slate-200 dark:border-white/5 flex items-center justify-between flex-wrap gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-prana-500/20 border border-prana-500/40 flex items-center justify-center text-prana-600 dark:text-prana-400 font-bold text-sm">
              {activeDetail.day}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  {DAY_NAMES[activeDetail.day] ?? activeDetail.day}{activeDetail.day === DAY_NAMES[todayIndex] ? ' (Today)' : ''}
                </h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Saved activity totals</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Steps</span>
              <span className="text-base font-black text-slate-900 dark:text-white">{activeDetail.steps.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Burn</span>
              <span className="text-base font-black text-surya-600 dark:text-surya-400">{activeDetail.caloriesBurned} kcal</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Active</span>
              <span className="text-base font-black text-prana-600 dark:text-prana-400">{activeDetail.activeMinutes} mins</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
