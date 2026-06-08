import React from 'react';
jest.mock('@stripe/react-stripe-js', () => ({
  CardElement: () => <div data-testid="card-element" />,
}));

import CheckoutStripeCard from '@/components/checkout/CheckoutStripeCard';
import { render, screen } from '@/test/test-utils';

describe('<CheckoutStripeCard />', () => {
  test('renders CardElement', () => {
    render((<CheckoutStripeCard onChange={async () => {}} />) as any);
    expect(screen.getByTestId('card-element')).toBeInTheDocument();
  });
});
