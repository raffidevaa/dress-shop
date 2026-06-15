import React from 'react';

import Spinner from '@/components/ui/Spinner';
import { render, screen } from '@/test/test-utils';

describe('<Spinner />', () => {
  test('renders with default size and color', () => {
    render(<Spinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveStyle({ width: '30px', height: '30px' });
  });

  test('renders with custom size', () => {
    render(<Spinner size={50} />);
    expect(screen.getByRole('status')).toHaveStyle({ width: '50px', height: '50px' });
  });

  test('renders with custom color', () => {
    render(<Spinner color="#ff0000" />);
    expect(screen.getByRole('status')).toHaveStyle({ borderLeftColor: '#ff0000' });
  });
});
