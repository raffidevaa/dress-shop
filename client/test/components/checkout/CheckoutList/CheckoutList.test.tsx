import React from 'react';
jest.mock('next/image', () => {
    const MockImage = (props: any) => {
        // eslint-disable-next-line @next/next/no-img-element
        return <img alt="" {...props} />;
    };
    MockImage.displayName = 'MockImage';
    return MockImage;
});

import { render, screen } from '@/test/test-utils';
import CheckoutList from '@/components/checkout/CheckoutList';

const items = [
    {
        _id: '1',
        quantity: 2,
        product: { _id: 'p1', imageURL: '/img.png', name: 'Product A', price: 50 },
    },
];

describe('<CheckoutList />', () => {
    test('renders item info', () => {
        render(<CheckoutList items={items as any} />);
        expect(screen.getByText('Product A')).toBeInTheDocument();
        expect(screen.getByText(/x 2/)).toBeInTheDocument();
    });
});
