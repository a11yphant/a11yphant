describe("code level", () => {
    it("can submit a level", () => {
        cy.visit("http://localhost:3001/challenge/a-valid-html-document/level/01");

        cy.get("button").contains("Submit").parent("button").should("be.enabled").click();
        cy.contains("loading");
    })
});