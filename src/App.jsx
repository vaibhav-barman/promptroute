import { useState, useCallback } from 'react';
import { Route, Zap, ExternalLink } from 'lucide-react';
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
    <div className="min-h-screen bg-surface-950 relative">
      {/* Ambient background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-brand-600/[0.04] blur-[120px] animate-float" />
        <div
          className="absolute bottom-[-15%] right-[-5%] w-[500px] h-[500px] rounded-full bg-accent-500/[0.03] blur-[100px] animate-float"
          style={{ animationDelay: '3s' }}
        />
        <div
          className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-brand-500/[0.02] blur-[80px] animate-float"
          style={{ animationDelay: '1.5s' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navbar */}
        <nav className="glass border-b border-white/[0.04] sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <button
              onClick={handleReset}
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
                <Route className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-base font-bold font-[Outfit] text-white tracking-tight">
                Prompt<span className="text-brand-300">Route</span>
              </span>
            </button>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-medium uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Local AI
              </span>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Hero section (only when idle) */}
          {showForm && !error && (
            <div className="text-center mb-10 animate-fade-in">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/8 border border-brand-500/15 text-brand-400 text-[10px] font-semibold uppercase tracking-widest mb-4">
                <Zap className="w-3 h-3" />
                Powered by Ollama × qwen3.5:9b
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-[Outfit] text-white leading-tight mb-3">
                Your AI
                <span className="gradient-text"> Travel Architect</span>
              </h1>
              <p className="text-base sm:text-lg text-white/40 max-w-xl mx-auto leading-relaxed">
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
                  className="px-6 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/50 text-sm font-medium hover:bg-white/[0.08] hover:text-white/70 transition-all duration-200 cursor-pointer"
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
