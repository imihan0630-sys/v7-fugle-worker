const base = process.env.V7_BASE_URL || 'https://fugle-test.imihan0630.workers.dev';
const token = process.env.V7_ADMIN_TOKEN;
if (!token) throw new Error('Missing V7_ADMIN_TOKEN');

const res = await fetch(base + '/api/finalize', {
  method: 'POST',
  headers: { 'x-admin-token': token, 'content-type': 'application/json' }
});
const text = await res.text();
if (!res.ok) throw new Error('POST /api/finalize HTTP ' + res.status + ': ' + text);
const data = JSON.parse(text);
if (!data || data.ok !== true) throw new Error('Finalize failed: ' + text);

const verify = await fetch(base + '/?format=json', { cache: 'no-store' });
const verifyText = await verify.text();
if (!verify.ok) throw new Error('GET /?format=json HTTP ' + verify.status + ': ' + verifyText);
const page = JSON.parse(verifyText);
const planned = Array.isArray(page.plannedStocks) ? page.plannedStocks : [];
const today = '2026-09-18';
const stale = planned.filter(s => s.planDate && s.planDate !== today);
if (stale.length) throw new Error('Stale planDate remains: ' + JSON.stringify(stale.map(s=>({symbol:s.symbol,planDate:s.planDate}))));
console.log(JSON.stringify({
  ok: true,
  finalize: data,
  plannedStocks: planned.map(s => ({
    symbol: s.symbol,
    name: s.name,
    planDate: s.planDate,
    mode: s.mode,
    buyLow: s.buyLow,
    buyHigh: s.buyHigh,
    breakout: s.breakout,
    maxChase: s.maxChase,
    stop: s.stop,
    profitCheck: s.profitCheck,
    priorityScore: s.priorityScore,
    rewardRisk: s.rewardRisk,
    marketConsensusBonus: s.marketConsensusBonus
  }))
}, null, 2));
