import { createUnionType } from "@nestjs/graphql";

import { RequestPasswordResetErrorResult } from "./request-password-reset-error.result";
import { RequestPasswordResetSuccessResult } from "./request-password-reset-success.result";

export function resolveType(
  value: RequestPasswordResetSuccessResult | RequestPasswordResetErrorResult,
): typeof RequestPasswordResetSuccessResult | typeof RequestPasswordResetErrorResult {
  if ("result" in value) {
    return RequestPasswordResetSuccessResult;
  }

  return RequestPasswordResetErrorResult;
}

export const RequestPasswordResetResult = createUnionType({
  name: "RequestPasswordResetResult",
  description: "The result of a reset password operation.",
  types: () => [RequestPasswordResetSuccessResult, RequestPasswordResetErrorResult],
  resolveType,
});
