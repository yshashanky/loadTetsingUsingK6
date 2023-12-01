import { check } from 'k6';
import http from 'k6/http';
import { Trend, Counter } from 'k6/metrics';

// Custom metrics
const failedRequestCount = new Counter('failedGetWaiterMapRequestCount');
const successRequestCount = new Counter('successGetWaiterMapRequestCount');
const getTrend = new Trend('apiTimings_getWaiterMap');

// Method to send getWaiterMap requests
export function getWaiterMap(baseUrl, token) {
  const payload = JSON.stringify({
    propertyCode: 'DP3',
    venue: 'Mall',
    stations: ['39', '56', '46', '40', '44'],
  });
  const params = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      Accept: '*/*',
    },
  };

  const res = http.post(`${baseUrl}/waiterMap`, payload, params);

  const result = check(res, {
    getWaiterMap: (res) => res.status === 200,
  });

  failedRequestCount.add(!result);
  successRequestCount.add(result);
  getTrend.add(res.timings.duration);
}
