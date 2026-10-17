import { Ollama } from 'ollama/browser';

// ============================================
// PromptRoute — Ollama Backend Client
// Backend-as-a-Prompt: LLM replaces REST API
// ============================================

const ollama = new Ollama({ host: 'http://localhost:11434' });

const MODEL = 'qwen3.5:9b';

// -------------------------------------------
// System Prompt — The "Backend Logic"
// -------------------------------------------
const SYSTEM_PROMPT = `You are a highly advanced travel itinerary backend engine. Your sole job is to process user vacation requests and output structured data. 

CRITICAL COMPLIANCE RULES:
1. You must respond ONLY with a single, minified, valid JSON object matching the schema below.
2. Do NOT wrap the response in markdown blocks (like \`\`\`json ... \`\`\`). 
3. Do NOT include any conversational intro, outro, or explanations. 

EXPECTED JSON SCHEMA STRUCTURE:
{
  "destination": "City, Country name",
  "tripDurationDays": 3,
  "tripVibe": "An aesthetic tagline describing the curated mood of the trip",
  "budgetSummary": { "tier": "Budget / Mid-Range / Luxury", "estimatedTotalINR": 45000, "currencySymbol": "₹" },
  "itinerary": [
    {
      "dayNumber": 1,
      "dayTheme": "Theme of the day",
      "schedule": [
        {
          "timeSlot": "09:00 AM - 11:30 AM",
          "activityName": "Activity Name",
          "category": "Sightseeing / Food / Adventure / Relaxation",
          "description": "Engaging descriptive text.",
          "costEstimateINR": 500,
          "visualHookHint": "keyword-string"
        }
      ]
    }
  ]
}
`;

// -------------------------------------------
// Build the user prompt from form data
// -------------------------------------------
function buildUserPrompt({ destination, days, budget, vibes }) {
  const vibeString = vibes.length > 0 ? vibes.join(', ') : 'balanced mix of experiences';

  return `Plan a ${days}-day trip to ${destination}. 
Budget tier: ${budget}. 
Desired vibes: ${vibeString}. 
Provide 3-4 concise, high-impact activities per day. Output the minified JSON directly.`;
}

// -------------------------------------------
// JSON extraction with fallback strategies
// -------------------------------------------
function extractJSON(text) {
  // Strategy 1: Direct parse
  try {
    return JSON.parse(text);
  } catch {
    // continue to fallbacks
  }

  // Strategy 2: Strip markdown code fences
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1].trim());
    } catch {
      // continue
    }
  }

  // Strategy 3: Extract JSON object boundaries
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end > start) {
    try {
      return JSON.parse(text.slice(start, end + 1));
    } catch {
      // continue
    }
  }

  return null;
}

// -------------------------------------------
// Schema validation
// -------------------------------------------
function validateItinerary(data) {
  if (!data || typeof data !== 'object') return false;

  const requiredKeys = ['destination', 'tripDurationDays', 'tripVibe', 'budgetSummary', 'itinerary'];
  const hasAllKeys = requiredKeys.every((key) => key in data);
  if (!hasAllKeys) return false;

  if (!Array.isArray(data.itinerary) || data.itinerary.length === 0) return false;

  const budgetKeys = ['tier', 'estimatedTotalINR', 'currencySymbol'];
  const hasbudgetKeys = budgetKeys.every((key) => key in (data.budgetSummary || {}));
  if (!hasbudgetKeys) return false;

  // Validate at least first day has schedule
  const firstDay = data.itinerary[0];
  if (!firstDay || !Array.isArray(firstDay.schedule) || firstDay.schedule.length === 0) return false;

  return true;
}

// -------------------------------------------
// Main API: Generate Itinerary
// -------------------------------------------
export async function generateItinerary(preferences, { signal } = {}) {
  const userPrompt = buildUserPrompt(preferences);

  try {
    const response = await ollama.chat({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      format: 'json',
      stream: false,
      options: {
        temperature: 0.3,
        num_predict: 2500,
      },
    });

    if (signal?.aborted) {
      throw new Error('Request was cancelled');
    }

    const rawContent = response.message.content;
    const parsed = extractJSON(rawContent);

    if (!parsed) {
      throw {
        type: 'PARSE_ERROR',
        message: 'Failed to parse JSON from model response. The model returned invalid data.',
        raw: rawContent,
      };
    }

    if (!validateItinerary(parsed)) {
      throw {
        type: 'PARSE_ERROR',
        message: 'Model response is missing required fields. Please try again.',
        raw: rawContent,
      };
    }

    return parsed;
  } catch (err) {
    // Already a typed error from above
    if (err.type) throw err;

    // Network / connection errors
    if (err.message?.includes('fetch') || err.message?.includes('Failed') || err.message?.includes('ECONNREFUSED')) {
      throw {
        type: 'CONNECTION_ERROR',
        message: 'Cannot connect to Ollama. Make sure Ollama is running on localhost:11434.',
        original: err.message,
      };
    }

    // Model not found
    if (err.message?.includes('not found') || err.message?.includes('model')) {
      throw {
        type: 'MODEL_ERROR',
        message: `Model "${MODEL}" not found. Run: ollama pull ${MODEL}`,
        original: err.message,
      };
    }

    // Timeout
    if (err.name === 'AbortError' || err.message?.includes('timeout')) {
      throw {
        type: 'TIMEOUT_ERROR',
        message: 'Request timed out. Try a shorter trip duration.',
        original: err.message,
      };
    }

    // Generic fallback
    throw {
      type: 'UNKNOWN_ERROR',
      message: err.message || 'An unexpected error occurred.',
      original: err.message,
    };
  }
}
