# Contract Intelligence Agent

A hackathon submission for micro1's Agentic Workflows Hackathon.

## Problem & user

Freelancers and solo professionals sign contracts constantly (consulting agreements, NDAs, statements of work) and almost never get them reviewed by a lawyer first. A real attorney review runs roughly $200 to $500 per contract, which puts it out of reach for routine work. So people either sign unread, or paste the contract into a general-purpose chat model and hope for the best.

The second option feels safer than it is. General-purpose LLMs will absolutely review a contract if you ask them to, but with no standard to compare against and no consistency between runs: the same contract can get a different set of concerns depending on the day. This project builds an agent that reviews a contract against an explicit, written playbook of standard versus risky clause patterns, and measures, not just claims, whether that grounding actually produces more reliable output than naive prompting.

## What this is not

- **Not a legal advice tool.** The output is "flag for review," not a legal opinion.
- **Not a replacement for a lawyer** on complex or high-value contracts.
- **Not a diagnosis system.** It flags deviations from a defined standard; it does not judge what makes a contract "good" beyond that standard.

## How it works

Both paths start from the same extracted contract text (PDF or DOCX).

- **Baseline:** the raw text goes to Ollama (`llama3.1:8b`, running locally) with one generic prompt ("review this contract and flag concerns") and comes back as a freeform list of concerns. No clause typing, no playbook, no grounding. This represents what someone gets today by pasting a contract into a general chat model.
- **Agent:** the text is first segmented into typed clauses by Groq, then each clause is checked against an explicit playbook entry for its type (a written standard and a list of specific risk patterns), and Groq verifies whether the clause matches the standard or one of the risk patterns. The result is structured: clause type, severity, a specific reason, and a `playbookRuleId` tracing the flag back to the exact rule that triggered it.

Full pipeline design lives in [docs/architecture.md](docs/architecture.md); the playbook itself, clause type by clause type, lives in [docs/playbook.md](docs/playbook.md).

## Improvement Changelog

| Stage | What was tried and why | Evidence | Decision/Learning |
|---|---|---|---|
| Baseline | Naive prompt ("review this contract and flag concerns") sent directly to Ollama (`llama3.1:8b`) locally, no clause taxonomy, no playbook, no grounding. Represents the status quo: pasting a contract into a general chat model. | On the 10-contract eval set: 8 of 10 seeded issues fully hit, 1 partial, 1 miss. On the one deliberately clean control contract, it raised 4 ungrounded complaints with no risk framework behind any of them (an earlier run of the same clean contract raised 8, one a literal duplicate; see Hot Take). | Confirms the project's premise: an ungrounded review is inconsistent and can't distinguish a real flag from an invented one. Motivates the playbook-grounded agent path below. |
| Iteration 1: playbook-grounded verification | Two-call agent pipeline: Groq segments the contract into typed clauses, then verifies each clause against an explicit playbook entry (a written standard plus specific risk patterns) for its type, producing clause type, severity, reason, and a `playbookRuleId` per clause. | 10 of 10 seeded issues caught across the eval set (100% recall), including a compound issue (`mutual-nda`) correctly split into its two component deviations, and the deliberately subtle hard case (`video-production`'s cap that looks capped but is swallowed by its own exceptions). | Grounding against an explicit, written standard, rather than free-form model judgment, is what makes both correctness and traceability (a specific rule behind every flag) possible. |
| Iteration 2: reasoning-model token trap | Verification calls to `qwen/qwen3.6-27b` (a reasoning model) initially failed outright with "max completion tokens reached before generating a valid document", the model was spending its completion budget on hidden chain-of-thought before ever emitting the required JSON. | Setting `reasoning_effort: "none"` (documented specifically for qwen3 models) fixed this in initial testing. But on a later full eval run, `mutual-nda`'s verification call still failed the same way once, then succeeded cleanly on an identical retry; see Hot Take. | Reasoning suppression via `reasoning_effort` is necessary but not sufficient: a reasoning model's "thinking out loud" can leak into a structured-output field itself, not just a separate token budget. Documented as an ongoing risk, not a closed issue. |
| Iteration 3: TPM-aware chunking | Originally planned as one large batched verification call covering every playbook clause type per contract, to conserve request quota (RPD). After confirming this Groq account's actual free-tier limits (30 RPM, 1,000 RPD, 8,000 TPM), it became clear RPD had headroom to spare, but one large call carrying full playbook context for every clause type risked exceeding the 8,000 TPM ceiling regardless of daily quota remaining. | Verification was re-split into smaller calls grouped by clause type (up to 3 types per call). Observed per-call token usage during eval runs stayed at roughly 700–950 tokens, comfortably under the TPM ceiling even across a contract touching all 8 playbook clause types. | The assumed binding constraint (RPD) was wrong; batching to save request count actively worked against the real constraint (TPM). Right-sized chunking, not maximal batching, was correct once the real numbers were confirmed rather than assumed. |
| Iteration 4: segmentation fragmentation | Segmentation's prompt instructed the model to avoid fragmenting "a single clause," with no anchor to the contract's own structure for what counts as one clause. | On `data-analytics-consulting` (the deliberately clean control contract), segmentation split "This Agreement shall continue for successive quarterly terms unless terminated." off from the termination and notice-period language immediately following it in the same numbered section. Verification evaluated the orphaned fragment alone, mislabeled it `auto_renewal`, and flagged a false positive: the fragment alone has no visible notice period, though the full section does. Confirmed by inspecting the flagged excerpt directly against the source contract. | A concrete fix was proposed: anchor clause boundaries to the contract's own numbered-section structure rather than the model's semantic judgment of "one discrete term", but has not been applied or reverified. Documented here as a known, understood limitation, not a closed issue. |

**A note on the stack:** the agent path was originally planned against Gemini 2.5 Flash. Partway through the build, Google blocked that model for new API keys ahead of its public shutdown date. The project moved to Groq's free tier instead; after checking available models against this account's actual rate limits, it settled on `qwen/qwen3.6-27b` for stronger benchmarked reasoning quality at identical rate limits to the alternative (`gpt-oss-120b`). This was a build-environment decision, not an agent-design iteration, which is why it's noted here rather than in the changelog table above.

## Final baseline comparison

Both paths were run against the same 10-contract eval set: nine contracts each hand-seeded with one or more risk patterns from the playbook, one deliberately left clean as a control, and one (`video-production`) deliberately written as a hard case: a liability cap that looks standard on first read but is swallowed by its own broad exceptions.

| Contract | Seeded issue(s) | Agent result | Baseline result |
|---|---|---|---|
| content-writing | auto_renewal | Hit | Hit |
| data-analytics-consulting | none (clean control) | 1 false positive (segmentation bug, see changelog) | 4 ungrounded complaints, no real issue found (8 in an earlier run; see Hot Take) |
| freelance-web-dev | liability | Hit | Hit |
| graphic-design | termination | Hit | Hit |
| marketing-consulting | ip_assignment | Hit | Miss: never identifies that the consultant's own frameworks are being assigned away |
| mutual-nda | confidentiality (compound: one-directional + indefinite duration) | Hit: correctly split into two precise flags covering both deviations | Partial: catches the indefinite-duration half, misses the one-directional half |
| photography-services | payment_terms | Hit | Hit |
| software-consulting | non_compete | Hit | Hit |
| ux-ui-design | indemnification, auto_renewal | Both hit | Both hit |
| video-production (hard case) | liability (illusory cap via broad exceptions) | Hit: correctly identified that the exceptions swallow the cap | Hit, vaguer, but touches the right substance |

**Final numbers:**

- **Agent recall:** 10 of 10 seeded issues caught (100%), including a compound issue split correctly into its two component deviations, and the deliberately subtle hard case.
- **Agent false positives:** 2 of 13 total flags raised (about 15%), both explained in the changelog above (`data-analytics-consulting`'s segmentation fragmentation, and a stretched rule match on `content-writing`'s confidentiality clause), not random noise.
- **Baseline recall:** 8 of 10 fully hit, 1 partial (`mutual-nda`, catches one of the two deviations making up the compound seeded issue), 1 miss (`marketing-consulting`).
- **On the one clean contract**, baseline raised 4 ungrounded complaints in the final reported run, versus the agent's single explainable false positive on the same contract.

## Hot take: reasoning instability on boundary-adjacent clauses

This is observed, reproduced behavior, not speculation.

`mutual-nda` failed outright on an earlier full eval run: Groq's verification call for it spent its entire completion token budget on internal deliberation and never closed valid JSON, surfacing as a clean error rather than a crash or a silent empty result. On a later run, using the identical pipeline and identical contract text, the same call resolved cleanly.

The lesson: `reasoning_effort: "none"` reduces but does not eliminate a model's tendency to "think out loud" inside a structured output field when a clause sits close to a genuine boundary in the playbook. This makes both false positives and outright pipeline failures probabilistic rather than deterministic: a single eval run can look cleaner, or worse, than the pipeline's real underlying behavior. A production version of this tool would likely need a stricter length cap on the `reason` field itself, a more deterministic sampling setting for verification specifically, or a retry-on-suspicious-output step, rather than trusting a single pass, especially for anything actually shipped rather than evaluated once.

As a small supporting data point: baseline's output on the clean control contract wasn't stable either; 4 ungrounded complaints in the run reported above, versus 8 (one a literal duplicate) in an earlier run of the identical contract. Non-determinism here isn't unique to Groq's verification step.

## Further reading

- [docs/architecture.md](docs/architecture.md): system design, folder structure, API contract, schemas
- [docs/playbook.md](docs/playbook.md): the full clause taxonomy and risk patterns the agent checks against
- [docs/eval.md](docs/eval.md): test data format, eval harness design, scoring methodology
- [REPRODUCTION.md](REPRODUCTION.md): how to run this yourself from a clean environment
