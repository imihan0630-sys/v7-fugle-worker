// System2 M09 research-only: bind a symbol's corporate-action continuity
// claim to the actual completeness + separately audited receipt chain.
// A bare {state:'CLEAR_NO_ACTION', originalCorporateActionEvidenceVerified:true,
// evidenceSha256:'...'} is *never* enough. This verifies supplied evidence
// structure and hashes; independent original-provider verification remains an
// AUDIT_LANE physical responsibility, not something cryptographic hashes prove.
import {sha256Hex} from './decision_archive.mjs';
import {classifyCorporateActionSymbolWindowV0_1}
 from './corporate_action_continuity_archive_v0_1.mjs';

const SHA=/^[a-f0-9]{64}$/i;
const ISO=/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/;
const validUtc=x=>typeof x==='string'&&ISO.test(x)&&Number.isFinite(Date.parse(x))&&
 new Date(x).toISOString()===x.replace(/\.000Z$/, 'Z');
const FAMILIES=['EX_RIGHT_DIVIDEND','CAPITAL_REDUCTION','PAR_VALUE_CHANGE'];
const CONTRACTS=new Set(['TWSE','TPEX'].flatMap(exchange=>
 FAMILIES.map(family=>exchange+'|'+family+'|HISTORICAL_ACTUAL_RESULT_RANGE')));
const key=x=>x.exchange+'|'+x.actionFamilyId+'|'+x.sourceClass;
const unsigned=(v,name)=>Object.fromEntries(
 Object.entries(v).filter(([k])=>k!==name));
function block(code){throw Error('STAGE1_CA_PIT_'+code);}
export async function verifiedStage1ContinuityBySymbolV0_1({
 sourceLedger,calendarTradingDates,evaluationAtUtc,continuityBySymbol={},
 completenessReceipt=null,independentAuditReceipt=null,
}={}){
 if(!validUtc(evaluationAtUtc))block('EVALUATION_CLOCK_INVALID');
 if(!Array.isArray(calendarTradingDates)||calendarTradingDates.length!==61||
    !Array.isArray(sourceLedger?.observations)||!SHA.test(sourceLedger.ledgerSha256||''))
  block('SOURCE_WINDOW_REQUIRED');
 // Absence is UNKNOWN, not a negative event and never a no-event assertion.
 if(!completenessReceipt||!independentAuditReceipt)return Object.freeze({});
 const c=completenessReceipt,a=independentAuditReceipt;
 if(c.schemaVersion!=='S2_CA_COMPLETENESS_RECEIPT_V0_2'||
    !SHA.test(c.receiptHash||'')||await sha256Hex(unsigned(c,'receiptHash'))!==c.receiptHash||
    c.interval?.startDate!==calendarTradingDates[0]||
    c.interval?.endDate!==calendarTradingDates.at(-1)||
    c.interval.endDate!==sourceLedger.marketDate||
    c.universeCoverageComplete!==true||
    c.eventCoverageComplete!==true||c.sourceCoverageComplete!==true||
    c.revisionCoverageComplete!==true||c.archiveUnambiguous!==true||
    c.suspensionCoverageComplete!==true||
    c.symbolSessionCompletenessEvidenceReady!==true||
    c.noEventMayBeClaimed!==true||
    c.eventReconciliation?.ambiguityCount!==0||
    !validUtc(c.generatedAt)||Date.parse(c.generatedAt)>Date.parse(evaluationAtUtc))
  block('COMPLETENESS_RECEIPT_UNVERIFIED');
 const requirements=c.requiredSourceContracts;
 const results=c.sourceContractResults;
 if(!Array.isArray(requirements)||requirements.length!==6||
    new Set(requirements.map(key)).size!==6||
    requirements.some(row=>!CONTRACTS.has(key(row)))||
    !Array.isArray(results)||results.length!==6||
    new Set(results.map(row=>row?.contractKey)).size!==6||
    results.some(row=>!CONTRACTS.has(row?.contractKey)||
      row.satisfied!==true||!Array.isArray(row.satisfyingSourceIds)||
      row.satisfyingSourceIds.length===0))
  block('SIX_FAMILY_REVISION_SOURCE_COVERAGE_UNVERIFIED');
 for(const market of ['TWSE','TPEX']){
  const s=c.suspensionEvidenceByExchange?.[market];
  if(c.suspensionCoverageByExchange?.[market]!=='COMPLETE'||
     s?.evidenceReady!==true||s.requestedStartDate!==calendarTradingDates[0]||
     s.requestedEndDate!==sourceLedger.marketDate||
     !SHA.test(s.receiptDigest||'')||
     !validUtc(s.observedAt)||Date.parse(s.observedAt)>Date.parse(evaluationAtUtc)||
     (s.availableAt!==null&&s.availableAt!==undefined&&
      (!validUtc(s.availableAt)||Date.parse(s.availableAt)>Date.parse(evaluationAtUtc))))
   block('SUSPENSION_EVIDENCE_UNVERIFIED');
 }
 if(a.schemaVersion!=='S2_CA_PIT_INDEPENDENT_AUDIT_V0_1'||
    a.verdict!=='ACCEPTED_SOURCE_COMPLETENESS_ONLY'||
    a.auditorSeparation!=='INDEPENDENT_READBACK_PROCESS'||
    a.originalSourceEvidenceRehashed!==true||
    a.caReceiptHash!==c.receiptHash||
    a.sourceLedgerHash!==sourceLedger.ledgerSha256||
    a.marketDate!==sourceLedger.marketDate||
    !validUtc(a.auditedAtUtc)||
    Date.parse(a.auditedAtUtc)<Date.parse(c.generatedAt)||
    Date.parse(a.auditedAtUtc)>Date.parse(evaluationAtUtc)||
    !SHA.test(a.auditHash||'')||await sha256Hex(unsigned(a,'auditHash'))!==a.auditHash)
  block('INDEPENDENT_CA_AUDIT_UNVERIFIED');
 const originalBySymbol=new Map(sourceLedger.observations.map(row=>[row.symbol,row]));
 const accepted={};
 for(const [symbol,row] of Object.entries(continuityBySymbol||{})){
  const source=originalBySymbol.get(symbol);
  if(!source||row?.symbol!==symbol||row?.market!==source.market||
     row?.marketDate!==sourceLedger.marketDate||
     row?.startSession!==calendarTradingDates[0]||
     row?.endSession!==sourceLedger.marketDate||
     row?.state!=='CLEAR_NO_ACTION'||
     row?.originalCorporateActionEvidenceVerified!==true||
     row?.evidenceSha256!==c.receiptHash||
     row?.independentAuditHash!==a.auditHash||
     !validUtc(row.availableAt)||Date.parse(row.availableAt)<Date.parse(a.auditedAtUtc)||
     Date.parse(row.availableAt)>Date.parse(evaluationAtUtc))
   continue;
  // The complete CA archive must not show even one active/ambiguous event in
  // the symbol's PIT window. Adjusted-continuity requires separate verified
  // price-space transforms and is NOT silently approved by a no-event proof.
  const classification=classifyCorporateActionSymbolWindowV0_1({
   receipt:c,exchange:source.market,symbol,universeState:'IN_SCOPE'
  });
  if(classification.state!=='NO_EVENT')continue;
  accepted[symbol]=Object.freeze({...row});
 }
 return Object.freeze(accepted);
}
