import React from 'react';
jest.mock('next/router', () => ({
  push: jest.fn(),
  useRouter: () => ({ query: {} }),
}));
jest.mock('@/hooks/useAuth', () => ({
  useGoogleLogin: () => jest.fn(),
}));
jest.mock('@/contexts', () => ({
  useToast: () => ({ setToast: jest.fn() }),
}));
jest.mock('@react-oauth/google', () => ({
  useGoogleLogin: () => jest.fn(),
}));

import GoogleLogin from '@/components/auth/GoogleLogin';
import { render, screen } from '@/test/test-utils';

describe('<GoogleLogin />', () => {
  test('renders without crashing', () => {
    render(<GoogleLogin />);
    expect(screen.getByText(/Login with Google/i)).toBeInTheDocument();
  });
});
