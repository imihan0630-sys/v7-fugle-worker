// System2 #1132: create a prospective SOURCE LEDGER from separately audited
// original 61-session official A1 bytes. Research only: no final selection.
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {official61SessionSourceReceiptHashBaseV0_1}
 from '../runtime/source_first_official_61_session_collector_v0_1.mjs';
import {buildSourceFirstProspectiveLedgerV0_1}
 from '../migration/source_first_prospective_ledger_v0_1.mjs';
import {admitSharedOfficialA1ToShortMomentumStage1V0_1}
 from '../runtime/shared_official_a1_stage1_admission_v0_1.mjs';
import {assertSharedOfficialA1ConsumerBoundaryV0_1}
 from '../../shared-knowledge/market-data/shared_official_a1_manifest_v0_1.mjs';
import {parseOfficialHistoricalA1PayloadV0_1}
 from '../runtime/official_historical_a1_source_v0_1.mjs';

const SHA=/^[0-9a-f]{64}$/i, UTC=/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/;
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const iso=x=>typeof x==='string'&&UTC.test(x)&&Number.isFinite(Date.parse(x));
function assertClock(x,cutoff,code){
 if(!iso(x)||Date.parse(x)>Date.parse(cutoff))throw Error(code);
}
function sourceClockWindow(marketDate,freezeAtUtc){
 const taipei=new Intl.DateTimeFormat('en-CA',{
  timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit',
 }).format(new Date(freezeAtUtc));
 // The T+1 condition permits the approved after-midnight source recovery.
 // It is not a grant to retroactively declare a T 19:00/23:45 freeze.
 const next=new Date(marketDate+'T00:00:00Z');
 next.setUTCDate(next.getUTCDate()+1);
 return taipei===marketDate||taipei===next.toISOString().slice(0,10);
}
function outBlocked(manifest,sourceReceipt,auditReceipt,blocker,freezeAtUtc){
 return Object.freeze({
  schemaVersion:'S2_SHARED_A1_SOURCE_LEDGER_BRIDGE_V0_1',
  state:'BLOCKED_NO_ELIGIBLE_SOURCE_LEDGER',
  marketDate:manifest?.effectiveTradingDay||sourceReceipt?.marketDate||null,
  freezeAtUtc,blockers:[blocker],
  actualSourcePairs:sourceReceipt?.receivedMarketDateCount??null,
  requiredSourcePairs:122,
  sourceReceiptHash:sourceReceipt?.receiptHash||null,
  auditReceiptHash:auditReceipt?.auditHash||null,
  auditedSourceOnly:false,sourceLedger:null,
  evaluation:null,eligibleSourceSymbolCount:null,
  selectedCount:null,zeroPickDay:null,
  strategyPitCertified:false,selectionAuthorized:false,
  frozenDecisionWritten:false,system1FormalRuntimeTouched:false,
  cloudflareD1Writes:0,cloudflareR2Writes:0,
 });
}
export async function sourceFirstLedgerFromAuditedOriginalsV0_1({
 manifest,sourceReceipt,auditReceipt,originalDirectory,
 freezeAtUtc=new Date().toISOString(),run={},
 readOriginal=readFile,parseNative=parseOfficialHistoricalA1PayloadV0_1,
}={}){
 if(!iso(freezeAtUtc))throw Error('A1_BRIDGE_FREEZE_CLOCK_INVALID');
 if(!manifest||!sourceReceipt||!auditReceipt)
  throw Error('A1_BRIDGE_MANIFEST_SOURCE_OR_AUDIT_MISSING');
 assertSharedOfficialA1ConsumerBoundaryV0_1(manifest,{
  system:'SYSTEM2',purpose:'READ_ONLY_SOURCE_RESEARCH'
 });
 if(!SHA.test(sourceReceipt.receiptHash||'')||
    await sha256Hex(official61SessionSourceReceiptHashBaseV0_1(sourceReceipt))!==
     sourceReceipt.receiptHash||
    manifest.originalOfficialProvenanceHash!==sourceReceipt.receiptHash||
    manifest.effectiveTradingDay!==sourceReceipt.marketDate)
  throw Error('A1_BRIDGE_SOURCE_MANIFEST_LINEAGE_MISMATCH');
 const {auditHash,...auditPayload}=auditReceipt;
 if(!SHA.test(auditHash||'')||await sha256Hex(auditPayload)!==auditHash||
    auditReceipt.marketDate!==sourceReceipt.marketDate||
    auditReceipt.sourceReceiptHash!==sourceReceipt.receiptHash||
    auditReceipt.manifestSha256!==manifest.manifestSha256||
    auditReceipt.strategyPitCertified!==false||
    auditReceipt.selectionAuthorized!==false||
    auditReceipt.auditorSeparation!=='INDEPENDENT_READBACK_PROCESS')
  throw Error('A1_BRIDGE_INDEPENDENT_AUDIT_PROVENANCE_INVALID');
 assertClock(manifest.issuedAtUtc,freezeAtUtc,'A1_BRIDGE_MANIFEST_FUTURE_CLOCK');
 assertClock(auditReceipt.auditedAtUtc,freezeAtUtc,'A1_BRIDGE_AUDIT_FUTURE_CLOCK');
 if(auditReceipt.verdict!=='ACCEPTED_SOURCE_INTEGRITY_ONLY'||
    sourceReceipt.receivedMarketDateCount!==122||
    manifest.sourceMarketDatePairsValidated!==122||
    auditReceipt.sourceMarketDatePairsVerified!==122||
    auditReceipt.originalFilesRehashedAfterDownload!==122||
    auditReceipt.originalFilesDecompressedAndParsed!==122||
    manifest.sourceCoverage!=='COMPLETE_SOURCE_CAPTURE_PIT_UNAUDITED')
  return outBlocked(manifest,sourceReceipt,auditReceipt,
    'INDEPENDENT_SOURCE_AUDIT_NOT_122_OF_122',freezeAtUtc);
 if(!sourceClockWindow(sourceReceipt.marketDate,freezeAtUtc))
  return outBlocked(manifest,sourceReceipt,auditReceipt,
    'SOURCE_OBSERVATION_OUTSIDE_T_OR_T_PLUS_ONE_WINDOW',freezeAtUtc);
 if(!originalDirectory||!Array.isArray(manifest.sourceBlobs)||
    manifest.sourceBlobs.length!==122||!Array.isArray(sourceReceipt.receipts)||
    sourceReceipt.receipts.length!==122)
  throw Error('A1_BRIDGE_FULL_SOURCE_OR_ORIGINAL_DIRECTORY_MISSING');
 const transports={},bySymbol={},symbols=[],seen=new Set();
 let sourceRowCount=0;
 for(const market of ['TWSE','TPEX']){
  const blob=manifest.sourceBlobs.find(x=>x.market===market&&
   x.marketDate===sourceReceipt.marketDate);
  const receipt=sourceReceipt.receipts.find(x=>x.market===market&&
   x.marketDate===sourceReceipt.marketDate);
  if(!blob||!receipt||blob.originalSha256!==receipt.originalRawResponseSha256||
     blob.originalBytes!==receipt.originalRawResponseBytes||
     blob.firstCapturedAtUtc!==receipt.capturedAt||
     receipt.providerReportedDate!==sourceReceipt.marketDate||
     blob.sourceUrl!==receipt.sourceUrl||!SHA.test(blob.originalSha256||''))
   throw Error('A1_BRIDGE_CURRENT_NATIVE_ORIGINAL_LINEAGE_INVALID');
  assertClock(blob.firstCapturedAtUtc,freezeAtUtc,
    'A1_BRIDGE_CURRENT_PROVIDER_FUTURE_CLOCK');
  const file=resolve(originalDirectory,market+'-'+sourceReceipt.marketDate+'.json.gz');
  const gz=await readOriginal(file);
  const raw=gunzipSync(gz,{maxOutputLength:32*1024*1024});
  if(raw.length!==blob.originalBytes||digest(raw)!==blob.originalSha256)
   throw Error('A1_BRIDGE_CURRENT_NATIVE_RAW_HASH_MISMATCH');
  const parsed=parseNative({
   market,marketDate:sourceReceipt.marketDate,
   observedAt:freezeAtUtc,sourceUrl:blob.sourceUrl,
   payload:JSON.parse(raw.toString('utf8'))
  });
  if(parsed?.state!=='READY'||
     parsed.sourceDateEvidence!==sourceReceipt.marketDate||
     !Array.isArray(parsed.rows)||parsed.rows.length!==receipt.rowCount||
     parsed.rows.length<(market==='TWSE'?600:450))
   throw Error('A1_BRIDGE_CURRENT_NATIVE_DATE_OR_COUNT_MISMATCH');
  transports[market]={ok:true,payloadHash:blob.originalSha256,
   sourceId:parsed.sourceId,sourceUrl:blob.sourceUrl,
   sourceDate:sourceReceipt.marketDate,rowCount:parsed.rows.length};
  for(const row of parsed.rows){
   const symbol=row.symbol;
   if(!/^[1-9]\d{3}$/.test(symbol||'')||seen.has(symbol)||
      row.market!==market||row.marketDate!==sourceReceipt.marketDate)
    throw Error('A1_BRIDGE_CROSS_MARKET_DUPLICATE_OR_BAD_SYMBOL');
   seen.add(symbol);
   symbols.push(symbol);
   sourceRowCount++;
   const rowHash=await sha256Hex(row.sourceFields);
   bySymbol[symbol]={
    symbol,companyName:row.companyName||null,market,
    marketDate:sourceReceipt.marketDate,
    open:row.open,high:row.high,low:row.low,close:row.close,
    volumeShares:row.volumeShares,tradeValue:row.tradeValue,
    sourceRowHash:rowHash,
    priceState:[row.open,row.high,row.low,row.close].every(x=>
      Number.isFinite(x)&&x>0)?'USABLE':'NO_USABLE_PRICE',
    provenance:{
     observedAt:freezeAtUtc,availableAt:freezeAtUtc,
     firstKnownAt:blob.firstCapturedAtUtc,
     sourceId:receipt.sourceId,sourceUrl:blob.sourceUrl,
     originalRawResponseSha256:blob.originalSha256,
     independentAuditHash:auditReceipt.auditHash,
     pointInTimeEligibleForSourceObservationOnly:true,
     strategyPitCertified:false,
    },
   };
  }
 }
 if(!symbols.length||sourceRowCount!==symbols.length)
  throw Error('A1_BRIDGE_SOURCE_FULL_UNIVERSE_INVALID');
 symbols.sort();
 const snapshotBatch={
  state:'READY',marketDate:sourceReceipt.marketDate,
  pointInTimeEligible:true, // source-observation only, not strategy PIT
  decisionTimestamp:freezeAtUtc,
  ordinarySymbolCount:symbols.length,symbols,bySymbol,
  blockerCodes:[],
  batchHash:await sha256Hex({
   marketDate:sourceReceipt.marketDate,manifestHash:manifest.manifestSha256,
   receiptHash:sourceReceipt.receiptHash,auditHash:auditReceipt.auditHash,
   fullCurrentUniverse:symbols.map(s=>({
    market:bySymbol[s].market,symbol:s,rowHash:bySymbol[s].sourceRowHash
   }))
  }),
 };
 const source={state:'READY',marketDate:sourceReceipt.marketDate,
  observedAt:freezeAtUtc,decisionTimestamp:freezeAtUtc,
  transports,snapshotBatch};
 const ledger=await buildSourceFirstProspectiveLedgerV0_1({
  marketDate:sourceReceipt.marketDate,source,freezeAtUtc,run
 });
 if(ledger.sourceState!=='READY'||ledger.observations.length!==symbols.length||
    ledger.sourceOrdinarySymbolCount!==symbols.length||
    ledger.selectedCount!==null||ledger.zeroPickDay!==null||
    ledger.realQualifiedStockSelectionPerformed!==false)
  throw Error('A1_BRIDGE_PROSPECTIVE_LEDGER_NOT_SOURCE_ONLY');
 return Object.freeze({
  schemaVersion:'S2_SHARED_A1_SOURCE_LEDGER_BRIDGE_V0_1',
  state:'SOURCE_LEDGER_READY_STRATEGY_PIT_NOT_CERTIFIED',
  marketDate:sourceReceipt.marketDate,freezeAtUtc,blockers:[],
  actualSourcePairs:122,requiredSourcePairs:122,
  sourceReceiptHash:sourceReceipt.receiptHash,
  auditReceiptHash:auditReceipt.auditHash,
  auditedSourceOnly:true,sourceLedger:ledger,
  evaluation:null,eligibleSourceSymbolCount:symbols.length,
  selectedCount:null,zeroPickDay:null,
  strategyPitCertified:false,selectionAuthorized:false,
  frozenDecisionWritten:false,system1FormalRuntimeTouched:false,
  cloudflareD1Writes:0,cloudflareR2Writes:0,
 });
}
export async function stage1ResearchFromAuditedSourceV0_1(input={}){
 const bridge=await sourceFirstLedgerFromAuditedOriginalsV0_1(input);
 if(bridge.state!=='SOURCE_LEDGER_READY_STRATEGY_PIT_NOT_CERTIFIED')
  return bridge;
 const admission=await admitSharedOfficialA1ToShortMomentumStage1V0_1({
  manifest:input.manifest,sourceReceipt:input.sourceReceipt,
  auditReceipt:input.auditReceipt,sourceLedger:bridge.sourceLedger,
  // ONLY independent genuinely accepted corporate-action coverage may be supplied.
  // Missing proof means INCOMPLETE and must NEVER default to CLEAR_NO_ACTION.
  continuityBySymbol:input.continuityBySymbol||{},
  evaluationAtUtc:input.freezeAtUtc
 });
 if(admission.selectedCount!==null||admission.zeroPickDay!==null||
    admission.selectionAuthorized!==false||admission.durableFrozenDecisionWritten!==false)
  throw Error('A1_BRIDGE_STAGE1_SELECTED_OR_FROZEN_LEAK');
 return Object.freeze({...bridge,state:'STAGE1_RESEARCH_EXECUTED_PIT_CONTINUITY_GATED',
  evaluation:admission,evaluationHash:admission.evaluationHash,
  eligibleSourceSymbolCount:bridge.eligibleSourceSymbolCount,
  selectedCount:null,zeroPickDay:null});
}
if(process.argv[1]&&process.argv[1].endsWith('/run_shared_official_a1_stage1_readonly_v0_1.mjs')){
 try{
  const root=process.env.S2_A1_AUDIT_SOURCE_DIR;
  const auditFile=process.env.S2_A1_AUDIT_RECEIPT_FILE;
  if(!root||!auditFile)throw Error('A1_BRIDGE_ARTIFACT_PATHS_MISSING');
  const manifest=JSON.parse(await readFile(resolve(root,'shared-official-a1-manifest.json'),'utf8'));
  const receipt=JSON.parse(await readFile(resolve(root,
    'official-61-'+manifest.effectiveTradingDay+'.json'),'utf8'));
  const auditReceipt=JSON.parse(await readFile(auditFile,'utf8'));
  const result=await stage1ResearchFromAuditedSourceV0_1({
   manifest,sourceReceipt:receipt,auditReceipt,
   originalDirectory:resolve(root,'original-json'),
   freezeAtUtc:new Date().toISOString(),
   run:{repository:process.env.GITHUB_REPOSITORY||null,
    runId:process.env.GITHUB_RUN_ID||null,attempt:process.env.GITHUB_RUN_ATTEMPT||null,
    codeSha:process.env.GITHUB_SHA||null}
  });
  const base={schemaVersion:result.schemaVersion,
   state:result.state,marketDate:result.marketDate,
   freezeAtUtc:result.freezeAtUtc,
   sourcePairs:result.actualSourcePairs,requiredSourcePairs:result.requiredSourcePairs,
   blockers:result.blockers,
   sourceLedgerHash:result.sourceLedger?.ledgerSha256||null,
   verifiedSourceUniverseCount:result.eligibleSourceSymbolCount,
   strategyEvaluationState:result.evaluation?.evaluationState||null,
   strategyEvaluatedCount:result.evaluation?.evaluation?.assessedCount??null,
   strategyIncompleteCount:result.evaluation?.evaluation?.incompleteCount??null,
   selectedCount:null,zeroPickDay:null,
   strategyPitCertified:false,selectionAuthorized:false,frozenDecisionWritten:false};
  const out={...base,summarySha256:await sha256Hex(base)};
  await mkdir('/tmp/s2-a1-stage1-readonly',{recursive:true,mode:0o700});
  await writeFile('/tmp/s2-a1-stage1-readonly/summary.json',
   JSON.stringify(out,null,2)+'\n',{flag:'wx',mode:0o600});
  console.log(JSON.stringify(out));
  if(result.state==='STAGE1_RESEARCH_EXECUTED_PIT_CONTINUITY_GATED'&&
     result.evaluation?.evaluation?.qualifiedNotSelectedCount>0){
   console.log('A1_STAGE1_QUALIFIED_NOT_SELECTED_RESEARCH_ONLY_NOT_FROZEN');
  }
 }catch(e){
  console.error('A1_STAGE1_READONLY_BRIDGE_FAIL_CLOSED_'+
   String(e?.message||'UNKNOWN').replace(/[^A-Z0-9_]/gi,'_').slice(0,120));
  process.exitCode=2;
 }
}
