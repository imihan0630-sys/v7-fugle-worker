import test from 'node:test';
import assert from 'node:assert/strict';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {buildDailySelectionReadinessReceiptV0_1 as ready}
 from '../runtime/daily_selection_readiness_v0_1.mjs';
import {buildStage1DailySymbolAccountingV0_1 as account,
 renderStage1DailySymbolAccountingV0_1 as render}
 from '../runtime/stage1_daily_symbol_accounting_v0_1.mjs';
const H='a'.repeat(64),D='2026-10-16',AT='2026-10-16T15:45:00Z';
const blocked=()=>({
 schemaVersion:'S2_SHARED_A1_SOURCE_LEDGER_BRIDGE_V0_1',
 state:'BLOCKED_NO_ELIGIBLE_SOURCE_LEDGER',marketDate:D,
 freezeAtUtc:AT,blockers:['INDEPENDENT_SOURCE_AUDIT_NOT_122_OF_122'],
 actualSourcePairs:121,requiredSourcePairs:122,sourceReceiptHash:H,auditReceiptHash:H,
 auditedSourceOnly:false,sourceLedger:null,evaluation:null,eligibleSourceSymbolCount:null,
 selectedCount:null,zeroPickDay:null,strategyPitCertified:false,
 selectionAuthorized:false,frozenDecisionWritten:false,
 cloudflareD1Writes:0,cloudflareR2Writes:0
});
const raw=[{market:'TWSE',symbol:'2330',companyName:'臺積電',close:100},
 {market:'TPEX',symbol:'3287',companyName:'廣明',close:101}];
async function fixture({qualified=false,watch=false}={}){
 const rows=raw.map(x=>({...x,marketDate:D,sourceRowHash:H,observedAt:AT,availableAt:AT}));
 const lbase={schemaVersion:'S2_SOURCE_FIRST_PROSPECTIVE_LEDGER_V0_1',
  sourceState:'READY',marketDate:D,observedAt:AT,sourceOrdinarySymbolCount:2,
  observations:rows,selectionState:'NOT_EXECUTED_REQUIRED_PIT_HISTORY_AND_CONTINUITY_MISSING'};
 const l={...lbase,ledgerSha256:await sha256Hex(lbase)};
 const observations=raw.map((x,i)=>{
  const q=qualified&&i===0;
  const st=q?'QUALIFIED_NOT_SELECTED':watch?'WATCH':'INCOMPLETE';
  return {symbol:x.symbol,market:x.market,companyName:x.companyName,
   state:st,strategyValidity:q?'VALID':watch?'VALID':'INCOMPLETE',
   entryReadiness:q?'BUY_ELIGIBLE':watch?'WATCH':'BLOCKED',
   sourceRowHash:H,evaluatedClose:x.close,
   factorsHash:q?H:null,assessmentHash:q?H:null,
   reasonCodes:q?['TECHNICAL_SUPPORTIVE']:watch?[]:
     ['PIT_ORDINARY_EQUITY_INSTRUMENT_CLASS_UNVERIFIED']};
 });
 const incomplete=observations.filter(x=>x.state==='INCOMPLETE').length;
 const evalBase={schemaVersion:'S2_SOURCE_FIRST_SM_EVALUATION_V0_1',
  marketDate:D,evaluationAtUtc:AT,sourceLedgerHash:l.ledgerSha256,
  assessorPolicyId:'S2-ASSESSOR-SM-LAUNCH-001',
  assessorPolicyVersion:'0.1-LAUNCH',strategyId:'SHORT_MOMENTUM',
  strategyVersion:'V0.1-CONTRACT',universeCount:2,observations,
  assessedCount:2-incomplete,incompleteCount:incomplete,
  qualifiedNotSelectedCount:qualified?1:0,
  selectedCount:null,zeroPickDay:null,finalSelectionEnabled:false,ordersEnabled:false};
 const e={...evalBase,evaluationHash:await sha256Hex(evalBase)};
 const aBase={schemaVersion:'S2_SHARED_OFFICIAL_A1_STAGE1_ADMISSION_V0_1',
  marketDate:D,evaluationAtUtc:AT,currentSourceLedgerHash:l.ledgerSha256,
  sourceReceiptHash:H,independentAuditHash:H,
  evaluationHash:e.evaluationHash,selectedCount:null,zeroPickDay:null,
  selectionAuthorized:false,durableFrozenDecisionWritten:false};
 const a={...aBase,admissionHash:await sha256Hex(aBase),evaluation:e};
 return {...blocked(),state:'STAGE1_RESEARCH_EXECUTED_PIT_CONTINUITY_GATED',
  sourceLedger:l,evaluation:a,actualSourcePairs:122,auditedSourceOnly:true,blockers:[]};
}
async function make(b){
 const r=await ready({bridge:b,runId:'999'});
 return account({bridge:b,readiness:r});
}
test('121/122 source is neither zero picks nor an invented per-symbol decision',async()=>{
 const r=await make(blocked());
 assert.equal(r.state,'SOURCE_BLOCKED_NOT_ZERO_PICK');
 assert.equal(r.sourceFourDigitInstrumentCount,null);
 assert.equal(r.totalSymbolStateCounts,null);
 assert.equal(r.rows.length,0);
 assert.equal(r.selectedCount,null);
 assert.match(render(r),/不是 0/);
});
test('same source 2/2 unknown instruments are two explicit symbol PIT blockers',async()=>{
 const r=await make(await fixture());
 assert.equal(r.sourceFourDigitInstrumentCount,2);
 assert.equal(r.totalSymbolStateCounts.INCOMPLETE,2);
 assert.equal(r.actualQualifiedResearchRows,0);
 assert.deepEqual(r.rows.map(x=>[x.market,x.symbol,x.status]),[
  ['TPEX','3287','INCOMPLETE'],['TWSE','2330','INCOMPLETE']]);
 assert.equal(r.rows[0].reasonCodes[0],'PIT_ORDINARY_EQUITY_INSTRUMENT_CLASS_UNVERIFIED');
 assert.equal(r.certifiedOrdinaryShareDenominator,null);
 assert.equal(r.selectedCount,null);
 assert.equal(r.zeroPickDay,null);
 assert.match(render(r),/非正式選股/);
});
test('genuinely evaluated research qualified row still rank-null, formalSelected false',async()=>{
 const r=await make(await fixture({qualified:true}));
 assert.equal(r.totalSymbolStateCounts.QUALIFIED_NOT_SELECTED,1);
 assert.equal(r.totalSymbolStateCounts.INCOMPLETE,1);
 const row=r.rows.find(x=>x.symbol==='2330');
 assert.equal(row.status,'QUALIFIED_NOT_SELECTED');
 assert.equal(row.factorsHash,H);
 assert.equal(row.assessmentHash,H);
 assert.equal(row.rank,null);
 assert.equal(row.formalSelected,false);
 assert.equal(r.usableForFormalSelection,false);
 assert.equal(r.frozenD1Written,false);
 assert.equal(r.officialShadowAuthorized,false);
});
test('two watch rows cannot fabricate selected=0 or qualified result',async()=>{
 const r=await make(await fixture({watch:true}));
 assert.equal(r.totalSymbolStateCounts.WATCH,2);
 assert.equal(r.totalSymbolStateCounts.INCOMPLETE,0);
 assert.equal(r.actualQualifiedResearchRows,0);
 assert.equal(r.selectedCount,null);
 assert.equal(r.zeroPickDay,null);
});
test('tampering with independently signed daily readiness is rejected',async()=>{
 const b=await fixture({qualified:true});
 const r=await ready({bridge:b});
 const altered={...r,qualifiedNotSelectedCount:0};
 await assert.rejects(account({bridge:b,readiness:altered}),/READINESS_OR_LINEAGE_MUTATED/);
});
test('renaming an evaluated symbol after signing cannot create a plausible new row',async()=>{
 const b=await fixture();
 const r=await ready({bridge:b});
 b.evaluation.evaluation.observations[0].symbol='9999';
 await assert.rejects(account({bridge:b,readiness:r}),/HASH_LINEAGE_OR_STAGE1_AUTHORITY_INVALID/);
});
test('invalid requested report limit and attempts to show unlimited rows are refused',async()=>{
 const r=await make(await fixture());
 assert.throws(()=>render(r,{maxRows:101}),/RENDER_INPUT_INVALID/);
 assert.equal(render(r,{maxRows:1}).includes('已顯示 1/2 筆'),true);
});
