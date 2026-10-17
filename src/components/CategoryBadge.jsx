import { Camera, UtensilsCrossed, Mountain, Waves } from 'lucide-react';

const CATEGORY_CONFIG = {
  Sightseeing: {
    icon: Camera,
    bg: 'bg-brand-400/15',
    border: 'border-brand-400/25',
    text: 'text-brand-300',
    dot: 'bg-brand-400',
  },
  Food: {
    icon: UtensilsCrossed,
    bg: 'bg-amber-400/15',
    border: 'border-amber-400/25',
    text: 'text-amber-300',
    dot: 'bg-amber-400',
  },
  Adventure: {
    icon: Mountain,
    bg: 'bg-emerald-400/15',
    border: 'border-emerald-400/25',
    text: 'text-emerald-300',
    dot: 'bg-emerald-400',
  },
  Relaxation: {
    icon: Waves,
    bg: 'bg-sky-400/15',
    border: 'border-sky-400/25',
    text: 'text-sky-300',
    dot: 'bg-sky-400',
  },
};

export default function CategoryBadge({ category }) {
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.Sightseeing;
  const Icon = config.icon;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
        ${config.bg} ${config.border} ${config.text}
        border transition-colors duration-200
      `}
    >
      <Icon className="w-3 h-3" />
      {category}
    </span>
  );
}
