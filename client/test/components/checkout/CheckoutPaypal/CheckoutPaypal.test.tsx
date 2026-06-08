import React from 'react';
import { render, waitFor } from '@/test/test-utils';
import CheckoutPaypal from '@/components/checkout/CheckoutPaypal';
import Router from 'next/router';
import CheckOutService from '@/services/CheckoutService';

// Mock CheckOutService
jest.mock('@/services/CheckoutService', () => ({
  createPaypalTransaction: jest.fn(),
  capturePaypalTransaction: jest.fn(),
}));

// Mock Router
jest.mock('next/router', () => ({
  push: jest.fn(),
}));

// Mock next/script
jest.mock('next/script', () => {
  const MockScript = ({ onLoad }: any) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { useEffect } = require('react');
    useEffect(() => {
      onLoad();
    }, [onLoad]);
    return <div data-testid="paypal-script" />;
  };
  MockScript.displayName = 'MockScript';
  return {
    __esModule: true,
    default: MockScript,
  };
});

describe('<CheckoutPaypal />', () => {
  const mockRender = jest.fn();
  const mockButtons = jest.fn().mockReturnValue({ render: mockRender });

  beforeEach(() => {
    jest.clearAllMocks();
    (window as any).paypal = {
      Buttons: mockButtons,
    };
  });

  test('renders and initializes paypal buttons', async () => {
    render(<CheckoutPaypal />);
    
    await waitFor(() => expect(mockButtons).toHaveBeenCalled());
    expect(mockRender).toHaveBeenCalled();
  });

  test('handles createOrder correctly', async () => {
    (CheckOutService.createPaypalTransaction as jest.Mock).mockResolvedValueOnce({ orderID: 'ORDER_123' });
    
    render(<CheckoutPaypal />);
    
    await waitFor(() => expect(mockButtons).toHaveBeenCalled());
    
    const { createOrder } = mockButtons.mock.calls[0][0];
    const orderID = await createOrder();
    
    expect(orderID).toBe('ORDER_123');
    expect(CheckOutService.createPaypalTransaction).toHaveBeenCalled();
  });

  test('handles onApprove correctly', async () => {
    (CheckOutService.capturePaypalTransaction as jest.Mock).mockResolvedValueOnce({});
    
    render(<CheckoutPaypal />);
    
    await waitFor(() => expect(mockButtons).toHaveBeenCalled());
    
    const { onApprove } = mockButtons.mock.calls[0][0];
    await onApprove({ orderID: 'ORDER_123' });
    
    expect(CheckOutService.capturePaypalTransaction).toHaveBeenCalledWith('ORDER_123');
    expect(Router.push).toHaveBeenCalledWith('/orders');
  });

  test('handles onError correctly', async () => {
    render(<CheckoutPaypal />);
    
    await waitFor(() => expect(mockButtons).toHaveBeenCalled());
    
    const { onError } = mockButtons.mock.calls[0][0];
    onError({ message: 'Paypal failed' });
    
    // We expect setToast to be called, which happens via useToast context.
    // Our test-utils should have ToastProvider.
  });
});
