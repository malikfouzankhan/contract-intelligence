# ARCHITECTURE.md

## Pipeline overview
PDF upload, then text extraction, then the baseline path and the agent path run against the same extracted text, then results are returned to the UI as structured JSON.

Baseline path: extracted text, then a naive prompt, then Ollama, then a freeform JSON list of concerns.

Agent path: extracted text, then clause segmentation (Groq call 1), then a playbook lookup per clause, then verification (Groq, split across a few smaller calls grouped by clause type rather than one large batched call, see Groq usage below for why), then a structured JSON report.

## Repo structure
```
/src
  /app
    page.tsx              upload form and report view
    /api/analyze
      route.ts            orchestrates the pipeline for one uploaded PDF
  /lib
    extraction.ts         PDF to text (pdf-parse)
    segmentation.ts       Groq call, splits text into typed clauses
    playbook.ts           loads clause taxonomy and risk rules, see PLAYBOOK.md
    agent.ts              Groq call, verifies clauses against the playbook
    baseline.ts           Ollama call, naive prompt
    types.ts              shared TypeScript types for both paths' output
/eval
  /contracts             test contracts and their ground truth answer keys, see EVAL.md
  run-eval.ts            runs both paths over every test contract, writes results
  /results               markdown output, recall and false positive numbers
.env.local               GROQ_API_KEY, OLLAMA_BASE_URL, OLLAMA_MODEL
.env.example
```

## API contract: POST /api/analyze
Request: multipart form data containing one PDF file.

Response:
```
{
  "extractedText": string,
  "baseline": {
    "concerns": [
      { "description": string }
    ]
  },
  "agent": {
    "clauses": [
      {
        "clauseType": string,
        "excerpt": string,
        "flagged": boolean,
        "severity": "low" | "medium" | "high",
        "reason": string,
        "playbookRuleId": string
      }
    ]
  }
}
```

## Groq usage
- Package: groq-sdk (Groq's official SDK, OpenAI-compatible interface). Confirm the exact import pattern and client setup against Groq's current docs before writing this, do not assume from memory.
- Model: Qwen3.6-27B (model ID qwen/qwen3.6-27b per the account's current available model list, confirm this string is still current before hardcoding it, Groq's lineup has changed before).
- Segmentation: one call per contract.
- Verification: split across a few smaller calls (roughly 2 to 3 clause types per call), not one call covering every clause type at once. This is a deliberate change from the original plan. Confirmed free tier limits for this model are 30 RPM, 1,000 RPD, and only 8,000 TPM, so RPD has headroom to spare but a single large call carrying the full contract text, playbook context for every clause type, and structured output for all of them risks exceeding the TPM ceiling regardless of daily quota left. Smaller, more numerous calls trade a bit of RPD (which is no longer the tight constraint) to stay safely under TPM (which now is).
- Request JSON output explicitly in the prompt and validate the parsed response against the expected schema in code (Groq's OpenAI-compatible API supports a JSON mode, use it if available rather than parsing freeform text). A malformed response must not break the pipeline mid eval, surface it clearly instead.
- Log actual token usage per call during testing to confirm calls are staying comfortably under the 8,000 TPM ceiling, adjust the clause-type grouping per call if not.
- Free tier limits (confirmed from the account's rate limit page, not a published estimate): 30 RPM, 1,000 RPD, 8,000 TPM, 200,000 TPD for this model.

## Ollama usage
- Local REST calls to OLLAMA_BASE_URL, default http://localhost:11434.
- Model: llama3.1:8b, or whatever OLLAMA_MODEL is set to.
- One call per contract, generic prompt, no playbook, no segmentation.
- Requires `ollama pull llama3.1:8b` and the Ollama daemon running locally before use.

## Rate limiting and retries
Any code that calls Groq in a loop, the eval harness especially, needs a basic delay or backoff between calls to respect the free tier limits: 30 RPM, 1,000 RPD, 8,000 TPM for Qwen3.6-27B, confirmed from the account's own rate limit page. TPM is the constraint most likely to bite first given this project's per-call token sizes, watch it specifically, not just request counts. A fixed delay between calls is sufficient at this scale, no need for a sophisticated queue.

## Storage
No database. Uploaded PDFs and pipeline results are handled in memory or a local temp directory for the duration of a request. Nothing needs to persist between sessions.

## Logging, for the agent trajectories deliverable
Each pipeline run should write a JSON log capturing the extracted text, the segmentation prompt and response, the verification prompt and response, and the final output. This becomes the agent trajectory evidence required in the hackathon submission, so it should be built in from the start rather than added later.

## UI
Single page. Upload form, then a report view showing the agent's flagged clauses (clause type, severity, reason). No baseline versus agent comparison in the UI. The eval harness's output table is the comparison evidence, shown separately in the submission, not duplicated in the product itself.

Include a short, visible line in the report view: "This is not legal advice. Flags are for your review, not a final judgment." This reflects the actual design, where the human stays the decision maker, and should not be treated as boilerplate to skip.

## Ground rules this design satisfies
- Human review stays in the loop by construction. The agent only ever produces a report, it never takes an action on the user's behalf.
- No real or sensitive data. All test contracts are public templates or hand edited synthetic variants, see EVAL.md.
- Credentials stay in .env.local, never committed. .env.example documents what is required without real values.