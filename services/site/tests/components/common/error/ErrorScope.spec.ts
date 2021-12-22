import { ErrorScope, errorScopeForOperationContext, LocalErrorScopeApolloContext } from "app/components/common/error/ErrorScope";

describe("Error Scope", () => {
  it("returns local error scope", () => {
    const errorScope = errorScopeForOperationContext(LocalErrorScopeApolloContext);
    expect(errorScope).toBe(ErrorScope.Local);
  });

  it("returns global error scope", () => {
    const errorScope = errorScopeForOperationContext({ a: "b" });
    expect(errorScope).toBe(ErrorScope.Global);
  });
});
