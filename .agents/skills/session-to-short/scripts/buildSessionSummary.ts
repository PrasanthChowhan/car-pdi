export interface SessionSummary {
  topic: string;
  niche: string;
  audience: string;
  core_promise: string;
  evidence_or_proof: string[];
  available_numbers: string[];
  available_names: string[];
  tone: string;
}

interface BuildSessionSummaryInput {
  sessionText: string;          // recent conversation / notes / transcript
  overrides?: Partial<SessionSummary>; // user-provided hints
}

/**
 * Wraps an LLM call to distill messy session text into a typed SessionSummary.
 *
 * You pass in your own modelCall implementation that hits Gemini/Claude/OpenAI/etc.
 */
export async function buildSessionSummary(
  input: BuildSessionSummaryInput,
  modelCall: (prompt: string) => Promise<string>
): Promise<SessionSummary> {
  const { sessionText, overrides = {} } = input;

  const prompt = `
You are a content strategist distilling a messy session into a compact summary for a Shorts script generator.

Read the SESSION below and return a JSON object with this exact shape:

{
  "topic": "string",
  "niche": "string",
  "audience": "string",
  "core_promise": "string",
  "evidence_or_proof": ["string"],
  "available_numbers": ["string"],
  "available_names": ["string"],
  "tone": "string"
}

Rules:
- Use only information present in the SESSION unless overrides are provided.
- If something is unknown, use an empty string or empty array.
- Keep each field short and punchy (no paragraphs).

SESSION:
"""${sessionText}"""
  `.trim();

  const raw = await modelCall(prompt);

  let parsed: Partial<SessionSummary>;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = {};
  }

  const summary: SessionSummary = {
    topic: overrides.topic ?? parsed.topic ?? "",
    niche: overrides.niche ?? parsed.niche ?? "",
    audience: overrides.audience ?? parsed.audience ?? "",
    core_promise: overrides.core_promise ?? parsed.core_promise ?? "",
    evidence_or_proof:
      overrides.evidence_or_proof ?? parsed.evidence_or_proof ?? [],
    available_numbers:
      overrides.available_numbers ?? parsed.available_numbers ?? [],
    available_names:
      overrides.available_names ?? parsed.available_names ?? [],
    tone: overrides.tone ?? parsed.tone ?? ""
  };

  return summary;
}