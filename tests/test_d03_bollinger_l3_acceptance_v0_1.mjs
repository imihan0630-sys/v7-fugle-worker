import assert from "node:assert/strict";
import {evaluateBollingerL3ParentV0_1,reconcileBollingerL3RunV0_1,D03_BOLLINGER_FORMULA_VERSION} from "../research/d03_bollinger_l3_acceptance_v0_1.mjs";

const parent={scanDate:"2026-10-05",captureGeneration:"GEN-1",symbol:"1788",parentSnapshotHash:"a".repeat(64),knownAt:"2026-10-05T15:30:00+08:00"};
const dates=Array.from({length:20},(_,i)=>"2026-09-"+String(6+i).padStart(2,"0"));
const bars=dates.map((date,i)=>({date,close:100+i,sourceFetchedAt:"2026-10-05T15:20:00+08:00",symbolSessionVerified:true,technicalContinuity:true,corporateActionContinuityResolved:true,priceLimitConstrained:false,sourceBarHash:String(i).padStart(64,"0")}));
const receipt={status:"VALID",symbol:"1788",continuitySpace:"TECHNICAL_CONTINUITY",formulaVersion:D03_BOLLINGER_FORMULA_VERSION,stdDefinition:"POPULATION",continuityReceiptId:"CONT-1",capturedAt:"2026-10-05T15:20:00+08:00",expectedEligibleSymbolSessions:dates,bars,unresolvedMissingSessions:0,unresolvedRelevantEvents:0};

const ok=evaluateBollingerL3ParentV0_1({parent,continuityReceipt:receipt});
assert.equal(ok.status,"VALID");assert.equal(ok.l3EvidenceEligible,true);assert.equal(ok.expectedSessionCount,20);
assert.ok(Math.abs(ok.values.sma20-109.5)<1e-12);
assert.ok(Math.abs(ok.values.popStd20-Math.sqrt(33.25))<1e-12);

const late=evaluateBollingerL3ParentV0_1({parent,continuityReceipt:{...receipt,capturedAt:"2026-10-05T15:31:00+08:00"}});
assert.equal(late.status,"DATA_BLOCKED");assert.ok(late.reasons.includes("CONTINUITY_CAPTURE_AFTER_PARENT"));

const missingBars=bars.slice(1);
const missing=evaluateBollingerL3ParentV0_1({parent,continuityReceipt:{...receipt,bars:missingBars}});
assert.equal(missing.status,"DATA_BLOCKED");assert.ok(missing.reasons.includes("BAR_COUNT_NOT_20"));

const duplicate=[...bars];duplicate[19]={...duplicate[19],date:duplicate[18].date};
const dup=evaluateBollingerL3ParentV0_1({parent,continuityReceipt:{...receipt,bars:duplicate}});
assert.equal(dup.status,"DATA_BLOCKED");assert.ok(dup.reasons.includes("BAR_DATE_DUPLICATE"));

const constrainedBars=bars.map((x,i)=>i===10?{...x,priceLimitConstrained:true}:x);
const constrained=evaluateBollingerL3ParentV0_1({parent,continuityReceipt:{...receipt,status:"VALID_BUT_CONSTRAINED",bars:constrainedBars}});
assert.equal(constrained.status,"VALID_BUT_CONSTRAINED");assert.equal(constrained.l3EvidenceEligible,true);assert.equal(constrained.ordinaryInterpretationEligible,false);

const p2={...parent,symbol:"1799",parentSnapshotHash:"b".repeat(64)};
const a1=evaluateBollingerL3ParentV0_1({parent,continuityReceipt:receipt});
const incomplete=reconcileBollingerL3RunV0_1({expectedParents:[parent,p2],attempts:[a1]});
assert.equal(incomplete.status,"INCOMPLETE");assert.equal(incomplete.missingCount,1);

const a2={...a1,parentKey:[p2.scanDate,p2.captureGeneration,p2.symbol,p2.parentSnapshotHash].join("|"),symbol:p2.symbol,status:"UNKNOWN"};
const complete=reconcileBollingerL3RunV0_1({expectedParents:[parent,p2],attempts:[a1,a2]});
assert.equal(complete.status,"COMPLETE");assert.equal(complete.expectedAttemptCount,2);assert.equal(complete.persistedAttemptCount,2);

console.log(JSON.stringify({status:"PASS",ok,late,missing,dup,constrained,incomplete,complete},null,2));
