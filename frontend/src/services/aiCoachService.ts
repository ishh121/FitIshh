import type { ChatMessage, QuickPrompt } from '../types/chat';

export const QUICK_PROMPTS: QuickPrompt[] = [
  {
    id: 'qp-1',
    title: 'Veg Protein Options',
    prompt: 'How can I hit 90g of protein on an Indian vegetarian diet without expensive whey supplements?',
    category: 'diet'
  },
  {
    id: 'qp-2',
    title: 'Can I eat Parathas?',
    prompt: 'Can I eat Aloo/Paneer Parathas while in a fat loss calorie deficit?',
    category: 'diet'
  },
  {
    id: 'qp-3',
    title: 'Papa\'s Blood Sugar Spike',
    prompt: 'Papa’s fasting blood sugar was 132 mg/dL this morning. What should his breakfast and evening routine look like?',
    category: 'family'
  },
  {
    id: 'qp-4',
    title: '15m Desk Worker Stretch',
    prompt: 'I sit for 8 hours coding. Give me a 15-minute routine to undo tight hips and lower back stiffness.',
    category: 'workout'
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-init-1',
    sender: 'saathi',
    text: 'Namaste Kabir! I am **Saathi AI**, your personal Indian wellness companion. I can help analyze your home food macros, optimize your fitness streak, suggest diabetic-friendly meals for Papa, or create a home workout for your schedule. What would you like to explore today?',
    timestamp: 'Just now',
    tags: ['Fitness', 'Indian Diet', 'Family Health'],
    suggestions: [
      'Analyze my dinner plate',
      'High-protein vegetarian meal plan',
      'Papa’s fasting sugar guidelines'
    ]
  }
];

const KNOWLEDGE_RESPONSES: Record<string, { reply: string; suggestions: string[] }> = {
  protein: {
    reply: `Here is how you hit **90g+ clean protein** on a 100% vegetarian Indian diet without relying solely on whey:\n\n1. **Chana Sattu Drink (Morning)**: 40g roasted Sattu in cold buttermilk = **14g protein**\n2. **Curd / Greek Yogurt**: 200g homemade hung curd or Greek curd = **16g-20g protein**\n3. **Sprouted Moong & Kala Chana Chaat (Mid-Meal)**: 1 bowl steamed sprouts with paneer cubes = **18g protein**\n4. **Paneer Bhurji / Tofu Bhurji (Lunch/Dinner)**: 120g low-fat paneer cooked in 1 tsp mustard oil = **22g protein**\n5. **Dal + Roti/Rice Complement**: 1 large katori thick yellow moong dal + 2 multigrain rotis = **14g protein** (complete amino acid profile!)\n\n**Total: ~84g - 88g clean protein** with natural micronutrients and zero bloat!`,
    suggestions: ['How much ghee is safe daily?', 'View high protein veg meal plan', 'Log my protein intake']
  },
  paratha: {
    reply: `**Absolutely yes!** You do not need to abandon ghar ke parathas to lose body fat. It is simply about smart preparation:\n\n- **The Dough**: Mix 70% whole wheat with 30% sattu or besan flour. This drops the glycemic index and adds 5g protein per paratha.\n- **The Filling**: Opt for paneer-gobhi or dal-methi instead of pure potato. This doubles the protein and fiber content.\n- **The Ghee Secret**: Cook the paratha dry on a hot iron tawa first until both sides are roasted, then brush **half a teaspoon of pure A2 desi cow ghee** at the very end. You get 100% of the aroma with only ~22 calories of fat instead of 150 calories!\n- **Pair with**: 1 katori fresh cucumber-mint curd raita. The probiotics and protein slow carb absorption by 30%.`,
    suggestions: ['Show Paneer Bhurji Toast macros', 'Log today\'s breakfast', 'Ask about evening snacks']
  },
  sugar: {
    reply: `For Papa's fasting sugar of ~130 mg/dL, here is an evidence-backed Indian routine:\n\n- **Wake-up Drink (6:30 AM)**: 1 glass warm water soaked overnight with 1 tsp methi (fenugreek) seeds + a pinch of organic cinnamon.\n- **Morning Walk**: A 25-minute brisk walk *before* breakfast triggers muscle contraction-mediated glucose uptake without requiring insulin.\n- **Optimal Breakfast**: Steamed sprouted moong chilla with mint chutney, or vegetable foxtail millet upma. **Avoid** maida white bread, fruit juices, or sweetened chai.\n- **Evening Habit**: 100 steps stroll immediately after dinner. A 10-minute post-meal stroll reduces glucose spikes by up to 22%.`,
    suggestions: ['View Papa’s Vitals Dashboard', 'Send medicine reminder', 'Generate diabetic weekly grocery list']
  },
  desk: {
    reply: `Here is your **15-Minute Desk De-stiffness Flow** (Sandhi-Vimuktam):\n\n1. **Seated Cat-Cow (Marjaryasana)** (3 mins): Inhale, arch spine and look up; exhale, tuck chin and round spine. Decompresses lumbar discs.\n2. **Figure-4 Seated Glute Stretch** (3 mins): Place right ankle on left knee, gently lean forward. Relieves tight piriformis from hours of sitting.\n3. **Doorway Chest & Pec Opener** (3 mins): Place forearms on doorframe and step forward. Undoes rounded forward-head posture.\n4. **Standing Hip Flexor Lunge with Reach** (3 mins): Re-lengthens shortened psoas muscles.\n5. **Anulom Vilom Pranayama** (3 mins): Equal breath ratio (4s inhale / 4s exhale) to lower cortisol and neck tension.`,
    suggestions: ['Start a 5-min timer', 'Add to today’s workouts', 'View mobility tracking']
  },
  balanced: {
    reply: `**Analysis of Your Indian Plate:**\n\nYour plate with **Dal, Rice, Subzi, Rotis, Curd, and Salad** is a wonderful cultural classic, but has a slight carb-to-protein skew:\n\n- **Current Carbs**: ~124g (Rice + 2 Phulkas)\n- **Current Protein**: ~31g\n- **Prana Balance**: To make it truly optimal for insulin sensitivity, enjoy the **Kachumber salad first** (fibers coat the gut lining), reduce the rice serving by ~25%, and add a bowl of sprouted moong or roasted paneer. This lifts protein to **44g** and cuts postprandial glucose spike by 26%!`,
    suggestions: ['How to increase protein?', 'Is this suitable for weight loss?', 'Log this plate to tracker']
  },
  weightloss: {
    reply: `**Is this plate suitable for fat loss?**\n\n**Yes, with 2 simple tweaks!**\n\n1. **The Carb Rule**: Choose either **2 Rotis OR 1 cup Rice**, rather than having both in full quantities. This immediately shaves off **~160-200 calories**.\n2. **Tadka Ghee Awareness**: Dal and subzi together typically absorb 1.5–2 tsp of oil/ghee (~80–110 kcal). Cook on medium flame with 1 tsp ghee for the whole dish.\n3. **Probiotic Advantage**: The fresh curd (Dahi) contains conjugated linoleic acid (CLA) and gut microbes that support abdominal fat loss.`,
    suggestions: ['Suggest a healthier version', 'Calculate daily calorie deficit', 'View high protein veg plan']
  },
  healthier: {
    reply: `**AI Saathi’s Upgraded Plate Formula:**\n\n- **Base**: 1 multigrain phulka (wheat + chana/sattu flour) instead of 2 refined rotis.\n- **Lentils**: Moong dal or Panchmel dal with hing (asafoetida) & jeera tempering.\n- **Protein Booster**: Crumbled low-fat paneer (100g) or steamed kala chana added directly to the vegetable subzi (+14g protein).\n- **Salad First**: Eat cucumber, lemon, and radish slices 5 minutes before your grains.\n- **Result**: **520 kcal (down from 820 kcal)**, **44g clean protein**, and sustained 4-hour energy without the afternoon lethargy!`,
    suggestions: ['Preview 3D Optimized Plate', 'Log this meal', 'Ask about evening tea']
  }
};

export const aiCoachService = {
  async getInitialMessages(): Promise<ChatMessage[]> {
    return [...INITIAL_CHAT_MESSAGES];
  },

  async getQuickPrompts(): Promise<QuickPrompt[]> {
    return [...QUICK_PROMPTS];
  },

  async sendMessage(userText: string): Promise<ChatMessage> {
    await new Promise((r) => setTimeout(r, 600));

    const lower = userText.toLowerCase();
    let replyObj = {
      reply: `I have analyzed your query through FitIshh's Indian metabolic intelligence framework.\n\nFor **"${userText}"**, key Indian lifestyle adjustments include keeping hydration above 2.5L, timing your carbohydrate intake around your active hours, and balancing meals with 1 katori of fresh salad or curd to blunt glycemic spikes.\n\nWould you like me to create a customized routine or calculate your exact macros for this?`,
      suggestions: ['Calculate my macros', 'Personalize my family diet', 'Check daily streak']
    };

    if (lower.includes('protein') || lower.includes('increase protein')) {
      replyObj = KNOWLEDGE_RESPONSES.protein;
    } else if (lower.includes('balanced') || lower.includes('is this meal balanced')) {
      replyObj = KNOWLEDGE_RESPONSES.balanced;
    } else if (lower.includes('weight loss') || lower.includes('fat loss') || lower.includes('suitable for weight loss')) {
      replyObj = KNOWLEDGE_RESPONSES.weightloss;
    } else if (lower.includes('healthier') || lower.includes('healthier version') || lower.includes('better version')) {
      replyObj = KNOWLEDGE_RESPONSES.healthier;
    } else if (lower.includes('paratha') || lower.includes('cheat') || lower.includes('roti')) {
      replyObj = KNOWLEDGE_RESPONSES.paratha;
    } else if (lower.includes('sugar') || lower.includes('diabet') || lower.includes('papa') || lower.includes('father')) {
      replyObj = KNOWLEDGE_RESPONSES.sugar;
    } else if (lower.includes('desk') || lower.includes('stretch') || lower.includes('back') || lower.includes('posture')) {
      replyObj = KNOWLEDGE_RESPONSES.desk;
    }

    return {
      id: `msg-${Date.now()}`,
      sender: 'saathi',
      text: replyObj.reply,
      timestamp: 'Just now',
      tags: ['Saathi AI', 'Lifestyle'],
      suggestions: replyObj.suggestions
    };
  }
};
