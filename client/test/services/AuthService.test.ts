import apiClient from '@/lib/apiClient';
import AuthService, { changePassword, updateProfile } from '@/services/AuthService';
import { userGenerator } from '@/test/data-generators';

jest.mock('@/lib/apiClient', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
  },
}));

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('AuthService', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  describe('getMe', () => {
    test('getMe returns user data on success', async () => {
      const user = userGenerator();
      mockApiClient.get.mockResolvedValueOnce({ data: { data: { user, token: 'token-1' } } });

      const result = await AuthService.getMe();
      expect(result).toEqual({ user, token: 'token-1' });
      expect(mockApiClient.get).toHaveBeenCalledWith('api/auth/me');
    });

    test('getMe throws error on failure', async () => {
      mockApiClient.get.mockRejectedValueOnce({ response: { status: 401 } });
      await expect(AuthService.getMe()).rejects.toThrow('Server Error: 401');
    });
  });

  describe('verifyGoogleIdToken', () => {
    test('verifyGoogleIdToken returns session data on success', async () => {
      const user = userGenerator();
      mockApiClient.post.mockResolvedValueOnce({ data: { data: { user, token: 'token-2' } } });

      const result = await AuthService.verifyGoogleIdToken('google-id-token');
      expect(result).toEqual({ user, token: 'token-2' });
      expect(mockApiClient.post).toHaveBeenCalledWith('api/auth/google', { idToken: 'google-id-token' });
    });

    test('verifyGoogleIdToken throws error on failure', async () => {
      mockApiClient.post.mockRejectedValueOnce({ response: { status: 400 } });
      await expect(AuthService.verifyGoogleIdToken('token')).rejects.toThrow('Server Error: 400');
    });
  });

  describe('login', () => {
    test('login returns session data on success', async () => {
      const user = userGenerator();
      mockApiClient.post.mockResolvedValueOnce({ data: { data: { user, token: 'token-3' } } });

      const result = await AuthService.login('test@example.com', 'password');
      expect(result).toEqual({ user, token: 'token-3' });
      expect(mockApiClient.post).toHaveBeenCalledWith('api/auth/login', {
        email: 'test@example.com',
        password: 'password',
      });
    });

    test('login throws error on failure', async () => {
      mockApiClient.post.mockRejectedValueOnce({ response: { data: { message: 'Invalid credentials' } } });
      await expect(AuthService.login('a@b.com', 'p')).rejects.toThrow('Invalid credentials');
    });
  });

  describe('signUp', () => {
    test('signUp returns session data on success', async () => {
      const user = userGenerator();
      mockApiClient.post.mockResolvedValueOnce({ data: { data: { user, token: 'token-4' } } });

      const result = await AuthService.signUp({ email: 'n@e.com', password: 'p', name: 'N' });
      expect(result).toEqual({ user, token: 'token-4' });
      expect(mockApiClient.post).toHaveBeenCalledWith('api/auth/signup', { email: 'n@e.com', password: 'p', name: 'N' });
    });

    test('signUp throws error on failure', async () => {
      mockApiClient.post.mockRejectedValueOnce({ response: { status: 409 } });
      await expect(AuthService.signUp({ email: 'n@e.com', password: 'p', name: 'N' })).rejects.toThrow('Server Error: 409');
    });
  });

  describe('changePassword', () => {
    test('changePassword returns updated session data on success', async () => {
      const user = userGenerator();
      mockApiClient.patch.mockResolvedValueOnce({ data: { data: { user, token: 'token-5' } } });

      const result = await changePassword({ oldPassword: 'o', newPassword: 'n', confirmNewPassword: 'n' });
      expect(result).toEqual({ user, token: 'token-5' });
      expect(mockApiClient.patch).toHaveBeenCalledWith('api/auth/change-password', {
        oldPassword: 'o',
        newPassword: 'n',
        confirmNewPassword: 'n',
      });
    });

    test('changePassword throws error on failure', async () => {
      mockApiClient.patch.mockRejectedValueOnce({ response: { status: 400 } });
      await expect(changePassword({ oldPassword: 'o', newPassword: 'n', confirmNewPassword: 'n' })).rejects.toThrow('Server Error: 400');
    });
  });

  describe('updateProfile', () => {
    test('updateProfile returns updated user data on success', async () => {
      const user = userGenerator();
      mockApiClient.patch.mockResolvedValueOnce({ data: { data: user } });

      const result = await updateProfile('uid', { name: 'U', email: 'u@e.com', image: null });
      expect(result).toEqual(user);
      expect(mockApiClient.patch).toHaveBeenCalledWith('api/users/uid', { name: 'U', email: 'u@e.com', image: null });
    });

    test('updateProfile throws error on failure', async () => {
      mockApiClient.patch.mockRejectedValueOnce({ response: { status: 500 } });
      await expect(updateProfile('uid', {} as any)).rejects.toThrow('Server Error: 500');
    });
  });
});
