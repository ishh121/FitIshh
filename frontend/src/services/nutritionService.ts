import type { ScannedMealResult, MealRecommendation } from '../types/nutrition';

export const SAMPLE_INDIAN_DISHES: ScannedMealResult[] = [
  {
    id: 'dish-thali',
    dishName: 'Ghar Ki Thali (Roti, Dal, Paneer & Salad)',
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    cuisineRegion: 'North Indian',
    glycemicIndex: 'Moderate',
    pranaScore: 8.8,
    totalMacros: {
      calories: 540,
      protein: 24,
      carbs: 62,
      fats: 22,
      fiber: 9
    },
    detectedItems: [
      {
        name: 'Whole Wheat Phulkas (2 pcs)',
        hindiName: 'घर की रोटी',
        quantity: '2 medium (70g)',
        calories: 160,
        protein: 6,
        carbs: 32,
        fats: 1.5,
        gheeEstimateTsp: 0.5,
        confidence: 0.98,
        boundingBox: { x: 15, y: 30, width: 35, height: 35 }
      },
      {
        name: 'Moong-Arhar Dal Tadka',
        hindiName: 'दाल तड़का',
        quantity: '1 katori (150g)',
        calories: 140,
        protein: 8,
        carbs: 18,
        fats: 4,
        gheeEstimateTsp: 1,
        confidence: 0.96,
        boundingBox: { x: 55, y: 20, width: 30, height: 30 }
      },
      {
        name: 'Paneer Bhurji with Bell Peppers',
        hindiName: 'पनीर भुर्जी',
        quantity: '1 cup (120g)',
        calories: 210,
        protein: 10,
        carbs: 6,
        fats: 16,
        gheeEstimateTsp: 1.2,
        confidence: 0.94,
        boundingBox: { x: 45, y: 55, width: 35, height: 35 }
      },
      {
        name: 'Cucumber, Onion & Lemon Salad',
        hindiName: 'कच्चा सलाद',
        quantity: '1 bowl (80g)',
        calories: 30,
        protein: 0.8,
        carbs: 6,
        fats: 0.2,
        gheeEstimateTsp: 0,
        confidence: 0.99,
        boundingBox: { x: 15, y: 68, width: 25, height: 25 }
      }
    ],
    smartSwaps: [
      'Ghee Moderation: You used ~2.7 tsp ghee (~120 kcal). Using 1.5 tsp saves 55 calories with zero loss in taste.',
      'Protein Booster: Add 30g roasted kala chana or boiled sprouts to reach 30g+ protein target for this meal.',
      'Glycemic Control: Eating the salad 5 minutes before the phulkas reduces the glucose peak by up to 28%.'
    ],
    aiInsight: 'Well-balanced wholesome lunch with complete amino acids from the wheat-dal pairing. Low glycemic impact thanks to high dietary fiber in the salad.',
    ayurvedicNote: 'Tridoshic balancing meal. Cumin & asafoetida in the dal tadka aids in Agni (digestive fire) and prevents vata bloating.'
  },
  {
    id: 'dish-south-indian',
    dishName: 'Traditional Steamed Idli, Drumstick Sambar & Chutney',
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    cuisineRegion: 'South Indian',
    glycemicIndex: 'Moderate',
    pranaScore: 9.1,
    totalMacros: {
      calories: 410,
      protein: 14,
      carbs: 68,
      fats: 9,
      fiber: 8
    },
    detectedItems: [
      {
        name: 'Steamed Fermented Idli (3 pcs)',
        hindiName: 'इडली',
        quantity: '3 standard (150g)',
        calories: 195,
        protein: 6,
        carbs: 42,
        fats: 0.6,
        gheeEstimateTsp: 0,
        confidence: 0.99,
        boundingBox: { x: 25, y: 25, width: 45, height: 45 }
      },
      {
        name: 'Drumstick & Vegetable Sambar',
        hindiName: 'सांभर',
        quantity: '1 large bowl (200ml)',
        calories: 130,
        protein: 6.5,
        carbs: 20,
        fats: 2.5,
        gheeEstimateTsp: 0.2,
        confidence: 0.97,
        boundingBox: { x: 60, y: 45, width: 35, height: 35 }
      },
      {
        name: 'Fresh Roasted Coconut Chutney',
        hindiName: 'नारियल चटनी',
        quantity: '2 tbsp (35g)',
        calories: 85,
        protein: 1.5,
        carbs: 6,
        fats: 6,
        gheeEstimateTsp: 0,
        confidence: 0.95,
        boundingBox: { x: 15, y: 65, width: 25, height: 25 }
      }
    ],
    smartSwaps: [
      'Protein Upgrade: Swap 1 regular idli for a sprouted Moong Idli or add a small bowl of steamed sundal for +8g clean protein.',
      'Portion Coconut: Coconut chutney carries healthy MCT fats; keep it to 2 tablespoons to stay within target fat macros.'
    ],
    aiInsight: 'Naturally fermented food rich in bio-available B vitamins and gut-friendly probiotics. Very easy to digest post-morning workout.',
    ayurvedicNote: 'Cooling Pitta-pacifying breakfast. Fermentation enhances Prana without aggravating Kapha when paired with warm pepper-infused sambar.'
  },
  {
    id: 'dish-paneer-bhurji-toast',
    dishName: 'High Protein Paneer Bhurji on Sourdough / Multigrain',
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
    cuisineRegion: 'Pan-Indian',
    glycemicIndex: 'Low',
    pranaScore: 9.4,
    totalMacros: {
      calories: 460,
      protein: 29,
      carbs: 38,
      fats: 21,
      fiber: 7
    },
    detectedItems: [
      {
        name: 'Spiced Desi Paneer Bhurji',
        hindiName: 'मसाला पनीर भुर्जी',
        quantity: '150g fresh low-fat paneer',
        calories: 290,
        protein: 24,
        carbs: 8,
        fats: 18,
        gheeEstimateTsp: 0.8,
        confidence: 0.97,
        boundingBox: { x: 30, y: 30, width: 45, height: 45 }
      },
      {
        name: 'Toasted Multigrain / Sourdough Slice',
        hindiName: 'मल्टीग्रेन टोस्ट',
        quantity: '2 slices (60g)',
        calories: 150,
        protein: 5,
        carbs: 28,
        fats: 2,
        gheeEstimateTsp: 0,
        confidence: 0.96,
        boundingBox: { x: 10, y: 40, width: 35, height: 35 }
      },
      {
        name: 'Mint-Coriander Green Chutney',
        hindiName: 'हरी चटनी',
        quantity: '1.5 tbsp (25g)',
        calories: 20,
        protein: 0.5,
        carbs: 2,
        fats: 0.8,
        gheeEstimateTsp: 0,
        confidence: 0.94,
        boundingBox: { x: 65, y: 65, width: 20, height: 20 }
      }
    ],
    smartSwaps: [
      'Calorie Optimizer: Use low-fat cottage paneer or half paneer + half crumbled tofu to reach 34g protein with only 390 calories.',
      'Desi Superfood: Squeeze fresh amla (Indian gooseberry) or lemon for Vitamin C to amplify non-heme iron absorption.'
    ],
    aiInsight: 'Ideal post-workout recovery breakfast. Fast protein synthesis without triggering insulin spikes.',
    ayurvedicNote: 'Fresh homemade chenna/paneer is sattvic and builds Ojas (vital vigor) when consumed during daylight hours.'
  },
  {
    id: 'dish-biryani',
    dishName: 'Hyderabadi Dum Biryani with Cucumber Raita',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    cuisineRegion: 'Pan-Indian',
    glycemicIndex: 'Moderate',
    pranaScore: 7.9,
    totalMacros: {
      calories: 630,
      protein: 34,
      carbs: 72,
      fats: 24,
      fiber: 5
    },
    detectedItems: [
      {
        name: 'Aromatic Dum Basmati Rice',
        hindiName: 'दम बासमती चावल',
        quantity: '1.5 cups cooked (220g)',
        calories: 290,
        protein: 5,
        carbs: 62,
        fats: 3,
        gheeEstimateTsp: 1.5,
        confidence: 0.98,
        boundingBox: { x: 25, y: 25, width: 55, height: 50 }
      },
      {
        name: 'Marinated Tender Chicken / Soya Chunks',
        hindiName: 'मसाला चिकन / सोया',
        quantity: '140g',
        calories: 230,
        protein: 26,
        carbs: 4,
        fats: 12,
        gheeEstimateTsp: 1,
        confidence: 0.95,
        boundingBox: { x: 40, y: 35, width: 30, height: 30 }
      },
      {
        name: 'Roasted Cumin Cucumber Curd Raita',
        hindiName: 'खीरा रायता',
        quantity: '1 katori (120g)',
        calories: 110,
        protein: 3,
        carbs: 6,
        fats: 8,
        gheeEstimateTsp: 0,
        confidence: 0.97,
        boundingBox: { x: 65, y: 55, width: 25, height: 25 }
      }
    ],
    smartSwaps: [
      'Smart Pairing: Doubling the curd raita and eating 1 bowl of raw sliced cucumbers beforehand slows carb absorption by 35%.',
      'Portion Control: Enjoying 80% rice and 120% protein pieces optimizes body recomposition while keeping full celebratory flavor.'
    ],
    aiInsight: 'Rich in lean protein and aromatic spices (cinnamon, star anise, cardamom) that activate salivary amylase.',
    ayurvedicNote: 'Heavier to digest; best enjoyed as midday lunch rather than late dinner to allow natural agni breakdown.'
  }
];

export const SMART_RECOMMENDATIONS: MealRecommendation[] = [
  {
    id: 'rec-1',
    title: 'Sprouted Moong & Paneer Tikka Chaat',
    mealType: 'Evening Snack',
    category: 'High Protein Veg',
    prepTimeMinutes: 12,
    macros: { calories: 290, protein: 22, carbs: 24, fats: 10, fiber: 7 },
    ingredients: ['Sprouted green moong', 'Air-fried paneer cubes', 'Pomegranate seeds', 'Chaat masala & lemon', 'Mint chutney'],
    healthBenefit: 'Zero refined flour, satisfies 4 PM Indian snack cravings without the samosa oil crash.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'rec-2',
    title: 'Foxtail Millet (Kangni) Khichdi with Ghee Tempering',
    mealType: 'Dinner',
    category: 'Diabetic Friendly',
    prepTimeMinutes: 20,
    macros: { calories: 340, protein: 14, carbs: 48, fats: 8, fiber: 11 },
    ingredients: ['Foxtail millet', 'Yellow moong dal', 'Spinach & carrots', 'Hing & jeera tadka', 'Desi A2 cow ghee (1 tsp)'],
    healthBenefit: 'Extremely low glycemic index (GI 54); prevents midnight glucose fluctuations for parents.',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'rec-3',
    title: 'Sattu Protein Lassi & Roasted Makhana',
    mealType: 'Breakfast',
    category: 'Desi Cut',
    prepTimeMinutes: 5,
    macros: { calories: 320, protein: 21, carbs: 36, fats: 7, fiber: 9 },
    ingredients: ['Chana Sattu (40g)', 'Cold spiced buttermilk', 'Roasted foxnuts (makhana)', 'Black salt & mint'],
    healthBenefit: 'The authentic Indian superfood drink: sustained gut energy, cooling effect, zero whey additives.',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=400&q=80'
  }
];

export const nutritionService = {
  async scanMealSimulation(dishIndex = 0): Promise<ScannedMealResult> {
    await new Promise((r) => setTimeout(r, 650));
    const index = dishIndex % SAMPLE_INDIAN_DISHES.length;
    return SAMPLE_INDIAN_DISHES[index];
  },

  async getRecommendations(): Promise<MealRecommendation[]> {
    await new Promise((r) => setTimeout(r, 100));
    return [...SMART_RECOMMENDATIONS];
  }
};
