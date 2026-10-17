# 🧠 PromptRoute — Memory & State Architecture

## The Stateless LLM Challenge
LLMs are inherently stateless — each request to Ollama is independent with no memory of previous conversations. PromptRoute must manage all state client-side.

---

## State Architecture

### React State Tree
```
App State
├── formState            (user preferences)
│   ├── destination      string
│   ├── days             number (1–14)
│   ├── budget           "Budget" | "Mid-Range" | "Luxury"
│   └── vibes            string[] (selected tags)
│
├── uiState              (application status)
│   ├── isLoading        boolean
│   ├── error            { type, message } | null
│   └── hasResult        boolean
│
└── itineraryState       (LLM response data)
    ├── destination      string
    ├── tripDurationDays number
    ├── tripVibe         string
    ├── budgetSummary    object
    └── itinerary        DayObject[]
```

### State Flow
```
┌─────────────┐    Submit     ┌──────────────┐    Response   ┌────────────────┐
│  Form State │ ─────────►  │  Loading      │ ──────────►  │ Itinerary      │
│  (editing)  │              │  (shimmer)    │              │ (rendered)     │
└─────────────┘              └──────────────┘              └────────────────┘
       ▲                           │                              │
       │                     Error │                              │
       │                           ▼                              │
       │                    ┌──────────────┐                      │
       └────────────────── │  Error State  │ ◄────────────────────┘
         "Try Again"       │  (toast/modal)│    "Generate Again"
                           └──────────────┘
```

---

## State Persistence Strategy

### Session-Level (Current Implementation)
- All state lives in React `useState` hooks
- Cleared on page refresh
- Suitable for MVP iteration

### Future: LocalStorage Persistence
```javascript
// Save last successful itinerary
localStorage.setItem('promptroute_last', JSON.stringify(itinerary));

// Save user preference history
const history = JSON.parse(localStorage.getItem('promptroute_history') || '[]');
history.push({ timestamp: Date.now(), preferences: formState });
localStorage.setItem('promptroute_history', JSON.stringify(history.slice(-10)));
```

### Future: Context Accumulation
For multi-turn refinement (e.g., "make day 2 more adventurous"):
```javascript
const messages = [
  { role: 'system', content: SYSTEM_PROMPT },
  { role: 'user', content: originalPrompt },
  { role: 'assistant', content: JSON.stringify(previousItinerary) },
  { role: 'user', content: refinementPrompt }
];
```

---

## Error State Memory

| Error Type | Recovery | State After |
|------------|----------|-------------|
| `CONNECTION_ERROR` | Show setup modal | Form state preserved |
| `PARSE_ERROR` | Auto-retry once | Loading maintained |
| `TIMEOUT_ERROR` | Offer shorter trip | Form state preserved |
| `MODEL_ERROR` | Show pull instructions | Form state preserved |

The key principle: **never lose user input on error**. Form state is preserved across all error boundaries.
