import assert from 'node:assert/strict';
import {canonicalJcsJson,sha256HexUtf8} from './canonical_receipt_hash_v0_1.mjs';
import {evaluateSda009R3A1ReceiptV06,reconstructSectorProjectionFromC1V06} from './sda009_r3a1_acceptance_oracle_v0_6.mjs';

const hash=(domain,value)=>sha256HexUtf8(domain+'|'+canonicalJcsJson(value));
const rows=[
  {market:'TWSE',symbol:'A',industry:'X',currentChangePercent:10,currentTradeValue:90,feature:{historyDays:60,avgAmount20:100}},
  {market:'TWSE',symbol:'B',industry:'X',currentChangePercent:-2,currentTradeValue:110,feature:{historyDays:60,avgAmount20:100}},
  {market:'TPEX',symbol:'C',industry:'Y',currentChangePercent:1,currentTradeValue:150,feature:{historyDays:60,avgAmount20:100}}
];
const membership=rows.map(r=>({market:r.market,symbol:r.symbol,industry:r.industry})).sort((a,b)=>a.market.localeCompare(b.market)||a.symbol.localeCompare(b.symbol)||a.industry.localeCompare(b.industry));
const sectors=reconstructSectorProjectionFromC1V06(rows);
const header={
  generationId:'g1',sessionDate:'2026-10-07',populationN:rows.length,
  classificationSchemeId:'SYSTEM1_RUNTIME_INDUSTRY_LABEL_V1',
  membershipVersion:'v1',
  membershipDigest:await hash('SDA009_INDUSTRY_MEMBERSHIP_V0_1',membership),
  sectorDecisionStateProjection:sectors,
  sectorDecisionStateDigest:await hash('SDA009_SECTOR_DECISION_STATE_V0_1',sectors)
};
let n=0;const eq=(a,b)=>{assert.equal(a,b);n++;};const ok=x=>{assert.ok(x);n++;};
let r=await evaluateSda009R3A1ReceiptV06({header,rows});
eq(r.state,'PASS');eq(r.authorization.r3a1ParityPass,true);eq(r.authorization.candidateLooGateAuthorized,true);eq(r.authorization.candidateLooScoreAuthorized,true);eq(r.authorization.r3a2RankAuthorized,false);eq(r.exactNext,'SDA-009-R3A2');

r=await evaluateSda009R3A1ReceiptV06({header:{...header,membershipDigest:'bad'},rows});
eq(r.state,'BLOCKED');ok(r.blockers.includes('MEMBERSHIP_DIGEST_MISMATCH'));

r=await evaluateSda009R3A1ReceiptV06({header:{...header,sectorDecisionStateDigest:'bad'},rows});
eq(r.state,'BLOCKED');ok(r.blockers.includes('SECTOR_DECISION_DIGEST_MISMATCH'));

const badRows=rows.map(x=>({...x}));delete badRows[0].currentTradeValue;
r=await evaluateSda009R3A1ReceiptV06({header,rows:badRows});
eq(r.state,'BLOCKED');ok(r.blockers.some(x=>x.startsWith('MISSING_CURRENT_TRADE_VALUE')));

const badSector=sectors.map(x=>({...x}));badSector[0].breadth+=1;
const badHeader={...header,sectorDecisionStateProjection:badSector,sectorDecisionStateDigest:await hash('SDA009_SECTOR_DECISION_STATE_V0_1',badSector)};
r=await evaluateSda009R3A1ReceiptV06({header:badHeader,rows});
eq(r.state,'BLOCKED');ok(r.blockers.some(x=>x.startsWith('SECTOR_PARITY_MISMATCH')));

const unclassifiedRows=[...rows,{market:'TWSE',symbol:'D',industry:'未分類',currentChangePercent:0,currentTradeValue:10,feature:{historyDays:60,avgAmount20:20}}];
const uMembership=unclassifiedRows.map(r=>({market:r.market,symbol:r.symbol,industry:r.industry})).sort((a,b)=>a.market.localeCompare(b.market)||a.symbol.localeCompare(b.symbol)||a.industry.localeCompare(b.industry));
const uSectors=reconstructSectorProjectionFromC1V06(unclassifiedRows);
const uHeader={...header,populationN:unclassifiedRows.length,membershipDigest:await hash('SDA009_INDUSTRY_MEMBERSHIP_V0_1',uMembership),sectorDecisionStateProjection:uSectors,sectorDecisionStateDigest:await hash('SDA009_SECTOR_DECISION_STATE_V0_1',uSectors)};
r=await evaluateSda009R3A1ReceiptV06({header:uHeader,rows:unclassifiedRows});
eq(r.state,'PASS');eq(r.unclassified.state,'UNCLASSIFIED_PSEUDO_BUCKET_PRESENT');eq(r.unclassified.economicInterpretation,'FORBIDDEN');

const dup=[rows[0],rows[0],rows[2]];
r=await evaluateSda009R3A1ReceiptV06({header:{...header,populationN:3},rows:dup});
eq(r.state,'BLOCKED');ok(r.blockers.includes('DUPLICATE_SYMBOL'));

r=await evaluateSda009R3A1ReceiptV06({header:{...header,classificationSchemeId:'WRONG'},rows});
eq(r.state,'BLOCKED');ok(r.blockers.includes('CLASSIFICATION_SCHEME_MISMATCH'));

eq(sectors.length,2);ok(sectors.every(x=>Number.isFinite(x.score)));
console.log(JSON.stringify({result:'PASS',assertions:n},null,2));
