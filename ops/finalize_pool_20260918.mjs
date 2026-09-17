const base = process.env.V7_BASE_URL || 'https://fugle-test.imihan0630.workers.dev';
const token = process.env.V7_ADMIN_TOKEN;
if (!token) throw new Error('Missing V7_ADMIN_TOKEN');

const stocks = [
  {
    formalClose: 1485, closeDate: '2026-09-17', planDate: '2026-09-18',
    enabled: true, symbol: '3491', name: '昇達科', mode: 'MOMENTUM',
    buyLow: 1490, buyHigh: 1515, breakout: 1510, maxChase: 1550,
    stop: 1440, profitCheck: 1570, sourceRank: 1, channel: 'B', signalLevel: 'A',
    priorityScore: 78, rewardRisk: 1.8, sectorFlow: 0, relativeStrength: 0,
    allocationRatio: 17.5, totalAllocation: 35000, firstAmount: 21000, secondAmount: 14000,
    firstShares: 13, secondShares: 9, totalShares: 22,
    firstCondition: 'B突破後承接：先確認有效站上1510；不追第一段，等待回測1490～1515守住，完整15分K量縮不破低，下一根轉強才第一筆',
    secondCondition: '第一筆後1510附近突破區持續守住，第二次回測不破或再次轉強，完整15分K確認後才加碼',
    selectedReason: 'V7.5.30新版千元股池第一順位；9/17收1485；趨勢與投信籌碼較完整，但仍需1510突破後回踩確認，不代表開盤直接買',
    positionStage: 'NONE', averageCost: null, actualShares: null, firstEntryConfirmedAt: null,
    reduceAt: 1570, sellBelow: 1440, pushEnabled: true
  },
  {
    formalClose: 2010, closeDate: '2026-09-17', planDate: '2026-09-18',
    enabled: true, symbol: '3665', name: '貿聯-KY', mode: 'MOMENTUM',
    buyLow: 2030, buyHigh: 2065, breakout: 2055, maxChase: 2100,
    stop: 1960, profitCheck: 2120, sourceRank: 2, channel: 'B', signalLevel: 'A',
    priorityScore: 82, rewardRisk: 1.9, sectorFlow: 0, relativeStrength: 0,
    allocationRatio: 20, totalAllocation: 40000, firstAmount: 24000, secondAmount: 16000,
    firstShares: 11, secondShares: 7, totalShares: 18,
    firstCondition: 'B突破後承接：先確認站上2055～2085壓力區；不追第一段，等待回測2030～2065守住，完整15分K量縮不破低，下一根轉強才第一筆',
    secondCondition: '第一筆後突破區持續守住，第二次回測不破或再次轉強，完整15分K確認後才加碼',
    selectedReason: 'V7.5.30新版千元股池第二順位；9/17收2010；法人轉買且位置未過度追高；等待突破後回踩確認，不代表開盤直接買',
    positionStage: 'NONE', averageCost: null, actualShares: null, firstEntryConfirmedAt: null,
    reduceAt: 2120, sellBelow: 1960, pushEnabled: true
  },
  {
    formalClose: 3185, closeDate: '2026-09-17', planDate: '2026-09-18',
    enabled: true, symbol: '3017', name: '奇鋐', mode: 'MOMENTUM',
    buyLow: 3230, buyHigh: 3285, breakout: 3285, maxChase: 3350,
    stop: 3170, profitCheck: 3500, sourceRank: 3, channel: 'B', signalLevel: 'B',
    priorityScore: 0, rewardRisk: 1.87, sectorFlow: null, relativeStrength: null,
    allocationRatio: 17.5, totalAllocation: 35000, firstAmount: 21000, secondAmount: 14000,
    firstShares: 6, secondShares: 4, totalShares: 10,
    firstCondition: 'B轉強確認：先站回3230，再有效突破3285；不追第一段，等待回測3230～3285守住，完整15分K不再破低且下一根轉強才第一筆',
    secondCondition: '第一筆後3285突破區持續守住，第二次回測不破或再次轉強，完整15分K確認後才加碼',
    selectedReason: 'V7.5.30新版市場共識雷達3個獨立正向來源、共識分數65、+4；AI散熱主流，但9/17仍在短均線附近整理，只能等轉強確認；priorityScore未人工編造，保留0',
    positionStage: 'NONE', averageCost: null, actualShares: null, firstEntryConfirmedAt: null,
    reduceAt: 3500, sellBelow: 3170, pushEnabled: true
  }
];

const res = await fetch(base + '/api/config', {
  method: 'POST',
  headers: { 'x-admin-token': token, 'content-type': 'application/json' },
  body: JSON.stringify({ stocks })
});
const text = await res.text();
if (!res.ok) throw new Error('POST /api/config HTTP ' + res.status + ': ' + text);
const data = JSON.parse(text);
if (!data || Number(data.count) !== 3) throw new Error('Config write count mismatch: ' + text);

const verify = await fetch(base + '/?format=json', { cache: 'no-store' });
const verifyText = await verify.text();
if (!verify.ok) throw new Error('GET /?format=json HTTP ' + verify.status + ': ' + verifyText);
const page = JSON.parse(verifyText);
const planned = Array.isArray(page.plannedStocks) ? page.plannedStocks : [];
const got = planned.map(x=>String(x.symbol)).sort();
const expected = ['3017','3491','3665'].sort();
if (JSON.stringify(got)!==JSON.stringify(expected)) throw new Error('plannedStocks mismatch: ' + JSON.stringify(planned));
if (planned.some(s => s.planDate !== '2026-09-18')) throw new Error('Stale planDate remains: ' + JSON.stringify(planned));
console.log(JSON.stringify({ok:true,count:data.count,plannedStocks:planned},null,2));
