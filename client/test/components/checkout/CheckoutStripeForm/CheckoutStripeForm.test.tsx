import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import CheckoutStripeForm from '@/components/checkout/CheckoutStripeForm';
import Router from 'next/router';
import { useStripe, useElements } from '@stripe/react-stripe-js';

// Mock Stripe
jest.mock('@stripe/react-stripe-js', () => ({
  useStripe: jest.fn(),
  useElements: jest.fn(),
  CardElement: ({ onChange }: any) => (
    <button 
      type="button"
      data-testid="card-element" 
      onClick={() => onChange({ empty: false, error: null })} 
    />
  ),
}));

// Mock Hooks
jest.mock('@/hooks/user/useUser', () => () => ({
  data: { name: 'Test User', email: 'test@example.com' },
}));

const mockAddOrder = jest.fn();
jest.mock('@/hooks/orders/useAddOrder', () => () => ({
  addOrder: mockAddOrder,
}));

// Mock Router
jest.mock('next/router', () => ({
  push: jest.fn(),
}));

describe('<CheckoutStripeForm />', () => {
  const mockCreatePaymentMethod = jest.fn();
  const mockGetElement = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useStripe as jest.Mock).mockReturnValue({
      createPaymentMethod: mockCreatePaymentMethod,
    });
    (useElements as jest.Mock).mockReturnValue({
      getElement: mockGetElement,
    });
  });

  test('handles successful submission', async () => {
    mockCreatePaymentMethod.mockResolvedValueOnce({
      paymentMethod: { id: 'pm_123' },
      error: null,
    });
    mockAddOrder.mockResolvedValueOnce({});
    mockGetElement.mockReturnValue({});

    render(<CheckoutStripeForm />);
    
    // Simulate card input to enable button
    fireEvent.click(screen.getByTestId('card-element'));
    
    const submitButton = screen.getByRole('button', { name: /confirm order/i });
    expect(submitButton).not.toBeDisabled();
    
    fireEvent.click(submitButton);
    
    await waitFor(() => expect(mockCreatePaymentMethod).toHaveBeenCalled());
    await waitFor(() => expect(mockAddOrder).toHaveBeenCalledWith('pm_123'));
    await waitFor(() => expect(Router.push).toHaveBeenCalledWith('/orders'));
  });

  test('handles stripe error', async () => {
    mockCreatePaymentMethod.mockResolvedValueOnce({
      paymentMethod: null,
      error: { message: 'Card declined' },
    });
    mockGetElement.mockReturnValue({});

    render(<CheckoutStripeForm />);
    
    fireEvent.click(screen.getByTestId('card-element'));
    fireEvent.click(screen.getByRole('button', { name: /confirm order/i }));
    
    await waitFor(() => expect(mockCreatePaymentMethod).toHaveBeenCalled());
    expect(mockAddOrder).not.toHaveBeenCalled();
  });

  test('handles server error during addOrder', async () => {
    mockCreatePaymentMethod.mockResolvedValueOnce({
      paymentMethod: { id: 'pm_123' },
      error: null,
    });
    mockAddOrder.mockRejectedValueOnce(new Error('Server failed'));
    mockGetElement.mockReturnValue({});

    render(<CheckoutStripeForm />);
    
    fireEvent.click(screen.getByTestId('card-element'));
    fireEvent.click(screen.getByRole('button', { name: /confirm order/i }));
    
    await waitFor(() => expect(mockAddOrder).toHaveBeenCalled());
    expect(Router.push).not.toHaveBeenCalled();
  });
});
