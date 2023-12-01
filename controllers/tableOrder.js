import { check } from 'k6';
import http from 'k6/http';
import { Trend, Counter } from 'k6/metrics';

// Customs metrics
const failedGetTableOrdersRequestCount = new Counter(
  'failedGetTableOrdersRequestCount'
);
const successGetTableOrdersRequestCount = new Counter(
  'successGetTableOrdersRequestCount'
);
const getTableOrdersTrend = new Trend('apiTimings_getTableOrders');

const failedCreateTableOrderRequestCount = new Counter(
  'failedCreateTableOrderRequestCount'
);
const successCreateTableOrderRequestCount = new Counter(
  'successCreateTableOrderRequestCount'
);
const createTableOrderTrend = new Trend('apiTimings_createTableOrder');

// Method to send getTableOrders requests
export function getTableOrders(baseUrl, token) {
  const payload = JSON.stringify({
    propertyCode: 'DP3',
    reservation: ['testcfdc-cdjshdf-sdfjsdf'],
  });
  const params = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      Accept: '*/*',
    },
  };

  const res = http.post(`${baseUrl}/tableOrders`, payload, params);

  const result = check(res, {
    getTableOrders: (res) => res.status === 200,
  });

  failedGetTableOrdersRequestCount.add(!result);
  successGetTableOrdersRequestCount.add(result);
  getTableOrdersTrend.add(res.timings.duration);
}

// Method to send createTableOrder requests
export function createTableOrder(baseUrl, token) {}
