import { renderHook, act } from '@testing-library/react';

import { usePopUp } from '@/hooks/usePopup';

describe('usePopUp', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns initial state with isOpen false', () => {
    const { result } = renderHook(() => usePopUp());
    expect(result.current.isOpen).toBe(false);
  });

  it('showToast sets isOpen to true', () => {
    const { result } = renderHook(() => usePopUp());
    act(() => {
      result.current.showToast();
    });
    expect(result.current.isOpen).toBe(true);
  });

  it('toggle sets isOpen to true when false', () => {
    const { result } = renderHook(() => usePopUp());
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(true);
  });

  it('toggle sets isOpen to false when true', () => {
    const { result } = renderHook(() => usePopUp());
    act(() => {
      result.current.showToast();
    });
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('auto-closes after 3 seconds', () => {
    const { result } = renderHook(() => usePopUp());
    act(() => {
      result.current.showToast();
    });
    expect(result.current.isOpen).toBe(true);
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('clears timeout on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    const { unmount } = renderHook(() => usePopUp());
    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
});
