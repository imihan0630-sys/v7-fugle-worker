import assert from "node:assert/strict";
import { buildFormalParentCaptureLedger } from "./formal_parent_capture_ledger_v0_1.mjs";

const ok=(symbol,score)=>({
  symbol,
  ok:true,
  basePassed:true,
  rrPassed:true,
  channel:"A",
  priorityScore:score,
  rewardPerRisk:2,
  marketConsensusScore:10,
  setupQuality:70,
  sectorFlow:60,
  relativeStrength:5,
});
const fail=(symbol,reason)=>({
  symbol,
  ok:false,
  basePassed:false,
  rrPassed:false,
  reason,
});

const features=[
  {symbol:"1101"},{symbol:"2330"},{symbol:"3008"},{symbol:"3105"},{symbol:"9999"},
];
const primary=[
  {symbol:"1101",evaluationOrdinal:0,result:ok("1101",80)},
  {symbol:"2330",evaluationOrdinal:1,result:ok("2330",75)},
  {symbol:"3008",evaluationOrdinal:2,result:ok("3008",90)},
  {symbol:"3105",evaluationOrdinal:3,result:fail("3105","LIQUIDITY")},
  {symbol:"9999",evaluationOrdinal:4,result:ok("9999",60)},
];
const thousand=[
  {symbol:"3008",evaluationOrdinal:0,result:ok("3008",90)},
  {symbol:"9999",evaluationOrdinal:1,result:ok("9999",60)},
];
const pools={
  "1101":"FORMAL_GENERAL",
  "2330":"FORMAL_GENERAL",
  "3008":"FORMAL_THOUSAND",
  "3105":"FORMAL_GENERAL",
  "9999":"FORMAL_THOUSAND",
};

const good=buildFormalParentCaptureLedger({
  featureRows:features,
  primaryEvaluations:primary,
  thousandEvaluations:thousand,
  poolBySymbol:pools,
  rankedGeneralSymbols:["1101","2330"],
  rankedThousandSymbols:["3008","9999"],
  selectedSymbols:["1101","2330","3008","9999"],
  quotaPerFormalPool:3,
});
assert.equal(good.valid,true);
assert.equal(good.noRescore,true);
assert.equal(good.noRerank,true);
assert.equal(good.parentCount,5);
assert.equal(good.rows.find(x=>x.symbol==="3008").authoritativeEvaluationSource,"THOUSAND_DEDICATED");
assert.equal(good.rows.find(x=>x.symbol==="1101").authoritativeEvaluationSource,"PRIMARY");
assert.equal(good.rows.find(x=>x.symbol==="3105").qualified,false);
assert.equal(good.rows.find(x=>x.symbol==="3008").observedPoolRank,1);

// Deliberately change dedicated thousand evaluation: must fail QA rather than choose one silently.
const diverged=buildFormalParentCaptureLedger({
  featureRows:features,
  primaryEvaluations:primary,
  thousandEvaluations:[
    {symbol:"3008",evaluationOrdinal:0,result:{...ok("3008",90),priorityScore:91}},
    thousand[1],
  ],
  poolBySymbol:pools,
  rankedGeneralSymbols:["1101","2330"],
  rankedThousandSymbols:["3008","9999"],
  selectedSymbols:["1101","2330","3008","9999"],
});
assert.equal(diverged.valid,false);
assert.deepEqual(diverged.dualEvaluationDivergenceSymbols,["3008"]);

// Ranked order is supplied by Formal. Helper only validates membership and cutline.
assert.throws(()=>buildFormalParentCaptureLedger({
  featureRows:features,
  primaryEvaluations:primary,
  thousandEvaluations:thousand,
  poolBySymbol:pools,
  rankedGeneralSymbols:["1101"],
  rankedThousandSymbols:["3008","9999"],
  selectedSymbols:["1101","3008","9999"],
}),/GENERAL_RANKED_KEYSET_MISMATCH/);

// Selected set must equal actual top quota from supplied ranked lists.
assert.throws(()=>buildFormalParentCaptureLedger({
  featureRows:features,
  primaryEvaluations:primary,
  thousandEvaluations:thousand,
  poolBySymbol:pools,
  rankedGeneralSymbols:["1101","2330"],
  rankedThousandSymbols:["3008","9999"],
  selectedSymbols:["1101","3008"],
}),/SELECTED_SET_MISMATCH/);

// Missing dedicated thousand evaluation is fatal.
assert.throws(()=>buildFormalParentCaptureLedger({
  featureRows:features,
  primaryEvaluations:primary,
  thousandEvaluations:[thousand[0]],
  poolBySymbol:pools,
  rankedGeneralSymbols:["1101","2330"],
  rankedThousandSymbols:["3008","9999"],
  selectedSymbols:["1101","2330","3008","9999"],
}),/THOUSAND_EVALUATION_KEYSET_MISMATCH/);

console.log(JSON.stringify({ok:true,status:"FORMAL_PARENT_CAPTURE_LEDGER_PASS"}));
