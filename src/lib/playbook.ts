export type Severity = "low" | "medium" | "high";

export interface PlaybookEntry {
  standard: string;
  riskPatterns: string[];
  severity: Severity;
}

// Mirrors docs/playbook.md exactly. Do not add, remove, or reword entries
// here without updating that doc first.
export const PLAYBOOK = {
  liability: {
    standard:
      "Liability is capped, typically at fees paid or a fixed multiple of fees paid. Consequential and indirect damages are typically excluded.",
    riskPatterns: [
      "Uncapped or unlimited liability",
      "Explicit inclusion of indirect or consequential damages",
      "No mutual cap, liability runs one way only",
    ],
    severity: "high",
  },
  termination: {
    standard:
      "Either party may terminate with reasonable notice, commonly 30 days, or for cause with a defined cure period.",
    riskPatterns: [
      "Termination available to only one party",
      "No notice period, or an unreasonably short one",
      "No cure period for termination for cause",
    ],
    severity: "medium",
  },
  ip_assignment: {
    standard:
      "IP assignment is limited to the deliverables created under this specific engagement.",
    riskPatterns: [
      "Assignment extends to pre existing IP or work outside the engagement",
      "Assignment of IP created for other clients",
      "No carve out for the contractor's own tools, templates, or frameworks",
    ],
    severity: "high",
  },
  non_compete: {
    standard:
      "Narrow in scope and duration if present at all, commonly under 12 months and limited to direct competitors.",
    riskPatterns: [
      "Duration exceeding 12 months",
      "Overly broad geographic or industry scope",
      "Applies beyond the direct engagement to unrelated future work",
    ],
    severity: "medium",
  },
  auto_renewal: {
    standard:
      "If present, requires clear advance notice to cancel, commonly 30 to 60 days.",
    riskPatterns: [
      "Very short cancellation window",
      "No reminder or notice obligation before renewal",
      "Renewal terms differ from the original terms without clear disclosure",
    ],
    severity: "low",
  },
  payment_terms: {
    standard:
      "Clear payment schedule and timeline, commonly net 30 or shorter, with defined late payment consequences.",
    riskPatterns: [
      "Vague or undefined payment timeline",
      "Net 60 or longer with no penalty for late payment",
      "Client can withhold payment at their sole discretion",
    ],
    severity: "medium",
  },
  confidentiality: {
    standard:
      "Mutual confidentiality obligations, reasonable duration, commonly 2 to 5 years, clear carve outs for public or independently known information.",
    riskPatterns: [
      "One directional confidentiality favoring only the client",
      "Indefinite duration with no carve outs",
      "Definition of confidential information is unreasonably broad",
    ],
    severity: "low",
  },
  indemnification: {
    standard:
      "Mutual indemnification, or indemnification scoped narrowly to each party's own breaches or negligence.",
    riskPatterns: [
      "One directional indemnification favoring only the client",
      "Indemnification extends to matters outside the contractor's control",
      "No cap tied to the indemnification obligation",
    ],
    severity: "high",
  },
} as const satisfies Record<string, PlaybookEntry>;

export type ClauseType = keyof typeof PLAYBOOK;

export const CLAUSE_TYPES = Object.keys(PLAYBOOK) as ClauseType[];

// Clause type used for content that segmentation could not match to any
// entry above. Not part of the playbook itself.
export const UNCOVERED_CLAUSE_TYPE = "other";

export function isClauseType(value: string): value is ClauseType {
  return Object.prototype.hasOwnProperty.call(PLAYBOOK, value);
}

export function getPlaybookEntry(clauseType: ClauseType): PlaybookEntry {
  return PLAYBOOK[clauseType];
}
