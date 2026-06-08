import React from 'react';
import Router from 'next/router';
import { userGenerator } from '@/test/data-generators';
import { render, screen, fireEvent } from '@/test/test-utils';
import DesktopMenu from '@/components/core/DesktopMenu';

const mockUseUser = jest.fn();
jest.mock('@/hooks/user/useUser', () => () => mockUseUser());

jest.mock('@/hooks/cart/useCart', () => () => ({ data: { items: [] } }));
jest.mock('@/hooks/useAuth', () => ({ useLogout: () => jest.fn() }));
jest.mock('next-themes', () => {
    const MockThemeProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;
    MockThemeProvider.displayName = 'MockThemeProvider';
    return {
        useTheme: () => ({ theme: 'light', setTheme: jest.fn() }),
        ThemeProvider: MockThemeProvider
    };
});
jest.mock('next/router', () => ({
    push: jest.fn(),
}));
jest.mock('@/components/core/SearchBar', () => {
    const MockSearchBar = ({ onSubmit }: any) => (
        <button type="button" data-testid="searchbar" onClick={() => onSubmit('test-search')} />
    );
    MockSearchBar.displayName = 'MockSearchBar';
    return MockSearchBar;
});
jest.mock('next/image', () => {
    const MockImage = (props: any) => {
        // eslint-disable-next-line @next/next/no-img-element
        return <img alt="" {...props} />;
    };
    MockImage.displayName = 'MockImage';
    return MockImage;
});

describe('<DesktopMenu />', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders guest menu when unauthenticated', () => {
        mockUseUser.mockReturnValue({ data: null });
        render(<DesktopMenu />);

        expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
        expect(screen.getByText(/Log In/i)).toBeInTheDocument();
        expect(screen.queryByText(/My Profile/i)).not.toBeInTheDocument();
    });

    test('renders user dropdown when authenticated', () => {
        const user = userGenerator({ name: 'John Doe' });
        mockUseUser.mockReturnValue({ data: user });
        
        render(<DesktopMenu />);

        // Click on user avatar/name to open dropdown
        const userButton = screen.getByAltText(/John Doe/i);
        fireEvent.click(userButton);

        expect(screen.getByText(/My Profile/i)).toBeInTheDocument();
        expect(screen.getByText(/My Orders/i)).toBeInTheDocument();
        expect(screen.getByText(/My Wishlist/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Log Out/i })).toBeInTheDocument();
    });

    test('handles logout', () => {
        const user = userGenerator({ name: 'John Doe' });
        mockUseUser.mockReturnValue({ data: user });
        delete (window as any).location;
        (window as any).location = { href: '' };

        render(<DesktopMenu />);
        const userButton = screen.getByAltText(/John Doe/i);
        fireEvent.click(userButton);

        const logoutButton = screen.getByRole('button', { name: /Log Out/i });
        fireEvent.click(logoutButton);

        expect(window.location.href).toBe('/login');
    });

    test('handles search submission', () => {
        mockUseUser.mockReturnValue({ data: null });
        const mockPush = jest.fn();
        (Router.push as jest.Mock) = mockPush;

        render(<DesktopMenu />);
        
        const searchBar = screen.getByTestId('searchbar');
        fireEvent.click(searchBar);

        expect(mockPush).toHaveBeenCalledWith('/search?keyword=test-search');
    });

    test('handles theme toggle', () => {
        const user = userGenerator({ name: 'John Doe' });
        mockUseUser.mockReturnValue({ data: user });
        
        render(<DesktopMenu />);
        const userButton = screen.getByAltText(/John Doe/i);
        fireEvent.click(userButton);

        const themeToggle = screen.getByText(/Theme/i).parentElement;
        if (themeToggle) fireEvent.click(themeToggle);
        
        // setTheme should have been called
    });
});
