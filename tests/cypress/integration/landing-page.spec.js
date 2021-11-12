describe("landing page", () => {
    it("contains a list of challenges", () => {
        cy.visit("http://localhost:3001/");
        cy.contains("A valid HTML document");
        cy.contains("Section Heading Elements");
        cy.contains("Content Elements");
    })
})