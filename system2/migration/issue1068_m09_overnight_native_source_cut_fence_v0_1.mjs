// DATA_LANE #1068 — Reproduce two genuine next-day M09 native batches
// against the *previous* T 23:45 decision-cut, independently rehashing all
// existing source native bodies and independent source-audit receipt signatures.
// An independent audit performed after the cut CAN attest an already-archived
// pre-cut original, but does not move a *late* original back in time.
// Current CFI/CA source audit is not a strategy / historical PIT certificate.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {sha256Hex} from '../runtime/decision_archive.mjs';
const SHA=/^[a-f0-9]{64}$/;
const CAP='2026-10-16T15:45:00.000Z';
const ROW_IDS=Object.freeze([
 'TWSE_EX_RIGHT_DIVIDEND_ACTUAL',
 'TWSE_CAPITAL_REDUCTION_REFERENCE',
 'TWSE_PAR_VALUE_CHANGE_REFERENCE',
 'TPEX_EX_RIGHT_DIVIDEND_ACTUAL',
 'TPEX_CAPITAL_REDUCTION_REFERENCE',
 'TPEX_PAR_VALUE_CHANGE_REFERENCE'
]);
const h=x=>createHash('sha256').update(x).digest('hex');
const deny=s=>{throw Error('S2_DATA_M09_NEXTDAY_CUT_'+s)};
const time=x=>typeof x==='string'&&Number.isFinite(Date.parse(x))&&
 new Date(Date.parse(x)).toISOString()===x;
const unsigned=(x,name)=>Object.fromEntries(Object.entries(x).filter(([k])=>k!==name));
const sig=async(x,name)=>x&&SHA.test(x[name]||'')&&
 await sha256Hex(unsigned(x,name))===x[name];
// A later independent audit is valid evidence of old bytes (if traceable), but
// an original response first captured AFTER the cut cannot be used by T 23:45.
export function classifyAsOfSourceClockV0_1({marketDate,cutUtc=CAP,
 originalObservedAtUtc,independentAuditedAtUtc,stockInScope=false}={}){
 if(marketDate!=='2026-10-16'||cutUtc!==CAP||!time(originalObservedAtUtc)||
    !time(independentAuditedAtUtc)||
    Date.parse(independentAuditedAtUtc)<Date.parse(originalObservedAtUtc)||
    typeof stockInScope!=='boolean')deny('TIMESTAMP_OR_MARKET_IDENTITY_INVALID');
 const sourceBeforeCut=Date.parse(originalObservedAtUtc)<Date.parse(cutUtc);
 return {
   sourceBeforeCut,
   independentAuditCompletedAfterCut:Date.parse(independentAuditedAtUtc)>=Date.parse(cutUtc),
   sourceUsableForHistoricalTDecision:sourceBeforeCut&&stockInScope,
   reason:!stockInScope?'SYMBOL_NOT_IN_SOURCE_NATIVE_COHORT':
     sourceBeforeCut?'SOURCE_ARCHIVED_BEFORE_CUT__NO_FULL_PIT_PROMOTION':
      'ORIGINAL_FIRST_OBSERVED_AFTER_CUT__NO_RETROACTIVE_ADMISSION'
 };
}
export async function verifyM09NextDayNativeCutV0_1({
 cfiDir,caDir,cfiAuditDir,caAuditDir,readRaw=readFile
}={}){
 if([cfiDir,caDir,cfiAuditDir,caAuditDir].some(x=>typeof x!=='string'||!x)||
    typeof readRaw!=='function')deny('EXACT_ORIGINAL_FOUR_ARTIFACTS_REQUIRED');
 const load=async(p)=>JSON.parse((await readRaw(p)).toString('utf8'));
 const [cfi,ca,outer,ci,ai]=await Promise.all([
  load(resolve(cfiDir,'preview-native-cfi.json')),
  load(resolve(caDir,'six-ca-source-receipt.json')),
  load(resolve(caDir,'prospective-only-receipt.json')),
  load(resolve(cfiAuditDir,'audit-receipt.json')),
  load(resolve(caAuditDir,'audit-receipt.json'))
 ]);
 if(!(await sig(cfi,'receiptHash'))||!(await sig(ca,'receiptHash'))||
    !(await sig(outer,'receiptHash'))||!(await sig(ci,'auditHash'))||
    !(await sig(ai,'auditHash'))||
    cfi.receiptHash!=='262326d7436cb3937a0f3b7181c734d15211c7c124406a4def7c6d7d0dcdd4f2'||
    ca.receiptHash!=='c52faf00a05d7177aa2a519846be8656050497a43acd3ec18999ac54cc0876de'||
    ci.auditHash!=='2eaef6362ca9433b245c75ec80ef2be5cf23603b63b8d9938ffe5d536bab3991'||
    ai.auditHash!=='cf2b8ddc93431bfd9b813ddc9a1f64c231592e2dfe2314b5a2230e71d26d1fe5'||
    cfi.originalMarketDate!=='2026-10-16'||
    ca.requestedEndDate!=='2026-10-16'||
    cfi.preliminaryDenominator!==30||cfi.observations?.length!==30||
    ca.sourceFamilyDenominator!==6||ca.sourceReceipts?.length!==6||
    ca.sourcesRetainedOriginalBytes!==6||
    outer.caSourceReceiptHash!==ca.receiptHash||
    ci.sourceReceiptHash!==cfi.receiptHash||
    ci.sourceRunId!==38955846766||ai.sourceRunId!==38955846766||
    ai.caSourceReceiptHash!==ca.receiptHash||
    ci.sourceMarketDate!=='2026-10-16'||ai.marketDate!=='2026-10-16'||
    ci.originalProviderResponsesRehashed!==30||
    ai.originalCaFamiliesIndependentlyRehashed!==6||
    ci.historicalOrdinarySharePITCertified!==false||
    ai.historicalFirstKnownAtPITCertified!==false||
    ai.historicalNoEventCoverageCertified!==false||
    cfi.selectedCount!==null||ca.selectedCount!==null||
    ci.selectedCount!==null||ai.selectedCount!==null||
    ci.frozenD1Written!==false||ai.frozenD1Written!==false)
    deny('SIGNED_ORIGINAL_AUDIT_OR_NONAUTHORITY_MISMATCH');
 const symbols=new Set();let cfiOriginals=0;
 for(const r of cfi.observations){
  const key=r.market+'|'+r.symbol;
  if(symbols.has(key)||!['TWSE','TPEX'].includes(r.market)||
    !/^[1-9][0-9]{3}$/.test(r.symbol||'')||
    !SHA.test(r.originalProviderSha256||'')||
    !time(r.observedAtUtc)||
    Date.parse(r.observedAtUtc)<Date.parse(cfi.currentNativeObservationStartedUtc)||
    Date.parse(r.observedAtUtc)>Date.parse(cfi.currentNativeObservationFinishedUtc))
    deny('CFI_NATIVE_ROW_CLOCK_OR_SYMBOL_DUPLICATE');
  symbols.add(key);
  let original;
  try{original=gunzipSync(await readRaw(resolve(cfiDir,'native-'+r.symbol+'.html.gz')),{maxOutputLength:1_500_000});}
  catch{deny('CFI_NATIVE_ORIGINAL_GZIP_UNREADABLE')}
  if(h(original)!==r.originalProviderSha256||original.length!==r.originalProviderBytes)
    deny('CFI_NATIVE_ORIGINAL_BYTE_SHA_MISMATCH');
  cfiOriginals++;
 }
 const ids=new Set();let caOriginals=0;
 for(const r of ca.sourceReceipts){
  if(!ROW_IDS.includes(r.sourceId)||ids.has(r.sourceId)||
    r.originalBytesReadBackLocally!==true||
    !time(r.capturedAtUtc)||
    Date.parse(r.capturedAtUtc)<Date.parse(ca.firstPhysicalObservedAtUtc)||
    Date.parse(r.capturedAtUtc)>Date.parse(ca.completedAtUtc)||
    !SHA.test(r.originalSha256||''))deny('CA_FAMILY_ID_OR_CLOCK_UNVERIFIED');
  ids.add(r.sourceId);
  let original;
  try{original=gunzipSync(await readRaw(resolve(caDir,
    r.sourceId+'-2026-10-16.json.gz')),{maxOutputLength:8_000_000});}
  catch{deny('CA_NATIVE_ORIGINAL_GZIP_UNREADABLE')}
  if(h(original)!==r.originalSha256||original.length!==r.originalBytes)
    deny('CA_NATIVE_ORIGINAL_BYTE_SHA_MISMATCH');
  caOriginals++;
 }
 if(cfiOriginals!==30||caOriginals!==6||ids.size!==6||
    ci.observedWindowFinishedAtUtc!==cfi.currentNativeObservationFinishedUtc||
    !time(ci.independentAuditedAtUtc)||!time(ai.auditedAtUtc))
    deny('SOURCE_AUDIT_WINDOW_OR_DENOMINATOR_INCONSISTENT');
 const cfiCut=classifyAsOfSourceClockV0_1({
  marketDate:'2026-10-16',originalObservedAtUtc:cfi.currentNativeObservationFinishedUtc,
  independentAuditedAtUtc:ci.independentAuditedAtUtc,stockInScope:symbols.has('TWSE|2330')
 });
 const caCut=classifyAsOfSourceClockV0_1({
  marketDate:'2026-10-16',originalObservedAtUtc:ca.completedAtUtc,
  independentAuditedAtUtc:ai.auditedAtUtc,stockInScope:true
 });
 const base={
  schemaVersion:'S2_DATA_ISSUE1068_M09_OVERNIGHT_REAL_ORIGINAL_CUT_FENCE_V0_1',
  previousMarketDate:'2026-10-16',previousTargetCutUtc:CAP,
  originalSourceRunId:38955846766,
  sourceCFIArtifactId:12069503768,sourceCAArtifactId:12069933205,
  independentCFIAuditArtifactId:12069574791,
  independentCAAuditArtifactId:12070488133,
  cfiSourceReceiptHash:cfi.receiptHash,caSourceReceiptHash:ca.receiptHash,
  cfiIndependentAuditHash:ci.auditHash,caIndependentAuditHash:ai.auditHash,
  cfiOriginalBodiesRehashed:cfiOriginals,caOriginalBodiesRehashed:caOriginals,
  sourceCFI2330InCurrentNativeThirty:symbols.has('TWSE|2330'),
  nativeCfiAsOfCut:cfiCut,nativeCaAsOfCut:caCut,
  laterIndependentAuditsCannotReDateOriginal:true,
  nextDaySourcesAuthorizedForPreviousT:false,
  doesNotInvalidateSeparatePreCut2330Sources:true,
  previousTStrategyPITEligible:false,selectedCount:null,zeroPickDay:null,
  frozenD1Written:false,shadowAuthorized:false,
  cloudflareD1Reads:0,cloudflareD1Writes:0,cloudflareR2Writes:0,
  system1FormalCoreChanged:false
 };
 if(cfiCut.sourceUsableForHistoricalTDecision||
    caCut.sourceUsableForHistoricalTDecision||
    cfiCut.sourceBeforeCut||caCut.sourceBeforeCut||
    cfiCut.reason!=='SYMBOL_NOT_IN_SOURCE_NATIVE_COHORT'||
    caCut.reason!=='ORIGINAL_FIRST_OBSERVED_AFTER_CUT__NO_RETROACTIVE_ADMISSION')
    deny('REAL_LATE_SOURCES_FALSELY_ADMITTED');
 return {...base,receiptHash:await sha256Hex(base)};
}
if(process.argv[1]?.endsWith('/issue1068_m09_overnight_native_source_cut_fence_v0_1.mjs')){
 const r=await verifyM09NextDayNativeCutV0_1({
  cfiDir:'/tmp/s2-nextday-m09-cfi-original',
  caDir:'/tmp/s2-nextday-m09-ca-original',
  cfiAuditDir:'/tmp/s2-nextday-m09-cfi-audit',
  caAuditDir:'/tmp/s2-nextday-m09-ca-audit'
 });
 const out='/tmp/s2-m09-overnight-previous-cut-fence';
 await mkdir(out,{recursive:true,mode:0o700});
 await writeFile(resolve(out,'native-nextday-previous-cut-rejected.json'),
   JSON.stringify(r,null,2)+'\n',{flag:'wx',mode:0o600});
 console.log(JSON.stringify({
  result:'REAL_30_CFI_AND_SIX_CA_REHASHED__NOT_RETROACTIVE_PIT',
  auditedNativeCFI:r.cfiOriginalBodiesRehashed,
  auditedNativeCA:r.caOriginalBodiesRehashed,
  cfiContains2330:r.sourceCFI2330InCurrentNativeThirty,
  originalCFIAfterPreviousCut:!r.nativeCfiAsOfCut.sourceBeforeCut,
  originalCAAfterPreviousCut:!r.nativeCaAsOfCut.sourceBeforeCut,
  auditLaterDoesNotReDateSource:true,
  selectedCount:null,zeroPickDay:null,frozen:false,cloudflareWrites:0,
  receiptHash:r.receiptHash
 }));
}
