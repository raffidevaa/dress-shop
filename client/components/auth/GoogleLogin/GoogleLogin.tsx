import { useGoogleLogin } from '@react-oauth/google';
import Router, { useRouter } from 'next/router';
import React, { useState } from 'react';

import { IconGoogle } from '@/components/icons';
import { Button, PageLoader } from '@/components/ui';
import { useToast } from '@/contexts';
import { useGoogleLogin as useAuthGoogleLogin } from '@/hooks/useAuth';

const GoogleLogin = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const authGoogleLogin = useAuthGoogleLogin();
  const { setToast } = useToast();
  const { query } = useRouter();
  const ref = query.ref as string;

  const handleOnSuccess = async (idToken?: string): Promise<void> => {
    if (!idToken) return;
    try {
      setIsLoggingIn(true);
      await authGoogleLogin(idToken);
      setIsLoggingIn(false);
      if (ref) {
        Router.push(`/products/${ref}`);
      } else {
        Router.push('/profile');
      }
    } catch (error: any) {
      setToast('error', error.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const login = useGoogleLogin({
    onSuccess: (credentialResponse: any) => handleOnSuccess(credentialResponse.credential),
    onError: () => setToast('error', 'Login Failed'),
  });

  return (
    <>
      {isLoggingIn && <PageLoader />}
      <div className="container">
        <Button
          type="button"
          onClick={() => login()}
          icon={<IconGoogle />}
          title="Login with Google"
          variant="light"
          style={{ width: '100%' }}
        />
      </div>
    </>
  );
};

export default GoogleLogin;
