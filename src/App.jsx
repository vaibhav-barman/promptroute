import { useState, useCallback, useEffect } from 'react';
import { Route, Zap, Sun, Moon } from 'lucide-react';
import SearchForm from './components/SearchForm';
import ItineraryTimeline from './components/ItineraryTimeline';
import LoadingSkeleton from './components/LoadingSkeleton';
import ErrorDisplay from './components/ErrorDisplay';
import { generateItinerary } from './utils/ollamaClient';

// -------------------------------------------
// App States: idle → loading → result | error
// -------------------------------------------

export default function App() {
  const [itinerary, setItinerary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastPreferences, setLastPreferences] = useState(null);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('promptroute_theme');
      if (saved) return saved;
    }
    return 'dark'; // Dark mode default
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('promptroute_theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const handleGenerate = useCallback(async (preferences) => {
    setIsLoading(true);
    setError(null);
    setItinerary(null);
    setLastPreferences(preferences);

    try {
      const result = await generateItinerary(preferences);
      setItinerary(result);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRetry = useCallback(() => {
    if (lastPreferences) {
      handleGenerate(lastPreferences);
    } else {
      setError(null);
    }
  }, [lastPreferences, handleGenerate]);

  const handleReset = useCallback(() => {
    setItinerary(null);
    setError(null);
    setIsLoading(false);
  }, []);

  const showForm = !isLoading && !itinerary;

  return (
    <div className="min-h-screen relative transition-colors duration-300">
      {/* Ambient background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30 dark:opacity-100 transition-opacity duration-300">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-brand-600/[0.08] dark:bg-brand-600/[0.04] blur-[120px] animate-float" />
        <div
          className="absolute bottom-[-15%] right-[-5%] w-[500px] h-[500px] rounded-full bg-accent-500/[0.06] dark:bg-accent-500/[0.03] blur-[100px] animate-float"
          style={{ animationDelay: '3s' }}
        />
        <div
          className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-brand-500/[0.05] dark:bg-brand-500/[0.02] blur-[80px] animate-float"
          style={{ animationDelay: '1.5s' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navbar */}
        <nav className="glass border-b sticky top-0 z-50 transition-colors duration-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <button
              onClick={handleReset}
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center shadow-sm">
                <Route className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-base font-bold font-[Outfit] text-slate-900 dark:text-white tracking-tight">
                Prompt<span className="text-brand-500 dark:text-brand-300">Route</span>
              </span>
            </button>

            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Local AI badge */}
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                Local AI
              </span>

              {/* High-visibility GitHub Button */}
              <a
                href="https://github.com/vaibhav-barman/promptroute"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View PromptRoute on GitHub"
                title="View PromptRoute on GitHub"
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-300 dark:border-white/15 bg-white/90 dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/20 text-slate-900 dark:text-white transition-all shadow-sm group cursor-pointer"
              >
                <svg
                  className="w-4 h-4 fill-slate-900 dark:fill-white group-hover:scale-110 transition-transform"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
                <span className="text-xs font-semibold">GitHub</span>
              </a>

              {/* Dark / Light Mode Toggle Button */}
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                className="p-1.5 sm:p-2 rounded-xl border border-slate-300 dark:border-white/15 bg-white/90 dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/20 text-slate-800 dark:text-white transition-all shadow-sm cursor-pointer flex items-center justify-center group"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-300 group-hover:rotate-45 transition-transform" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-600 group-hover:-rotate-12 transition-transform" />
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Hero section (only when idle) */}
          {showForm && !error && (
            <div className="text-center mb-10 animate-fade-in">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 dark:bg-brand-500/8 border border-brand-500/20 dark:border-brand-500/15 text-brand-700 dark:text-brand-400 text-[10px] font-semibold uppercase tracking-widest mb-4">
                <Zap className="w-3 h-3" />
                Powered by Ollama × qwen3.5:9b
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-[Outfit] text-slate-900 dark:text-white leading-tight mb-3">
                Your AI
                <span className="gradient-text"> Travel Architect</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-white/40 max-w-xl mx-auto leading-relaxed">
                Describe your dream trip and watch as local AI crafts a stunning,
                day-by-day itinerary — completely offline, completely private.
              </p>
            </div>
          )}

          {/* Form */}
          {showForm && <SearchForm onSubmit={handleGenerate} isLoading={isLoading} />}

          {/* Loading State */}
          {isLoading && <LoadingSkeleton />}

          {/* Error State */}
          {error && !isLoading && <ErrorDisplay error={error} onRetry={handleRetry} />}

          {/* Result State */}
          {itinerary && !isLoading && (
            <div className="space-y-6">
              <ItineraryTimeline data={itinerary} />

              {/* Generate another */}
              <div className="flex justify-center">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-300 dark:border-white/[0.08] text-slate-700 dark:text-white/50 text-sm font-medium hover:bg-slate-200 dark:hover:bg-white/[0.08] hover:text-slate-900 dark:hover:text-white/70 transition-all duration-200 cursor-pointer shadow-sm"
                >
                  ← Plan Another Trip
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
