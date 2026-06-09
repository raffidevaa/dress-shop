import { renderHook, act } from '@testing-library/react';
import { mutate } from 'swr';

import useUpdateUser from '@/hooks/user/useUpdateUser';
import AuthService from '@/services/AuthService';

jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(),
  mutate: jest.fn(),
}));

jest.mock('@/services/AuthService', () => ({
  __esModule: true,
  default: {
    updateProfile: jest.fn(),
  },
}));

const mockMutate = mutate as jest.Mock;
const mockUpdateProfile = AuthService.updateProfile as jest.Mock;

describe('useUpdateUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns a callback function', () => {
    const { result } = renderHook(() => useUpdateUser());
    expect(typeof result.current).toBe('function');
  });

  it('calls AuthService.updateProfile and mutates /api/me', async () => {
    mockUpdateProfile.mockResolvedValueOnce({});
    const { result } = renderHook(() => useUpdateUser());
    const fields = { name: 'New Name', email: 'new@example.com', image: null };

    await act(async () => {
      await result.current('user_1', fields);
    });

    expect(mockUpdateProfile).toHaveBeenCalledWith('user_1', fields);
    expect(mockMutate).toHaveBeenCalledWith('/api/me');
  });
});
