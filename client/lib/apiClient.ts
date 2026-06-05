import axios from 'axios';
import { parseCookies } from 'nookies';

import { API_URL } from '@/constants';

const instance = axios.create({
  baseURL: API_URL,
});

// Use interceptor to ensure token is retrieved from cookies on every request
instance.interceptors.request.use((config) => {
  const { token } = parseCookies({});
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default instance;
