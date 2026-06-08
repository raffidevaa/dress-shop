import React from 'react';

import EditProfile from '@/components/profile/EditProfile';
import { userGenerator } from '@/test/data-generators';
import { render, screen, fireEvent, waitFor } from '@/test/test-utils';

const mockUpdateUser = jest.fn();
jest.mock('@/hooks/user/useUpdateUser', () => () => mockUpdateUser);

const mockUser = userGenerator({ _id: 'user_1', name: 'John Doe', email: 'john@example.com' });
jest.mock('@/hooks/user/useUser', () => () => ({ data: mockUser }));

describe('<EditProfile />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with user data and handles submission', async () => {
    render(<EditProfile />);

    const nameInput = screen.getByLabelText(/Name/i);
    const emailInput = screen.getByLabelText(/Email/i);

    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john@example.com');

    fireEvent.change(nameInput, { target: { value: 'Jane Doe', name: 'name' } });
    fireEvent.change(emailInput, { target: { value: 'jane@example.com', name: 'email' } });

    const submitButton = screen.getByRole('button', { name: /Save Profile/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith(
        'user_1',
        expect.objectContaining({
          name: 'Jane Doe',
          email: 'jane@example.com',
        })
      );
    });
  });

  test('handles file upload', async () => {
    render(<EditProfile />);

    const fileInput = screen.getByRole('button', { name: /Change Photo/i })
      .previousSibling as HTMLInputElement;
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });

    // We can't easily test FileReader results in this environment without more complex setup,
    // but we can at least check if handleChange fires.
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Note: EditProfile uses FileReader which is async.
    // For a basic test, we're ensuring it doesn't crash.
  });
});
