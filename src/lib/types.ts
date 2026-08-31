import type { Severity } from "./playbook";

export interface BaselineConcern {
  description: string;
}

export interface BaselineResult {
  concerns: BaselineConcern[];
}

export interface AgentClause {
  clauseType: string;
  excerpt: string;
  flagged: boolean;
  severity: Severity;
  reason: string;
  playbookRuleId: string;
}

export interface AgentResult {
  clauses: AgentClause[];
}

export interface AnalyzeResponse {
  extractedText: string;
  baseline: BaselineResult;
  agent: AgentResult;
}
