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
  validatedPairs:manifest.sourceMarketDatePairsValidated,
  plannedPairs:122,
  reuseCount:evidence.sharedOriginalSourceReuse?.trustedReusedMarketDatePairs??0,
  missingBeforeFetch:evidence.sharedOriginalSourceReuse?.initialMissingMarketDatePairs||[],
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
