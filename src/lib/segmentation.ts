import Groq from "groq-sdk";
import { CLAUSE_TYPES, UNCOVERED_CLAUSE_TYPE } from "./playbook";
import type { LlmCallTrace } from "./logging";

const GROQ_MODEL = "qwen/qwen3.6-27b";

export interface SegmentedClause {
  clauseType: string;
  excerpt: string;
}

export interface SegmentationRun {
  clauses: SegmentedClause[];
  trace: LlmCallTrace;
}

function buildPrompt(extractedText: string): string {
  return `You are segmenting a contract into its individual clauses for a legal review tool.

Read the contract text below and split it into clauses. Each clause should express one discrete contractual term, do not fragment a single clause across multiple entries and do not merge unrelated terms into one entry.

For each clause, classify it with the single best-fitting clause type from this exact list: ${CLAUSE_TYPES.join(", ")}. If a clause does not fit any of these types, classify it as "${UNCOVERED_CLAUSE_TYPE}".

Respond with only valid JSON, no other text, in exactly this shape:
{"clauses": [{"clauseType": "...", "excerpt": "..."}]}

Contract:
"""
${extractedText}
"""`;
}

function isSegmentationResult(
  value: unknown
): value is { clauses: SegmentedClause[] } {
  if (typeof value !== "object" || value === null || !("clauses" in value)) {
    return false;
  }
  const clauses = (value as { clauses: unknown }).clauses;
  if (!Array.isArray(clauses)) {
    return false;
  }
  return clauses.every(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as { clauseType: unknown }).clauseType === "string" &&
      typeof (item as { excerpt: unknown }).excerpt === "string"
  );
}

export async function runSegmentation(
  extractedText: string
): Promise<SegmentationRun> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not set");
  }

  const client = new Groq({ apiKey });
  const prompt = buildPrompt(extractedText);

  let completion;
  try {
    completion = await client.chat.completions.create({
      model: GROQ_MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      reasoning_effort: "none",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Groq segmentation call failed: ${message}`);
  }

  const rawResponse = completion.choices[0]?.message?.content;
  if (!rawResponse) {
    throw new Error("Groq segmentation call returned no content");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawResponse);
  } catch {
    throw new Error(
      `Groq segmentation call returned output that is not valid JSON: ${rawResponse}`
    );
  }

  if (!isSegmentationResult(parsed)) {
    throw new Error(
      `Groq segmentation output did not match the expected { clauses: [{ clauseType, excerpt }] } shape: ${rawResponse}`
    );
  }

  return {
    clauses: parsed.clauses,
    trace: {
      model: GROQ_MODEL,
      prompt,
      response: rawResponse,
      totalTokens: completion.usage?.total_tokens,
    },
  };
}
