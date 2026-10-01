export interface MacroNutrients {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
}

export interface DetectedDishItem {
  name: string;
  hindiName?: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  gheeEstimateTsp: number;
  confidence: number;
  boundingBox?: { x: number; y: number; width: number; height: number };
}

export interface ScannedMealResult {
  id: string;
  dishName: string;
  imageUrl: string;
  cuisineRegion: 'North Indian' | 'South Indian' | 'Maharashtrian' | 'Bengali' | 'Pan-Indian';
  glycemicIndex: 'Low' | 'Moderate' | 'High';
  pranaScore: number; // 1 to 10
  totalMacros: MacroNutrients;
  detectedItems: DetectedDishItem[];
  smartSwaps: string[];
  aiInsight: string;
  ayurvedicNote: string;
}

export interface MealRecommendation {
  id: string;
  title: string;
  mealType: 'Breakfast' | 'Lunch' | 'Evening Snack' | 'Dinner';
  category: 'High Protein Veg' | 'Diabetic Friendly' | 'Desi Cut' | 'Ayurvedic Sattvic';
  prepTimeMinutes: number;
  macros: MacroNutrients;
  ingredients: string[];
  healthBenefit: string;
  image: string;
}
