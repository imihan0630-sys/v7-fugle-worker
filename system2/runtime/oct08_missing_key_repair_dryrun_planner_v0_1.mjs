// DATA_LANE / CLASS A, offline reconciliation planning only. No database adapter.
import assert from "node:assert/strict";
import {createHash} from "node:crypto";

const MARKETS=Object.freeze(["TWSE","TPEX"]);
const DATES=Object.freeze([
 "2026-10-01","2026-10-02","2026-10-05",
 "2026-10-06","2026-10-07","2026-10-08",
]);
const COUNT_FIELDS=Object.freeze(["matched","missing","mismatched","multi"]);
const DISCREPANCY_STATES=Object.freeze({
 HOT_D1_KEY_ABSENT:"missing",
 HOT_D1_SOURCE_VALUES_MISMATCH:"mismatched",
 HOT_D1_RAW_MULTIVERSION:"multi",
});
const hash=value=>createHash("sha256").update(JSON.stringify(value)).digest("hex");
const key=(market,date)=>market+"|"+date;
function integer(value,field,{min=0,max=20000}={}){
 assert.ok(Number.isSafeInteger(value)&&value>=min&&value<=max,field+" invalid");
 return value;
}
function verifyCounts(c,denom,field){
 assert.ok(c&&typeof c==="object",field+" counts required");
 for(const name of COUNT_FIELDS)integer(c[name],field+"."+name);
 assert.equal(COUNT_FIELDS.reduce((n,name)=>n+c[name],0),denom,field+" denominator mismatch");
}

export function buildOct08MissingKeyRepairPlanOfflineV0_1({
 census,official,observedAt,
 maxKeysPerProposedBatch=50,
}={}){
 assert.equal(typeof observedAt,"string");
 assert.ok(/^\d{4}-\d{2}-\d{2}T/.test(observedAt)&&
  Number.isFinite(Date.parse(observedAt)),"observedAt is an actual UTC/offset timestamp");
 assert.ok(Date.parse(observedAt)>=Date.parse("2026-10-09T00:00:00Z"),
  "repair-plan review clock may not predate retrospective October source read");
 integer(maxKeysPerProposedBatch,"maxKeysPerProposedBatch",{min:1,max:50});

 assert.equal(official?.schemaVersion,
  "S2_20261008_LATEST_COMPLETED_SOURCE_RECEIPTS_PHYSICAL_ACCEPTANCE_V0_1");
 assert.equal(official?.verifiedRun?.runId,37878847039);
 assert.equal(official?.verifiedRun?.conclusion,"success");
 assert.equal(official?.verifiedRun?.headSha,
  "39ca8dce38fa675874074609fb32d9c44321e944");
 assert.equal(official?.cutoff,"2026-10-08");
 assert.deepEqual(official?.officialWindow?.dates,DATES);
 const receipts=official?.officialWindow?.samples;
 assert.ok(Array.isArray(receipts)&&receipts.length===12,
  "exact 12 frozen official original receipts required");
 const sourceByKey=new Map();
 for(const source of receipts){
  const k=key(source.market,source.marketDate);
  assert.ok(MARKETS.includes(source.market)&&DATES.includes(source.marketDate));
  assert.ok(!sourceByKey.has(k),"duplicate frozen source date/market");
  assert.ok(Number.isSafeInteger(source.ordinarySymbolCount)&&
   source.ordinarySymbolCount>=700);
  assert.match(source.normalizedBarSha256,/^[a-f0-9]{64}$/);
  assert.equal(source.sourceTransport,"PRIMARY");
  sourceByKey.set(k,source);
 }
 assert.equal(sourceByKey.size,12);
 const officialTotal=[...sourceByKey.values()].reduce((s,x)=>s+x.ordinarySymbolCount,0);
 assert.equal(officialTotal,11843,"frozen source denominator changed");

 assert.equal(census?.schemaVersion,
  "S2_OCT08_FULL_FROZEN_SOURCE_TO_HOT_D1_KEYS_READONLY_V0_1",
  "partial/failed census cannot drive repair");
 assert.ok([
  "PASS_ALL_11843_SOURCE_KEYS_MATCH_D1_VALUES_ONLY",
  "BLOCKED_OCT08_MISSING_MISMATCHED_OR_MULTIVERSION_D1_KEYS",
 ].includes(census.result),"full terminal census result required");
 assert.equal(census.marketDateCutoff,"2026-10-08");
 assert.equal(census.sourceReceiptsMatched,12);
 assert.deepEqual(census.exactTradingDates,DATES);
 assert.equal(census.sourceSymbolDayKeys,11843);
 assert.equal(census.observedD1?.rowsWritten,0,"original census must be physically read-only");
 assert.equal(census.d1Writes,0);
 assert.equal(census.r2Writes,0);
 assert.equal(census.historicPITReplayAuthorized,false);
 assert.equal(census.historicOriginalFirstKnownAtCertified,false);
 assert.equal(census.system1RuntimeUsed,false);
 assert.equal(census.d1MissingUnrequestedExtraRecordsNotProvenAbsent,true);
 integer(census.actualD1Queries,"actualD1Queries",{min:1,max:1200});
 verifyCounts(census.counts,officialTotal,"global");

 const discrepancies=census.discrepancies;
 assert.ok(Array.isArray(discrepancies),"discrepancy records missing");
 const dayTotals=new Map(),problems=new Map();
 for(const row of discrepancies){
  assert.ok(row&&typeof row==="object");
  const k=key(row.market,row.marketDate);
  assert.ok(sourceByKey.has(k),"foreign discrepancy or date");
  if(row.stage==="DATE_TOTALS"){
   assert.ok(!dayTotals.has(k),"duplicate day total");
   assert.equal(row.sourceCount,sourceByKey.get(k).ordinarySymbolCount,
    "date total source count differs from frozen source");
   verifyCounts(row,row.sourceCount,k);
   integer(row.d1ReadRequests,"d1ReadRequests",{min:1,max:1200});
   dayTotals.set(k,row);
   continue;
  }
  assert.ok(Object.hasOwn(DISCREPANCY_STATES,row.state),
   "unrecognized discrepancy state");
  assert.match(row.symbol,/^[1-9][0-9]{3}$/);
  assert.equal(row.originalPITAvailabilityUnproven,true);
  integer(row.seenRawVersions,"seenRawVersions",{min:0,max:150});
  const expectedVersionCount=row.state==="HOT_D1_KEY_ABSENT"?0:
   row.state==="HOT_D1_SOURCE_VALUES_MISMATCH"?1:null;
  if(expectedVersionCount!==null)assert.equal(row.seenRawVersions,expectedVersionCount);
  else assert.ok(row.seenRawVersions>=2,"multi-version with fewer than two rows");
  const symbolId=k+"|"+row.symbol;
  assert.ok(!problems.has(symbolId),"duplicate discrepancy per market/date/symbol");
  problems.set(symbolId,row);
 }
 assert.equal(dayTotals.size,12,"all 12 market-day totals required, cannot use partial census");
 const actual={matched:0,missing:0,mismatched:0,multi:0};
 let countIssues=0,requestCount=0;
 const proposed=[],quarantine=[],daySummaries=[];
 for(const marketDate of DATES)for(const market of MARKETS){
  const k=key(market,marketDate);
  const totals=dayTotals.get(k);
  assert.ok(totals,"missing market-date total "+k);
  for(const field of COUNT_FIELDS)actual[field]+=totals[field];
  const rows=[...problems.values()].filter(x=>key(x.market,x.marketDate)===k)
   .sort((a,b)=>a.symbol.localeCompare(b.symbol));
  assert.equal(rows.length,totals.missing+totals.mismatched+totals.multi,
   "missing/mismatch/multi detail incomplete: "+k);
  for(const type of Object.keys(DISCREPANCY_STATES)){
   assert.equal(rows.filter(x=>x.state===type).length,
    totals[DISCREPANCY_STATES[type]],"detail/summary class mismatch "+k+" "+type);
  }
  const missing=rows.filter(x=>x.state==="HOT_D1_KEY_ABSENT").map(x=>x.symbol);
  for(let i=0;i<missing.length;i+=maxKeysPerProposedBatch){
   const symbols=missing.slice(i,i+maxKeysPerProposedBatch);
   assert.equal(new Set(symbols).size,symbols.length);
   const preflight={
    market,marketDate,symbols:Object.freeze(symbols),
    sourceFullRowsetHash:sourceByKey.get(k).normalizedBarSha256,
    sourceReceiptIdentifier:"ORIGINAL_GITHUB_RUN_37878847039",
    category:"ABSENT_AT_RETROSPECTIVE_D1_READ_ONLY",
    stage:"PLAN_ONLY_REQUIRES_REVALIDATE_MISSING_AND_AUTHORIZE_WRITE_BUDGET",
    firstKnownAtMayBeBackdated:false,
    prospectiveObservedAtRequired:true,
    pitReplayEligibilityAtHistoricalMarketCut:false,
    noActionWithoutLiveSourcePITReceipt:true,
   };
   proposed.push(Object.freeze({
    ...preflight,
    intentId:hash(preflight),
    estimatedMissingKeyInsertions:symbols.length,
    authorityToExecute:false,
   }));
  }
  quarantine.push(...rows.filter(x=>x.state!=="HOT_D1_KEY_ABSENT")
   .map(x=>Object.freeze({market,marketDate,symbol:x.symbol,state:x.state,
    reason:"NO_AUTO_REWRITE_EXISTING_CANONICAL_RECORD_OR_MULTIVERSION",
    authorityToExecute:false})));
  daySummaries.push(Object.freeze({
   market,marketDate,sourceCount:totals.sourceCount,
   matched:totals.matched,missing:totals.missing,
   mismatched:totals.mismatched,multi:totals.multi,
   writeAuthorization:false,
  }));
  countIssues+=rows.length;
  requestCount+=totals.d1ReadRequests;
 }
 for(const field of COUNT_FIELDS)assert.equal(actual[field],census.counts[field],
  "global vs date totals discrepancy in "+field);
 assert.equal(countIssues,problems.size,"unmapped problem identities");
 assert.equal(requestCount,census.actualD1Queries,"day query provenance mismatch");
 assert.equal(proposed.reduce((n,x)=>n+x.symbols.length,0),actual.missing);
 assert.equal(quarantine.length,actual.mismatched+actual.multi);
 const expectedDisposition=actual.matched===11843?
  "PASS_ALL_11843_SOURCE_KEYS_MATCH_D1_VALUES_ONLY":
  "BLOCKED_OCT08_MISSING_MISMATCHED_OR_MULTIVERSION_D1_KEYS";
 assert.equal(census.result,expectedDisposition,"census result contradicts counts");

 const deterministic={sourceRun:37878847039,cutoff:"2026-10-08",
  officialFullSourceKeyCount:11843,censusObservations:{
   result:census.result,counts:actual,sourceDateCount:12,
   queryCount:census.actualD1Queries,
  },proposal:proposed,quarantine,daySummaries};
 return Object.freeze({
  schemaVersion:"S2_OCT08_D1_MISSING_KEY_REPAIR_DRYRUN_PLAN_V0_1",
  result:actual.missing===0&&quarantine.length===0?
   "NO_MISSING_KEYS_FOUND_IN_SOURCE_TO_D1_DIRECTION_ONLY":
   "REVIEW_ONLY_MISSING_KEY_CANDIDATES_AND_QUARANTINE_NO_WRITES",
  generatedAt:observedAt,planDigest:hash(deterministic),
  sourceEvidenceGitHubRunId:37878847039,
  officialStockDateKeys:11843,
  matchedAtRetrospectiveCut:actual.matched,
  missingKeyCandidateCount:actual.missing,
  quarantineExistingConflictsCount:quarantine.length,
  categoryCounts:Object.freeze({...actual}),
  estimatedFutureInsertionsUpperBoundNotCloudflareQuotaReservation:actual.missing,
  proposedBatches:Object.freeze(proposed),
  quarantine:Object.freeze(quarantine),
  daySummaries:Object.freeze(daySummaries),
  preWriteIndependentSourceRevalidationRequired:true,
  preWritePhysicalD1RecheckRequired:true,
  crossSystemD1DailyBudgetAndWriterCoordinationRequired:true,
  permissionToWrite:false,
  originalHistoricalFirstKnownAtCanBeBackdated:false,
  originalPITReplayCertified:false,
  eligibleForTradeOrSelection:false,
  fullD1ExtraRecordsAbsenceProven:false,
  d1ReadRequestsPerformedByPlanner:0,d1RowsWrittenByPlanner:0,
  r2ObjectsTouchedByPlanner:0,system1RuntimeUsed:false,
 });
}
