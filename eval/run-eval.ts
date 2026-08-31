import { config as loadDotenv } from "dotenv";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { readdir, readFile, mkdir, writeFile } from "node:fs/promises";
import { writeTrajectoryLog } from "../src/lib/logging";

const CONTRACTS_DIR = path.resolve(process.cwd(), "eval/contracts");
const RESULTS_DIR = path.resolve(process.cwd(), "eval/results");
const CONTRACT_EXTENSIONS = [".pdf", ".docx"];
const ANSWER_KEY_SUFFIX = ".answerkey.json";

// Confirmed Groq free tier limits for qwen/qwen3.6-27b (docs/architecture.md,
// Groq usage): 30 RPM, 1,000 RPD, 8,000 TPM. A fixed delay between calls is
// sufficient at this scale per that doc, no need for a queue. Applied at the
// two points this script directly triggers a Groq call: between segmentation
// and verification within one contract, and between contracts.
const GROQ_CALL_DELAY_MS = 2500;
const BETWEEN_CONTRACTS_DELAY_MS = 5000;

interface AnswerKeySeededIssue {
  clauseType: string;
  description: string;
  severity: "low" | "medium" | "high";
}

interface AnswerKey {
  contractId: string;
  seededIssues: AnswerKeySeededIssue[];
  notes?: string;
}

interface ContractPair {
  contractId: string;
  contractFile: string;
  answerKeyFile: string;
}

// Loaded once in main(), after .env.local is read. baseline.ts reads
// process.env at module load time, so these must be dynamic imports that
// happen after loadDotenv() runs, not static imports (which would be
// hoisted ahead of it).
interface Pipeline {
  extractText: typeof import("../src/lib/extraction").extractText;
  runBaseline: typeof import("../src/lib/baseline").runBaseline;
  runSegmentation: typeof import("../src/lib/segmentation").runSegmentation;
  runAgent: typeof import("../src/lib/agent").runAgent;
}

type BaselineResult = Awaited<ReturnType<Pipeline["runBaseline"]>>["result"];
type AgentResult = Awaited<ReturnType<Pipeline["runAgent"]>>["result"];

async function loadPipeline(): Promise<Pipeline> {
  loadDotenv({ path: path.resolve(process.cwd(), ".env.local") });
  const { extractText } = await import("../src/lib/extraction");
  const { runBaseline } = await import("../src/lib/baseline");
  const { runSegmentation } = await import("../src/lib/segmentation");
  const { runAgent } = await import("../src/lib/agent");
  return { extractText, runBaseline, runSegmentation, runAgent };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function discoverContractPairs(): Promise<ContractPair[]> {
  let entries: string[];
  try {
    entries = await readdir(CONTRACTS_DIR);
  } catch (error) {
    throw new Error(
      `Could not read eval/contracts (${CONTRACTS_DIR}): ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }

  const contractFilesById = new Map<string, string>();
  const answerKeyFilesById = new Map<string, string>();

  for (const entry of entries) {
    if (entry.endsWith(ANSWER_KEY_SUFFIX)) {
      const contractId = entry.slice(0, -ANSWER_KEY_SUFFIX.length);
      answerKeyFilesById.set(contractId, entry);
      continue;
    }
    const ext = CONTRACT_EXTENSIONS.find((e) => entry.toLowerCase().endsWith(e));
    if (ext) {
      const contractId = entry.slice(0, -ext.length);
      contractFilesById.set(contractId, entry);
    }
  }

  const allIds = new Set([...contractFilesById.keys(), ...answerKeyFilesById.keys()]);
  const pairs: ContractPair[] = [];

  for (const contractId of allIds) {
    const contractFile = contractFilesById.get(contractId);
    const answerKeyFile = answerKeyFilesById.get(contractId);
    if (contractFile && answerKeyFile) {
      pairs.push({ contractId, contractFile, answerKeyFile });
    } else if (contractFile && !answerKeyFile) {
      console.warn(
        `Skipping "${contractFile}": no matching ${contractId}${ANSWER_KEY_SUFFIX} found.`
      );
    } else if (answerKeyFile && !contractFile) {
      console.warn(
        `Skipping "${answerKeyFile}": no matching contract file (${contractId}.pdf or .docx) found.`
      );
    }
  }

  return pairs.sort((a, b) => a.contractId.localeCompare(b.contractId));
}

function isAnswerKey(value: unknown): value is AnswerKey {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  if (typeof v.contractId !== "string") return false;
  if (!Array.isArray(v.seededIssues)) return false;
  return v.seededIssues.every((item) => {
    if (typeof item !== "object" || item === null) return false;
    const i = item as Record<string, unknown>;
    return (
      typeof i.clauseType === "string" &&
      typeof i.description === "string" &&
      (i.severity === "low" || i.severity === "medium" || i.severity === "high")
    );
  });
}

function escapeMarkdown(text: string): string {
  return text.replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function renderResultMarkdown(params: {
  contractId: string;
  contractFile: string;
  extractedText: string;
  answerKey: AnswerKey;
  baseline: BaselineResult;
  agent: AgentResult;
}): string {
  const { contractId, contractFile, answerKey, baseline, agent } = params;

  const lines: string[] = [];
  lines.push(`# ${contractId}`);
  lines.push("");
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`Source file: ${contractFile}`);
  lines.push("");

  lines.push("## Seeded issues (answer key)");
  lines.push("");
  if (answerKey.seededIssues.length === 0) {
    lines.push("_None listed in the answer key._");
  } else {
    lines.push("| Clause type | Severity | Description |");
    lines.push("|---|---|---|");
    for (const issue of answerKey.seededIssues) {
      lines.push(
        `| ${issue.clauseType} | ${issue.severity} | ${escapeMarkdown(issue.description)} |`
      );
    }
  }
  if (answerKey.notes) {
    lines.push("");
    lines.push(`Notes: ${answerKey.notes}`);
  }
  lines.push("");

  lines.push("## Agent (Groq, playbook-grounded)");
  lines.push("");
  const flagged = agent.clauses.filter((c) => c.flagged);
  const notFlagged = agent.clauses.filter((c) => !c.flagged);

  lines.push(`### Flagged (${flagged.length})`);
  lines.push("");
  if (flagged.length === 0) {
    lines.push("_None._");
  } else {
    lines.push("| Clause type | Severity | Rule | Reason | Excerpt |");
    lines.push("|---|---|---|---|---|");
    for (const c of flagged) {
      lines.push(
        `| ${c.clauseType} | ${c.severity} | ${c.playbookRuleId} | ${escapeMarkdown(
          c.reason
        )} | ${escapeMarkdown(c.excerpt)} |`
      );
    }
  }
  lines.push("");

  lines.push(`### Not flagged / uncovered (${notFlagged.length})`);
  lines.push("");
  if (notFlagged.length === 0) {
    lines.push("_None._");
  } else {
    lines.push("| Clause type | Severity | Reason | Excerpt |");
    lines.push("|---|---|---|---|");
    for (const c of notFlagged) {
      lines.push(
        `| ${c.clauseType} | ${c.severity} | ${escapeMarkdown(c.reason)} | ${escapeMarkdown(
          c.excerpt
        )} |`
      );
    }
  }
  lines.push("");

  lines.push("## Baseline (Ollama, naive prompt)");
  lines.push("");
  if (baseline.concerns.length === 0) {
    lines.push("_No concerns raised._");
  } else {
    for (const concern of baseline.concerns) {
      lines.push(`- ${concern.description}`);
    }
  }
  lines.push("");

  return lines.join("\n");
}

async function processContract(
  pair: ContractPair,
  pipeline: Pipeline
): Promise<void> {
  const { contractId, contractFile, answerKeyFile } = pair;
  console.log(`\n=== ${contractId} (${contractFile}) ===`);

  const requestId = randomUUID();
  const timestamp = new Date().toISOString();

  const contractBuffer = await readFile(path.join(CONTRACTS_DIR, contractFile));
  const answerKeyRaw = await readFile(
    path.join(CONTRACTS_DIR, answerKeyFile),
    "utf-8"
  );

  let parsedAnswerKey: unknown;
  try {
    parsedAnswerKey = JSON.parse(answerKeyRaw);
  } catch (error) {
    throw new Error(
      `Failed to parse ${answerKeyFile} as JSON: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
  if (!isAnswerKey(parsedAnswerKey)) {
    throw new Error(
      `${answerKeyFile} does not match the expected answer key shape ` +
        `{ contractId, seededIssues: [{ clauseType, description, severity }] } per docs/eval.md`
    );
  }
  const answerKey = parsedAnswerKey;

  console.log("Extracting text...");
  const extractedText = await pipeline.extractText(contractBuffer, contractFile, "");

  console.log("Running baseline (Ollama)...");
  const { result: baseline, trace: baselineTrace } = await pipeline.runBaseline(
    extractedText
  );

  console.log("Running segmentation (Groq)...");
  const { clauses: segmentedClauses, trace: segmentationTrace } =
    await pipeline.runSegmentation(extractedText);

  await sleep(GROQ_CALL_DELAY_MS);

  console.log("Running verification (Groq)...");
  const { result: agent, traces: verificationTraces } = await pipeline.runAgent(
    segmentedClauses
  );

  const finalOutput = { extractedText, baseline, agent };

  try {
    await writeTrajectoryLog({
      requestId,
      timestamp,
      extractedText,
      baselineCall: baselineTrace,
      segmentationCall: segmentationTrace,
      verificationCalls: verificationTraces,
      finalOutput,
    });
  } catch (error) {
    console.error("Failed to write trajectory log:", error);
  }

  const markdown = renderResultMarkdown({
    contractId,
    contractFile,
    extractedText,
    answerKey,
    baseline,
    agent,
  });

  await mkdir(RESULTS_DIR, { recursive: true });
  const outPath = path.join(RESULTS_DIR, `${contractId}.md`);
  await writeFile(outPath, markdown, "utf-8");
  console.log(`Wrote ${outPath}`);
}

async function main() {
  const pairs = await discoverContractPairs();

  if (pairs.length === 0) {
    console.log(
      `No contract/answer-key pairs found in ${CONTRACTS_DIR}. Nothing to run. ` +
        "This is expected until contracts are added; contract sourcing is a separate task."
    );
    return;
  }

  console.log(`Found ${pairs.length} contract(s) to evaluate.`);

  const pipeline = await loadPipeline();
  const failures: { contractId: string; error: string }[] = [];

  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    try {
      await processContract(pair, pipeline);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`FAILED: ${pair.contractId}: ${message}`);
      failures.push({ contractId: pair.contractId, error: message });
    }

    if (i < pairs.length - 1) {
      await sleep(BETWEEN_CONTRACTS_DELAY_MS);
    }
  }

  console.log(
    `\nDone. ${pairs.length - failures.length}/${pairs.length} contract(s) succeeded.`
  );
  if (failures.length > 0) {
    console.log("Failures:");
    for (const f of failures) {
      console.log(`  - ${f.contractId}: ${f.error}`);
    }
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("Eval run failed:", error);
  process.exitCode = 1;
});
