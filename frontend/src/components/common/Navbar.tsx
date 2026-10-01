import React, { useState, useEffect } from 'react';
import { Sparkles, Menu, X, Activity, Utensils, Users, Bot, ArrowRight, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import type { AuthMode, AuthUser } from '../auth/AuthView';
import { BrandWordmark } from './BrandWordmark';

export type NavView = 'home' | 'dashboard' | 'nutrition' | 'family';

interface NavbarProps {
  currentView: NavView;
  authUser: AuthUser | null;
  onNavigate: (view: NavView) => void;
  onOpenAICoach: () => void;
  onOpenAuth: (mode: AuthMode) => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, authUser, onNavigate, onOpenAICoach, onOpenAuth, onSignOut }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toggleTheme, isDark } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home' as NavView, label: 'Home', icon: Sparkles },
    { id: 'dashboard' as NavView, label: 'Dashboard', icon: Activity },
    { id: 'nutrition' as NavView, label: 'Nutrition', icon: Utensils },
    { id: 'family' as NavView, label: 'Family', icon: Users },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-3 bg-white/80 dark:bg-obsidian-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 shadow-glass-card-light dark:shadow-glass-card'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => {
            onNavigate('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 group text-left focus:outline-none"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-prana-500 to-emerald-700 p-0.5 shadow-glow-prana group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-white dark:bg-obsidian-950 rounded-[10px] flex items-center justify-center">
              <span className="font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-prana-400 to-surya-400 text-lg">
                FI
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-xl tracking-tight text-slate-900 dark:text-white group-hover:text-prana-500 dark:group-hover:text-prana-400 transition-colors">
                <BrandWordmark />
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-prana-500/20 text-prana-600 dark:text-prana-400 border border-prana-500/30">
                AI
              </span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
              India's Health Companion
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/60 dark:bg-obsidian-900/60 p-1.5 rounded-full border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-inner">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-prana-500 text-obsidian-950 font-semibold shadow-glow-prana'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-obsidian-950' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* AI Coach Button */}
          <button
            onClick={onOpenAICoach}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold text-surya-600 dark:text-surya-400 hover:bg-surya-500/10 border border-surya-500/30 transition-all duration-200"
          >
            <Bot className="w-3.5 h-3.5 text-surya-500 dark:text-surya-400 animate-pulse" />
            <span>AI Coach</span>
          </button>
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-200"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {authUser ? (
            <>
              <span className="max-w-36 truncate text-xs text-slate-600 dark:text-slate-300">Hi, {authUser.name}</span>
              <button onClick={onSignOut} className="px-3 py-2 text-xs font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onOpenAuth('sign-in')}
                className="text-xs font-medium text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors px-3 py-2"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="relative group overflow-hidden px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-prana-500 to-emerald-600 text-white hover:from-prana-400 hover:to-emerald-500 transition-all duration-300 shadow-glow-prana flex items-center gap-1.5 active:scale-95"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex lg:hidden items-center gap-2">
          {/* Mobile Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={onOpenAICoach}
            className="p-2 rounded-lg bg-surya-500/10 border border-surya-500/30 text-surya-500 dark:text-surya-400"
            aria-label="AI Coach"
          >
            <Bot className="w-5 h-5" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-obsidian-850 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-3 pb-5 bg-white/95 dark:bg-obsidian-950/95 border-b border-slate-200 dark:border-white/10 backdrop-blur-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-prana-500 text-obsidian-950 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <button
              onClick={() => {
                onOpenAICoach();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-surya-600 dark:text-surya-400 bg-surya-500/10 border border-surya-500/25"
            >
              <Bot className="w-4 h-4" />
              <span>Saathi AI Coach</span>
            </button>
            <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex flex-col gap-2">
              {authUser ? (
                <>
                  <span className="px-3 py-2 text-sm text-slate-600 dark:text-slate-300">Signed in as {authUser.name}</span>
                  <button
                    onClick={() => {
                      onSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full rounded-xl border border-slate-200 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      onOpenAuth('sign-in');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-3 text-center rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-white/5"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      onOpenAuth('register');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-3 text-center rounded-xl bg-gradient-to-r from-prana-500 to-emerald-600 text-white font-bold text-sm shadow-glow-prana"
                  >
                    Get Started Free
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
