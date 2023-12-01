import { check } from 'k6';
import http from 'k6/http';
import { Rate } from 'k6/metrics';

// Custom metrics
const failedAddUpdateReservationRate = new Rate(
  'custom_failedAddUpdateReservationRate'
);
const failedRemoveUpdateReservationRate = new Rate(
  'custom_failedRemoveUpdateReservationRate'
);

// Method to send updateReservation requests

// addGuest request
export function addGuest(baseUrl, token) {
  const payload = JSON.stringify();
  const params = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      Accept: '*/*',
    },
  };

  const res = http.post(`${baseUrl}/updateReservation/add}`, payload, params);

  const result = check(res, {
    returnAddGuest: (res) => res.status === 200,
  });

  failedAddUpdateReservationRate.add(!result);
}

// removeGuest request
export function removeGuest(baseUrl, token) {
  const payload = JSON.stringify();
  const params = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      Accept: '*/*',
    },
  };

  const res = http.post(
    `${baseUrl}/updateReservation/remove}`,
    payload,
    params
  );

  const result = check(res, {
    returnRemoveGuest: (res) => res.status === 200,
  });

  failedRemoveUpdateReservationRate.add(!result);
}
