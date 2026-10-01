export interface DailyMetrics {
  steps: number;
  stepsGoal: number;
  caloriesBurned: number;
  caloriesGoal: number;
  activeMinutes: number;
  activeMinutesGoal: number;
  heartRate: number;
  heartRateRecoveryBpm: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  bloodSugarFasting: number;
  postMealGlycemicLoad: number;
  mobilityScore: number;
  deepSleepMinutes: number;
  sleepLatencyMinutes: number;
  hrvMs: number;
  waterLiters: number;
  waterGoalLiters: number;
  sleepHours: number;
  sleepMinutes: number;
  proteinGrams: number;
  proteinGoalGrams: number;
  dailyScore: number;
  streakDays: number;
}

export interface WorkoutSession {
  id: string;
  title: string;
  category: 'Yoga & Pranayama' | 'Ghar Akhada' | 'Terrace / Park Walk' | 'Gym Strength' | 'Ayurvedic Mobility';
  durationMinutes: number;
  calories: number;
  intensity: 'Gentle' | 'Moderate' | 'Intense';
  completed: boolean;
  timeOfDay: string;
  icon: string;
  description: string;
}

export interface WeeklyStepDay {
  day: string;
  steps: number;
  goal: number;
  caloriesBurned: number;
  activeMinutes: number;
  isPeak: boolean;
}
