describe("quiz level", () => {
  it("can submit a level", () => {
    cy.visit("/challenge/a-valid-html-document/level/02");
    cy.contains("It tells the browser to use the latest html version to render the page.").click();
    cy.contains("Submit").should("be.enabled").click();
    cy.contains("Correct");
  });
});
