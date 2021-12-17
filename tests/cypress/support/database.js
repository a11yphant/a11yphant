export function resetDatabase() {
    if (Cypress.env('CI_PROJECT_ID')) {
        cy.exec('npm run db:reset:ci');
    } else {
        cy.exec('npm run db:reset');
    }
}

export function createDatabaseDump() {
    if (Cypress.env('CI_PROJECT_ID')) {
        cy.exec('npm run db-dump:update:ci');
    } else {
        cy.exec('npm run db-dump:update');
    }
}

export function importDatabaseDump() {
    if (Cypress.env('CI_PROJECT_ID')) {
        cy.exec('npm run db-dump:import:ci');
    } else {
        cy.exec('npm run db-dump:import');
    }
}