# Session-to-Short Examples

This file provides reference examples of input transcripts, generated session summaries, and matched template scripts.

---

## Example 1: Tech Product Tutorial (Cursor IDE)

### 1. Input Transcript (Raw Text)
> "So I was building this React app the other day, and I was using Cursor. I have to say, Cursor is the only editor I use now. And by the way, this is not sponsored, I literally pay the 20 dollars a month myself because it is that good. But I noticed a really cool feature. If you hit Ctrl+K and write a quick command, it generates the whole component in like 4 seconds. Most developers write these huge long prompts explaining every single detail, but you should stop writing longer prompts. Write shorter prompts with concrete examples instead. I built 14 mini-apps in 31 days just by giving it two-sentence examples of my UI components."

### 2. Output of `buildSessionSummary.ts` (JSON)
```json
{
  "title": "Cursor Prompting Trick",
  "niche": "AI/Tech",
  "durationSeconds": 35,
  "highlights": [
    {
      "timestamp": "00:00:05",
      "text": "Cursor is the only editor I use now.",
      "duration": 4
    },
    {
      "timestamp": "00:00:15",
      "text": "Ctrl+K generates the whole component in like 4 seconds.",
      "duration": 5
    },
    {
      "timestamp": "00:00:22",
      "text": "Stop writing longer prompts. Write shorter prompts with concrete examples instead.",
      "duration": 6
    }
  ],
  "keyStats": [
    { "value": "$20", "context": "monthly subscription for Cursor" },
    { "value": "4 seconds", "context": "component generation time" },
    { "value": "14", "context": "number of micro-apps built" },
    { "value": "31 days", "context": "timeframe to build micro-apps" }
  ],
  "contrarianClaims": [
    "Stop writing longer prompts. Write shorter prompts with concrete examples instead."
  ],
  "celebrityMentions": [
    "Cursor"
  ],
  "demographicsTargeted": [
    "developers",
    "React developers"
  ],
  "productsMentioned": [
    { "name": "Cursor", "sponsoredHint": false }
  ]
}
```

### 3. Output of `selectTemplateId.ts`

#### Selected Template: **Template 14 — Authenticity Parenthetical**
- **Confidence Score**: `0.95`
- **Matching Cues**: `Product "Cursor" mentioned with sponsoredHint == false`, `Specific stats ($20, 14 apps, 31 days)`.

#### Drafted Script:
- **Hook (0-3s)**: 
  *(Visual: Open on tight crop of Cursor IDE coding autonomously)*
  "Cursor is the only IDE I use now—and no, this isn't sponsored, I pay the 20 bucks a month myself."
- **Body (3-25s)**:
  *(Visual: Screencast of typing a simple prompt, then component building)*
  "Stop writing long prompts. Just press Ctrl+K and give it a two-sentence example. I used this trick to build 14 micro-SaaS apps in 31 days."
- **Call-to-Action (25-30s)**:
  *(Visual: Text overlay 'Try this' with comment link)*
  "Try it on your next React component. Subscribe for more AI dev hacks."

---

## Example 2: Fitness Diet Hack (Protein Intake)

### 1. Input Transcript (Raw Text)
> "Everyone tells you that you need to eat chicken breast and white rice to hit your protein goals. They're wrong. Stop eating dry chicken. Do liquid protein blends and Greek yogurt bowls instead. I'm a competitive natural bodybuilder with 12 years of coaching experience, and I'm telling you to skip the chicken entirely. I lost 23.4 lbs in 9 weeks while keeping all my muscle, eating 2,800 calories a day of mostly yogurt and egg-white scrambles."

### 2. Output of `buildSessionSummary.ts` (JSON)
```json
{
  "title": "Skip Dry Chicken",
  "niche": "Fitness",
  "durationSeconds": 25,
  "highlights": [
    {
      "timestamp": "00:00:02",
      "text": "Everyone tells you to eat chicken breast. They're wrong.",
      "duration": 4
    },
    {
      "timestamp": "00:00:08",
      "text": "Stop eating dry chicken. Do liquid protein and yogurt instead.",
      "duration": 5
    }
  ],
  "keyStats": [
    { "value": "23.4 lbs", "context": "weight lost" },
    { "value": "9 weeks", "context": "timeframe for weight loss" },
    { "value": "2,800", "context": "daily calorie intake" },
    { "value": "12 years", "context": "years of coaching experience" }
  ],
  "contrarianClaims": [
    "Stop eating dry chicken. Do liquid protein and yogurt instead.",
    "Skip the chicken breast entirely."
  ],
  "celebrityMentions": [],
  "demographicsTargeted": [
    "lifters",
    "people trying to hit protein goals"
  ],
  "productsMentioned": []
}
```

### 3. Output of `selectTemplateId.ts`

#### Selected Template: **Template 13 — Authority Mismatch / Credibility Contradiction**
- **Confidence Score**: `0.90`
- **Matching Cues**: `Credentialed coach (12 years experience)`, `Contrarian advice on standard bodybuilder diet (stop chicken breast)`.

#### Drafted Script:
- **Hook (0-3s)**: 
  *(Visual: Open on creator eating a massive, colorful yogurt bowl)*
  "I'm a natural bodybuilder and coach of 12 years, and I'm telling you to skip the dry chicken breast."
- **Body (3-25s)**:
  *(Visual: Stamped typography: "23.4 lbs LOST" | Cut to prep of 2,800 cal day)*
  "Stop eating boring foods. I lost 23.4 lbs in 9 weeks eating Greek yogurt and liquid protein blends instead."
- **Call-to-Action (25-30s)**:
  *(Visual: Stamped Text: 'Full Diet in Desc' with pointing arrow)*
  "Get my full high-protein shopping list in the description."
# Session-to-Short Examples

These examples show the full flow: raw idea → SessionSummary → chosen template → final short script.

---

## Example 1 – AI prompts (Template 03: Contrarian Stop Doing X)

**Raw idea / session:**

- Discussion about why shorter prompts with examples give better LLM outputs.
- Audience: solo devs and indie hackers using AI for coding.
- Goal: views + authority.

**SessionSummary:**

```json
{
  "topic": "using shorter prompts with concrete examples to get better AI outputs",
  "niche": "AI/tech",
  "audience": "solo devs and indie hackers using AI to ship products",
  "core_promise": "you get better outputs by using short prompts plus examples instead of long instructions",
  "evidence_or_proof": [
    "short prompts force you to clarify the task",
    "examples reduce hallucination",
    "you iterate faster on failures"
  ],
  "available_numbers": [],
  "available_names": [],
  "tone": "contrarian, practical"
}
```

**Chosen template:** 03 – Contrarian "Stop Doing X". [file:1]

**Short Script (example):**

```md
# Short Script

**Template used:** 03 – Contrarian "Stop Doing X"
**Platform:** YouTube Shorts
**Target audience:** Solo devs using AI to write code
**Core promise:** Short prompts with examples beat long walls of text

## Hook (0–3s)
- Spoken line: "Stop writing long prompts. Your AI actually works better with this instead."
- On-screen text: "Stop writing long prompts"
- Visual suggestion: You staring at a huge prompt wall, then slam backspace and replace it with a tiny prompt + example.

## Build / Body (3–30s)
- Beat 1 (3–10s):
  - Spoken line: "When you send a wall of text, the model has to guess which part you actually care about."
  - On-screen text: "Wall of text = confusion"
  - Visual suggestion: Split-screen: long prompt vs highlighted tiny bit.
- Beat 2 (10–20s):
  - Spoken line: "Instead, write one clear sentence, then show one example of the input and the output you want."
  - On-screen text: "1 line + 1 example"
  - Visual suggestion: Simple before/after prompt screenshot.
- Beat 3 (20–30s):
  - Spoken line: "Now you can tweak the example instead of rewriting instructions—and your outputs get sharper every iteration."
  - On-screen text: "Iterate on examples, not essays"
  - Visual suggestion: Quick montage of improved outputs.

## Payoff & CTA (last 3–7s)
- Spoken line: "Short prompts plus examples. Try it on your next task and watch the difference."
- On-screen text: "Short prompt + example > long prompt"
- Visual suggestion: Big green check over the short prompt.
- CTA type: subscribe

## Caption & Tags
- Caption: "Stop writing 500-word prompts. One line + one example beats them every time."
- Hashtags: #ai #prompting #solodev #coding
```

---

## Example 2 – Micro-SaaS metrics (Template 05: Oddly-Specific Number)

**SessionSummary:**

```json
{
  "topic": "shipping many small SaaS tools fast using AI",
  "niche": "AI/tech",
  "audience": "indie hackers who want to ship products quickly",
  "core_promise": "you can ship a surprising number of micro-SaaS apps in a short window if you lean on AI",
  "evidence_or_proof": [
    "built multiple apps in a month using AI pair-programming",
    "reused the same base stack",
    "iterated based on user feedback"
  ],
  "available_numbers": ["14 micro-SaaS apps", "31 days"],
  "available_names": [],
  "tone": "inspirational, numerical"
}
```

**Chosen template:** 05 – Oddly-Specific Number or Date. [file:1]

(Then generate script in the standard layout.)

---

## Example 3 – Fitness deadlift mistakes (Template 07: Loss-Aversion Avoidance List)

**SessionSummary:**

```json
{
  "topic": "common deadlift mistakes that quietly destroy your back",
  "niche": "fitness",
  "audience": "lifters over 30 who want to pull heavy without getting injured",
  "core_promise": "avoid a few quiet mistakes to keep deadlifting safely into your 40s and beyond",
  "evidence_or_proof": [
    "rounded lower back from ego loading",
    "yanking the bar off the floor instead of tension",
    "no deload weeks",
    "poor bracing"
  ],
  "available_numbers": ["4 mistakes"],
  "available_names": [],
  "tone": "protective, warning"
}
```

**Chosen template:** 07 – Loss-Aversion Avoidance List. [file:1]

(Then generate script in the standard layout.)