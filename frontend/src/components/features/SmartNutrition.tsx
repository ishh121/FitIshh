import React, { useState } from 'react';
import { SMART_RECOMMENDATIONS } from '../../services/nutritionService';
import type { MealRecommendation } from '../../types/nutrition';
import { Clock, Flame, Sparkles, Check, ChevronRight, Leaf, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export const SmartNutrition: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePlan, setActivePlan] = useState<MealRecommendation>(SMART_RECOMMENDATIONS[0]);

  const categories = ['All', 'High Protein Veg', 'Diabetic Friendly', 'Desi Cut'];

  const filtered =
    selectedCategory === 'All'
      ? SMART_RECOMMENDATIONS
      : SMART_RECOMMENDATIONS.filter((r) => r.category === selectedCategory);

  return (
    <div className="flex flex-col gap-8">
      {/* Header & Filter Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
        <div>
          <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Leaf className="w-5 h-5 text-prana-600 dark:text-prana-400" />
            <span>Smart Meal Suggestions (Science + Ayurveda)</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Personalized meal plans built around lentils, whole grains, paneer, and native Indian superfoods:
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-obsidian-950/80 p-1 rounded-xl border border-slate-200 dark:border-white/5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-prana-500 text-white dark:text-obsidian-950 shadow-glow-prana'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Meal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((meal) => (
          <motion.div
            key={meal.id}
            whileHover={{ y: -4 }}
            onClick={() => setActivePlan(meal)}
            className={`glass-panel rounded-3xl p-5 border transition-all cursor-pointer flex flex-col justify-between ${
              activePlan.id === meal.id
                ? 'border-prana-500/50 shadow-glow-prana'
                : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <div>
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 bg-slate-950">
                <img src={meal.image} alt={meal.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-obsidian-950/85 px-2.5 py-1 rounded-full text-[10px] font-bold text-prana-400 border border-white/10 backdrop-blur-md">
                  {meal.mealType}
                </div>
                <div className="absolute bottom-2 right-2 bg-obsidian-950/85 px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-200 border border-white/10 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{meal.prepTimeMinutes} mins</span>
                </div>
              </div>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surya-500/10 text-surya-700 dark:text-surya-400 border border-surya-500/20 inline-block mb-2">
                {meal.category}
              </span>

              <h4 className="font-bold text-slate-900 dark:text-white text-base leading-snug mb-2">{meal.title}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{meal.healthBenefit}</p>
            </div>

            {/* Macros footer */}
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
              <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-surya-600 dark:text-surya-400" />
                {meal.macros.calories} kcal
              </span>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <span>P: <strong className="text-prana-700 dark:text-prana-400">{meal.macros.protein}g</strong></span>
                <span>C: <strong className="text-slate-800 dark:text-slate-100">{meal.macros.carbs}g</strong></span>
                <span>F: <strong className="text-slate-800 dark:text-slate-100">{meal.macros.fats}g</strong></span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Selected Meal Deep Dive */}
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-prana-500/30 flex flex-col md:flex-row items-start justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-prana-600 dark:text-prana-400" />
            <span className="text-xs font-bold text-prana-600 dark:text-prana-400 uppercase tracking-wider">
              Nutritional Blueprint
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{activePlan.title}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{activePlan.healthBenefit}</p>

          <div className="pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
              Indian Kitchen Ingredients:
            </span>
            <div className="flex flex-wrap gap-2">
              {activePlan.ingredients.map((ing, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-obsidian-950/70 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="shrink-0 p-5 rounded-2xl bg-slate-50 dark:bg-obsidian-950/80 border border-slate-200 dark:border-white/10 w-full md:w-64 space-y-3 text-center">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Daily Macro Contribution</span>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-3xl font-black text-prana-600 dark:text-prana-400">{activePlan.macros.protein}g</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Protein</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">
            Covers <strong>32%</strong> of your daily target without spike in saturated fat.
          </p>
        </div>
      </div>
    </div>
  );
};
