import { useState, useEffect } from 'react';
import { Loader2, Sparkles, Clock } from 'lucide-react';

export default function LoadingSkeleton() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Dynamic milestone message based on typical local model execution phases
  const getPhaseMessage = () => {
    if (seconds < 6) return 'Initializing qwen3.5:9b & loading prompt context...';
    if (seconds < 20) return 'Local neural reasoning: Curating authentic spots & matching vibes...';
    if (seconds < 38) return 'Structuring timeline schedules & computing INR budget estimates...';
    return 'Finalizing schema validation & assembling structured JSON...';
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Real-time generation status banner */}
      <div className="glass-card p-4 sm:p-5 border border-brand-500/25 bg-brand-500/5 dark:bg-brand-500/10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent-500 dark:text-accent-400" />
                {getPhaseMessage()}
              </p>
              <p className="text-xs text-slate-500 dark:text-white/40 mt-0.5">
                Local inference on Apple Silicon / GPU — zero cloud latency, 100% private
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-surface-800 border border-slate-200 dark:border-white/[0.06] text-brand-700 dark:text-brand-300 font-mono text-sm font-semibold">
            <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-white/40" />
            <span>{seconds}s elapsed</span>
          </div>
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="glass-card p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full shimmer-bg" />
          <div className="space-y-2 flex-1">
            <div className="h-7 w-64 rounded-lg shimmer-bg" />
            <div className="h-4 w-48 rounded-md shimmer-bg" />
          </div>
        </div>
        <div className="flex gap-3 mt-2">
          <div className="h-8 w-24 rounded-full shimmer-bg" />
          <div className="h-8 w-32 rounded-full shimmer-bg" />
          <div className="h-8 w-28 rounded-full shimmer-bg" />
        </div>
      </div>

      {/* Budget skeleton */}
      <div className="glass-card p-5 flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-3 w-20 rounded shimmer-bg" />
          <div className="h-8 w-36 rounded-lg shimmer-bg" />
        </div>
        <div className="h-10 w-24 rounded-xl shimmer-bg" />
      </div>

      {/* Day cards skeleton */}
      {[1, 2, 3].map((day) => (
        <div key={day} className="space-y-3">
          {/* Day header */}
          <div className="flex items-center gap-3 pl-2">
            <div className="w-8 h-8 rounded-full shimmer-bg" />
            <div className="h-5 w-40 rounded shimmer-bg" />
          </div>

          {/* Activity cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-12">
            {[1, 2, 3, 4].map((activity) => (
              <div key={activity} className="glass-card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-5 w-28 rounded shimmer-bg" />
                  <div className="h-5 w-16 rounded-full shimmer-bg" />
                </div>
                <div className="h-4 w-full rounded shimmer-bg" />
                <div className="h-4 w-3/4 rounded shimmer-bg" />
                <div className="flex items-center justify-between mt-1">
                  <div className="h-4 w-20 rounded shimmer-bg" />
                  <div className="h-4 w-16 rounded shimmer-bg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Info footer */}
      <div className="text-center py-2">
        <p className="text-xs text-slate-500 dark:text-white/30 font-mono">
          💡 Pro-tip: 2–3 day trips generate ~2x faster than 7+ days on 9B models
        </p>
      </div>
    </div>
  );
}
