import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRemoteD1RestAdapter } from "../deploy/remote_d1_rest_adapter.mjs";
import { buildOfficialContinuitySourceUrlsV0_1 } from "../runtime/official_continuity_source_capability_v0_1.mjs";
import { parseOfficialHistoricalContinuityPayloadV0_1 } from "../runtime/official_continuity_event_parser_v0_1.mjs";
import { evaluateBoundedTechnicalContinuityBridgeV1_1 } from "../runtime/s2_07_technical_continuity_bridge_v1_1.mjs";

const accountId=process.env.CLOUDFLARE_ACCOUNT_ID;
const apiToken=process.env.SYSTEM2_CLOUDFLARE_API_TOKEN;
assert.ok(accountId,"CLOUDFLARE_ACCOUNT_ID is required");
assert.ok(apiToken,"SYSTEM2_CLOUDFLARE_API_TOKEN is required");

const lineageReceipt=JSON.parse(await readFile(
  new URL("../evidence/S2_07_RAW_A1_LINEAGE_V1_0_PHYSICAL_20261007.json",import.meta.url),
  "utf8",
));
const lineage=lineageReceipt.cases.find((row)=>row.symbol==="4806");
assert.ok(lineage,"4806 lineage case missing");
assert.equal(lineage.state,"BOUNDED_RAW_A1_LINEAGE_READY");

const startDate="2026-09-22";
const endDate="2026-10-02";
const sources=buildOfficialContinuitySourceUrlsV0_1({startDate,endDate});
const source=sources.TPEX_CAPITAL_REDUCTION_REFERENCE;
assert.ok(source,"TPEX capital reduction source missing");

const fetchedAt=new Date().toISOString();
const response=await fetch(source.url,{
  method:"GET",
  redirect:"follow",
  headers:{
    accept:"application/json,text/plain,*/*",
    "user-agent":"System2-S2-07-Technical-Continuity-Bridge/1.1",
  },
  signal:AbortSignal.timeout(30000),
});
const rawText=await response.text();
assert.equal(response.ok,true,"TPEx capital reduction source HTTP "+response.status);

const parsed=await parseOfficialHistoricalContinuityPayloadV0_1({
  sourceId:"TPEX_CAPITAL_REDUCTION_REFERENCE",
  sourceUrl:source.url,
  rawText,
  fetchedAt,
  requestedStartDate:startDate,
  requestedEndDate:endDate,
});
assert.equal(parsed.responseRangeVerified,true);
assert.equal(parsed.parserComplete,true);
assert.equal(parsed.state,"PARSED");

const matches=parsed.events.filter((event)=>
  event.symbol==="4806"
  && event.actionFamilyId==="CAPITAL_REDUCTION"
  && event.effectiveDate==="2026-10-02"
);
assert.equal(matches.length,1,"expected exactly one 4806 capital-reduction reference event");
const officialEvent=matches[0];

const db=await createRemoteD1RestAdapter({
  accountId,
  apiToken,
  databaseName:"system2-research",
});
const schema=await db.rawQuery(
  "SELECT schema_value FROM s2_schema_meta WHERE schema_key='schema_version' LIMIT 1",
);
assert.equal(schema[0]?.schema_value,"1.1");

const bars=await db.rawQuery(
  `SELECT market, symbol, market_date, canonical_key, price_space,
          open, high, low, close, source_id, source_row_hash, bar_hash,
          observed_at, available_at, pit_replay_eligible, continuity_state
     FROM s2_historical_a1_bars
    WHERE market='TPEX' AND symbol='4806'
      AND market_date IN ('2026-09-22','2026-10-02')
      AND price_space='RAW'
    ORDER BY market_date, observed_at, bar_hash`,
);
assert.equal(bars.length,2,"expected exactly two RAW A1 boundary rows for 4806");
const pre=bars.find((row)=>row.market_date==="2026-09-22");
const resume=bars.find((row)=>row.market_date==="2026-10-02");
assert.ok(pre&&resume,"4806 RAW A1 boundary rows missing");

const bridge=evaluateBoundedTechnicalContinuityBridgeV1_1({
  rawA1LineageCase:lineage,
  officialEvent,
  preSuspensionRawBar:pre,
  resumeRawBar:resume,
});

assert.equal(bridge.boundedTechnicalContinuityBridgeReady,true);
assert.equal(bridge.technicalContinuityCertified,false);
assert.equal(bridge.continuityTransformPerformed,false);
assert.equal(bridge.historyMutationPerformed,false);
assert.equal(bridge.selectionAuthority,false);
assert.equal(bridge.system1RuntimeUsed,false);
assert.equal(db.metrics.rowsWritten,0,"technical continuity bridge probe must remain read-only");

console.log(JSON.stringify({
  result:"S2_07_TECHNICAL_CONTINUITY_BRIDGE_V1_1_COMPLETE",
  version:"1.1-RESEARCH",
  symbol:"4806",
  officialSource:{
    sourceId:"TPEX_CAPITAL_REDUCTION_REFERENCE",
    sourceUrl:source.url,
    fetchedAt,
    payloadHash:parsed.payloadHash,
    responseRangeStart:parsed.responseRangeStart,
    responseRangeEnd:parsed.responseRangeEnd,
    responseRangeVerified:parsed.responseRangeVerified,
    parserState:parsed.state,
    eventVersionId:officialEvent.eventVersionId,
    sourceCaptureId:officialEvent.sourceCaptureId,
    sourceRowHash:officialEvent.sourceRowHash,
    knowledgeTimeMode:officialEvent.knowledgeTimeMode,
    firstKnownAt:officialEvent.firstKnownAt,
    availableAt:officialEvent.availableAt,
    pitEventReplayEligible:officialEvent.pitEventReplayEligible,
    continuityEffectState:officialEvent.continuityEffectState,
    technicalContinuityEvidenceEligible:officialEvent.technicalContinuityEvidenceEligible,
    continuityEffect:officialEvent.continuityEffect,
  },
  bridge,
  d1:{
    databaseName:"system2-research",
    schemaVersion:schema[0]?.schema_value||null,
    requestCount:db.metrics.requestCount,
    rowsRead:db.metrics.rowsRead,
    rowsWritten:db.metrics.rowsWritten,
    mutationPerformed:false,
  },
  boundaries:{
    bounded4806Only:true,
    rawHistoryMutated:false,
    adjustedHistoryPersisted:false,
    allHistoryContinuityCertified:false,
    technicalContinuityCertified:false,
    pitReplayAuthority:false,
    selectionAuthority:false,
    finalSelectionEnabled:false,
    livePushEnabled:false,
    capitalImpact:false,
    orderImpact:false,
    system1RuntimeUsed:false,
  },
},null,2));
