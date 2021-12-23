import { UserFactory } from "@tests/support/factories/models/user.factory";

import { ResetPasswordErrorCodes } from "@/authentication/graphql/enums/reset-password-error-codes.enum";
import { resolveType } from "@/authentication/graphql/results/reset-password.result";
import { ResetPasswordErrorResult } from "@/authentication/graphql/results/reset-password-error.result";
import { User } from "@/user/models/user.model";

describe("reset password result", () => {
  it("resolves to the user on success", () => {
    expect(resolveType(UserFactory.build())).toBe(User);
  });

  it("resolves to the reset password error result on error", () => {
    expect(resolveType({ errorCode: ResetPasswordErrorCodes.INPUT_VALIDATION_ERROR, inputErrors: [] })).toBe(ResetPasswordErrorResult);
  });
});
