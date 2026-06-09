import React from 'react';

import ProductListSkeleton from '@/components/product/ProductListSkeleton';
import { render, screen } from '@/test/test-utils';

describe('<ProductListSkeleton />', () => {
  test('renders the skeleton container with aria-label', () => {
    render(<ProductListSkeleton number={3} />);
    expect(screen.getByLabelText('Product list skeleton')).toBeInTheDocument();
  });

  test('renders correct number of skeleton items', () => {
    render(<ProductListSkeleton number={4} />);
    expect(screen.getAllByTestId('skeleton-item')).toHaveLength(4);
  });

  test('renders no items when number is 0', () => {
    render(<ProductListSkeleton number={0} />);
    expect(screen.queryByTestId('skeleton-item')).not.toBeInTheDocument();
  });
});
