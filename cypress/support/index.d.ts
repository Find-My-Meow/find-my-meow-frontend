declare namespace Cypress {
    interface Chainable {
      mockLogin(): Chainable<void>;
    }
  }