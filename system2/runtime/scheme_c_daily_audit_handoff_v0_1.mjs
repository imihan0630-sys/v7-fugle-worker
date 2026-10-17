// BUILD_LANE Class A, Scheme C daily source handoff.
// Read the EXISTING successful independent 122/122 A1 audit artifact and
// existing derived V0.2 daily preview. Do NOT re-fetch provider, infer
// missing full-market ordinary-share class, award PIT or fabricate zero picks.
import {sha256Hex} from './decision_archive.mjs';
import {routeSystem2ThreeLayerSelectionV0_1}
 from './three_layer_selection_preview_router_v0_1.mjs';

const SHA=/^[a-f0-9]{64}$/i;
const ISO=/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/;
const validUtc=v=>typeof v==='string'&&ISO.test(v)&&
  Number.isFinite(Date.parse(v))&&
  new Date(Date.parse(v)).toISOString().slice(0,19)===v.slice(0,19);
const sha=v=>typeof v==='string'&&SHA.test(v);
const deny=c=>{throw Error('SCHEME_C_AUDIT_HANDOFF_'+c);};
const unsigned=(r,k)=>Object.fromEntries(Object.entries(r).filter(([key])=>key!==k));
const zeroAuthority=Object.freeze({
 pitACertificationGranted:false,pitBCertificationGranted:false,
 fullMarketOrdinaryShareCount:null,selectedCount:null,zeroPickDay:null,
 shadowAuthorized:false,realStrategyRankAuthorized:false,
 frozenD1Written:false,pushAuthorized:false,ordersAuthorized:false,
 cloudflareD1Writes:0,cloudflareR2Writes:0,system1FormalCoreChanged:false,
});
export async function buildSchemeCDailyAuditHandoffV0_1({
 auditReceipt=null,preliminaryReceipt=null,auditRunId=null,
 sourceKind='SAME_RUN_SOURCE_ONLY_AUDIT_ARTIFACT',
 auditLinkedExternally=false
}={}){
 if(!Number.isSafeInteger(auditRunId)||auditRunId<=0)
  deny('REAL_AUDIT_RUN_ID_REQUIRED');
 if(!['SAME_RUN_SOURCE_ONLY_AUDIT_ARTIFACT',
       'PINNED_HISTORIC_V02_REPLAY'].includes(sourceKind))
  deny('SOURCE_KIND_UNKNOWN');
 if(sourceKind==='PINNED_HISTORIC_V02_REPLAY'&&
    (auditRunId!==38469057567||auditLinkedExternally!==true))
  deny('HISTORIC_SOURCE_AUDIT_PAIR_NOT_PINNED');
 const a=auditReceipt,w=preliminaryReceipt;
 if(!a||typeof a!=='object'||!sha(a.auditHash)||
    a.schemaVersion!=='SHARED_OFFICIAL_A1_SOURCE_AUDIT_V0_1'||
    await sha256Hex(unsigned(a,'auditHash'))!==a.auditHash||
    !validUtc(a.auditedAtUtc)||typeof a.marketDate!=='string')
  deny('SOURCE_INDEPENDENT_AUDIT_RECEIPT_INVALID');
 if(a.strategyPitCertified!==false||a.selectionAuthorized!==false||
    a.selectedCount!==null||a.zeroPickDay!==null||
    a.frozenWritten!==false||a.cloudflareD1Writes!==0||
    a.cloudflareR2Writes!==0||a.system1FormalRuntimeTouched!==false)
  deny('SOURCE_AUDIT_UNAUTHORIZED_PROMOTION');
 const sourceReady=a.verdict==='ACCEPTED_SOURCE_INTEGRITY_ONLY'&&
   a.sourceMarketDatePairsVerified===122&&
   a.originalFilesRehashedAfterDownload===122&&
   a.originalFilesDecompressedAndParsed===122&&
   a.officialCalendarTradingDatesVerified===61&&
   a.auditorSeparation==='INDEPENDENT_READBACK_PROCESS'&&
   a.independentOfficialCalendarReadbackVerified===true;
 if(w&&(!sha(w.receiptHash)||await sha256Hex(unsigned(w,'receiptHash'))!==w.receiptHash))
  deny('PRELIMINARY_RECEIPT_HASH_CORRUPT');
 if(w&&(w.marketDate!==a.marketDate||w.originalSourceReceiptHash!==a.sourceReceiptHash||
         w.independentSourceAuditHash!==a.auditHash||
         !validUtc(w.observedAtUtc)||Date.parse(w.observedAtUtc)<Date.parse(a.auditedAtUtc)))
  deny('AUDIT_PREVIEW_SOURCE_DATE_HASH_OR_CLOCK_MISMATCH');
 if(!sourceReady||!w||w.state==='BLOCKED_SOURCE_INCOMPLETE'){
  const base={
   schemaVersion:'S2_SCHEME_C_DAILY_AUDIT_HANDOFF_V0_1',
   state:!sourceReady?'INDEPENDENT_SOURCE_INCOMPLETE':
      'PRELIMINARY_SOURCE_NOT_READY',
   marketDate:a.marketDate,auditRunId,
   auditedAtUtc:a.auditedAtUtc,sourceKind,
   originalSourceReceiptHash:a.sourceReceiptHash,
   independentSourceAuditHash:a.auditHash,
   previewReceiptHash:w?.receiptHash??null,
   observedPreviewCount:null,descriptiveSourceMatches:null,
   previewReport:null,blockers:!sourceReady
    ?['SOURCE_OR_CALENDAR_122_OF_122_NOT_INDEPENDENTLY_READY']
    :['PRELIMINARY_RESEARCH_FEED_NOT_READY'],
   ...zeroAuthority,
  };
  return Object.freeze({...base,receiptHash:await sha256Hex(base)});
 }
 const display=await routeSystem2ThreeLayerSelectionV0_1({
   layer:'NON_PIT_PREVIEW',preliminaryReceipt:w
 });
 if(display.pitACertificationGranted!==false||
    display.pitBCertificationGranted!==false||
    display.strategySelectedCount!==null||
    display.certifiedZeroPickDay!==null||
    display.frozenD1Written!==false||
    display.ordersAuthorized!==false||
    display.pushAuthorized!==false)
  deny('DOWNSTREAM_PREVIEW_PROMOTED_FORMAL_AUTHORITY');
 const base={
  schemaVersion:'S2_SCHEME_C_DAILY_AUDIT_HANDOFF_V0_1',
  state:'NON_PIT_SOURCE_OBSERVATION_READY',
  marketDate:a.marketDate,auditRunId,
  auditedAtUtc:a.auditedAtUtc,sourceKind,
  originalSourceReceiptHash:a.sourceReceiptHash,
  independentSourceAuditHash:a.auditHash,
  previewReceiptHash:w.receiptHash,
  observedPreviewCount:display.displayedPreviewCount,
  descriptiveSourceMatches:display.preliminarySourceMatchedCount,
  previewReport:display,
  blockers:[],
  ...zeroAuthority
 };
 return Object.freeze({...base,receiptHash:await sha256Hex(base)});
}
