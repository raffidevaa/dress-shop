import { render, screen } from '@testing-library/react';
import React from 'react';

import Heading from '@/components/ui/Heading';

describe('<Heading />', () => {
  it('renders children', () => {
    render(<Heading>Test Heading</Heading>);
    expect(screen.getByText('Test Heading')).toBeInTheDocument();
  });

  it('renders as a div element', () => {
    render(<Heading>Hello</Heading>);
    expect(screen.getByText('Hello').tagName).toBe('DIV');
  });

  it('applies className when provided', () => {
    render(<Heading className={'custom-class' as any}>Styled</Heading>);
    expect(screen.getByText('Styled')).toHaveClass('custom-class');
  });

  it('does not append extra class when className is omitted', () => {
    render(<Heading>No Class</Heading>);
    const el = screen.getByText('No Class');
    expect(el).not.toHaveClass('undefined');
    expect(el.className.trim().endsWith(' ')).toBe(false);
  });
});
