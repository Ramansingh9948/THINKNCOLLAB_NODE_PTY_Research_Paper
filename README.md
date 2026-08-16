# Empirical Benchmarking of Web-Native PTY Streaming & Dynamic Access Control

This repository contains the empirical datasets, standalone test harness, and hardware/software specifications for the paper:

**"Empirical Benchmarking of Web-Native Pseudo-Terminal (PTY) Streaming and Dynamic Access Control in Collaborative Software Engineering Environments"**

- **Author:** Raman Singh (Department of Computer Science & Engineering, ABES Engineering College, Ghaziabad, UP, India)
- **Platform Evaluated:** ThinkNCollab 

---

## Repository Contents

```text
.
├── IEEE_Research_Paper_ThinkNCollab_Master.pdf   # Main Research Paper Manuscript
├── IEEE_Research_Paper_ThinkNCollab_Master.docx  # MS Word Document Version
├── IEEE_Research_Paper_ThinkNCollab_Master.md    # Markdown Version
├── benchmark_data_raw.csv                        # 500 socket broadcast runs + 100 RBAC grant runs
├── aws_wan_benchmark_raw.csv                     # 20 public internet AWS EC2 WAN runs
├── benchmark_harness.js                          # Standalone client socket benchmark runner
├── environment_spec.json                         # Environment hardware & software specifications
└── README.md                                     # Reproducibility & dataset guide
```

---

## Measured Performance Summary

### 1. Broadcast Latency Scaling (N = 100 Runs per Tier)

| Concurrent Viewers | Mean Latency ± Std-Dev (ms) | Min (ms) | Max (ms) | Data Broadcast (KB) |
|---|---|---|---|---|
| **1 Viewer** | 0.099 ± 0.043 ms | 0.062 ms | 0.426 ms | 2.94 KB |
| **10 Viewers** | 0.176 ± 0.040 ms | 0.130 ms | 0.370 ms | 29.36 KB |
| **50 Viewers** | 0.427 ± 0.078 ms | 0.325 ms | 0.797 ms | 146.78 KB |
| **100 Viewers** | 0.652 ± 0.074 ms | 0.557 ms | 1.019 ms | 293.55 KB |
| **200 Viewers** | 1.102 ± 0.093 ms | 0.961 ms | 1.466 ms | 587.11 KB |

### 2. In-Memory RBAC Permission Dispatch Latency
- **Mean Dispatch Latency:** 0.035 ± 0.011 ms
- **Min:** 0.024 ms
- **Max:** 0.120 ms

### 3. Public Cloud WAN Benchmark (AWS EC2 Instance 13.201.46.152:3001)
- **Mean Public WAN RTT:** 159.13 ± 37.05 ms
- **Min RTT:** 109.79 ms
- **Max RTT (Peak Jitter):** 275.09 ms

---

## How to Reproduce Benchmarks

### Prerequisites
- Node.js v20+
- `socket.io-client` npm package

### Run Local Benchmark Harness
```bash
npm install socket.io-client
node benchmark_harness.js http://127.0.0.1:3099/thinknsh 10 100
```

---

## Data Availability & License

The empirical datasets and test harness script are released under the MIT License for open scientific reproducibility. The core multi-tenant backend application code is maintained separately under a commercial license.
