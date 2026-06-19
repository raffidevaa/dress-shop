import { useCallback } from 'react';
import { mutate } from 'swr';

import AuthService from '@/services/AuthService';
import RecentlyViewedService from '@/services/RecentlyViewedService';
import { autoLogin, autoLogout } from '@/utils/auth';

export const useGoogleLogin = () => {
  return useCallback(async (idToken: string) => {
    const { token } = await AuthService.verifyGoogleIdToken(idToken);
    autoLogin(token);
    await RecentlyViewedService.syncRecentlyViewed();
    mutate('/api/me');
  }, []);
};

export const useLogin = () => {
  return useCallback(async (email: string, password: string) => {
    const { token } = await AuthService.login(email, password);
    autoLogin(token);
    await RecentlyViewedService.syncRecentlyViewed();
    await mutate('/api/me');
  }, []);
};

export const useSignup = () => {
  return useCallback(
    async ({ email, name, password }: { email: string; name: string; password: string }) => {
      const { token } = await AuthService.signUp({ email, name, password });
      autoLogin(token);
      await RecentlyViewedService.syncRecentlyViewed();
      mutate('/api/me');
    },
    []
  );
};

export const useLogout = () => {
  return useCallback(async () => {
    autoLogout();
    mutate('/api/me');
  }, []);
};
