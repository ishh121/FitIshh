import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Footprints, Flame, Heart, Droplets, Moon, Beef, Activity } from 'lucide-react';
import type { DailyMetrics } from '../../types/fitness';

interface FloatingMetricsProps {
  mousePos: { x: number; y: number };
  metrics: DailyMetrics;
  onSelectMetric?: (metric: string) => void;
}

interface MetricNode {
  id: string;
  name: string;
  val: string;
  sub: string;
  badge: string;
  basePos: [number, number, number];
  color: string;
  icon: React.ReactNode;
  speed: number;
  offset: number;
}

export const FloatingMetrics: React.FC<FloatingMetricsProps> = ({ mousePos, metrics: accountMetrics, onSelectMetric }) => {
  const groupRef = useRef<THREE.Group>(null);

  const metrics: MetricNode[] = [
    {
      id: 'steps',
      name: 'Daily Steps',
      val: accountMetrics.steps.toLocaleString(),
      sub: 'Goal: 10k steps',
      badge: `${Math.round((accountMetrics.steps / accountMetrics.stepsGoal) * 100)}%`,
      basePos: [-2.6, 1.4, 0.4],
      color: 'border-prana-500/40 text-prana-400',
      icon: <Footprints className="w-4 h-4 text-prana-400" />,
      speed: 1.1,
      offset: 0,
    },
    {
      id: 'calories',
      name: 'Calorie Burn',
      val: `${accountMetrics.caloriesBurned} kcal`,
      sub: accountMetrics.caloriesBurned ? 'Activity logged' : 'No activity logged',
      badge: accountMetrics.caloriesBurned ? 'Logged' : 'No data',
      basePos: [2.6, 1.3, 0.2],
      color: 'border-surya-500/40 text-surya-400',
      icon: <Flame className="w-4 h-4 text-surya-400" />,
      speed: 1.3,
      offset: 1.5,
    },
    {
      id: 'heart',
      name: 'Resting Heart Rate',
      val: `${accountMetrics.heartRate} bpm`,
      sub: accountMetrics.heartRate ? 'Reading recorded' : 'No reading recorded',
      badge: accountMetrics.heartRate ? 'Logged' : 'No data',
      basePos: [-2.5, 0.1, 0.5],
      color: 'border-rose-500/40 text-rose-400',
      icon: <Heart className="w-4 h-4 text-rose-400 animate-pulse" />,
      speed: 1.2,
      offset: 2.7,
    },
    {
      id: 'water',
      name: 'Hydration',
      val: `${accountMetrics.waterLiters} L`,
      sub: 'Target: 3.5 Liters',
      badge: `${Math.round((accountMetrics.waterLiters / accountMetrics.waterGoalLiters) * 100)}%`,
      basePos: [2.5, -0.1, 0.6],
      color: 'border-cyan-500/40 text-cyan-400',
      icon: <Droplets className="w-4 h-4 text-cyan-400" />,
      speed: 1.0,
      offset: 3.8,
    },
    {
      id: 'sleep',
      name: 'Sleep Quality',
      val: `${accountMetrics.sleepHours}h ${accountMetrics.sleepMinutes}m`,
      sub: accountMetrics.sleepHours || accountMetrics.sleepMinutes ? 'Sleep duration recorded' : 'No sleep recorded',
      badge: accountMetrics.sleepHours || accountMetrics.sleepMinutes ? 'Logged' : 'No data',
      basePos: [-2.4, -1.3, 0.3],
      color: 'border-indigo-500/40 text-indigo-400',
      icon: <Moon className="w-4 h-4 text-indigo-400" />,
      speed: 1.25,
      offset: 4.5,
    },
    {
      id: 'protein',
      name: 'Desi Protein',
      val: `${accountMetrics.proteinGrams}g / ${accountMetrics.proteinGoalGrams}g`,
      sub: accountMetrics.proteinGrams ? 'Nutrition logged' : 'No nutrition logged',
      badge: `${Math.round((accountMetrics.proteinGrams / accountMetrics.proteinGoalGrams) * 100)}%`,
      basePos: [2.4, -1.3, 0.4],
      color: 'border-amber-500/40 text-amber-400',
      icon: <Beef className="w-4 h-4 text-amber-400" />,
      speed: 1.15,
      offset: 5.2,
    },
    {
      id: 'activity',
      name: 'Daily Activity Index',
      val: `${accountMetrics.dailyScore} / 100`,
      sub: accountMetrics.dailyScore ? 'Goal progress score' : 'No activity score yet',
      badge: accountMetrics.dailyScore ? 'Calculated' : 'No data',
      basePos: [0, -0.95, 0.8],
      color: 'border-emerald-500/40 text-emerald-400',
      icon: <Activity className="w-4 h-4 text-emerald-400" />,
      speed: 0.9,
      offset: 0.8,
    },
  ];

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();

    // Mouse parallax for the entire floating ring
    const targetX = mousePos.x * 0.25;
    const targetY = -mousePos.y * 0.2;
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.05);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.05);

    // Subtle breathing/floating for individual children
    groupRef.current.children.forEach((child, i) => {
      const metric = metrics[i];
      if (metric) {
        const floatY = Math.sin(time * metric.speed + metric.offset) * 0.08;
        const floatX = Math.cos(time * (metric.speed * 0.8) + metric.offset) * 0.04;
        child.position.y = metric.basePos[1] + floatY;
        child.position.x = metric.basePos[0] + floatX;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {metrics.map((m) => (
        <group key={m.id} position={m.basePos}>
          <Html center distanceFactor={7.5} zIndexRange={[100, 0]}>
            <div
              onClick={() => onSelectMetric && onSelectMetric(m.id)}
              className={`select-none cursor-pointer group transition-all duration-300 transform hover:scale-105 active:scale-95`}
              style={{ width: '180px' }}
            >
              <div
                className={`p-3 rounded-xl glass-panel border ${m.color} shadow-lg backdrop-blur-md transition-all duration-300 group-hover:bg-slate-100 dark:group-hover:bg-slate-900/90 group-hover:border-opacity-80 group-hover:shadow-glow-prana`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="p-1 rounded-md bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50">
                      {m.icon}
                    </span>
                    <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">{m.name}</span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60">
                    {m.badge}
                  </span>
                </div>

                <div className="text-base font-bold tracking-tight text-slate-900 dark:text-white flex items-baseline justify-between">
                  <span>{m.val}</span>
                </div>

                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
                  {m.sub}
                </div>
              </div>
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
};
