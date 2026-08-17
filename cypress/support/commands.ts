/// <reference types="cypress" />

// ***********************************************
// Custom commands for Cypress
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to check if element is in viewport
       * @example cy.get('#element').isInViewport()
       */
      isInViewport(): Chainable<boolean>;

      /**
       * Custom command to check accessibility violations
       * @example cy.checkA11y()
       */
      checkA11y(): Chainable<void>;

      /**
       * Custom command to fill contact form
       * @example cy.fillContactForm('John', 'john@example.com', 'Hello')
       */
      fillContactForm(name: string, email: string, message: string): Chainable<void>;

      /**
       * Custom command to wait for API call
       * @example cy.waitForAPI('/api/github/repos')
       */
      waitForAPI(url: string): Chainable<void>;
    }
  }
}

// Check if element is in viewport
Cypress.Commands.add('isInViewport', { prevSubject: true }, (subject) => {
  const rect = subject[0].getBoundingClientRect();
  const isInViewport = 
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= Cypress.config('viewportHeight') &&
    rect.right <= Cypress.config('viewportWidth');
  
  expect(isInViewport).to.be.true;
  return cy.wrap(subject);
});

// Fill contact form helper
Cypress.Commands.add('fillContactForm', (name: string, email: string, message: string) => {
  cy.get('input[name="name"]').clear().type(name);
  cy.get('input[name="email"]').clear().type(email);
  cy.get('textarea[name="message"]').clear().type(message);
});

// Wait for API call
Cypress.Commands.add('waitForAPI', (url: string) => {
  cy.intercept(url).as('apiCall');
  cy.wait('@apiCall');
});

// Tab key navigation helper
Cypress.Commands.add('tab', { prevSubject: 'optional' }, (subject) => {
  cy.wrap(subject).trigger('keydown', { keyCode: 9, which: 9 });
  return cy.focused();
});

export {};
