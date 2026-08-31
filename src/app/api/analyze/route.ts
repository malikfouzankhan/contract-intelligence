import { randomUUID } from "node:crypto";
import { extractText } from "@/lib/extraction";
import { runBaseline } from "@/lib/baseline";
import { runSegmentation } from "@/lib/segmentation";
import { runAgent } from "@/lib/agent";
import { writeTrajectoryLog } from "@/lib/logging";
import type { AnalyzeResponse } from "@/lib/types";

export async function POST(request: Request) {
  const requestId = randomUUID();
  const timestamp = new Date().toISOString();

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch (error) {
    console.error("Failed to parse multipart form data:", error);
    return Response.json(
      { error: "Request must be multipart/form-data with a contract file" },
      { status: 400 }
    );
  }

  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return Response.json(
      { error: "No contract file provided" },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  let extractedText: string;
  try {
    extractedText = await extractText(buffer, file.name, file.type);
  } catch (error) {
    console.error("Text extraction failed:", error);
    const message = error instanceof Error ? error.message : String(error);
    return Response.json(
      { error: `Failed to extract text from file: ${message}` },
      { status: 422 }
    );
  }

  let baseline;
  let baselineTrace;
  try {
    const run = await runBaseline(extractedText);
    baseline = run.result;
    baselineTrace = run.trace;
  } catch (error) {
    console.error("Baseline (Ollama) call failed:", error);
    const message = error instanceof Error ? error.message : String(error);
    return Response.json(
      { error: `Baseline analysis failed: ${message}` },
      { status: 502 }
    );
  }

  let segmentedClauses;
  let segmentationTrace;
  try {
    const run = await runSegmentation(extractedText);
    segmentedClauses = run.clauses;
    segmentationTrace = run.trace;
  } catch (error) {
    console.error("Segmentation (Groq) call failed:", error);
    const message = error instanceof Error ? error.message : String(error);
    return Response.json(
      { error: `Clause segmentation failed: ${message}` },
      { status: 502 }
    );
  }

  let agent;
  let verificationTraces;
  try {
    const run = await runAgent(segmentedClauses);
    agent = run.result;
    verificationTraces = run.traces;
  } catch (error) {
    console.error("Verification (Groq) call failed:", error);
    const message = error instanceof Error ? error.message : String(error);
    return Response.json(
      { error: `Clause verification failed: ${message}` },
      { status: 502 }
    );
  }

  const response: AnalyzeResponse = { extractedText, baseline, agent };

  try {
    await writeTrajectoryLog({
      requestId,
      timestamp,
      extractedText,
      baselineCall: baselineTrace,
      segmentationCall: segmentationTrace,
      verificationCalls: verificationTraces,
      finalOutput: response,
    });
  } catch (error) {
    console.error("Failed to write trajectory log:", error);
  }

  return Response.json(response);
}
