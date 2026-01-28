# k6 Performance Testing Demo

This project demonstrates performance testing using k6 with the ReqRes API.

## Test API

- **API**: <https://reqres.in/api>
- **Type**: REST API for testing
- **Features Tested**: CRUD operations (GET, POST, PUT, DELETE)

## Project Structure

```
performance-k6/
├── smoke-test.js     # Quick verification (1 VU, 30s)
├── load-test.js      # Normal load simulation (ramp 0→10→0)
├── stress-test.js    # High load testing (ramp up to 200 VUs)
└── README.md         # This file
```

## Prerequisites

Install k6:

**Windows (via Chocolatey):**

```bash
choco install k6
```

**Windows (via Scoop):**

```bash
scoop install k6
```

**macOS:**

```bash
brew install k6
```

**Linux:**

```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

## Running Tests

### 1. Smoke Test (Quick Verification)

Runs with minimal load to verify the script works correctly.

```bash
k6 run smoke-test.js
```

**Configuration:**

- Virtual Users: 1
- Duration: 30 seconds
- Purpose: Verify script functionality

---

### 2. Load Test (Normal Traffic Simulation)

Simulates normal user load with gradual ramp-up and ramp-down.

```bash
k6 run load-test.js
```

**Configuration:**

- Ramp up: 0 → 10 users (30s)
- Steady state: 10 users (1 minute)
- Ramp down: 10 → 0 users (30s)
- Purpose: Test system under normal conditions

**Thresholds:**

- 95% of requests < 500ms
- Error rate < 1%

---

### 3. Stress Test (High Load)

Tests system behavior under heavy load and finds breaking points.

```bash
k6 run stress-test.js
```

**Configuration:**

- Stage 1: 0 → 50 users (2 min)
- Stage 2: 50 → 100 users (3 min)
- Stage 3: 100 → 200 users (2 min)
- Stage 4: Stay at 200 users (3 min)
- Stage 5: 200 → 0 users (2 min)
- Purpose: Find system limits

**Thresholds:**

- 95% of requests < 800ms
- Error rate < 5%

---

## Understanding k6 Output

### Key Metrics

```
checks.........................: 100.00% ✓ 150  ✗ 0
data_received..................: 1.2 MB  20 kB/s
data_sent......................: 45 kB   750 B/s
http_req_blocked...............: avg=2.5ms   min=0s    med=1ms    max=150ms  p(90)=5ms   p(95)=8ms
http_req_connecting............: avg=1.2ms   min=0s    med=0s     max=50ms   p(90)=2ms   p(95)=3ms
http_req_duration..............: avg=120ms   min=80ms  med=110ms  max=200ms  p(90)=150ms p(95)=180ms ✓
http_req_failed................: 0.00%   ✓ 0    ✗ 150
http_req_receiving.............: avg=1ms     min=0s    med=0.5ms  max=5ms    p(90)=2ms   p(95)=3ms
http_req_sending...............: avg=0.5ms   min=0s    med=0.3ms  max=2ms    p(90)=1ms   p(95)=1.5ms
http_req_tls_handshaking.......: avg=0s      min=0s    med=0s     max=0ms    p(90)=0s    p(95)=0s
http_req_waiting...............: avg=118ms   min=78ms  med=108ms  max=198ms  p(90)=148ms p(95)=178ms
http_reqs......................: 150     2.5/s
iteration_duration.............: avg=5.1s    min=5s    med=5.05s  max=5.2s   p(90)=5.15s p(95)=5.18s
iterations.....................: 30      0.5/s
vus............................: 1       min=1  max=10
vus_max........................: 10      min=10 max=10
```

**Important Metrics:**

- ✅ **checks**: Percentage of passed assertions
- ⏱️ **http_req_duration**: Response time (check p95, p99)
- ❌ **http_req_failed**: Error rate
- 📊 **http_reqs**: Total number of requests
- 👥 **vus**: Current virtual users

---

## Test Scenarios Covered

### Load Test Operations

1. ✅ GET list of users (paginated)
2. ✅ GET single user by ID
3. ✅ POST create new user
4. ✅ PUT update user
5. ✅ DELETE user

### Performance Checks

- Response status codes
- Response time thresholds
- Data validation (JSON structure)
- Error rate monitoring

---

## Advanced Options

### Run with custom parameters

```bash
# Custom virtual users and duration
k6 run --vus 20 --duration 1m load-test.js

# Output to JSON
k6 run --out json=results.json load-test.js

# Run with specific stages
k6 run --stage 30s:10,1m:20,30s:0 load-test.js
```

### Cloud execution (requires k6 cloud account)

```bash
k6 cloud load-test.js
```

---

## Best Practices

1. **Start with smoke test** - Always verify your script works before load testing
2. **Gradual load increase** - Ramp up slowly to identify bottlenecks
3. **Monitor thresholds** - Set realistic performance targets
4. **Use sleep()** - Add think time between requests to simulate real users
5. **Randomize data** - Vary request parameters for realistic scenarios

---

## Interpreting Results

### ✅ Healthy System

- Checks: 100% passing
- http_req_duration p95 < threshold
- http_req_failed: 0%
- Stable response times

### ⚠️ Warning Signs

- Checks: 90-95% passing
- Increasing response times
- http_req_failed: 1-5%
- High variability in metrics

### 🔴 System Overload

- Checks: <90% passing
- http_req_duration p95 > 2x threshold
- http_req_failed: >5%
- Timeouts occurring

---

## Next Steps

1. Customize tests for your specific API
2. Add more realistic scenarios
3. Set up CI/CD integration
4. Configure cloud monitoring
5. Create performance dashboards
