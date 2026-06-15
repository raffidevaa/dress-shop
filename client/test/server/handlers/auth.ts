import { rest } from 'msw';

import { API_URL } from '@/constants';
import { userGenerator } from '@/test/data-generators';

export const authHandlers = [
  rest.get(`${API_URL}/api/auth/me`, (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: {
          token: 'test_token',
          user: userGenerator(),
        },
      })
    );
  }),
  rest.post(`${API_URL}/api/auth/login`, (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: {
          token: 'test_token',
          user: userGenerator(),
        },
      })
    );
  }),
  rest.post(`${API_URL}/api/auth/signup`, (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: {
          token: 'test_token',
          user: userGenerator(),
        },
      })
    );
  }),
  rest.post(`${API_URL}/api/auth/signUp`, (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: {
          token: 'test_token',
          user: userGenerator(),
        },
      })
    );
  }),
];
