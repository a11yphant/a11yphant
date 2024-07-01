import { ClassProvider } from "@nestjs/common";
import { getRules } from "axe-core";

import { AxeCheck } from "./base-checks/axe.check";

export const AVAILABLE_AXE_CHECKS = getRules().map((rule) => rule.ruleId);

function buildCheckName(checkName: string): string {
  return `axe-${checkName}`;
}

export function buildCheckNames(checkNames: string[]): string[] {
  return checkNames.map(buildCheckName);
}

export const AXE_CHECKS_TO_CHECK_NAMES_MAP: { [key: string]: string } = AVAILABLE_AXE_CHECKS.reduce((acc, checkName) => {
  acc[buildCheckName(checkName)] = buildCheckName(checkName);
  return acc;
}, {});

export function buildCheckProviders(checkNames: string[]): ClassProvider[] {
  return checkNames.map((checkName) => ({
    provide: buildCheckName(checkName),
    useClass: AxeCheck(checkName),
  }));
}
