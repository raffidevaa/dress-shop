import React from 'react';

import ProductInputQuantity from '@/components/product/ProductInputQuantity';
import { render, screen, fireEvent } from '@/test/test-utils';

const defaultProps = {
  value: 1,
  onChangeInput: jest.fn(),
  onButtonClick: jest.fn(),
  onChangeBlur: jest.fn(),
};

describe('<ProductInputQuantity />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders current value in input', () => {
    render(<ProductInputQuantity {...defaultProps} value={5} />);
    expect(screen.getByRole('textbox')).toHaveValue('5');
  });

  test('calls onChangeInput when input value changes', () => {
    render(<ProductInputQuantity {...defaultProps} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '3' } });
    expect(defaultProps.onChangeInput).toHaveBeenCalledWith('3');
  });

  test('calls onChangeBlur when input loses focus', () => {
    render(<ProductInputQuantity {...defaultProps} />);
    fireEvent.blur(screen.getByRole('textbox'), { target: { value: '2' } });
    expect(defaultProps.onChangeBlur).toHaveBeenCalledWith('2');
  });

  test('prevents non-numeric key press', () => {
    render(<ProductInputQuantity {...defaultProps} />);
    const input = screen.getByRole('textbox');
    const event = fireEvent.keyPress(input, { key: 'a', charCode: 97, preventDefault: jest.fn() });
    expect(event).toBe(false);
  });

  test('allows numeric key press', () => {
    render(<ProductInputQuantity {...defaultProps} />);
    const input = screen.getByRole('textbox');
    const prevented = !fireEvent.keyPress(input, { key: '5', charCode: 53 });
    expect(prevented).toBe(false);
  });

  test('calls onButtonClick with "sub" when minus button is clicked', () => {
    render(<ProductInputQuantity {...defaultProps} />);
    const buttons = screen.getAllByRole('button');
    // buttons[0] is Toast close button from AppProviders; buttons[1] is minus, buttons[2] is plus
    fireEvent.click(buttons[1]);
    expect(defaultProps.onButtonClick).toHaveBeenCalledWith('sub');
  });

  test('calls onButtonClick with "add" when plus button is clicked', () => {
    render(<ProductInputQuantity {...defaultProps} />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[2]);
    expect(defaultProps.onButtonClick).toHaveBeenCalledWith('add');
  });

  test('disables buttons and input when isUpdating is true', () => {
    render(<ProductInputQuantity {...defaultProps} isUpdating />);
    const buttons = screen.getAllByRole('button');
    expect(buttons[1]).toBeDisabled();
    expect(buttons[2]).toBeDisabled();
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});
