import React, { useState } from 'react';
import {
  mealSuggesterService,
  INDIAN_MEAL_DATABASE,
} from '../../services/mealSuggesterService';
import type { UserMealPreferences, SuggestedMeal } from '../../services/mealSuggesterService';
import { MealCarousel3D } from './MealCarousel3D';
import {
  Sparkles,
  Utensils,
  Flame,
  Clock,
  IndianRupee,
  Plus,
  X,
  Bot,
  Check,
  Zap,
  Filter,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GOALS = ['Lose weight', 'Gain muscle', 'Maintain weight', 'Improve fitness', 'General wellness'] as const;
const DIETS = ['Vegetarian', 'Non-vegetarian', 'Eggetarian', 'Vegan'] as const;
const CUISINES = [
  'South Indian',
  'North Indian',
  'Andhra',
  'Telangana',
  'Bengali',
  'Punjabi',
  'Gujarati',
  'Kerala',
  'Maharashtrian',
  'Mixed Indian',
] as const;
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Snack', 'Dinner'] as const;
const BUDGETS = ['Budget-friendly', 'Moderate', 'Flexible'] as const;
const TIMES = ['Under 15 min', '15–30 min', '30–60 min'] as const;

const COMMON_INGREDIENTS = [
  'Paneer',
  'Moong Dal',
  'Whole Wheat Atta',
  'Basmati Rice',
  'Eggs',
  'Curd (Dahi)',
  'Palak (Spinach)',
  'Peanuts',
  'Makhana',
  'Besan',
];

interface AIMealSuggesterModuleProps {
  onAddToTodayPlan?: (meal: SuggestedMeal) => void;
}

export const AIMealSuggesterModule: React.FC<AIMealSuggesterModuleProps> = ({
  onAddToTodayPlan,
}) => {
  const [preferences, setPreferences] = useState<UserMealPreferences>({
    goal: 'Gain muscle',
    diet: 'Vegetarian',
    cuisine: 'North Indian',
    mealType: 'Lunch',
    budget: 'Moderate',
    availableIngredients: ['Paneer', 'Moong Dal', 'Whole Wheat Atta'],
    allergies: [],
    time: '15–30 min',
  });

  const [ingredientInput, setIngredientInput] = useState('');
  const [allergyInput, setAllergyInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestedMeals, setSuggestedMeals] = useState<SuggestedMeal[]>(INDIAN_MEAL_DATABASE.slice(0, 4));
  const [hasGenerated, setHasGenerated] = useState(true);
  const [planToast, setPlanToast] = useState<string | null>(null);

  const handleAddIngredient = (item?: string) => {
    const val = item || ingredientInput.trim();
    if (!val) return;
    if (!preferences.availableIngredients.includes(val)) {
      setPreferences((prev) => ({
        ...prev,
        availableIngredients: [...prev.availableIngredients, val],
      }));
    }
    if (!item) setIngredientInput('');
  };

  const handleRemoveIngredient = (item: string) => {
    setPreferences((prev) => ({
      ...prev,
      availableIngredients: prev.availableIngredients.filter((i) => i !== item),
    }));
  };

  const handleAddAllergy = (allergy?: string) => {
    const val = allergy || allergyInput.trim();
    if (!val) return;
    if (!preferences.allergies.includes(val)) {
      setPreferences((prev) => ({
        ...prev,
        allergies: [...prev.allergies, val],
      }));
    }
    if (!allergy) setAllergyInput('');
  };

  const handleRemoveAllergy = (allergy: string) => {
    setPreferences((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((a) => a !== allergy),
    }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const results = await mealSuggesterService.getSuggestions(preferences);
      setSuggestedMeals(results);
      setHasGenerated(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSwapMeal = async (currentId: string) => {
    const alternative = await mealSuggesterService.swapMeal(currentId, preferences);
    setSuggestedMeals((prev) => prev.map((m) => (m.id === currentId ? alternative : m)));
  };

  const handleAddToPlan = (meal: SuggestedMeal) => {
    if (onAddToTodayPlan) {
      onAddToTodayPlan(meal);
    }
    setPlanToast(`Added "${meal.name}" (${meal.calories} kcal) to today's nutrition plan!`);
    setTimeout(() => setPlanToast(null), 4000);
  };

  return (
    <div className="space-y-12">
      {/* 1. Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surya-500/15 border border-surya-500/30 text-xs font-bold text-surya-400">
          <Bot className="w-3.5 h-3.5" />
          <span>Indian AI Nutrition Assistant</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
          What should I eat today?
        </h2>
        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300">
          Tell your Saathi what you're craving, and we'll work around your goals.
        </p>
      </div>

      {/* Plan Toast Notification */}
      {planToast && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="max-w-md mx-auto p-4 rounded-2xl bg-prana-950/90 border border-prana-500/50 shadow-glow-prana text-xs font-bold text-prana-300 flex items-center gap-2.5 backdrop-blur-md"
        >
          <Check className="w-4 h-4 text-prana-400 stroke-[3]" />
          <span>{planToast}</span>
        </motion.div>
      )}

      {/* 2. Conversational Preferences Panel */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-7 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-prana-400" />
            <h3 className="font-display font-bold text-slate-900 dark:text-white text-base sm:text-lg">
              Personalize Your Desi Plate
            </h3>
          </div>
          <span className="text-xs text-slate-600 dark:text-slate-400">Step 1 of 2: Set your cravings & pantry</span>
        </div>

        <div className="space-y-6">
          {/* Goal Selector */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
              1. Your Health Goal:
            </span>
            <div className="flex flex-wrap gap-2">
              {GOALS.map((g) => (
                <button
                  key={g}
                  onClick={() => setPreferences((p) => ({ ...p, goal: g }))}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    preferences.goal === g
                      ? 'bg-prana-500 text-obsidian-950 shadow-glow-prana'
                      : 'bg-white dark:bg-obsidian-950/70 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/5'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Diet Preference & Meal Type Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Diet */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                2. Diet Preference:
              </span>
              <div className="flex flex-wrap gap-2">
                {DIETS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setPreferences((p) => ({ ...p, diet: d }))}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      preferences.diet === d
                        ? 'bg-prana-500 text-obsidian-950 shadow-glow-prana'
                        : 'bg-white dark:bg-obsidian-950/70 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/5'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Meal Time */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                3. Meal Window:
              </span>
              <div className="flex flex-wrap gap-2">
                {MEAL_TYPES.map((m) => (
                  <button
                    key={m}
                    onClick={() => setPreferences((p) => ({ ...p, mealType: m }))}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      preferences.mealType === m
                        ? 'bg-surya-500 text-obsidian-950 shadow-glow-surya'
                        : 'bg-white dark:bg-obsidian-950/70 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/5'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 10 Regional Indian Cuisines */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
              4. Regional Indian Cuisine Craving:
            </span>
            <div className="flex flex-wrap gap-2">
              {CUISINES.map((c) => (
                <button
                  key={c}
                  onClick={() => setPreferences((p) => ({ ...p, cuisine: c }))}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    preferences.cuisine === c
                      ? 'bg-gradient-to-r from-prana-500 to-surya-400 text-obsidian-950 shadow-md'
                      : 'bg-white dark:bg-obsidian-950/70 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/5'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Budget & Time Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Budget */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                5. Estimated Budget:
              </span>
              <div className="flex flex-wrap gap-2">
                {BUDGETS.map((b) => (
                  <button
                    key={b}
                    onClick={() => setPreferences((p) => ({ ...p, budget: b }))}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      preferences.budget === b
                        ? 'bg-amber-500 text-obsidian-950 shadow-md'
                        : 'bg-white dark:bg-obsidian-950/70 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/5'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Preparation Time */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                6. Cooking Time Available:
              </span>
              <div className="flex flex-wrap gap-2">
                {TIMES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setPreferences((p) => ({ ...p, time: t }))}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      preferences.time === t
                        ? 'bg-cyan-500 text-obsidian-950 shadow-md'
                        : 'bg-white dark:bg-obsidian-950/70 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/5'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Available Pantry Ingredients Input */}
          <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
              7. Available Ingredients in Your Kitchen:
            </span>

            {/* Quick-add suggestions */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {COMMON_INGREDIENTS.map((ing) => (
                <button
                  key={ing}
                  onClick={() => handleAddIngredient(ing)}
                  className="px-2.5 py-1 rounded-lg text-[11px] bg-stone-100 hover:bg-stone-200 dark:bg-obsidian-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5 flex items-center gap-1 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-prana-500"
                >
                  <Plus className="w-3 h-3 text-prana-400" />
                  <span>{ing}</span>
                </button>
              ))}
            </div>

            {/* Active ingredient chips */}
            <div className="flex flex-wrap gap-2 items-center p-3 rounded-2xl bg-white dark:bg-obsidian-950/80 border border-slate-300 dark:border-white/10 min-h-[50px]">
              {preferences.availableIngredients.map((ing) => (
                <span
                  key={ing}
                  className="px-3 py-1 rounded-xl text-xs font-semibold bg-prana-500/20 text-prana-800 dark:text-prana-300 border border-prana-500/40 flex items-center gap-1.5"
                >
                  <span>{ing}</span>
                  <button
                    onClick={() => handleRemoveIngredient(ing)}
                    className="hover:text-slate-900 dark:hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              <input
                type="text"
                value={ingredientInput}
                onChange={(e) => setIngredientInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddIngredient()}
                placeholder="Type ingredient & press Enter (e.g. Sattu, Tomatoes)..."
                className="bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-prana-500 flex-1 min-w-[200px]"
              />
            </div>
          </div>

          {/* Allergies / Intolerances Field */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                8. Allergies, Intolerances & Religious Restrictions:
              </span>
              <span className="text-[10px] text-amber-400 font-medium">Clearly Filtered</span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-2">
              {['No Dairy / Lactose', 'No Peanuts', 'Gluten Sensitive', 'Jain (No Onion/Garlic)'].map((allg) => (
                <button
                  key={allg}
                  onClick={() => handleAddAllergy(allg)}
                  className="px-2.5 py-1 rounded-lg text-[11px] bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3 text-rose-400" />
                  <span>{allg}</span>
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 items-center p-3 rounded-2xl bg-white dark:bg-obsidian-950/80 border border-slate-300 dark:border-white/10 min-h-[46px]">
              {preferences.allergies.map((allg) => (
                <span
                  key={allg}
                  className="px-3 py-1 rounded-xl text-xs font-semibold bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/40 flex items-center gap-1.5"
                >
                  <span>{allg}</span>
                  <button onClick={() => handleRemoveAllergy(allg)} className="hover:text-slate-900 dark:hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              <input
                type="text"
                value={allergyInput}
                onChange={(e) => setAllergyInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddAllergy()}
                placeholder="Type allergy & press Enter..."
                className="bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-prana-500 flex-1 min-w-[200px]"
              />
            </div>
          </div>
        </div>

        {/* Generate Primary Button */}
        <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex justify-center">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-8 py-4 rounded-full font-display font-bold text-sm sm:text-base bg-gradient-to-r from-prana-500 via-emerald-500 to-surya-400 text-obsidian-950 hover:from-prana-400 hover:to-surya-300 shadow-glow-prana transition-all duration-300 flex items-center gap-2.5 active:scale-95 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Crafting Your Indian Meal Plan...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Personalized Meals</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. 3D Meal Carousel Display */}
      {hasGenerated && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-500">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1.5 rounded-lg bg-prana-500/20 text-prana-400">
                  <Sparkles className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold text-prana-400 uppercase tracking-wider">
                  Interactive 3D Meal Carousel
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
                Recommended for Your {preferences.goal}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Swipe or use arrows to rotate through tailored Indian recipes:
              </p>
            </div>

            <button
              onClick={handleGenerate}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-stone-100 hover:bg-stone-200 dark:bg-obsidian-850 dark:hover:bg-slate-800 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white border border-slate-200 dark:border-white/10 transition-colors flex items-center gap-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-prana-500"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerate All</span>
            </button>
          </div>

          <MealCarousel3D
            meals={suggestedMeals}
            onSwapMeal={handleSwapMeal}
            onAddToPlan={handleAddToPlan}
            onGenerateAnother={handleGenerate}
          />
        </div>
      )}
    </div>
  );
};
