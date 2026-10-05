import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { VERSION, invariant } from './contract.mjs';
import { sha256 } from './parser.mjs';

export async function archiveCapture(root, receipt, raw) {
  const parent = resolve(root, receipt.capturedAt.slice(0, 10), `v${VERSION}`);
  await mkdir(parent, { recursive: true });
  const directory = join(parent, `${receipt.capturedAt.replace(/[:+.]/g, '-')}-${randomUUID()}`);
  await mkdir(directory); // Exclusive directory, never reuse or overwrite a prior vintage.
  const files = {
    'receipt.json': JSON.stringify(receipt, null, 2) + '\n',
    'result.html': raw.html,
    'result-table.json': JSON.stringify(raw.snapshot, null, 2) + '\n',
    'result-page.txt': raw.pageText,
  };
  const manifest = {};
  for (const [name, data] of Object.entries(files)) {
    await writeFile(join(directory, name), data, { flag: 'wx' });
    manifest[name] = sha256(data);
  }
  await writeFile(join(directory, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx' });
  await verifyArchive(directory);
  return directory;
}

export async function verifyArchive(directory) {
  const manifest = JSON.parse(await readFile(join(directory, 'manifest.json'), 'utf8'));
  const expected = ['receipt.json', 'result.html', 'result-table.json', 'result-page.txt'];
  invariant(JSON.stringify(Object.keys(manifest).sort()) === JSON.stringify(expected.sort()), 'archive manifest file set changed');
  for (const [name, digest] of Object.entries(manifest)) {
    invariant(sha256(await readFile(join(directory, name))) === digest, `archive readback mismatch: ${name}`);
  }
  return JSON.parse(await readFile(join(directory, 'receipt.json'), 'utf8'));
}
