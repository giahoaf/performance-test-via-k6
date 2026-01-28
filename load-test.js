import http from 'k6/http';
import { check, sleep } from 'k6';

// Load test configuration
export const options = {
    stages: [
        { duration: '30s', target: 10 },  // Ramp up to 10 users over 30 seconds
        { duration: '1m', target: 10 },   // Stay at 10 users for 1 minute
        { duration: '30s', target: 0 },   // Ramp down to 0 users
    ],
    // Relaxed thresholds for demo
    thresholds: {
        http_req_duration: ['p(95)<5000'], // Very lenient - 5 seconds
    },
};

const BASE_URL = 'https://quickpizza.grafana.com';

export default function () {
    // Test 1: Visit homepage
    const homeResponse = http.get(BASE_URL);
    check(homeResponse, {
        'Homepage loaded': (r) => r.status === 200,
    });

    sleep(1);

    // Test 2: Get menu/recommendations
    const menuResponse = http.get(`${BASE_URL}/api/recommendations`);
    check(menuResponse, {
        'Menu API called': (r) => r.status >= 200 && r.status < 500,
    });

    sleep(1);

    // Test 3: Get pizza list
    const pizzaResponse = http.get(`${BASE_URL}/api/pizza`);
    check(pizzaResponse, {
        'Pizza API called': (r) => r.status >= 200 && r.status < 500,
    });

    sleep(1);
}
