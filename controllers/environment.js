import { check } from 'k6';
import http from 'k6/http';
import { Trend, Counter } from 'k6/metrics';

// Custom metrics
const failedRequestCount = new Counter('failedGetEnvironmentRequestCount');
const successRequestCount = new Counter('successGetEnvironmentRequestCount');
const getTrend = new Trend('apiTimings_getEnvironment');

// Method to send getEnvironment requests
export function getEnvironment(baseUrl, token) {
  const res = http.get(`${baseUrl}/environment`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: '*/*',
    },
  });

  const result = check(res, {
    getEnvironment: (res) => res.status === 200,
  });

  failedRequestCount.add(!result);
  successRequestCount.add(result);
  getTrend.add(res.timings.duration);
}
