// Source-only 61-session bootstrap: original official bytes preserved and verified.
// No old/new D1 connection, permissions, subscription, Cloudflare writes, pushes or orders.
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {gzipSync,gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {captureOfficial61SessionWindowV0_1} from '../runtime/source_first_official_61_session_collector_v0_1.mjs';
import {buildOfficialTradingDatesV0_1} from '../runtime/official_historical_backfill_source_v0_1.mjs';
import {loadTrustedOfficialA1OriginalsV0_1,createSourceCacheFetchV0_1}
 from '../runtime/shared_official_a1_verified_seed_v0_1.mjs';
const OUT='/tmp/system2-official-61';
const sha=x=>createHash('sha256').update(x).digest('hex');
const taipeiDay=()=>new Intl.DateTimeFormat('en-CA',{
 timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit',
}).format(new Date());
export async function collectOfficial61SessionWindowToLocalEvidenceV0_1({
 marketDate,outputDir=OUT,fetchImpl,calendarResolver,historicalFetch,
 now,pauseMs=350,retrospectiveDiagnosticOnly=false,
 seedEvidenceFile=null,seedOriginalDir=null,
}={}){
 const currentTaipeiDate=taipeiDay();
 if(marketDate!==currentTaipeiDate &&
    !(retrospectiveDiagnosticOnly===true&&marketDate<currentTaipeiDate))
   throw Error('PROSPECTIVE_ONLY_TAIPEI_TODAY_UNLESS_EXPLICIT_RETROSPECTIVE_DIAGNOSTIC');
 if(retrospectiveDiagnosticOnly===true&&marketDate>=currentTaipeiDate)
   throw Error('RETROSPECTIVE_DIAGNOSTIC_MUST_PRECEDE_TODAY');
 await mkdir(resolve(outputDir,'original-json'),{recursive:true});
 // Date shift may change the 61-session window. Load and independently
 // verify only the current window's previous original public bytes.
 let seed=null,activeCalendarResolver=calendarResolver,transport=fetchImpl||globalThis.fetch;
 if(Boolean(seedEvidenceFile)!==Boolean(seedOriginalDir))
  throw Error('SEED_ORIGINAL_EVIDENCE_AND_DIRECTORY_MUST_BOTH_BE_PROVIDED');
 if(seedEvidenceFile){
  const d=new Date(marketDate+'T00:00:00Z');
  d.setUTCDate(d.getUTCDate()-145);
  const fromDate=d.toISOString().slice(0,10);
  const calendar=await buildOfficialTradingDatesV0_1({
    fromDate,toDate:marketDate,fetchImpl:transport
  });
  seed=await loadTrustedOfficialA1OriginalsV0_1({
    evidenceFile:seedEvidenceFile,originalDir:seedOriginalDir,
    neededTradingDates:calendar.tradingDates.slice(-61),now:now||(()=>new Date())
  });
  transport=createSourceCacheFetchV0_1(seed,transport);
  activeCalendarResolver=async()=>calendar;
 }
 const originals=[];
 const out=await captureOfficial61SessionWindowV0_1({
  marketDate,fetchImpl:transport,calendarResolver:activeCalendarResolver,historicalFetch,now,pauseMs,
  cachedOriginalsByUrl:seed?.storedOriginals||null,
  persistOriginal:async({market,date,raw,sha256,observedAt})=>{
    if(!['TWSE','TPEX'].includes(market)||!/^\d{4}-\d\d-\d\d$/.test(date))
       throw Error('UNSAFE_ORIGINAL_PROVIDER_FILENAME');
    const p=resolve(outputDir,'original-json',market+'-'+date+'.json.gz');
    // Create-only: never overwrite an original remote-provider artifact.
    const packed=gzipSync(raw,{level:6});
    await writeFile(p,packed,{flag:'wx',mode:0o600});
    const bytes=gunzipSync(await readFile(p));
    if(sha(bytes)!==sha256||bytes.byteLength!==raw.byteLength)
       throw Error('ORIGINAL_PROVIDER_RESTORE_HASH_MISMATCH');
    originals.push({market,date,sourceSha256:sha256,originalBytes:bytes.byteLength,
       gzipBytes:packed.byteLength,observedAt});
    return {stored:true,sha256,byteLength:bytes.byteLength};
  },
 });
 const evidence={...out,originalCount:originals.length,originals,
   sharedOriginalSourceReuse:{
    seedReceiptHash:seed?.seedSourceReceiptHash||null,
    trustedReusedMarketDatePairs:seed?.trustedReusedOriginalCount||0,
    initialMissingMarketDatePairs:seed?.missingPairs||[],
    revalidationIsNotHistoricalPITCertification:true,
    independentLongTermDurableArchiveReady:false,
   },
   retrospectiveDiagnosticOnly,
   retrospectiveSelectionClaimDisabled:true,
   genuineProspectiveDecisionCapture:!retrospectiveDiagnosticOnly&&false};
 const path=resolve(outputDir,'official-61-'+marketDate+'.json');
 await writeFile(path,JSON.stringify(evidence)+'\n',{flag:'wx',mode:0o600});
 console.log(JSON.stringify({
   mode:'OFFICIAL_READ_ONLY_61_SESSION_SOURCE_BOOTSTRAP',
   marketDate,state:evidence.state,calendarState:evidence.calendar.state,
   originalProviderFiles:originals.length,plannedRequests:evidence.plannedMarketDateRequests,
   reusedVerifiedMarketDatePairs:seed?.trustedReusedOriginalCount||0,
   missingPairsBeforeBackfill:seed?.missingPairs||[],
   completedRequests:evidence.receivedMarketDateCount,
   completeSymbolWindows:evidence.sourceRowSymbolWindowsCompleteCount,
   rootHash:evidence.receiptHash,selectedCount:null,selectionPerformed:false,
   noD1Operations:true,
 }));
 return evidence;
}
if(process.argv[1]&&resolve(process.argv[1])===resolve(fileURLToPath(import.meta.url))){
 const marketDate=process.argv[2];
 if(!/^\d{4}-\d\d-\d\d$/.test(marketDate||''))throw Error('MARKET_DATE_ARGUMENT_REQUIRED');
 const diagnosticFlag=process.argv[3];
 if(diagnosticFlag&&diagnosticFlag!=='--retrospective-diagnostic')
   throw Error('UNKNOWN_SOURCE_COLLECTION_MODE');
 const result=await collectOfficial61SessionWindowToLocalEvidenceV0_1({
   marketDate,retrospectiveDiagnosticOnly:diagnosticFlag==='--retrospective-diagnostic',
   seedEvidenceFile:process.env.S2_SHARED_A1_SEED_EVIDENCE_FILE||null,
   seedOriginalDir:process.env.S2_SHARED_A1_SEED_ORIGINAL_DIR||null,
   outputDir:process.env.S2_SHARED_A1_OUTPUT_DIR||OUT,
 });
 if(result.state!=='SOURCE_OBSERVED_UNAUDITED')process.exitCode=2;
}
