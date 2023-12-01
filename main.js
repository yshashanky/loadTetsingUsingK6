import { check, fail, group, sleep } from 'k6';
import http from 'k6/http';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
// import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { htmlReport } from './reportGenerator/bundle.js';

// Import controllers
import { getMenu } from './controllers/menu.js';
import { getEnvironment } from './controllers/environment.js';
import { getWaiterMap } from './controllers/waiterMap.js';
import { getTableOrders } from './controllers/tableOrder.js';
import {
  getGuestProfile,
  searchGuestProfile,
} from './controllers/guestProfile.js';

// Set environment
const env = 'env';

// Set constants
const returnReport = true;
const baseUrl = `https://dinning-service.${env}.com`;
const authUrl = `https://auth-services.${env}.com`;

export const options = {
  //Runs the load test with the same number of VUs for a specific duration
  vus: 1,
  duration: '1s',

  //Runs the load test in stages with a different number of Virtual Users (VUs) and durations
  // stages: [
  //   { duration: "2s", target: 2 },
  //   { duration: "10s", target: 20 },
  //   { duration: "30s", target: 400 },
  //   { duration: "3m", target: 400 },
  //   { duration: "10s", target: 1000 },
  //   { duration: "4m", target: 1000 },
  //   { duration: "30s", target: 100 },
  // ],

  //Checks and thresholds for the load test
  thresholds: {
    // Default checks
    checks: ['rate>0.9'],

    // Success and failed request counts and checks
    failedGetMenuRequestCount: ['count <= 10'],
    successGetMenuRequestCount: ['count >= 10'],
    failedGetGuestProfileRequestCount: ['count <= 10'],
    successGetGuestProfileRequestCount: ['count >= 10'],
    failedSearchGuestProfileRequestCount: ['count <= 10'],
    successSearchGuestProfileRequestCount: ['count >= 10'],
    failedGetEnvironmentRequestCount: ['count <= 10'],
    successGetEnvironmentRequestCount: ['count >= 10'],

    // Overall API timings and checks
    apiTimings_getMenu: ['p(95) < 2000'],
    apiTimings_getGuestProfile: ['p(95) < 2000'],
    apiTimings_searchGuestProfile: ['p(95) < 2000'],
    apiTimings_getEnvironment: ['p(95) < 2000'],
    apiTimings_getWaiterMap: ['p(95) < 2000'],
    apiTimings_getTableOrders: ['p(95) < 2000'],
  },
};

// Function to do setup befor starting load test
export function setup() {
  const res = getToken();
  if (res.status !== 200) fail('Failed to get the auth token');
  const token = JSON.parse(res.body).accessToken;
  return { token };
}

// Function to generate token
export function getToken() {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Cache-Control': 'no-cache',
  };
  const payload = {
    scope: 'dinning malls',
  };
  const url = `${authUrl}/accessToken`;

  const res = http.post(url, payload, { headers: headers });

  return res;
}

// This function returns summary and generate reports
export function handleSummary(data) {
  const stdout = textSummary(data, {
    indent: ' ',
    enableColors: returnReport,
  });

  const testResult = `reports/${env}_testResult_${
    new Date().toISOString().replace(/[:]/g, '_').split('.')[0]
  }.html`;

  return returnReport
    ? {
        [testResult]: htmlReport(data),
        // "reports/testResult.json": JSON.stringify(data, null, 2), //Uncomment this line if you require the result in a JSON file.
        stdout,
      }
    : {
        stdout,
      };
}

export default function (data) {
  const res = http.get(`${baseUrl}/health`);
  check(res, {
    appIsHealthy: (res) => JSON.parse(res.body).status === 'UP',
  });
  group('Environment', () => {
    getEnvironment(baseUrl, data.token);
  });
  group('Menu', () => {
    getMenu(baseUrl, data.token);
  });
  group('Waiter map', () => {
    getWaiterMap(baseUrl, data.token);
  });
  group('Guest profile', () => {
    getGuestProfile(baseUrl, data.token);
    searchGuestProfile(baseUrl, data.token);
  });
  group('Table order', () => {
    getTableOrders(baseUrl, data.token);
  });
  sleep(1);
}
