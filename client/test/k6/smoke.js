import http from 'k6/http';
import { check, sleep } from 'k6';

export default function () {
  const baseUrl = __ENV.SMOKE_BASE_URL || 'https://dress-shop.anargya.fun';

  console.log(`Testing against: ${baseUrl}`);

  // 1. Health check
  const healthRes = http.get(`${baseUrl}/api/health`);
  check(healthRes, {
    'Health API is status 200': (r) => r.status === 200,
  });

  // 2. Frontend check
  let frontendRes;
  const maxRetries = 3;
  for (let i = 0; i < maxRetries; i++) {
    frontendRes = http.get(baseUrl);
    if (frontendRes.status === 200) break;
    
    console.log(`Frontend attempt ${i + 1} failed with status ${frontendRes.status}. Retrying in 5s...`);
    sleep(5);
  }

  check(frontendRes, {
    'Frontend is status 200': (r) => r.status === 200,
  });
}
