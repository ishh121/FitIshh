import React, { useEffect, useState } from 'react';
import { Utensils } from 'lucide-react';

interface MealLogItem {
  id: string;
  title: string;
  createdAt: string;
  source: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
  };
  items: { name: string; portion: string }[];
}

export const NutritionSnapshot: React.FC<{ onNavigateToNutrition: () => void }> = ({
  onNavigateToNutrition,
}) => {
  const [loggedMeals, setLoggedMeals] = useState<MealLogItem[]>([]);

  useEffect(() => {
    let active = true;
    fetch('/api/meal-logs')
      .then(async (response) => {
        if (!response.ok) return [];
        const result = await response.json();
        const today = new Date().toDateString();
        return (result.mealLogs as MealLogItem[]).filter((meal) =>
          new Date(meal.createdAt).toDateString() === today,
        );
      })
      .then((meals) => {
        if (active) setLoggedMeals(meals);
      })
      .catch(() => {
        if (active) setLoggedMeals([]);
      });

    return () => {
      active = false;
    };
  }, []);

  const totalCalories = loggedMeals.reduce((acc, meal) => acc + meal.nutrition.calories, 0);
  const totalProtein = loggedMeals.reduce((acc, meal) => acc + meal.nutrition.protein, 0);
  const totalCarbs = loggedMeals.reduce((acc, meal) => acc + meal.nutrition.carbs, 0);
  const totalFats = loggedMeals.reduce((acc, meal) => acc + meal.nutrition.fats, 0);
  const totalFiber = loggedMeals.reduce((acc, meal) => acc + meal.nutrition.fiber, 0);

  const calGoal = 2100;
  const proteinGoal = 85;
  const carbsGoal = 230;
  const fatsGoal = 60;
  const fiberGoal = 35;

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 space-y-7">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-200 dark:border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-surya-500/20 text-surya-700 dark:text-surya-400">
              <Utensils className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-surya-700 dark:text-surya-400 uppercase tracking-wider">
              Desi Nutrition Telemetry
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
            Today's Nutrition Snapshot
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Calibrated for Indian dietary patterns: rotis, lentils, paneer, and native whole grains.
          </p>
        </div>

        <button
          onClick={onNavigateToNutrition}
          className="px-4 py-2 rounded-full text-xs font-bold bg-prana-500/15 text-prana-700 dark:text-prana-400 border border-prana-500/30 hover:bg-prana-500 hover:text-white dark:hover:text-obsidian-950 transition-all flex items-center gap-1.5"
        >
          <span>Open AI Plate Scanner</span>
        </button>
      </div>

      {/* 5 Macros Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* Calories */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-obsidian-950/70 border border-slate-200 dark:border-white/5 space-y-1.5 col-span-2 sm:col-span-1">
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Calories</span>
            <span className="font-bold text-slate-900 dark:text-white">{totalCalories} / {calGoal}</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{totalCalories} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">kcal</span></div>
          <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div className="h-full bg-surya-400 rounded-full" style={{ width: `${(totalCalories / calGoal) * 100}%` }} />
          </div>
        </div>

        {/* Protein */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-obsidian-950/70 border border-slate-200 dark:border-white/5 space-y-1.5">
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Protein</span>
            <span className="font-bold text-prana-600 dark:text-prana-400">{totalProtein}g / {proteinGoal}g</span>
          </div>
          <div className="text-2xl font-black text-prana-600 dark:text-prana-400">{totalProtein}g</div>
          <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div className="h-full bg-prana-400 rounded-full shadow-glow-prana" style={{ width: `${(totalProtein / proteinGoal) * 100}%` }} />
          </div>
        </div>

        {/* Carbs */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-obsidian-950/70 border border-slate-200 dark:border-white/5 space-y-1.5">
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Carbs</span>
            <span className="font-bold text-amber-600 dark:text-amber-400">{totalCarbs}g / {carbsGoal}g</span>
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{totalCarbs}g</div>
          <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(totalCarbs / carbsGoal) * 100}%` }} />
          </div>
        </div>

        {/* Fats */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-obsidian-950/70 border border-slate-200 dark:border-white/5 space-y-1.5">
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Fats</span>
            <span className="font-bold text-rose-600 dark:text-rose-400">{totalFats}g / {fatsGoal}g</span>
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400">{totalFats}g</div>
          <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div className="h-full bg-rose-400 rounded-full" style={{ width: `${(totalFats / fatsGoal) * 100}%` }} />
          </div>
        </div>

        {/* Fiber */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-obsidian-950/70 border border-slate-200 dark:border-white/5 space-y-1.5">
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Fiber</span>
            <span className="font-bold text-cyan-600 dark:text-cyan-400">{totalFiber}g / {fiberGoal}g</span>
          </div>
          <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400">{totalFiber}g</div>
          <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${(totalFiber / fiberGoal) * 100}%` }} />
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        Nutrition totals include meals saved to your account today.
      </p>

      {/* Logged Indian Meals Timeline */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Today's Logged Plates
          </span>
          <span className="text-xs text-surya-600 dark:text-surya-400 font-medium">{loggedMeals.length} saved meals</span>
        </div>

        <div className="space-y-2.5">
          {!loggedMeals.length && (
            <p className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
              No meals saved today. Your nutrition totals are zero.
            </p>
          )}
          {loggedMeals.map((meal) => (
            <div
              key={meal.id}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-obsidian-950/60 border border-slate-200 dark:border-white/5 flex items-center justify-between gap-4 flex-wrap hover:border-slate-300 dark:hover:border-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="text-center px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Saved</span>
                  <span className="text-[10px] text-prana-600 dark:text-prana-400 font-medium">{new Date(meal.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h5 className="font-bold text-slate-900 dark:text-white text-sm">{meal.title}</h5>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{meal.items.map((item) => `${item.portion} ${item.name}`).join(' • ')}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs shrink-0">
                <div className="text-right">
                  <span className="font-black text-slate-900 dark:text-white block">{meal.nutrition.calories} kcal</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">P: {meal.nutrition.protein}g • C: {meal.nutrition.carbs}g • F: {meal.nutrition.fats}g</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
