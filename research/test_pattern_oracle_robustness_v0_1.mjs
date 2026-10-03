import assert from "node:assert/strict";
import {compareOracleZones,oracleMappingState} from "./pattern_oracle_robustness_v0_1.mjs";

let pass=0;const t=(n,f)=>{f();pass++;console.log("PASS",n);};
const p={symbol:"2330",asOf:"2026-09-20",semanticSpaceId:"TECH",lower:100,upper:104,center:102,confirmedAt:"2026-09-19",anchorTimes:["d1","d3","d5"]};

t("OR01 identical zones have overlap 1",()=>{
 const r=compareOracleZones({primary:p,alternative:{...p}});
 assert.equal(r.boundaryOverlapJaccard,1);
 assert.equal(r.centerDistanceAbs,0);
});

t("OR02 partial overlap continuous",()=>{
 const r=compareOracleZones({primary:p,alternative:{...p,lower:102,upper:106,center:104}});
 assert.equal(r.boundaryOverlapJaccard,2/6);
});

t("OR03 disjoint zones overlap zero",()=>{
 const r=compareOracleZones({primary:p,alternative:{...p,lower:110,upper:114,center:112}});
 assert.equal(r.boundaryOverlapJaccard,0);
});

t("OR04 center distance ATR normalized",()=>{
 const r=compareOracleZones({primary:p,alternative:{...p,lower:104,upper:108,center:106},atr:2});
 assert.equal(r.centerDistanceATR,2);
});

t("OR05 anchor-time overlap is continuous",()=>{
 const r=compareOracleZones({primary:p,alternative:{...p,anchorTimes:["d3","d5","d7"]}});
 assert.equal(r.anchorTimeJaccard,2/4);
});

t("OR06 cross-symbol blocks",()=>{
 const r=compareOracleZones({primary:p,alternative:{...p,symbol:"2317"}});
 assert.equal(r.reason,"CROSS_SYMBOL_COMPARISON");
});

t("OR07 asOf mismatch blocks",()=>{
 const r=compareOracleZones({primary:p,alternative:{...p,asOf:"2026-09-21"}});
 assert.equal(r.reason,"ASOF_MISMATCH");
});

t("OR08 semantic conflict blocks",()=>{
 const r=compareOracleZones({primary:p,alternative:{...p,semanticSpaceId:"RAW"}});
 assert.equal(r.reason,"SEMANTIC_SPACE_CONFLICT");
});

t("OR09 future alternative confirmation blocks",()=>{
 const r=compareOracleZones({primary:p,alternative:{...p,confirmedAt:"2026-09-21"}});
 assert.match(r.reason,/FUTURE_CONFIRMATION/);
});

t("OR10 oracle comparison never creates vote",()=>{
 const r=compareOracleZones({primary:p,alternative:{...p}});
 assert.equal(r.independentVoteEligible,false);
});

t("OR11 one alternative maps uniquely",()=>{
 assert.equal(oracleMappingState({alternativeCount:1}),"UNIQUE_COMPARABLE_OBJECT");
});

t("OR12 multiple alternatives remain ambiguous",()=>{
 assert.equal(oracleMappingState({alternativeCount:2}),"MULTI_OBJECT_AMBIGUOUS");
});

console.log(`SUMMARY ${pass}/12 PASS`);
