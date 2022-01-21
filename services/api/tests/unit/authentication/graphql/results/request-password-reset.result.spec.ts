import { RequestPasswordResetErrorCodes } from "@/authentication/graphql/enums/request-password-reset-error-codes.enum";
import { RequestPasswordResetSuccessResultEnum } from "@/authentication/graphql/enums/request-password-reset-success-result.enum";
import { resolveType } from "@/authentication/graphql/results/request-password-reset.result";
import { RequestPasswordResetErrorResult } from "@/authentication/graphql/results/request-password-reset-error.result";
import { RequestPasswordResetSuccessResult } from "@/authentication/graphql/results/request-password-reset-success.result";

describe("request password reset result", () => {
  it("resolves to a success result on success", () => {
    expect(resolveType({ result: RequestPasswordResetSuccessResultEnum.EMAIL_SENT })).toBe(RequestPasswordResetSuccessResult);
  });

  it("resolves to an error result on error", () => {
    expect(resolveType({ errorCode: RequestPasswordResetErrorCodes.INPUT_VALIDATION_ERROR, inputErrors: [] })).toBe(RequestPasswordResetErrorResult);
  });
});
