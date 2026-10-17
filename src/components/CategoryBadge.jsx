import { Camera, UtensilsCrossed, Mountain, Waves } from 'lucide-react';

const CATEGORY_CONFIG = {
  Sightseeing: {
    icon: Camera,
    bg: 'bg-indigo-50 dark:bg-brand-400/15',
    border: 'border-indigo-200 dark:border-brand-400/25',
    text: 'text-indigo-700 dark:text-brand-300',
  },
  Food: {
    icon: UtensilsCrossed,
    bg: 'bg-amber-50 dark:bg-amber-400/15',
    border: 'border-amber-200 dark:border-amber-400/25',
    text: 'text-amber-800 dark:text-amber-300',
  },
  Adventure: {
    icon: Mountain,
    bg: 'bg-emerald-50 dark:bg-emerald-400/15',
    border: 'border-emerald-200 dark:border-emerald-400/25',
    text: 'text-emerald-800 dark:text-emerald-300',
  },
  Relaxation: {
    icon: Waves,
    bg: 'bg-sky-50 dark:bg-sky-400/15',
    border: 'border-sky-200 dark:border-sky-400/25',
    text: 'text-sky-800 dark:text-sky-300',
  },
};

export default function CategoryBadge({ category }) {
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.Sightseeing;
  const Icon = config.icon;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
        ${config.bg} ${config.border} ${config.text}
        border transition-colors duration-200 shadow-xs
      `}
    >
      <Icon className="w-3 h-3" />
      {category}
    </span>
  );
}
