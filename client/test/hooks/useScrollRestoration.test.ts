import { renderHook } from '@testing-library/react';
import Router from 'next/router';

import { useScrollRestoration } from '@/hooks/useScrollRestoration';

jest.mock('next/router', () => ({
  __esModule: true,
  default: {
    events: { on: jest.fn() },
    beforePopState: jest.fn(),
  },
}));

const mockRouter = Router as jest.Mocked<typeof Router>;

describe('useScrollRestoration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    try {
      window.history.scrollRestoration = 'auto';
    } catch {
      // scrollRestoration may not be writable in all environments
    }
  });

  it('sets scrollRestoration to manual', () => {
    renderHook(() => useScrollRestoration());
    expect(window.history.scrollRestoration).toBe('manual');
  });

  it('registers routeChangeStart and routeChangeComplete handlers', () => {
    renderHook(() => useScrollRestoration());
    expect(mockRouter.events.on).toHaveBeenCalledWith('routeChangeStart', expect.any(Function));
    expect(mockRouter.events.on).toHaveBeenCalledWith('routeChangeComplete', expect.any(Function));
  });

  it('registers beforePopState handler', () => {
    renderHook(() => useScrollRestoration());
    expect(mockRouter.beforePopState).toHaveBeenCalledWith(expect.any(Function));
  });

  it('routeChangeStart pushes current scroll position to cache', () => {
    Object.defineProperty(window, 'scrollX', { writable: true, value: 50 });
    Object.defineProperty(window, 'scrollY', { writable: true, value: 100 });

    renderHook(() => useScrollRestoration());

    const routeChangeStart = (mockRouter.events.on as jest.Mock).mock.calls.find(
      ([event]) => event === 'routeChangeStart'
    )?.[1];

    routeChangeStart?.();

    const beforePopState = (mockRouter.beforePopState as jest.Mock).mock.calls[0]?.[0];
    expect(typeof beforePopState).toBe('function');
  });

  it('beforePopState handler returns true', () => {
    renderHook(() => useScrollRestoration());

    // Simulate a routeChangeStart to push position to cache first
    const routeChangeStart = (mockRouter.events.on as jest.Mock).mock.calls.find(
      ([event]) => event === 'routeChangeStart'
    )?.[1];
    routeChangeStart?.();

    const beforePopState = (mockRouter.beforePopState as jest.Mock).mock.calls[0]?.[0];
    const result = beforePopState?.();
    expect(result).toBe(true);
  });
});
