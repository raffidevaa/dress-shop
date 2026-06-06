declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Get a Stripe Element by its stable field name.
       * @example cy.getStripeElement('cardNumber')
       */
      getStripeElement(fieldName: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

export {};
