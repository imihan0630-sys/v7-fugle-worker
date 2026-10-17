// System2 BUILD Class A, explicit OPTIONAL source-evidence handoff for the
// existing (unchanged) SHORT_MOMENTUM seven-factor Stage1 scorer.
// Validating self-consistent JSON is NOT independent native-provider audit.
// Source and audit physical authenticity remain the AUDIT lane responsibility.
import {sha256Hex} from './decision_archive.mjs';
const H=/^[a-f0-9]{64}$/i;
const UTC=/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;
function fail(code){throw Error('S2_M09_STAGE1_NATIVE_HANDOFF_'+code);}
const isUtc=s=>typeof s==='string'&&UTC.test(s)&&Number.isFinite(Date.parse(s))&&
  new Date(s).toISOString().slice(0,19)===s.slice(0,19);
const sansHash=o=>Object.fromEntries(Object.entries(o).filter(([key])=>key!=='receiptHash'));
const obj=x=>!!x&&typeof x==='object'&&!Array.isArray(x);
function pair(a,b,code){
 if(Boolean(a)!==Boolean(b))fail(code+'_PARTIAL_UNAUDITED');
}
export async function bindM09Stage1NativeEvidenceV0_1({
 evidenceBundle,manifest,sourceReceipt,auditReceipt,sourceLedger,evaluationAtUtc
}={}){
 if(evidenceBundle===null||evidenceBundle===undefined)
  return Object.freeze({
   state:'NO_EXTERNAL_NATIVE_EVIDENCE__KEEP_ALL_PIT_UNKNOWN',
   continuityBySymbol:{},companyActionCompletenessReceipt:null,
   companyActionIndependentAuditReceipt:null,
   instrumentSourceReceipt:null,instrumentIndependentAuditReceipt:null,
   physicalNativeOriginalVerifiedByThisModule:false,
   stage1EligibilityGrantedByThisModule:false
  });
 const b=evidenceBundle;
 if(!obj(b)||b.schemaVersion!=='S2_M09_STAGE1_NATIVE_EVIDENCE_HANDOFF_V0_1'||
    b.scope!=='EXPLICIT_OFFLINE_INDEPENDENT_AUDIT_RECEIPT_HANDOFF'||
    !H.test(b.receiptHash||'')||await sha256Hex(sansHash(b))!==b.receiptHash)
   fail('BUNDLE_FORMAT_OR_HASH_INVALID');
 const src=sourceReceipt;
 if(b.strategyId!=='SHORT_MOMENTUM'||b.strategyVersion!=='V0.1-CONTRACT'||
    b.assessorPolicyId!=='S2-ASSESSOR-SM-LAUNCH-001'||
    b.assessorPolicyVersion!=='0.1-LAUNCH'||
    b.marketDate!==src?.marketDate||
    b.marketDate!==sourceLedger?.marketDate||
    b.marketDate!==manifest?.effectiveTradingDay||
    b.manifestSha256!==manifest?.manifestSha256||
    b.sourceReceiptHash!==src?.receiptHash||
    b.independentA1AuditHash!==auditReceipt?.auditHash||
    b.sourceLedgerHash!==sourceLedger?.ledgerSha256||
    !H.test(b.originalNativeEvidenceManifestHash||''))
   fail('STRATEGY_SOURCE_OR_LEDGER_LINEAGE_INVALID');
 if(!isUtc(evaluationAtUtc)||!isUtc(b.observedAtUtc)||
    !isUtc(b.firstKnownAtUtc)||!isUtc(b.availableAtUtc)||
    Date.parse(b.firstKnownAtUtc)>Date.parse(b.observedAtUtc)||
    Date.parse(b.observedAtUtc)>Date.parse(b.availableAtUtc)||
    Date.parse(b.availableAtUtc)>Date.parse(evaluationAtUtc)||
    Date.parse(auditReceipt?.auditedAtUtc||'')>Date.parse(evaluationAtUtc))
   fail('SOURCE_AFTER_DECISION_OR_CLOCK_INVALID');
 if(b.selectedCount!==null||b.zeroPickDay!==null||
    b.selectionAuthorized!==false||b.rankAuthorized!==false||
    b.frozenD1Written!==false||b.shadowAuthorized!==false||
    b.system1FormalCoreChanged!==false||b.cloudflareD1Writes!==0)
   fail('UNAUTHORIZED_PROMOTION');
 const ca=b.companyActionCompletenessReceipt??null;
 const caAudit=b.companyActionIndependentAuditReceipt??null;
 const cfi=b.instrumentSourceReceipt??null;
 const cfiAudit=b.instrumentIndependentAuditReceipt??null;
 pair(ca,caAudit,'CA');pair(cfi,cfiAudit,'CFI');
 const continuity=b.continuityBySymbol??{};
 if(!obj(continuity))fail('CONTINUITY_MAP_INVALID');
 if(Object.keys(continuity).length>0&&!ca)
   fail('UNVERIFIED_NO_EVENT_OR_ADJUSTMENT');
 const sourceSymbols=new Map((sourceLedger?.observations||[]).map(
  r=>[r.market+'|'+r.symbol,r]));
 const seen=new Set();
 for(const [symbol,row] of Object.entries(continuity)){
  if(!/^[1-9][0-9]{3}$/.test(symbol)||!obj(row)||
     row.symbol!==symbol||!['TWSE','TPEX'].includes(row.market)||
     !sourceSymbols.has(row.market+'|'+symbol)||
     seen.has(row.market+'|'+symbol)||
     row.marketDate!==b.marketDate)
   fail('CONTINUITY_IDENTITY_OR_DATE_INVALID');
  seen.add(row.market+'|'+symbol);
 }
 // Existing unchanged gates must inspect these receipts and independently
 // verify CA, CFI, 61-session originals, market date and genuine native class.
 // No synthetic default CLEAR_NO_ACTION, ordinary class or strategy rank.
 return Object.freeze({
  state:ca&&cfi?'EXPLICIT_CA_AND_CFI_EVIDENCE_SUPPLIED_NOT_YET_ACCEPTED':
    ca?'EXPLICIT_CA_ONLY__CFI_STILL_UNKNOWN':
    cfi?'EXPLICIT_CFI_ONLY__CA_STILL_UNKNOWN':
      'EXPLICIT_BUNDLE_NO_NATIVE_FAMILIES',
  continuityBySymbol:continuity,
  companyActionCompletenessReceipt:ca,
  companyActionIndependentAuditReceipt:caAudit,
  instrumentSourceReceipt:cfi,
  instrumentIndependentAuditReceipt:cfiAudit,
  physicalNativeOriginalVerifiedByThisModule:false,
  stage1EligibilityGrantedByThisModule:false
 });
}
