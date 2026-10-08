import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import {
  FROZEN_RECENT60_SAMPLE_BLOB_SHA,
  selectFrozenRecent60JulySampleV0_1,
} from "../runtime/recent60_july_hot_cold_source_readonly_v0_1.mjs";
import { auditAllFrozenRecent60OfficialDatesV0_2 } from
  "../runtime/recent60_frozen96_official_source_readonly_v0_2.mjs";

const frozenPath="system2/evidence/S2_RECENT60_20261008_FULL_GAP_ARTIFACT_READBACK_20261009_V0_1.json";
const raw=await readFile(new URL("../evidence/S2_RECENT60_20261008_FULL_GAP_ARTIFACT_READBACK_20261009_V0_1.json",import.meta.url),"utf8");
const frozen=JSON.parse(raw),samples=selectFrozenRecent60JulySampleV0_1(frozen);
assert.equal(execFileSync("git",["hash-object",frozenPath],{
  cwd:process.cwd(),encoding:"utf8",
}).trim(),FROZEN_RECENT60_SAMPLE_BLOB_SHA);

let officialCalls=0;
const full=await auditAllFrozenRecent60OfficialDatesV0_2({
  samples,pauseMs:0,
  now:()=>new Date("2026-10-09T01:15:00Z").toISOString(),
  fetchDate:async ({market,marketDate,observedAt,retryAttempts})=>{
    officialCalls++;
    assert.equal(observedAt(),"2026-10-09T01:15:00.000Z");
    assert.equal(retryAttempts,2);
    const symbols=samples.filter(x=>x.market===market).map(x=>x.symbol);
    return {
      market,marketDate,sourceDateEvidence:marketDate,
      state:"READY",sourceId:"CANONICAL_FIXTURE",
      sourceUrl:"https://example.test/canonical",
      sourceDateEvidenceBasis:"PAYLOAD_DATE",
      rows:symbols.map(symbol=>({market,marketDate,symbol})),
    };
  },
});
assert.equal(officialCalls,16);
assert.equal(full.dateChecks,16);
assert.equal(full.sourceDateReady,16);
assert.equal(full.sourceDateNotVerified,0);
assert.equal(full.sampledSymbolDateIdentitiesObservedNow,96);
assert.equal(full.sampledSymbolDateIdentitiesNotObservedDespiteDateReady,0);
assert.equal(full.completelyObservedSampleNow,true);
assert.equal(full.historicalFirstKnownAtOrPublicationClockCertified,false);
assert.equal(full.coldR2OrHotD1RowPresenceRechecked,false);
assert.equal(full.d1Calls,0);assert.equal(full.r2Calls,0);

// An official source lacking a sampled symbol never silently receives
// all-96 visibility credit, despite otherwise valid source-date identity.
const short=await auditAllFrozenRecent60OfficialDatesV0_2({
  samples,pauseMs:0,
  fetchDate:async ({market,marketDate})=>{
    const symbols=samples.filter(x=>x.market===market).map(x=>x.symbol);
    return {market,marketDate,sourceDateEvidence:marketDate,
      state:"READY",rows:symbols.slice(1).map(symbol=>({market,marketDate,symbol}))};
  },
});
assert.equal(short.sourceDateReady,16);
assert.equal(short.sampledSymbolDateIdentitiesObservedNow,80);
assert.equal(short.sampledSymbolDateIdentitiesNotObservedDespiteDateReady,16);
assert.equal(short.completelyObservedSampleNow,false);

// Requested-date mismatch and transient source errors remain UNKNOWN for
// exactly those date checks, not "source absent", and no PIT clock is asserted.
const partial=await auditAllFrozenRecent60OfficialDatesV0_2({
  samples,pauseMs:0,
  fetchDate:async ({market,marketDate})=>{
    if(market==="TPEX"&&marketDate==="2026-07-23")
      throw new Error("OFFICIAL_HTTP_429_NOT_PROOF_OF_ABSENCE");
    const symbols=samples.filter(x=>x.market===market).map(x=>x.symbol);
    return {market,marketDate,sourceDateEvidence:"2026-07-13",state:"READY",
      rows:symbols.map(symbol=>({market,marketDate,symbol}))};
  },
});
assert.equal(partial.sourceDateReady,0);
assert.equal(partial.sourceDateNotVerified,16);
assert.equal(partial.sampledSymbolDateIdentitiesObservedNow,0);
assert.equal(partial.observations.at(-1).state,"OFFICIAL_SOURCE_DATE_UNVERIFIED");
assert.match(partial.observations.at(-1).error,/HTTP_429/);

await assert.rejects(()=>auditAllFrozenRecent60OfficialDatesV0_2({
  samples:samples.map((x,i)=>i===0?{...x,dates:[...x.dates.slice(0,7),"2026-07-10"]}:x),
  pauseMs:0,fetchDate:async()=>null,
}),/cannot broaden audit/);
await assert.rejects(()=>auditAllFrozenRecent60OfficialDatesV0_2({
  samples:[...samples.slice(0,11),samples[0]],pauseMs:0,
}),/duplicated market-symbol/);

const workflow=await readFile(new URL("../../.github/workflows/system2-recent60-july-96-official-readonly.yml",import.meta.url),"utf8");
const runner=await readFile(new URL("../scripts/audit_recent60_july_96_official_source_only_v0_2.mjs",import.meta.url),"utf8");
assert.match(workflow,/permissions:\s*\n\s+contents: read/);
assert.match(workflow,/system2-recent60-july-96-official-readonly/);
assert.match(workflow,/audit_recent60_july_96_official_source_only_v0_2\.mjs/);
assert.doesNotMatch(workflow,/secrets\.|CLOUDFLARE_ACCOUNT_ID|wrangler\s+deploy|provision_system2_d1|fugle-test/i);
assert.match(runner,/FROZEN_RECENT60_SAMPLE_BLOB_SHA/);
assert.match(runner,/sampled96IdentitiesVisibleNow/);
assert.match(runner,/firstKnownAtOrPublicationClockCertified:false|historicalPITOrFirstKnownAtCertified:false|sourcePITScope/);
assert.doesNotMatch(runner,/createRemoteD1RestAdapter|createRemoteR2S3Adapter|\.prepare\s*\(|\.batch\s*\(|putIfAbsent\s*\(/);

console.log("System2 bounded all-96 July official source post-facto and zero-Cloudflare tests passed");
