import { render, screen } from '@testing-library/react';
import React from 'react';

import PopUp from '@/components/ui/PopUp';

describe('<PopUp />', () => {
  it('renders message when isOpen is true', () => {
    render(<PopUp message="Added to cart!" isOpen={true} />);
    expect(screen.getByText('Added to cart!')).toBeInTheDocument();
  });

  it('renders nothing when isOpen is false', () => {
    render(<PopUp message="Added to cart!" isOpen={false} />);
    expect(screen.queryByText('Added to cart!')).not.toBeInTheDocument();
  });
});
