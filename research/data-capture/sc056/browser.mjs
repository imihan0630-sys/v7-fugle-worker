import { chromium } from 'playwright';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { SOURCE_URL, SOURCE_INDEX_URL, VERSION, TABLE_ID, PRODUCTS, METRICS, labelFor, rocMonth, taipeiTime, invariant } from './contract.mjs';
import { readTable, parseTable, sha256, jsonHash } from './parser.mjs';

const require = createRequire(import.meta.url);
const fields = {
  ddlPeriod: ['M', '月'], ddlDateKind: ['民國', '民國'],
  ddlValueKind: ['V', '統計值'], ddlQueryKind: ['R', '統計表'],
};

// ASP.NET uses POST for this public read-only query. No arbitrary POST, form
// action, script-invented API, download, login, or source mutation is allowed.
export function isReadOnlyRequest(method, url, body, expectedQuery) {
  const u = new URL(url);
  if (u.protocol !== 'https:' || u.hostname !== 'service.moea.gov.tw' || u.port) return false;
  if (method === 'GET') return true;
  if (method !== 'POST' || url !== SOURCE_URL || !expectedQuery) return false;
  const params = new URLSearchParams(body ?? '');
  const prefix = 'ctl00$ContentPlaceHolder1$';
  if (params.get(prefix + 'btnQuery') !== '查詢' || params.get('__EVENTTARGET') || params.get('__EVENTARGUMENT')) return false;
  if ([...params.keys()].some(k => /\$btn/.test(k) && k !== prefix + 'btnQuery')) return false;
  for (const [id, value] of Object.entries(expectedQuery.selectValues)) {
    if (params.get(prefix + id) !== value || params.getAll(prefix + id).length !== 1) return false;
  }
  const checkboxes = [...params.keys()].filter(k => /CheckBox$/.test(k)).sort();
  return JSON.stringify(checkboxes) === JSON.stringify(expectedQuery.checkboxNames.slice().sort())
    && checkboxes.every(k => params.getAll(k).length === 1 && params.get(k) === 'on');
}

async function selected(page, prefix, ids) {
  const values = {};
  for (const id of ids) {
    const control = page.locator(`#ContentPlaceHolder1_${prefix}${id}`);
    invariant(await control.count() === 1, `missing/duplicate control ${prefix}${id}`);
    values[id] = await control.evaluate(e => ({ value: e.value, label: e.selectedOptions[0]?.textContent }));
  }
  return values;
}

export async function captureMonth(month) {
  const roc = rocMonth(month);
  const startedAt = taipeiTime();
  const browser = await chromium.launch({
    headless: true,
    // Respect the managed environment proxy; normal CI has no proxy variable.
    proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined,
  });
  const context = await browser.newContext({ locale: 'zh-TW', timezoneId: 'Asia/Taipei', serviceWorkers: 'block' });
  const requests = [];
  const violations = [];
  let expectedQuery;
  let queryPosts = 0;
  try {
    await context.route('**/*', async route => {
      const r = route.request();
      if (!isReadOnlyRequest(r.method(), r.url(), r.postData(), expectedQuery)
          || (r.method() === 'POST' && ++queryPosts > 1)) {
        violations.push(`${r.method()} ${new URL(r.url()).origin}${new URL(r.url()).pathname}`);
        return route.abort('blockedbyclient');
      }
      // Do not store opaque session/viewstate values or cookies.
      requests.push({ method: r.method(), url: r.url() });
      return route.continue();
    });
    const page = await context.newPage();
    page.setDefaultTimeout(20000);
    page.on('dialog', async d => { violations.push(`source dialog: ${d.message()}`); await d.dismiss(); });
    page.on('popup', async p => { violations.push('unexpected popup'); await p.close(); });
    const response = await page.goto(SOURCE_URL, { waitUntil: 'networkidle', timeout: 90000 });
    invariant(response?.ok() && page.url() === SOURCE_URL, 'source navigation failed/redirected');
    invariant(await page.locator('input[type=checkbox]:checked').count() === 0, 'unexpected default selections');

    const controls = await selected(page, '', [...Object.keys(fields), 'ddlDateBeg', 'ddlDateEnd']);
    for (const [id, [value, label]] of Object.entries(fields)) {
      invariant(controls[id].value === value && controls[id].label === label, `default query semantics changed: ${id}`);
    }
    for (const id of ['ddlDateBeg', 'ddlDateEnd']) {
      const control = page.locator(`#ContentPlaceHolder1_${id}`);
      invariant(await control.locator(`option[value="${roc}"]`).count() === 1, `month unavailable: ${month}`);
      await control.selectOption(roc);
    }
    const checkboxNames = [];
    const checkboxes = [];
    for (const label of [...METRICS, ...PRODUCTS.map(labelFor)]) {
      const text = page.getByText(label, { exact: true });
      invariant(await text.count() === 1, `missing/ambiguous selection: ${label}`);
      const box = text.locator('..').locator('input[type=checkbox]');
      invariant(await box.count() === 1, `checkbox structure changed: ${label}`);
      await box.check();
      invariant(await box.isChecked(), `selection did not persist: ${label}`);
      const name = await box.getAttribute('name');
      checkboxNames.push(name);
      checkboxes.push({ label, name });
    }
    invariant(await page.locator('input[type=checkbox]:checked').count() === 5, 'unexpected extra checkbox selection');
    const before = await selected(page, '', [...Object.keys(fields), 'ddlDateBeg', 'ddlDateEnd']);
    expectedQuery = { selectValues: Object.fromEntries(Object.entries(before).map(([id, s]) => [id, s.value])), checkboxNames };
    const submit = page.getByRole('button', { name: '查詢', exact: true });
    invariant(await submit.count() === 1, 'query button changed');
    const [queryResponse] = await Promise.all([
      page.waitForResponse(r => r.request().method() === 'POST' && r.url() === SOURCE_URL, { timeout: 90000 }),
      submit.click(),
    ]);
    invariant(queryResponse.ok(), `query response HTTP ${queryResponse.status()}`);
    await page.locator(`#${TABLE_ID}`).waitFor({ state: 'visible', timeout: 90000 });
    invariant(violations.length === 0 && queryPosts === 1 && page.url() === SOURCE_URL, `read-only guard: ${violations.join('; ')}`);
    const report = await selected(page, 'ddlReport', ['Period', 'DateKind', 'DateBeg', 'DateEnd', 'ValueKind']);
    for (const [id, expected] of Object.entries({ Period: 'M', DateKind: '民國', DateBeg: roc, DateEnd: roc, ValueKind: 'V' })) {
      invariant(report[id].value === expected, `report control mismatch: ${id}`);
    }
    const snapshot = await readTable(page);
    const records = parseTable(snapshot, month);
    const pageText = await page.locator('body').innerText();
    // This verified surface exposes no publication clock. A newly introduced
    // clock needs explicit label/scope validation, never an inferred month date.
    invariant(!/(?:發布日期|發布時間|公告日期)\s*[:：]/.test(pageText), 'new publication clock requires scoped parser review');
    const capturedAt = taipeiTime();
    const semantic = {
      sourceUrl: SOURCE_URL, referenceMonth: month,
      selectedControls: before, selectedItems: checkboxes.map(c => c.label),
      reportControls: report, records,
    };
    let gitCommit = 'UNKNOWN';
    try { gitCommit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch {}
    const receipt = {
      schemaVersion: VERSION, collectorVersion: VERSION, parserVersion: VERSION,
      status: records.every(r => r.productionValue !== 'UNKNOWN' && r.inventoryValue !== 'UNKNOWN') ? 'CAPTURED' : 'CAPTURED_WITH_UNKNOWN',
      ...semantic, semanticFingerprint: jsonHash(semantic),
      sourceIndexUrl: SOURCE_INDEX_URL,
      sourceLineage: 'OFFICIAL_SURVEY_INDEX_PRODUCT_STATISTICS_LINK_TO_VISIBLE_FORM_AND_RESULT',
      startedAt, capturedAt, capturedAtTimezone: 'Asia/Taipei',
      sourcePublishedAt: 'UNKNOWN', sourcePublishedAtReason: 'NO_RECORD_PUBLICATION_CLOCK_EXPOSED_IN_VERIFIED_QUERY',
      knownAt: capturedAt, historicalFirstPublicationProven: false,
      clockPolicy: 'CAPTURE_TIME_ONLY; NEVER_BACKDATE_TO_REFERENCE_MONTH_OR_ANNUAL_REPORT',
      rawResultSha256: sha256(snapshot.html), rawPageTextSha256: sha256(pageText),
      playwrightVersion: require('playwright/package.json').version,
      chromiumVersion: browser.version(), gitCommit,
      readOnlyAudit: { queryPosts, selectedCheckboxes: checkboxes, requests, violations },
      researchOnly: true, formalCoreChanged: false, stockOutcomesOpened: false,
    };
    return { receipt, raw: { html: snapshot.html, snapshot: { rows: snapshot.rows }, pageText } };
  } finally {
    await context.close();
    await browser.close();
  }
}
