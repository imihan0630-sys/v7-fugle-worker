import { parseArgs } from 'node:util';
import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { captureMonth } from './browser.mjs';
import { archiveCapture, verifyArchive } from './archive.mjs';
import { invariant, taipeiTime } from './contract.mjs';

const { values } = parseArgs({ options: { month: { type: 'string', default: '2025-01' }, out: { type: 'string', default: 'captures' } } });
const startedAt = taipeiTime();
const runs = [];
let outcome;
try {
  for (let i = 0; i < 2; i++) {
    const { receipt, raw } = await captureMonth(values.month);
    const directory = await archiveCapture(values.out, receipt, raw);
    const readback = await verifyArchive(directory);
    invariant(readback.semanticFingerprint === receipt.semanticFingerprint, 'receipt readback failed');
    runs.push({ directory: directory.slice(resolve(values.out).length + 1), semanticFingerprint: receipt.semanticFingerprint, rawResultSha256: receipt.rawResultSha256, capturedAt: receipt.capturedAt });
    invariant(receipt.status === 'CAPTURED', 'live smoke requires reported quantities for all three products');
    if (values.month === '2025-01') {
      const expected = [['6,843', '6,028'], ['26,780,035', '26,171,314'], ['26,489,128', '21,208,038']];
      invariant(JSON.stringify(receipt.records.map(r => [r.productionValue, r.inventoryValue])) === JSON.stringify(expected), 'historical replay changed: retain capture and review source revision');
    }
  }
  invariant(runs[0].semanticFingerprint === runs[1].semanticFingerprint, 'semantic source state changed between runs');
  outcome = { status: 'PASS', historicalReplay: values.month === '2025-01' ? 'MATCH_SC055_ANNUAL_REPORT' : 'NOT_BASELINE_MONTH', semanticRepeatability: true, archiveReadback: true };
} catch (error) {
  outcome = { status: 'FAIL', error: error.message };
  process.exitCode = 1;
}
await mkdir(values.out, { recursive: true });
const result = { ...outcome, referenceMonth: values.month, startedAt, completedAt: taipeiTime(), runs, productionChanged: false };
const summary = join(values.out, `smoke-${startedAt.replace(/[:+.]/g, '-')}-${randomUUID()}.json`);
await writeFile(summary, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ ...result, summary }, null, 2));
