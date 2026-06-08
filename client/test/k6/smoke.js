import http from 'k6/http';
import { check, sleep } from 'k6';

export default function () {
  const apiBaseUrl = __ENV.API_BASE_URL;
  const frontendBaseUrl = __ENV.FRONTEND_BASE_URL;

  console.log(`Testing API against: ${apiBaseUrl}`);
  console.log(`Testing Frontend against: ${frontendBaseUrl}`);

  // 1. Health check
  const healthRes = http.get(`${apiBaseUrl}/api/health`);
  check(healthRes, {
    'Health API is status 200': (r) => r.status === 200,
  });

  // 2. Frontend check
  let frontendRes;
  const maxRetries = 3;
  for (let i = 0; i < maxRetries; i++) {
    frontendRes = http.get(frontendBaseUrl);
    if (frontendRes.status === 200) break;
    
    console.log(`Frontend attempt ${i + 1} failed with status ${frontendRes.status}. Retrying in 5s...`);
    sleep(5);
  }

  check(frontendRes, {
    'Frontend is status 200': (r) => r.status === 200,
  });
}
