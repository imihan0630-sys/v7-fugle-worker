import assert from "node:assert/strict";
import { fetchOfficialHistoricalA1DateV0_1 } from "./official_historical_a1_source_v0_1.mjs";

export const RECENT60_FROZEN_96_OFFICIAL_SOURCE_VERSION =
  "S2_RECENT60_FROZEN_96_OFFICIAL_POST_FACTO_V0_2";

export async function auditAllFrozenRecent60OfficialDatesV0_2({
  samples,
  fetchDate=fetchOfficialHistoricalA1DateV0_1,
  now=()=>new Date().toISOString(),
  pauseMs=750,
  onDate=()=>{},
}={}){
  assert.ok(Array.isArray(samples)&&samples.length===12,"exact 12 frozen samples required");
  assert.ok(typeof fetchDate==="function");
  assert.ok(Number.isInteger(pauseMs)&&pauseMs>=0&&pauseMs<=5000);
  const identity=new Set();
  const byMarket={TWSE:[],TPEX:[]};
  let dates=null;
  for(const sample of samples){
    assert.ok(sample.market==="TWSE"||sample.market==="TPEX");
    assert.match(sample.symbol,/^[1-9]\d{3}$/);
    assert.ok(Array.isArray(sample.dates)&&sample.dates.length===8);
    assert.equal(new Set(sample.dates).size,8);
    assert.ok(sample.dates.every(x=>/^2026-07-(14|15|16|17|20|21|22|23)$/.test(x)),
      "cannot broaden audit beyond 8 frozen July sessions");
    assert.deepEqual([...sample.dates].sort(),[
      "2026-07-14","2026-07-15","2026-07-16","2026-07-17",
      "2026-07-20","2026-07-21","2026-07-22","2026-07-23",
    ]);
    if(dates===null)dates=[...sample.dates];
    else assert.deepEqual(sample.dates,dates,"sampled dates disagree across symbols");
    const key=sample.market+"|"+sample.symbol;
    assert.ok(!identity.has(key),"duplicated market-symbol");
    identity.add(key);
    byMarket[sample.market].push(sample.symbol);
  }
  assert.equal(byMarket.TWSE.length,6);
  assert.equal(byMarket.TPEX.length,6);

  const observations=[];
  for(const market of ["TWSE","TPEX"]){
    const expectedSymbols=byMarket[market];
    for(const marketDate of dates){
      const probeStartedAt=now();
      let receipt;
      try{
        const official=await fetchDate({
          market,marketDate,observedAt:()=>now(),
          retryAttempts:2,retryDelayMs:850,
        });
        if(official?.market!==market||
          official.marketDate!==marketDate||
          official.sourceDateEvidence!==marketDate||
          official.state!=="READY"||
          !Array.isArray(official.rows)){
          throw new Error("OFFICIAL_CANONICAL_MARKET_DATE_NOT_VERIFIED");
        }
        const codes=new Set();
        for(const row of official.rows){
          if(row.market!==market||row.marketDate!==marketDate||
            !/^[1-9]\d{3}$/.test(String(row.symbol))){
            throw new Error("OFFICIAL_PARSED_ROW_IDENTITY_MISMATCH");
          }
          if(codes.has(String(row.symbol)))throw new Error("DUPLICATE_OFFICIAL_SYMBOL");
          codes.add(String(row.symbol));
        }
        receipt={
          state:"OFFICIAL_SOURCE_DATE_VERIFIED_POST_FACTO",
          sourceId:official.sourceId,sourceUrl:official.sourceUrl,
          sourceDateEvidence:official.sourceDateEvidence,
          sourceDateEvidenceBasis:official.sourceDateEvidenceBasis,
          ordinarySourceRowCount:official.rows.length,
          frozenSampleSymbolsFound:expectedSymbols.filter(s=>codes.has(s)),
          frozenSampleSymbolsNotFound:expectedSymbols.filter(s=>!codes.has(s)),
          sourcePublishTimeAtJulySessionProven:false,
        };
      }catch(error){
        receipt={
          state:"OFFICIAL_SOURCE_DATE_UNVERIFIED",
          error:String(error?.message||error).slice(0,300),
          frozenSampleSymbolsFound:[],
          frozenSampleSymbolsNotFound:[],
          sourcePublishTimeAtJulySessionProven:false,
        };
      }
      const row=Object.freeze({
        market,marketDate,probeStartedAt,probeFinishedAt:now(),...receipt,
      });
      observations.push(row);
      await onDate(row);
      if(pauseMs>0&&observations.length<16){
        await new Promise(resolve=>setTimeout(resolve,pauseMs));
      }
    }
  }
  assert.equal(observations.length,16);
  const sourceDateReady=observations.filter(x=>
    x.state==="OFFICIAL_SOURCE_DATE_VERIFIED_POST_FACTO").length;
  const observedSampleIdentities=observations.reduce((sum,x)=>
    sum+x.frozenSampleSymbolsFound.length,0);
  const sourceDateNotVerified=observations.length-sourceDateReady;
  const sourceDateVerifiedButMissingSampleSymbol=observations.reduce((sum,x)=>
    sum+x.frozenSampleSymbolsNotFound.length,0);
  return Object.freeze({
    schemaVersion:RECENT60_FROZEN_96_OFFICIAL_SOURCE_VERSION,
    marketDate:"2026-10-08",
    originalFrozenSampledHotD1AbsentIdentities:96,
    dateChecks:16,
    sourceDateReady,sourceDateNotVerified,
    sampledSymbolDateIdentitiesObservedNow:observedSampleIdentities,
    sampledSymbolDateIdentitiesNotObservedDespiteDateReady:
      sourceDateVerifiedButMissingSampleSymbol,
    observations:Object.freeze(observations),
    completelyObservedSampleNow:sourceDateReady===16&&observedSampleIdentities===96,
    sourceObservationIsRetrospective:true,
    historicalFirstKnownAtOrPublicationClockCertified:false,
    coldR2OrHotD1RowPresenceRechecked:false,
    technicalContinuityOrCorporateActionNoEventCertified:false,
    ncT01OrReplayAuthorized:false,
    d1Calls:0,r2Calls:0,system1RuntimeUsed:false,
  });
}
