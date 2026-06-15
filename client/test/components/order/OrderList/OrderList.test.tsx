jest.mock('@/hooks/orders/useOrders', () => jest.fn());

import React from 'react';

import OrderList from '@/components/order/OrderList';
import useOrders from '@/hooks/orders/useOrders';
import { render, screen } from '@/test/test-utils';

const mockUseOrders = useOrders as jest.Mock;

const fakeOrders = [
  {
    _id: 'order_1',
    createdAt: new Date().toISOString(),
    total: 15000,
    items: [
      {
        product: { _id: 'prod_1', name: 'Test Dress', imageURL: '/test.jpg', price: 15000 },
        quantity: 1,
      },
    ],
  },
];

describe('<OrderList />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows spinner while loading', () => {
    mockUseOrders.mockReturnValue({ data: undefined, isLoading: true, error: null });
    render(<OrderList />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows error message on failure', () => {
    mockUseOrders.mockReturnValue({ data: undefined, isLoading: false, error: 'Failed to load' });
    render(<OrderList />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('shows empty state message when no orders', () => {
    mockUseOrders.mockReturnValue({ data: [], isLoading: false, error: null });
    render(<OrderList />);
    expect(screen.getByText(/no orders yet/i)).toBeInTheDocument();
  });

  it('renders order items when orders exist', () => {
    mockUseOrders.mockReturnValue({ data: fakeOrders, isLoading: false, error: null });
    render(<OrderList />);
    expect(screen.getByAltText('Test Dress')).toBeInTheDocument();
    expect(screen.getByText('Test Dress')).toBeInTheDocument();
  });
});
