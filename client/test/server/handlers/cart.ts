import { rest } from 'msw';

import { fakeCartItems } from '@/test/fake-data';

export const cartHandlers = [
  rest.get(/.*\/cart$/, (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: {
          items: fakeCartItems,
        },
      })
    );
  }),
  rest.post(/.*\/cart$/, (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: fakeCartItems[0],
      })
    );
  }),
  rest.put(/.*\/cart$/, (_, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.delete(/.*\/cart$/, (_, res, ctx) => {
    return res(ctx.status(200));
  }),
];
