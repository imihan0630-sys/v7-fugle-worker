// Original V8 selector SOURCE topology, not a live formal selection.
import {createHash} from "node:crypto";
import {readFile} from "node:fs/promises";
import {runInNewContext} from "node:vm";
export const SCHEMA="SYSTEM1_P0_EPS_QUARANTINE_ORIGINAL_V8_PARITY_V0_1";
const hash=x=>createHash("sha256").update(x).digest("hex");
const needles={
 reviewUniverse:"diagnostics.epsReviewUniverse=scored.map(item=>({symbol:item.symbol,name:item.name}));",
 dailyParent:"const scan = selectTomorrowCandidates(marketState, rows, { ...env, V7_TOTAL_CAPITAL: totalCapital, V7_OFFICIAL_INDEX:indexData }, marketDate);",
 missingBlock:"if(!dryRun && epsMissing.length) throw new Error",
 holdings:'throw new Error("OPEN_POSITION_PROTECTED:',
 thousandRank:"thousandScored.sort(rankFn);",
 thousandTop:"const thousandTop = thousandScored.slice(0, MAX_STOCKS_PER_POOL);",
 generalTop:"const generalTop = scored\n    .filter(item => (toNumber(item.close) || 0) < THOUSAND_STOCK_PRICE)\n    .slice(0, MAX_STOCKS_PER_POOL);",
 finalMerge:"const selected = [...generalTop, ...thousandTop].sort(rankFn);",
 scoring:"const result = scoreCandidate(f, sector);",
 epsSnapshot:'const quarterEps=await readQualitySnapshot(env,"QUARTER_EPS",marketDate);',
 parserBasis:'epsBasis:"MOPS合併綜合損益表直接公告單季EPS'
};
const rankClause=/  const rankFn = \(a, b\) =>\s*\n([\s\S]*?)\s*;\s*\n\s*scored\.sort\(rankFn\);/g;
const expectedRank=[
 "b.rewardPerRisk - a.rewardPerRisk || b.priorityScore - a.priorityScore ||",
 "    b.setupQuality - a.setupQuality || b.sectorFlow - a.sectorFlow || b.relativeStrength - a.relativeStrength"
].join("\n");
const count=(s,needle)=>s.split(needle).length-1;
const failed=(why,digest=null)=>({
 schema:SCHEMA,status:"SOURCE_PARITY_NOT_ESTABLISHED",reason:why,
 originalWorkerSha256:digest,liveSelectionValidated:false,
 originalD1Readback:false,pitValidated:false,canTrade:false,workerChanged:false
});
export function verifyOriginalV8SourceTopology(source){
 if(typeof source!=="string"||source.length<200000||source.length>400000)
  return failed("WORKER_SOURCE_LENGTH_UNSUPPORTED");
 const digest=hash(source);
 for(const [key,needle] of Object.entries(needles)){
  if(count(source,needle)!==(key==="scoring"?2:1))
   return failed("ANCHOR_COUNT_MISMATCH_"+key,digest);
 }
 const m=[...source.matchAll(rankClause)];
 if(m.length!==1||m[0][1].trim()!==expectedRank)
  return failed("ORIGINAL_RR_FIRST_RANK_UNVERIFIED",digest);
 const selectionStart=source.indexOf("function selectTomorrowCandidates(");
 const selectionEnd=source.indexOf("function buildIndependentPoolPreview(",selectionStart);
 const dailyStart=source.indexOf("async function runAfterMarketScanCore(");
 const dailyEnd=source.indexOf("async function ",dailyStart+40);
 if(selectionStart<0||selectionEnd<=selectionStart||dailyStart<0)
  return failed("BOUNDARIES_NOT_FOUND",digest);
 const selector=source.slice(selectionStart,selectionEnd);
 const daily=source.slice(dailyStart,dailyEnd<0?source.length:dailyEnd);
 for(const n of ["reviewUniverse","thousandRank","thousandTop","generalTop","finalMerge"])
  if(!selector.includes(needles[n]))return failed("SELECTOR_SITE_MISSING_"+n,digest);
 for(const n of ["dailyParent","epsSnapshot","missingBlock","holdings"])
  if(!daily.includes(needles[n]))return failed("DAILY_GUARD_MISSING_"+n,digest);
 const sequence=["reviewUniverse","thousandRank","thousandTop","generalTop","finalMerge"].map(n=>selector.indexOf(needles[n]));
 if(sequence.some((x,i)=>i>0&&x<=sequence[i-1]))
  return failed("QUOTA_INSERTION_ORDER_CHANGED",digest);
 if(!source.slice(selectionStart,selectionEnd).includes("diagnostics.finalPoolMerge = {"))
  return failed("FINAL_POOL_DIAGNOSTIC_MISSING",digest);
 return {schema:SCHEMA,status:"EXACT_ORIGINAL_SOURCE_TOPOLOGY_PASS",
  originalWorkerSha256:digest,selectorSha256:hash(selector),
  originalRankComparatorSha256:hash(m[0][1].trim()),
  originalRanking:["rewardPerRisk","priorityScore","setupQuality","sectorFlow","relativeStrength"],
  originalScoringLoops:2,perPoolMaximum:3,
  postScorePreQuotaInsertionLocationVerified:true,
  noSourceRewrite:true,holdingsGuardPresent:true,originalEpsFailureStillPresent:true,
  actualLiveSelectionValidated:false,originalD1Readback:false,pitValidated:false,canTrade:false};
}
export function rankWithExactOriginalComparator(source,rows){
 const r=verifyOriginalV8SourceTopology(source);
 if(r.status!=="EXACT_ORIGINAL_SOURCE_TOPOLOGY_PASS")throw Error("ORIGINAL_V8_SOURCE_REJECTED");
 if(!Array.isArray(rows)||rows.length>200||rows.some(x=>!x||typeof x!=="object"||
   !["rewardPerRisk","priorityScore","setupQuality","sectorFlow","relativeStrength"].every(k=>Number.isFinite(x[k]))))
  throw Error("RANK_ROWS_INVALID");
 // Code is a constant built from exact-verified production comparator only.
 const f=runInNewContext("(a,b)=>b.rewardPerRisk-a.rewardPerRisk||b.priorityScore-a.priorityScore||b.setupQuality-a.setupQuality||b.sectorFlow-a.sectorFlow||b.relativeStrength-a.relativeStrength",{}, {timeout:500});
 return [...rows].sort((a,b)=>f(a,b));
}
export const verifyMainWorker=async()=>verifyOriginalV8SourceTopology(await readFile("Worker.js","utf8"));
