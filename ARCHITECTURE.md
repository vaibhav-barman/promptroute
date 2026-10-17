# 🏗 PromptRoute — Architecture Document

## Backend-as-a-Prompt (BaaP)

PromptRoute introduces the **Backend-as-a-Prompt** paradigm: instead of writing REST controllers, database models, and business logic, the entire backend is a single system prompt executed by a local LLM.

```
┌──────────────────┐     HTTP POST      ┌──────────────────┐
│                  │  ──────────────►    │                  │
│   React Client   │   /api/generate    │   Ollama Server  │
│   (Vite + TW)    │                    │   localhost:11434 │
│                  │  ◄──────────────   │   qwen3.5:9b     │
│                  │   Structured JSON  │                  │
└──────────────────┘                    └──────────────────┘
```

---

## How It Works

### 1. Request Flow
```
User Input → Build Prompt → POST to Ollama → Parse JSON → Render UI
```

### 2. Ollama API Configuration
```javascript
const response = await ollama.chat({
  model: 'qwen3.5:9b',
  messages: [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user',   content: buildUserPrompt(preferences) }
  ],
  format: 'json',   // Forces JSON-mode output
  stream: false      // Wait for complete response
});
```

Key design decisions:
- **`format: 'json'`**: Ollama's native JSON mode constrains the model to output valid JSON
- **`stream: false`**: We wait for the full response since partial JSON is unparseable
- **System prompt**: Contains the complete schema definition and compliance rules
- **User prompt**: Dynamically constructed from form inputs

### 3. The Schema Contract
The LLM is instructed to produce a fixed JSON shape:

```json
{
  "destination": "string",
  "tripDurationDays": "number",
  "tripVibe": "string",
  "budgetSummary": {
    "tier": "Budget | Mid-Range | Luxury",
    "estimatedTotalINR": "number",
    "currencySymbol": "₹"
  },
  "itinerary": [
    {
      "dayNumber": "number",
      "dayTheme": "string",
      "schedule": [
        {
          "timeSlot": "string",
          "activityName": "string",
          "category": "Sightseeing | Food | Adventure | Relaxation",
          "description": "string",
          "costEstimateINR": "number",
          "visualHookHint": "string"
        }
      ]
    }
  ]
}
```

### 4. Error Boundary Strategy
```
Ollama unreachable → CONNECTION_ERROR → Show setup modal
Model not found    → MODEL_ERROR     → Prompt to pull model
Invalid JSON       → PARSE_ERROR     → Retry once, then error toast
Timeout (>60s)     → TIMEOUT_ERROR   → Abort + suggest shorter trip
```

---

## Why Not a Traditional Backend?

| Traditional API | Backend-as-a-Prompt |
|-----------------|---------------------|
| Weeks of development | Minutes of prompt engineering |
| Database schema migrations | Schema lives in the prompt |
| Deployment infrastructure | Local Ollama binary |
| Rate limits & API keys | Unlimited local inference |
| Rigid business logic | Flexible, creative responses |

---

## Trade-offs & Mitigations

| Risk | Mitigation |
|------|------------|
| Non-deterministic output | JSON mode + strict schema in system prompt |
| Slow inference | Loading skeletons + user expectations set |
| Schema drift | Client-side validation with fallbacks |
| No persistence | Client-side state management (see MEMORY.md) |
