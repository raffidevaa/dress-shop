jest.mock('next/router', () => ({
  push: jest.fn(),
  useRouter: jest.fn(() => ({ query: {} })),
}));
jest.mock('@/hooks/useAuth', () => ({
  useGoogleLogin: () => mockAuthGoogleLogin,
}));
jest.mock('@/contexts', () => ({
  useToast: () => ({ setToast: mockSetToast }),
}));
jest.mock('@react-oauth/google', () => ({
  useGoogleLogin: jest.fn(),
}));

import { useGoogleLogin as mockUseGoogleLogin } from '@react-oauth/google';
import Router, { useRouter } from 'next/router';
import React, { act } from 'react';

import GoogleLogin from '@/components/auth/GoogleLogin';
import { render, screen, fireEvent } from '@/test/test-utils';

const mockAuthGoogleLogin = jest.fn();
const mockSetToast = jest.fn();
const mockRouterPush = Router.push as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;

describe('<GoogleLogin />', () => {
  let capturedCallbacks: { onSuccess: (res: any) => void; onError: () => void };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({ query: {} });
    (mockUseGoogleLogin as jest.Mock).mockImplementation((callbacks: any) => {
      capturedCallbacks = callbacks;
      return jest.fn();
    });
  });

  test('renders login button', () => {
    render(<GoogleLogin />);
    expect(screen.getByText(/Login with Google/i)).toBeInTheDocument();
  });

  test('calls login when button is clicked', () => {
    const mockLogin = jest.fn();
    (mockUseGoogleLogin as jest.Mock).mockImplementation((callbacks: any) => {
      capturedCallbacks = callbacks;
      return mockLogin;
    });
    render(<GoogleLogin />);
    fireEvent.click(screen.getByRole('button', { name: /Login with Google/i }));
    expect(mockLogin).toHaveBeenCalledTimes(1);
  });

  test('handleOnSuccess returns early when idToken is undefined', async () => {
    render(<GoogleLogin />);
    await act(async () => {
      await capturedCallbacks.onSuccess({ credential: undefined });
    });
    expect(mockAuthGoogleLogin).not.toHaveBeenCalled();
  });

  test('handleOnSuccess redirects to /profile when no ref', async () => {
    mockAuthGoogleLogin.mockResolvedValueOnce({});
    render(<GoogleLogin />);
    await act(async () => {
      await capturedCallbacks.onSuccess({ credential: 'test-token' });
    });
    expect(mockAuthGoogleLogin).toHaveBeenCalledWith('test-token');
    expect(mockRouterPush).toHaveBeenCalledWith('/profile');
  });

  test('handleOnSuccess redirects to /products/:ref when ref exists', async () => {
    mockUseRouter.mockReturnValue({ query: { ref: 'dress-123' } });
    mockAuthGoogleLogin.mockResolvedValueOnce({});
    render(<GoogleLogin />);
    await act(async () => {
      await capturedCallbacks.onSuccess({ credential: 'test-token' });
    });
    expect(mockRouterPush).toHaveBeenCalledWith('/products/dress-123');
  });

  test('handleOnSuccess calls setToast on error', async () => {
    mockAuthGoogleLogin.mockRejectedValueOnce(new Error('Auth failed'));
    render(<GoogleLogin />);
    await act(async () => {
      await capturedCallbacks.onSuccess({ credential: 'test-token' });
    });
    expect(mockSetToast).toHaveBeenCalledWith('error', 'Auth failed');
  });

  test('onError calls setToast with login failed message', () => {
    render(<GoogleLogin />);
    act(() => {
      capturedCallbacks.onError();
    });
    expect(mockSetToast).toHaveBeenCalledWith('error', 'Login Failed');
  });
});
