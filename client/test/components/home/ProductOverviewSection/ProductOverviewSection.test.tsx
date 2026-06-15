jest.mock('@/hooks/useProducts', () => jest.fn());

import React from 'react';

import ProductOverview from '@/components/home/ProductOverviewSection';
import useProducts from '@/hooks/useProducts';
import { productGenerator } from '@/test/data-generators';
import { fireEvent, render, screen } from '@/test/test-utils';

const mockUseProducts = useProducts as jest.Mock;

describe('<ProductOverviewSection />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows spinner while loading more', () => {
    mockUseProducts.mockReturnValue({
      products: [],
      loadMore: jest.fn(),
      isLoadingMore: true,
      isReachingEnd: false,
    });
    render(<ProductOverview initialProducts={[]} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows Load More button when not loading and not at end', () => {
    mockUseProducts.mockReturnValue({
      products: [productGenerator()],
      loadMore: jest.fn(),
      isLoadingMore: false,
      isReachingEnd: false,
    });
    render(<ProductOverview initialProducts={[]} />);
    expect(screen.getByRole('button', { name: /load more/i })).toBeInTheDocument();
  });

  it('calls loadMore when Load More button is clicked', () => {
    const mockLoadMore = jest.fn();
    mockUseProducts.mockReturnValue({
      products: [productGenerator()],
      loadMore: mockLoadMore,
      isLoadingMore: false,
      isReachingEnd: false,
    });
    render(<ProductOverview initialProducts={[]} />);
    fireEvent.click(screen.getByRole('button', { name: /load more/i }));
    expect(mockLoadMore).toHaveBeenCalledTimes(1);
  });

  it('shows end message when reaching end of results', () => {
    mockUseProducts.mockReturnValue({
      products: [productGenerator()],
      loadMore: jest.fn(),
      isLoadingMore: false,
      isReachingEnd: true,
    });
    render(<ProductOverview initialProducts={[]} />);
    expect(screen.getByText(/no more products/i)).toBeInTheDocument();
  });
});
