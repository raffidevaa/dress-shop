import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import ChangePassword from '@/components/profile/ChangePassword';
import AuthService from '@/services/AuthService';

jest.mock('@/services/AuthService', () => ({
  changePassword: jest.fn(),
}));

describe('<ChangePassword />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders fields and handles password change', async () => {
    render(<ChangePassword />);

    const oldPwdInput = screen.getByLabelText('Old Password', { exact: true });
    const newPwdInput = screen.getByLabelText('New Password', { exact: true });
    const confirmPwdInput = screen.getByLabelText('Confirm New Password', { exact: true });

    fireEvent.change(oldPwdInput, { target: { value: 'old_123', name: 'oldPassword' } });
    fireEvent.change(newPwdInput, { target: { value: 'new_123', name: 'newPassword' } });
    fireEvent.change(confirmPwdInput, { target: { value: 'new_123', name: 'confirmNewPassword' } });

    const submitButton = screen.getByRole('button', { name: /Save Password/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(AuthService.changePassword).toHaveBeenCalledWith({
        oldPassword: 'old_123',
        newPassword: 'new_123',
        confirmNewPassword: 'new_123'
      });
    });
  });

  test('shows error when passwords do not match', async () => {
    render(<ChangePassword />);
    
    fireEvent.change(screen.getByLabelText('New Password', { exact: true }), { target: { value: 'new_123', name: 'newPassword' } });
    fireEvent.change(screen.getByLabelText('Confirm New Password', { exact: true }), { target: { value: 'wrong', name: 'confirmNewPassword' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Save Password/i }));
    
    // Toast should be called. Check if changePassword was NOT called.
    expect(AuthService.changePassword).not.toHaveBeenCalled();
  });
});
