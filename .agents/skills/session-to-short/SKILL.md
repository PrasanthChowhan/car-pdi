---
name: session-to-short
description: Transform the current session or topic into a high-retention short-form video script using a reusable Shorts template library. Use when the user wants to turn a conversation, idea, transcript, or notes into a YouTube Short, Reel, or TikTok script.
---

# Session → Short Script

This skill converts the current session/topic into concise, high-retention vertical video scripts (Shorts/Reels/TikToks) using the attached `shorts_template_library.md`. The library contains 14 reusable templates, each with "When to use it", hook formula, caption pattern, visual structure, retention mechanic, and niche adaptations. [file:1]

The skill works in three phases:
1. Compress the session into a structured `SessionSummary` object.
2. Select the best-fit template ID from the library.
3. Generate a short script from `SessionSummary + chosen template`.

---

## SessionSummary schema

Always reduce the user’s context into this schema before generating a script:

```jsonc
{
  "topic": "string",                  // core topic in 1 short sentence
  "niche": "string",                  // e.g. 'AI/tech', 'fitness', 'finance'
  "audience": "string",               // target viewer description
  "core_promise": "string",           // what the viewer gets from this short
  "evidence_or_proof": ["string"],    // 1–5 bullets: examples, arguments, steps
  "available_numbers": ["string"],    // real metrics, counts, dates if present
  "available_names": ["string"],      // real people/brands/products mentioned
  "tone": "string"                    // e.g. 'contrarian', 'educational', 'story'
}
```

Rules:
- Use only information present in the session or explicitly provided by the user.
- If a field is unknown, set it to `""` or an empty array rather than guessing.
- Keep each field short and punchy, not paragraph-length.

If the runtime provides helper scripts (e.g. `scripts/buildSessionSummary.ts`), call that first and then work entirely from its output.

---

## Quick start

When the user asks to “turn this into a short/reel/TikTok script”:

1. **Clarify minimal metadata:**
   - Ask at most 2–3 questions if missing:
     - Target platform (YouTube Shorts / IG Reels / TikTok).
     - Target audience (e.g. “solo devs shipping SaaS”, “lifters over 30”).
     - Goal (views, lead-gen, authority, or quick teaching).

2. **Build SessionSummary:**
   - Summarize the *recent* session (or provided text) into a `SessionSummary` object.
   - Prioritize:
     - a single core promise
     - real numbers and names (if any)
     - type of angle: contrarian, list of mistakes, numeric case study, etc. [file:1]

3. **Select template:**
   - Based on `SessionSummary`, choose one template ID from `shorts_template_library.md`.
   - Use the library’s “When to use it” and retention mechanic sections for guidance. [file:1]
   - Heuristics:
     - Behavior change / “you’re doing this wrong” → Template 03 (Contrarian Stop Doing X). [file:1]
     - Strong numbers or dates → Template 05 (Oddly-Specific Number or Date). [file:1]
     - Advice to a specific group → Template 06 (Demographic Call-Out). [file:1]
     - “Never do these mistakes” → Template 07 (Loss-Aversion Avoidance List). [file:1]
     - Quiz or guessing → Template 08 (Quiz Self-Test). [file:1]
     - Relatable “I just learned…” → Template 09 (Today Years Old). [file:1]

   - If the runtime exposes `scripts/selectTemplateId.ts`, use it to propose 1–3 candidates and then pick the best match.

4. **Retrieve only the needed template section:**
   - From `shorts_template_library.md`, retrieve **only** the chosen template’s:
     - “When to use it”
     - Hook formula
     - Caption formula
     - Visual formula
     - Retention mechanic
     - 1–2 niche adaptations, especially for the current niche [file:1]
   - Do **not** load the entire library into context if retrieval tools are available.

5. **Generate the script using a fixed layout:**

Return scripts in this format:

```md
# Short Script

**Template used:** [Template ID + name from library]
**Platform:** [YouTube Shorts / IG Reels / TikTok]
**Target audience:** [1 line]
**Core promise:** [1 line]

## Hook (0–3s)
- Spoken line:
- On-screen text:
- Visual suggestion:

## Build / Body (3–30s)
- Beat 1 (3–10s):
  - Spoken line:
  - On-screen text:
  - Visual suggestion:
- Beat 2 (10–20s):
  - Spoken line:
  - On-screen text:
  - Visual suggestion:
- Beat 3 (20–30s, optional):
  - Spoken line:
  - On-screen text:
  - Visual suggestion:

## Payoff & CTA (last 3–7s)
- Spoken line:
- On-screen text:
- Visual suggestion:
- CTA type: [subscribe / follow / comment / click link / watch next video]

## Caption & Tags
- Caption: [use the template’s caption pattern where possible]
- Hashtags: [3–7 relevant tags]
```

Constraints:
- Keep total spoken words roughly suitable for a 20–60s short.
- Make hooks 1 sentence, deliverable in under 3 seconds.
- Use conversational, spoken language, not essay prose.

---

## Creative freedom guardrails

The AI has creative freedom *inside* the chosen template but must respect the template’s mechanics. [file:1]

- It **may**:
  - Choose which template fits the summary.
  - Fill hooks, captions, and beats with original phrasing, examples, and angles.
  - Suggest visuals that fit the “Visual formula” section for that template. [file:1]
- It **must not**:
  - Change the fundamental structure of the template (e.g., an Oddly-Specific Number template must still be driven by a specific number/date). [file:1]
  - Invent specific numbers or celebrity facts; if none are available, pick a different template or ask the user for a true stat. [file:1]
  - Remove the retention mechanic (e.g., quiz reveal at the end, list that opens a curiosity loop). [file:1]

If no single template clearly fits, the AI may propose 2 short versions using 2 different templates and label them clearly.

---

## Workflows

### 1. Single short from current session

Use when user says “turn this into a Short / Reel”.

1. Build `SessionSummary` from the recent context or user-provided text.
2. Select one best-fit template.
3. Retrieve that template’s section from the library. [file:1]
4. Generate one script in the standard layout.

### 2. Multiple shorts from one topic

Use when user says “give me 3 different shorts from this”.

1. Build one `SessionSummary`.
2. Pick 2–3 different templates that match different angles (e.g., Template 03 contrarian, Template 05 numeric, Template 07 mistakes list). [file:1]
3. For each template:
   - Retrieve that template’s section.
   - Generate a separate script using the standard layout.
4. Return them numbered as Version 1, Version 2, etc.

### 3. Platform / audience adaptation

Use when user wants same idea adapted for different audiences or platforms.

1. Keep `core_promise` and main hook logic.
2. Adjust:
   - Vocabulary and examples to match the new audience.
   - CTA text to match platform norms.
3. Preserve the template’s retention mechanic and general structure. [file:1]

---

## Advanced features

See `REFERENCE.md` for template selection heuristics and shortcuts, and `EXAMPLES.md` for end-to-end examples from SessionSummary to final scripts.