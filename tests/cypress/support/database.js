export function resetDatabase() {
    if (process.env.CI_PROJECT_ID) {
        cy.exec('npm run db:reset:ci');
    } else {
        cy.exec('npm run db:reset');
    }
}

export function createDatabaseDump() {
    if (process.env.CI_PROJECT_ID) {
        cy.exec('npm run db-dump:update:ci');
    } else {
        cy.exec('npm run db-dump:update');
    }
}

export function importDatabaseDump() {
    if (process.env.CI_PROJECT_ID) {
        cy.exec('npm run db-dump:import:ci');
    } else {
        cy.exec('npm run db-dump:import');
    }
}