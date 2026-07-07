# Session-to-Short Reference

## Library overview

`shorts_template_library.md` is a reverse-engineered playbook of 14 reusable short-form templates, distilled from 60 outlier Shorts across AI/tech, fitness, finance, food, comedy, storytelling, and DIY. Each template defines: [file:1]

- When to use it
- Hook formula (first 1–3 seconds, fill-in-the-blank)
- Caption formula (on-screen and caption patterns)
- Visual formula (shot/prop/edit that anchors the hook)
- Retention mechanic (what keeps viewers past the swipe point)
- Niche adaptations (AI/tech, fitness, finance examples)
- Proof outliers (original Shorts that prove the pattern) [file:1]

Only retrieve the section for the template you intend to use.

---

## Template selection cheat sheet

Use these quick rules to map a `SessionSummary` to templates. [file:1]

- **Template 01 – The Unexpected Object Pattern Interrupt**
  - Use when you have a visually ambiguous or surprising object/process.
  - Example: “This is actually a fully functional app built in 4 minutes with Claude.” [file:1]

- **Template 02 – Extreme Comparison (X vs Y)**
  - Use when you can put two extremes side by side that share one property but differ massively on another. [file:1]
  - Example: “The cheapest model vs the most expensive model — same prompt.” [file:1]

- **Template 03 – Contrarian ‘Stop Doing X’**
  - Use for behavior-change or “everyone says X, but they’re wrong” content. [file:1]
  - Example: “Stop writing longer prompts. Write shorter ones with examples instead.” [file:1]

- **Template 04 – Fame-Jacking Contradiction**
  - Use when you can reference a well-known person/brand and reveal a non-obvious truth. [file:1]
  - Example: “Ryan Reynolds didn’t get rich from acting — he got rich from one $200M Aviation Gin exit.” [file:1]

- **Template 05 – Oddly-Specific Number or Date**
  - Use when the summary includes specific numbers, amounts, or dates that anchor a story. [file:1]
  - Example: “I built 14 micro-SaaS apps in 31 days using Cursor.” [file:1]

- **Template 06 – Demographic Call-Out**
  - Use when advice is dramatically more relevant to one age/stage/identity group. [file:1]
  - Example: “If you’re a solo founder, you’re using ChatGPT wrong.” [file:1]

- **Template 07 – Loss-Aversion Avoidance List**
  - Use for “never do this / mistakes to avoid / words you should never say” content. [file:1]
  - Example: “5 prompts you should never paste into ChatGPT.” [file:1]

- **Template 08 – Quiz Self-Test**
  - Use when you can ask the viewer to guess or choose between options. [file:1]
  - Example: “Can you tell which of these images is real and which is AI?” [file:1]

- **Template 09 – Today Years Old Shared Discovery**
  - Use for “I just learned X and I’m today years old” style shared realizations. [file:1]

(You can add the remaining templates from the library in the same format, if you use them frequently.)

---

## SessionSummary → template mapping heuristics

Given a `SessionSummary`:

- If `tone` is contrarian or `core_promise` includes words like “stop”, “wrong”, “actually”, “never do”, consider Templates 03 or 07. [file:1]
- If `available_numbers` is non-empty, also consider Template 05. [file:1]
- If `audience` mentions a specific demographic (age, stage, role), consider Template 06. [file:1]
- If `topic` implies comparison, consider Template 02. [file:1]
- If there is a famous person/brand in `available_names`, consider Template 04. [file:1]

Use these as biases, not hard rules; if multiple match, generating variants is encouraged.