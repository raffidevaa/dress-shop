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
    useGoogleLogin: (_opts: any) => jest.fn(),
}));

import { render, screen } from '@/test/test-utils';
import GoogleLogin from '@/components/auth/GoogleLogin';

describe('<GoogleLogin />', () => {
    test('renders without crashing', () => {
        render(<GoogleLogin />);
        expect(screen.getByText(/Login with Google/i)).toBeInTheDocument();
    });
});
