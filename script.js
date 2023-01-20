import http from 'k6/http';
import { sleep } from 'k6';
import { htmlReport } from "./bundle.js";
import { textSummary } from "./index.js";

export const options = {
  vus: 10,
  duration: '10s',
};
export default function () {
  http.get('http://test.k6.io');
  sleep(1);
}

//Report
export function handleSummary(data) {
  return {
    "result.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}