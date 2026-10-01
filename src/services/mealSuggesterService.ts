export interface UserMealPreferences {
  goal: 'Lose weight' | 'Gain muscle' | 'Maintain weight' | 'Improve fitness' | 'General wellness';
  diet: 'Vegetarian' | 'Non-vegetarian' | 'Eggetarian' | 'Vegan';
  cuisine:
    | 'South Indian'
    | 'North Indian'
    | 'Andhra'
    | 'Telangana'
    | 'Bengali'
    | 'Punjabi'
    | 'Gujarati'
    | 'Kerala'
    | 'Maharashtrian'
    | 'Mixed Indian';
  mealType: 'Breakfast' | 'Lunch' | 'Snack' | 'Dinner';
  budget: 'Budget-friendly' | 'Moderate' | 'Flexible';
  availableIngredients: string[];
  allergies: string[];
  time: 'Under 15 min' | '15–30 min' | '30–60 min';
}

export interface SuggestedMeal {
  id: string;
  name: string;
  hindiName: string;
  cuisine: string;
  mealType: string;
  image: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  prepTime: string;
  costEstimate: string;
  difficulty: 'Easy' | 'Quick' | 'Intermediate';
  ingredients: string[];
  whyThisMeal: string;
  dietTags: string[];
}

export const INDIAN_MEAL_DATABASE: SuggestedMeal[] = [
  {
    id: 'sug-1',
    name: 'High Protein Paneer Bowl',
    hindiName: 'प्रोटीन पनीर बाउल',
    cuisine: 'North Indian',
    mealType: 'Lunch',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    calories: 420,
    protein: 28,
    carbs: 32,
    fats: 18,
    fiber: 8,
    prepTime: '20 mins',
    costEstimate: '₹85 / serving',
    difficulty: 'Easy',
    ingredients: ['Low-fat Paneer (150g)', 'Sprouted Moong', 'Charred Capsicum & Corn', 'Jeera Tadka', 'Mint Chutney'],
    whyThisMeal:
      'Provides a massive 28g of bioavailable vegetarian protein while keeping carbohydrates low-glycemic through sprouted moong and fresh vegetables. Perfect for lean muscle repair without a post-lunch sugar crash.',
    dietTags: ['Vegetarian', 'High Protein', 'Gluten Free']
  },
  {
    id: 'sug-2',
    name: 'Moong Dal Chilla with Mint Dahi',
    hindiName: 'मूंग दाल चिल्ला',
    cuisine: 'North Indian',
    mealType: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    calories: 310,
    protein: 18,
    carbs: 38,
    fats: 8,
    fiber: 9,
    prepTime: '15 mins',
    costEstimate: '₹45 / serving',
    difficulty: 'Quick',
    ingredients: ['Yellow Moong Dal batter', 'Finely chopped spinach & onions', 'Green chillies & ginger', '1 bowl fresh curd', 'Hing'],
    whyThisMeal:
      'A time-tested North Indian morning classic. Naturally fermented dal provides sustained gastric release, high dietary fiber, and zero maida. Keeps you satiated until lunchtime.',
    dietTags: ['Vegetarian', 'Quick', 'Weight Loss']
  },
  {
    id: 'sug-3',
    name: 'Millet Dosa + Drumstick Sambar',
    hindiName: 'बाजरा/रागी डोसा एवं सांभर',
    cuisine: 'South Indian',
    mealType: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    calories: 340,
    protein: 14,
    carbs: 52,
    fats: 6,
    fiber: 11,
    prepTime: '15 mins',
    costEstimate: '₹55 / serving',
    difficulty: 'Easy',
    ingredients: ['Foxtail Millet / Ragi batter', 'Pigeon pea (Toor dal) sambar', 'Moringa (drumstick)', 'Curry leaves', 'Tomato-coconut relish'],
    whyThisMeal:
      'Replacing white rice with ancient South Asian millets cuts the glycemic index by 32% while flooding your system with iron, magnesium, and slow-burning prebiotic fibers.',
    dietTags: ['Vegetarian', 'Diabetic Safe', 'High Fiber']
  },
  {
    id: 'sug-4',
    name: 'Desi Paneer Bhurji + Multigrain Roti',
    hindiName: 'पनीर भुर्जी एवं रोटी',
    cuisine: 'Punjabi',
    mealType: 'Dinner',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
    calories: 450,
    protein: 26,
    carbs: 42,
    fats: 16,
    fiber: 8,
    prepTime: '20 mins',
    costEstimate: '₹95 / serving',
    difficulty: 'Easy',
    ingredients: ['Fresh crumbed paneer (140g)', '2 whole wheat phulkas', 'Diced tomatoes & onions', '1/2 tsp pure A2 cow ghee', 'Kasuri methi'],
    whyThisMeal:
      'The quintessential Punjabi comfort meal rebuilt for fitness. Cooking on high heat dry-tawa and finishing with aromatic kasuri methi gives rich dhaba flavor with under 16g of healthy fats.',
    dietTags: ['Vegetarian', 'High Protein', 'Balanced']
  },
  {
    id: 'sug-5',
    name: 'Andhra Spiced Chicken Rice Bowl',
    hindiName: 'आंध्रा चिकन राइस बाउल',
    cuisine: 'Andhra',
    mealType: 'Lunch',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    calories: 510,
    protein: 38,
    carbs: 54,
    fats: 12,
    fiber: 6,
    prepTime: '25 mins',
    costEstimate: '₹120 / serving',
    difficulty: 'Intermediate',
    ingredients: ['Tender skinless chicken breast (160g)', 'Steamed Sona Masoori rice', 'Curry leaves & Guntur chilli', 'Cucumber raita'],
    whyThisMeal:
      'Massive 38g of lean protein with traditional fiery Andhra spices that enhance thermogenesis. Balanced with cool curd raita to support gut digestion.',
    dietTags: ['Non-vegetarian', 'High Protein', 'Muscle Gain']
  },
  {
    id: 'sug-6',
    name: 'Dhabha Style Rajma Chawal + Salad',
    hindiName: 'राजमा चावल एवं सलाद',
    cuisine: 'Punjabi',
    mealType: 'Lunch',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    calories: 460,
    protein: 19,
    carbs: 72,
    fats: 8,
    fiber: 14,
    prepTime: '30 mins',
    costEstimate: '₹60 / serving',
    difficulty: 'Intermediate',
    ingredients: ['Kashmiri red kidney beans (Rajma)', 'Steamed Jeera rice (1 cup)', 'Onion-tomato-ginger gravy', 'Lemon & raw onion salad'],
    whyThisMeal:
      'The ultimate Indian complete protein combination. Kidney beans and rice create a full amino acid profile with exceptional soluble fiber that regulates cholesterol and glucose.',
    dietTags: ['Vegetarian', 'Comfort', 'High Fiber']
  },
  {
    id: 'sug-7',
    name: 'Vegetable Upma + Fresh Curd',
    hindiName: 'वेजिटेबल उपमा एवं दही',
    cuisine: 'South Indian',
    mealType: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    calories: 320,
    protein: 11,
    carbs: 48,
    fats: 7,
    fiber: 6,
    prepTime: '12 mins',
    costEstimate: '₹35 / serving',
    difficulty: 'Quick',
    ingredients: ['Roasted Semolina / Rava', 'Mustard seeds & roasted peanuts', 'Diced carrots, beans & peas', 'Ginger & green chili', '1 katori dahi'],
    whyThisMeal:
      'Ready in just 12 minutes on busy weekday mornings. Crunchy roasted peanuts add zinc and healthy fats, while fresh dahi provides gut cooling.',
    dietTags: ['Vegetarian', 'Quick', 'Budget Friendly']
  },
  {
    id: 'sug-8',
    name: 'Sprouted Matki Usal + Bhakri',
    hindiName: 'मटकी उसळ एवं ज्वारी भाकरी',
    cuisine: 'Maharashtrian',
    mealType: 'Dinner',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    calories: 380,
    protein: 17,
    carbs: 58,
    fats: 7,
    fiber: 13,
    prepTime: '20 mins',
    costEstimate: '₹50 / serving',
    difficulty: 'Easy',
    ingredients: ['Sprouted moth beans (matki)', '1 Jowar (sorghum) bhakri', 'Goda masala & curry leaves', 'Fresh grated coconut (1 tsp)', 'Lemon'],
    whyThisMeal:
      'Authentic Maharashtrian powerhouse dinner. Gluten-free Jowar bhakri paired with sprouted matki offers massive dietary fiber and natural potassium for evening cardiovascular decompression.',
    dietTags: ['Vegetarian', 'Gluten Free', 'High Fiber']
  }
];

export const mealSuggesterService = {
  async getSuggestions(prefs: Partial<UserMealPreferences>): Promise<SuggestedMeal[]> {
    await new Promise((r) => setTimeout(r, 600));

    // Dynamic filtering based on user preferences
    let pool = [...INDIAN_MEAL_DATABASE];

    if (prefs.diet === 'Vegetarian') {
      pool = pool.filter((m) => m.dietTags.includes('Vegetarian'));
    } else if (prefs.diet === 'Non-vegetarian') {
      // Prioritize non-veg if available, otherwise include both
      const nonVeg = pool.filter((m) => m.dietTags.includes('Non-vegetarian'));
      if (nonVeg.length > 0) pool = [...nonVeg, ...pool.filter((m) => m.dietTags.includes('High Protein'))];
    }

    if (prefs.mealType) {
      const typeMatches = pool.filter((m) => m.mealType === prefs.mealType);
      if (typeMatches.length > 0) pool = typeMatches;
    }

    if (prefs.cuisine && prefs.cuisine !== 'Mixed Indian') {
      const cuisineMatches = pool.filter((m) => m.cuisine.toLowerCase().includes(prefs.cuisine!.toLowerCase()));
      if (cuisineMatches.length > 0) pool = cuisineMatches;
    }

    // Always ensure at least 3 curated meals are returned
    if (pool.length < 3) {
      pool = INDIAN_MEAL_DATABASE.slice(0, 4);
    }

    return pool;
  },

  async swapMeal(currentId: string, prefs: Partial<UserMealPreferences>): Promise<SuggestedMeal> {
    await new Promise((r) => setTimeout(r, 400));
    const alternatives = INDIAN_MEAL_DATABASE.filter((m) => m.id !== currentId);
    const randomIndex = Math.floor(Math.random() * alternatives.length);
    return alternatives[randomIndex];
  }
};
