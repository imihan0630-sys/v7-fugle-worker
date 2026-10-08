import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile,writeFile } from "node:fs/promises";
import {
  FROZEN_RECENT60_SAMPLE_BLOB_SHA,
  selectFrozenRecent60JulySampleV0_1,
} from "../runtime/recent60_july_hot_cold_source_readonly_v0_1.mjs";
import { auditAllFrozenRecent60OfficialDatesV0_2 } from
  "../runtime/recent60_frozen96_official_source_readonly_v0_2.mjs";

const outputPath=String(process.env.SYSTEM2_RECENT60_96_OFFICIAL_OUTPUT||"").trim();
let result;
const done=[];
try{
  // Guard exactly the prior physical 96 missing D1 identities. No new date,
  // symbol, market population, future session or retrospective PIT substitution.
  const bytes=await readFile(new URL(
    "../evidence/S2_RECENT60_20261008_FULL_GAP_ARTIFACT_READBACK_20261009_V0_1.json",
    import.meta.url,
  ));
  const sha=createHash("sha1").update("blob "+bytes.byteLength+"\0")
    .update(bytes).digest("hex");
  assert.equal(sha,FROZEN_RECENT60_SAMPLE_BLOB_SHA,
    "immutable sample blob changed");
  const frozen=JSON.parse(bytes.toString("utf8"));
  const samples=selectFrozenRecent60JulySampleV0_1(frozen);
  const evidence=await auditAllFrozenRecent60OfficialDatesV0_2({
    samples,onDate:row=>{
      done.push({market:row.market,date:row.marketDate,state:row.state,
        symbolsObserved:row.frozenSampleSymbolsFound.length,
        symbolsMissing:row.frozenSampleSymbolsNotFound.length});
      console.log("S2_RECENT60_JULY_96_OFFICIAL_DAY "+JSON.stringify(done.at(-1)));
    },
  });
  result={
    schemaVersion:"S2_RECENT60_JULY_96_SOURCE_ONLY_ACTION_ARTIFACT_V0_1",
    result:evidence.completelyObservedSampleNow
      ?"PASS_96_FROZEN_IDENTITIES_OFFICIAL_SOURCE_VISIBLE_POST_FACTO"
      :"PARTIAL_FROZEN_96_OFFICIAL_SOURCE_VISIBILITY_UNVERIFIED",
    observedAt:new Date().toISOString(),
    originalGapSampleRunId:37854849181,
    originalGapSampleGitBlobSha:sha,
    sourcePITScope:"POST_FACTO_ONLY_HISTORICAL_PUBLICATION_TIMESTAMP_UNKNOWN",
    official:evidence,
    cloudflareD1RowsRead:0,cloudflareD1RowsWritten:0,
    r2ObjectsRead:0,r2ObjectsWritten:0,
    originalHotD1GapObservationRewritten:false,
    exactPrior60HistoryPromoted:false,
    corporateActionNoEventCertified:false,ncT01Authorized:false,
    strategyOrReplayAuthorized:false,system1FormalCoreChanged:false,
  };
  console.log("S2_RECENT60_JULY_96_OFFICIAL_RESULT "+JSON.stringify({
    result:result.result,dateChecks:evidence.dateChecks,
    officialDateReady:evidence.sourceDateReady,
    sourceDateUnverified:evidence.sourceDateNotVerified,
    sampled96IdentitiesVisibleNow:evidence.sampledSymbolDateIdentitiesObservedNow,
    sampledIdentitiesStillMissingDespiteReadyDate:
      evidence.sampledSymbolDateIdentitiesNotObservedDespiteDateReady,
    d1Reads:0,d1Writes:0,
  }));
}catch(error){
  result={
    schemaVersion:"S2_RECENT60_JULY_96_SOURCE_ONLY_ACTION_ARTIFACT_V0_1",
    result:"BLOCKED_FROZEN_96_OFFICIAL_SOURCE_ONLY",
    observedAt:new Date().toISOString(),completedDates:done,
    error:String(error?.message||error).slice(0,650),
    d1RowsRead:0,d1RowsWritten:0,r2ObjectsRead:0,r2ObjectsWritten:0,
    historicalPITUnknown:true,system1FormalCoreChanged:false,
  };
  console.error("S2_RECENT60_JULY_96_OFFICIAL_BLOCKED "+JSON.stringify(result));
  process.exitCode=1;
}
if(outputPath)await writeFile(outputPath,JSON.stringify(result,null,2)+"\n","utf8");
