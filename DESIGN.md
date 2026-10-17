# 🎨 PromptRoute — Design System Document

## Design Philosophy
PromptRoute uses a **dark-first, glassmorphic** design system built with Tailwind CSS v4 custom themes. Every JSON schema key from the LLM response maps to a specific visual component.

---

## Color System (OKLCH)

| Token | Usage | Value |
|-------|-------|-------|
| `brand-500` | Primary actions, active states | `oklch(0.55 0.22 260)` — Deep indigo |
| `accent-500` | Highlights, budget counters | `oklch(0.75 0.18 75)` — Warm amber |
| `surface-950` | Page background | `oklch(0.12 0.02 260)` — Near-black |
| `surface-800` | Card backgrounds | `oklch(0.21 0.02 260)` — Dark slate |
| `success` | Positive indicators | `oklch(0.72 0.19 155)` — Emerald |
| `warning` | Budget warnings | `oklch(0.80 0.16 80)` — Amber |
| `danger` | Error states | `oklch(0.65 0.22 25)` — Coral |

---

## JSON → UI Component Mapping

### Root Level
| JSON Key | Component | Visual Treatment |
|----------|-----------|-----------------|
| `destination` | Hero header | `gradient-text` utility, `font-display`, 3xl+ |
| `tripVibe` | Subtitle badge | Glass pill with `accent-400` border |
| `tripDurationDays` | Duration chip | Rounded badge with calendar icon |

### Budget Summary
| JSON Key | Component | Visual Treatment |
|----------|-----------|-----------------|
| `budgetSummary.tier` | Tier badge | Color-coded: Budget=green, Mid=amber, Luxury=purple |
| `budgetSummary.estimatedTotalINR` | Animated counter | Number rolls up with `tabular-nums` font |
| `budgetSummary.currencySymbol` | Prefix label | Monospace, smaller opacity |

### Itinerary Days
| JSON Key | Component | Visual Treatment |
|----------|-----------|-----------------|
| `itinerary[].dayNumber` | Timeline node | Circular badge on vertical line |
| `itinerary[].dayTheme` | Day section header | Semi-bold with theme-appropriate icon |
| `itinerary[].schedule` | Card grid | Staggered `slide-up` animation |

### Schedule Activities
| JSON Key | Component | Visual Treatment |
|----------|-----------|-----------------|
| `timeSlot` | Time badge | Mono font, `surface-700` background |
| `activityName` | Card title | Bold, white |
| `category` | Category badge | Lucide icon + color-coded pill |
| `description` | Card body | `text-sm`, slightly dimmed |
| `costEstimateINR` | Cost tag | Right-aligned, accent color |
| `visualHookHint` | Background tint | Maps to category gradient overlay |

---

## Category Badge Mapping (Lucide Icons)

| Category | Icon | Badge Color |
|----------|------|-------------|
| Sightseeing | `Camera` | `brand-400` |
| Food | `UtensilsCrossed` | `accent-500` |
| Adventure | `Mountain` | `success` |
| Relaxation | `Waves` | `info` |

---

## Interactive Components

### Loading Skeleton
- `shimmer-bg` utility class with animated gradient
- Skeleton shapes mirror final layout for minimal layout shift
- 3 skeleton day cards with 4 activity placeholders each

### Timeline
- Vertical line with `surface-700` color
- Circular day nodes with `brand-500` fill
- Staggered entry animations (50ms delay per card)

### Budget Counter
- Animated number using `requestAnimationFrame`
- Easing: cubic-bezier for smooth deceleration
- Format: `₹XX,XXX` with Indian numbering

---

## Typography Stack
| Usage | Font | Weight |
|-------|------|--------|
| Display headings | Outfit | 700 |
| Body text | Inter | 400 |
| Monospace (times, costs) | JetBrains Mono | 500 |

Loaded via Google Fonts CDN in `index.html`.

---

## Responsive Breakpoints
| Breakpoint | Layout |
|------------|--------|
| `< 640px` | Single column, stacked cards |
| `640–1024px` | Two-column grid |
| `> 1024px` | Full timeline layout with sidebar |
