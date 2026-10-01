import { useEffect, useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { Navbar } from './components/common/Navbar';
import type { NavView } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HeroSection } from './components/hero/HeroSection';
import { HealthConnected } from './components/connected/HealthConnected';
import { FeatureShowcase } from './components/features/FeatureShowcase';
import { DashboardView } from './components/app-views/DashboardView';
import { NutritionView } from './components/app-views/NutritionView';
import type { NutritionTab } from './components/app-views/NutritionView';
import type { SuggestedMeal } from './services/mealSuggesterService';
import { FamilyHubView } from './components/app-views/FamilyHubView';
import { AICoachDrawer } from './components/modals/AICoachDrawer';
import { AuthView } from './components/auth/AuthView';
import type { AuthMode, AuthUser } from './components/auth/AuthView';
import { EMPTY_WEEKLY_STEPS, EMPTY_WORKOUTS, INITIAL_METRICS } from './services/fitnessService';
import type { DailyMetrics, WorkoutSession, WeeklyStepDay } from './types/fitness';
import type { FamilyMember } from './types/family';
import type { UserData } from './types/userData';
import { userDataService } from './services/userDataService';
import { apiFetch } from './services/api';
import { Bot, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';

const calculateDailyProgressScore = (metrics: DailyMetrics): number => {
  const goals = [
    [metrics.steps, metrics.stepsGoal],
    [metrics.caloriesBurned, metrics.caloriesGoal],
    [metrics.activeMinutes, metrics.activeMinutesGoal],
    [metrics.waterLiters, metrics.waterGoalLiters],
    [metrics.sleepHours * 60 + metrics.sleepMinutes, 480],
    [metrics.proteinGrams, metrics.proteinGoalGrams],
  ];
  return Math.round(goals.reduce((total, [value, goal]) => total + Math.min(1, value / goal), 0) / goals.length * 100);
};

export function App() {
  const [currentView, setCurrentView] = useState<NavView>('home');
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [nutritionTab, setNutritionTab] = useState<NutritionTab>('suggester');
  const [isAICoachOpen, setIsAICoachOpen] = useState<boolean>(false);
  const [aiCoachPrompt, setAICoachPrompt] = useState<string | undefined>(undefined);
  const [metrics, setMetrics] = useState<DailyMetrics>({ ...INITIAL_METRICS });
  const [workouts, setWorkouts] = useState<WorkoutSession[]>(EMPTY_WORKOUTS);
  const [weeklySteps, setWeeklySteps] = useState<WeeklyStepDay[]>(EMPTY_WEEKLY_STEPS.map((day) => ({ ...day })));
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);

  const applyUserData = (data: UserData) => {
    setMetrics(data.metrics);
    setWorkouts(data.workouts);
    setWeeklySteps(data.weeklySteps);
    setFamilyMembers(data.familyMembers);
  };

  const resetUserData = () => {
    setMetrics({ ...INITIAL_METRICS });
    setWorkouts([]);
    setWeeklySteps(EMPTY_WEEKLY_STEPS.map((day) => ({ ...day })));
    setFamilyMembers([]);
  };

  useEffect(() => {
    let active = true;
    const restoreSession = async () => {
      try {
        const response = await apiFetch('/api/auth/me');
        const result = await response.json();
        if (!active) return;
        setAuthUser(result.user ?? null);
        if (result.user) applyUserData(await userDataService.getCurrent());
        else resetUserData();
      } catch {
        if (active) {
          setAuthUser(null);
          resetUserData();
        }
      }
    };
    void restoreSession();

    return () => {
      active = false;
    };
  }, []);

  const handleOpenAICoachWithPrompt = (prompt: string) => {
    setAICoachPrompt(prompt);
    setIsAICoachOpen(true);
  };

  const handleToggleWorkout = async (id: string) => {
    const updatedWorkouts = workouts.map((workout) =>
      workout.id === id ? { ...workout, completed: !workout.completed } : workout,
    );
    const completed = updatedWorkouts.filter((workout) => workout.completed);
    const updatedMetrics = {
      ...metrics,
      caloriesBurned: completed.reduce((total, workout) => total + workout.calories, 0),
      activeMinutes: completed.reduce((total, workout) => total + workout.durationMinutes, 0),
    };
    updatedMetrics.dailyScore = calculateDailyProgressScore(updatedMetrics);
    const today = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];
    const updatedWeeklySteps = weeklySteps.map((day) => day.day === today
      ? { ...day, caloriesBurned: updatedMetrics.caloriesBurned, activeMinutes: updatedMetrics.activeMinutes }
      : day,
    );
    const saved = await userDataService.update({
      workouts: updatedWorkouts,
      metrics: updatedMetrics,
      weeklySteps: updatedWeeklySteps,
    });
    applyUserData(saved);
  };

  const handleUpdateMetrics = async (updatedMetrics: DailyMetrics) => {
    const metricsWithScore = {
      ...updatedMetrics,
      dailyScore: calculateDailyProgressScore(updatedMetrics),
    };
    const saved = await userDataService.update({ metrics: metricsWithScore });
    applyUserData(saved);
  };

  const handleFamilyMembersChange = async (members: FamilyMember[]) => {
    const saved = await userDataService.update({ familyMembers: members });
    applyUserData(saved);
  };

  const handleNavigate = (view: NavView) => {
    if (view !== 'home' && !authUser) {
      setAuthMode('register');
      return;
    }
    setAuthMode(null);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode: AuthMode) => {
    setAuthMode(mode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthenticated = async (user: AuthUser) => {
    setAuthUser(user);
    setAuthMode(null);
    setCurrentView('dashboard');
    try {
      applyUserData(await userDataService.getCurrent());
    } catch {
      resetUserData();
    }
  };

  const handleSignOut = async () => {
    try {
      const response = await apiFetch('/api/auth/logout', { method: 'POST' });
      if (!response.ok) return;
      setAuthUser(null);
      resetUserData();
      setCurrentView('home');
    } catch {
      return;
    }
  };

  const handleNavigateToSuggester = () => {
    setNutritionTab('suggester');
    setCurrentView('nutrition');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToScanner = () => {
    setNutritionTab('scanner');
    setCurrentView('nutrition');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectMetricFrom3D = (metricId: string) => {
    if (metricId === 'steps' || metricId === 'calories' || metricId === 'activity') {
      setCurrentView('dashboard');
    } else if (metricId === 'protein' || metricId === 'water') {
      setNutritionTab('blueprints');
      setCurrentView('nutrition');
    } else {
      // scroll down to connected health visualizer
      const el = document.getElementById('connected-health');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <ThemeProvider>
    <MotionConfig reducedMotion="user">
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] flex flex-col selection:bg-prana-500/30 selection:text-prana-700 dark:selection:text-prana-400 transition-colors duration-200 motion-reduce:transition-none">
      {/* Floating Translucent Sticky Navbar */}
      <Navbar
        currentView={currentView}
        authUser={authUser}
        onNavigate={handleNavigate}
        onOpenAICoach={() => setIsAICoachOpen(true)}
        onOpenAuth={handleOpenAuth}
        onSignOut={handleSignOut}
      />

      {/* Main View Switcher */}
      <main className="flex-1">
        {authMode ? (
          <AuthView
            mode={authMode}
            onModeChange={setAuthMode}
            onBack={() => setAuthMode(null)}
            onAuthenticated={handleAuthenticated}
          />
        ) : (
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div
              key="home-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Cinematic 3D Hero Section */}
              <HeroSection
                metrics={metrics}
                onStartJourney={() => handleNavigate('dashboard')}
                onExplore={() => {
                  const el = document.getElementById('capabilities');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                onSelectMetric={handleSelectMetricFrom3D}
              />

              {/* Scroll Step 1: Your Health, Connected (3D Body Vitals Visualizer) */}
              <div id="connected-health">
                <HealthConnected metrics={metrics} onExploreFeature={(f) => handleNavigate('dashboard')} />
              </div>

              {/* Scroll Step 2: Four Major Capabilities Showcase */}
              <div id="capabilities">
                <FeatureShowcase
                  metrics={metrics}
                  workouts={workouts}
                  weeklySteps={weeklySteps}
                  familyMembers={familyMembers}
                  onToggleWorkout={handleToggleWorkout}
                />
              </div>

              {/* Bottom Interactive CTA Section */}
              <section className="py-20 relative overflow-hidden">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                  <div className="p-8 sm:p-14 rounded-3xl glass-panel-glow border border-prana-500/30 space-y-6">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-prana-500/20 text-prana-400 text-xs font-bold border border-prana-500/30">
                      <Sparkles className="w-3.5 h-3.5" />
                      Empowering Indian Families Nationwide
                    </span>
                    <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
                      Start Your Family's Wellness Journey Today.
                    </h2>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
                      AI nutrition for ghar ka khana, personalized workout streaks, and peace of mind for your parents' health.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                      <button
                        onClick={() => handleNavigate('dashboard')}
                        className="px-8 py-4 rounded-full font-bold text-sm bg-gradient-to-r from-prana-500 via-emerald-500 to-emerald-600 text-slate-950 hover:from-prana-400 hover:to-emerald-400 shadow-glow-prana transition-all duration-300 flex items-center gap-2.5 active:scale-95 group"
                      >
                        <span>Launch FitIshh Free</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </button>
                      <button
                        onClick={() => setIsAICoachOpen(true)}
                        className="px-6 py-4 rounded-full font-semibold text-sm glass-panel text-surya-600 dark:text-surya-400 hover:bg-surya-500/10 border border-surya-500/30 transition-all flex items-center gap-2"
                      >
                        <Bot className="w-4 h-4" />
                        <span>Chat with Saathi AI</span>
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {currentView === 'dashboard' && (
            <motion.div
              key="dashboard-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
            <DashboardView
              userName={authUser?.name.split(' ')[0] ?? 'there'}
                metrics={metrics}
                workouts={workouts}
                weeklySteps={weeklySteps}
                onToggleWorkout={handleToggleWorkout}
                onUpdateMetrics={handleUpdateMetrics}
                onOpenAICoach={() => setIsAICoachOpen(true)}
                onNavigate={handleNavigate}
                onNavigateToSuggester={handleNavigateToSuggester}
                onNavigateToScanner={handleNavigateToScanner}
              />
            </motion.div>
          )}

          {currentView === 'nutrition' && (
            <motion.div
              key="nutrition-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <NutritionView
                onOpenAICoach={() => setIsAICoachOpen(true)}
                onOpenAICoachWithPrompt={handleOpenAICoachWithPrompt}
                initialTab={nutritionTab}
                onAddToTodayPlan={(meal) => {
                  console.log('Meal added to today\'s plan:', meal.name);
                }}
              />
            </motion.div>
          )}

          {currentView === 'family' && (
            <motion.div
              key="family-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <FamilyHubView
                members={familyMembers}
                onMembersChange={handleFamilyMembersChange}
                onOpenAICoach={() => setIsAICoachOpen(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
        )}
      </main>

      {/* Floating Quick Action AI Coach Trigger */}
      {!authMode && <div className={`fixed bottom-6 right-6 z-40 ${currentView === 'home' ? 'hidden sm:flex' : 'flex'}`}>
        <button
          onClick={() => {
            setAICoachPrompt(undefined);
            setIsAICoachOpen(true);
          }}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-surya-500 to-amber-600 text-obsidian-950 font-bold text-xs shadow-glow-surya hover:scale-105 active:scale-95 transition-all duration-300"
        >
          <Bot className="w-4 h-4 animate-bounce" />
          <span className="hidden sm:inline">Ask Saathi AI</span>
          <span className="sm:hidden">AI</span>
          <span className="w-2 h-2 rounded-full bg-obsidian-950 animate-ping" />
        </button>
      </div>}

      {/* Saathi AI Conversational Drawer */}
      {!authMode && <AICoachDrawer
        isOpen={isAICoachOpen}
        onClose={() => {
          setIsAICoachOpen(false);
          setAICoachPrompt(undefined);
        }}
        initialPrompt={aiCoachPrompt}
      />}

      {/* Footer */}
      <Footer onNavigate={handleNavigate} onOpenAICoach={() => setIsAICoachOpen(true)} />
    </div>
    </MotionConfig>
    </ThemeProvider>
  );
}

export default App;
