import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export interface LlmCallTrace {
  model: string;
  prompt: string;
  response: string;
  totalTokens?: number;
}

export interface TrajectoryLog {
  requestId: string;
  timestamp: string;
  extractedText: string;
  baselineCall?: LlmCallTrace;
  segmentationCall?: LlmCallTrace;
  verificationCalls?: LlmCallTrace[];
  finalOutput: unknown;
}

const LOGS_DIR = path.join(process.cwd(), "logs");

export async function writeTrajectoryLog(log: TrajectoryLog): Promise<void> {
  await mkdir(LOGS_DIR, { recursive: true });
  const safeTimestamp = log.timestamp.replace(/[:.]/g, "-");
  const filePath = path.join(LOGS_DIR, `${safeTimestamp}-${log.requestId}.json`);
  await writeFile(filePath, JSON.stringify(log, null, 2), "utf-8");
}
