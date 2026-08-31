# Reproduction Guide

How to run Contract Intelligence Agent from a clean environment.

## 1. Prerequisites

- **Node.js** — built and tested on v22.21.1. The project should work on any reasonably current Node 20+, but v22.21.1 is what was actually used.
- **pnpm** — the project pins `packageManager: pnpm@11.22.0` in `package.json`; a recent pnpm (via Corepack: `corepack enable`) will pick this up automatically.
- **Ollama**, installed and running locally, with `llama3.1:8b` pulled. This powers the baseline path.
- **A Groq API key** — free tier, from [console.groq.com](https://console.groq.com). This powers the agent path (segmentation and verification).

## 2. Setup

```bash
pnpm install

cp .env.example .env.local
# then edit .env.local and set GROQ_API_KEY to your real key

ollama pull llama3.1:8b
```

`.env.local` needs three values (see `.env.example`):

```
GROQ_API_KEY=your_groq_api_key_here
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b
```

Make sure the Ollama daemon is actually running (`ollama serve`, or however your install starts it) before using the baseline path.

## 3. Running the product

```bash
pnpm dev
```

Open `http://localhost:3000`, upload a contract (PDF or DOCX), and wait — a real run calls both Ollama and Groq and can take a minute or more. The report view shows the agent's flagged clauses (clause type, severity, reason), color-coded by severity, with the required disclaimer line.

## 4. Running the eval harness

```bash
pnpm exec tsx eval/run-eval.ts
```

The 10 test contracts and their hand-seeded answer keys are already included in the repo, under `eval/contracts/` — no setup needed beyond the prerequisites above. The harness:

- Runs both the baseline and agent paths on every contract in `eval/contracts/`
- Writes one readable markdown result per contract to `eval/results/`
- Writes one trajectory log (every prompt and response, for both paths) per contract to `/logs/`

Scoring itself — recall, false positives — is manual, done by comparing each contract's result against its answer key. The harness's job is only to produce output that's easy to read and score by hand, per [docs/eval.md](docs/eval.md); it does not compute metrics itself.

## 5. Expected runtime and cost

The real, observed runtime for a full 10-contract eval run is roughly 13 to 14 minutes against real Groq and Ollama calls — most of that is model response latency, not artificial delay. The harness does include fixed delays between Groq calls (2.5s within a contract, 5s between contracts) to stay comfortably under Groq's free-tier limits for `qwen/qwen3.6-27b` (30 RPM, 1,000 RPD, 8,000 TPM).

Cost is $0 on both providers' free tiers — Ollama runs locally, and the eval set's token usage per contract stays well under Groq's free-tier ceilings.

## 6. A note on reproducing exactly

Across two full eval runs made during development, `mutual-nda`'s verification step showed nondeterministic behavior: it failed outright on one run (a reasoning-model token trap — see the README's Hot Take) and succeeded cleanly on an identical retry with no code changes. If you hit the same transient failure reproducing this, the fix is simply to re-run the harness. This is expected and already documented in the README, not a sign of a broken setup.

## 7. Model versions used

- **Groq:** `qwen/qwen3.6-27b`
- **Ollama:** `llama3.1:8b`

Groq's available model lineup has changed at least once already during this project's development (the originally planned Gemini 2.5 Flash access was blocked mid-build, unrelated to Groq itself, but illustrates how fast this space moves). If you're reproducing this significantly later, confirm `qwen/qwen3.6-27b` is still a valid model string for your account before running anything — a 404 on the segmentation or verification call almost certainly means the model name needs updating, not that something else is broken.
