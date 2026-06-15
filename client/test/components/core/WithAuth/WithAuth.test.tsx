jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({ push: jest.fn(), pathname: '/' })),
}));
jest.mock('@/hooks/user/useUser', () => jest.fn());

import { useRouter } from 'next/router';
import React from 'react';

import WithAuth from '@/components/core/WithAuth';
import useUser from '@/hooks/user/useUser';
import { userGenerator } from '@/test/data-generators';
import { render, screen } from '@/test/test-utils';

const mockUseRouter = useRouter as jest.Mock;
const mockUseUser = useUser as jest.Mock;

const MockPage = () => <div>Protected Page</div>;

describe('WithAuth HOC', () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({ push: jest.fn() });
  });

  it('renders the wrapped component when user is logged in', () => {
    mockUseUser.mockReturnValue({ data: userGenerator(), isLoading: false });
    const ProtectedPage = WithAuth(MockPage);
    render(<ProtectedPage />);
    expect(screen.getByText('Protected Page')).toBeInTheDocument();
  });

  it('renders spinner when user is not logged in', () => {
    mockUseUser.mockReturnValue({ data: null, isLoading: false });
    const ProtectedPage = WithAuth(MockPage);
    render(<ProtectedPage />);
    expect(screen.queryByText('Protected Page')).not.toBeInTheDocument();
  });

  it('redirects to /login when not loading and no user', () => {
    const mockPush = jest.fn();
    mockUseRouter.mockReturnValue({ push: mockPush });
    mockUseUser.mockReturnValue({ data: null, isLoading: false });
    const ProtectedPage = WithAuth(MockPage);
    render(<ProtectedPage />);
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('does not redirect while still loading', () => {
    const mockPush = jest.fn();
    mockUseRouter.mockReturnValue({ push: mockPush });
    mockUseUser.mockReturnValue({ data: null, isLoading: true });
    const ProtectedPage = WithAuth(MockPage);
    render(<ProtectedPage />);
    expect(mockPush).not.toHaveBeenCalled();
  });
});
