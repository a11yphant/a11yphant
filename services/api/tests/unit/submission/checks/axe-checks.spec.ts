import { AXE_CHECKS_TO_CHECK_NAMES_MAP, buildCheckNames, buildCheckProviders } from "@/submission/checks/axe-checks";

describe("axe checks", () => {
  describe("build check names", () => {
    it("prefixes the names with axe", () => {
      const checkNames = buildCheckNames(["foo", "bar"]);
      expect(checkNames).toEqual(["axe-foo", "axe-bar"]);
    });
  });

  describe("axe check names map", () => {
    it("maps the check names to the provider names", () => {
      for (const [checkName, providerName] of Object.entries(AXE_CHECKS_TO_CHECK_NAMES_MAP)) {
        expect(checkName).toContain("axe-");
        expect(providerName).toEqual(checkName);
      }
    });
  });

  describe(" build check providers", () => {
    it("provides the the correct keys", () => {
      const [provider] = buildCheckProviders(["link-name"]);

      expect(provider.provide).toEqual("axe-link-name");
    });

    it("provides classes for the keys", () => {
      const [provider] = buildCheckProviders(["link-name"]);

      expect(provider.useClass).toBeInstanceOf(Function);
    });
  });
});
