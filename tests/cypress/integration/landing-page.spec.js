describe("landing page", () => {
    it("contains a list of challenges", () => {
        cy.visit("/");
        cy.contains("A valid HTML document");
        cy.contains("Headings");
        cy.contains("Content Elements");
    })
})