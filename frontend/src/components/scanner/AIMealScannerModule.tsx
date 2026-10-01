import React, { useState, useEffect } from 'react';
import { Plate3D } from '../3d/Plate3D';
import { Camera, Sparkles, Check, ArrowRight, Bot, AlertCircle, RefreshCw, Zap, ShieldAlert, ChevronRight, Info, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiFetch } from '../../services/api';

const SCAN_STAGES = [
  { text: 'Analyzing image...', progress: 20 },
  { text: 'Identifying food...', progress: 40 },
  { text: 'Estimating portions...', progress: 60 },
  { text: 'Calculating nutrition...', progress: 80 },
  { text: 'Personalizing recommendations...', progress: 100 },
];

interface DetectedItem {
  id: string;
  name: string;
  hindi: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  confidence: number;
}

const CURRENT_DETECTED_ITEMS: DetectedItem[] = [
  { id: 'dal', name: 'Dal Tadka', hindi: 'दाल तड़का', portion: '1 bowl (150g)', calories: 180, protein: 10, carbs: 22, fats: 5, fiber: 6, confidence: 0.98 },
  { id: 'rice', name: 'Steamed Basmati Rice', hindi: 'बासमती चावल', portion: '1 cup (150g)', calories: 210, protein: 4, carbs: 45, fats: 0.8, fiber: 1.2, confidence: 0.96 },
  { id: 'curry', name: 'Vegetable & Paneer Curry', hindi: 'सब्ज़ी एवं पनीर', portion: '1 serving (140g)', calories: 140, protein: 5, carbs: 12, fats: 8, fiber: 4, confidence: 0.94 },
  { id: 'roti', name: 'Whole Wheat Phulkas', hindi: 'घर की रोटी', portion: '2 phulkas (70g)', calories: 160, protein: 6, carbs: 32, fats: 1.5, fiber: 5, confidence: 0.97 },
  { id: 'curd', name: 'Fresh Dahi (Curd)', hindi: 'ताज़ा दही', portion: '1 bowl (100g)', calories: 95, protein: 5, carbs: 6, fats: 5, fiber: 0, confidence: 0.95 },
  { id: 'salad', name: 'Kachumber Salad', hindi: 'कच्चा सलाद', portion: '1 bowl (80g)', calories: 35, protein: 1.2, carbs: 7, fats: 0.2, fiber: 3.5, confidence: 0.99 },
];

interface AIMealScannerModuleProps {
  onOpenAICoachWithPrompt?: (prompt: string) => void;
}

export const AIMealScannerModule: React.FC<AIMealScannerModuleProps> = ({
  onOpenAICoachWithPrompt,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanStageIndex, setScanStageIndex] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const [activePlateMode, setActivePlateMode] = useState<'before' | 'after'>('before');
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Interactive "Make This Meal Better" toggles
  const [improvements, setImprovements] = useState({
    addCurd: false,
    reduceRice: true,
    addVeg: true,
    addProtein: true,
  });

  const isOptimized = activePlateMode === 'after';

  const handleStartScan = () => {
    setIsScanning(true);
    setScanComplete(false);
    setScanStageIndex(0);

    let currentStage = 0;
    const interval = setInterval(() => {
      currentStage += 1;
      if (currentStage < SCAN_STAGES.length) {
        setScanStageIndex(currentStage);
      } else {
        clearInterval(interval);
        setIsScanning(false);
        setScanComplete(true);
      }
    }, 700);
  };

  const toggleImprovement = (key: keyof typeof improvements) => {
    const updated = { ...improvements, [key]: !improvements[key] };
    setImprovements(updated);
    // If user turns on improvements, switch to "after" plate
    setActivePlateMode('after');
  };

  // Calculate dynamic macros based on Before vs After
  const baseCalories = 820;
  const baseProtein = 31.2;
  const baseCarbs = 124;
  const baseFats = 20.5;
  const baseFiber = 19.7;

  const currentCalories = isOptimized ? baseCalories - 75 : baseCalories;
  const currentProtein = isOptimized ? baseProtein + 13 : baseProtein;
  const currentCarbs = isOptimized ? baseCarbs - 22 : baseCarbs;
  const currentFats = isOptimized ? baseFats + 2 : baseFats;
  const currentFiber = isOptimized ? baseFiber + 5.5 : baseFiber;

  const handleSaveSampleMeal = async () => {
    setSaveState('saving');
    try {
      const response = await apiFetch('/api/meal-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mealName: 'Sample Indian home plate',
          optimized: isOptimized,
          nutrition: {
            calories: currentCalories,
            protein: currentProtein,
            carbs: currentCarbs,
            fats: currentFats,
            fiber: currentFiber,
          },
          items: CURRENT_DETECTED_ITEMS.map(({ name, portion, calories, protein, carbs, fats, fiber }) => ({
            name,
            portion,
            calories,
            protein,
            carbs,
            fats,
            fiber,
          })),
        }),
      });

      if (!response.ok) throw new Error('Meal log save failed');
      setSaveState('saved');
    } catch {
      setSaveState('error');
    }
  };

  const askQuestions = [
    'Is this meal balanced?',
    'How can I increase protein?',
    'Is this suitable for weight loss?',
    'Suggest a healthier version.',
  ];

  return (
    <div className="space-y-12">
      {/* 1. Page Concept Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-prana-500/15 border border-prana-500/30 text-xs font-bold text-prana-700 dark:text-prana-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive 3D Vision AI</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
          What's on your plate?
        </h2>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
          Scan your meal and let your AI Saathi understand it.
        </p>
      </div>

      {/* 2. Central 3D Plate & Scan Trigger Section */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 relative overflow-hidden shadow-2xl">
        {/* Subtle Background Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-80 bg-prana-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Controls Ribbon: Before/After Toggle + Plate Status */}
        <div className="flex items-center justify-between flex-wrap gap-4 z-20 relative pb-3 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              3D Plate Perspective:
            </span>
            <div className="flex items-center gap-1 bg-stone-100 dark:bg-obsidian-950 p-1 rounded-full border border-slate-200 dark:border-white/10">
              <button
                onClick={() => setActivePlateMode('before')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  activePlateMode === 'before'
                    ? 'bg-white text-slate-900 dark:bg-slate-700 dark:text-white shadow'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Current Meal (Before)
              </button>
              <button
                onClick={() => setActivePlateMode('after')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  activePlateMode === 'after'
                    ? 'bg-prana-500 text-obsidian-950 shadow-glow-prana'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                AI-Optimized (After) ✨
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 dark:text-slate-400">
              {isOptimized ? 'Displaying +13g protein version' : 'Displaying standard home plate'}
            </span>
          </div>
        </div>

        {/* Central 3D Plate */}
        <div className="relative z-10 my-2">
          <Plate3D
            isScanning={isScanning}
            isOptimized={isOptimized}
            scanProgress={SCAN_STAGES[scanStageIndex]?.progress || 0}
          />

          {/* Floating scanning stage pill overlay */}
          {isScanning && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 px-5 py-2.5 rounded-2xl bg-white/95 dark:bg-obsidian-950/90 border border-prana-500/50 shadow-glow-prana flex items-center gap-3 backdrop-blur-xl"
            >
              <RefreshCw className="w-4 h-4 text-prana-400 animate-spin" />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  {SCAN_STAGES[scanStageIndex].text}
                </span>
                <div className="w-36 h-1 rounded-full bg-slate-200 dark:bg-slate-800 mt-1 overflow-hidden">
                  <div
                    className="h-full bg-prana-400 transition-all duration-300"
                    style={{ width: `${SCAN_STAGES[scanStageIndex].progress}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Primary Action Button */}
        <div className="text-center pt-2 relative z-20">
          <button
            onClick={handleStartScan}
            disabled={isScanning}
            className="px-8 py-4 rounded-full font-display font-extrabold text-sm sm:text-base bg-gradient-to-r from-prana-500 via-emerald-500 to-emerald-600 text-obsidian-950 hover:from-prana-400 hover:to-emerald-400 shadow-glow-prana transition-all duration-300 flex items-center gap-3 mx-auto disabled:opacity-50 active:scale-95 group"
          >
            <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>{isScanning ? 'Analyzing Plate in 3D...' : 'Scan Meal'}</span>
          </button>
          <span className="text-[11px] text-slate-600 dark:text-slate-400 block mt-2">
            Simulates neural vision scan calibrated for Indian home cooking
          </span>
        </div>
      </div>

      {/* 3. Meal Analysis & Results Section */}
      {scanComplete && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
          {/* Important Estimate Disclaimer Banner */}
          <div className="p-3.5 rounded-2xl bg-stone-100 dark:bg-obsidian-950/70 border border-slate-200 dark:border-white/10 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Info className="w-4 h-4 text-prana-400 shrink-0" />
              <span>
                <strong>Note:</strong> All nutritional values shown below are <strong>estimates</strong> calibrated using ICMR-NIN Indian Food Composition Tables.
              </span>
            </div>
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Tolerance: ±7% based on home preparation</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleSaveSampleMeal}
              disabled={saveState === 'saving'}
              className="inline-flex items-center gap-2 rounded-full border border-prana-500/40 bg-prana-500/10 px-4 py-2.5 text-sm font-semibold text-prana-800 transition-colors hover:bg-prana-500/20 disabled:cursor-wait disabled:opacity-60 dark:text-prana-300"
            >
              <Database className="h-4 w-4" />
              {saveState === 'saving' ? 'Saving...' : 'Save Sample Meal'}
            </button>
            <span aria-live="polite" className="text-sm text-slate-600 dark:text-slate-400">
              {saveState === 'saved' && 'Sample meal saved.'}
              {saveState === 'error' && 'Could not save. Check that the API is running.'}
            </span>
          </div>

          {/* Macro Split Bar for Current View */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Plate Macronutrient Profile</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5">
                    {isOptimized ? 'Optimized Blueprint' : 'Raw Detected Blueprint'}
                  </span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">Estimated cumulative calories and macros</p>
              </div>

              <div className="text-right">
                <span className="text-3xl font-display font-black text-slate-900 dark:text-white">{currentCalories}</span>
                <span className="text-xs text-slate-600 dark:text-slate-400 ml-1">kcal (Est.)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-2">
              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-obsidian-950/70 border border-emerald-500/20">
                <span className="text-xs text-slate-600 dark:text-slate-400 block font-medium">Protein (Est.)</span>
                <span className="text-2xl font-black text-prana-700 dark:text-prana-400">{currentProtein.toFixed(1)}g</span>
                <span className="text-[10px] text-slate-600 dark:text-slate-500">{isOptimized ? '+13g upgraded' : 'Baseline'}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-obsidian-950/70 border border-amber-500/20">
                <span className="text-xs text-slate-600 dark:text-slate-400 block font-medium">Carbohydrates (Est.)</span>
                <span className="text-2xl font-black text-amber-700 dark:text-amber-400">{currentCarbs.toFixed(1)}g</span>
                <span className="text-[10px] text-slate-600 dark:text-slate-500">{isOptimized ? '-22g lower glycemic' : 'Baseline'}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-obsidian-950/70 border border-rose-500/20">
                <span className="text-xs text-slate-600 dark:text-slate-400 block font-medium">Fats (Est.)</span>
                <span className="text-2xl font-black text-rose-700 dark:text-rose-400">{currentFats.toFixed(1)}g</span>
                <span className="text-[10px] text-slate-600 dark:text-slate-500">~1.8 tsp Ghee</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-obsidian-950/70 border border-cyan-500/20">
                <span className="text-xs text-slate-600 dark:text-slate-400 block font-medium">Dietary Fiber (Est.)</span>
                <span className="text-2xl font-black text-cyan-700 dark:text-cyan-400">{currentFiber.toFixed(1)}g</span>
                <span className="text-[10px] text-slate-600 dark:text-slate-500">High prebiotic</span>
              </div>
            </div>
          </div>

          {/* Detected Foods Grid with Confidence Indicators */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Detected Foods & Estimated Portions
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {CURRENT_DETECTED_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl glass-panel border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all flex flex-col justify-between gap-3 group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h5 className="font-bold text-slate-900 dark:text-white text-base">{item.name}</h5>
                        <span className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">({item.hindi})</span>
                      </div>
                      <span className="text-xs text-prana-700 dark:text-prana-400 font-medium">Portion: {item.portion}</span>
                    </div>

                    {/* AI Confidence Indicator */}
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 shrink-0">
                      {(item.confidence * 100).toFixed(0)}% Match
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-bold text-slate-900 dark:text-white">{item.calories} kcal</span>
                    <span>P: <strong className="text-prana-700 dark:text-prana-400">{item.protein}g</strong></span>
                    <span>C: <strong>{item.carbs}g</strong></span>
                    <span>F: <strong>{item.fats}g</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Micronutrient Highlights */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-white/10 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Micronutrient & Mineral Highlights
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-obsidian-950/60 border border-slate-200 dark:border-white/5">
                <span className="text-[11px] text-slate-600 dark:text-slate-400 block">Iron (Non-heme)</span>
                <span className="text-base font-bold text-slate-900 dark:text-white">4.2 mg (26% RDA)</span>
                <span className="text-[10px] text-prana-700 dark:text-prana-400 block">Spices aid absorption</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-obsidian-950/60 border border-slate-200 dark:border-white/5">
                <span className="text-[11px] text-slate-600 dark:text-slate-400 block">Vitamin B12</span>
                <span className="text-base font-bold text-slate-900 dark:text-white">0.9 µg (45% RDA)</span>
                <span className="text-[10px] text-prana-700 dark:text-prana-400 block">From fresh curd & paneer</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-obsidian-950/60 border border-slate-200 dark:border-white/5">
                <span className="text-[11px] text-slate-600 dark:text-slate-400 block">Potassium</span>
                <span className="text-base font-bold text-slate-900 dark:text-white">620 mg (18% RDA)</span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block">Blood pressure regulator</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-obsidian-950/60 border border-slate-200 dark:border-white/5">
                <span className="text-[11px] text-slate-600 dark:text-slate-400 block">Calcium</span>
                <span className="text-base font-bold text-slate-900 dark:text-white">280 mg (35% RDA)</span>
                <span className="text-[10px] text-cyan-700 dark:text-cyan-400 block">Optimal bone mineral</span>
              </div>
            </div>
          </div>

          {/* 4. "Make This Meal Better" Interactive Section */}
          <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-prana-500/40 space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <div className="flex items-center gap-2 mb-1 text-prana-400 text-xs font-bold uppercase tracking-wider">
                  <Zap className="w-4 h-4" />
                  <span>AI Plate Optimizer</span>
                </div>
                <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                  Make This Meal Better
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  Toggle recommendations to preview the 3D optimized plate in real-time:
                </p>
              </div>

              <button
                onClick={() => setActivePlateMode(activePlateMode === 'before' ? 'after' : 'before')}
                className="px-4 py-2 rounded-full text-xs font-bold bg-prana-500 text-obsidian-950 hover:bg-prana-400 transition-colors shadow-glow-prana"
              >
                {activePlateMode === 'after' ? 'Switch back to Current Plate' : 'Preview 3D Optimized Plate'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Rec 1: Add Curd */}
              <div
                onClick={() => toggleImprovement('addCurd')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  improvements.addCurd
                    ? 'bg-prana-50 border-prana-500/50 text-prana-900 dark:bg-prana-950/30 dark:text-white'
                    : 'bg-white dark:bg-obsidian-950/60 border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-600'
                }`}
              >
                <div>
                  <h5 className="font-bold text-sm">Add 1 bowl of curd</h5>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Adds 5g gut-healthy protein & natural probiotics</p>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${improvements.addCurd ? 'bg-prana-500 border-prana-400 text-obsidian-950' : 'border-slate-600'}`}>
                  {improvements.addCurd && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
              </div>

              {/* Rec 2: Reduce Rice by 25% */}
              <div
                onClick={() => toggleImprovement('reduceRice')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  improvements.reduceRice
                    ? 'bg-prana-50 border-prana-500/50 text-prana-900 dark:bg-prana-950/30 dark:text-white'
                    : 'bg-white dark:bg-obsidian-950/60 border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-600'
                }`}
              >
                <div>
                  <h5 className="font-bold text-sm">Reduce rice by 25%</h5>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Saves ~55 kcal & reduces postprandial glucose spike by 24%</p>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${improvements.reduceRice ? 'bg-prana-500 border-prana-400 text-obsidian-950' : 'border-slate-600'}`}>
                  {improvements.reduceRice && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
              </div>

              {/* Rec 3: Add a vegetable */}
              <div
                onClick={() => toggleImprovement('addVeg')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  improvements.addVeg
                    ? 'bg-prana-50 border-prana-500/50 text-prana-900 dark:bg-prana-950/30 dark:text-white'
                    : 'bg-white dark:bg-obsidian-950/60 border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-600'
                }`}
              >
                <div>
                  <h5 className="font-bold text-sm">Add extra raw salad</h5>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Consuming raw salad before carbs slows digestion rate</p>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${improvements.addVeg ? 'bg-prana-500 border-prana-400 text-obsidian-950' : 'border-slate-600'}`}>
                  {improvements.addVeg && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
              </div>

              {/* Rec 4: Add a protein source */}
              <div
                onClick={() => toggleImprovement('addProtein')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  improvements.addProtein
                    ? 'bg-prana-50 border-prana-500/50 text-prana-900 dark:bg-prana-950/30 dark:text-white'
                    : 'bg-white dark:bg-obsidian-950/60 border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-600'
                }`}
              >
                <div>
                  <h5 className="font-bold text-sm">Add sprouted moong bowl</h5>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Elevates total protein to 44g without saturated fat</p>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${improvements.addProtein ? 'bg-prana-500 border-prana-400 text-obsidian-950' : 'border-slate-600'}`}>
                  {improvements.addProtein && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
              </div>
            </div>
          </div>

          {/* 5. "Ask AI Saathi" Interactive Prompting Section */}
          <div className="glass-panel-surya rounded-3xl p-6 sm:p-8 border border-surya-500/30 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-surya-500 to-amber-600 p-0.5 flex items-center justify-center">
                  <div className="w-full h-full bg-white dark:bg-obsidian-950 rounded-[14px] flex items-center justify-center">
                    <Bot className="w-5 h-5 text-surya-400" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">Ask AI Saathi About This Meal</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Get conversational, culture-aware nutritional guidance</p>
                </div>
              </div>

              <button
                onClick={() => onOpenAICoachWithPrompt && onOpenAICoachWithPrompt('Is this meal balanced?')}
                className="px-4 py-2 rounded-full text-xs font-bold bg-surya-500/20 text-surya-800 dark:text-surya-400 border border-surya-500/40 hover:bg-surya-500 hover:text-obsidian-950 transition-all flex items-center gap-1.5"
              >
                <span>Open Saathi Chat</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {askQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => onOpenAICoachWithPrompt && onOpenAICoachWithPrompt(q)}
                  className="px-4 py-2 rounded-2xl text-xs font-semibold bg-white hover:bg-stone-100 dark:bg-obsidian-950/80 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 hover:border-surya-500/40 transition-all flex items-center gap-2 group active:scale-95 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-surya-500"
                >
                  <span>"{q}"</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 dark:text-slate-500 group-hover:text-surya-700 dark:group-hover:text-surya-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
