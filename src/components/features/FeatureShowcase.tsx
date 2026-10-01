import { useState } from 'react';
import { FitnessTracking } from './FitnessTracking';
import { MealScanner } from './MealScanner';
import { SmartNutrition } from './SmartNutrition';
import { FamilyWellness } from './FamilyWellness';
import type { DailyMetrics, WorkoutSession, WeeklyStepDay } from '../../types/fitness';
import type { FamilyMember } from '../../types/family';
import { Footprints, Camera, Utensils, Users, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeatureShowcaseProps {
  metrics: DailyMetrics;
  workouts: WorkoutSession[];
  weeklySteps: WeeklyStepDay[];
  familyMembers: FamilyMember[];
  onToggleWorkout: (id: string) => void;
}

export const FeatureShowcase: React.FC<FeatureShowcaseProps> = ({
  metrics,
  workouts,
  weeklySteps,
  familyMembers,
  onToggleWorkout,
}) => {
  const [activeTab, setActiveTab] = useState<'fitness' | 'scanner' | 'nutrition' | 'family'>('fitness');

  const tabs = [
    { id: 'fitness', label: 'Fitness Tracking', icon: Footprints, subtitle: 'Indian step routines & Ghar ka Akhada' },
    { id: 'scanner', label: 'AI Meal Scanner', icon: Camera, subtitle: 'Instant camera detection & ghee estimate' },
    { id: 'nutrition', label: 'Smart Nutrition', icon: Utensils, subtitle: 'High-protein veg & diabetic plans' },
    { id: 'family', label: 'Family Wellness', icon: Users, subtitle: 'Multi-generational vitals & senior care' },
  ];

  return (
    <section className="py-24 relative overflow-hidden" id="capabilities">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-4/5 h-[500px] bg-prana-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-xs font-semibold text-surya-600 dark:text-surya-400 mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Four Pillars of FitIshh</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
            Engineered for the Way <span className="text-gradient-surya">India Lives.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300">
            From ghar ki thali macros to elder parents' health vitals, experience how AI transforms health for the modern Indian family.
          </p>
        </div>

        {/* Feature Selector Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`p-4 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden ${
                  isSelected
                    ? 'glass-panel border-prana-500/60 shadow-glow-prana'
                    : 'glass-panel-subtle border-slate-200/80 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeFeaturePill"
                    className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-prana-500 to-surya-400"
                  />
                )}
                <div className="flex items-center gap-2.5 mb-2">
                  <div
                    className={`p-2 rounded-xl transition-colors ${
                      isSelected ? 'bg-prana-500 text-white dark:text-obsidian-950 font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-sm font-bold ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                    {tab.label}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{tab.subtitle}</p>
              </button>
            );
          })}
        </div>

        {/* Active Capability Render with 3D perspective transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 30, rotateX: -4 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -20, rotateX: 4 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            style={{ perspective: 1000 }}
          >
            {activeTab === 'fitness' && (
              <FitnessTracking
                metrics={metrics}
                workouts={workouts}
                weeklySteps={weeklySteps}
                onToggleWorkout={onToggleWorkout}
              />
            )}
            {activeTab === 'scanner' && <MealScanner />}
            {activeTab === 'nutrition' && <SmartNutrition />}
            {activeTab === 'family' && <FamilyWellness members={familyMembers} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
