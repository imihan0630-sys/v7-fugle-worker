// System2 P0 #1132: daily research-only candidate readiness accounting.
// A source/Stage1 diagnosis NEVER authorizes final selection/Frozen, even at zero candidates.
import {sha256Hex} from './decision_archive.mjs';
const HASH=/^[a-f0-9]{64}$/i, UTC=/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/;
function strip(value,key){const v={...value};delete v[key];return v;}
function bad(code){throw Error('S2_DAILY_SELECTION_READINESS_'+code);}
const states=new Set(['INCOMPLETE','REJECTED','WATCH','QUALIFIED_NOT_SELECTED']);
export async function buildDailySelectionReadinessReceiptV0_1({bridge,runId=null}={}){
 if(!bridge||typeof bridge!=='object'||!UTC.test(bridge.freezeAtUtc||'')||
    !/^\d{4}-\d\d-\d\d$/.test(bridge.marketDate||'')||
    bridge.selectedCount!==null||bridge.zeroPickDay!==null||
    bridge.strategyPitCertified!==false||
    bridge.selectionAuthorized!==false||bridge.frozenDecisionWritten!==false||
    bridge.cloudflareD1Writes!==0||bridge.cloudflareR2Writes!==0)
  bad('BOUNDARY_OR_CLOCK_INVALID');
 if(runId!==null&&(!/^\d+$/.test(String(runId))))bad('RUN_ID_INVALID');
 const base={
  schemaVersion:'S2_DAILY_SELECTION_READINESS_V0_1',
  marketDate:bridge.marketDate,observedAtUtc:bridge.freezeAtUtc,
  workflowRunId:runId===null?null:String(runId),
  strategyId:'SHORT_MOMENTUM',
  strategyVersion:'V0.1-CONTRACT',
  sourcePairsObserved:bridge.actualSourcePairs??null,
  sourcePairsRequired:122,
  originalSourceReceiptHash:bridge.sourceReceiptHash??null,
  independentSourceAuditHash:bridge.auditReceiptHash??null,
  sourceLedgerHash:bridge.sourceLedger?.ledgerSha256??null,
  stage1AdmissionHash:bridge.evaluation?.admissionHash??null,
  stage1EvaluationHash:bridge.evaluation?.evaluationHash??null,
  ordinaryUniverseCount:null,
  // Source four-digit membership is NOT a positively certified common-share class.
  // Stage1 local PIT input passes are research-only, never a formal audit signoff.
  sourceInstrumentUniverseKind:'FOUR_DIGIT_SOURCE_MEMBERSHIP_NOT_CLASS_CERTIFIED',
  formallyPITCertifiedUniverseCount:null,
  stage1PitInputPassedCount:null,stage1PitInputUnknownCount:null,
  perMarketPITInputCounts:null,
  assessedCount:null,incompleteCount:null,watchCount:null,rejectedCount:null,
  qualifiedNotSelectedCount:null,
  qualifiedUnrankedResearchRows:[],
  unresolvedReasonCounts:[],
  finalSelectionEligible:false,
  rankCapacityAuthorized:false,
  selectedCount:null,zeroPickDay:null,
  durableFrozenReadbackVerified:false,frozenDecisionWritten:false,
  noEventCorporateActionAssumed:false,
  tradingEnabled:false,realMoneyImpact:false,pushEnabled:false,
  system1FormalRuntimeTouched:false,cloudflareD1Writes:0,cloudflareR2Writes:0,
 };
 if(bridge.state==='BLOCKED_NO_ELIGIBLE_SOURCE_LEDGER'){
  if(bridge.sourceLedger!==null||bridge.evaluation!==null||
     !Array.isArray(bridge.blockers)||bridge.blockers.length===0)bad('BLOCKED_SOURCE_MUST_HAVE_REASONS');
  const b={...base,state:'BLOCKED_SOURCE_NOT_SELECTION',
   blockers:[...bridge.blockers].sort()};
  return Object.freeze({...b,receiptHash:await sha256Hex(b)});
 }
 if(bridge.state!=='STAGE1_RESEARCH_EXECUTED_PIT_CONTINUITY_GATED'||
    bridge.auditedSourceOnly!==true||
    bridge.actualSourcePairs!==122||bridge.requiredSourcePairs!==122||
    !HASH.test(bridge.sourceReceiptHash||'')||!HASH.test(bridge.auditReceiptHash||''))
  bad('STAGE1_RESEARCH_SOURCE_NOT_ACCEPTED');
 const ledger=bridge.sourceLedger,admission=bridge.evaluation,e=admission?.evaluation;
 if(ledger?.schemaVersion!=='S2_SOURCE_FIRST_PROSPECTIVE_LEDGER_V0_1'||
    ledger.sourceState!=='READY'||!HASH.test(ledger.ledgerSha256||'')||
    await sha256Hex(strip(ledger,'ledgerSha256'))!==ledger.ledgerSha256||
    ledger.marketDate!==bridge.marketDate||
    !UTC.test(ledger.observedAt||'')||
    ledger.sourceOrdinarySymbolCount!==ledger.observations?.length||
    ledger.selectionState!=='NOT_EXECUTED_REQUIRED_PIT_HISTORY_AND_CONTINUITY_MISSING'||
    admission?.schemaVersion!=='S2_SHARED_OFFICIAL_A1_STAGE1_ADMISSION_V0_1'||
    admission.selectedCount!==null||admission.zeroPickDay!==null||
    admission.selectionAuthorized!==false||admission.durableFrozenDecisionWritten!==false||
    admission.marketDate!==bridge.marketDate||
    admission.currentSourceLedgerHash!==ledger.ledgerSha256||
    admission.evaluationAtUtc!==e?.evaluationAtUtc||
    admission.sourceReceiptHash!==bridge.sourceReceiptHash||
    admission.independentAuditHash!==bridge.auditReceiptHash||
    !HASH.test(admission.admissionHash||'')||
    await sha256Hex(strip(strip(admission,'admissionHash'),'evaluation'))!==admission.admissionHash||
    e?.schemaVersion!=='S2_SOURCE_FIRST_SM_EVALUATION_V0_1'||
    e.marketDate!==bridge.marketDate||
    e.sourceLedgerHash!==ledger.ledgerSha256||
    e.assessorPolicyId!=='S2-ASSESSOR-SM-LAUNCH-001'||
    e.assessorPolicyVersion!=='0.1-LAUNCH'||
    !UTC.test(e.evaluationAtUtc||'')||
    Date.parse(e.evaluationAtUtc)>Date.parse(bridge.freezeAtUtc)||
    Date.parse(ledger.observedAt)>Date.parse(e.evaluationAtUtc)||
    e.strategyId!=='SHORT_MOMENTUM'||e.strategyVersion!=='V0.1-CONTRACT'||
    e.selectedCount!==null||e.zeroPickDay!==null||
    e.finalSelectionEnabled!==false||e.ordersEnabled!==false||
    !HASH.test(e.evaluationHash||'')||
    await sha256Hex(strip(e,'evaluationHash'))!==e.evaluationHash||
    e.evaluationHash!==admission.evaluationHash||
    e.universeCount!==ledger.sourceOrdinarySymbolCount||
    !Array.isArray(e.observations)||e.observations.length!==e.universeCount)
  bad('HASH_LINEAGE_OR_STAGE1_AUTHORITY_INVALID');
 // A valid ledger hash and a valid assessor hash do not themselves prove that
 // they describe the SAME official row. Bind the pair for every universe item
 // before publishing user-facing qualified-research rows.
 const sourceRows=new Map();
 for(const row of ledger.observations){
  if(!/^[1-9][0-9]{3}$/.test(row?.symbol||'')||
     !['TWSE','TPEX'].includes(row.market)||
     row.marketDate!==bridge.marketDate||
     !HASH.test(row.sourceRowHash||'')||
     !UTC.test(row.observedAt||'')||!UTC.test(row.availableAt||'')||
     Date.parse(row.availableAt)>Date.parse(row.observedAt)||
     Date.parse(row.observedAt)>Date.parse(e.evaluationAtUtc))
    bad('SOURCE_ROW_IDENTITY_OR_PIT_INVALID');
  if(sourceRows.has(row.symbol))bad('SOURCE_DENOMINATOR_DUPLICATED');
  sourceRows.set(row.symbol,row);
 }
 if(sourceRows.size!==ledger.sourceOrdinarySymbolCount)
  bad('SOURCE_DENOMINATOR_MISMATCH');
 const observed=new Set(),counts={INCOMPLETE:0,REJECTED:0,WATCH:0,QUALIFIED_NOT_SELECTED:0};
 const reasons=new Map(),qualified=[];
 const perMarket={
  TWSE:{sourceCount:0,stage1PitInputPassed:0,stage1PitInputUnknown:0,
        rejected:0,watch:0,qualifiedNotSelected:0},
  TPEX:{sourceCount:0,stage1PitInputPassed:0,stage1PitInputUnknown:0,
        rejected:0,watch:0,qualifiedNotSelected:0},
 };
 for(const row of e.observations){
  const original=sourceRows.get(row?.symbol);
  if(!original||observed.has(row.symbol)||!states.has(row.state))
   bad('STAGE1_SYMBOL_OR_STATE_INVALID');
  if(row.market!==original.market||
     (row.companyName??null)!==(original.companyName??null)||
     row.sourceRowHash!==original.sourceRowHash||
     row.evaluatedClose!==(Number.isFinite(original.close)&&original.close>0
       ?original.close:null))
    bad('STAGE1_SOURCE_ROW_LINEAGE_INVALID');
  observed.add(row.symbol);counts[row.state]++;
  const venue=perMarket[original.market];
  venue.sourceCount++;
  if(row.state==='INCOMPLETE')venue.stage1PitInputUnknown++;
  else venue.stage1PitInputPassed++;
  if(row.state==='REJECTED')venue.rejected++;
  if(row.state==='WATCH')venue.watch++;
  if(row.state==='QUALIFIED_NOT_SELECTED')venue.qualifiedNotSelected++;
  if(row.state==='QUALIFIED_NOT_SELECTED'){
   if(row.strategyValidity!=='VALID'||row.entryReadiness!=='BUY_ELIGIBLE'||
      !HASH.test(row.factorsHash||'')||!HASH.test(row.assessmentHash||''))
    bad('QUALIFIED_RESEARCH_MISSING_ACCEPTANCE');
   qualified.push({symbol:row.symbol,companyName:row.companyName??null,
    market:row.market,sourceRowHash:row.sourceRowHash,
    factorsHash:row.factorsHash,assessmentHash:row.assessmentHash,
    classification:'QUALIFIED_RESEARCH_NOT_SELECTED',
    rank:null,triggerPrice:null,stop:null,targets:null});
  } else if(row.state==='INCOMPLETE'){
   // Incomplete MUST have a traceable reason; a silently empty UNKNOWN bucket
   // hides the exact PIT family DATA must deliver and misleads M09 reporting.
   if(!Array.isArray(row.reasonCodes)||row.reasonCodes.length===0||
      row.reasonCodes.some(code=>typeof code!=='string'||code.length===0||
        code.length>256||code.trim()!==code||/[\r\n]/.test(code)))
     bad('INCOMPLETE_REASON_MISSING_OR_INVALID');
   for(const code of new Set(row.reasonCodes))
     reasons.set(code,(reasons.get(code)||0)+1);
  }
 }
 if(observed.size!==sourceRows.size||
    counts.INCOMPLETE!==e.incompleteCount||
    e.assessedCount!==sourceRows.size-counts.INCOMPLETE||
    counts.QUALIFIED_NOT_SELECTED!==e.qualifiedNotSelectedCount)
  bad('ASSESSMENT_DENOMINATOR_MISMATCH');
 // No numerically tuned rank or artificial Top-N. Stable IDs are NOT rank order.
 qualified.sort((a,b)=>a.symbol.localeCompare(b.symbol));
 const ready=counts.INCOMPLETE===0;
 const b={...base,
  state:!ready?'DAILY_STRATEGY_INPUT_INCOMPLETE':
    qualified.length?'QUALIFIED_RESEARCH_PENDING_RANK_CAPACITY_FROZEN':
      'STRATEGY_ASSESSED_NO_QUALIFIED_RESEARCH_PENDING_FINAL_GATE',
  blockers:!ready?['UNRESOLVED_SYMBOL_LOCAL_STRATEGY_PIT_OR_CONTINUITY'] :
   ['FINAL_RANK_CAPACITY_AND_DURABLE_FROZEN_NOT_AUTHORIZED'],
  ordinaryUniverseCount:sourceRows.size,
  assessedCount:e.assessedCount,incompleteCount:counts.INCOMPLETE,
  watchCount:counts.WATCH,rejectedCount:counts.REJECTED,
  qualifiedNotSelectedCount:counts.QUALIFIED_NOT_SELECTED,
  // Only locally verified Stage1 assessor inputs, NOT formal full-universe PIT.
  stage1PitInputPassedCount:e.assessedCount,
  stage1PitInputUnknownCount:counts.INCOMPLETE,
  perMarketPITInputCounts:perMarket,
  qualifiedUnrankedResearchRows:qualified,
  unresolvedReasonCounts:[...reasons].map(([code,count])=>({code,count}))
    .sort((a,b)=>b.count-a.count||a.code.localeCompare(b.code)),
 };
 return Object.freeze({...b,receiptHash:await sha256Hex(b)});
}
