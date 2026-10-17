import { useEffect, useRef, useState } from 'react';
import { IndianRupee, TrendingUp, Gem, Coins, Crown } from 'lucide-react';

// -------------------------------------------
// Animated counter hook
// -------------------------------------------
function useAnimatedCounter(target, duration = 1200) {
  const [value, setValue] = useState(0);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!target || target <= 0) {
      setValue(0);
      return;
    }

    const startTime = performance.now();
    const startValue = 0;

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (target - startValue) * eased);

      setValue(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    }

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration]);

  return value;
}

// -------------------------------------------
// Format INR with Indian comma notation
// -------------------------------------------
function formatINR(num) {
  if (!num) return '0';
  const str = num.toString();
  let result = '';
  const len = str.length;

  if (len <= 3) return str;

  result = str.slice(-3);
  let remaining = str.slice(0, -3);

  while (remaining.length > 2) {
    result = remaining.slice(-2) + ',' + result;
    remaining = remaining.slice(0, -2);
  }

  if (remaining.length > 0) {
    result = remaining + ',' + result;
  }

  return result;
}

// -------------------------------------------
// Tier visual config
// -------------------------------------------
const TIER_CONFIG = {
  Budget: {
    icon: Coins,
    gradient: 'from-emerald-500/20 to-emerald-600/5',
    border: 'border-emerald-500/20',
    text: 'text-emerald-300',
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
  },
  'Mid-Range': {
    icon: TrendingUp,
    gradient: 'from-amber-500/20 to-amber-600/5',
    border: 'border-amber-500/20',
    text: 'text-amber-300',
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
  },
  Luxury: {
    icon: Crown,
    gradient: 'from-purple-500/20 to-purple-600/5',
    border: 'border-purple-500/20',
    text: 'text-purple-300',
    badge: 'bg-purple-500/15 text-purple-300 border-purple-500/25',
  },
};

export default function BudgetCard({ budgetSummary }) {
  const { tier, estimatedTotalINR, currencySymbol } = budgetSummary;
  const animatedValue = useAnimatedCounter(estimatedTotalINR);
  const config = TIER_CONFIG[tier] || TIER_CONFIG['Mid-Range'];
  const TierIcon = config.icon;

  return (
    <div
      className={`
        glass-card p-5 sm:p-6 bg-gradient-to-r ${config.gradient}
        animate-slide-up
      `}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left: Budget info */}
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-white/40 uppercase tracking-wider">
            Estimated Total Budget
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-white/40 text-lg font-mono">
              {currencySymbol}
            </span>
            <span className="text-3xl sm:text-4xl font-bold text-white font-mono tabular-nums tracking-tight">
              {formatINR(animatedValue)}
            </span>
          </div>
        </div>

        {/* Right: Tier badge */}
        <div
          className={`
            flex items-center gap-2 px-4 py-2.5 rounded-xl border
            ${config.badge}
            text-sm font-semibold
          `}
        >
          <TierIcon className="w-4.5 h-4.5" />
          {tier}
        </div>
      </div>
    </div>
  );
}
