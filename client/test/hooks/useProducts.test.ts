import { renderHook, act } from '@testing-library/react';
import { useSWRInfinite } from 'swr';

import useProducts from '@/hooks/useProducts';
import { productGenerator } from '@/test/data-generators';

jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(),
  useSWRInfinite: jest.fn(),
  mutate: jest.fn(),
}));

const mockUseSWRInfinite = useSWRInfinite as jest.Mock;

describe('useProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns empty products when data is undefined', () => {
    mockUseSWRInfinite.mockReturnValue({
      data: undefined,
      error: undefined,
      size: 1,
      setSize: jest.fn(),
      isValidating: false,
    });

    const { result } = renderHook(() => useProducts([productGenerator()]));

    expect(result.current.products).toEqual([]);
    expect(result.current.isLoadingMore).toBe(true);
  });

  it('returns concatenated products from all pages', () => {
    const page1 = [productGenerator(), productGenerator()];
    mockUseSWRInfinite.mockReturnValue({
      data: [page1],
      error: undefined,
      size: 1,
      setSize: jest.fn(),
      isValidating: false,
    });

    const { result } = renderHook(() => useProducts([]));

    expect(result.current.products).toEqual(page1);
    expect(result.current.isLoadingMore).toBe(false);
  });

  it('loadMore increments size by 1', () => {
    const mockSetSize = jest.fn();
    mockUseSWRInfinite.mockReturnValue({
      data: [[productGenerator()]],
      error: undefined,
      size: 2,
      setSize: mockSetSize,
      isValidating: false,
    });

    const { result } = renderHook(() => useProducts([]));
    act(() => {
      result.current.loadMore();
    });

    expect(mockSetSize).toHaveBeenCalledWith(3);
  });

  it('isReachingEnd is true when last page has fewer than 12 items', () => {
    const smallPage = [productGenerator(), productGenerator()];
    mockUseSWRInfinite.mockReturnValue({
      data: [smallPage],
      error: undefined,
      size: 1,
      setSize: jest.fn(),
      isValidating: false,
    });

    const { result } = renderHook(() => useProducts([]));
    expect(result.current.isReachingEnd).toBe(true);
  });

  it('isReachingEnd is false when last page is full (12 items)', () => {
    const fullPage = Array.from({ length: 12 }, () => productGenerator());
    mockUseSWRInfinite.mockReturnValue({
      data: [fullPage],
      error: undefined,
      size: 1,
      setSize: jest.fn(),
      isValidating: false,
    });

    const { result } = renderHook(() => useProducts([]));
    expect(result.current.isReachingEnd).toBe(false);
  });

  it('isEmpty is true when first page is empty', () => {
    mockUseSWRInfinite.mockReturnValue({
      data: [[]],
      error: undefined,
      size: 1,
      setSize: jest.fn(),
      isValidating: false,
    });

    const { result } = renderHook(() => useProducts([]));
    expect(result.current.isReachingEnd).toBe(true);
  });

  it('key generator produces correct URLs', () => {
    mockUseSWRInfinite.mockReturnValue({
      data: undefined,
      error: undefined,
      size: 0,
      setSize: jest.fn(),
      isValidating: false,
    });

    renderHook(() => useProducts([]));

    const [keyGen] = mockUseSWRInfinite.mock.calls[0];
    expect(keyGen(0)).toBe('/api/products?page=1');
    expect(keyGen(2)).toBe('/api/products?page=3');
  });
});
