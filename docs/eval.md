# EVAL.md

## Purpose
Defines the test data format and the manual scoring process used to compare the baseline and agent paths. This is the evidence behind the Measured Improvement section of the submission.

## Test contract set
- Source: real public contract templates, for example freelance agreements, NDAs, or consulting agreements from Common Paper, Law Insider sample clauses, or SEC EDGAR exhibits.
- Target: around 10 contracts, each with one or more clauses hand edited to match a risk pattern from PLAYBOOK.md.
- Include at least one deliberately hard case, for example a clause reworded to look standard on the surface while still matching a risk pattern.

## File format
Each test contract has two files in /eval/contracts:
```
contract-01.pdf                the contract itself
contract-01.answerkey.json     what was seeded and why
```

Answer key format:
```
{
  "contractId": "contract-01",
  "seededIssues": [
    {
      "clauseType": "liability",
      "description": "Liability cap removed, consequential damages explicitly included",
      "severity": "high"
    }
  ],
  "notes": "optional, for the hard case explain what makes it tricky"
}
```

## Running the eval
/eval/run-eval.ts loops over every contract in /eval/contracts, runs both the baseline and agent paths on each, and writes raw output per contract to /eval/results. It should include a delay between Gemini calls to respect the free tier rate limit.

## Scoring: manual
Per the hackathon's own guidance, this evaluation is run and scored by the builder, not by an automated judge. For each contract:
1. Compare the agent's structured flags against the answer key. Did it catch each seeded issue, with a severity and clauseType that reasonably matches.
2. Read the baseline's freeform output against the same answer key. Does any part of the text describe the seeded issue, even loosely worded.
3. Record a hit or miss for each seeded issue, for both paths.
4. Note any false positive: either path flagging something not in the answer key that is not a genuine issue.

This is done by hand rather than with a third LLM judge, since an automated judge introduces its own reliability question that would need separate justification, and the hackathon brief explicitly allows and expects a self designed rubric where the default format does not fit.

## Metrics
- Recall: seeded issues caught divided by seeded issues total, computed separately for baseline and agent.
- False positive rate: flags raised that are not genuine seeded issues, divided by total flags raised, computed separately for baseline and agent.

## Output
A markdown table per contract and a summary table across all contracts, written to /eval/results. This table is the direct evidence for the changelog and the final baseline comparison in the submission.

## Changelog
Track every meaningful change to the agent path here as it happens, not reconstructed after the fact: what was tried, why, what the eval numbers showed, what was kept or reverted. Include anything that was tried and removed, this is explicitly valued in the hackathon's rubric as a sign of a real iterative process.