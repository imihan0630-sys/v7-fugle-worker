import assert from "node:assert/strict";
import { buildResonanceComparisonFrameV0_1 as frame, buildResonanceComparisonPairV0_1 as pair,
  persistResonanceComparisonV0_1 as persist } from "../runtime/resonance_comparison_frame_v0_1.mjs";
import { sha256Hex } from "../runtime/decision_archive.mjs";

class Db {
  rows = new Map(); drop = false;
  prepare(sql) { const db=this; return { sql, params: [], bind(...params){this.params=params;return this;},
    async first(){return db.rows.get(this.params[0]) || null;} }; }
  async batch(statements) {return statements.map(s=>{
    const names=s.sql.match(/INSERT INTO s2_infrastructure_checks \(([^)]+)\)/)?.[1];
    assert(names, "only isolated infrastructure records permitted");
    const row=Object.fromEntries(names.split(", ").map((name,i)=>[name,s.params[i]]));
    if(!this.drop)this.rows.set(row.check_id,row);
    return {success:true};
  });}
}
const date="2026-10-02", clock="2026-10-02T05:31:00.000Z", h="a".repeat(64);
const base={pool:{poolId:"P1",poolHash:h,sourceCapacityRunId:"C1",sourceCapacityHash:h,
  sourceMarketDate:"2026-10-01",sourceDecisionTimestamp:"2026-10-01T10:00:00Z",
  sourceDenominatorState:"PARTIAL",sourceDenominatorProvenanceHash:"b".repeat(64),
  sourceDenominatorProvenance:{version:"S2_SELECTION_DENOMINATOR_PROVENANCE_V0_1",denominatorState:"PARTIAL",
    unresolvedCount:1,unresolvedByState:{INCOMPLETE:1},blockerCodes:[],
    contributingShadowRuns:[{strategyId:"SHORT_MOMENTUM",strategyVersion:"V0.1-CONTRACT",runId:"RUN1",shadowAccountingHash:"c".repeat(64),runFingerprintHash:null}],
    provenanceHash:"b".repeat(64),legacyProvenanceIncomplete:false},
  activatedAt:"2026-10-01T11:00:00Z",
  state:"ACTIVE",fullMarketScan:false,symbolCount:1,symbols:[{symbol:"2330",strategyMemberships:["SHORT_MOMENTUM"]}]},
  symbol:"2330",marketDate:date,asOf:clock,
  sourceReceipt:{sourceId:"FUGLE_FIXTURE_ONLY",sourceReceiptHash:h,historyPayloadHash:h,quotePayloadHash:h,
    adjustmentVersion:"FIXTURE_V1",priceSpace:"ADJUSTED",availableAt:clock,observedAt:clock,pointInTimeEligible:true},
  monitorInput:{historyBars:[],currentDailyBar:{date,open:100,high:101,low:99,close:100,volumeShares:1000},
    currentDailyBarState:"FINAL",continuityState:"ADJUSTED_CONTINUITY",priorLifecycleState:"WATCH"}};
const f=await frame(base), missing=await pair({frame:f});
assert.equal(missing.state,"CHALLENGER_NOT_PREREGISTERED");
assert.equal(missing.challenger,null);
assert.equal(missing.outcome,null);
assert.equal(missing.outcomeEvaluationReady,false);
assert.equal(f.baseline.snapshot.formulaVersion.fastEma,16);
assert.equal(f.baseline.snapshot.formulaVersion.slowEma,64);
assert.equal(f.cost.state,"UNKNOWN");
assert.equal(f.regime.state,"UNKNOWN");
assert.equal(f.pool.sourceDenominatorState,"PARTIAL");
assert.equal(f.pool.sourceDenominatorProvenance.denominatorState,"PARTIAL");
assert.equal(f.pool.sourceDenominatorProvenance.contributingShadowRuns[0].runId,"RUN1");
assert(Object.isFrozen(f.monitorInput.historyBars));
const stripped=await frame({...base,monitorInput:{...base.monitorInput,outcome:"FUTURE_WIN",currentDailyBar:{...base.monitorInput.currentDailyBar,outcome:999}}});
assert.equal(stripped.frameHash,f.frameHash);
assert.equal((await frame({...base,asOf:"2026-10-02T13:31:00+08:00"})).frameHash,f.frameHash);
await assert.rejects(()=>frame({...base,symbol:"2317"}),/MEMBERSHIP/);
await assert.rejects(()=>frame({...base,pool:{...base.pool,symbolCount:2}}),/BOUNDED_POOL/);
await assert.rejects(()=>frame({...base,pool:{...base.pool,sourceMarketDate:date}}),/FUTURE_POOL/);
await assert.rejects(()=>frame({...base,sourceReceipt:{...base.sourceReceipt,availableAt:"2026-10-02T05:32:00Z"}}),/NOT_PIT/);
await assert.rejects(()=>frame({...base,asOf:"2026-10-02T04:00:00Z",sourceReceipt:{...base.sourceReceipt,observedAt:"2026-10-02T04:00:00Z",availableAt:"2026-10-02T04:00:00Z"}}),/PRE_CLOSE_FINALITY/);
await assert.rejects(()=>pair({frame:{...f,symbol:"2317"}}),/HASH_MISMATCH/);
await assert.rejects(()=>pair({frame:{...f,frameId:"forged"}}),/ID_MISMATCH/);
// Synthetic registry/observations test transport gates; no real Challenger
// formula, indicator, threshold, owner approval or market evidence is authored.
const registration={lane:"SYSTEM2_RESONANCE_CHALLENGER_V0_1",state:"PREREGISTERED_SHADOW",
  formulaVersion:"SYNTHETIC_TRANSPORT_TEST_ONLY",parameters:{fixture:true},
  parameterHash:await sha256Hex({fixture:true}),governanceRef:"fixture-not-approval",
  registeredAt:"2026-10-01T00:00:00Z",availableAt:"2026-10-01T00:00:00Z"};
const challenger={frameId:f.frameId,frameHash:f.frameHash,formulaVersion:registration.formulaVersion,
  symbol:f.symbol,marketDate:f.marketDate,asOf:f.asOf,
  parameterHash:registration.parameterHash,registrationHash:await sha256Hex(registration),signalState:"NONE"};
const p=await pair({frame:f,registration,challenger});
assert.equal(p.state,"SHARED_INPUT_BINDING_VERIFIED");
assert.equal(p.challengerFormulaExecutionVerified,false);
assert.equal(p.countsTowardPromotionEvidence,false);
assert.equal(p.finalSelectionEnabled,false);
assert.equal((await pair({frame:f,registration,challenger:{...challenger,outcome:"LATER_WIN"}})).pairHash,p.pairHash);
await assert.rejects(()=>pair({frame:f,challenger}),/UNREGISTERED/);
await assert.rejects(()=>pair({frame:f,registration:{...registration,registeredAt:"2026-10-02T06:00:00Z"}}),/POST_OBSERVATION/);
await assert.rejects(()=>pair({frame:f,registration,challenger:{...challenger,frameHash:"b".repeat(64)}}),/INPUT_OR_VERSION/);
await assert.rejects(()=>pair({frame:f,registration,challenger:{...challenger,parameterHash:"b".repeat(64)}}),/INPUT_OR_VERSION/);
const live=await frame({...base,monitorInput:{...base.monitorInput,currentDailyBarState:"LIVE"}});
await assert.rejects(()=>pair({frame:live,registration,challenger:{...challenger,frameId:live.frameId,frameHash:live.frameHash,signalState:"CONFIRMED"}}),/FINALITY_MISMATCH/);
const db=new Db();
assert.equal((await persist({db,frame:f,pair:p})).state,"IMMUTABLE_COMPARISON_INPUT_READBACK_VERIFIED");
const before=db.rows.size;
await persist({db,frame:f,pair:p});assert.equal(db.rows.size,before);
const changed=await frame({...base,sourceReceipt:{...base.sourceReceipt,quotePayloadHash:"b".repeat(64)}});
assert.equal(changed.frameId,f.frameId);
await assert.rejects(async()=>persist({db,frame:changed,pair:await pair({frame:changed})}),/IMMUTABLE_CONFLICT/);
const nextFrame=await frame({...base,asOf:"2026-10-02T05:32:00Z"});
const revised={...registration,parameters:{fixture:false},parameterHash:await sha256Hex({fixture:false})};
const revisedPair=await pair({frame:nextFrame,registration:revised});
await assert.rejects(()=>persist({db,frame:nextFrame,pair:revisedPair}),/IMMUTABLE_CONFLICT/);
const lost=new Db();lost.drop=true;
await assert.rejects(
  ()=>persist({db:lost,frame:f,pair:missing}),
  /READBACK_MISMATCH|POST_WRITE_VERIFICATION_FAILED/,
);
console.log("Resonance comparison frames: immutable input/version/PIT/finality/authority gates PASS");
