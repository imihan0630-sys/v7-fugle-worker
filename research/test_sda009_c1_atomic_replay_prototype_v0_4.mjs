import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {replayCandidateLooV04} from './sda009_c1_atomic_replay_prototype_v0_4.mjs';
const row=(symbol,industry,ch,amt,h=60,a20=100)=>({symbol,industry,currentChangePercent:ch,currentTradeValue:amt,feature:{historyDays:h,avgAmount20:a20}});
const digest=rows=>createHash('sha256').update(rows.map(r=>`${r.symbol}|${r.industry}`).sort().join('\n')).digest('hex');
const membership=rows=>({classificationSchemeId:'SYSTEM1_RUNTIME_INDUSTRY_LABEL_V1',membershipVersion:'g1',membershipDigest:digest(rows)});
let n=0;
const ok=x=>{assert.ok(x);n++;}; const eq=(a,b)=>{assert.equal(a,b);n++;};

const base=[row('A','X',10,90),row('B','X',-2,110),row('C','Y',1,150)];
let r=replayCandidateLooV04({rows:base,candidateSymbol:'A',storedInclusive:{breadth:50,avgChange:4,amountVs20DayAverage:1,sectorScore:85},membership:membership(base)});
eq(r.state,'PASS'); eq(r.gateParity.state,'PASS'); eq(r.scoreParity.state,'PASS'); eq(r.gateEffect.gateFlip,true); eq(r.gateEffect.gateDirection,'SELF_PROMOTION'); eq(r.supportState,'SMALL_N_SENSITIVE'); ok(r.attribution.localSelfContribution>0); ok(r.attribution.maxNormalizerExternality!==0); eq(r.scoreEffectAuthorized,true); eq(r.rankSeatAllocationAuthorized,false); eq(r.priorityScoreDeltaFromSector,null); ok(Number.isFinite(r.structuralUnroundedSectorContributionDelta));

r=replayCandidateLooV04({rows:base,candidateSymbol:'A',storedInclusive:null,membership:membership(base)});
eq(r.state,'BLOCKED'); eq(r.blockers[0],'BLOCKED_GATE_PARITY_MISSING');

r=replayCandidateLooV04({rows:base,candidateSymbol:'A',storedInclusive:{breadth:99,avgChange:4,amountVs20DayAverage:1,sectorScore:85},membership:membership(base)});
eq(r.state,'BLOCKED'); eq(r.blockers[0],'BLOCKED_GATE_PARITY_MISMATCH');

r=replayCandidateLooV04({rows:base,candidateSymbol:'A',storedInclusive:{breadth:50,avgChange:4,amountVs20DayAverage:1},membership:membership(base)});
eq(r.state,'PASS'); eq(r.scoreParity.state,'BLOCKED_PRODUCTION_SCORE_CAPTURE_MISSING'); eq(r.gateEffectAuthorized,true); eq(r.scoreEffectAuthorized,false);

const sup=[row('A','X',-2,100),row('B','X',1,100),row('C','X',-2,100),row('D','Y',1,300)];
r=replayCandidateLooV04({rows:sup,candidateSymbol:'A',storedInclusive:{breadth:100/3,avgChange:-1,amountVs20DayAverage:1},membership:membership(sup)});
eq(r.state,'PASS'); eq(r.gateEffect.gateFlip,true); eq(r.gateEffect.gateDirection,'SELF_SUPPRESSION');

const zero=[row('A','X',1,10),row('B','Y',1,20)];
r=replayCandidateLooV04({rows:zero,candidateSymbol:'A',storedInclusive:{breadth:100,avgChange:1,amountVs20DayAverage:0.1},membership:membership(zero)});
eq(r.state,'UNKNOWN'); eq(r.supportState,'ZERO_PEERS');

r=replayCandidateLooV04({rows:base,candidateSymbol:'A',storedInclusive:{breadth:50,avgChange:4,amountVs20DayAverage:1},membership:{...membership(base),membershipDigest:'bad'}});
eq(r.state,'BLOCKED'); ok(r.blockers.includes('MEMBERSHIP_DIGEST_MISMATCH'));

const missing=[{symbol:'A',industry:'X',currentChangePercent:1,feature:{historyDays:60,avgAmount20:100}},row('B','X',1,10)];
r=replayCandidateLooV04({rows:missing,candidateSymbol:'A',storedInclusive:{breadth:100,avgChange:1,amountVs20DayAverage:0.05},membership:membership(missing)});
eq(r.state,'BLOCKED'); ok(r.blockers.some(x=>x.startsWith('MISSING_CURRENT_TRADE_VALUE_CAPTURE')));

console.log(JSON.stringify({result:'PASS',assertions:n},null,2));
