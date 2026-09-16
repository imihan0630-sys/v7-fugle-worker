import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const worker = await readFile(process.env.V7_TEST_WORKER_PATH || 'Worker.js', 'utf8');
const expectedVersion = worker.match(/const VERSION = "([^"]+)";/)?.[1];
assert.ok(expectedVersion, 'Worker runtime version must be explicit');
const origin = 'https://fugle-test.imihan0630.workers.dev';
let runtime;
// Cloudflare accepted uploads can propagate beyond the original 15-second window.
// Retry only read-only checks; never repeat the code upload here.
for (let attempt = 0; attempt < 24; attempt++) {
  try {
    const response = await fetch(origin + '/api/version?deploymentCheck=' + attempt, {cache:'no-store', signal:AbortSignal.timeout(10000)});
    assert.ok(response.status !== 401 && response.status !== 403, 'Deployment verification requires access; do not retry denied requests');
    if (response.ok) runtime = await response.json();
    if (runtime?.version === expectedVersion) break;
  } catch (error) {
    if (error instanceof assert.AssertionError) throw error;
  }
  if (attempt < 23) await new Promise(resolve => setTimeout(resolve, 5000));
}
assert.equal(runtime?.version, expectedVersion, 'Accepted upload is not proof of correct deployed version');
assert.equal(runtime.bindings.kv, true, 'Existing KV binding must be retained');
assert.equal(runtime.bindings.d1, true, 'Existing D1 binding must be retained');
if (process.env.V7_DEPLOY_BASELINE_PATH) {
  const baseline = JSON.parse(await readFile(process.env.V7_DEPLOY_BASELINE_PATH,'utf8'));
  assert.equal(runtime.testMode, baseline.testMode, 'Deployment must not alter TEST_MODE');
  const response = await fetch(origin + '/?format=json', {signal:AbortSignal.timeout(10000)});
  assert.equal(response.ok, true);
  const after = await response.json();
  assert.equal(after.configUpdatedAt, baseline.configUpdatedAt, 'Code deployment must not overwrite stock configuration');
  const actualTargets=(after.plannedStocks || after.stocks || []).map(x=>x.symbol).sort();
  const priorTargets=baseline.plannedSymbols || (baseline.plannedStocks || baseline.stocks || []).map(x=>x.symbol).sort();
  assert.deepEqual(actualTargets,priorTargets,'Actual planned monitoring targets must be preserved');
}
console.log('PASS: deployed runtime version, bindings, mode and existing monitoring configuration');
console.log('Readiness flags:', JSON.stringify(runtime.readiness));
console.log('This read-only check does not verify a real after-market scan or phone delivery.');
