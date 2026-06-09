import { rest } from 'msw';

import { API_URL } from '@/constants';
import { fakeCartItems } from '@/test/fake-data';

export const cartHandlers = [
  rest.get(`${API_URL}/api/cart`, (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: {
          items: fakeCartItems,
        },
      })
    );
  }),
  rest.post(`${API_URL}/api/cart`, (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: fakeCartItems[0],
      })
    );
  }),
  rest.put(`${API_URL}/api/cart`, (_, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.delete(`${API_URL}/api/cart`, (_, res, ctx) => {
    return res(ctx.status(200));
  }),
];
