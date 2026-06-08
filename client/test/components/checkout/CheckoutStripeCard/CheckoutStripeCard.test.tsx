import React from 'react';
jest.mock('@stripe/react-stripe-js', () => ({
    CardElement: (_props: any) => <div data-testid="card-element" />,
}));

import { render, screen } from '@/test/test-utils';
import CheckoutStripeCard from '@/components/checkout/CheckoutStripeCard';

describe('<CheckoutStripeCard />', () => {
    test('renders CardElement', () => {
        render(<CheckoutStripeCard onChange={async () => { }} /> as any);
        expect(screen.getByTestId('card-element')).toBeInTheDocument();
    });
});
