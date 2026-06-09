import { renderHook } from '@testing-library/react';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import useSearch from '@/hooks/useSearch';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(),
  mutate: jest.fn(),
}));

const mockUseRouter = useRouter as jest.Mock;
const mockUseSWR = useSWR as jest.Mock;

describe('useSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('passes null key to SWR when router is not ready', () => {
    mockUseRouter.mockReturnValue({ isReady: false });
    mockUseSWR.mockReturnValue({ data: undefined, error: undefined });

    const { result } = renderHook(() => useSearch({}));

    expect(mockUseSWR).toHaveBeenCalledWith(null, expect.any(Function));
    expect(result.current.isLoading).toBe(true);
  });

  it('passes key with empty params when router is ready and no params given', () => {
    mockUseRouter.mockReturnValue({ isReady: true });
    mockUseSWR.mockReturnValue({ data: [], error: undefined });

    renderHook(() => useSearch({}));

    expect(mockUseSWR).toHaveBeenCalledWith(
      ['/api/search', JSON.stringify({})],
      expect.any(Function)
    );
  });

  it('includes category param in key', () => {
    mockUseRouter.mockReturnValue({ isReady: true });
    mockUseSWR.mockReturnValue({ data: [], error: undefined });

    renderHook(() => useSearch({ category: 'tops' }));

    expect(mockUseSWR).toHaveBeenCalledWith(
      ['/api/search', JSON.stringify({ category: 'tops' })],
      expect.any(Function)
    );
  });

  it('includes sort and keyword params in key', () => {
    mockUseRouter.mockReturnValue({ isReady: true });
    mockUseSWR.mockReturnValue({ data: [], error: undefined });

    renderHook(() => useSearch({ sort: 'price', keyword: 'shirt' }));

    expect(mockUseSWR).toHaveBeenCalledWith(
      ['/api/search', JSON.stringify({ sort: 'price', keyword: 'shirt' })],
      expect.any(Function)
    );
  });

  it('includes all params in key', () => {
    mockUseRouter.mockReturnValue({ isReady: true });
    mockUseSWR.mockReturnValue({ data: [], error: undefined });

    renderHook(() => useSearch({ category: 'tops', sort: 'price', keyword: 'shirt' }));

    expect(mockUseSWR).toHaveBeenCalledWith(
      ['/api/search', JSON.stringify({ category: 'tops', sort: 'price', keyword: 'shirt' })],
      expect.any(Function)
    );
  });

  it('returns data and isLoading false when data exists', () => {
    mockUseRouter.mockReturnValue({ isReady: true });
    const fakeData = [{ _id: 'p1', name: 'Dress' }];
    mockUseSWR.mockReturnValue({ data: fakeData, error: undefined });

    const { result } = renderHook(() => useSearch({ keyword: 'dress' }));

    expect(result.current.data).toEqual(fakeData);
    expect(result.current.isLoading).toBe(false);
  });

  it('returns error and isLoading false when SWR returns error', () => {
    mockUseRouter.mockReturnValue({ isReady: true });
    const fakeError = new Error('Search failed');
    mockUseSWR.mockReturnValue({ data: undefined, error: fakeError });

    const { result } = renderHook(() => useSearch({}));

    expect(result.current.error).toEqual(fakeError);
    expect(result.current.isLoading).toBe(false);
  });
});
