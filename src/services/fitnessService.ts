import type { DailyMetrics, WorkoutSession, WeeklyStepDay } from '../types/fitness';

export const INITIAL_METRICS: DailyMetrics = {
  steps: 0,
  stepsGoal: 10000,
  caloriesBurned: 0,
  caloriesGoal: 2200,
  activeMinutes: 0,
  activeMinutesGoal: 60,
  heartRate: 0,
  heartRateRecoveryBpm: 0,
  bloodPressureSystolic: 0,
  bloodPressureDiastolic: 0,
  bloodSugarFasting: 0,
  postMealGlycemicLoad: 0,
  mobilityScore: 0,
  deepSleepMinutes: 0,
  sleepLatencyMinutes: 0,
  hrvMs: 0,
  waterLiters: 0,
  waterGoalLiters: 3.5,
  sleepHours: 0,
  sleepMinutes: 0,
  proteinGrams: 0,
  proteinGoalGrams: 85,
  dailyScore: 0,
  streakDays: 0,
};

export const EMPTY_WORKOUTS: WorkoutSession[] = [];

export const EMPTY_WEEKLY_STEPS: WeeklyStepDay[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => ({
  day,
  steps: 0,
  goal: INITIAL_METRICS.stepsGoal,
  caloriesBurned: 0,
  activeMinutes: 0,
  isPeak: false,
}));

export const fitnessService = {
  emptyMetrics: () => ({ ...INITIAL_METRICS }),
  emptyWorkouts: () => [],
  emptyWeeklySteps: () => EMPTY_WEEKLY_STEPS.map((day) => ({ ...day })),
};
