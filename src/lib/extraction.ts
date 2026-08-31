import { getPath } from "pdf-parse/worker";
import { PDFParse } from "pdf-parse";
import { extractRawText } from "mammoth";

// Turbopack/webpack bundling breaks pdf.js's default relative worker
// resolution, so the worker path must be set explicitly before any
// PDFParse instance is created. See pdf-parse's Next.js worker docs.
PDFParse.setWorker(getPath());

const PDF_MIME_TYPE = "application/pdf";
const DOCX_MIME_TYPE =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

async function extractPdfText(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    return result.text;
  } finally {
    await parser.destroy();
  }
}

async function extractDocxText(buffer: Buffer): Promise<string> {
  const result = await extractRawText({ buffer });
  return result.value;
}

export async function extractText(
  buffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> {
  const extension = fileName.toLowerCase().split(".").pop();

  if (extension === "pdf" || mimeType === PDF_MIME_TYPE) {
    return extractPdfText(buffer);
  }

  if (extension === "docx" || mimeType === DOCX_MIME_TYPE) {
    return extractDocxText(buffer);
  }

  throw new Error(
    `Unsupported file type: "${fileName}" (${mimeType || "unknown MIME type"}). Only .pdf and .docx are supported.`
  );
}
