import { renderHook, act } from '@testing-library/react';
import React from 'react';

import { ToastProvider, useToast } from '@/contexts/toast/ToastContext';
import { render, screen } from '@/test/test-utils';

describe('ToastContext', () => {
  it('useToast throws when used outside ToastProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useToast())).toThrow(
      'useToast must be used within ToastProvider'
    );
    consoleError.mockRestore();
  });

  it('setToast updates context with message and type', () => {
    const TestComponent = () => {
      const { setToast, message, type, isActive } = useToast();
      return (
        <div>
          <button onClick={() => setToast('success', 'Item added')}>Set Toast</button>
          <span data-testid="message">{message}</span>
          <span data-testid="type">{type}</span>
          <span data-testid="active">{String(isActive)}</span>
        </div>
      );
    };

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    expect(screen.getByTestId('active')).toHaveTextContent('false');
    act(() => {
      screen.getByRole('button', { name: /Set Toast/i }).click();
    });
    expect(screen.getByTestId('message')).toHaveTextContent('Item added');
    expect(screen.getByTestId('type')).toHaveTextContent('success');
    expect(screen.getByTestId('active')).toHaveTextContent('true');
  });

  it('removeToast sets isActive to false', () => {
    const TestComponent = () => {
      const { setToast, removeToast, isActive } = useToast();
      return (
        <div>
          <button data-testid="set" onClick={() => setToast('error', 'Oops')}>
            Set
          </button>
          <button data-testid="remove" onClick={removeToast}>
            Remove
          </button>
          <span data-testid="active">{String(isActive)}</span>
        </div>
      );
    };

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    act(() => {
      screen.getByTestId('set').click();
    });
    expect(screen.getByTestId('active')).toHaveTextContent('true');
    act(() => {
      screen.getByTestId('remove').click();
    });
    expect(screen.getByTestId('active')).toHaveTextContent('false');
  });
});
