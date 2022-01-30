import { ChangePasswordErrorCodes } from "@/authentication/graphql/enums/change-password-error-codes.enum";
import { ChangePasswordSuccessResultEnum } from "@/authentication/graphql/enums/change-password-success-result.enum";
import { ChangePasswordErrorResult } from "@/authentication/graphql/results/change-password-error-result";
import { resolveType } from "@/authentication/graphql/results/change-password-result";
import { ChangePasswordSuccessResult } from "@/authentication/graphql/results/change-password-success.result";

describe("change password result", () => {
  it("resolves to a change password success result on success", () => {
    expect(resolveType({ result: ChangePasswordSuccessResultEnum.SUCCESS })).toBe(ChangePasswordSuccessResult);
  });

  it("resolves to the change password error result on invalid operation error", () => {
    expect(resolveType({ errorCode: ChangePasswordErrorCodes.INVALID_OPERATION, inputErrors: [] })).toBe(ChangePasswordErrorResult);
  });

  it("resolves to the change password error result on user input error", () => {
    expect(resolveType({ errorCode: ChangePasswordErrorCodes.BAD_USER_INPUT, inputErrors: [] })).toBe(ChangePasswordErrorResult);
  });
});
