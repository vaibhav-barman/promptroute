# 🧭 PromptRoute — Dynamic Travel Itinerary Planner

<div align="center">

![PromptRoute Banner](https://img.shields.io/badge/PromptRoute-AI%20Travel%20Architect-4f46e5?style=for-the-badge&logo=compass&logoColor=white)
![React 19](https://img.shields.io/badge/React-19.2-61dafb?style=for-the-badge&logo=react&logoColor=black)
![Vite 8](https://img.shields.io/badge/Vite-8.3-646cff?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.3-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Ollama](https://img.shields.io/badge/Ollama-qwen3.5%3A9b-000000?style=for-the-badge&logo=ollama&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)

<p align="center">
  <b>Replace your backend with local AI.</b> PromptRoute turns local LLM reasoning into high-fidelity, interactive travel timelines with animated budget engines, category badges, and zero cloud dependencies.
</p>

[Quick Start](#-quick-start) •
[Architecture](#-architecture) •
[Key Features](#-key-features) •
[Prompt Engineering](#-prompt-engineering--schema) •
[Project Structure](#-project-structure)

</div>

---

## 🌟 Overview

**PromptRoute** is an open-source, LLM-native travel itinerary generator that operates as a **Backend-as-a-Prompt (BaaP)**. Instead of relying on traditional REST microservices, databases, or metered third-party travel APIs, PromptRoute connects directly from the browser to a local [Ollama](https://ollama.ai) instance running the `qwen3.5:9b` model.

The model receives structured system constraints and returns strictly validated JSON representing complete, time-slotted day-by-day travel plans, which are instantly rendered through a slick, glassmorphic UI.

---

## ✨ Key Features

- 🧠 **Backend-as-a-Prompt Architecture:** No servers, no databases, no API keys, and zero per-token cloud costs.
- 🔒 **100% Offline & Private:** Queries and itineraries are processed entirely on your local Apple Silicon GPU or hardware. Zero telemetry.
- 🎨 **UI/UX Pro Max Aesthetic:** Built with modern glassmorphism, responsive micro-animations, floating background orbs, and bespoke typography (`Outfit`, `Inter`, `JetBrains Mono`).
- 🌓 **First-Class Dark & Light Modes:** Instant toggle with class-based Tailwind CSS v4 styling, localStorage persistence, and zero flash of unstyled content (FOUC).
- ⏱️ **Live Reasoning Tracker:** Shimmer skeleton with a real-time stopwatch and phase indicator tracking the neural network's inference milestones.
- 💰 **Animated Budget Engine:** Dynamic ease-out counter visualizing total estimated trip costs in Indian Rupees (₹ INR) across Budget, Mid-Range, and Luxury tiers.
- 🏷️ **Categorized Activity Badges:** Visual tags for Sightseeing, Food, Adventure, and Relaxation with contextual visual hook hints.
- 🛡️ **Self-Healing Error Recovery:** Handles Ollama connection drops, missing models, JSON markdown stripping, and request timeouts gracefully with actionable CLI guidance.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Browser / Client                      │
│                                                             │
│   ┌──────────────────┐             ┌────────────────────┐   │
│   │   SearchForm     │             │ ItineraryTimeline  │   │
│   │ Destination/Days │             │ DayCards / Badges  │   │
│   │ Budget / Vibes   │             │ Animated Budget    │   │
│   └────────┬─────────┘             └─────────▲──────────┘   │
│            │                                 │              │
│            ▼                                 │ Validated    │
│   ┌──────────────────┐             ┌─────────┴──────────┐   │
│   │ Client Validator │             │ JSON Parser & San. │   │
│   │  (Preferences)   │             │ (Markdown stripper)│   │
│   └────────┬─────────┘             └─────────▲──────────┘   │
└────────────┼─────────────────────────────────┼──────────────┘
             │                                 │
             │ HTTP POST (port 11434)          │ Structured JSON
             ▼                                 │ Response
┌──────────────────────────────────────────────┴──────────────┐
│                    Local Ollama Engine                      │
│                                                             │
│         Running model: qwen3.5:9b                           │
│         • System Prompt with strict JSON schema             │
│         • Temperature: 0.3 for deterministic outputs        │
│         • Token-efficient structured itineraries            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### 1. Prerequisites

Make sure you have **Node.js 18+** and **Ollama** installed.

#### Install Ollama
- **macOS:** `brew install ollama` (or download from [ollama.ai](https://ollama.ai))
- **Linux:** `curl -fsSL https://ollama.ai/install.sh | sh`
- **Windows:** Download installer from [ollama.ai](https://ollama.ai)

#### Pull the Required Model
```bash
ollama pull qwen3.5:9b
```

#### Start the Ollama Service
```bash
ollama serve
```
*(Verify it is running at `http://localhost:11434`)*

---

### 2. Install & Run PromptRoute

```bash
# Clone the repository
git clone https://github.com/vaibhav-barman/promptroute.git
cd promptroute

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

Open your browser at **`http://localhost:5173`**.

---

## 🎯 Example Prompts to Try

| Destination | Duration | Budget Tier | Vibes | Est. Time |
|-------------|----------|-------------|-------|-----------|
| **Goa, India** | 3 Days | Mid-Range | Foodie, Relaxation | ~25s |
| **Tokyo, Japan** | 2 Days | Luxury | Culture, Foodie | ~20s |
| **Manali, India** | 3 Days | Budget | Adventure, Culture | ~25s |
| **Paris, France** | 3 Days | Mid-Range | Romantic, Culture | ~28s |

> 💡 **Tip:** Selecting 2 to 3 days generates faster on consumer hardware while delivering dense, high-fidelity day schedules.

---

## 📐 Prompt Engineering & Schema

PromptRoute enforces a rigid, deterministic system contract with Ollama using `temperature: 0.3` and the following JSON schema:

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
          "timeSlot": "Morning | Afternoon | Evening | Night",
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

---

## 📂 Project Structure

```
promptroute/
├── PRD.md                       # Product Requirements Document
├── ARCHITECTURE.md              # Technical Architecture & Pipeline
├── DESIGN.md                    # Visual Design System & Tokens
├── MEMORY.md                    # Architectural Decision Records
├── RULES.md                     # Behavioral & Design Directives
├── TRACKER.md                   # Feature & Phase Progress Tracker
├── index.html                   # HTML Entrypoint & Theme Initializer
├── package.json                 # Dependencies & Build Scripts
├── vite.config.js               # Vite Configuration with Tailwind v4
└── src/
    ├── main.jsx                 # React DOM Root
    ├── App.jsx                  # Main State Engine & Theme Orchestration
    ├── index.css                # Tailwind v4 Tokens, Glassmorphism, Utilities
    ├── components/
    │   ├── SearchForm.jsx       # User Input Panel with Reactive Sliders & Tags
    │   ├── ItineraryTimeline.jsx# Timeline Renderer & Activity Cards
    │   ├── BudgetCard.jsx       # Animated INR Expense Counter
    │   ├── CategoryBadge.jsx    # Visual Activity Category Chips
    │   ├── LoadingSkeleton.jsx  # Shimmer Skeleton with Live Reasoning Stopwatch
    │   └── ErrorDisplay.jsx     # Self-Healing Error Screen with CLI Instructions
    └── utils/
        └── ollamaClient.js      # Ollama SDK Wrapper, Extraction & Validation
```

---

## 🛠️ Tech Stack

- **Framework:** [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with Vanilla CSS custom design tokens
- **Icons:** [Lucide React](https://lucide.dev/)
- **AI Engine:** [Ollama SDK](https://github.com/ollama/ollama-js) (`qwen3.5:9b`)
- **Linter:** [Oxlint](https://oxc.rs/)

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
