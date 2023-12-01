import { URLSearchParams } from 'https://jslib.k6.io/url/1.0.0/index.js';
import { check } from 'k6';
import http from 'k6/http';
import { Trend, Counter } from 'k6/metrics';

// Custom metrics
const failedGetGuestRequestCount = new Counter(
  'failedGetGuestProfileRequestCount'
);
const successGetGuestRequestCount = new Counter(
  'successGetGuestProfileRequestCount'
);
const getGuestTrend = new Trend('apiTimings_getGuestProfile');

const failedSearchGuestRequestCount = new Counter(
  'failedSearchGuestProfileRequestCount'
);
const successSearchGuestRequestCount = new Counter(
  'successSearchGuestProfileRequestCount'
);
const searchGuestTrend = new Trend('apiTimings_searchGuestProfile');

// Method to send getGuestProfile requests
export function getGuestProfile(baseUrl, token) {
  const payload = JSON.stringify({
    uiid: ['guest_029383'],
  });
  const params = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      Accept: '*/*',
    },
  };

  const res = http.post(`${baseUrl}/guestProfile`, payload, params);

  const result = check(res, {
    getGuestProfile: (res) => res.status === 200,
  });

  failedGetGuestRequestCount.add(!result);
  successGetGuestRequestCount.add(result);
  getGuestTrend.add(res.timings.duration);
}

// Method to send searchGuestProfile requests
export function searchGuestProfile(baseUrl, token) {
  const searchParams = new URLSearchParams([['searchGuest', 'W']]);
  const res = http.get(`${baseUrl}/searchGuest?${searchParams}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: '*/*',
    },
  });

  const result = check(res, {
    searchGuestProfile: (res) => res.status === 200,
  });

  failedSearchGuestRequestCount.add(!result);
  successSearchGuestRequestCount.add(result);
  searchGuestTrend.add(res.timings.duration);
}
