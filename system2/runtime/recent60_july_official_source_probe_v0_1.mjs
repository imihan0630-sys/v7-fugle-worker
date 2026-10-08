import assert from "node:assert/strict";
import { fetchOfficialHistoricalA1DateV0_1 } from "./official_historical_a1_source_v0_1.mjs";

export const RECENT60_JULY_OFFICIAL_SAMPLE_VERSION =
  "S2_RECENT60_2026_JULY_OFFICIAL_SOURCE_POST_FACTO_SAMPLE_V0_1";
const OBSERVED_JULY_DATES=Object.freeze(["2026-07-14","2026-07-23"]);

export async function probeJulyOfficialSourceReadonlyV0_1({
  samples,fetchDate=fetchOfficialHistoricalA1DateV0_1,
  now=()=>new Date().toISOString(),
}={}){
  assert.ok(Array.isArray(samples)&&samples.length===12);
  assert.equal(typeof fetchDate,"function");
  const markets=["TWSE","TPEX"],receipts=[];
  for(const market of markets){
    const symbols=samples.filter(s=>s.market===market).map(s=>s.symbol);
    assert.equal(symbols.length,6);
    assert.equal(new Set(symbols).size,6);
    for(const marketDate of OBSERVED_JULY_DATES){
      const probeStartedAt=now();
      let probe;
      try{
        const source=await fetchDate({
          market,marketDate,observedAt:()=>now(),
          retryAttempts:2,retryDelayMs:800,
        });
        if(source?.market!==market||source?.marketDate!==marketDate||
           source?.sourceDateEvidence!==marketDate){
          throw new Error("CANONICAL_OFFICIAL_SOURCE_DATE_IDENTITY_MISMATCH");
        }
        if(source.state!=="READY"||!Array.isArray(source.rows)||source.rows.length===0){
          throw new Error("OFFICIAL_SOURCE_NOT_READY_OR_EMPTY");
        }
        const sourceCodes=new Set(source.rows.map(row=>String(row.symbol)));
        probe={
          result:"READY_OFFICIAL_SOURCE_RETROSPECTIVELY_OBSERVED",
          sourceId:source.sourceId,sourceUrl:source.sourceUrl,
          sourceDateEvidence:source.sourceDateEvidence,
          sourceDateEvidenceBasis:source.sourceDateEvidenceBasis,
          ordinarySymbolCount:source.ordinarySymbolCount,
          sampledSymbolsObserved: symbols.filter(x=>sourceCodes.has(x)),
          sampledSymbolsNotObserved: symbols.filter(x=>!sourceCodes.has(x)),
          sourcePublicationTimeCertified:false,
          historicalFirstKnownAtCertified:false,
        };
      }catch(error){
        probe={
          result:"OFFICIAL_SOURCE_RETRIEVAL_UNVERIFIED",
          error:String(error?.message||error).slice(0,300),
          sourcePublicationTimeCertified:false,
          historicalFirstKnownAtCertified:false,
        };
      }
      receipts.push(Object.freeze({
        market,marketDate,
        probeStartedAt,probeCompletedAt:now(),
        ...probe,
      }));
    }
  }
  return Object.freeze({
    schemaVersion:RECENT60_JULY_OFFICIAL_SAMPLE_VERSION,
    receipts:Object.freeze(receipts),
    requestedDateCount:receipts.length,
    verifiedDateCount:receipts.filter(x=>
      x.result==="READY_OFFICIAL_SOURCE_RETROSPECTIVELY_OBSERVED").length,
    sourceAvailabilityAt2026JulyDecisionTimestamp:"UNKNOWN_NOT_RECONSTRUCTED",
    presentNowDoesNotProvePublishedThen:true,
    noSourceAbsenceInferredFromNetworkFailure:true,
    storageAndPITNotMutated:true,
    system1RuntimeUsed:false,
  });
}
