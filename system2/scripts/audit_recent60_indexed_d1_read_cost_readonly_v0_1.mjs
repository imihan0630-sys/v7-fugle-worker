import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runDailyShadowInputPreflightReadonly } from "./run_daily_shadow_input_preflight_readonly.mjs";

export const INDEXED_READ_AUDIT_DATE="2026-10-08";
export const INDEXED_READ_D1_RESET_AT="2026-10-09T00:00:00Z";

export function validateIndexedReadAuditClockV0_1({nowAt}={}){
  assert.ok(typeof nowAt==="string" && Number.isFinite(Date.parse(nowAt)),
    "actual ISO audit observation clock required");
  assert.ok(Date.parse(nowAt)>=Date.parse(INDEXED_READ_D1_RESET_AT),
    "WAIT_D1_ROW_READ_QUOTA_RESET_2026_10_09_08_TAIPEI");
  return Object.freeze({
    marketDate:INDEXED_READ_AUDIT_DATE,observedAt:nowAt,
    clockClass:"POST_FACTO_DIAGNOSTIC_NO_ORIGINAL_PIT_ELIGIBILITY",
  });
}
export function summarizeIndexedReadAuditV0_1({result,observedAt}={}){
  const clock=validateIndexedReadAuditClockV0_1({nowAt:observedAt});
  assert.equal(result?.result,"PASS");
  assert.equal(result?.databaseName,"system2-research");
  assert.equal(result?.marketDate,INDEXED_READ_AUDIT_DATE);
  assert.equal(result?.d1Metrics?.rowsWritten,0);
  const ordinary=Number(result?.preflight?.history?.currentUniverseCount||0);
  assert.ok(ordinary>=1800 && ordinary<=5000,
    "actual source current universe coverage insufficient for indexed-read cost comparison");
  const rowsRead=Number(result?.d1Metrics?.rowsRead);
  assert.ok(Number.isInteger(rowsRead)&&rowsRead>0,
    "real D1 READ observation missing; no physical-cost claim");
  const reqs=Number(result?.d1Metrics?.requestCount);
  assert.ok(Number.isInteger(reqs)&&reqs>0);
  const h=result.preflight.history;
  return Object.freeze({
    schemaVersion:"S2_RECENT60_INDEXED_D1_READ_ONLY_PHYSICAL_COST_PROBE_V0_1",
    result:"PASS_REAL_D1_READ_COUNT_OBSERVED_NOT_PIT_REPLAY_CERTIFIED",
    ...clock,
    ordinarySymbolCount:ordinary,
    historyReadyCount:Number(h.historyReadyCount),
    continuityReadyCount:Number(h.continuityReadyCount),
    measuredD1:{requestCount:reqs,rowsRead,rowsWritten:0},
    queryCodeVersion:"SYMBOL_INDEX_SCOPED_BOUNDED_50",
    rowsReadSavingsVsHistoricalBaseline:"UNMEASURED_NOT_COMPARABLE",
    originalTradeDateFirstKnownAtProven:false,
    retrospectiveOnly:true,
    pITPromotionAuthorized:false,
    noCorporateActionInferred:true,
    noZeroPickClaim:true,
    system1RuntimeUsed:false,capitalImpact:false,
    livePushEnabled:false,orderImpact:false,
    externalMutationPerformed:false,
  });
}
const isMain=process.argv[1]&&resolve(process.argv[1])===resolve(fileURLToPath(import.meta.url));
if(isMain){
  const output=String(process.env.SYSTEM2_RECENT60_INDEXED_READ_AUDIT_OUTPUT||"").trim();
  let receipt=null;
  let stage="VERIFY_NO_PRE_RESET_EXECUTION";
  try{
    const clock=new Date().toISOString();
    validateIndexedReadAuditClockV0_1({nowAt:clock});
    const accountId=process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken=process.env.SYSTEM2_CLOUDFLARE_API_TOKEN;
    assert.ok(accountId&&apiToken,"isolated research D1 credentials required");
    stage="READ_POST_FACTO_2026_10_08_A1_AND_PIT_COVERAGE";
    const r=await runDailyShadowInputPreflightReadonly({
      accountId,apiToken,marketDate:INDEXED_READ_AUDIT_DATE,
      decisionTimestamp:new Date().toISOString(),
    });
    stage="VERIFY_AND_PRESERVE_RECEIPT";
    receipt=summarizeIndexedReadAuditV0_1({
      result:r,observedAt:new Date().toISOString(),
    });
    console.log("S2_RECENT60_INDEXED_READ_COST_RESULT "+JSON.stringify(receipt));
  }catch(error){
    receipt={
      schemaVersion:"S2_RECENT60_INDEXED_D1_READ_ONLY_PHYSICAL_COST_PROBE_V0_1",
      result:"BLOCKED_INDEXED_READ_COST_PHYSICAL_PROBE",
      marketDate:INDEXED_READ_AUDIT_DATE,
      attemptedAt:new Date().toISOString(),stage,
      safeError:String(error?.message||error).slice(0,700),
      noRowsReadSavingsClaim:true,noPitPromotion:true,
      noProductionMutation:true,
    };
    console.error("S2_RECENT60_INDEXED_READ_COST_BLOCKED "+JSON.stringify(receipt));
    process.exitCode=1;
  }
  if(output)await writeFile(output,JSON.stringify(receipt,null,2)+"\n","utf8");
}
