import React, { useState } from 'react';
import type { DailyMetrics } from '../../types/fitness';
import { BodyVitals3D } from '../3d/BodyVitals3D';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Activity, ShieldCheck, Flame, Moon, Sparkles, ChevronRight, Zap } from 'lucide-react';

interface VitalsDetail {
  id: string;
  title: string;
  sanskrit: string;
  status: string;
  score: string;
  tagColor: string;
  summary: string;
  metrics: { label: string; val: string; optimal: string }[];
  indianHealthInsight: string;
  actionRecommendation: string;
}

const VITALS_DATA: Record<string, VitalsDetail> = {
  cardiac: {
    id: 'cardiac',
    title: 'Cardiac & Vascular Health',
    sanskrit: 'Anahata Chakra • हृदय स्वास्थ्य',
    status: 'No data yet',
    score: '0 / 100',
    tagColor: 'text-slate-500 bg-slate-500/10 border-slate-500/30',
    summary: 'Cardiac readings recorded to your account.',
    metrics: [
      { label: 'Resting Heart Rate', val: '0 bpm', optimal: 'Not set' },
      { label: 'Blood Pressure', val: '0/0 mmHg', optimal: 'Not set' },
      { label: 'Heart Rate Recovery (1m)', val: '0 bpm', optimal: 'Not set' },
    ],
    indianHealthInsight:
      'No cardiac readings are recorded for this account yet.',
    actionRecommendation: 'Record a measurement or connect a supported device to populate this section.',
  },
  metabolic: {
    id: 'metabolic',
    title: 'Metabolic & Glycemic Engine',
    sanskrit: 'Manipura Agni • पाचन एवं चयापचय',
    status: 'No data yet',
    score: '0 / 100',
    tagColor: 'text-slate-500 bg-slate-500/10 border-slate-500/30',
    summary: 'Glucose and nutrition readings recorded to your account.',
    metrics: [
      { label: 'Fasting Glucose', val: '0 mg/dL', optimal: 'Not set' },
      { label: 'Post-Meal Glycemic Load', val: '0', optimal: 'Not set' },
      { label: 'Protein Logged', val: '0 g', optimal: 'No data yet' },
    ],
    indianHealthInsight:
      'No glucose or meal readings are recorded for this account yet.',
    actionRecommendation: 'Save a meal or record a measurement to populate this section.',
  },
  joints: {
    id: 'joints',
    title: 'Joints & Postural Mobility',
    sanskrit: 'Sandhi-Chalan • अस्थि एवं गतिशीलता',
    status: 'No data yet',
    score: '0 / 100',
    tagColor: 'text-slate-500 bg-slate-500/10 border-slate-500/30',
    summary: 'Mobility and activity readings recorded to your account.',
    metrics: [
      { label: 'Floor-to-Stand Mobility', val: '0 / 10', optimal: 'Not recorded' },
      { label: 'Steps Today', val: '0', optimal: 'No data yet' },
      { label: 'Active Minutes', val: '0', optimal: 'No data yet' },
    ],
    indianHealthInsight:
      'No mobility assessment is recorded for this account yet.',
    actionRecommendation: 'Record a mobility assessment to populate this section.',
  },
  mind: {
    id: 'mind',
    title: 'Mind, Sleep & Nervous System',
    sanskrit: 'Ajna & Sahasrara • निद्रा एवं मानसिक शांति',
    status: 'No data yet',
    score: '0 / 100',
    tagColor: 'text-slate-500 bg-slate-500/10 border-slate-500/30',
    summary: 'Sleep and recovery readings recorded to your account.',
    metrics: [
      { label: 'Deep Sleep', val: '0 min', optimal: 'Not recorded' },
      { label: 'Sleep Latency', val: '0 min', optimal: 'Not recorded' },
      { label: 'HRV (Heart Rate Variability)', val: '0 ms', optimal: 'Not recorded' },
    ],
    indianHealthInsight:
      'No sleep or recovery readings are recorded for this account yet.',
    actionRecommendation: 'Record sleep or recovery data to populate this section.',
  },
};

export const HealthConnected: React.FC<{ metrics: DailyMetrics; onExploreFeature: (feature: string) => void }> = ({
  metrics,
  onExploreFeature,
}) => {
  const [activeTab, setActiveTab] = useState<string>('cardiac');
  const baseDetail = VITALS_DATA[activeTab] || VITALS_DATA.cardiac;
  const readingsByTab: Record<string, { values: string[]; hasData: boolean }> = {
    cardiac: {
      values: [
        `${metrics.heartRate} bpm`,
        `${metrics.bloodPressureSystolic}/${metrics.bloodPressureDiastolic} mmHg`,
        `${metrics.heartRateRecoveryBpm} bpm`,
      ],
      hasData: Boolean(metrics.heartRate || metrics.bloodPressureSystolic || metrics.bloodPressureDiastolic || metrics.heartRateRecoveryBpm),
    },
    metabolic: {
      values: [`${metrics.bloodSugarFasting} mg/dL`, `${metrics.postMealGlycemicLoad}`, `${metrics.proteinGrams} g`],
      hasData: Boolean(metrics.bloodSugarFasting || metrics.postMealGlycemicLoad || metrics.proteinGrams),
    },
    joints: {
      values: [`${metrics.mobilityScore} / 10`, `${metrics.steps}`, `${metrics.activeMinutes}`],
      hasData: Boolean(metrics.mobilityScore || metrics.steps || metrics.activeMinutes),
    },
    mind: {
      values: [`${metrics.deepSleepMinutes} min`, `${metrics.sleepLatencyMinutes} min`, `${metrics.hrvMs} ms`],
      hasData: Boolean(metrics.deepSleepMinutes || metrics.sleepLatencyMinutes || metrics.hrvMs),
    },
  };
  const tabReadings = readingsByTab[activeTab];
  const currentDetail = {
    ...baseDetail,
    status: tabReadings.hasData ? 'Readings recorded' : 'No data yet',
    score: `${metrics.dailyScore} / 100`,
    summary: tabReadings.hasData ? 'Values shown are readings saved to your account.' : 'No readings have been recorded for this category.',
    metrics: baseDetail.metrics.map((metric, index) => ({ ...metric, val: tabReadings.values[index] ?? '0' })),
    indianHealthInsight: tabReadings.hasData ? 'These are user-recorded values and are not a medical assessment.' : 'No personal health context is recorded yet.',
    actionRecommendation: 'Record a measurement or connect a supported device to populate this section.',
  };

  return (
    <section className="relative py-24 bg-slate-100/70 dark:bg-obsidian-900/60 border-y border-slate-200 dark:border-white/5 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 -left-48 w-96 h-96 bg-prana-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-surya-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-xs font-semibold text-prana-600 dark:text-prana-400 mb-4 shadow-sm">
            <Activity className="w-3.5 h-3.5" />
            <span>Interactive 3D Health Visualizer</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
            Your Health, <span className="text-gradient-prana">Connected in 3D.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Click any physiological node to inspect vital biomarkers synthesized from your daily activity, Indian nutrition intake, and sleep telemetry.
          </p>
        </div>

        {/* 3D Visualizer & Details Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* 3D Canvas Column */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-4 sm:p-6 border border-slate-200 dark:border-white/10 relative overflow-hidden group">
            <div className="absolute top-4 left-6 z-20 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-prana-400 animate-ping" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Live Holographic Projection
              </span>
            </div>

            <div className="absolute bottom-4 left-6 z-20 text-[11px] text-slate-600 dark:text-slate-400 bg-white/80 dark:bg-obsidian-950/70 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/5 backdrop-blur-md">
              Rotate & inspect active bio-nodes
            </div>

            <BodyVitals3D activeId={activeTab} onSelectHotspot={(id) => setActiveTab(id)} />

            {/* Selector Pills at bottom */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 pt-4 border-t border-slate-200 dark:border-white/10 relative z-20">
              {Object.values(VITALS_DATA).map((item) => {
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-medium transition-all text-center border truncate ${
                      isSelected
                        ? 'bg-prana-500/20 text-prana-700 dark:text-prana-300 border-prana-500/50 shadow-glow-prana'
                        : 'bg-white/80 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/5 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {item.title.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details Column */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentDetail.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-xl flex flex-col gap-5"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-semibold tracking-wider text-prana-600 dark:text-prana-400 block mb-1">
                      {currentDetail.sanskrit}
                    </span>
                    <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
                      {currentDetail.title}
                    </h3>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${currentDetail.tagColor}`}>
                    {currentDetail.status}
                  </span>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {currentDetail.summary}
                </p>

                {/* Key Metrics Grid */}
                <div className="space-y-2.5 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Key Biomarkers
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {currentDetail.metrics.map((m, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-obsidian-950/60 border border-slate-200 dark:border-white/5"
                      >
                        <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">{m.label}</span>
                        <div className="text-right">
                          <span className="text-sm font-bold text-slate-900 dark:text-white block">{m.val}</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">Target: {m.optimal}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Indian Context Highlight */}
                <div className="p-3.5 rounded-xl bg-surya-500/10 border border-surya-500/20 text-xs">
                  <div className="flex items-center gap-1.5 text-surya-700 dark:text-surya-400 font-bold mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>India-Specific Health Context</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {currentDetail.indianHealthInsight}
                  </p>
                </div>

                {/* Recommendation */}
                <div className="p-3.5 rounded-xl bg-prana-500/10 border border-prana-500/20 text-xs">
                  <div className="flex items-center gap-1.5 text-prana-700 dark:text-prana-400 font-bold mb-1">
                    <Zap className="w-3.5 h-3.5" />
                    <span>FitIshh Action Plan</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {currentDetail.actionRecommendation}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
