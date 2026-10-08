import assert from "node:assert/strict";

export const RECENT60_D1_VS_PIT_AUDIT_VERSION =
  "S2_RECENT60_D1_ROW_VS_PIT_ELIGIBILITY_READONLY_V0_1";

const MAX_SYMBOLS_PER_MARKET=6;
const MAX_DATES_PER_SYMBOL=8;
const DATE_PATTERN=/^\d{4}-\d{2}-\d{2}$/;

function verifyDate(value,field){
  assert.match(String(value),DATE_PATTERN,field+" must be ISO date");
  const timestamp=Date.parse(String(value)+"T00:00:00Z");
  assert.ok(Number.isFinite(timestamp) &&
    new Date(timestamp).toISOString().slice(0,10)===value,
    field+" is not a real calendar date");
  return value;
}

function assertD1ReadOnly(db){
  assert.equal(db?.database?.name,"system2-research","isolated System2 D1 required");
  assert.ok(typeof db?.prepare==="function","read-only D1 adapter required");
  assert.equal(db?.metrics?.rowsWritten,0,"D1 writes already observed");
}

export function selectRecent60MissingSamplesV0_1({history,marketDate,maxPerMarket=6}={}){
  assert.ok(history && Array.isArray(history.diagnostics),"history diagnostics required");
  const date=verifyDate(marketDate||history.marketDate,"marketDate");
  assert.ok(Number.isInteger(maxPerMarket)&&maxPerMarket>=1&&maxPerMarket<=MAX_SYMBOLS_PER_MARKET,
    "maxPerMarket must be 1..6");
  assert.equal(history.marketDate,date,"history/diagnostic marketDate mismatch");
  assert.equal(history.accountingComplete,true,"universe accounting must be exact");
  assert.equal(history.globalIntegrityState,"READY","global history integrity must be ready");
  assert.equal(history.exactSessionReconciliationEnabled,true,"exact trading sessions required");
  assert.equal(history.diagnostics.length,Number(history.currentUniverseCount),
    "current-universe denominator mismatch");
  const seen=new Set();
  const byMarket={TWSE:[],TPEX:[]};
  for(const row of history.diagnostics){
    const market=String(row.market||"");
    const symbol=String(row.symbol||"");
    assert.ok(market==="TWSE"||market==="TPEX",
      "cannot classify unknown market symbol as physical absence");
    assert.match(symbol,/^[1-9]\d{3}$/,"ordinary symbol required");
    const key=market+"|"+symbol;
    assert.ok(!seen.has(key),"duplicate market-symbol in current universe");
    seen.add(key);
    const missing=Number(row.missingExpectedSessionCount||0);
    assert.ok(Number.isInteger(missing)&&missing>=0,"missing count must be a nonnegative integer");
    if(missing===0)continue;
    assert.equal(row.sessionReconciliationState,"EXACT_EXPECTED_SESSION_SET_AVAILABLE",
      "sampled gap lacks exact expected-session source contract");
    assert.ok(Array.isArray(row.missingExpectedSessionSample),"missing-date sample unavailable");
    const dates=[...new Set(row.missingExpectedSessionSample.map(x=>verifyDate(x,"missingExpectedDate")))]
      .filter(x=>x<date).sort();
    assert.ok(dates.length>0&&dates.length<=MAX_DATES_PER_SYMBOL,
      "bounded missing-date sample required; no fabricated fallback dates");
    assert.ok(dates.length<=missing,"missing-date sample exceeds actual missing count");
    byMarket[market].push(Object.freeze({
      market,symbol,marketDate:date,missingExpectedSessionCount:missing,
      selectedDateCount:Number(row.selectedDateCount||0),
      requiredPriorSessionsForSymbol:Number(row.requiredPriorSessionsForSymbol||60),
      missingDateSample:Object.freeze(dates),
      originalHistoryBlockerCodes:Object.freeze([...(row.blockerCodes||[])]),
    }));
  }
  for(const market of ["TWSE","TPEX"]){
    byMarket[market].sort((a,b)=>
      b.missingExpectedSessionCount-a.missingExpectedSessionCount
      || a.selectedDateCount-b.selectedDateCount
      || a.symbol.localeCompare(b.symbol));
  }
  return Object.freeze([
    ...byMarket.TWSE.slice(0,maxPerMarket),
    ...byMarket.TPEX.slice(0,maxPerMarket),
  ]);
}

function classifyDate(rows,priceSpace,cutoff){
  const raw=rows.filter(row=>row.price_space===priceSpace);
  const qualified=raw.filter(row=>
    Number(row.pit_replay_eligible)===1 &&
    row.available_at!==null && row.available_at!==undefined &&
    Number.isFinite(Date.parse(String(row.available_at))) &&
    Date.parse(String(row.available_at))<=Date.parse(cutoff));
  const flags=[];
  if(rows.length===0)flags.push("HOT_D1_ROW_ABSENT");
  if(rows.length>0&&raw.length===0)flags.push("REQUESTED_RAW_PRICE_SPACE_ABSENT");
  if(raw.length&&raw.every(row=>Number(row.pit_replay_eligible)!==1))
    flags.push("PIT_REPLAY_ELIGIBILITY_NOT_GRANTED");
  if(raw.some(row=>row.available_at===null||row.available_at===undefined||
      !Number.isFinite(Date.parse(String(row.available_at)))))
    flags.push("AVAILABLE_AT_MISSING_OR_INVALID");
  if(raw.some(row=>row.available_at && Number.isFinite(Date.parse(String(row.available_at))) &&
      Date.parse(String(row.available_at))>Date.parse(cutoff)))
    flags.push("AVAILABLE_AFTER_DIAGNOSTIC_CUTOFF");
  if(qualified.length>0)
    flags.push("PIT_ELIGIBLE_ROW_PRESENT_READER_DIAGNOSTIC_DISAGREEMENT");
  if(qualified.length>1&&new Set(qualified.map(row=>String(row.bar_hash||""))).size>1)
    flags.push("ELIGIBLE_REVISION_HASH_CONFLICT");
  const priority=[
    "PIT_ELIGIBLE_ROW_PRESENT_READER_DIAGNOSTIC_DISAGREEMENT",
    "HOT_D1_ROW_ABSENT",
    "REQUESTED_RAW_PRICE_SPACE_ABSENT",
    "PIT_REPLAY_ELIGIBILITY_NOT_GRANTED",
    "AVAILABLE_AT_MISSING_OR_INVALID",
    "AVAILABLE_AFTER_DIAGNOSTIC_CUTOFF",
  ];
  return {
    primaryObservation:priority.find(x=>flags.includes(x))||
      "HOT_D1_ROWS_EXIST_BUT_ELIGIBILITY_UNRESOLVED",
    nonexclusiveFlags:flags,
    hotD1RowCount:rows.length,
    rawSpaceRowCount:raw.length,
    diagnosticCutoffEligibleRowCount:qualified.length,
    distinctRawSourceIdCount:new Set(raw.map(x=>String(x.source_id||"UNKNOWN"))).size,
  };
}

export async function auditRecent60HotD1VsPitSamplesV0_1({
  db,samples,marketDate,decisionTimestamp,priceSpace="RAW",
}={}){
  assertD1ReadOnly(db);
  const date=verifyDate(marketDate,"marketDate");
  assert.ok(typeof decisionTimestamp==="string"&&
    Number.isFinite(Date.parse(decisionTimestamp)),"actual diagnostic observation cutoff required");
  assert.equal(priceSpace,"RAW","this audit does not certify adjusted history");
  assert.ok(Array.isArray(samples)&&samples.length<=MAX_SYMBOLS_PER_MARKET*2,
    "bounded samples required");
  const identities=new Set();
  const inspected=[];
  for(const sample of samples){
    assert.ok(sample.market==="TWSE"||sample.market==="TPEX","unsupported market");
    assert.match(String(sample.symbol),/^[1-9]\d{3}$/);
    assert.equal(sample.marketDate,date);
    const identity=sample.market+"|"+sample.symbol;
    assert.ok(!identities.has(identity),"duplicate sample");
    identities.add(identity);
    const dates=sample.missingDateSample;
    assert.ok(Array.isArray(dates)&&dates.length>=1&&dates.length<=MAX_DATES_PER_SYMBOL);
    assert.equal(new Set(dates).size,dates.length,"duplicate missing dates");
    for(const d of dates){
      verifyDate(d,"missingExpectedDate");
      assert.ok(d<date,"missing sample may not include decision date or future");
    }
    const sql="SELECT market, symbol, market_date, price_space, pit_replay_eligible, "+
      "available_at, bar_hash, source_id FROM s2_historical_a1_bars "+
      "WHERE market = ? AND symbol = ? AND market_date IN ("+
      dates.map(()=>"?").join(",")+") ORDER BY market_date, bar_hash";
    assert.match(sql,/^SELECT\b/,"only D1 SELECT is permitted");
    const response=await db.prepare(sql).bind(sample.market,sample.symbol,...dates).all();
    const raw=Array.isArray(response?.results)?response.results:[];
    const expected=new Set(dates);
    for(const row of raw){
      assert.equal(row.market,sample.market,"D1 market identity mismatch");
      assert.equal(row.symbol,sample.symbol,"D1 symbol identity mismatch");
      assert.ok(expected.has(row.market_date),"D1 returned date outside requested sample");
    }
    const rowsByDate=Object.groupBy
      ? Object.groupBy(raw,row=>row.market_date)
      : Object.fromEntries(dates.map(d=>[d,raw.filter(row=>row.market_date===d)]));
    const checks=dates.map(marketDateSample=>({
      marketDate:marketDateSample,
      ...classifyDate(rowsByDate[marketDateSample]||[],priceSpace,decisionTimestamp),
    }));
    inspected.push(Object.freeze({
      market:sample.market,symbol:sample.symbol,
      missingExpectedSessionCount:sample.missingExpectedSessionCount,
      sampledDateCount:dates.length,
      checks:Object.freeze(checks),
    }));
    assert.equal(db.metrics.rowsWritten,0,"audit emitted a D1 write");
  }
  const counts={};
  let observed=0;
  for(const item of inspected)for(const row of item.checks){
    observed+=1;
    counts[row.primaryObservation]=(counts[row.primaryObservation]||0)+1;
  }
  assert.equal(Object.values(counts).reduce((a,b)=>a+b,0),observed);
  return Object.freeze({
    schemaVersion:RECENT60_D1_VS_PIT_AUDIT_VERSION,
    marketDate:date,diagnosticCutoff:decisionTimestamp,
    priceSpace, sampleOnly:true,
    sampleSymbolCount:inspected.length,sampleDateCount:observed,
    categoryCounts:counts,
    samples:Object.freeze(inspected),
    missingHistoricalPITBarImpliesPhysicalD1Absence:false,
    missingD1HotRowImpliesAbsentFromColdR2:false,
    sourcePublicationTimeProven:false,
    retrospectivePITPromotionAllowed:false,
    continuityNoEventCertified:false,
    corporateActionContinuityPromoted:false,
    strategyOrZeroPickAuthority:false,
    d1RowsWritten:0,readOnly:true,system1RuntimeUsed:false,
  });
}
