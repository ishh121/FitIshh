import React, { useState } from 'react';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Leaf,
  LockKeyhole,
  Mail,
  UserRound,
} from 'lucide-react';

export type AuthMode = 'sign-in' | 'register';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthViewProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onBack: () => void;
  onAuthenticated: (user: AuthUser) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ mode, onModeChange, onBack, onAuthenticated }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isRegistering = mode === 'register';

  const changeMode = (nextMode: AuthMode) => {
    setFeedback('');
    onModeChange(nextMode);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isRegistering && password !== confirmPassword) {
      setFeedback('Your passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    setFeedback('');
    try {
      const response = await fetch(`/api/auth/${isRegistering ? 'register' : 'login'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const result = await response.json();

      if (!response.ok) {
        setFeedback(result.error ?? 'Could not authenticate. Please try again.');
        return;
      }

      onAuthenticated(result.user as AuthUser);
    } catch {
      setFeedback('Could not reach the server. Check that the API is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClassName =
    'w-full rounded-xl border border-slate-300 dark:border-white/10 bg-white/80 dark:bg-obsidian-950/70 py-3 pl-11 pr-4 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-prana-500 focus-visible:border-prana-500';

  return (
    <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-20 mx-auto h-96 max-w-5xl bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.12),transparent_68%)]" />
      <div className="relative mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-obsidian-900/80 shadow-xl shadow-slate-900/5 dark:shadow-black/25 lg:grid-cols-[0.95fr_1.05fr]">
        <aside className="relative flex flex-col justify-between overflow-hidden bg-stone-100 p-8 dark:bg-obsidian-950 sm:p-10 lg:min-h-[620px]">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-prana-500/15" />
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full border border-surya-500/20" />
          <div className="relative">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-prana-500 dark:text-slate-300 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to FitIshh
            </button>

            <div className="mt-16 flex h-12 w-12 items-center justify-center rounded-2xl bg-prana-500 text-obsidian-950 shadow-glow-prana">
              <Leaf className="h-6 w-6" />
            </div>
            <p className="mt-7 text-xs font-bold uppercase tracking-[0.12em] text-prana-700 dark:text-prana-400">
              FitIshh / Your health companion
            </p>
            <h1 className="mt-4 max-w-sm font-display text-4xl font-extrabold leading-tight text-slate-900 dark:text-white">
              Small daily choices. A healthier family.
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-300">
              Bring food, movement, and family wellness into one thoughtful routine.
            </p>
          </div>

          <div className="relative mt-12 flex items-center gap-3 border-t border-slate-300/70 pt-5 dark:border-white/10">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-prana-500/10 text-prana-700 dark:text-prana-400">
              <Activity className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Wellness, made personal</p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Nutrition, fitness, and family care</p>
            </div>
          </div>
        </aside>

        <div className="flex items-center p-6 sm:p-10 lg:p-12">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-surya-700 dark:text-surya-400">
                Welcome to FitIshh
              </span>
              <h2 className="mt-2 font-display text-3xl font-extrabold text-slate-900 dark:text-white">
                {isRegistering ? 'Create your account' : 'Welcome back'}
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {isRegistering ? 'Start building healthier routines together.' : 'Sign in to continue your wellness journey.'}
              </p>
            </div>

            <div className="mb-6 grid grid-cols-2 rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-white/10 dark:bg-obsidian-950">
              <button
                type="button"
                aria-pressed={!isRegistering}
                onClick={() => changeMode('sign-in')}
                className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-prana-500 ${
                  !isRegistering
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-obsidian-800 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                aria-pressed={isRegistering}
                onClick={() => changeMode('register')}
                className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-prana-500 ${
                  isRegistering
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-obsidian-800 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegistering && (
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">Full name</span>
                  <span className="relative block">
                    <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      autoComplete="name"
                      className={inputClassName}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Your name"
                      required
                      type="text"
                      value={name}
                    />
                  </span>
                </label>
              )}

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">Email address</span>
                <span className="relative block">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    autoComplete="email"
                    className={inputClassName}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    required
                    type="email"
                    value={email}
                  />
                </span>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">Password</span>
                <span className="relative block">
                  <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    autoComplete={isRegistering ? 'new-password' : 'current-password'}
                    className={`${inputClassName} pr-12`}
                      minLength={12}
                    onChange={(event) => setPassword(event.target.value)}
                      placeholder="At least 12 characters"
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-prana-500 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </span>
              </label>

              {isRegistering && (
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">Confirm password</span>
                  <span className="relative block">
                    <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      autoComplete="new-password"
                      className={inputClassName}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder="Enter your password again"
                      required
                      type="password"
                      value={confirmPassword}
                    />
                  </span>
                </label>
              )}

              {feedback && (
                <p role="status" className="rounded-xl border border-surya-500/30 bg-surya-500/10 px-3.5 py-3 text-xs leading-5 text-surya-800 dark:text-surya-300">
                  {feedback}
                </p>
              )}

              <button
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-prana-500 px-5 py-3.5 text-sm font-bold text-obsidian-950 shadow-glow-prana transition-colors hover:bg-prana-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-prana-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-obsidian-900"
                type="submit"
              >
                <span>{isSubmitting ? 'Please wait...' : isRegistering ? 'Create account' : 'Sign in'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <p className="mt-5 text-center text-[11px] leading-5 text-slate-500 dark:text-slate-400">
              Passwords are stored as salted hashes. Your sign-in session is handled by the server.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};