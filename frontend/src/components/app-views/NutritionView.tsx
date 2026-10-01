import React, { useState } from 'react';
import { AIMealScannerModule } from '../scanner/AIMealScannerModule';
import { AIMealSuggesterModule } from '../suggester/AIMealSuggesterModule';
import { SmartNutrition } from '../features/SmartNutrition';
import { Sparkles, Camera, Utensils, BookOpen, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import type { SuggestedMeal } from '../../services/mealSuggesterService';

export type NutritionTab = 'suggester' | 'scanner' | 'blueprints';

interface NutritionViewProps {
  onOpenAICoach: () => void;
  onOpenAICoachWithPrompt?: (prompt: string) => void;
  initialTab?: NutritionTab;
  onAddToTodayPlan?: (meal: SuggestedMeal) => void;
}

export const NutritionView: React.FC<NutritionViewProps> = ({
  onOpenAICoach,
  onOpenAICoachWithPrompt,
  initialTab = 'suggester',
  onAddToTodayPlan,
}) => {
  const [activeTab, setActiveTab] = useState<NutritionTab>(initialTab);

  const tabs = [
    { id: 'suggester' as NutritionTab, label: 'AI Meal Suggester', icon: Utensils, sub: 'What should I eat today?' },
    { id: 'scanner' as NutritionTab, label: '3D Plate Scanner', icon: Camera, sub: "What's on your plate?" },
    { id: 'blueprints' as NutritionTab, label: 'Science & Ayurveda', icon: BookOpen, sub: 'Dietary blueprints' },
  ];

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-in fade-in duration-300">
      {/* Top Nutrition Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-1.5 p-1.5 rounded-full bg-white/90 dark:bg-obsidian-900 border border-slate-200 dark:border-white/10 backdrop-blur-xl shadow-glass-card-light dark:shadow-glass-card">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-200 ${
                  isSelected
                    ? 'bg-gradient-to-r from-prana-500 to-emerald-500 text-obsidian-950 shadow-glow-prana'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-obsidian-950' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: AI Meal Suggester (What should I eat today?) */}
      {activeTab === 'suggester' && (
        <motion.div
          key="suggester-tab"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
        >
          <AIMealSuggesterModule onAddToTodayPlan={onAddToTodayPlan} />
        </motion.div>
      )}

      {/* Tab 2: 3D AI Meal Scanner (What's on your plate?) */}
      {activeTab === 'scanner' && (
        <motion.div
          key="scanner-tab"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
        >
          <AIMealScannerModule
            onOpenAICoachWithPrompt={(prompt) => {
              if (onOpenAICoachWithPrompt) {
                onOpenAICoachWithPrompt(prompt);
              } else {
                onOpenAICoach();
              }
            }}
          />
        </motion.div>
      )}

      {/* Tab 3: Blueprints & Smart Nutrition */}
      {activeTab === 'blueprints' && (
        <motion.div
          key="blueprints-tab"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10"
        >
          <SmartNutrition />
        </motion.div>
      )}
    </div>
  );
};
