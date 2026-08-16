/*
Standalone Client Socket Benchmark Harness for ThinkNCollab PTY Streaming
Measures server dispatch latency over WebSocket transport.
Usage: node benchmark_harness.js <SERVER_URL> <VIEWERS> <RUNS>
 */

const { io } = require('socket.io-client');
const { performance } = require('perf_hooks');

const serverUrl = process.argv[2] || 'http://127.0.0.1:3099/thinknsh';
const numViewers = parseInt(process.argv[3] || '10', 10);
const numRuns = parseInt(process.argv[4] || '100', 10);

async function runBenchmark() {
  console.log(`Connecting owner and ${numViewers} viewers to ${serverUrl}...`);

  const owner = io(serverUrl, { transports: ['websocket'], forceNew: true });
  await new Promise((res) => owner.on('connect', res));
  owner.authenticated = true;
  owner.shellUser = 'bench_owner';

  const startPromise = new Promise((res) => owner.once('terminal:share:started', res));
  owner.emit('terminal:share:start', { roomId: 'room_bench' });
  const { sessionId } = await startPromise;

  const viewers = [];
  for (let i = 0; i < numViewers; i++) {
    const v = io(serverUrl, { transports: ['websocket'], forceNew: true });
    await new Promise((res) => v.on('connect', res));
    v.emit('terminal:join', { sessionId, userId: `v_${i}`, userName: `Viewer ${i}` });
    viewers.push(v);
  }

  const payload = 'BENCHMARK_STDOUT_LINE_PAYLOAD\n'.repeat(5);
  const latencies = [];

  for (let r = 0; r < numRuns; r++) {
    const t0 = performance.now();
    const p = Promise.all(
      viewers.map(
        (v) =>
          new Promise((res) => {
            v.once('terminal:output', () => res(performance.now() - t0));
          })
      )
    );

    owner.emit('terminal:output', { sessionId, data: payload });
    const res = await p;
    latencies.push(Math.max(...res));
  }

  const sum = latencies.reduce((a, b) => a + b, 0);
  const mean = sum / numRuns;

  console.log(`Results (${numViewers} viewers, ${numRuns} runs):`);
  console.log(`Mean Latency: ${mean.toFixed(3)} ms`);
  console.log(`Min: ${Math.min(...latencies).toFixed(3)} ms, Max: ${Math.max(...latencies).toFixed(3)} ms`);

  owner.disconnect();
  viewers.forEach((v) => v.disconnect());
  process.exit(0);
}

runBenchmark();
