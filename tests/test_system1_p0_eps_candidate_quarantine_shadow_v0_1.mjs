import assert from "node:assert/strict";
import {reviewEpsQuarantineShadow,INPUT_KIND,REQUIRED_C_URL} from
 "../research/system1_p0_eps_candidate_quarantine_shadow_v0_1.mjs";
const DATE="2026-10-16";
const gates=Object.fromEntries(["TWSE","TPEx","HISTORY60","INSTITUTION",
  "FINANCIAL","VALUATION","ANNOUNCEMENTS","INDEX","TDCC"].map(k=>[k,true]));
const row=(overrides={})=>({
 quarterEpsSource:REQUIRED_C_URL,
 epsBasis:"MOPS合併綜合損益表直接公告單季EPS",
 quarterEpsYear:2026,quarterEpsQuarter:2,quarterEpsVerified:true,
 quarterEPS:0.0,previousQuarterEpsVerified:true,
 previousQuarterEpsYear:2026,previousQuarterEpsQuarter:1,
 previousQuarterEPS:-0.15,...overrides
});
const stock=(symbol,close,rank)=>({symbol,close,
 channel:rank%2===0?"A":"B",signalLevel:"A",
 rewardPerRisk:rank,priorityScore:rank,setupQuality:rank,
 sectorFlow:rank,relativeStrength:rank});
const pre=[
 stock("3236",200,9),stock("5340",300,8),stock("3147",150,7),
 stock("4167",1050,6),stock("6122",1230,5),stock("3008",1200,4),
 stock("2340",25,3),stock("8111",70,2),stock("3443",1300,1)
];
const baseRows=Object.fromEntries(pre.map(c=>[c.symbol,row()]));
const snapshot=(stocks=baseRows,override={})=>({asOfDate:DATE,year:2026,quarter:2,
 count:Object.keys(stocks).length,stocks,...override});
const args=(override={})=>({
 marketDate:DATE,officialMarketDate:DATE,year:2026,quarter:2,
 preScored:pre,cohortKind:INPUT_KIND,verifiedOriginalSelectorCohort:true,
 originalFullUniverseScanComplete:true,globalGates:gates,
 quarterSnapshot:snapshot(),holdings:[],...override
});
let checks=0;
const ok=(check,label)=>{assert.ok(check,label);checks++;};
const eq=(a,b,label)=>{assert.deepEqual(a,b,label);checks++;};
let x=reviewEpsQuarantineShadow(args());
eq(x.status,"SHADOW_PARTIAL_OR_COMPLETE_EPS_VERIFIED");
eq(x.selected.map(y=>y.symbol),["3236","3147","2340","4167","6122","3008"]);
eq(x.selectedCount,6);
eq(x.remainingGeneral,0);
eq(x.remainingThousand,0);
eq(x.quarantinedCount,0);
eq(x.formalEligible,false);
eq(x.canTrade,false);
eq(x.canWriteD1,false);
eq(x.canWriteKV,false);
eq(x.canSendPush,false);
eq(x.zeroPicksCertified,false);
eq(x.rankComparatorUnchanged,true);
const held=JSON.stringify(args()),input=args();
x=reviewEpsQuarantineShadow(input);
eq(JSON.stringify(input),JSON.stringify(args()),"no mutation of source/holdings");
eq(x.originalD1SourceReadbackCertified,false);
eq(x.sourcePitCertified,false);
const missing5340={...baseRows};delete missing5340["5340"];
x=reviewEpsQuarantineShadow(args({
 quarterSnapshot:snapshot(missing5340),
 holdings:[{symbol:"2340",positionStage:"FIRST",actualShares:1000,stop:35.4},
 {symbol:"8111",positionStage:"NONE",actualShares:0}]
}));
eq(x.status,"SHADOW_WITH_OPEN_POSITIONS_PRESERVED");
eq(x.quarantined.map(c=>c.symbol),["5340"]);
eq(x.quarantined[0].reason,"SOURCE_ROW_MISSING");
eq(x.selected.map(c=>c.symbol),["3236","3147","2340","4167","6122","3008"]);
eq(x.hasActualPositions,true);
eq(x.existingHoldingsRetained,true);
eq(x.canMutateHoldings,false);
const rowA={...baseRows,"5340":row({
 epsBasis:"MOPS個別綜合損益表",quarterEpsSource:REQUIRED_C_URL
})};
x=reviewEpsQuarantineShadow(args({quarterSnapshot:snapshot(rowA)}));
eq(x.quarantined.map(y=>y.symbol),["5340"]);
eq(x.quarantined[0].reason,"SOURCE_BASIS_OR_ORIGINAL_PARSER_NOT_CONFIRMED");
eq(x.selectedCount,6);
eq(x.zeroPicksCertified,false);
const wrongPrev={...baseRows,"3236":row({previousQuarterEpsQuarter:4})};
x=reviewEpsQuarantineShadow(args({quarterSnapshot:snapshot(wrongPrev)}));
eq(x.quarantined.map(y=>y.symbol),["3236"]);
eq(x.quarantined[0].reason,"PREVIOUS_QUARTER_EPS_UNVERIFIED");
const missingCurrent={...baseRows,"3147":row({quarterEpsVerified:false})};
x=reviewEpsQuarantineShadow(args({quarterSnapshot:snapshot(missingCurrent)}));
eq(x.quarantined[0].reason,"CURRENT_QUARTER_EPS_UNVERIFIED");
const noNumeric={...baseRows,"6122":row({quarterEPS:null})};
x=reviewEpsQuarantineShadow(args({quarterSnapshot:snapshot(noNumeric)}));
eq(x.quarantined.map(y=>y.symbol),["6122"]);
const sourceWrong={...baseRows,"3236":row({quarterEpsYear:2025})};
x=reviewEpsQuarantineShadow(args({quarterSnapshot:snapshot(sourceWrong)}));
eq(x.quarantined[0].reason,"SOURCE_COMPANY_PERIOD_MISMATCH");
x=reviewEpsQuarantineShadow(args({quarterSnapshot:snapshot({},{})}));
eq(x.status,"ALL_PRE_CANDIDATES_QUARANTINED_NOT_ZERO");
eq(x.selectedCount,0);
eq(x.zeroPicksCertified,false);
eq(x.missingDoesNotMeanZero,true);
eq(x.quarantinedCount,9);
x=reviewEpsQuarantineShadow(args({preScored:[]}));
eq(x.status,"EMPTY_COHORT_REQUIRES_FORMAL_PARENT_PROOF");
eq(x.zeroPicksCertified,false);
x=reviewEpsQuarantineShadow(args({quarterSnapshot:null}));
eq(x.status,"BLOCKED");
eq(x.reason,"GLOBAL_QUARTER_EPS_SNAPSHOT_WRONG_DATE_OR_MISSING");
eq(x.selectedCount,null);
eq(x.quarantinedCount,undefined);
x=reviewEpsQuarantineShadow(args({quarterSnapshot:snapshot(baseRows,{asOfDate:"2026-10-15"})}));
eq(x.reason,"GLOBAL_QUARTER_EPS_SNAPSHOT_WRONG_DATE_OR_MISSING");
x=reviewEpsQuarantineShadow(args({quarterSnapshot:snapshot(baseRows,{count:999})}));
eq(x.reason,"GLOBAL_QUARTER_EPS_SNAPSHOT_INVALID_COUNT_OR_KEYS");
x=reviewEpsQuarantineShadow(args({globalGates:{...gates,INSTITUTION:false}}));
eq(x.reason,"GLOBAL_GATE_INSTITUTION_NOT_READY");
x=reviewEpsQuarantineShadow(args({globalGates:{...gates,HISTORY60:false}}));
eq(x.reason,"GLOBAL_GATE_HISTORY60_NOT_READY");
x=reviewEpsQuarantineShadow(args({globalGates:{...gates,TWSE:false}}));
eq(x.reason,"GLOBAL_GATE_TWSE_NOT_READY");
x=reviewEpsQuarantineShadow(args({officialMarketDate:"2026-10-15"}));
eq(x.reason,"DATE_OR_QUARTER_NOT_VERIFIED");
x=reviewEpsQuarantineShadow(args({verifiedOriginalSelectorCohort:false}));
eq(x.reason,"ORIGINAL_PRE_QUOTA_COHORT_NOT_VERIFIED");
x=reviewEpsQuarantineShadow(args({originalFullUniverseScanComplete:false}));
eq(x.reason,"ORIGINAL_PRE_QUOTA_COHORT_NOT_VERIFIED");
x=reviewEpsQuarantineShadow(args({preScored:[pre[0],pre[0]]}));
eq(x.reason,"DUPLICATE_CANDIDATE_REJECTED");
x=reviewEpsQuarantineShadow(args({preScored:[{...pre[0],close:9.5}]}));
eq(x.reason,"ORIGINAL_RANKED_CANDIDATES_INVALID");
x=reviewEpsQuarantineShadow(args({preScored:[{...pre[0],rewardPerRisk:NaN}]}));
eq(x.reason,"ORIGINAL_RANKED_CANDIDATES_INVALID");
x=reviewEpsQuarantineShadow(args({holdings:[{symbol:"2340",actualShares:1000}]}));
eq(x.reason,"HOLDING_STATE_UNKNOWN");
// Reject a bad selected top-name WITHOUT losing genuine runner-up from SAME pool.
// General top three = 3236, 5340, 3147; remove 3236 -> 5340,3147,2340.
const miss3236={...baseRows};delete miss3236["3236"];
x=reviewEpsQuarantineShadow(args({quarterSnapshot:snapshot(miss3236)}));
eq(x.selected.filter(c=>c.pool==="GENERAL").map(c=>c.symbol),["5340","3147","2340"]);
eq(x.selected.filter(c=>c.pool==="THOUSAND").map(c=>c.symbol),["4167","6122","3008"]);
eq(x.remainingGeneral,0);
eq(x.remainingThousand,0);
// No cross pool substitution.
const onlyThousand=Object.fromEntries(["4167","6122","3008","3443"].map(c=>[c,row()]));
x=reviewEpsQuarantineShadow(args({quarterSnapshot:snapshot(onlyThousand)}));
eq(x.selected.filter(c=>c.pool==="GENERAL").length,0);
eq(x.selected.filter(c=>c.pool==="THOUSAND").length,3);
eq(x.remainingGeneral,3);
eq(x.remainingThousand,0);
eq(x.missingDoesNotMeanZero,false);
ok(!x.selected.some(c=>x.quarantined.some(q=>q.symbol===c.symbol)),"quarantined never selected");
ok(!x.selected.some(c=>c.canTrade),"no shadow candidate tradable");
console.log("System1 EPS quarantined-candidate Shadow: "+checks+" deterministic assertions PASS; no Formal/production mutations.");
