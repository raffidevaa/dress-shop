import { userGenerator } from '../../test/data-generators';

describe('Critical User Journey', () => {
  const user = userGenerator();
  let productUrl: string;

  it('should allow user to sign up', () => {
    cy.visit('/');
    cy.findByRole('link', { name: /sign up/i }).click();
    cy.findByRole('textbox', { name: /name/i }).type(user.name);
    cy.findByRole('textbox', { name: /email/i }).type(user.email);
    cy.findByLabelText(/password/i).type(user.password);
    cy.findByRole('button', { name: /sign up/i }).click();
    cy.url().should('include', '/profile');
    cy.findByRole('textbox', { name: /name/i }).should('have.value', user.name);
  });

  it('should allow user to view products', () => {
    cy.visit('/');
    cy.findByRole('textbox', { name: /search product/i }).type('blue jeans{enter}');
    cy.wait(2000);

    cy.findByText(/blue jeans/i).click();
    cy.wait(2000);

    cy.url().then((url) => { productUrl = url; });
  });

  it('should allow user to add a product to wishlist', () => {
    cy.get('[class*="productInfo"] [class*="wishlistButtonContainer"] button')
      .click()
      .should('not.be.disabled');

    cy.visit('/wishlist');
    cy.wait(2000);

    cy.get('[class*="wishlistItemContainer"]').should('have.length.at.least', 1);
  });

  it('should allow user to remove a product from wishlist', () => {
    cy.findByText(/remove/i).first().click();
    cy.wait(2000);

    cy.findByText(/wishlist is empty/i).should('exist');
  });

  it('should should allow user to add product to cart', () => {
    cy.visit(productUrl);
    cy.wait(2000);

    cy.findByRole('button', { name: /add to cart/i }).click();
    cy.findByText('Successfully added to cart').should('exist');

    cy.findByRole('link', { name: /cart/i }).click();
    cy.wait(2000);

    cy.findByRole('listbox').within(() => {
      cy.findAllByRole('listitem').should('have.length.at.least', 1);
    });
  });

  it('should allow user to checkout', () => {
    cy.findByRole('button', { name: /check out/i }).click();
    cy.url().should('include', '/checkout');
    cy.wait(2000);

    cy.getStripeElement('cardNumber').type('4242424242424242');
    cy.getStripeElement('cardExpiry').type('1230');
    cy.getStripeElement('cardCvc').type('123');
    cy.getStripeElement('postalCode').type('12345');

    cy.findByRole('button', { name: 'Confirm Order' }).click();
    cy.wait(8000);

    cy.url().should('include', '/orders');
  });

  it('should show the order in order history', () => {
    cy.visit('/orders');
    cy.wait(2000);

    cy.get('main').findByRole('list').within(() => {
      cy.findAllByRole('listitem').should('have.length.at.least', 1);
    });
  });

  it('should allow user to log out', () => {
    cy.visit('/profile');
    cy.findByRole('button', { name: user.name.charAt(0).toUpperCase() }).click();
    cy.findByRole('button', { name: /log out/i }).click();
    cy.url().should('include', '/login');
  });

  it('should allow user to log in', () => {
    cy.visit('/login');
    cy.findByRole('textbox', { name: /email/i }).type(user.email);
    cy.findByLabelText(/password/i).type(user.password);

    cy.findByRole('button', { name: /log in/i }).click();
    cy.wait(2000);

    cy.url().should('include', '/profile');
    cy.findByRole('textbox', { name: /name/i }).should('have.value', user.name);
  });
});