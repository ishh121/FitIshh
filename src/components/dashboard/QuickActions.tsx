import React, { useState } from 'react';
import { Camera, Utensils, Dumbbell, Droplets, Users, ArrowUpRight, Sparkles, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface QuickActionsProps {
  onScanMeal: () => void;
  onSuggestMeal: () => void;
  onLogWorkout: () => void;
  onAddWater: () => void;
  onViewFamily: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onScanMeal,
  onSuggestMeal,
  onLogWorkout,
  onAddWater,
  onViewFamily,
}) => {
  const [justAddedWater, setJustAddedWater] = useState(false);
  const [justLoggedWorkout, setJustLoggedWorkout] = useState(false);

  const handleWaterClick = () => {
    onAddWater();
    setJustAddedWater(true);
    setTimeout(() => setJustAddedWater(false), 1200);
  };

  const handleWorkoutClick = () => {
    onLogWorkout();
    setJustLoggedWorkout(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#F59E0B', '#10B981'],
    });
    setTimeout(() => setJustLoggedWorkout(false), 1500);
  };

  const actionCards = [
    {
      id: 'scan',
      title: 'Scan a Meal',
      sanskrit: 'आहार दृष्टि',
      desc: 'Instant AI plate recognition, ghee & macro estimator',
      icon: Camera,
      color: 'from-emerald-500/20 via-prana-500/10 to-transparent',
      borderColor: 'border-prana-500/40 hover:border-prana-400',
      iconColor: 'text-prana-700 dark:text-prana-400 bg-prana-500/20',
      onClick: onScanMeal,
    },
    {
      id: 'suggest',
      title: 'Suggest My Meal',
      sanskrit: 'स्मार्ट आहार',
      desc: 'High-protein vegetarian & diabetic-safe recipes',
      icon: Utensils,
      color: 'from-amber-500/20 via-surya-500/10 to-transparent',
      borderColor: 'border-surya-500/40 hover:border-surya-400',
      iconColor: 'text-surya-700 dark:text-surya-400 bg-surya-500/20',
      onClick: onSuggestMeal,
    },
    {
      id: 'workout',
      title: justLoggedWorkout ? 'Workout Logged ✓' : 'Log Workout',
      sanskrit: 'व्यायाम',
      desc: 'Surya Namaskar, Akhada circuits or evening walks',
      icon: Dumbbell,
      color: 'from-orange-500/20 via-amber-500/10 to-transparent',
      borderColor: 'border-orange-500/40 hover:border-orange-400',
      iconColor: 'text-orange-700 dark:text-orange-400 bg-orange-500/20',
      onClick: handleWorkoutClick,
    },
    {
      id: 'water',
      title: justAddedWater ? '+250ml Added ✓' : 'Add Water',
      sanskrit: 'जल सेवन',
      desc: 'Quick one-tap hydration tracker (+250ml)',
      icon: Droplets,
      color: 'from-cyan-500/20 via-blue-500/10 to-transparent',
      borderColor: 'border-cyan-500/40 hover:border-cyan-400',
      iconColor: 'text-cyan-700 dark:text-cyan-400 bg-cyan-500/20',
      onClick: handleWaterClick,
    },
    {
      id: 'family',
      title: 'View Family',
      sanskrit: 'परिवार आरोग्य',
      desc: "Check Papa's glucose, Daadi's BP & SOS alerts",
      icon: Users,
      color: 'from-rose-500/20 via-pink-500/10 to-transparent',
      borderColor: 'border-rose-500/40 hover:border-rose-400',
      iconColor: 'text-rose-700 dark:text-rose-400 bg-rose-500/20',
      onClick: onViewFamily,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-prana-700 dark:text-prana-400" />
          <span>Quick Actions</span>
        </h3>
        <span className="text-xs text-slate-600 dark:text-slate-500">Interactive 3D Touchpoints</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {actionCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.button
              type="button"
              key={card.id}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              onClick={card.onClick}
              className={`w-full text-left p-5 rounded-3xl glass-panel bg-gradient-to-b ${card.color} border ${card.borderColor} shadow-lg cursor-pointer flex flex-col justify-between group relative overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-prana-500`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-2xl ${card.iconColor} border border-slate-200 dark:border-white/10 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="p-1.5 rounded-full bg-slate-100 group-hover:bg-slate-200 dark:bg-white/5 dark:group-hover:bg-white/10 text-slate-600 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-white transition-colors">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <div>
                <div className="flex items-baseline justify-between mb-1">
                  <h4 className="font-display font-bold text-slate-900 dark:text-white text-base group-hover:text-prana-700 dark:group-hover:text-prana-300 transition-colors">
                    {card.title}
                  </h4>
                </div>
                <span className="text-[10px] text-slate-600 dark:text-slate-500 font-medium block mb-1">
                  {card.sanskrit}
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
