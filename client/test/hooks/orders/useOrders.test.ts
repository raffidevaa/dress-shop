import { renderHook } from '@testing-library/react';
import useSWR from 'swr';

import useOrders from '@/hooks/orders/useOrders';
import useUser from '@/hooks/user/useUser';
import { userGenerator } from '@/test/data-generators';

jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(),
  mutate: jest.fn(),
}));

jest.mock('@/hooks/user/useUser');

const mockUseSWR = useSWR as jest.Mock;
const mockUseUser = useUser as jest.Mock;

describe('useOrders', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('passes null key to SWR when no user', () => {
    mockUseUser.mockReturnValue({ data: null });
    mockUseSWR.mockReturnValue({ data: undefined, error: undefined });

    const { result } = renderHook(() => useOrders());

    expect(mockUseSWR).toHaveBeenCalledWith(null, expect.any(Function));
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it('passes /api/orders key to SWR when user exists', () => {
    mockUseUser.mockReturnValue({ data: userGenerator() });
    const fakeOrders = [{ _id: 'order_1' }];
    mockUseSWR.mockReturnValue({ data: fakeOrders, error: undefined });

    const { result } = renderHook(() => useOrders());

    expect(mockUseSWR).toHaveBeenCalledWith('/api/orders', expect.any(Function));
    expect(result.current.data).toEqual(fakeOrders);
    expect(result.current.isLoading).toBe(false);
  });

  it('returns error and isLoading false when SWR returns error', () => {
    mockUseUser.mockReturnValue({ data: userGenerator() });
    const fakeError = new Error('Fetch failed');
    mockUseSWR.mockReturnValue({ data: undefined, error: fakeError });

    const { result } = renderHook(() => useOrders());

    expect(result.current.error).toEqual(fakeError);
    expect(result.current.isLoading).toBe(false);
  });
});
