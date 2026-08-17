// ***********************************************************
// This file is processed and loaded automatically before your test files.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR logs to reduce noise in command log
const app = window.top;

if (app && !app.document.head.querySelector('[data-hide-command-log-request]')) {
  const style = app.document.createElement('style');
  style.innerHTML =
    '.command-name-request, .command-name-xhr { display: none }';
  style.setAttribute('data-hide-command-log-request', '');
  app.document.head.appendChild(style);
}

// Example: Preserve cookies between tests
Cypress.Cookies.debug(true);

// Fail the test on uncaught exceptions (you can customize this)
Cypress.on('uncaught:exception', (err) => {
  // returning false here prevents Cypress from failing the test
  // You can add specific error messages to ignore
  if (err.message.includes('ResizeObserver')) {
    return false;
  }
  return true;
});
