import React from 'react';
import type { DailyMetrics } from '../../types/fitness';
import { Footprints, Flame, Timer, Droplets, Moon, Heart, Plus, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface HealthSummaryCardsProps {
  metrics: DailyMetrics;
  onAddWater: () => void;
}

interface ProgressRingProps {
  percentage: number;
  color: string;
  size?: number;
  strokeWidth?: number;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  percentage,
  color,
  size = 54,
  strokeWidth = 4.5,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, percentage)) / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          className="text-slate-200 dark:text-white/10"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-[11px] font-bold text-slate-900 dark:text-white">
        {Math.round(percentage)}%
      </span>
    </div>
  );
};

export const HealthSummaryCards: React.FC<HealthSummaryCardsProps> = ({ metrics, onAddWater }) => {
  const stepPercent = (metrics.steps / metrics.stepsGoal) * 100;
  const calPercent = (metrics.caloriesBurned / metrics.caloriesGoal) * 100;
  const activeMins = metrics.activeMinutes;
  const activeMinsGoal = metrics.activeMinutesGoal;
  const activePercent = (activeMins / activeMinsGoal) * 100;
  const waterPercent = (metrics.waterLiters / metrics.waterGoalLiters) * 100;
  const sleepTotalMins = metrics.sleepHours * 60 + metrics.sleepMinutes;
  const sleepPercent = (sleepTotalMins / 480) * 100; // 8 hours = 480 mins

  const cards = [
    {
      id: 'steps',
      title: 'Steps',
      sanskrit: 'कदम',
      value: metrics.steps.toLocaleString(),
      unit: 'steps',
      goal: `Goal: ${metrics.stepsGoal.toLocaleString()}`,
      percentage: stepPercent,
      icon: Footprints,
      color: '#10B981',
      badge: metrics.steps ? `${Math.round(stepPercent)}% of Goal` : 'No data yet',
      badgeColor: 'text-prana-400 bg-prana-500/10 border-prana-500/30',
      subtext: metrics.steps ? `${Math.max(0, metrics.stepsGoal - metrics.steps).toLocaleString()} steps to goal` : 'No steps logged today',
    },
    {
      id: 'calories',
      title: 'Calories Burned',
      sanskrit: 'ऊर्जा व्यय',
      value: metrics.caloriesBurned.toLocaleString(),
      unit: 'kcal',
      goal: `Target: ${metrics.caloriesGoal.toLocaleString()} kcal`,
      percentage: calPercent,
      icon: Flame,
      color: '#F59E0B',
      badge: metrics.caloriesBurned ? 'Activity logged' : 'No data yet',
      badgeColor: 'text-surya-400 bg-surya-500/10 border-surya-500/30',
      subtext: metrics.caloriesBurned ? `${Math.max(0, metrics.caloriesGoal - metrics.caloriesBurned).toLocaleString()} kcal to target` : 'No activity calories logged',
    },
    {
      id: 'active',
      title: 'Active Minutes',
      sanskrit: 'सक्रिय समय',
      value: `${activeMins}`,
      unit: 'mins',
      goal: `Goal: ${activeMinsGoal} mins`,
      percentage: activePercent,
      icon: Timer,
      color: '#34D399',
      badge: activeMins ? `${Math.round(activePercent)}% of Goal` : 'No data yet',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      subtext: activeMins ? `${Math.max(0, activeMinsGoal - activeMins)} active minutes to goal` : 'No active minutes logged',
    },
    {
      id: 'water',
      title: 'Water Intake',
      sanskrit: 'जल सेवन',
      value: `${metrics.waterLiters}`,
      unit: 'Liters',
      goal: `Goal: ${metrics.waterGoalLiters} L`,
      percentage: waterPercent,
      icon: Droplets,
      color: '#06B6D4',
      badge: metrics.waterLiters ? `${Math.round(waterPercent)}% of Goal` : 'No data yet',
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      subtext: metrics.waterLiters ? `${Math.max(0, metrics.waterGoalLiters - metrics.waterLiters).toFixed(2)} L to goal` : 'No water logged today',
      isWater: true,
    },
    {
      id: 'sleep',
      title: 'Sleep Duration',
      sanskrit: 'गाढ़ निद्रा',
      value: `${metrics.sleepHours}h ${metrics.sleepMinutes}m`,
      unit: '',
      goal: 'Target: 8h 00m',
      percentage: sleepPercent,
      icon: Moon,
      color: '#818CF8',
      badge: sleepTotalMins ? `${Math.round(sleepPercent)}% of Goal` : 'No data yet',
      badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
      subtext: sleepTotalMins ? 'Sleep duration recorded' : 'No sleep duration recorded',
    },
    {
      id: 'heart',
      title: 'Heart Rate',
      sanskrit: 'हृदय गति',
      value: `${metrics.heartRate}`,
      unit: 'bpm',
      goal: 'Resting: 60-75 bpm',
      percentage: metrics.heartRate ? 100 : 0,
      icon: Heart,
      color: '#F43F5E',
      badge: metrics.heartRate ? 'Reading recorded' : 'No data yet',
      badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      subtext: metrics.heartRate ? 'Latest heart-rate reading' : 'No heart-rate reading recorded',
      isHeart: metrics.heartRate > 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.id}
            whileHover={{ y: -3, scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className="p-5 rounded-3xl glass-panel border border-slate-200 dark:border-white/10 shadow-lg flex flex-col justify-between relative overflow-hidden group hover:border-slate-300 dark:hover:border-white/20"
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div
                  className="p-2.5 rounded-2xl border"
                  style={{
                    backgroundColor: `${card.color}15`,
                    borderColor: `${card.color}35`,
                    color: card.color,
                  }}
                >
                  <Icon className={`w-5 h-5 ${card.isHeart ? 'animate-pulse' : ''}`} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">{card.title}</h4>
                    <span className="text-[10px] text-slate-500 font-medium">({card.sanskrit})</span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">{card.goal}</span>
                </div>
              </div>

              {/* Progress Ring or Heart Visual */}
              {card.isHeart ? (
                <div className="w-[54px] h-[54px] rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center relative">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping absolute" />
                  <Heart className="w-5 h-5 text-rose-400 fill-rose-500/40 relative z-10" />
                </div>
              ) : (
                <ProgressRing percentage={card.percentage} color={card.color} />
              )}
            </div>

            {/* Middle: Big Value */}
            <div className="my-3 flex items-baseline justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                  {card.value}
                </span>
                {card.unit && (
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {card.unit}
                  </span>
                )}
              </div>

              {card.isWater && (
                <button
                  onClick={onAddWater}
                  className="px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500 hover:text-white dark:hover:text-obsidian-950 transition-all flex items-center gap-1 active:scale-95 shadow-sm"
                  title="Quick add 250 ml"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>250ml</span>
                </button>
              )}
            </div>

            {/* Bottom: Subtext & Badge */}
            <div className="pt-2 border-t border-slate-200 dark:border-white/5 flex items-center justify-between gap-2 text-xs">
              <span className="text-[11px] text-slate-600 dark:text-slate-400 truncate max-w-[190px]">
                {card.subtext}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${card.badgeColor}`}>
                {card.badge}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
