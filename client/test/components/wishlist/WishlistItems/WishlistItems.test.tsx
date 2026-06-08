import React from 'react';

import WishlistItems from '@/components/wishlist/WishlistItems';
import { productGenerator } from '@/test/data-generators';
import { render, screen } from '@/test/test-utils';

const mockUseWishlist = jest.fn();
jest.mock('@/hooks/wishlist/useWishlist', () => () => mockUseWishlist());

jest.mock('next/image', () => {
  const MockImage = (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt="" {...props} />;
  };
  MockImage.displayName = 'MockImage';
  return MockImage;
});

describe('<WishlistItems />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading spinner when loading', () => {
    mockUseWishlist.mockReturnValue({ data: null, isLoading: true });
    render(<WishlistItems />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('renders empty message when wishlist is empty', () => {
    mockUseWishlist.mockReturnValue({ data: [], isLoading: false });
    render(<WishlistItems />);
    expect(screen.getByText(/Wishlist is empty/i)).toBeInTheDocument();
  });

  test('renders list of wishlist items', () => {
    const mockData = [
      { _id: '1', product: productGenerator({ name: 'Product 1' }) },
      { _id: '2', product: productGenerator({ name: 'Product 2' }) },
    ];
    mockUseWishlist.mockReturnValue({ data: mockData, isLoading: false });

    render(<WishlistItems />);

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });
});
