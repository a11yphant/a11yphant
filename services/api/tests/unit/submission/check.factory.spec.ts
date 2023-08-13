import { createMock } from "@golevelup/ts-jest";
import { Logger } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";

import { CheckFactory } from "@/submission/checks/check.factory";
import { Check } from "@/submission/checks/check.interface";
import { CheckProviderNotFound as CheckProviderNotFoundException } from "@/submission/exceptions/check-provider-not-found.exception";
import { RuleCheckResult } from "@/submission/interfaces/rule-check-result.interface";

describe("check factory", () => {
  it("resolves the correct check", () => {
    const TestCheck = class TestCheck implements Check {
      run(): Promise<RuleCheckResult> {
        return Promise.resolve({ id: "1", status: "failed" });
      }
    };

    const factory = new CheckFactory(
      createMock<Logger>(),
      {
        "test-check": TestCheck,
      },
      createMock<ModuleRef>({ get: jest.fn().mockReturnValue(new TestCheck()) }),
    );

    const check = factory.get("test-check");

    expect(check).toBeInstanceOf(TestCheck);
  });

  it("returns null if the check was not found", () => {
    const factory = new CheckFactory(createMock<Logger>(), {}, createMock<ModuleRef>());

    expect(factory.get("not-existing-test")).toBeNull();
  });

  it("throws an exception if no provider was registered for a check", () => {
    const factory = new CheckFactory(
      createMock<Logger>(),
      { check: class {} },
      createMock<ModuleRef>({
        get: jest.fn(() => {
          throw new Error("unknown provider");
        }),
      }),
    );

    expect(() => factory.get("check")).toThrowError(CheckProviderNotFoundException);
  });
});
