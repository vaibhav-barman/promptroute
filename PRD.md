# 📋 PromptRoute — Product Requirements Document

## Overview
**PromptRoute** is a Dynamic Travel Itinerary Planner that replaces a traditional backend API with a local LLM (Ollama running `qwen3.5:9b`). Users provide natural-language travel preferences and receive structured, visually-rich itineraries rendered in a premium React frontend.

---

## Problem Statement
Traditional travel planners require either:
- A team maintaining a complex REST API + database, or
- Third-party APIs with rate limits, costs, and rigid schemas.

PromptRoute eliminates both by treating the LLM itself as the backend — outputting structured JSON that the frontend consumes directly.

---

## Core Features

### 1. User Input Panel
| Field | Type | Description |
|-------|------|-------------|
| **Destination** | Text input | City or region the user wants to visit |
| **Days** | Numeric stepper (1–14) | Trip duration in days |
| **Budget Tier** | Segmented toggle | Budget / Mid-Range / Luxury |
| **Vibe** | Selectable tags | Adventure, Relaxation, Culture, Foodie, Romantic, Nightlife |

### 2. Itinerary Generation
- Single-click "Generate" sends a structured prompt to Ollama
- Response is parsed as JSON and mapped to timeline components
- Each day card contains time-slotted activities with category badges

### 3. Budget Summary
- Top-level budget card showing estimated total (₹ INR)
- Per-activity cost breakdowns
- Dynamic counter animations on load

### 4. Loading States
- Shimmer skeleton placeholders during LLM generation
- Animated progress indicators
- Approximate time estimate display

---

## Edge Cases & Error Handling

| Scenario | Handling |
|----------|----------|
| Ollama not running | Connection error modal with setup instructions |
| Model not pulled | Prompt user to run `ollama pull qwen3.5:9b` |
| Malformed JSON response | Retry with stricter prompt; show error toast |
| Timeout (>60s) | Abort request, offer retry with shorter trip |
| Empty destination | Client-side validation prevents submission |
| Extremely long trips (>14 days) | Cap at 14 with informational message |

---

## Non-Functional Requirements
- **Latency**: Sub-30s for 3-day itineraries on consumer hardware
- **Offline**: Fully functional with local Ollama — no internet required
- **Privacy**: Zero data leaves the machine
- **Accessibility**: Keyboard navigable, high-contrast dark theme

---

## Success Metrics
- ✅ User can generate a valid itinerary within 3 clicks
- ✅ JSON parsing success rate > 95% with qwen3.5:9b
- ✅ UI renders within 16ms frame budget after data arrives
- ✅ All error states gracefully handled with user-friendly messages
