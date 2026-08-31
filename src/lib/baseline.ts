import type { BaselineResult } from "./types";

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "llama3.1:8b";

export interface BaselineCallTrace {
  model: string;
  prompt: string;
  response: string;
}

export interface BaselineRun {
  result: BaselineResult;
  trace: BaselineCallTrace;
}

function buildPrompt(extractedText: string): string {
  return `Review this contract and flag any concerns.

Respond with only valid JSON in exactly this shape, and nothing else:
{"concerns": [{"description": "..."}]}

Contract:
"""
${extractedText}
"""`;
}

function isBaselineResult(value: unknown): value is BaselineResult {
  if (typeof value !== "object" || value === null || !("concerns" in value)) {
    return false;
  }
  const concerns = (value as { concerns: unknown }).concerns;
  if (!Array.isArray(concerns)) {
    return false;
  }
  return concerns.every(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as { description: unknown }).description === "string"
  );
}

export async function runBaseline(extractedText: string): Promise<BaselineRun> {
  const prompt = buildPrompt(extractedText);

  let res: Response;
  try {
    res = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt,
        format: "json",
        stream: false,
      }),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Could not reach Ollama at ${OLLAMA_BASE_URL}: ${message}`
    );
  }

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Ollama request failed with status ${res.status}: ${body}`);
  }

  const data = (await res.json()) as { response: string };
  const rawResponse = data.response;

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawResponse);
  } catch {
    throw new Error(
      `Ollama returned output that is not valid JSON: ${rawResponse}`
    );
  }

  if (!isBaselineResult(parsed)) {
    throw new Error(
      `Ollama JSON output did not match the expected { concerns: [{ description }] } shape: ${rawResponse}`
    );
  }

  return {
    result: parsed,
    trace: { model: OLLAMA_MODEL, prompt, response: rawResponse },
  };
}
