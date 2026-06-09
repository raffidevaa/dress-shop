import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import SearchBar from '@/components/core/SearchBar';

describe('<SearchBar />', () => {
  it('renders input and submit button', () => {
    render(<SearchBar onSubmit={jest.fn()} />);
    expect(screen.getByPlaceholderText('Search Product...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('does not call onSubmit when input is empty', () => {
    const onSubmit = jest.fn();
    render(<SearchBar onSubmit={onSubmit} />);
    fireEvent.submit(screen.getByRole('search'));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('does not call onSubmit when input is only whitespace', () => {
    const onSubmit = jest.fn();
    render(<SearchBar onSubmit={onSubmit} />);
    fireEvent.change(screen.getByPlaceholderText('Search Product...'), {
      target: { value: '   ' },
    });
    fireEvent.submit(screen.getByRole('search'));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with the search text on valid submit', () => {
    const onSubmit = jest.fn();
    render(<SearchBar onSubmit={onSubmit} />);
    fireEvent.change(screen.getByPlaceholderText('Search Product...'), {
      target: { value: 'dress' },
    });
    fireEvent.submit(screen.getByRole('search'));
    expect(onSubmit).toHaveBeenCalledWith('dress');
  });

  it('focuses input when isFocus is true', () => {
    render(<SearchBar onSubmit={jest.fn()} isFocus={true} />);
    expect(screen.getByPlaceholderText('Search Product...')).toHaveFocus();
  });

  it('does not focus input when isFocus is false', () => {
    render(<SearchBar onSubmit={jest.fn()} isFocus={false} />);
    expect(screen.getByPlaceholderText('Search Product...')).not.toHaveFocus();
  });
});
