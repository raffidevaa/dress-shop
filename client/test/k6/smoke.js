import http from 'k6/http';
import { check } from 'k6';

export default function () {
  const responses = http.batch([
    ['GET', '<https://dress-shop.anargya.fun/api/health>'],
    ['GET', '<https://dress-shop.anargya.fun/>'],
  ]);

  check(responses[0], {
    'Health API is status 200': (r) => r.status === 200,
  });

  check(responses[1], {
    'Frontend is status 200': (r) => r.status === 200,
  });
}