import { GoogleOAuthProvider } from '@react-oauth/google';
import { AppProps } from 'next/app';
import React from 'react';

import Layout from '@/components/core/Layout';
import { GOOGLE_CLIENT_ID } from '@/constants';
import { AppProviders } from '@/contexts';
import { User } from '@/types';
import '@/styles/global.css';
import '@/styles/nprogress.css';

interface MyAppProps extends AppProps {
  currentUser: User | null;
}

const MyApp = ({ Component, pageProps }: MyAppProps): JSX.Element => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AppProviders>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AppProviders>
    </GoogleOAuthProvider>
  );
};

export default MyApp;
