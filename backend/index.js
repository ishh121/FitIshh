import 'dotenv/config';
import express from 'express';
import bcrypt from 'bcryptjs';
import MongoStore from 'connect-mongo';
import { rateLimit } from 'express-rate-limit';
import session from 'express-session';
import helmet from 'helmet';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  MongoClient,
  MongoServerError,
  MongoServerSelectionError,
  ObjectId,
} from 'mongodb';

const { MONGODB_URI } = process.env;
const isProduction = process.env.NODE_ENV === 'production';
const sessionSecret = process.env.SESSION_SECRET ?? 'fitishh-local-development-only-secret';
const port = Number(process.env.PORT ?? process.env.API_PORT ?? 3001);
const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

if (isProduction && !process.env.VERCEL && (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32)) {
  console.error('SESSION_SECRET must be at least 32 characters in production.');
  process.exit(1);
}

if (!MONGODB_URI && !process.env.VERCEL) {
  console.error('❌ Missing MONGODB_URI. Copy .env.example to .env and set it.');
  process.exit(1);
}

const client = new MongoClient(MONGODB_URI || 'mongodb://127.0.0.1:27017/fitishh', {
  serverSelectionTimeoutMS: 5000
});

const app = express();
app.set('trust proxy', isProduction ? 1 : false);
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
      imgSrc: ["'self'", 'data:', 'blob:', 'https://images.unsplash.com'],
      connectSrc: ["'self'", 'https://images.unsplash.com'],
      workerSrc: ["'self'", 'blob:'],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));
app.use(express.json({ limit: '16kb' }));
app.use(session({
  name: 'fitishh.sid',
  secret: sessionSecret,
  store: MongoStore.create({ client, collectionName: 'sessions' }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
}));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Try again later.' },
});

const publicUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
});

const zeroMetrics = () => ({
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
});

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const workoutTemplates = [
  {
    id: 'routine-yoga',
    title: 'Surya Namaskar & Pranic Flow',
    category: 'Yoga & Pranayama',
    durationMinutes: 25,
    calories: 145,
    intensity: 'Gentle',
    completed: false,
    timeOfDay: 'Any time',
    icon: 'Sun',
    description: 'A suggested movement routine. Mark complete only after doing it.',
  },
  {
    id: 'routine-akhada',
    title: 'Bodyweight Strength Circuit',
    category: 'Ghar Akhada',
    durationMinutes: 35,
    calories: 310,
    intensity: 'Intense',
    completed: false,
    timeOfDay: 'Any time',
    icon: 'Dumbbell',
    description: 'A suggested strength routine. Mark complete only after doing it.',
  },
  {
    id: 'routine-walk',
    title: 'Brisk Walk',
    category: 'Terrace / Park Walk',
    durationMinutes: 30,
    calories: 160,
    intensity: 'Moderate',
    completed: false,
    timeOfDay: 'Any time',
    icon: 'Footprints',
    description: 'A suggested walking routine. Mark complete only after doing it.',
  },
  {
    id: 'routine-mobility',
    title: 'Joint Mobility',
    category: 'Ayurvedic Mobility',
    durationMinutes: 15,
    calories: 65,
    intensity: 'Gentle',
    completed: false,
    timeOfDay: 'Any time',
    icon: 'Sparkles',
    description: 'A suggested mobility routine. Mark complete only after doing it.',
  },
];
const createDefaultUserData = (userId) => ({
  userId,
  metrics: zeroMetrics(),
  workouts: workoutTemplates.map((workout) => ({ ...workout })),
  weeklySteps: weekDays.map((day) => ({
    day,
    steps: 0,
    goal: 10000,
    caloriesBurned: 0,
    activeMinutes: 0,
    isPeak: false,
  })),
  familyMembers: [],
  createdAt: new Date(),
  updatedAt: new Date(),
});

const isNonNegativeNumber = (value) => Number.isFinite(value) && value >= 0;
const isValidMetrics = (metrics) => {
  const fields = Object.keys(zeroMetrics());
  return metrics && fields.every((field) => isNonNegativeNumber(metrics[field])) &&
    metrics.stepsGoal > 0 && metrics.caloriesGoal > 0 && metrics.activeMinutesGoal > 0 &&
    metrics.waterGoalLiters > 0 && metrics.proteinGoalGrams > 0 && metrics.dailyScore <= 100;
};

const isValidWeeklySteps = (days) => Array.isArray(days) && days.length === weekDays.length &&
  days.every((day, index) =>
    day && day.day === weekDays[index] &&
    isNonNegativeNumber(day.steps) && isNonNegativeNumber(day.goal) && day.goal > 0 &&
    isNonNegativeNumber(day.caloriesBurned) && isNonNegativeNumber(day.activeMinutes) &&
    typeof day.isPeak === 'boolean',
  );

const isValidWorkout = (workout) =>
  workout && typeof workout.id === 'string' && workout.id.length <= 80 &&
  typeof workout.title === 'string' && workout.title.trim().length > 0 && workout.title.length <= 120 &&
  typeof workout.category === 'string' && workout.category.length <= 80 &&
  isNonNegativeNumber(workout.durationMinutes) && isNonNegativeNumber(workout.calories) &&
  typeof workout.completed === 'boolean' && typeof workout.timeOfDay === 'string' &&
  typeof workout.icon === 'string' && typeof workout.description === 'string';

const validRelations = new Set(['Self', 'Father', 'Mother', 'Grandmother', 'Spouse', 'Child']);
const validColorSchemes = new Set(['emerald', 'amber', 'cyan', 'rose']);
const isValidFamilyMember = (member) =>
  member && typeof member.id === 'string' && member.id.length <= 80 &&
  typeof member.name === 'string' && member.name.trim().length > 0 && member.name.length <= 80 &&
  validRelations.has(member.relation) && Number.isInteger(member.age) && member.age >= 1 && member.age <= 120 &&
  typeof member.avatar === 'string' && member.avatar.length <= 500 &&
  validColorSchemes.has(member.colorScheme) &&
  Array.isArray(member.healthConditions) && member.healthConditions.length <= 12 &&
  member.healthConditions.every((condition) => typeof condition === 'string' && condition.length <= 120) &&
  member.vitals && isNonNegativeNumber(member.vitals.todaySteps) &&
  isNonNegativeNumber(member.vitals.stepsGoal) && member.vitals.stepsGoal > 0 &&
  isNonNegativeNumber(member.vitals.waterIntakeLiters) &&
  isNonNegativeNumber(member.vitals.medicationsTaken) &&
  isNonNegativeNumber(member.vitals.totalMedications) &&
  typeof member.vitals.lastChecked === 'string' && isNonNegativeNumber(member.streakDays);

const requireAuth = (request, response, next) => {
  if (!request.session.userId) {
    response.status(401).json({ error: 'Sign in to continue.' });
    return;
  }
  next();
};

const saveSession = (request) => new Promise((resolve, reject) => {
  request.session.save((error) => error ? reject(error) : resolve());
});

const startUserSession = async (request, userId) => {
  await new Promise((resolve, reject) => {
    request.session.regenerate((error) => error ? reject(error) : resolve());
  });
  request.session.userId = userId.toString();
  await saveSession(request);
};

app.get('/api/health', async (_request, response) => {
  try {
    await client.db().command({ ping: 1 });

    response.json({
      status: 'ok',
      database: 'connected'
    });
  } catch (error) {
    console.error('❌ Health check failed:', error);

    response.status(503).json({
      status: 'error',
      database: 'disconnected'
    });
  }
});

app.post('/api/auth/register', authLimiter, async (request, response) => {
  const name = typeof request.body?.name === 'string' ? request.body.name.trim() : '';
  const email = typeof request.body?.email === 'string' ? request.body.email.trim().toLowerCase() : '';
  const password = request.body?.password;

  if (
    name.length < 2 || name.length > 80 ||
    email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    typeof password !== 'string' || password.length < 12 || password.length > 128
  ) {
    response.status(400).json({ error: 'Enter a name, valid email, and password with at least 12 characters.' });
    return;
  }

  try {
    const user = {
      name,
      email,
      passwordHash: await bcrypt.hash(password, 12),
      createdAt: new Date(),
    };
    const result = await client.db().collection('users').insertOne(user);
    user._id = result.insertedId;
    await startUserSession(request, user._id);
    response.status(201).json({ user: publicUser(user) });
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      response.status(409).json({ error: 'An account with this email already exists.' });
      return;
    }
    console.error('Registration failed.');
    response.status(503).json({ error: 'Could not create the account right now.' });
  }
});

app.post('/api/auth/login', authLimiter, async (request, response) => {
  const email = typeof request.body?.email === 'string' ? request.body.email.trim().toLowerCase() : '';
  const password = request.body?.password;

  if (!email || typeof password !== 'string') {
    response.status(400).json({ error: 'Enter your email and password.' });
    return;
  }

  try {
    const user = await client.db().collection('users').findOne({ email });
    if (!user || !await bcrypt.compare(password, user.passwordHash)) {
      response.status(401).json({ error: 'Email or password is incorrect.' });
      return;
    }

    await startUserSession(request, user._id);
    response.json({ user: publicUser(user) });
  } catch {
    response.status(503).json({ error: 'Could not sign in right now.' });
  }
});

app.get('/api/auth/me', async (request, response) => {
  if (!request.session.userId || !ObjectId.isValid(request.session.userId)) {
    response.json({ user: null });
    return;
  }

  try {
    const user = await client.db().collection('users').findOne(
      { _id: new ObjectId(request.session.userId) },
      { projection: { passwordHash: 0 } },
    );
    response.json({ user: user ? publicUser(user) : null });
  } catch {
    response.status(503).json({ error: 'Could not read the session right now.' });
  }
});

app.get('/api/user-data', requireAuth, async (request, response) => {
  try {
    const userId = new ObjectId(request.session.userId);
    const collection = client.db().collection('user_data');
    await collection.updateOne(
      { userId },
      { $setOnInsert: createDefaultUserData(userId) },
      { upsert: true },
    );
    const data = await collection.findOne({ userId }, { projection: { _id: 0, userId: 0 } });
    response.json({ data });
  } catch {
    response.status(503).json({ error: 'Could not load your health data right now.' });
  }
});

app.patch('/api/user-data', requireAuth, async (request, response) => {
  const patch = request.body;
  const allowedFields = new Set(['metrics', 'workouts', 'weeklySteps', 'familyMembers']);
  const keys = patch && typeof patch === 'object' && !Array.isArray(patch) ? Object.keys(patch) : [];

  if (!keys.length || keys.some((key) => !allowedFields.has(key))) {
    response.status(400).json({ error: 'Invalid user data update.' });
    return;
  }
  if ('metrics' in patch && !isValidMetrics(patch.metrics)) {
    response.status(400).json({ error: 'Invalid metrics.' });
    return;
  }
  if ('workouts' in patch && (!Array.isArray(patch.workouts) || patch.workouts.length > 100 || !patch.workouts.every(isValidWorkout))) {
    response.status(400).json({ error: 'Invalid workout list.' });
    return;
  }
  if ('weeklySteps' in patch && !isValidWeeklySteps(patch.weeklySteps)) {
    response.status(400).json({ error: 'Invalid weekly activity.' });
    return;
  }
  if ('familyMembers' in patch && (!Array.isArray(patch.familyMembers) || patch.familyMembers.length > 20 || !patch.familyMembers.every(isValidFamilyMember))) {
    response.status(400).json({ error: 'Invalid family member list.' });
    return;
  }

  try {
    const userId = new ObjectId(request.session.userId);
    const collection = client.db().collection('user_data');
    await collection.updateOne(
      { userId },
      { $setOnInsert: createDefaultUserData(userId) },
      { upsert: true },
    );
    await collection.updateOne({ userId }, { $set: { ...patch, updatedAt: new Date() } });
    const data = await collection.findOne({ userId }, { projection: { _id: 0, userId: 0 } });
    response.json({ data });
  } catch {
    response.status(503).json({ error: 'Could not save your health data right now.' });
  }
});

app.post('/api/auth/logout', (request, response) => {
  request.session.destroy((error) => {
    if (error) {
      response.status(503).json({ error: 'Could not sign out right now.' });
      return;
    }
    response.clearCookie('fitishh.sid', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
    });
    response.status(204).end();
  });
});

app.post('/api/meal-logs', requireAuth, async (request, response) => {
  const { mealName, nutrition, items, optimized } = request.body ?? {};
  const nutritionFields = ['calories', 'protein', 'carbs', 'fats', 'fiber'];
  const hasNutritionValues = (values) =>
    values && nutritionFields.every((field) =>
      Number.isFinite(values[field]) && values[field] >= 0,
    );
  const hasValidItems = Array.isArray(items) && items.length <= 20 && items.every((item) =>
    item &&
    typeof item.name === 'string' && item.name.length <= 120 &&
    typeof item.portion === 'string' && item.portion.length <= 80 &&
    hasNutritionValues(item),
  );

  if (
    typeof mealName !== 'string' || mealName.length > 120 ||
    typeof optimized !== 'boolean' ||
    !hasNutritionValues(nutrition) ||
    !hasValidItems
  ) {
    response.status(400).json({ error: 'Invalid meal log data.' });
    return;
  }

  try {
    const result = await client.db().collection('meal_logs').insertOne({
      userId: new ObjectId(request.session.userId),
      mealName: mealName.trim(),
      source: 'simulated_scan',
      optimized,
      nutrition: Object.fromEntries(nutritionFields.map((field) => [field, nutrition[field]])),
      items: items.map((item) => ({
        name: item.name.trim(),
        portion: item.portion.trim(),
        ...Object.fromEntries(nutritionFields.map((field) => [field, item[field]])),
      })),
      createdAt: new Date(),
    });

    response.status(201).json({ id: result.insertedId.toString(), status: 'saved' });
  } catch {
    response.status(503).json({ error: 'Could not save the meal log.' });
  }
});

app.get('/api/meal-logs', requireAuth, async (request, response) => {
  try {
    const mealLogs = await client.db().collection('meal_logs')
      .find({ userId: new ObjectId(request.session.userId) })
      .sort({ createdAt: -1 })
      .limit(50)
      .project({ mealName: 1, source: 1, optimized: 1, nutrition: 1, items: 1, createdAt: 1 })
      .toArray();

    response.json({ mealLogs });
  } catch {
    response.status(503).json({ error: 'Could not load meal logs right now.' });
  }
});

try {
  console.log('🔄 Connecting to MongoDB...');

  await client.connect();

  await Promise.all([
    client.db().collection('users').createIndex({ email: 1 }, { unique: true, name: 'unique_user_email' }),
    client.db().collection('meal_logs').createIndex({ userId: 1, createdAt: -1 }, { name: 'meal_logs_by_user' }),
    client.db().collection('user_data').createIndex({ userId: 1 }, { unique: true, name: 'unique_user_data' }),
  ]);

  console.log('✅ MongoDB client connected.');

  await client.db().command({ ping: 1 });

  console.log('✅ MongoDB ping successful.');

  if (isProduction && !process.env.VERCEL) {
    const distPath = path.join(appRoot, 'dist');
    app.use('/api', (_request, response) => response.status(404).json({ error: 'API route not found.' }));
    app.use(express.static(distPath, { index: false }));
    app.get(/.*/, (_request, response) => response.sendFile(path.join(distPath, 'index.html')));
  }

  if (!process.env.VERCEL) {
    const server = app.listen(port, () => {
      console.info(`🚀 API listening on http://localhost:${port}`);
    });

    const shutdown = async () => {
      console.log('\n🛑 Shutting down server...');

      server.close();

      await client.close();

      console.log('✅ MongoDB connection closed.');

      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  }

} catch (error) {

  console.error('\n========================================');
  console.error('❌ MONGODB CONNECTION FAILED');
  console.error('========================================');

  if (error instanceof MongoServerSelectionError) {
    console.error('Type: MongoServerSelectionError');
    console.error('Message:', error.message);
    console.error('Reason:', error.reason);
  }

  else if (
    error instanceof MongoServerError &&
    (error.code === 18 || error.codeName === 'AuthenticationFailed')
  ) {
    console.error('Type: Authentication Error');
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    console.error('CodeName:', error.codeName);
  }

  else if (
    error instanceof Error &&
    error.name === 'MongoParseError'
  ) {
    console.error('Type: Invalid MongoDB URI');
    console.error('Message:', error.message);
  }

  else if (error instanceof Error) {
    console.error('Type:', error.name);
    console.error('Message:', error.message);

    if ('code' in error) {
      console.error('Code:', error.code);
    }

    if ('codeName' in error) {
      console.error('CodeName:', error.codeName);
    }

    if ('syscall' in error) {
      console.error('Syscall:', error.syscall);
    }

    if ('cause' in error) {
      console.error('Cause:', error.cause);
    }
  }

  else {
    console.error('Unknown error:', error);
  }

  console.error('========================================\n');

  await client.close().catch(() => {});

  if (!process.env.VERCEL) {
    process.exit(1);
  }
}

export { app };
export default app;