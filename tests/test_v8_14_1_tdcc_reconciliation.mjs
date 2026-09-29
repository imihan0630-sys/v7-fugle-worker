import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const source=await readFile(process.env.V7_TEST_WORKER_PATH || new URL('../Worker.js',import.meta.url),'utf8');
const api=await import('data:text/javascript;base64,'+Buffer.from(source+'\nexport {validateOfficialQualityData};').toString('base64'));

const date='2026-09-29';
const fields=['資料日期','證券代號','持股分級','股數','占集保庫存數比例%'];
const rows=[];
for(let n=1000;n<2600;n++) {
  const symbol=String(n);
  const total=1_000_000;
  const adjustment=3_000;
  // 15 tiers sum to total + adjustment. Each displayed ratio is independently rounded to 2 decimals.
  const tierShares=Array(15).fill(66_867);
  tierShares[14]=66_862;
  for(let g=1;g<=15;g++) rows.push(['20260924',symbol,String(g),String(tierShares[g-1]),(tierShares[g-1]/total*100).toFixed(2)]);
  rows.push(['20260924',symbol,'16',String(adjustment),(adjustment/total*100).toFixed(2)]);
  rows.push(['20260924',symbol,'17',String(total),'100.00']);
}
const body={kind:'TDCC',sourceUrl:'https://opendata.tdcc.com.tw/getOD.ashx?id=1-5',fields,rows};
const ok=api.validateOfficialQualityData(body,date);
assert.equal(ok.count,1600);
assert.equal(ok.asOfDate,'2026-09-24');
assert.equal(ok.stocks['1000'].chipConcentration,26.75);
assert.equal(ok.stocks['1000'].holdersOver1000LotsRatio,6.69);

// Old percentage-sum rule would reject this valid rounded dataset: 15*~6.69% + grade16 0.30% > 100.2%.
const displayedSum=rows.slice(0,17).filter((_,i)=>i<16).reduce((s,row)=>s+Number(row[4]),0);
assert.ok(displayedSum>100.2);

// One-share adjustment corruption must fail exact share reconciliation.
const badShares=structuredClone(body);
const first16=badShares.rows.find(row=>row[1]==='1000' && row[2]==='16');
first16[3]=String(Number(first16[3])+1);
assert.throws(()=>api.validateOfficialQualityData(badShares,date),/股數與差異數調整無法勾稽/);

// A material percentage inconsistency must still fail; this is not a loose bypass.
const badRatio=structuredClone(body);
const first1=badRatio.rows.find(row=>row[1]==='1000' && row[2]==='1');
first1[4]=(Number(first1[4])+0.02).toFixed(2);
assert.throws(()=>api.validateOfficialQualityData(badRatio,date),/比例與股數不一致/);

console.log(JSON.stringify({ok:true,fixtureStocks:ok.count,displayedPercentSum:displayedSum,shareReconciliation:true,ratioCrossCheck:true}));
