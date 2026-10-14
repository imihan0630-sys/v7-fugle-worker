// M09 System2 research-only: proof-bound ordinary-equity instrument admission.
// An A1 four-digit quotation or current issuer-code/name match is NOT proof
// of an ordinary common share. Missing/late/partially verified proof => UNKNOWN.
// The independent original-byte audit must be genuine physical evidence;
// a signed synthetic fixture only demonstrates the software acceptance contract.
import {sha256Hex} from './decision_archive.mjs';
const SHA=/^[0-9a-f]{64}$/i;
const DAY=/^\d{4}-\d\d-\d\d$/;
const UTC=/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/;
const day=x=>typeof x==='string'&&DAY.test(x)&&
 Number.isFinite(Date.parse(x+'T00:00:00Z'))&&
 new Date(x+'T00:00:00Z').toISOString().slice(0,10)===x;
const utc=x=>typeof x==='string'&&UTC.test(x)&&
 Number.isFinite(Date.parse(x))&&
 new Date(x).toISOString().slice(0,19)===x.slice(0,19);
const unsigned=(o,k)=>Object.fromEntries(Object.entries(o).filter(([n])=>n!==k));
function deny(code){throw Error('STAGE1_INSTRUMENT_PIT_'+code);}
const depositaryName=x=>typeof x==='string'&&
 /[-\u2010-\u2014]\s*DR$/i.test(x.normalize('NFKC').trim());
export async function verifiedStage1OrdinaryEquityBySymbolV0_1({
 sourceLedger,evaluationAtUtc,instrumentSourceReceipt=null,
 instrumentIndependentAuditReceipt=null,
}={}){
 if(!utc(evaluationAtUtc)||!day(sourceLedger?.marketDate)||
    !SHA.test(sourceLedger?.ledgerSha256||'')||
    !Array.isArray(sourceLedger?.observations))
  deny('SOURCE_OR_CLOCK_INVALID');
 // The standard A1-only workflow has no independent instrument-type evidence.
 // Never silently infer "ordinary stock" from a code length or issuer name.
 if(!instrumentSourceReceipt&&!instrumentIndependentAuditReceipt)
  return Object.freeze({});
 if(!instrumentSourceReceipt||!instrumentIndependentAuditReceipt)
  deny('PARTIAL_EVIDENCE_NOT_ACCEPTED');
 const r=instrumentSourceReceipt,a=instrumentIndependentAuditReceipt;
 if(r.schemaVersion!=='S2_OFFICIAL_INSTRUMENT_CLASS_PIT_SOURCE_V0_1'||
    r.sourceClass!=='ORIGINAL_NATIVE_ISIN_CFI_SECURITY_CLASS'||
    r.evidenceScope!=='ONLY_POSITIVELY_ATTESTED_SYMBOLS'||
    r.marketDate!==sourceLedger.marketDate||
    r.sourceLedgerHash!==sourceLedger.ledgerSha256||
    !SHA.test(r.originalProviderReceiptHash||'')||
    !utc(r.firstCapturedAtUtc)||Date.parse(r.firstCapturedAtUtc)>Date.parse(evaluationAtUtc)||
    !Array.isArray(r.securities)||r.securities.length===0||
    !SHA.test(r.receiptHash||'')||
    await sha256Hex(unsigned(r,'receiptHash'))!==r.receiptHash)
  deny('SOURCE_RECEIPT_OR_PIT_INVALID');
 if(a.schemaVersion!=='S2_OFFICIAL_INSTRUMENT_CLASS_INDEPENDENT_AUDIT_V0_1'||
    a.verdict!=='ACCEPTED_POSITIVE_ORDINARY_EQUITY_ROWS_ONLY'||
    a.auditorSeparation!=='INDEPENDENT_ORIGINAL_SOURCE_READBACK'||
    a.originalProviderBytesRehashed!==true||
    a.cfiNativeClassificationVerified!==true||
    a.sourceReceiptHash!==r.receiptHash||
    a.sourceLedgerHash!==sourceLedger.ledgerSha256||
    a.marketDate!==sourceLedger.marketDate||
    !utc(a.auditedAtUtc)||
    Date.parse(a.auditedAtUtc)<Date.parse(r.firstCapturedAtUtc)||
    Date.parse(a.auditedAtUtc)>Date.parse(evaluationAtUtc)||
    !SHA.test(a.auditHash||'')||
    await sha256Hex(unsigned(a,'auditHash'))!==a.auditHash)
  deny('INDEPENDENT_AUDIT_UNVERIFIED');
 const sourceMap=new Map(sourceLedger.observations.map(s=>[s.symbol,s]));
 const accepted={},seen=new Set();
 for(const row of r.securities){
  const code=row?.symbol;
  if(typeof code!=='string'||!/^[1-9][0-9]{3}$/.test(code)||
     seen.has(code))deny('DUPLICATED_OR_INVALID_SOURCE_SYMBOL');
  seen.add(code);
  const source=sourceMap.get(code);
  // Source+audit hashes cannot automatically attest a non-share native class:
  // only explicit positive native CFI ordinary-share identity can enter.
  if(!source||source.market!==row.market||
     !['TWSE','TPEX'].includes(row.market)||source.marketDate!==r.marketDate||
     depositaryName(source.companyName)||
     row.classification!=='ORDINARY_COMMON_SHARE'||
     row.positiveCommonShareAttested!==true||
     typeof row.cfi!=='string'||!/^ES[A-Z]{4}$/.test(row.cfi)||
     !SHA.test(row.nativeSourceRowSha256||'')||
     !day(row.effectiveFromDate)||row.effectiveFromDate>r.marketDate||
     (row.effectiveThroughDate!==null&&row.effectiveThroughDate!==undefined&&
      (!day(row.effectiveThroughDate)||row.effectiveThroughDate<r.marketDate))||
     !utc(row.availableAtUtc)||Date.parse(row.availableAtUtc)>Date.parse(evaluationAtUtc)||
     Date.parse(row.availableAtUtc)<Date.parse(r.firstCapturedAtUtc)||
     Date.parse(row.availableAtUtc)>Date.parse(a.auditedAtUtc))
    continue;
  accepted[code]=Object.freeze({symbol:code,market:source.market,
   marketDate:r.marketDate,instrumentClass:'ORDINARY_COMMON_SHARE',
   sourceReceiptHash:r.receiptHash,independentAuditHash:a.auditHash,
   availableAtUtc:row.availableAtUtc,nativeSourceRowSha256:row.nativeSourceRowSha256});
 }
 return Object.freeze(accepted);
}
