import fs from 'node:fs';

const base = process.env.V7_BASE_URL || 'https://fugle-test.imihan0630.workers.dev';
const token = process.env.V7_ADMIN_TOKEN;
const file = process.env.V7_CONSENSUS_FILE || 'data/market-consensus.json';

if (!token) throw new Error('Missing V7_ADMIN_TOKEN');
if (!fs.existsSync(file)) throw new Error(`Missing consensus file: ${file}`);

const input = JSON.parse(fs.readFileSync(file, 'utf8'));
if (!/^\d{4}-\d{2}-\d{2}$/.test(String(input.marketDate || ''))) throw new Error('marketDate must be YYYY-MM-DD');
if (!Array.isArray(input.sources) || input.sources.length < 1) throw new Error('sources required');

const payload = {
  marketDate: input.marketDate,
  sources: input.sources.map(({ source, symbols }) => ({ source, symbols })),
  notes: input.notes || ''
};

const authHeaders = {
  'x-admin-token': token,
  'content-type': 'application/json'
};

const post = await fetch(`${base}/api/market-consensus`, {
  method: 'POST',
  headers: authHeaders,
  body: JSON.stringify(payload)
});
const postText = await post.text();
if (!post.ok) throw new Error(`POST /api/market-consensus HTTP ${post.status}: ${postText}`);
const result = JSON.parse(postText);
if (result.ok !== true || result.verified !== true) throw new Error(`Consensus write not verified: ${postText}`);

const read = await fetch(`${base}/api/market-consensus?marketDate=${encodeURIComponent(input.marketDate)}`, {
  headers: { 'x-admin-token': token }
});
const readText = await read.text();
if (!read.ok) throw new Error(`GET /api/market-consensus HTTP ${read.status}: ${readText}`);
const readback = JSON.parse(readText);
const bySymbol = readback?.reference?.bySymbol || {};

for (const [symbol, expected] of Object.entries(input.expected || {})) {
  const actual = bySymbol[symbol];
  if (!actual) throw new Error(`Missing expected consensus symbol ${symbol}`);
  if (Number(actual.sourceCount) !== Number(expected.sourceCount)) {
    throw new Error(`${symbol} sourceCount mismatch: ${actual.sourceCount} != ${expected.sourceCount}`);
  }
  if (Number(actual.bonus) !== Number(expected.bonus)) {
    throw new Error(`${symbol} bonus mismatch: ${actual.bonus} != ${expected.bonus}`);
  }
}

console.log(JSON.stringify({
  ok: true,
  marketDate: input.marketDate,
  sourceCount: result.sourceCount,
  symbolCount: result.symbolCount,
  verifiedSymbols: Object.keys(input.expected || {}),
  top: result.top
}, null, 2));
