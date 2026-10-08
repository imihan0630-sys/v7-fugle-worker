import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { createRemoteD1RestAdapter } from "../deploy/remote_d1_rest_adapter.mjs";
import { buildDailyShadowReadonlyContextV0_1 } from "../runtime/daily_shadow_readonly_context_v0_1.mjs";
import { summarizeRecent60PitEligibleGapsV0_1 } from "../runtime/recent60_pit_gap_taxonomy_v0_1.mjs";
import {
  selectRecent60MissingSamplesV0_1,
  auditRecent60HotD1VsPitSamplesV0_1,
} from "../runtime/recent60_hot_d1_vs_pit_gap_audit_v0_1.mjs";

const date=String(process.env.SYSTEM2_RECENT60_AUDIT_MARKET_DATE||"").trim();
const outputPath=String(process.env.SYSTEM2_RECENT60_AUDIT_OUTPUT||"").trim();
const now=new Date();
const taipeiToday=new Intl.DateTimeFormat("en-CA",{
  timeZone:"Asia/Taipei",year:"numeric",month:"2-digit",day:"2-digit",
}).format(now);
let db=null;
let outcome=null;
try{
  assert.match(date,/^\d{4}-\d{2}-\d{2}$/,"explicit completed market date required");
  assert.ok(date<taipeiToday,
    "this diagnostic must use an already-ended calendar date; no market-day live capture");
  const accountId=process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken=process.env.SYSTEM2_CLOUDFLARE_API_TOKEN;
  assert.ok(accountId&&apiToken,"isolated research D1 readonly credentials required");
  db=await createRemoteD1RestAdapter({
    accountId,apiToken,databaseName:"system2-research",
  });
  assert.equal(db.metrics.rowsWritten,0,"D1 rowsWritten must start at 0");
  const ctx=await buildDailyShadowReadonlyContextV0_1({
    db,marketDate:date,requiredPriorSessions:60,
  });
  assert.equal(ctx.a1.state,"READY","historical-day official A1 unavailable: no diagnosis");
  assert.ok(ctx.a1.snapshotBatch?.ordinarySymbolCount>0,
    "source has no ordinary symbols; do not assert zero gaps");
  assert.equal(ctx.historyCoverage.marketDate,date);
  assert.equal(ctx.historyCoverage.globalIntegrityState,"READY");
  assert.equal(ctx.historyCoverage.accountingComplete,true);
  assert.equal(ctx.historyCoverage.exactSessionReconciliationEnabled,true,
    "exact expected-session contract missing");
  const taxonomy=summarizeRecent60PitEligibleGapsV0_1({
    history:ctx.historyCoverage,marketDate:date,
  });
  const samples=selectRecent60MissingSamplesV0_1({
    history:ctx.historyCoverage,marketDate:date,maxPerMarket:6,
  });
  assert.ok(samples.length>0,"no observed exact-session missing dates to sample");
  const physical=await auditRecent60HotD1VsPitSamplesV0_1({
    db,samples,marketDate:date,decisionTimestamp:ctx.a1.decisionTimestamp,
  });
  assert.equal(db.metrics.rowsWritten,0,"D1 rows written by physical absence diagnosis");
  outcome={
    schemaVersion:"S2_RECENT60_PIT_VS_HOT_D1_DIAGNOSTIC_ARTIFACT_V0_1",
    result:"PASS_RETROSPECTIVE_READONLY_PIT_GAP_SAMPLED",
    marketDate:date,observedAt:new Date().toISOString(),
    clockSemantics:"RETROSPECTIVE_DIAGNOSTIC_POST_FACTO_NOT_2026_10_08_LIVE_PIT",
    a1:{state:ctx.a1.state,ordinarySymbolCount:ctx.a1.snapshotBatch.ordinarySymbolCount,
      sourceObservationTime:ctx.a1.observedAt,
      decisionClockMode:ctx.a1.decisionClockMode,
    },
    history:{globalIntegrityState:ctx.historyCoverage.globalIntegrityState,
      currentUniverseCount:ctx.historyCoverage.currentUniverseCount,
      historyReadyCount:ctx.historyCoverage.historyReadyCount,
      continuityReadyCount:ctx.historyCoverage.continuityReadyCount,
      exactSessionReconciliationEnabled:ctx.historyCoverage.exactSessionReconciliationEnabled,
    },
    taxonomy,physical,
    d1Metrics:{requestCount:db.metrics.requestCount,rowsRead:db.metrics.rowsRead,
      rowsWritten:db.metrics.rowsWritten},
    protected:{
      d1RowsWritten:0,r2ObjectsWritten:0,system1RuntimeUsed:false,
      historyBarsMutated:false,noEventInferred:false,zeroPickClaimed:false,
      firstKnownAtRetroactivelyRewritten:false,
    },
  };
  console.log("S2_RECENT60_PHYSICAL_VS_PIT_RESULT "+JSON.stringify({
    result:outcome.result,marketDate:date,
    universeCount:outcome.history.currentUniverseCount,
    historyReadyCount:outcome.history.historyReadyCount,
    continuityReadyCount:outcome.history.continuityReadyCount,
    primaryCauses:taxonomy.localSymbolCounts.primaryCauseCounts,
    hotD1VsPitSampleCounts:physical.categoryCounts,
    sampleDateCount:physical.sampleDateCount,
    d1RowsRead:db.metrics.rowsRead,d1RowsWritten:db.metrics.rowsWritten,
    readyForStrategyPromotion:false,
  }));
}catch(error){
  outcome={
    schemaVersion:"S2_RECENT60_PIT_VS_HOT_D1_DIAGNOSTIC_ARTIFACT_V0_1",
    result:"BLOCKED_RETROSPECTIVE_READONLY_GAP_DIAGNOSTIC",
    marketDate:date||null,observedAt:new Date().toISOString(),
    errorName:String(error?.name||"Error"),
    errorMessage:String(error?.message||error).slice(0,650),
    d1RowsWritten:db?.metrics?.rowsWritten??null,
    noPhysicalGapOrNoEventConclusion:true,
    system1RuntimeUsed:false,historyBarsMutated:false,
  };
  console.error("S2_RECENT60_PHYSICAL_VS_PIT_BLOCKED "+JSON.stringify(outcome));
  process.exitCode=1;
}
if(outputPath)await writeFile(outputPath,JSON.stringify(outcome,null,2)+"\n","utf8");
