import type { SessionSummary } from "./buildSessionSummary";

export interface TemplateSelectionResult {
  primaryTemplateId: string | null;
  alternatives: string[]; // ordered by preference
  rationale: string;
}

/**
 * Heuristic, rule-based mapping from SessionSummary → template IDs.
 *
 * Template IDs correspond to sections in shorts_template_library.md:
 * 01, 02, 03, 04, 05, 06, 07, 08, 09, ...
 */
export function selectTemplateId(summary: SessionSummary): TemplateSelectionResult {
  const candidates: { id: string; score: number; reason: string[] }[] = [];

  const text = `${summary.topic} ${summary.core_promise} ${summary.tone}`.toLowerCase();
  const hasNumbers = (summary.available_numbers ?? []).length > 0;
  const hasNames = (summary.available_names ?? []).length > 0;
  const audience = (summary.audience ?? "").toLowerCase();

  function addCandidate(id: string, score: number, reason: string) {
    const existing = candidates.find(c => c.id === id);
    if (existing) {
      existing.score += score;
      existing.reason.push(reason);
    } else {
      candidates.push({ id, score, reason: [reason] });
    }
  }

  // Template 03 – Contrarian "Stop Doing X"
  if (text.includes("stop ") || text.includes(" wrong") || text.includes("actually")) {
    addCandidate("03", 3, "Contrarian language detected (stop/wrong/actually).");
  }

  // Template 07 – Loss-Aversion Avoidance List
  if (
    text.includes("never") ||
    text.includes("mistake") ||
    text.includes("avoid") ||
    text.includes("don't do") ||
    text.includes("dont do")
  ) {
    addCandidate("07", 3, "Loss-aversion / mistakes framing detected.");
  }

  // Template 05 – Oddly-Specific Number or Date
  if (hasNumbers) {
    addCandidate("05", 3, "Specific numbers available.");
  }

  // Template 06 – Demographic Call-Out
  if (
    audience.includes("over ") ||
    audience.includes("under ") ||
    audience.includes("years old") ||
    audience.includes("founder") ||
    audience.includes("developer") ||
    audience.includes("student") ||
    audience.includes("students")
  ) {
    addCandidate("06", 2, "Specific demographic audience detected.");
  }

  // Template 02 – Extreme Comparison (X vs Y)
  if (text.includes(" vs ") || text.includes(" versus ") || text.includes("comparison")) {
    addCandidate("02", 2, "Comparison framing detected.");
  }

  // Template 04 – Fame-Jacking Contradiction
  if (hasNames) {
    addCandidate("04", 2, "Named person/brand available for fame-jacking.");
  }

  // Fallbacks if nothing matches strongly
  if (candidates.length === 0) {
    if (hasNumbers) {
      addCandidate("05", 1, "Fallback to numeric template.");
    } else if (summary.tone.toLowerCase().includes("contrarian")) {
      addCandidate("03", 1, "Fallback contrarian template.");
    } else {
      addCandidate("07", 1, "Fallback avoidance list template.");
    }
  }

  candidates.sort((a, b) => b.score - a.score);
  const primary = candidates[0];

  return {
    primaryTemplateId: primary?.id ?? null,
    alternatives: candidates.slice(1, 4).map(c => c.id),
    rationale: candidates
      .map(c => `${c.id}: ${c.reason.join(" ")}`)
      .join(" | ")
  };
}