# PHASES.md

Work through these phases in order. Do not start a phase until the previous one's exit criteria are met. At the end of each phase, stop, summarize what was built, how it was verified, and wait for confirmation before continuing. If anything in a phase is unclear or not covered by CLAUDE.md, ARCHITECTURE.md, PLAYBOOK.md, or EVAL.md, stop and ask rather than deciding on your own.

## Phase 1: PDF extraction and API skeleton
Build:
- src/lib/extraction.ts: takes a PDF buffer, returns extracted text using pdf-parse
- src/app/api/analyze/route.ts: accepts a multipart PDF upload, calls extraction.ts, returns `{ extractedText: string }`. Baseline and agent are not part of this phase, do not build them yet.
- src/lib/types.ts: shared TypeScript types, start with whatever this phase needs, will grow in later phases

Exit criteria: uploading a real PDF to the route (via curl or a minimal test) returns the extracted text as JSON. Handle a corrupt or non-PDF upload with a clear error response, not a silent failure or a crash.

Also verify: uploading a real .docx contract returns extracted text through the same response shape as a PDF upload. An unsupported file type (anything other than .pdf or .docx) must return a clear error, not a silent failure or a crash.

Stop here. Report what was built and how it was tested.

## Phase 2: Baseline path
Build:
- src/lib/baseline.ts: sends the extracted text to Ollama with a generic, naive prompt (no clause taxonomy, no playbook), requests JSON output in the shape defined in ARCHITECTURE.md's API contract, returns `{ concerns: [{ description }] }`
- Wire this into the API route so the response now includes `baseline` alongside `extractedText`
- Write a trajectory log for this call (prompt sent, raw response received) per the Logging section in ARCHITECTURE.md

Exit criteria: uploading a PDF returns extractedText and a populated baseline.concerns array from a real Ollama call. If Ollama is unreachable or returns malformed output, this must surface as a clear error, not a silent empty result.

Stop here. Report what was built and how it was tested.

## Phase 3: Agent path
Build:
- src/lib/playbook.ts: loads the clause taxonomy and risk rules defined in PLAYBOOK.md as a structured config
- src/lib/segmentation.ts: one Gemini call, splits extracted text into typed clauses
- src/lib/agent.ts: one batched Gemini call, checks all segmented clauses against the playbook, returns the full `agent.clauses` structure defined in ARCHITECTURE.md's API contract
- Wire both into the API route so the full response now matches the API contract exactly: extractedText, baseline, and agent
- Write a trajectory log for both Gemini calls (segmentation and verification), same standard as phase 2

Exit criteria: uploading a PDF returns a complete response matching the API contract in ARCHITECTURE.md exactly, with real Gemini output for both segmentation and verification. Respect the 10 requests per minute free tier limit. If either Gemini call errors or returns something that fails to parse against the expected schema, this must surface clearly.

Stop here. Report what was built and how it was tested.

## Phase 4: Minimal web UI
Build:
- src/app/page.tsx: an upload form, and a report view rendering agent.clauses (clause type, severity, reason), with severity indicated visually (for example color)
- Include the required disclaimer line from ARCHITECTURE.md: "This is not legal advice. Flags are for your review, not a final judgment."
- No baseline versus agent comparison view, per ARCHITECTURE.md the UI shows the agent report only

Exit criteria: a full user flow works end to end in the browser, upload a PDF, see the agent's report rendered clearly. No unwired or placeholder UI elements.

Stop here. Report what was built and how it was tested.

## Phase 5: Eval harness
Build:
- eval/run-eval.ts: loops over every contract in eval/contracts (once test data exists, see below), runs both baseline and agent paths on each, writes raw output to eval/results, includes a delay between Gemini calls to respect rate limits
- The scoring itself (recall, false positive rate) is manual per EVAL.md, this script's job is to produce the raw baseline and agent output per contract in a form that is easy to read and score by hand, not to compute the metrics automatically

Exit criteria: the script runs end to end against whatever contracts exist in eval/contracts (even a small placeholder set for testing the script itself), and produces readable per-contract output in eval/results. If eval/contracts is empty at this point, that's expected, ask the user before generating any placeholder or synthetic test contracts of your own, contract sourcing is a separate, deliberate task, not something to fill in automatically.

Stop here. Report what was built and how it was tested.

## After phase 5
Contract sourcing, error seeding, and running the actual scored evaluation happen next, but these are not Claude Code tasks. They involve real public contract templates and hand edited risk patterns and are handled outside this build process.