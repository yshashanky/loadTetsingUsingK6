import http from 'k6/http';
import { sleep } from 'k6';
import { htmlReport } from "./bundle.js";
import { textSummary } from "./index.js";

export let options = {
    insecureSkipTLSVerify: true,
    noConnectionReuse: false,
    stages : [
        { duration: '5m', target: 100 },
        { duration: '10m', target: 100 },
        { duration: '5m', target: 0 },
    ],
    thresholds: {
        http_req_duration: ['p(99)<150'], //99% requests must complete under 150ms
    },
};

const API_BASE_URL = 'http://test.k6.io'

export default () => {

    http.get('http://test.k6.io');

    http.batch([
        ['GET', `${API_BASE_URL}/path`],
        ['GET', `${API_BASE_URL}/path`],
        ['GET', `${API_BASE_URL}/path`],
    ]);

    sleep(1);
}

//Report
export function handleSummary(data) {
    return {
        "result.html": htmlReport(data),
        stdout: textSummary(data, { indent: " ", enableColors: true }),
    };
}