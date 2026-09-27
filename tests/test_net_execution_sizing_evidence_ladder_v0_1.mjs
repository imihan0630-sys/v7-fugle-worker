import assert from "node:assert/strict";
import {classifyNetSizingEvidence} from "../research/net_execution_sizing_evidence_ladder_v0_1.mjs";

const base={
 generationCertified:true,
 positiveSignalCertified:true,
 counterfactualOrderable:true,
 confirmedFillAttributed:true,
 sameSelectedNamesAndDeployment:true,
 comparatorExecutionDefined:true,
 untriggeredCapitalCashTreatmentFrozen:true,
 terminalEvidenceMode:"ATTRIBUTED_TERMINAL_FILL"
};

let x=classifyNetSizingEvidence({...base,commissionQuality:"UNKNOWN",taxQuality:"MODELED",slippageQuality:"ACTUAL"});
assert.equal(x.status,"GROSS_EXECUTION_SIZING_EDGE_ELIGIBLE");
assert.equal(x.explicitNetEligible,false);

x=classifyNetSizingEvidence({...base,commissionQuality:"MODELED",taxQuality:"MODELED",slippageQuality:"ACTUAL"});
assert.equal(x.status,"NET_ALL_IN_SIZING_EDGE_ELIGIBLE");
assert.equal(x.quality.containsModeled,true);
assert.equal(x.labelingRule,"MODELED_OR_MIXED_NET_EXECUTION");

x=classifyNetSizingEvidence({...base,commissionQuality:"ACTUAL",taxQuality:"ACTUAL",slippageQuality:"ACTUAL"});
assert.equal(x.status,"NET_ALL_IN_SIZING_EDGE_ELIGIBLE");
assert.equal(x.quality.fullyActual,true);
assert.equal(x.labelingRule,"ACTUAL_NET_EXECUTION");

x=classifyNetSizingEvidence({...base,confirmedFillAttributed:false,commissionQuality:"ACTUAL",taxQuality:"ACTUAL",slippageQuality:"ACTUAL"});
assert.equal(x.status,"NOT_EXECUTION_ELIGIBLE");
assert.ok(x.blockers.includes("CONFIRMED_FILL_NOT_SIGNAL_ATTRIBUTED"));

x=classifyNetSizingEvidence({...base,terminalEvidenceMode:"NONE",commissionQuality:"ACTUAL",taxQuality:"ACTUAL",slippageQuality:"ACTUAL"});
assert.equal(x.status,"NOT_EXECUTION_ELIGIBLE");

x=classifyNetSizingEvidence({...base,commissionQuality:"ACTUAL",taxQuality:"ACTUAL",slippageQuality:"UNKNOWN"});
assert.equal(x.status,"NET_EXPLICIT_SIZING_EDGE_ELIGIBLE");
assert.equal(x.allInNetEligible,false);

console.log(JSON.stringify({ok:true,cases:6,rule:"net sizing claim strength is evidence-tiered; UNKNOWN cost never becomes zero and modeled cost never becomes ACTUAL"},null,2));
