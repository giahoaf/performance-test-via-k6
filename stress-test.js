import http from 'k6/http';
import { check, sleep } from 'k6';

// Stress test configuration - gradual ramp up
export const options = {
    stages: [
        { duration: '1m', target: 25 },    // Ramp up to 25 users
        { duration: '2m', target: 50 },    // Increase to 50 users
        { duration: '1m', target: 50 },    // Maintain 50 users
        { duration: '1m', target: 0 },     // Ramp down to 0
    ],
    // Very lenient thresholds for demo
    thresholds: {
        http_req_duration: ['p(95)<10000'], // 10 seconds - very permissive
    },
};

const BASE_URL = 'https://quickpizza.grafana.com';

export default function () {
    // Simulate realistic user behavior

    // 1. Visit homepage
    const home = http.get(BASE_URL);
    check(home, { 'Homepage OK': (r) => r.status === 200 });
    sleep(Math.random() * 2 + 1); // Random sleep 1-3 seconds

    // 2. Browse recommendations
    const recommendations = http.get(`${BASE_URL}/api/recommendations`);
    check(recommendations, { 'API called': (r) => r.status > 0 }); // Just check we got response
    sleep(Math.random() * 2 + 1);

    // 3. View pizza menu
    const pizzas = http.get(`${BASE_URL}/api/pizza`);
    check(pizzas, { 'Pizza API called': (r) => r.status > 0 });
    sleep(Math.random() * 2 + 1);

    sleep(1);
}
