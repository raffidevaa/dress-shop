import React from 'react';

import CartSkeleton from '@/components/cart/CartSkeleton';
import { render, screen } from '@/test/test-utils';

describe('<CartSkeleton />', () => {
  test('renders without crashing', () => {
    render(<CartSkeleton />);
    expect(screen.getByLabelText('Cart loading')).toBeInTheDocument();
  });

  test('renders 3 skeleton items', () => {
    render(<CartSkeleton />);
    expect(screen.getAllByTestId('skeleton-item')).toHaveLength(3);
  });
});
