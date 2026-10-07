import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRemoteD1RestAdapter } from "../deploy/remote_d1_rest_adapter.mjs";
import { buildDailyShadowReadonlyContextV0_1 } from "../runtime/daily_shadow_readonly_context_v0_1.mjs";
import { prefetchDailyShadowPitHistoryV0_1 } from "../runtime/daily_shadow_history_prefetch_v0_1.mjs";
import { buildShadowSourceSessionReceipt } from "../runtime/shadow_source_session_receipt.mjs";
import { buildMarketRegimeSnapshot } from "../runtime/factor_snapshot.mjs";
import { runNcT01ArtifactOnlyV0_1 } from "../runtime/nct01_artifact_runner_v0_1.mjs";

const REPO_ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../..");
const POLICY_PATH=path.resolve(
  REPO_ROOT,
  "system2/evidence/SDA022_SYSTEM2_SHORT_MOMENTUM_POLICY_FINGERPRINT_V0_1.json",
);

function taipeiDate(now=new Date()){
  return new Intl.DateTimeFormat("en-CA",{
    timeZone:"Asia/Taipei",
    year:"numeric",
    month:"2-digit",
    day:"2-digit",
  }).format(now);
}

function argMap(argv){
  const out={};
  for(let i=0;i<argv.length;i+=1){
    const key=argv[i];
    if(!key.startsWith("--")) throw new Error("unexpected argument: "+key);
    const value=argv[i+1];
    if(!value||value.startsWith("--")) throw new Error("missing value for "+key);
    out[key.slice(2)]=value;
    i+=1;
  }
  return out;
}

function safeRepoPath(relativePath, field){
  if(!relativePath) return null;
  const candidate=path.resolve(REPO_ROOT,relativePath);
  const prefix=REPO_ROOT+path.sep;
  if(candidate!==REPO_ROOT&&!candidate.startsWith(prefix)) {
    throw new Error(field+" must resolve inside repository checkout");
  }
  return candidate;
}

async function readJson(filePath, field){
  let text;
  try {
    text=await fs.readFile(filePath,"utf8");
  } catch(error) {
    throw new Error(field+" unreadable: "+String(error?.message||error).slice(0,200));
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(field+" is not valid JSON");
  }
}

function normalizeContinuityReceipts(payload){
  if(payload===null||payload===undefined) return {};
  const rows=Array.isArray(payload)
    ? payload
    : Array.isArray(payload.receipts)
      ? payload.receipts
      : payload.schemaVersion==="S2_NCT01_TWSE_CONTINUITY_PROMOTION_RECEIPT_V0_1"
        ? [payload]
        : [];
  const out={};
  for(const receipt of rows){
    if(!receipt||typeof receipt!=="object") throw new Error("continuity receipt row must be object");
    const symbol=String(receipt.symbol||"").trim();
    if(!/^[1-9][0-9]{3}$/.test(symbol)) throw new Error("continuity receipt symbol invalid");
    if(out[symbol]) throw new Error("duplicate continuity receipt symbol: "+symbol);
    out[symbol]=receipt;
  }
  if(payload!==null && rows.length===0) {
    throw new Error("continuity receipt payload contains no recognized receipt rows");
  }
  return out;
}

function historyGlobalReady(history){
  return history?.globalIntegrityState==="READY";
}

export async function runNcT01PhysicalArtifactReadonlyV0_1({
  accountId,
  apiToken,
  marketDate=taipeiDate(),
  decisionTimestamp=null,
  continuityReceiptPath=null,
  batchSize=25,
  fetchImpl=globalThis.fetch,
  now=()=>new Date(),
}={}){
  const db=await createRemoteD1RestAdapter({
    accountId,
    apiToken,
    databaseName:"system2-research",
    fetchImpl,
  });

  const context=await buildDailyShadowReadonlyContextV0_1({
    db,
    marketDate,
    decisionTimestamp,
    fetchImpl,
    now,
    requiredPriorSessions:60,
  });

  const capturedAt=now().toISOString();
  const policy=await readJson(POLICY_PATH,"canonical SHORT_MOMENTUM policy fingerprint");

  let continuityPayload=null;
  let resolvedContinuityPath=null;
  if(continuityReceiptPath){
    resolvedContinuityPath=safeRepoPath(continuityReceiptPath,"continuityReceiptPath");
    continuityPayload=await readJson(resolvedContinuityPath,"continuity receipt file");
  }
  const continuityReceiptsBySymbol=normalizeContinuityReceipts(continuityPayload);

  if(!context.a1?.snapshotBatch || context.a1.state!=="READY") {
    return {
      schemaVersion:"S2_NCT01_PHYSICAL_ARTIFACT_RUN_OUTPUT_V0_1",
      executionResult:"EVIDENCE_INCOMPLETE",
      reason:"CURRENT_A1_SOURCE_NOT_READY",
      marketDate,
      decisionTimestamp:context.decisionTimestamp,
      preflightState:context.preflight?.state||null,
      continuityReceiptPath:continuityReceiptPath||null,
      continuityReceiptCount:Object.keys(continuityReceiptsBySymbol).length,
      d1Metrics:{...db.metrics},
      rowsWritten:db.metrics.rowsWritten,
      system1RuntimeUsed:false,
      finalSelectionEnabled:false,
      livePushEnabled:false,
      capitalImpact:false,
      orderImpact:false,
    };
  }

  const prefetched=await prefetchDailyShadowPitHistoryV0_1({
    db,
    snapshotBatch:context.a1.snapshotBatch,
    decisionTimestamp:context.decisionTimestamp,
    historyCoverage:context.historyCoverage,
    lookbackSessions:60,
    priceSpace:"RAW",
    batchSize:Number(batchSize),
  });

  const sourceSession=await buildShadowSourceSessionReceipt({
    receiptId:"NC-T01:SOURCE:"+marketDate+":"+capturedAt,
    marketDate,
    decisionTimestamp:context.decisionTimestamp,
    capturedAt,
    expectedSources:[
      {sourceId:"A1_FULL_MARKET",role:"REQUIRED"},
      {sourceId:"PIT_HISTORY",role:"REQUIRED"},
    ],
    observedSources:[
      {
        sourceId:"A1_FULL_MARKET",
        state:context.a1.state==="READY"?"KNOWN":"UNKNOWN",
        sourceDate:marketDate,
        availableAt:context.a1.observedAt,
        capturedAt,
        pointInTimeEligible:context.a1.snapshotBatch?.pointInTimeEligible===true,
        payloadHash:context.a1.snapshotBatch?.batchHash,
        semanticVersion:context.a1.version,
      },
      {
        sourceId:"PIT_HISTORY",
        state:historyGlobalReady(context.historyCoverage)?"KNOWN":"UNKNOWN",
        sourceDate:marketDate,
        availableAt:context.decisionTimestamp,
        capturedAt,
        pointInTimeEligible:historyGlobalReady(context.historyCoverage),
        payloadHash:prefetched.evidence.prefetchHash,
        semanticVersion:context.historyCoverage?.version||null,
        warnings:["AGGREGATE_PIT_HISTORY_ASOF_DECISION_CLOCK"],
      },
    ],
  });

  const regime=buildMarketRegimeSnapshot({
    regimeSnapshotId:"NC-T01:REGIME:"+marketDate+":"+capturedAt,
    marketDate,
    decisionTimestamp:context.decisionTimestamp,
    labels:["UNKNOWN"],
    taiwanIndexState:"UNKNOWN",
    breadthState:"UNKNOWN",
    liquidityState:"UNKNOWN",
    volatilityState:"UNKNOWN",
    leadershipState:"UNKNOWN",
    sectorRotationState:"UNKNOWN",
    globalMacroState:"UNKNOWN",
    factorRefs:[],
    warnings:[
      "MARKET_REGIME_NON_BLOCKING_FOR_SHORT_MOMENTUM_STAGE1",
      "NC_T01_DOES_NOT_INVENT_REGIME_EVIDENCE",
    ],
  });

  const rawRefs=[
    "A1_BATCH_SHA256:"+context.a1.snapshotBatch.batchHash,
    "PIT_PREFETCH_SHA256:"+prefetched.evidence.prefetchHash,
    "SOURCE_SESSION_SHA256:"+sourceSession.sourceSessionHash,
    ...(context.listingAgeCalendar?.sourceReceiptHash
      ? ["TRADING_CALENDAR_SHA256:"+context.listingAgeCalendar.sourceReceiptHash]
      : []),
  ];

  const physical=await runNcT01ArtifactOnlyV0_1({
    runId:"NC-T01:"+marketDate+":"+capturedAt,
    receiptId:"NC-T01:RECEIPT:"+marketDate+":"+capturedAt,
    marketDate,
    decisionTimestamp:context.decisionTimestamp,
    capturedAt,
    universeVersion:"A1-ORDINARY-EQUITY-V0.1",
    a1SymbolSnapshotBatch:context.a1.snapshotBatch,
    sourceSessionReceipt:sourceSession,
    regime,
    loadPriorHistoricalBars:prefetched.loadPriorHistoricalBars,
    continuityReceiptsBySymbol,
    policyFingerprintReceipt:policy,
    sharedRawSourceRefs:rawRefs,
    historyPrefetchEvidence:prefetched.evidence,
  });

  if(db.metrics.rowsWritten!==0) {
    throw new Error("NC-T01 artifact-only run unexpectedly wrote isolated D1");
  }
  if(physical.receipt.system1Top6InputAvailable!==false
    || physical.receipt.system1RankInputAvailable!==false
    || physical.evidence.system1RuntimeUsed!==false) {
    throw new Error("NC-T01 System1 dependency firewall mismatch");
  }

  const actualPhysicalPass=
    physical.receipt.resultClassification==="PHYSICALLY_INDEPENDENT_PATH_OBSERVED";
  if(actualPhysicalPass && Object.keys(continuityReceiptsBySymbol).length===0) {
    throw new Error("physical independence cannot pass without supplied real continuity receipt");
  }

  return {
    schemaVersion:"S2_NCT01_PHYSICAL_ARTIFACT_RUN_OUTPUT_V0_1",
    executionResult:"PASS",
    acceptanceState:actualPhysicalPass
      ? "PENDING_00_INDEPENDENT_REVIEW"
      : "EVIDENCE_INCOMPLETE",
    marketDate,
    decisionTimestamp:context.decisionTimestamp,
    decisionClockMode:context.decisionClockMode,
    capturedAt,
    preflight:{
      state:context.preflight.state,
      globalInputsReady:context.preflight.globalInputsReady,
      assessorReady:context.preflight.assessorReady,
      selectionDenominatorComplete:context.preflight.selectionDenominatorComplete,
      zeroPickMayBeClaimed:context.preflight.zeroPickMayBeClaimed,
      currentUniverseCount:context.historyCoverage?.currentUniverseCount||0,
      historyReadyCount:context.historyCoverage?.historyReadyCount||0,
      continuityReadyCount:context.historyCoverage?.continuityReadyCount||0,
    },
    continuityReceiptInput:{
      path:continuityReceiptPath||null,
      supplied:Object.keys(continuityReceiptsBySymbol).length>0,
      count:Object.keys(continuityReceiptsBySymbol).length,
      symbols:Object.keys(continuityReceiptsBySymbol).sort(),
    },
    historyPrefetch:prefetched.evidence,
    physicalEvidence:physical.evidence,
    physicalReceipt:physical.receipt,
    d1Metrics:{
      requestCount:db.metrics.requestCount,
      rowsRead:db.metrics.rowsRead,
      rowsWritten:db.metrics.rowsWritten,
    },
    safety:{
      databaseName:db.database.name,
      d1PersistenceExecuted:false,
      system1RuntimeUsed:false,
      finalSelectionEnabled:false,
      livePushEnabled:false,
      capitalImpact:false,
      orderImpact:false,
      externalMutationPerformed:false,
    },
  };
}

async function main(){
  const args=argMap(process.argv.slice(2));
  const result=await runNcT01PhysicalArtifactReadonlyV0_1({
    accountId:process.env.CLOUDFLARE_ACCOUNT_ID,
    apiToken:process.env.SYSTEM2_CLOUDFLARE_API_TOKEN,
    marketDate:args["market-date"]||taipeiDate(),
    decisionTimestamp:args["decision-timestamp"]||null,
    continuityReceiptPath:args["continuity-receipt-path"]||null,
    batchSize:Number(args["batch-size"]||25),
  });
  console.log(JSON.stringify(result,null,2));
}

const isMain=process.argv[1]&&path.resolve(process.argv[1])===path.resolve(fileURLToPath(import.meta.url));
if(isMain){
  main().catch((error)=>{
    console.error(error?.stack||String(error));
    process.exitCode=1;
  });
}
