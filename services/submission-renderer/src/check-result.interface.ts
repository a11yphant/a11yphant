export interface CheckedRule {
  rule?: Rule;
  passes: boolean;
  reason: string;
  description: string;
}

export interface CheckedRequirement {
  requirement: Requirement;
  checkedRules: CheckedRule[];
}

export interface CheckResult {
  checkedRequirements: CheckedRequirement[];
}

export interface RuleAssignment {
  rule?: Rule;
  mustPass: boolean;
}

export interface Requirement {
  ruleAssignments: RuleAssignment[];
}

interface Rule {
  name: string;
  provider: string;
  configuration: any;
}
