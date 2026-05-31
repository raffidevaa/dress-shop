import { rest } from 'msw';

import { userGenerator } from '@/test/data-generators';

export const authHandlers = [
  rest.get(/.*\/auth\/me$/, (_, res, ctx) => {
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
  rest.post(/.*\/auth\/login$/, (_, res, ctx) => {
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
  rest.post(/.*\/auth\/signup$/, (_, res, ctx) => {
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
  rest.post(/.*\/auth\/signUp$/, (_, res, ctx) => {
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
