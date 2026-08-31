# CLAUDE.md

## Project
Contract Intelligence Agent, a hackathon submission for micro1's Agentic Workflows Hackathon.

## Problem being solved
Freelancers and solo professionals sign contracts without legal review because attorney review is expensive (roughly $200 to $500 per contract) and out of reach for routine work. General purpose LLMs can review contracts if pasted in directly, but do so inconsistently, without a grounded standard to compare against, and with a documented tendency toward confident but ungrounded output on legal text. This project builds an agent that reviews a contract against an explicit playbook of standard versus risky clause patterns, and proves through a baseline comparison that grounding and verification meaningfully improve reliability over naive prompting.

## What this is not
- Not a legal advice tool. Output is "flag for review," not a legal opinion.
- Not trying to replace a lawyer for complex or high value contracts.
- Not a diagnosis system. It flags deviations from a defined standard, it does not judge what makes a contract "good" beyond that.

## How the two paths work
- Baseline: raw extracted contract text, one generic prompt ("review this contract and flag concerns"), run through Ollama locally, freeform JSON output with no clause typing or grounding. Represents what a non-expert gets today by pasting into a general chat model.
- Agent: raw extracted text, LLM assisted clause segmentation, each clause checked against an explicit playbook of standard versus risky patterns, run through Groq (Qwen3.6-27B), structured JSON output with clause type, severity, and the specific rule that triggered the flag.

Both paths receive identical input text. See ARCHITECTURE.md for the full pipeline and PLAYBOOK.md for the clause taxonomy.

## Tech stack
- Next.js (App Router), TypeScript, single app, no auth, no database
- pdf-parse for text extraction
- Groq API (groq-sdk, OpenAI-compatible) running Qwen3.6-27B for the agent path
- Ollama (local, llama3.1:8b) for the baseline path
- pnpm as package manager
- tsx for running eval scripts

## Repo conventions
- All pipeline logic lives in /src/lib, framework agnostic where possible.
- The API route in /src/app/api/analyze orchestrates the pipeline, it should not contain business logic itself.
- The eval harness lives in /eval, separate from the app, run standalone via tsx.
- No stale or scaffolded UI. If a component is not wired to real logic, it should not ship.
- Environment variables live in .env.local (GROQ_API_KEY, OLLAMA_BASE_URL, OLLAMA_MODEL), never committed. .env.example lists the required keys with placeholder values.
- Respect Groq's confirmed free tier limits for Qwen3.6-27B: 30 RPM, 1,000 RPD, 8,000 TPM. TPM is the binding constraint given this project's per-call sizes, not RPD, verification calls should be chunked by clause type (a few types per call) rather than batched into one large request, see docs/architecture.md for why.

## Rules of engagement, read this before writing anything
1. This document set (CLAUDE.md, ARCHITECTURE.md, PLAYBOOK.md, EVAL.md, PHASES.md) contains the full context and every decision that has already been made about this project. If something you need is not specified here, do not invent a default and continue silently. Stop and ask the user directly.
2. Never fail silently. If an API call errors, a file is missing, a response fails to parse, or anything else goes wrong, surface it clearly, throw, log, or report it, rather than catching the error and quietly working around it or returning a placeholder.
3. Work one phase at a time, see PHASES.md. Do not start the next phase until the current phase's exit criteria are confirmed met. Stop at the end of each phase and report what was built and how it was verified.
4. Do not introduce new dependencies, change the tech stack, alter the API contract, or make any architectural decision not already written in these docs, without asking first and waiting for an answer. If you think a change is warranted, propose it, do not just make it.
5. If a requirement in these docs seems ambiguous, contradictory, or incomplete for the code you are about to write, stop and ask rather than resolving the ambiguity yourself.
6. Your role on this project is implementation. Planning and design decisions have already been made in these docs. Do not redesign, restructure, or second guess the architecture, if something seems like it could be better a different way, ask instead of changing it.

## Docs in this repo
- ARCHITECTURE.md: system design, folder structure, API contracts, schemas
- PLAYBOOK.md: clause taxonomy and risk rules the agent checks against
- EVAL.md: test data format, eval harness design, scoring methodology
- PHASES.md: the phased build plan, work through this in order, one phase per session unless told otherwise

## Build order
See PHASES.md for the full phased plan with exit criteria for each phase. High level order: PDF extraction and API skeleton, then baseline path, then agent path, then UI, then eval harness. Contract sourcing and error seeding happen after all of the above, and are not a Claude Code task, they are handled separately.