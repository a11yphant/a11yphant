function getInputByLabel(label, element = cy) {
    return element.contains('label', label).parent().find('input');
}

function loginContainer() {
    return cy.contains("h2", "Login").parent();
}

function createUser({ name, email, password }) {
    cy.request({
        method: "POST",
        url: "/graphql",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: `mutation register($name: String!, $email: String!, $password: String!) {
                register(registerUserInput: { displayName: $name, email: $email, password: $password }) {
                    ... on User {
                        id
                    }
                }
            }`,
            variables: { name, email, password },
        })
    });

    cy.clearCookies();
}

describe("login", () => {
    it("can login", () => {
        Cypress.Cookies.debug(true);
        createUser({
            name: "Login user",
            email: "login@a11yphant.com",
            password: "very-secret"
        });
        cy.visit("/");
        cy.contains("button", "Login").click();
        getInputByLabel('Email', loginContainer()).type("login@a11yphant.com");
        getInputByLabel('Password', loginContainer()).type("very-secret");
        loginContainer().contains('button', 'Log in').click();

        cy.contains("Welcome back!", { timeout: 6000 }).should("exist");
    });
});
