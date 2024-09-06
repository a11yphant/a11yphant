export function resetDatabase() {
    cy.exec('npm run cypress:db:reset');
}

export function createDatabaseDump() {
    cy.exec('npm run cypress:db-dump:update');
}

export function importDatabaseDump() {
    cy.exec('npm run cypress:db-dump:import');
}
