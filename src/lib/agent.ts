import Groq from "groq-sdk";
import {
  getPlaybookEntry,
  isClauseType,
  UNCOVERED_CLAUSE_TYPE,
  CLAUSE_TYPES,
  type ClauseType,
} from "./playbook";
import type { SegmentedClause } from "./segmentation";
import type { LlmCallTrace } from "./logging";
import type { AgentClause, AgentResult } from "./types";

const GROQ_MODEL = "qwen/qwen3.6-27b";

// Verification is split across a few smaller calls grouped by clause type,
// rather than one call covering the full playbook, to stay under this
// model's 8,000 TPM free-tier ceiling. See the Groq usage section in
// docs/architecture.md for why.
const CLAUSE_TYPES_PER_CHUNK = 3;

export interface AgentRun {
  result: AgentResult;
  traces: LlmCallTrace[];
}

interface CoveredClause {
  index: number;
  clauseType: ClauseType;
  excerpt: string;
}

interface VerificationItem {
  index: number;
  flagged: boolean;
  matchedRiskPatternIndex: number | null;
  reason: string;
}

function chunkClauseTypes(presentTypes: Set<ClauseType>): ClauseType[][] {
  const ordered = CLAUSE_TYPES.filter((type) => presentTypes.has(type));
  const chunks: ClauseType[][] = [];
  for (let i = 0; i < ordered.length; i += CLAUSE_TYPES_PER_CHUNK) {
    chunks.push(ordered.slice(i, i + CLAUSE_TYPES_PER_CHUNK));
  }
  return chunks;
}

function buildVerificationPrompt(coveredClauses: CoveredClause[]): string {
  const sections = coveredClauses.map(({ index, clauseType, excerpt }) => {
    const entry = getPlaybookEntry(clauseType);
    const riskPatternsList = entry.riskPatterns
      .map((pattern, i) => `  [${i}] ${pattern}`)
      .join("\n");
    return `[${index}] Clause type: ${clauseType}
Standard: ${entry.standard}
Risk patterns:
${riskPatternsList}
Excerpt: """${excerpt}"""`;
  });

  return `You are verifying contract clauses against a playbook of standard versus risky patterns, for a legal review tool.

For each clause below, compare the excerpt against the standard and risk patterns given for its clause type. Determine whether the clause deviates from the standard by matching one of the listed risk patterns, including cases where the clause is reworded to look standard on the surface while still matching a risk pattern in substance.

Respond with one result per clause, using the same index given below. Respond with only valid JSON, no other text, in exactly this shape:
{"results": [{"index": 0, "flagged": true, "matchedRiskPatternIndex": 0, "reason": "..."}]}

Where:
- index: the clause's index as given below
- flagged: true if the clause matches one of its listed risk patterns, false if it is consistent with the standard
- matchedRiskPatternIndex: if flagged, the 0-based index (from the risk patterns list given for that clause) of the specific risk pattern that was matched; null if not flagged
- reason: a short explanation referencing the clause text, naming the specific deviation if flagged, or why it matches the standard if not

Clauses:

${sections.join("\n\n")}`;
}

function isVerificationResult(
  value: unknown
): value is { results: VerificationItem[] } {
  if (typeof value !== "object" || value === null || !("results" in value)) {
    return false;
  }
  const results = (value as { results: unknown }).results;
  if (!Array.isArray(results)) {
    return false;
  }
  return results.every((item) => {
    if (typeof item !== "object" || item === null) return false;
    const r = item as Record<string, unknown>;
    return (
      typeof r.index === "number" &&
      typeof r.flagged === "boolean" &&
      (r.matchedRiskPatternIndex === null ||
        typeof r.matchedRiskPatternIndex === "number") &&
      typeof r.reason === "string"
    );
  });
}

async function runVerificationChunk(
  client: Groq,
  coveredClauses: CoveredClause[]
): Promise<{ results: VerificationItem[]; trace: LlmCallTrace }> {
  const prompt = buildVerificationPrompt(coveredClauses);

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
    throw new Error(`Groq verification call failed: ${message}`);
  }

  const rawResponse = completion.choices[0]?.message?.content;
  if (!rawResponse) {
    throw new Error("Groq verification call returned no content");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawResponse);
  } catch {
    throw new Error(
      `Groq verification call returned output that is not valid JSON: ${rawResponse}`
    );
  }

  if (!isVerificationResult(parsed)) {
    throw new Error(
      `Groq verification output did not match the expected { results: [{ index, flagged, matchedRiskPatternIndex, reason }] } shape: ${rawResponse}`
    );
  }

  return {
    results: parsed.results,
    trace: {
      model: GROQ_MODEL,
      prompt,
      response: rawResponse,
      totalTokens: completion.usage?.total_tokens,
    },
  };
}

export async function runAgent(
  segmentedClauses: SegmentedClause[]
): Promise<AgentRun> {
  const coveredClauses: CoveredClause[] = [];
  const uncoveredIndices = new Set<number>();

  segmentedClauses.forEach((clause, index) => {
    if (isClauseType(clause.clauseType)) {
      coveredClauses.push({
        index,
        clauseType: clause.clauseType,
        excerpt: clause.excerpt,
      });
    } else {
      uncoveredIndices.add(index);
    }
  });

  const presentTypes = new Set(coveredClauses.map((c) => c.clauseType));
  const chunks = chunkClauseTypes(presentTypes);

  const resultByIndex = new Map<number, VerificationItem>();
  const traces: LlmCallTrace[] = [];

  if (chunks.length > 0) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not set");
    }
    const client = new Groq({ apiKey });

    for (const typesInChunk of chunks) {
      const clausesInChunk = coveredClauses.filter((c) =>
        typesInChunk.includes(c.clauseType)
      );
      const { results, trace } = await runVerificationChunk(
        client,
        clausesInChunk
      );
      traces.push(trace);
      for (const item of results) {
        resultByIndex.set(item.index, item);
      }
    }
  }

  const clauses: AgentClause[] = segmentedClauses.map((clause, index) => {
    if (uncoveredIndices.has(index)) {
      return {
        clauseType: UNCOVERED_CLAUSE_TYPE,
        excerpt: clause.excerpt,
        flagged: false,
        severity: "low",
        reason: "Not a clause type covered by the playbook",
        playbookRuleId: "",
      };
    }

    const clauseType = clause.clauseType as ClauseType;
    const entry = getPlaybookEntry(clauseType);
    const verificationResult = resultByIndex.get(index);

    if (!verificationResult) {
      throw new Error(
        `Groq verification response is missing a result for clause index ${index} (clauseType: ${clauseType})`
      );
    }

    const playbookRuleId = verificationResult.flagged
      ? `${clauseType}.${verificationResult.matchedRiskPatternIndex}`
      : "";

    return {
      clauseType,
      excerpt: clause.excerpt,
      flagged: verificationResult.flagged,
      severity: entry.severity,
      reason: verificationResult.reason,
      playbookRuleId,
    };
  });

  return { result: { clauses }, traces };
}
