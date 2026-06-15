jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactElement; href: string }) => {
    return React.cloneElement(children, { href });
  };
  MockLink.displayName = 'MockLink';
  return MockLink;
});

import React from 'react';

import Button from '@/components/ui/Button';
import { render, screen, fireEvent } from '@/test/test-utils';

describe('<Button />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders as a button element by default', () => {
    render(<Button title="Click Me" />);
    expect(screen.getByRole('button', { name: /Click Me/i })).toBeInTheDocument();
  });

  test('renders as a link when href is provided', () => {
    render(<Button title="Go Home" href="/home" />);
    const link = screen.getByRole('button', { name: /Go Home/i });
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/home');
  });

  test('calls onClick when button is clicked', () => {
    const handleClick = jest.fn();
    render(<Button title="Click" onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button', { name: /Click/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('button is disabled when disabled prop is true', () => {
    render(<Button title="Disabled" disabled />);
    expect(screen.getByRole('button', { name: /Disabled/i })).toBeDisabled();
  });

  test('renders spinner when loading is true', () => {
    render(<Button title="Save" loading />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText('Save')).not.toBeInTheDocument();
  });

  test('renders icon when icon prop is provided', () => {
    const icon = <span data-testid="test-icon">★</span>;
    render(<Button title="With Icon" icon={icon} />);
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByText(/With Icon/i)).toBeInTheDocument();
  });

  test('applies primary variant class', () => {
    render(<Button title="Primary" variant="primary" />);
    const btn = screen.getByRole('button', { name: /Primary/i });
    expect(btn).toHaveClass('primary');
  });
});
