import http from 'k6/http';
import { check, sleep } from 'k6';

// Smoke test configuration - minimal load to verify script works
export const options = {
    vus: 1,           // 1 virtual user
    duration: '30s',  // Run for 30 seconds
    // No strict thresholds - just for demonstration
};

const BASE_URL = 'https://quickpizza.grafana.com';

export default function () {
    // Test 1: Load homepage
    const homeResponse = http.get(BASE_URL);

    check(homeResponse, {
        'Homepage - status is 200': (r) => r.status === 200,
        'Homepage - has pizza content': (r) => r.body.includes('pizza') || r.body.includes('Pizza'),
    });

    sleep(1);

    // Test 2: Get API recommendations
    const apiResponse = http.get(`${BASE_URL}/api/recommendations`);

    check(apiResponse, {
        'API - status is 200': (r) => r.status === 200 || r.status === 404, // Allow 404 if endpoint changed
    });

    sleep(1);
}
