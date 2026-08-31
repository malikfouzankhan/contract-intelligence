# PLAYBOOK.md

## Purpose
The playbook is the agent's reference for what a standard clause looks like versus what counts as a deviation worth flagging. It is what separates the agent path from the baseline: the agent verifies clauses against explicit criteria, the baseline has no such reference.

## Format
A JSON or TypeScript config, one entry per clause type. This is a starting taxonomy based on common risk areas in freelance and consulting contracts. Treat it as a first draft, refine it once real test contracts are in hand.

```
{
  "liability": {
    "standard": "Liability is capped, typically at fees paid or a fixed multiple of fees paid. Consequential and indirect damages are typically excluded.",
    "riskPatterns": [
      "Uncapped or unlimited liability",
      "Explicit inclusion of indirect or consequential damages",
      "No mutual cap, liability runs one way only"
    ],
    "severity": "high"
  },
  "termination": {
    "standard": "Either party may terminate with reasonable notice, commonly 30 days, or for cause with a defined cure period.",
    "riskPatterns": [
      "Termination available to only one party",
      "No notice period, or an unreasonably short one",
      "No cure period for termination for cause"
    ],
    "severity": "medium"
  },
  "ip_assignment": {
    "standard": "IP assignment is limited to the deliverables created under this specific engagement.",
    "riskPatterns": [
      "Assignment extends to pre existing IP or work outside the engagement",
      "Assignment of IP created for other clients",
      "No carve out for the contractor's own tools, templates, or frameworks"
    ],
    "severity": "high"
  },
  "non_compete": {
    "standard": "Narrow in scope and duration if present at all, commonly under 12 months and limited to direct competitors.",
    "riskPatterns": [
      "Duration exceeding 12 months",
      "Overly broad geographic or industry scope",
      "Applies beyond the direct engagement to unrelated future work"
    ],
    "severity": "medium"
  },
  "auto_renewal": {
    "standard": "If present, requires clear advance notice to cancel, commonly 30 to 60 days.",
    "riskPatterns": [
      "Very short cancellation window",
      "No reminder or notice obligation before renewal",
      "Renewal terms differ from the original terms without clear disclosure"
    ],
    "severity": "low"
  },
  "payment_terms": {
    "standard": "Clear payment schedule and timeline, commonly net 30 or shorter, with defined late payment consequences.",
    "riskPatterns": [
      "Vague or undefined payment timeline",
      "Net 60 or longer with no penalty for late payment",
      "Client can withhold payment at their sole discretion"
    ],
    "severity": "medium"
  },
  "confidentiality": {
    "standard": "Mutual confidentiality obligations, reasonable duration, commonly 2 to 5 years, clear carve outs for public or independently known information.",
    "riskPatterns": [
      "One directional confidentiality favoring only the client",
      "Indefinite duration with no carve outs",
      "Definition of confidential information is unreasonably broad"
    ],
    "severity": "low"
  },
  "indemnification": {
    "standard": "Mutual indemnification, or indemnification scoped narrowly to each party's own breaches or negligence.",
    "riskPatterns": [
      "One directional indemnification favoring only the client",
      "Indemnification extends to matters outside the contractor's control",
      "No cap tied to the indemnification obligation"
    ],
    "severity": "high"
  }
}
```

## Notes for whoever builds the seeded test contracts
Each risk pattern above is meant to be directly seedable. Take a standard clause from a real public template and edit it to match one risk pattern. Keep one seeded issue per clause where possible, so each flag in the agent's output can be traced to exactly one ground truth item. See EVAL.md for how seeded contracts pair with their answer keys.

## How the agent uses this
During verification, each segmented clause is matched to a clauseType, then checked against that type's standard and riskPatterns. A clause that matches a risk pattern is flagged with the corresponding severity and a reason referencing the specific deviation. A clause with no clauseType match, something the playbook does not cover, should be passed through unflagged rather than guessed at. This keeps false positives down and keeps the agent honest about the boundaries of what it checks.