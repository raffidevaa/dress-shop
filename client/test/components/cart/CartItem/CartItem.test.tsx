import React from 'react';

import CartItem from '@/components/cart/CartItem';
import { cartItemGenerator } from '@/test/data-generators';
import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import formatPrice from '@/utils/formatPrice';

const mockRemoveFromCart = jest.fn();
const mockUpdateFromCart = jest.fn();

jest.mock('@/hooks/cart/useRemoveItem', () => () => ({
  removeFromCart: mockRemoveFromCart,
}));

jest.mock('@/hooks/cart/useUpdateItem', () => () => ({
  updateFromCart: mockUpdateFromCart,
}));

describe('<CartItem />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders cart item information correctly', () => {
    const fakeCartItem = cartItemGenerator({ quantity: 2 }, { price: 500 });

    render(<CartItem cartItem={fakeCartItem} />);

    const productName = screen.getByText(fakeCartItem.product.name);
    const productPrice = screen.getByText(formatPrice(fakeCartItem.product.price));
    const productImage = screen.getByAltText(fakeCartItem.product.name);
    const cartTotal = screen.getByLabelText('Product price total');

    expect(productName).toBeInTheDocument();
    expect(productPrice).toBeInTheDocument();
    expect(productImage).toBeInTheDocument();
    expect(cartTotal).toHaveTextContent('P1,000');
  });

  test('calls removeFromCart when delete button is clicked', async () => {
    const fakeCartItem = cartItemGenerator();
    mockRemoveFromCart.mockResolvedValueOnce({});

    render(<CartItem cartItem={fakeCartItem} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(mockRemoveFromCart).toHaveBeenCalledWith(fakeCartItem.product._id);
  });

  test('calls updateFromCart when quantity is increased', async () => {
    const fakeCartItem = cartItemGenerator({ quantity: 1 });
    mockUpdateFromCart.mockResolvedValueOnce({});

    render(<CartItem cartItem={fakeCartItem} />);

    // In InputQuantity, first button is minus, second is plus
    const buttons = screen.getAllByRole('button');
    const increaseButton = buttons[2]; // 0 is close in alert, 1 is minus, 2 is plus
    fireEvent.click(increaseButton);

    expect(mockUpdateFromCart).toHaveBeenCalledWith(fakeCartItem.product._id, 2);
  });

  test('calls updateFromCart when quantity is decreased', async () => {
    const fakeCartItem = cartItemGenerator({ quantity: 2 });
    mockUpdateFromCart.mockResolvedValueOnce({});

    render(<CartItem cartItem={fakeCartItem} />);

    const buttons = screen.getAllByRole('button');
    const decreaseButton = buttons[1]; // 1 is minus
    fireEvent.click(decreaseButton);

    expect(mockUpdateFromCart).toHaveBeenCalledWith(fakeCartItem.product._id, 1);
  });

  test('handles quantity input change and blur', async () => {
    const fakeCartItem = cartItemGenerator({ quantity: 1 });
    mockUpdateFromCart.mockResolvedValueOnce({});

    render(<CartItem cartItem={fakeCartItem} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '5' } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(mockUpdateFromCart).toHaveBeenCalledWith(fakeCartItem.product._id, 5);
    });
  });

  test('shows error toast when quantity exceeds 10', async () => {
    const fakeCartItem = cartItemGenerator({ quantity: 10 });
    render(<CartItem cartItem={fakeCartItem} />);

    const buttons = screen.getAllByRole('button');
    const increaseButton = buttons[2];
    fireEvent.click(increaseButton);

    expect(mockUpdateFromCart).not.toHaveBeenCalled();
  });

  test('handles errors in handleRemoveCart', async () => {
    const fakeCartItem = cartItemGenerator();
    mockRemoveFromCart.mockRejectedValueOnce(new Error('Remove failed'));

    render(<CartItem cartItem={fakeCartItem} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockRemoveFromCart).toHaveBeenCalled();
    });
  });

  test('handles errors in updateQtyAsync', async () => {
    const fakeCartItem = cartItemGenerator({ quantity: 1 });
    mockUpdateFromCart.mockRejectedValueOnce(new Error('Update failed'));

    render(<CartItem cartItem={fakeCartItem} />);

    const buttons = screen.getAllByRole('button');
    const increaseButton = buttons[2];
    fireEvent.click(increaseButton);

    await waitFor(() => {
      expect(mockUpdateFromCart).toHaveBeenCalled();
    });
  });

  test('handles input change to > 10', () => {
    const fakeCartItem = cartItemGenerator({ quantity: 1 });
    render(<CartItem cartItem={fakeCartItem} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '11' } });
    expect(input).toHaveValue('10');
  });

  test('handles empty value on blur', async () => {
    const fakeCartItem = cartItemGenerator({ quantity: 5 });
    mockUpdateFromCart.mockResolvedValueOnce({});
    render(<CartItem cartItem={fakeCartItem} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(mockUpdateFromCart).toHaveBeenCalledWith(fakeCartItem.product._id, 5);
    });
  });
});
