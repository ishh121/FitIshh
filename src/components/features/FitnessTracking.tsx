import React, { useState } from 'react';
import type { DailyMetrics, WorkoutSession, WeeklyStepDay } from '../../types/fitness';
import { Footprints, Flame, CheckCircle2, Circle, Sun, Dumbbell, Sparkles, TrendingUp, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface FitnessTrackingProps {
  metrics: DailyMetrics;
  workouts: WorkoutSession[];
  weeklySteps: WeeklyStepDay[];
  onToggleWorkout: (id: string) => void;
}

export const FitnessTracking: React.FC<FitnessTrackingProps> = ({
  metrics,
  workouts,
  weeklySteps,
  onToggleWorkout,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredWorkouts =
    activeCategory === 'All'
      ? workouts
      : workouts.filter((w) => w.category.includes(activeCategory));

  const handleWorkoutClick = (id: string, currentlyCompleted: boolean) => {
    if (!currentlyCompleted) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10B981', '#F59E0B', '#34D399'],
      });
    }
    onToggleWorkout(id);
  };

  const stepsPercentage = Math.min(100, Math.round((metrics.steps / metrics.stepsGoal) * 100));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Col: Step Streak & Weekly Chart */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Step Ring Card */}
        <div className="glass-panel rounded-3xl p-6 border border-prana-500/30 relative overflow-hidden shadow-glow-prana">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-prana-500/20 text-prana-600 dark:text-prana-400">
                <Footprints className="w-5 h-5" />
              </span>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base">Step Target (Kadam)</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Calibrated for Indian lifestyle routines</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-prana-500/20 text-prana-700 dark:text-prana-400 border border-prana-500/40">
              {stepsPercentage}% Complete
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-display font-black text-slate-900 dark:text-white">
                {metrics.steps.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Target: {metrics.stepsGoal.toLocaleString()}</span>
            </div>

            <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800/80 overflow-hidden p-0.5 border border-slate-200 dark:border-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-prana-500 via-emerald-400 to-surya-400 transition-all duration-700 shadow-glow-prana"
                style={{ width: `${stepsPercentage}%` }}
              />
            </div>
          </div>

          {/* Indian Habit Highlight */}
          <div className="mt-4 p-3 rounded-xl bg-slate-100 dark:bg-slate-900/70 border border-slate-200 dark:border-white/5 flex items-center gap-3 text-xs">
            <Award className="w-4 h-4 text-surya-600 dark:text-surya-400 shrink-0" />
            <span className="text-slate-700 dark:text-slate-300">
              <strong>Daily activity:</strong> {metrics.steps ? `${Math.max(0, metrics.stepsGoal - metrics.steps).toLocaleString()} steps remaining to your goal.` : 'No steps logged yet.'}
            </span>
          </div>
        </div>

        {/* Weekly Consistency Chart */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-prana-600 dark:text-prana-400" />
              <span>Weekly Step Consistency</span>
            </h4>
            <span className="text-xs font-semibold text-surya-600 dark:text-surya-400">{metrics.streakDays ? `${metrics.streakDays}-Day Streak` : 'No streak yet'}</span>
          </div>

          <div className="grid grid-cols-7 gap-2 items-end h-36 pt-4">
            {weeklySteps.map((day) => {
              const heightPercent = Math.min(100, Math.round((day.steps / 13000) * 100));
              return (
                <div key={day.day} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {(day.steps / 1000).toFixed(1)}k
                  </span>
                  <div
                    className={`w-full rounded-t-lg transition-all duration-300 ${
                      day.isPeak
                        ? 'bg-gradient-to-t from-prana-500 to-surya-400 shadow-glow-prana'
                        : 'bg-slate-300 hover:bg-slate-400 dark:bg-slate-700/60 dark:hover:bg-slate-600'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className={`text-[11px] font-medium ${day.isPeak ? 'text-prana-600 dark:text-prana-400 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
                    {day.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Col: Indian Workouts List */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">Ghar & Akhada Routines</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Click to check off completed movements</p>
          </div>

          {/* Categories */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-obsidian-950/70 p-1 rounded-xl border border-slate-200 dark:border-white/5">
            {['All', 'Yoga', 'Akhada', 'Walk'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-prana-500 text-white dark:text-obsidian-950 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Workout Cards */}
        <div className="space-y-3">
          {!filteredWorkouts.length && (
            <p className="rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
              No workouts logged yet. Your workout history will appear here when recorded.
            </p>
          )}
          {filteredWorkouts.map((session) => (
            <motion.div
              key={session.id}
              whileHover={{ scale: 1.01 }}
              onClick={() => handleWorkoutClick(session.id, session.completed)}
              className={`p-4 rounded-2xl glass-panel border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                session.completed
                  ? 'border-prana-500/40 bg-prana-500/10 dark:bg-prana-950/20'
                  : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  {session.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-prana-500 dark:text-prana-400 fill-prana-500/20" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                  )}
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{session.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5">
                      {session.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-md">{session.description}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="flex items-center justify-end gap-1 text-xs font-bold text-surya-600 dark:text-surya-400">
                  <Flame className="w-3.5 h-3.5" />
                  <span>{session.completed ? `${session.calories} kcal logged` : `~${session.calories} kcal estimate`}</span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">{session.durationMinutes} mins • {session.timeOfDay}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
