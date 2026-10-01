import React, { useState } from 'react';
import type { SuggestedMeal } from '../../services/mealSuggesterService';
import {
  Clock,
  IndianRupee,
  Flame,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  CalendarPlus,
  RefreshCw,
  HelpCircle,
  Check,
  Award,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface MealCarousel3DProps {
  meals: SuggestedMeal[];
  onSwapMeal: (mealId: string) => void;
  onAddToPlan: (meal: SuggestedMeal) => void;
  onGenerateAnother: () => void;
}

export const MealCarousel3D: React.FC<MealCarousel3DProps> = ({
  meals,
  onSwapMeal,
  onAddToPlan,
  onGenerateAnother,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [savedMeals, setSavedMeals] = useState<Record<string, boolean>>({});
  const [addedMeals, setAddedMeals] = useState<Record<string, boolean>>({});
  const [showWhyModal, setShowWhyModal] = useState<boolean>(false);

  if (!meals || meals.length === 0) return null;

  const currentMeal = meals[activeIndex % meals.length];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % meals.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + meals.length) % meals.length);
  };

  const handleSave = (id: string) => {
    setSavedMeals((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAdd = (meal: SuggestedMeal) => {
    setAddedMeals((prev) => ({ ...prev, [meal.id]: true }));
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10B981', '#F59E0B', '#34D399'],
    });
    onAddToPlan(meal);
  };

  return (
    <div className="space-y-8 select-none">
      {/* Carousel Container with 3D Perspective */}
      <div className="relative py-4 overflow-hidden" style={{ perspective: '1200px' }}>
        {/* Navigation Arrows */}
        <div className="absolute top-1/2 left-2 sm:left-6 -translate-y-1/2 z-30">
          <button
            onClick={handlePrev}
            className="w-11 h-11 rounded-full bg-obsidian-950/85 hover:bg-slate-800 text-white border border-white/15 flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95"
            aria-label="Previous Meal"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>

        <div className="absolute top-1/2 right-2 sm:right-6 -translate-y-1/2 z-30">
          <button
            onClick={handleNext}
            className="w-11 h-11 rounded-full bg-obsidian-950/85 hover:bg-slate-800 text-white border border-white/15 flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95"
            aria-label="Next Meal"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* 3D Stack of Cards */}
        <div className="flex justify-center items-center min-h-[520px] px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMeal.id}
              initial={{ opacity: 0, rotateY: 25, scale: 0.9 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: -25, scale: 0.9 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="w-full max-w-xl glass-panel-glow rounded-3xl border border-prana-500/30 p-6 sm:p-8 shadow-2xl flex flex-col justify-between relative overflow-hidden"
            >
              {/* Background ambient gradient */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-prana-500/10 via-surya-500/5 to-transparent blur-2xl pointer-events-none" />

              {/* Card Header: Tags, Meal type, Region */}
              <div className="flex items-start justify-between gap-3 relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-prana-500/15 text-prana-700 dark:bg-prana-500/20 dark:text-prana-400 border border-prana-500/30">
                      {currentMeal.cuisine}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5">
                      {currentMeal.mealType}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-surya-500/10 dark:bg-surya-500/15 text-surya-700 dark:text-surya-400 border border-surya-500/25">
                      {currentMeal.difficulty}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {currentMeal.name}
                  </h3>
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">({currentMeal.hindiName})</span>
                </div>

                {/* Save Bookmark Button */}
                <button
                  onClick={() => handleSave(currentMeal.id)}
                  className={`p-2.5 rounded-2xl border transition-all ${
                    savedMeals[currentMeal.id]
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                      : 'bg-white dark:bg-obsidian-950/80 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Save Meal"
                >
                  <Bookmark className={`w-5 h-5 ${savedMeals[currentMeal.id] ? 'fill-amber-400' : ''}`} />
                </button>
              </div>

              {/* Meal Image with Prep Time & Cost Banner */}
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden my-4 border border-white/10 bg-slate-950">
                <img
                  src={currentMeal.image}
                  alt={currentMeal.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-transparent to-transparent pointer-events-none" />

                {/* Badges on Image */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-obsidian-950/85 backdrop-blur-md border border-white/10 text-xs font-semibold text-slate-200">
                    <Clock className="w-3.5 h-3.5 text-prana-400" />
                    <span>{currentMeal.prepTime}</span>
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-obsidian-950/85 backdrop-blur-md border border-white/10 text-xs font-bold text-amber-400">
                    <IndianRupee className="w-3.5 h-3.5" />
                    <span>{currentMeal.costEstimate.replace('₹', '')}</span>
                  </div>
                </div>

                <div className="absolute bottom-3 right-3">
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-obsidian-950/85 backdrop-blur-md border border-white/10 text-xs font-black text-white">
                    <Flame className="w-3.5 h-3.5 text-surya-400" />
                    <span>{currentMeal.calories} kcal</span>
                  </div>
                </div>
              </div>

              {/* Macros Row */}
              <div className="grid grid-cols-4 gap-2 text-center my-1 relative z-10">
                <div className="p-2.5 rounded-xl bg-prana-50 dark:bg-obsidian-950/60 border border-prana-200 dark:border-emerald-500/20">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 block font-medium">Protein</span>
                  <span className="text-lg font-black text-prana-700 dark:text-prana-400">{currentMeal.protein}g</span>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-obsidian-950/60 border border-amber-200 dark:border-amber-500/20">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 block font-medium">Carbs</span>
                  <span className="text-lg font-black text-amber-800 dark:text-amber-400">{currentMeal.carbs}g</span>
                </div>
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-obsidian-950/60 border border-rose-200 dark:border-rose-500/20">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 block font-medium">Fats</span>
                  <span className="text-lg font-black text-rose-700 dark:text-rose-400">{currentMeal.fats}g</span>
                </div>
                <div className="p-2.5 rounded-xl bg-cyan-50 dark:bg-obsidian-950/60 border border-cyan-200 dark:border-cyan-500/20">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 block font-medium">Fiber</span>
                  <span className="text-lg font-black text-cyan-800 dark:text-cyan-400">{currentMeal.fiber}g</span>
                </div>
              </div>

              {/* "Why This Meal?" Conversational AI Callout */}
              <div className="p-4 rounded-2xl bg-prana-500/10 border border-prana-500/20 my-3 text-xs space-y-1 relative z-10">
                <div className="flex items-center gap-1.5 text-prana-700 dark:text-prana-400 font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Why this meal for you?</span>
                </div>
                <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                  {currentMeal.whyThisMeal}
                </p>
              </div>

              {/* Ingredients Chips */}
              <div className="pt-1 pb-3 relative z-10">
                <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400 block mb-1.5">
                  Ingredients:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentMeal.ingredients.map((ing, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-lg text-[11px] bg-slate-100 dark:bg-obsidian-950/70 border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Swap, Save, Add to Plan */}
              <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between gap-2 flex-wrap relative z-10">
                <div className="flex items-center gap-2">
                  {/* Swap Meal */}
                  <button
                    onClick={() => onSwapMeal(currentMeal.id)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-100 dark:bg-obsidian-850 dark:hover:bg-slate-800 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white border border-slate-200 dark:border-white/10 transition-colors flex items-center gap-1.5 active:scale-95"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-surya-400" />
                    <span>Swap Meal</span>
                  </button>

                  {/* Generate Another */}
                  <button
                    onClick={onGenerateAnother}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-100 dark:bg-obsidian-850 dark:hover:bg-slate-800 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white border border-slate-200 dark:border-white/10 transition-colors flex items-center gap-1.5 active:scale-95"
                  >
                    <Zap className="w-3.5 h-3.5 text-prana-400" />
                    <span>Generate Another</span>
                  </button>
                </div>

                {/* Add to Today's Plan */}
                <button
                  onClick={() => handleAdd(currentMeal)}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 active:scale-95 shadow-glow-prana ${
                    addedMeals[currentMeal.id]
                      ? 'bg-prana-500 text-obsidian-950'
                      : 'bg-gradient-to-r from-prana-500 to-emerald-600 text-obsidian-950 hover:from-prana-400 hover:to-emerald-500'
                  }`}
                >
                  {addedMeals[currentMeal.id] ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Added to Plan ✓</span>
                    </>
                  ) : (
                    <>
                      <CalendarPlus className="w-3.5 h-3.5" />
                      <span>Add to Today's Plan</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex justify-center items-center gap-2 mt-4">
          {meals.map((m, index) => (
            <button
              key={m.id}
              onClick={() => setActiveIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === index
                  ? 'w-8 bg-gradient-to-r from-prana-500 to-surya-400 shadow-glow-prana'
                  : 'w-2 bg-slate-700 hover:bg-slate-600'
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
