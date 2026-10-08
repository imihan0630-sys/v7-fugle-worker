import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import {
  FROZEN_RECENT60_SAMPLE_BLOB_SHA,
  selectFrozenRecent60JulySampleV0_1,
} from "../runtime/recent60_july_hot_cold_source_readonly_v0_1.mjs";
import { probeJulyOfficialSourceReadonlyV0_1 } from
  "../runtime/recent60_july_official_source_probe_v0_1.mjs";

const outputPath=String(process.env.SYSTEM2_RECENT60_JULY_OFFICIAL_ONLY_OUTPUT||"").trim();
let result;
try{
  // This path intentionally uses ZERO Cloudflare secrets, D1 APIs or R2 APIs.
  const raw=await readFile(new URL(
    "../evidence/S2_RECENT60_20261008_FULL_GAP_ARTIFACT_READBACK_20261009_V0_1.json",
    import.meta.url,
  ));
  const blob=createHash("sha1").update("blob "+raw.byteLength+"\0")
    .update(raw).digest("hex");
  assert.equal(blob,FROZEN_RECENT60_SAMPLE_BLOB_SHA,
    "original source sample git blob changed");
  const evidence=JSON.parse(raw.toString("utf8"));
  const samples=selectFrozenRecent60JulySampleV0_1(evidence);
  const official=await probeJulyOfficialSourceReadonlyV0_1({samples});
  const complete=official.verifiedDateCount===official.requestedDateCount;
  result={
    schemaVersion:"S2_RECENT60_JULY_OFFICIAL_NO_D1_SOURCE_ONLY_V0_1",
    result:complete
      ?"PASS_FOUR_BOUNDED_OFFICIAL_DATES_OBSERVED_POST_FACTO"
      :"PARTIAL_OFFICIAL_DATE_RETRIEVAL_UNVERIFIED",
    observedAt:new Date().toISOString(),
    originalMissingPITIdentities:96,sourceSampleMarketDate:"2026-10-08",
    frozenSampleGitBlobSha:blob,
    scope:"TWSE_TPEX_TWO_HISTORICAL_DATES_EACH_ONLY",
    official,
    isolatedD1Queried:false,r2Queried:false,
    d1Reads:0,d1Writes:0,r2Reads:0,r2Writes:0,
    legacyPhysicalD1ReadStatus:"BLOCKED_D1_FREE_DAILY_ROW_READ_QUOTA",
    historicalPITOrFirstKnownAtCertified:false,
    historicalOriginalSourcePublicationTimeCertified:false,
    fullMarketOrFullSixtyDayCoverageCertified:false,
    ncT01ContinuityCertified:false,
    strategyOrReplayAuthority:false,
    system1RuntimeUsed:false,
  };
  console.log("S2_JULY_OFFICIAL_ONLY_RESULT "+JSON.stringify({
    result:result.result,verified:official.verifiedDateCount,
    requested:official.requestedDateCount,perDate:official.receipts.map(x=>({
      market:x.market,date:x.marketDate,state:x.result,
      observedSymbols:x.sampledSymbolsObserved?.length??null,
      error:x.error??null,
    })),
    d1Reads:0,d1Writes:0,
  }));
}catch(error){
  result={
    schemaVersion:"S2_RECENT60_JULY_OFFICIAL_NO_D1_SOURCE_ONLY_V0_1",
    result:"BLOCKED_OFFICIAL_ONLY_SOURCE_OBSERVATION",
    observedAt:new Date().toISOString(),
    error:String(error?.message||error).slice(0,650),
    noOfficialSourceAbsenceInferred:true,
    d1Reads:0,d1Writes:0,r2Reads:0,r2Writes:0,
    system1RuntimeUsed:false,
  };
  console.error("S2_JULY_OFFICIAL_ONLY_BLOCKED "+JSON.stringify(result));
  process.exitCode=1;
}
if(outputPath)await writeFile(outputPath,JSON.stringify(result,null,2)+"\n","utf8");
