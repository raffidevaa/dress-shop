import React from 'react';

import WishlistItem from '@/components/wishlist/WishlistItems/WishlistItem';
import { productGenerator } from '@/test/data-generators';
import { render, screen, fireEvent, waitFor } from '@/test/test-utils';

const mockRemoveToWishlist = jest.fn();
jest.mock('@/hooks/wishlist/useRemoveItem', () => () => ({
  removeToWishlist: mockRemoveToWishlist,
}));

jest.mock('next/image', () => {
  const MockImage = (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt="" {...props} />;
  };
  MockImage.displayName = 'MockImage';
  return MockImage;
});

describe('<WishlistItem />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders item information correctly', () => {
    const product = productGenerator({ name: 'Fav Product', price: 100 });
    const wishlistItem = { _id: '1', product };

    render(<WishlistItem wishlistItem={wishlistItem} />);

    expect(screen.getByText('Fav Product')).toBeInTheDocument();
    expect(screen.getByText('P100')).toBeInTheDocument();
  });

  test('calls removeToWishlist when remove button is clicked', async () => {
    const product = productGenerator({ _id: 'p1' });
    const wishlistItem = { _id: '1', product };
    mockRemoveToWishlist.mockResolvedValueOnce({});

    render(<WishlistItem wishlistItem={wishlistItem} />);

    const removeButton = screen.getByRole('button', { name: /remove/i });
    fireEvent.click(removeButton);

    expect(mockRemoveToWishlist).toHaveBeenCalledWith('p1');
  });

  test('handles error during removal', async () => {
    const product = productGenerator({ _id: 'p1' });
    const wishlistItem = { _id: '1', product };
    mockRemoveToWishlist.mockRejectedValueOnce(new Error('Fail'));

    render(<WishlistItem wishlistItem={wishlistItem} />);

    const removeButton = screen.getByRole('button', { name: /remove/i });
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(mockRemoveToWishlist).toHaveBeenCalled();
    });
  });
});
