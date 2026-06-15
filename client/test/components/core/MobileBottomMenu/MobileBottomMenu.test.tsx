jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({ pathname: '/' })),
}));
jest.mock('@/hooks/cart/useCart', () => ({
  __esModule: true,
  default: jest.fn(() => ({ data: null })),
}));
jest.mock('@/hooks/user/useUser', () => ({
  __esModule: true,
  default: jest.fn(() => ({ data: null })),
}));

import { useRouter } from 'next/router';
import React from 'react';

import MobileBottomMenu from '@/components/core/MobileBottomMenu';
import useCart from '@/hooks/cart/useCart';
import useUser from '@/hooks/user/useUser';
import { cartItemGenerator, userGenerator } from '@/test/data-generators';
import { render, screen } from '@/test/test-utils';

const mockUseRouter = useRouter as jest.Mock;
const mockUseUser = useUser as jest.Mock;
const mockUseCart = useCart as jest.Mock;

describe('<MobileBottomMenu />', () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({ pathname: '/' });
    mockUseUser.mockReturnValue({ data: null });
    mockUseCart.mockReturnValue({ data: null });
  });

  it('renders all nav links', () => {
    render(<MobileBottomMenu />);
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Search/i)).toBeInTheDocument();
    expect(screen.getByText(/Cart/i)).toBeInTheDocument();
    expect(screen.getByText(/Profile/i)).toBeInTheDocument();
  });

  it('shows cart badge when cart has items', () => {
    mockUseCart.mockReturnValue({
      data: { items: [cartItemGenerator(), cartItemGenerator()] },
    });
    render(<MobileBottomMenu />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('does not show cart badge when cart is empty', () => {
    mockUseCart.mockReturnValue({ data: { items: [] } });
    render(<MobileBottomMenu />);
    expect(screen.queryByText(/^\d+$/)).not.toBeInTheDocument();
  });

  it('links to /profile when user is logged in', () => {
    mockUseUser.mockReturnValue({ data: userGenerator() });
    render(<MobileBottomMenu />);
    const profileLink = screen.getByText(/Profile/i).closest('a');
    expect(profileLink).toHaveAttribute('href', '/profile');
  });

  it('links to /login when user is not logged in', () => {
    mockUseUser.mockReturnValue({ data: null });
    render(<MobileBottomMenu />);
    const profileLink = screen.getByText(/Profile/i).closest('a');
    expect(profileLink).toHaveAttribute('href', '/login');
  });
});
