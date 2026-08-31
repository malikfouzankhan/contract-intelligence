"use client";

import {
  useEffect,
  useRef,
  useState,
  type DragEvent,
  type FormEvent,
} from "react";
import type { AgentClause, AnalyzeResponse } from "@/lib/types";

type Status = "idle" | "loading" | "error" | "success";

const SEVERITY_RANK: Record<AgentClause["severity"], number> = {
  high: 0,
  medium: 1,
  low: 2,
};

const SEVERITY_META: Record<
  AgentClause["severity"],
  { label: string; card: string; badge: string; dot: string }
> = {
  high: {
    label: "High",
    card: "border-l-red-500 bg-red-50/70 dark:bg-red-950/20",
    badge: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
    dot: "bg-red-500",
  },
  medium: {
    label: "Medium",
    card: "border-l-amber-500 bg-amber-50/70 dark:bg-amber-950/20",
    badge: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  low: {
    label: "Low",
    card: "border-l-sky-500 bg-sky-50/70 dark:bg-sky-950/20",
    badge: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
    dot: "bg-sky-500",
  },
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isSupportedFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return name.endsWith(".pdf") || name.endsWith(".docx");
}

export default function Home() {
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status !== "loading") return;
    const interval = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [status]);

  function chooseFile(file: File) {
    if (!isSupportedFile(file)) {
      setFileError("Only PDF or DOCX files are supported.");
      return;
    }
    setFileError(null);
    setSelectedFile(file);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file) chooseFile(file);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedFile) return;

    setStatus("loading");
    setError(null);
    setResult(null);
    setElapsedSeconds(0);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch("/api/analyze", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error ?? `Request failed with status ${res.status}`);
      }
      setResult(data as AnalyzeResponse);
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus("error");
    }
  }

  function handleReset() {
    setStatus("idle");
    setResult(null);
    setError(null);
    setSelectedFile(null);
    setFileError(null);
  }

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-14 sm:py-20">
      <div className="w-full max-w-xl">
        <header className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/30">
            <IconShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              Contract Intelligence Agent
            </h1>
            <p className="text-sm text-foreground/60">
              Checked against a playbook of standard vs. risky clauses.
            </p>
          </div>
        </header>

        <div className="mt-10">
          {status !== "success" ? (
            <div className="animate-fade-in-up">
              <UploadCard
                status={status}
                selectedFile={selectedFile}
                fileError={fileError}
                isDragOver={isDragOver}
                elapsedSeconds={elapsedSeconds}
                fileInputRef={fileInputRef}
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onBrowse={(file) => chooseFile(file)}
                onClear={() => {
                  setSelectedFile(null);
                  setFileError(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                onSubmit={handleSubmit}
              />

              {status === "error" && error && (
                <div className="mt-4 animate-fade-in-up rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-100">
                  <div className="flex gap-2.5">
                    <IconAlertTriangle className="h-4.5 w-4.5 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">Something went wrong</p>
                      <p className="mt-1 text-red-800/90 dark:text-red-200/80">
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="animate-fade-in-up flex flex-col gap-5">
              <div className="flex items-start gap-2.5 rounded-xl border border-foreground/10 bg-foreground/[0.03] p-3.5 text-sm text-foreground/70">
                <IconInfo className="h-4 w-4 mt-0.5 shrink-0 text-foreground/40" />
                <p>
                  This is not legal advice. Flags are for your review, not a
                  final judgment.
                </p>
              </div>

              <ReportView clauses={result!.agent.clauses} />

              <button
                onClick={handleReset}
                className="group flex w-fit items-center gap-1.5 self-start rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground"
              >
                <IconArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                Analyze another contract
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function UploadCard(props: {
  status: Status;
  selectedFile: File | null;
  fileError: string | null;
  isDragOver: boolean;
  elapsedSeconds: number;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onBrowse: (file: File) => void;
  onClear: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}) {
  const {
    status,
    selectedFile,
    fileError,
    isDragOver,
    elapsedSeconds,
    fileInputRef,
    onDrop,
    onDragOver,
    onDragLeave,
    onBrowse,
    onClear,
    onSubmit,
  } = props;

  const isLoading = status === "loading";

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      {!selectedFile ? (
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors ${
            isDragOver
              ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10"
              : "border-foreground/15 hover:border-foreground/30 hover:bg-foreground/[0.02]"
          }`}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-foreground/5">
            <IconUploadCloud className="h-5 w-5 text-foreground/50" />
          </div>
          <div>
            <p className="text-sm font-medium">
              Drop your contract here, or{" "}
              <span className="text-indigo-600 dark:text-indigo-400">
                browse
              </span>
            </p>
            <p className="mt-1 text-xs text-foreground/50">PDF or DOCX</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            name="file"
            accept=".pdf,.docx"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onBrowse(file);
            }}
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
            <IconFileText className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{selectedFile.name}</p>
            <p className="text-xs text-foreground/50">
              {formatFileSize(selectedFile.size)}
            </p>
          </div>
          {!isLoading && (
            <button
              type="button"
              onClick={onClear}
              aria-label="Remove file"
              className="shrink-0 rounded-lg p-1.5 text-foreground/40 transition-colors hover:bg-foreground/5 hover:text-foreground/70"
            >
              <IconX className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {fileError && (
        <p className="text-xs font-medium text-red-600 dark:text-red-400">
          {fileError}
        </p>
      )}

      <button
        type="submit"
        disabled={!selectedFile || isLoading}
        className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-sm shadow-indigo-600/20 transition-all hover:bg-indigo-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-foreground/15 disabled:text-foreground/40 disabled:shadow-none dark:disabled:bg-foreground/10"
      >
        {isLoading ? (
          <>
            <IconSpinner className="h-4 w-4 animate-spin" />
            Analyzing… {elapsedSeconds}s
          </>
        ) : (
          "Analyze contract"
        )}
      </button>
      {isLoading && (
        <p className="text-center text-xs text-foreground/45">
          This checks every clause against the playbook — usually a minute or
          two.
        </p>
      )}
    </form>
  );
}

function ReportView({ clauses }: { clauses: AgentClause[] }) {
  const flagged = [...clauses]
    .filter((clause) => clause.flagged)
    .sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity]);

  if (flagged.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 p-5 text-sm text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-100">
        <IconCheckCircle className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <p>No concerns flagged against the playbook.</p>
      </div>
    );
  }

  const counts = { high: 0, medium: 0, low: 0 };
  for (const c of flagged) counts[c.severity]++;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="text-base font-semibold">
          {flagged.length} concern{flagged.length === 1 ? "" : "s"} flagged
        </h2>
        <p className="text-xs text-foreground/50">
          {[
            counts.high && `${counts.high} high`,
            counts.medium && `${counts.medium} medium`,
            counts.low && `${counts.low} low`,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        {flagged.map((clause, i) => {
          const meta = SEVERITY_META[clause.severity];
          return (
            <div
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
              className={`animate-fade-in-up rounded-xl border border-l-4 border-foreground/10 p-4 shadow-sm transition-shadow hover:shadow-md ${meta.card}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium capitalize">
                  {clause.clauseType.replace(/_/g, " ")}
                </span>
                <span
                  className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold ${meta.badge}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                  {meta.label}
                </span>
              </div>
              <p className="mt-1.5 text-sm text-foreground/80">
                {clause.reason}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function IconShieldCheck({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 3l7 3v5c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconUploadCloud({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M7 18a4 4 0 01-1-7.87A5.5 5.5 0 0116.9 8.05 4.5 4.5 0 0117 17H7z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M12 12v6m0-6l-2.5 2.5M12 12l2.5 2.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconFileText({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M7 3.5h7l4 4V19a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 016 19V5A1.5 1.5 0 017 3.5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M14 3.5V8h4.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 13h6M9 16h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconX({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconSpinner({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="42 100"
      />
    </svg>
  );
}

function IconAlertTriangle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 4.5L21 19.5H3L12 4.5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M12 10v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="16.5" r="0.9" fill="currentColor" />
    </svg>
  );
}

function IconCheckCircle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M8.5 12.2l2.3 2.3 4.7-4.9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconInfo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 11v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="8.2" r="0.9" fill="currentColor" />
    </svg>
  );
}

function IconArrowLeft({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M19 12H5m0 0l6-6m-6 6l6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
