import http from 'k6/http';
import { check } from 'k6';

export default function () {
  // Get URL from environment variable on CD pipeline
  const baseUrl = __ENV.SMOKE_BASE_URL;

  const responses = http.batch([
    ['GET', `${baseUrl}/api/health`],
    ['GET', `${baseUrl}`],
  ]);

  check(responses[0], {
    'Health API is status 200': (r) => r.status === 200,
  });

  check(responses[1], {
    'Frontend is status 200': (r) => r.status === 200,
  });
}
