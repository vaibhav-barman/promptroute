import { useState } from 'react';
import {
  MapPin,
  Calendar,
  Wallet,
  Sparkles,
  Compass,
  Send,
  Loader2,
  Mountain,
  Wine,
  Palette,
  UtensilsCrossed,
  Heart,
  Moon,
} from 'lucide-react';

// -------------------------------------------
// Vibe options with icons
// -------------------------------------------
const VIBE_OPTIONS = [
  { label: 'Adventure', icon: Mountain, color: 'text-emerald-500 dark:text-emerald-400' },
  { label: 'Relaxation', icon: Wine, color: 'text-sky-500 dark:text-sky-400' },
  { label: 'Culture', icon: Palette, color: 'text-violet-500 dark:text-violet-400' },
  { label: 'Foodie', icon: UtensilsCrossed, color: 'text-amber-500 dark:text-amber-400' },
  { label: 'Romantic', icon: Heart, color: 'text-rose-500 dark:text-rose-400' },
  { label: 'Nightlife', icon: Moon, color: 'text-indigo-500 dark:text-indigo-400' },
];

const BUDGET_TIERS = ['Budget', 'Mid-Range', 'Luxury'];

export default function SearchForm({ onSubmit, isLoading }) {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState('Mid-Range');
  const [vibes, setVibes] = useState([]);

  function toggleVibe(vibe) {
    setVibes((prev) =>
      prev.includes(vibe) ? prev.filter((v) => v !== vibe) : [...prev, vibe]
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!destination.trim()) return;
    onSubmit({ destination: destination.trim(), days, budget, vibes });
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="glass-card p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-700 dark:text-brand-300 text-xs font-semibold tracking-wide uppercase">
            <Compass className="w-3.5 h-3.5" />
            AI-Powered Planner
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-[Outfit] text-slate-900 dark:text-white">
            Where to next?
          </h2>
          <p className="text-sm text-slate-600 dark:text-white/50">
            Tell us your dream trip and our AI will craft the perfect itinerary
          </p>
        </div>

        {/* Destination Input */}
        <div className="space-y-2">
          <label
            htmlFor="destination"
            className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-white/70"
          >
            <MapPin className="w-4 h-4 text-brand-500 dark:text-brand-400" />
            Destination
          </label>
          <input
            id="destination"
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g. Tokyo, Bali, Paris, Goa..."
            required
            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/[0.04] border border-slate-300 dark:border-white/[0.08] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/25 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200 text-base shadow-xs dark:shadow-none"
          />
        </div>

        {/* Days Slider */}
        <div className="space-y-3">
          <label
            htmlFor="days"
            className="flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-white/70"
          >
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-500 dark:text-brand-400" />
              Duration
            </span>
            <span className="text-brand-600 dark:text-brand-300 font-mono font-bold text-base tabular-nums">
              {days} {days === 1 ? 'day' : 'days'}
            </span>
          </label>
          <div className="relative">
            <input
              id="days"
              type="range"
              min="1"
              max="14"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer bg-slate-200 dark:bg-white/[0.06]
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-500 dark:[&::-webkit-slider-thumb]:bg-brand-400 [&::-webkit-slider-thumb]:shadow-[0_0_12px_oklch(0.55_0.22_260/0.4)] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-150 [&::-webkit-slider-thumb]:hover:scale-125
                [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-brand-500 dark:[&::-moz-range-thumb]:bg-brand-400 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
            />
            <div className="flex justify-between mt-1.5 px-0.5">
              <span className="text-[10px] text-slate-500 dark:text-white/35 font-mono font-medium">1</span>
              <span className="text-[10px] text-slate-500 dark:text-white/35 font-mono font-medium">7</span>
              <span className="text-[10px] text-slate-500 dark:text-white/35 font-mono font-medium">14</span>
            </div>
          </div>
        </div>

        {/* Budget Tier */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-white/70">
            <Wallet className="w-4 h-4 text-brand-500 dark:text-brand-400" />
            Budget Tier
          </label>
          <div className="grid grid-cols-3 gap-2">
            {BUDGET_TIERS.map((tier) => {
              const isActive = budget === tier;
              return (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setBudget(tier)}
                  className={`
                    py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer
                    ${
                      isActive
                        ? 'bg-brand-500/15 dark:bg-brand-500/20 border-brand-500 dark:border-brand-500/40 text-brand-800 dark:text-brand-200 shadow-sm dark:shadow-[0_0_20px_oklch(0.55_0.22_260/0.15)] ring-1 ring-brand-500/30'
                        : 'bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/[0.06] text-slate-700 dark:text-white/50 hover:bg-slate-100 dark:hover:bg-white/[0.06] hover:text-slate-900 dark:hover:text-white/70'
                    }
                    border
                  `}
                >
                  {tier === 'Budget' && '💰'}
                  {tier === 'Mid-Range' && '✨'}
                  {tier === 'Luxury' && '👑'}
                  <span className="ml-1.5">{tier}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Vibe Tags */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-white/70">
            <Sparkles className="w-4 h-4 text-brand-500 dark:text-brand-400" />
            Trip Vibes
            <span className="text-slate-500 dark:text-white/40 font-normal text-xs">(pick any)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {VIBE_OPTIONS.map(({ label, icon: Icon, color }) => {
              const isActive = vibes.includes(label);
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => toggleVibe(label)}
                  className={`
                    inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer
                    ${
                      isActive
                        ? 'bg-brand-500/15 dark:bg-brand-500/15 border-brand-500/50 dark:border-brand-400/30 text-brand-900 dark:text-white scale-[1.02] shadow-sm font-semibold'
                        : 'bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/[0.06] text-slate-700 dark:text-white/45 hover:bg-slate-100 dark:hover:bg-white/[0.06] hover:text-slate-900 dark:hover:text-white/65'
                    }
                    border
                  `}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? color : 'text-slate-500 dark:text-white/30'}`} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !destination.trim()}
          className={`
            w-full py-3.5 rounded-xl font-semibold text-base transition-all duration-300 cursor-pointer
            flex items-center justify-center gap-2.5
            ${
              isLoading || !destination.trim()
                ? 'bg-slate-200 dark:bg-white/[0.05] text-slate-400 dark:text-white/25 cursor-not-allowed'
                : 'gradient-brand text-white shadow-lg hover:shadow-[0_0_30px_oklch(0.55_0.22_260/0.3)] hover:scale-[1.01] active:scale-[0.99]'
            }
          `}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Crafting your journey...</span>
            </>
          ) : (
            <>
              <Send className="w-4.5 h-4.5" />
              <span>Generate Itinerary</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
