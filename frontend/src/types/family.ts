export interface FamilyMember {
  id: string;
  name: string;
  relation: 'Self' | 'Father' | 'Mother' | 'Grandmother' | 'Spouse' | 'Child';
  age: number;
  avatar: string;
  colorScheme: 'emerald' | 'amber' | 'cyan' | 'rose';
  healthConditions: string[];
  vitals: {
    bloodPressure?: string; // e.g. "122/78"
    bpStatus?: 'Normal' | 'Elevated' | 'Attention';
    bloodSugar?: number; // e.g. 110 mg/dL
    sugarType?: 'Fasting' | 'Post-Meal';
    sugarStatus?: 'Normal' | 'Pre-diabetic' | 'High';
    todaySteps: number;
    stepsGoal: number;
    waterIntakeLiters: number;
    medicationsTaken: number;
    totalMedications: number;
    lastChecked: string;
  };
  routineAlert?: string;
  streakDays: number;
}

export interface FamilyHealthAlert {
  id: string;
  memberId: string;
  memberName: string;
  title: string;
  description: string;
  urgency: 'routine' | 'warning' | 'urgent';
  timestamp: string;
  acknowledged: boolean;
}
