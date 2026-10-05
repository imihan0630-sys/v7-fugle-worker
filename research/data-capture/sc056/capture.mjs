import { parseArgs } from 'node:util';
import { captureMonth } from './browser.mjs';
import { archiveCapture } from './archive.mjs';

const { values } = parseArgs({ options: { month: { type: 'string' }, out: { type: 'string', default: 'captures' } } });
try {
  const { receipt, raw } = await captureMonth(values.month);
  const directory = await archiveCapture(values.out, receipt, raw);
  console.log(JSON.stringify({ status: receipt.status, directory, semanticFingerprint: receipt.semanticFingerprint }));
} catch (error) {
  console.error(JSON.stringify({ status: 'CAPTURE_FAILED', error: error.message }));
  process.exitCode = 1;
}
