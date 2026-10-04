import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';
import { readTable, parseTable, jsonHash } from '../parser.mjs';
import { rocMonth, taipeiTime, SOURCE_URL } from '../contract.mjs';
import { isReadOnlyRequest } from '../browser.mjs';
import { archiveCapture, verifyArchive } from '../archive.mjs';

let browser, fixture;
before(async () => {
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.route('**/*', r => r.abort());
  await page.setContent(await readFile(new URL('fixtures/moea-2025-01.html', import.meta.url), 'utf8'));
  fixture = await readTable(page);
  await page.close();
});
after(async () => { await browser?.close(); });

test('official result DOM replays all six historical quantities with native codes and units', () => {
  const records = parseTable(fixture, '2025-01');
  assert.deepEqual(records.map(r => [r.productCode, r.sourceProductCode, r.productionValue, r.inventoryValue, r.displayedUnit]), [
    ['2433-020', '2433020', '6,843', '6,028', '公噸'],
    ['2630-010', '2630010', '26,780,035', '26,171,314', '平方呎'],
    ['2630-040', '2630040', '26,489,128', '21,208,038', '平方呎'],
  ]);
  assert.ok(records.every(r => r.sourcePublishedAt === 'UNKNOWN'));
  assert.equal(jsonHash(records), jsonHash(parseTable(structuredClone(fixture), '2025-01')));
});

for (const [name, mutate] of [
  ['wrong product code', s => { s.rows[1].cells[2].text = '(2433030)銅箔 (公噸)'; }],
  ['product name drift', s => { s.rows[1].cells[4].text = '(2630040)IC載板 (平方呎)'; }],
  ['unit drift', s => { s.rows[1].cells[5].text = '(2433020)銅箔 (公斤)'; }],
  ['wrong metric', s => { s.rows[0].cells[2].text = '生產值'; }],
  ['column order drift', s => { s.rows[1].cells.reverse(); }],
  ['wrong year', s => { s.rows[2].cells[0].text = '115年'; }],
  ['wrong month', s => { s.rows[2].cells[1].text = '2月'; }],
  ['merged data cell', s => { s.rows[2].cells[2].colSpan = 2; }],
  ['extra result month', s => { s.rows.push(structuredClone(s.rows[2])); }],
  ['missing result cell', s => { s.rows[2].cells.pop(); }],
  ['unknown quantity token', s => { s.rows[2].cells[2].text = 'secret'; }],
  ['wrong grouping', s => { s.rows[2].cells[2].text = '6,84'; }],
  ['extra header column', s => { s.rows[0].cells[2].colSpan = 4; }],
]) {
  test(`fail closed: ${name}`, () => {
    const changed = structuredClone(fixture);
    mutate(changed);
    assert.throws(() => parseTable(changed, '2025-01'), /SC056_DRIFT/);
  });
}

test('suppressed/blank quantities stay UNKNOWN; real zero and precision are preserved', () => {
  const changed = structuredClone(fixture);
  changed.rows[2].cells[2].text = ' ';
  changed.rows[2].cells[3].text = '--';
  changed.rows[2].cells[4].text = '0';
  changed.rows[2].cells[5].text = '6,028.00';
  const records = parseTable(changed, '2025-01');
  assert.equal(records[0].productionValue, 'UNKNOWN');
  assert.equal(records[0].production.raw, ' ');
  assert.equal(records[1].productionValue, 'UNKNOWN');
  assert.equal(records[2].productionValue, '0');
  assert.equal(records[0].inventoryValue, '6,028.00');
});

test('missing and duplicate original result tables fail instead of parsing visual clones', async () => {
  const page = await browser.newPage();
  await page.setContent('<table><tr><td>0</td></tr></table>');
  await assert.rejects(readTable(page), /exactly one/);
  await page.setContent(fixture.html + fixture.html);
  await assert.rejects(readTable(page), /exactly one/);
  await page.close();
});

test('strict month contract and explicit Taipei offset', () => {
  assert.equal(rocMonth('2025-01'), '11401');
  for (const month of [undefined, '', '2025-13', '2025-1', '2025-00', '2025-01;rm']) assert.throws(() => rocMonth(month));
  assert.equal(taipeiTime(new Date('2026-10-04T16:30:00Z')), '2026-10-05T00:30:00.000+08:00');
});

test('read-only policy permits only the exact visible query POST and official HTTPS GET', () => {
  const query = { selectValues: { ddlPeriod: 'M', ddlDateBeg: '11401', ddlDateEnd: '11401' }, checkboxNames: ['oneCheckBox', 'twoCheckBox'] };
  const body = new URLSearchParams({ 'ctl00$ContentPlaceHolder1$btnQuery': '查詢', __EVENTTARGET: '', oneCheckBox: 'on', twoCheckBox: 'on' });
  for (const [id, value] of Object.entries(query.selectValues)) body.set('ctl00$ContentPlaceHolder1$' + id, value);
  assert.equal(isReadOnlyRequest('GET', SOURCE_URL), true);
  assert.equal(isReadOnlyRequest('POST', SOURCE_URL, body.toString(), query), true);
  for (const method of ['PUT', 'DELETE', 'PATCH']) assert.equal(isReadOnlyRequest(method, SOURCE_URL, body.toString(), query), false);
  for (const url of ['https://example.com/', SOURCE_URL + '?action=save', SOURCE_URL.replace('https:', 'http:')]) {
    assert.equal(isReadOnlyRequest('POST', url, body.toString(), query), false);
  }
  assert.equal(isReadOnlyRequest('POST', SOURCE_URL, body.toString()), false);
  for (const [key, value] of [['__EVENTTARGET', 'delete'], ['extraCheckBox', 'on'], ['ctl00$ContentPlaceHolder1$ddlDateBeg', '11501'], ['ctl00$ContentPlaceHolder1$btnReset', '重新設定']]) {
    const bad = new URLSearchParams(body); bad.set(key, value);
    assert.equal(isReadOnlyRequest('POST', SOURCE_URL, bad.toString(), query), false);
  }
});

test('archives are append-only and readback detects altered evidence', async () => {
  const root = await mkdtemp(join(tmpdir(), 'sc056-archive-'));
  try {
    const receipt = { capturedAt: '2026-10-04T19:00:00.000+08:00', records: parseTable(fixture, '2025-01') };
    const raw = { html: fixture.html, snapshot: { rows: fixture.rows }, pageText: 'official fixture' };
    const first = await archiveCapture(root, receipt, raw);
    const second = await archiveCapture(root, receipt, raw);
    assert.notEqual(first, second);
    assert.deepEqual(await verifyArchive(first), receipt);
    await writeFile(join(second, 'result.html'), 'altered');
    await assert.rejects(verifyArchive(second), /readback mismatch/);
    assert.deepEqual(await verifyArchive(first), receipt);
  } finally { await rm(root, { recursive: true, force: true }); }
});
