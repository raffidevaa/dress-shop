import React from 'react';
import { render, screen, fireEvent } from '@/test/test-utils';
import SearchFilter from '@/components/search/SearchFilter';

describe('<SearchFilter />', () => {
  test('renders and handles selection', () => {
    const handleChange = jest.fn();
    render(<SearchFilter handleChange={handleChange} active="price" />);

    expect(screen.getByText(/Price: Low to High/i)).toBeInTheDocument();

    const toggleButton = screen.getByRole('button', { name: /Price: Low to High/i });
    fireEvent.click(toggleButton);

    const highToLowButton = screen.getByText(/High to Low/i);
    fireEvent.click(highToLowButton);

    expect(handleChange).toHaveBeenCalledWith('-price');
  });

  test('opens and closes dropdown', () => {
    render(<SearchFilter handleChange={jest.fn()} active="" />);
    
    const toggleButton = screen.getByRole('button', { name: /Price/i });
    fireEvent.click(toggleButton);
    expect(screen.getByText(/Low to High/i)).toBeInTheDocument();
    
    fireEvent.click(toggleButton);
    expect(screen.queryByText(/Low to High/i)).not.toBeInTheDocument();
  });
});
