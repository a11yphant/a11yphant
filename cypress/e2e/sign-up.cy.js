function getInputByLabel(label) {
  return cy.contains("label", label).parent().find("input");
}

describe("sign up", () => {
  it("can sign up", { scrollBehavior: "center" }, () => {
    Cypress.Cookies.debug(true);
    cy.visit("/");

    getInputByLabel("Name").type("Sign up user");
    getInputByLabel("Email").type("sign-up@a11yphant.com");
    getInputByLabel("Password").type("very-secret");
    const form = cy.get('[aria-label="Sign up form"]');
    form.contains("button", "Sign Up").click();

    cy.contains("Welcome! Thank's for signing up.").should("exist");
  });
});
