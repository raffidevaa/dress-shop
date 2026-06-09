import { renderHook, act } from '@testing-library/react';
import { mutate } from 'swr';

import useAddOrder from '@/hooks/orders/useAddOrder';
import CheckoutService from '@/services/CheckoutService';

jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(),
  mutate: jest.fn(),
}));

jest.mock('@/services/CheckoutService', () => ({
  __esModule: true,
  default: {
    stripeCharge: jest.fn(),
  },
}));

const mockMutate = mutate as jest.Mock;
const mockStripeCharge = CheckoutService.stripeCharge as jest.Mock;

describe('useAddOrder', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns initial state', () => {
    const { result } = renderHook(() => useAddOrder());
    expect(result.current.addingOrder).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.addOrder).toBe('function');
  });

  it('calls service, mutates cache, and resets state on success', async () => {
    mockStripeCharge.mockResolvedValueOnce({});
    const { result } = renderHook(() => useAddOrder());

    await act(async () => {
      await result.current.addOrder('pm_test_123');
    });

    expect(mockStripeCharge).toHaveBeenCalledWith('pm_test_123');
    expect(mockMutate).toHaveBeenCalledWith('/api/orders');
    expect(result.current.addingOrder).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('sets error on failure', async () => {
    mockStripeCharge.mockRejectedValueOnce({ message: 'Payment failed' });
    const { result } = renderHook(() => useAddOrder());

    await act(async () => {
      await result.current.addOrder('pm_bad_card');
    });

    expect(result.current.addingOrder).toBe(false);
    expect(result.current.error).toBe('Payment failed');
  });
});
