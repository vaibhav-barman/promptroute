import { MapPin, Clock, Sparkles, Calendar, IndianRupee } from 'lucide-react';
import CategoryBadge from './CategoryBadge';
import BudgetCard from './BudgetCard';

// -------------------------------------------
// Format INR inline
// -------------------------------------------
function formatCost(num) {
  if (!num && num !== 0) return '';
  return `₹${num.toLocaleString('en-IN')}`;
}

// -------------------------------------------
// Hero Header
// -------------------------------------------
function HeroHeader({ destination, tripVibe, tripDurationDays }) {
  return (
    <div className="glass-card p-6 sm:p-8 animate-slide-up relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-brand-500/10 dark:bg-brand-500/8 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-accent-500/10 dark:bg-accent-500/6 blur-3xl pointer-events-none" />

      <div className="relative space-y-3">
        <div className="flex items-center gap-2 text-slate-500 dark:text-white/40">
          <MapPin className="w-4 h-4 text-brand-500 dark:text-brand-400" />
          <span className="text-xs font-semibold uppercase tracking-wider">Your Destination</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-[Outfit] gradient-text leading-tight">
          {destination}
        </h1>

        <div className="flex flex-wrap items-center gap-2.5 mt-2">
          {/* Vibe pill */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-500/15 border border-accent-500/30 text-amber-800 dark:text-accent-400 text-xs font-semibold">
            <Sparkles className="w-3 h-3 text-amber-600 dark:text-accent-400" />
            {tripVibe}
          </span>

          {/* Duration pill */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-white/50 text-xs font-medium">
            <Calendar className="w-3 h-3 text-slate-500 dark:text-white/40" />
            {tripDurationDays} {tripDurationDays === 1 ? 'Day' : 'Days'}
          </span>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------
// Activity Card
// -------------------------------------------
function ActivityCard({ activity, index }) {
  const { timeSlot, activityName, category, description, costEstimateINR, visualHookHint } = activity;

  return (
    <div
      className="glass-card p-4 sm:p-5 hover:bg-slate-50/90 dark:hover:bg-white/[0.04] transition-all duration-300 group animate-slide-up flex flex-col justify-between"
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'backwards' }}
    >
      <div>
        {/* Top row: time + category */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-surface-800 border border-slate-200/80 dark:border-transparent text-slate-700 dark:text-white/60 text-xs font-mono font-medium">
            <Clock className="w-3 h-3 text-slate-400" />
            {timeSlot}
          </span>
          <CategoryBadge category={category} />
        </div>

        {/* Activity name */}
        <h4 className="text-base font-semibold text-slate-900 dark:text-white mb-1.5 group-hover:text-brand-600 dark:group-hover:text-brand-200 transition-colors duration-200">
          {activityName}
        </h4>

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-white/50 leading-relaxed mb-4">
          {description}
        </p>
      </div>

      {/* Footer row: Cost & visualHookHint */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-200/80 dark:border-white/[0.04] mt-auto">
        {costEstimateINR > 0 ? (
          <div className="flex items-center gap-1 text-amber-700 dark:text-accent-400 text-sm font-mono font-bold">
            <IndianRupee className="w-3.5 h-3.5" />
            <span>{formatCost(costEstimateINR).replace('₹', '')}</span>
          </div>
        ) : (
          <span className="text-xs text-slate-400 dark:text-white/30 font-mono">Free / Included</span>
        )}

        {visualHookHint && (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/10 px-2 py-0.5 rounded-md border border-brand-200 dark:border-brand-500/15">
            <Sparkles className="w-2.5 h-2.5 text-accent-500" />
            {visualHookHint}
          </span>
        )}
      </div>
    </div>
  );
}

// -------------------------------------------
// Day Section
// -------------------------------------------
function DaySection({ day, dayIndex }) {
  const { dayNumber, dayTheme, schedule } = day;

  return (
    <div
      className="animate-slide-up"
      style={{ animationDelay: `${dayIndex * 120}ms`, animationFillMode: 'backwards' }}
    >
      <div className="flex items-start gap-4">
        {/* Timeline node */}
        <div className="flex flex-col items-center flex-shrink-0 pt-1">
          <div className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center text-white font-bold text-sm font-mono shadow-md glow-ring">
            {dayNumber}
          </div>
          {/* Vertical line */}
          <div className="w-px flex-1 bg-gradient-to-b from-brand-500/50 to-transparent mt-2 min-h-[2rem]" />
        </div>

        {/* Day content */}
        <div className="flex-1 pb-8 space-y-3">
          {/* Day header */}
          <div className="pt-1.5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-[Outfit]">
              Day {dayNumber}
            </h3>
            <p className="text-sm text-brand-700 dark:text-brand-300/80 font-semibold">
              {dayTheme}
            </p>
          </div>

          {/* Activity cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(schedule || []).map((activity, i) => (
              <ActivityCard key={i} activity={activity} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------
// Main Timeline Component
// -------------------------------------------
export default function ItineraryTimeline({ data }) {
  if (!data) return null;

  const { destination, tripDurationDays, tripVibe, budgetSummary, itinerary } = data;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5">
      {/* Hero */}
      <HeroHeader
        destination={destination}
        tripVibe={tripVibe}
        tripDurationDays={tripDurationDays}
      />

      {/* Budget */}
      {budgetSummary && <BudgetCard budgetSummary={budgetSummary} />}

      {/* Timeline */}
      <div className="space-y-0">
        {(itinerary || []).map((day, i) => (
          <DaySection key={day.dayNumber || i} day={day} dayIndex={i} />
        ))}
      </div>

      {/* Footer */}
      <div className="text-center py-6">
        <p className="text-xs text-slate-400 dark:text-white/20 font-mono">
          ✦ Generated by PromptRoute × Ollama (qwen3.5:9b) — fully local, zero cloud ✦
        </p>
      </div>
    </div>
  );
}
