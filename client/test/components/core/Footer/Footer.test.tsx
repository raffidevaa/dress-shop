import React from 'react';

import Footer from '@/components/core/Footer';
import { render, screen } from '@/test/test-utils';

describe('<Footer />', () => {
  test('renders copyright text', () => {
    render(<Footer />);
    expect(screen.getByText(/© 2020 Dress Shop/i)).toBeInTheDocument();
  });

  test('renders Facebook button', () => {
    render(<Footer />);
    expect(screen.getByRole('button', { name: /Facebook/i })).toBeInTheDocument();
  });

  test('renders Instagram button', () => {
    render(<Footer />);
    expect(screen.getByRole('button', { name: /Instagram/i })).toBeInTheDocument();
  });

  test('renders GitHub link with correct href', () => {
    render(<Footer />);
    const githubLink = screen.getByRole('link');
    expect(githubLink).toHaveAttribute('href', 'https://github.com/jrussumbrella/dress-shop/');
    expect(githubLink).toHaveAttribute('target', '_blank');
  });
});
