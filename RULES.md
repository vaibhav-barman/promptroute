# 🔒 PromptRoute — Prompt Engineering Rules

## Purpose
These rules govern the system prompt and ensure the LLM (`qwen3.5:9b`) never breaks its structured JSON contract.

---

## Strict Compliance Rules

### Rule 1: JSON-Only Output
The model must respond with **exactly one JSON object**. No markdown code fences, no explanatory text, no greetings, no sign-offs.

**Enforced by:**
- Ollama `format: 'json'` parameter
- Explicit system prompt instruction
- Client-side validation as fallback

### Rule 2: Schema Fidelity
Every response must contain all required top-level keys:
- `destination` (string)
- `tripDurationDays` (number)
- `tripVibe` (string)
- `budgetSummary` (object with `tier`, `estimatedTotalINR`, `currencySymbol`)
- `itinerary` (array of day objects)

**Enforced by:**
- Complete schema definition in system prompt
- Client-side structural validation before render

### Rule 3: No Character Breaking
The model must not:
- ❌ Say "Sure! Here's your itinerary..."
- ❌ Add "I hope this helps!" or similar
- ❌ Wrap JSON in ```json ... ```
- ❌ Include `thinking` tags or reasoning traces
- ❌ Add comments inside JSON
- ❌ Return partial/truncated JSON

### Rule 4: Consistent Category Values
Activity categories must be exactly one of:
- `Sightseeing`
- `Food`
- `Adventure`
- `Relaxation`

No variations (e.g., "food & dining" ❌, "Dining" ❌).

### Rule 5: Realistic Cost Estimates
- Costs must be in INR (Indian Rupees)
- Values must be reasonable for the budget tier
- Budget: ₹500–2,000 per activity
- Mid-Range: ₹1,500–5,000 per activity  
- Luxury: ₹5,000–25,000 per activity

### Rule 6: Time Slot Formatting
All time slots must follow the pattern: `HH:MM AM/PM - HH:MM AM/PM`
- Use 12-hour format
- Include AM/PM markers
- Use hyphen separator with spaces

---

## Client-Side Guardrails

### JSON Extraction Fallback
```javascript
function extractJSON(text) {
  // Try direct parse
  try { return JSON.parse(text); } catch {}
  
  // Try extracting from markdown code fence
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (match) try { return JSON.parse(match[1]); } catch {}
  
  // Try finding the JSON object boundaries
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end > start) {
    try { return JSON.parse(text.slice(start, end + 1)); } catch {}
  }
  
  return null;
}
```

### Schema Validation
```javascript
function validateItinerary(data) {
  const required = ['destination', 'tripDurationDays', 'tripVibe', 'budgetSummary', 'itinerary'];
  return required.every(key => key in data) && Array.isArray(data.itinerary);
}
```

---

## Prompt Versioning

| Version | Date | Changes |
|---------|------|---------|
| v1.0 | 2026-10-17 | Initial schema with 6 activity fields |

All prompt changes should be tracked here to correlate with model behavior changes.
