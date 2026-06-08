import React from 'react';
jest.mock('@/hooks/user/useUser', () => () => ({ data: null }));
jest.mock('@/hooks/useAuth', () => ({ useLogout: () => jest.fn() }));

import Sidebar from '@/components/core/Sidebar';
import { render, screen } from '@/test/test-utils';

describe('<Sidebar />', () => {
  test('renders links and overlay when open', () => {
    render(<Sidebar isOpen={true} onClose={jest.fn()} />);
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
  });
});
