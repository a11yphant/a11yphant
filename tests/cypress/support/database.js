export function resetDatabase() {
    cy.exec('npm run db:reset');
}

export function createDatabaseDump() {
    cy.exec('npm run db-dump:update');
}

export function importDatabaseDump() {
    cy.exec('npm run db-dump:import');
}