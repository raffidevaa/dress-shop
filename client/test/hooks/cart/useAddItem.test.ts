import { renderHook, act } from '@testing-library/react';
import { mutate } from 'swr';

import useAddItem from '@/hooks/cart/useAddItem';
import CartService from '@/services/CartService';

jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(),
  mutate: jest.fn(),
}));

jest.mock('@/services/CartService', () => ({
  __esModule: true,
  default: {
    addCartItem: jest.fn(),
  },
}));

const mockMutate = mutate as jest.Mock;
const mockAddCartItem = CartService.addCartItem as jest.Mock;

describe('useAddItem (cart)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns initial state', () => {
    const { result } = renderHook(() => useAddItem());
    expect(result.current.addingToCart).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.addToCart).toBe('function');
  });

  it('calls service, mutates cache, and resets state on success', async () => {
    mockAddCartItem.mockResolvedValueOnce({});
    const { result } = renderHook(() => useAddItem());

    await act(async () => {
      await result.current.addToCart('prod_1', 2);
    });

    expect(mockAddCartItem).toHaveBeenCalledWith('prod_1', 2);
    expect(mockMutate).toHaveBeenCalledWith('/api/cart');
    expect(result.current.addingToCart).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('sets error on failure', async () => {
    mockAddCartItem.mockRejectedValueOnce({ message: 'Network Error' });
    const { result } = renderHook(() => useAddItem());

    await act(async () => {
      await result.current.addToCart('prod_1', 2);
    });

    expect(result.current.addingToCart).toBe(false);
    expect(result.current.error).toBe('Network Error');
  });
});
