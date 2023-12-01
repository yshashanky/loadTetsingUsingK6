import { URLSearchParams } from 'https://jslib.k6.io/url/1.0.0/index.js';
import { check } from 'k6';
import http from 'k6/http';
import { Trend, Counter } from 'k6/metrics';

// Custom metrics
const failedRequestCount = new Counter('failedGetMenuRequestCount');
const successRequestCount = new Counter('successGetMenuRequestCount');
const getTrend = new Trend('apiTimings_getMenu');

// Method to send getMenu requests
export function getMenu(baseUrl, token) {
  const searchParams = new URLSearchParams([
    ['venue', 'Mall'],
    ['categoryType', 'Food,Beverage,Clothes'],
  ]);

  const res = http.get(`${baseUrl}/getMenu?${searchParams}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: '*/*',
    },
  });

  const result = check(res, {
    getMenu: (res) => res.status === 200,
  });

  failedRequestCount.add(!result);
  successRequestCount.add(result);
  getTrend.add(res.timings.duration);
}
