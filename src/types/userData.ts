import type { FamilyMember } from './family';
import type { DailyMetrics, WeeklyStepDay, WorkoutSession } from './fitness';

export interface UserData {
  metrics: DailyMetrics;
  workouts: WorkoutSession[];
  weeklySteps: WeeklyStepDay[];
  familyMembers: FamilyMember[];
}