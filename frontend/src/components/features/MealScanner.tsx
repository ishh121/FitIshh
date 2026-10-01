import React, { useState } from 'react';
import { SAMPLE_INDIAN_DISHES } from '../../services/nutritionService';
import type { ScannedMealResult } from '../../types/nutrition';
import { Camera, Scan, Sparkles, Check, ArrowRight, Utensils, AlertCircle, Droplet, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const MealScanner: React.FC = () => {
  const [selectedDishIndex, setSelectedDishIndex] = useState<number>(0);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const activeMeal: ScannedMealResult = SAMPLE_INDIAN_DISHES[selectedDishIndex];

  const handleSelectDish = (index: number) => {
    setIsScanning(true);
    setTimeout(() => {
      setSelectedDishIndex(index);
      setIsScanning(false);
    }, 450);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Selector Ribbon */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
        <div>
          <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-prana-600 dark:text-prana-400" />
            <span>AI Desi Meal Scanner</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click any authentic Indian plate below to simulate instant computer vision detection:
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {SAMPLE_INDIAN_DISHES.map((dish, idx) => (
            <button
              key={dish.id}
              onClick={() => handleSelectDish(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                selectedDishIndex === idx
                  ? 'bg-prana-500 text-white dark:text-obsidian-950 border-prana-400 shadow-glow-prana'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              {dish.dishName.split('(')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Main Scanner Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Dish Visual & Camera Overlay */}
        <div className="lg:col-span-6 relative rounded-3xl overflow-hidden glass-panel border border-slate-200 dark:border-white/10 shadow-2xl">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
            <img
              src={activeMeal.imageUrl}
              alt={activeMeal.dishName}
              className={`w-full h-full object-cover transition-transform duration-500 ${
                isScanning ? 'scale-105 filter blur-xs' : 'scale-100'
              }`}
            />

            {/* Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-transparent to-black/40 pointer-events-none" />

            {/* Laser Scan Line Animation */}
            {isScanning && (
              <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-prana-400 to-transparent shadow-glow-prana animate-scanline z-30" />
            )}

            {/* AI Bounding Boxes */}
            {!isScanning &&
              activeMeal.detectedItems.map((item, i) =>
                item.boundingBox ? (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="absolute border-2 border-prana-400 rounded-lg bg-prana-500/10 pointer-events-none z-20 flex flex-col justify-between p-1.5 backdrop-blur-[2px]"
                    style={{
                      left: `${item.boundingBox.x}%`,
                      top: `${item.boundingBox.y}%`,
                      width: `${item.boundingBox.width}%`,
                      height: `${item.boundingBox.height}%`,
                    }}
                  >
                    <div className="flex items-center gap-1 bg-obsidian-950/85 px-1.5 py-0.5 rounded text-[10px] font-bold text-white border border-prana-400/40 w-max shadow">
                      <span className="w-1.5 h-1.5 rounded-full bg-prana-400" />
                      <span>{item.name.split('(')[0]}</span>
                    </div>
                    <div className="text-[9px] text-prana-300 font-mono bg-obsidian-950/80 px-1 rounded w-max self-end">
                      {(item.confidence * 100).toFixed(0)}% Match
                    </div>
                  </motion.div>
                ) : null
              )}

            {/* Scanner Status Badge */}
            <div className="absolute top-4 left-4 z-30 flex items-center gap-2 bg-obsidian-950/85 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-prana-400 animate-pulse" />
              <span className="text-xs font-semibold text-slate-200">
                {isScanning ? 'Analyzing plate...' : 'AI Vision Detection Complete'}
              </span>
            </div>

            {/* Prana Score pill */}
            <div className="absolute top-4 right-4 z-30 flex items-center gap-1.5 bg-surya-500/20 border border-surya-500/40 px-3 py-1.5 rounded-full backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-surya-400" />
              <span className="text-xs font-bold text-surya-400">Prana Score: {activeMeal.pranaScore}/10</span>
            </div>
          </div>

          {/* Dish Title & Region Banner */}
          <div className="p-5 flex items-center justify-between border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60">
            <div>
              <span className="text-[11px] font-semibold text-prana-600 dark:text-prana-400 uppercase tracking-wider">
                {activeMeal.cuisineRegion} Cuisine
              </span>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{activeMeal.dishName}</h4>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{activeMeal.totalMacros.calories}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">kcal</span>
            </div>
          </div>
        </div>

        {/* Right Col: Macros Breakdown, Ghee Estimator & Smart Swaps */}
        <div className="lg:col-span-6 flex flex-col gap-5">
          {/* Macro Split Bar */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-200 dark:border-white/10">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Macronutrient Breakdown
            </h4>
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-obsidian-950/60 border border-emerald-500/20">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Protein</span>
                <span className="text-xl font-black text-prana-600 dark:text-prana-400">{activeMeal.totalMacros.protein}g</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-obsidian-950/60 border border-amber-500/20">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Carbs</span>
                <span className="text-xl font-black text-amber-600 dark:text-amber-400">{activeMeal.totalMacros.carbs}g</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-obsidian-950/60 border border-rose-500/20">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Fats</span>
                <span className="text-xl font-black text-rose-600 dark:text-rose-400">{activeMeal.totalMacros.fats}g</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-obsidian-950/60 border border-cyan-500/20">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Fiber</span>
                <span className="text-xl font-black text-cyan-600 dark:text-cyan-400">{activeMeal.totalMacros.fiber}g</span>
              </div>
            </div>
          </div>

          {/* Detected Ingredients with Ghee Estimator */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-200 dark:border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Detected Food Items & Oil/Ghee Levels
              </h4>
              <span className="text-[11px] text-prana-600 dark:text-prana-400 font-medium">Automatic Weight Est.</span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {activeMeal.detectedItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-obsidian-950/50 border border-slate-200 dark:border-white/5 text-xs"
                >
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">{item.name}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">{item.quantity}</span>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    {item.gheeEstimateTsp > 0 && (
                      <div className="flex items-center gap-1 text-surya-700 dark:text-surya-400 text-[11px] bg-surya-500/10 px-2 py-0.5 rounded border border-surya-500/20">
                        <Droplet className="w-3 h-3" />
                        <span>~{item.gheeEstimateTsp} tsp Ghee</span>
                      </div>
                    )}
                    <span className="font-bold text-slate-800 dark:text-slate-200">{item.calories} kcal</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Desi Swaps */}
          <div className="glass-panel-surya rounded-2xl p-5 border border-surya-500/30 space-y-2">
            <div className="flex items-center gap-2 text-surya-700 dark:text-surya-400 text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Intelligent Health Swaps for this Plate</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              {activeMeal.smartSwaps.map((swap, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-surya-600 dark:text-surya-400 font-bold">•</span>
                  <span>{swap}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
