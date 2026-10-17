// GitHub Actions source-only runtime. Resolves latest physically closed official
// session under Taiwan local time, reuses verified prior originals, captures
// provider exact-date native TWSE/TPEx. NO Cloudflare/API secrets or D1 writes.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {buildOfficialTradingDatesV0_1}
 from '../runtime/official_historical_backfill_source_v0_1.mjs';
import {resolveLatestClosedTaiwanSessionV0_1}
 from '../runtime/shared_official_a1_session_clock_v0_1.mjs';
import {collectOfficial61SessionWindowToLocalEvidenceV0_1}
 from './run_source_first_official_61_session_collector_v0_1.mjs';
import {buildSharedOfficialA1MarketManifestV0_1}
 from '../../shared-knowledge/market-data/shared_official_a1_manifest_v0_1.mjs';
const OUT='/tmp/s2-shared-a1-official-incremental';
const DAY=/^\d{4}-\d\d-\d\d$/;
function taipeiDay(now){
 return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',
  year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
}
function minusDays(day,days){
 const d=new Date(day+'T00:00:00Z');d.setUTCDate(d.getUTCDate()-days);
 return d.toISOString().slice(0,10);
}
// Report ONLY known market/date identities + whitelist-safe failure codes.
// Original response bodies, provider URLs and exception strings stay PRIVATE.
// Diagnostics never certify a source, PIT, selection or Frozen.
export function missingA1MarketDatePairsAfterFetchV0_1({tradingDates,receipts,errors=[]}={}){
 if(!Array.isArray(tradingDates)||tradingDates.length!==61||
   tradingDates.some((d,i)=>!DAY.test(d)||(i>0&&d<=tradingDates[i-1]))||
   !Array.isArray(receipts)||!Array.isArray(errors))
  throw Error('SHARED_A1_MISSING_PAIR_DIAGNOSTIC_INPUT_INVALID');
 const captured=new Set(receipts.map(x=>x?.market+'|'+x?.marketDate));
 const missing=[];
 for(const date of tradingDates)for(const market of ['TWSE','TPEX']){
  if(captured.has(market+'|'+date))continue;
  const rawCode=errors.find(e=>e?.market===market&&e?.date===date)?.code;
  const reasonCode=typeof rawCode==='string'&&/^[A-Z0-9_]{1,80}$/.test(rawCode)?
   rawCode:'SOURCE_MISSING_REASON_UNKNOWN';
  missing.push({market,date,reasonCode});
 }
 return missing;
}

// Signed 61-session source may reuse older market days; only two original
// receipts belonging to the current T establish its SOURCE observation clock.
// An observed exchange response is NOT evidence of its official publishedAt.
export function summarizeCurrentMarketSourceClockV0_1({marketDate,receipts,validatedPairs}={}){
 const validDate=typeof marketDate==='string'&&DAY.test(marketDate)&&
  Number.isFinite(Date.parse(marketDate+'T00:00:00Z'))&&
  new Date(marketDate+'T00:00:00Z').toISOString().slice(0,10)===marketDate;
 if(!validDate||!Array.isArray(receipts)||!Number.isSafeInteger(validatedPairs)||
   validatedPairs<0||validatedPairs>122)
  throw Error('SHARED_A1_TARGET_SOURCE_CLOCK_INPUT_INVALID');
 const own=receipts.filter(x=>x.marketDate===marketDate);
 const byMarket={};
 for(const x of own){
  const observed=x.capturedAt;
  if(!['TWSE','TPEX'].includes(x.market)||byMarket[x.market]||
     typeof observed!=='string'||
     !/^\\d{4}-\\d\\d-\\d\\dT\\d\\d:\\d\\d:\\d\\d(?:\\.\\d+)?Z$/.test(observed)||
     !Number.isFinite(Date.parse(observed))||
     new Date(observed).toISOString().slice(0,19)!==observed.slice(0,19))
   throw Error('SHARED_A1_TARGET_SOURCE_CLOCK_OR_MARKET_INVALID');
  byMarket[x.market]=observed;
 }
 const complete=validatedPairs===122&&Boolean(byMarket.TWSE)&&Boolean(byMarket.TPEX);
 const latest=complete?[byMarket.TWSE,byMarket.TPEX].sort((a,b)=>
  Date.parse(b)-Date.parse(a))[0]:null;
 const decisionCutUtc=marketDate+'T15:45:00.000Z';
 return Object.freeze({
  expectedTargetMarkets:2,observedTargetMarkets:Object.keys(byMarket).length,
  twseTargetOriginalObservedAtUtc:byMarket.TWSE??null,
  tpexTargetOriginalObservedAtUtc:byMarket.TPEX??null,
  latestTargetOriginalObservedAtUtc:latest,
  t2345TaipeiSourceObservationCutUtc:decisionCutUtc,
  allTargetMarketOriginalsObservedBeforeT2345:complete?
   Date.parse(latest)<=Date.parse(decisionCutUtc):null,
  officialProviderPublicationAtUtc:null,
  originalPublicationFirstKnownAtUtc:null,
  officialPublicationTimingPITCertified:false,
  sourceOnlyNoFormalSelection:true
 });
}

export async function collectSharedOfficialA1IncrementalV0_1({
 outputDir=OUT,now=()=>new Date(),fetchImpl=globalThis.fetch,
 seedEvidenceFile=null,seedOriginalDir=null,allowOlderManual=false,
 calendarResolver=buildOfficialTradingDatesV0_1,
 collector=collectOfficial61SessionWindowToLocalEvidenceV0_1,
}={}){
 const current=now(),today=taipeiDay(current);
 if(!DAY.test(today))throw Error('SHARED_A1_TAIPEI_CLOCK_UNVERIFIED');
 const calendar=await calendarResolver({
   fromDate:minusDays(today,153),toDate:today,fetchImpl
 });
 const c=resolveLatestClosedTaiwanSessionV0_1({
   nowUtc:current.toISOString(),
   officialTradingDates:calendar.tradingDates,
   allowOlderManual
 });
 await mkdir(outputDir,{recursive:true,mode:0o700});
 if(c.state!=='CANDIDATE_CLOSED_DATE_OFFICIAL_RESPONSE_MUST_CONFIRM'){
  const result={schemaVersion:'SHARED_A1_INCREMENTAL_RUN_V0_1',
   state:c.state,marketDate:c.marketDate??null,
   selectedCount:null,frozenSnapshotWritten:false,
   sourceWrites:0,system1RuntimeTouched:false};
  await writeFile(resolve(outputDir,'source-skip.json'),
    JSON.stringify(result,null,2)+'\n',{flag:'wx',mode:0o600});
  return result;
 }
 const evidence=await collector({
  marketDate:c.marketDate,
  retrospectiveDiagnosticOnly:c.retrospectiveOnly,
  conditionalNextDayRecovery:c.conditionalNextDayRecovery===true,
  outputDir,fetchImpl,
  seedEvidenceFile,seedOriginalDir,
  now,pauseMs:500,
 });
 const manifest=buildSharedOfficialA1MarketManifestV0_1({
  sourceReceipt:evidence,issuedAtUtc:now().toISOString(),
  runId:process.env.GITHUB_RUN_ID||null,
  commitSha:process.env.GITHUB_SHA||null,
 });
 await writeFile(resolve(outputDir,'shared-official-a1-manifest.json'),
  JSON.stringify(manifest,null,2)+'\n',{flag:'wx',mode:0o600});
 const result={
  schemaVersion:'SHARED_A1_INCREMENTAL_RUN_V0_1',
  state:evidence.state,marketDate:c.marketDate,
  conditionalTPlusOneSourceRecoveryOnly:c.conditionalNextDayRecovery===true,
  validatedPairs:manifest.sourceMarketDatePairsValidated,
  plannedPairs:122,
  reuseCount:evidence.sharedOriginalSourceReuse?.trustedReusedMarketDatePairs??0,
  missingBeforeFetch:evidence.sharedOriginalSourceReuse?.initialMissingMarketDatePairs||[],
  targetSourceObservation: summarizeCurrentMarketSourceClockV0_1({
    marketDate:c.marketDate,receipts:evidence.receipts,
    validatedPairs:manifest.sourceMarketDatePairsValidated
  }),
  missingAfterFetch:missingA1MarketDatePairsAfterFetchV0_1({
   tradingDates:evidence.calendar?.tradingDates,
   receipts:evidence.receipts,errors:evidence.errors
  }),
  manifestHash:manifest.manifestSha256,
  sourceCoverage:manifest.sourceCoverage,
  storageClass:manifest.storageClass,
  durableStorageApproved:false,
  periodOriginalBytesHashPreserved:true,
  independentHistoricalPITCertification:false,
  sourceWrites:0,cloudflareD1Writes:0,
  system1RuntimeTouched:false,system2FrozenSelectionPerformed:false,
  selectedCount:null,zeroPickDay:null
 };
 await writeFile(resolve(outputDir,'shared-official-a1-run.json'),
  JSON.stringify(result,null,2)+'\n',{flag:'wx',mode:0o600});
 return result;
}
if(process.argv[1]&&process.argv[1].endsWith('/run_shared_official_a1_incremental_v0_1.mjs')){
 try{
  const r=await collectSharedOfficialA1IncrementalV0_1({
   seedEvidenceFile:process.env.S2_SHARED_A1_SEED_EVIDENCE_FILE||null,
   seedOriginalDir:process.env.S2_SHARED_A1_SEED_ORIGINAL_DIR||null,
   allowOlderManual:process.env.S2_SHARED_A1_ALLOW_OLDER_DIAGNOSTIC==='true'
  });
  console.log(JSON.stringify(r));
  if(r.state!=='SOURCE_OBSERVED_UNAUDITED'&&
     r.state!=='SKIPPED_NO_NEW_OFFICIAL_TRADING_DAY')process.exitCode=2;
 }catch(e){
  const code=String(e?.message||'UNKNOWN');
  const allowed=/^(SHARED_A1_|SEED_|MARKET_DATE_|PROSPECTIVE_|OFFICIAL_)/.test(code)?
   code.replace(/[^A-Z0-9_]/gi,'_').slice(0,96):'UNKNOWN';
  console.error('SHARED_OFFICIAL_A1_READONLY_FAIL_CLOSED_'+allowed);
  process.exitCode=2;
 }
}
