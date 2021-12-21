import './commands'
import { createDatabaseDump, importDatabaseDump, resetDatabase } from "./database"

const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
Cypress.on('uncaught:exception', (err) => {
    if (resizeObserverLoopErrRe.test(err.message)) {
        return false
    }
})

beforeEach(() => {
    resetDatabase();
    importDatabaseDump();
});
