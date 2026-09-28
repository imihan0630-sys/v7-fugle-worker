import assert from "node:assert/strict";
import {buildNestedStructureGraph} from "./pattern_nested_structure_graph_v0_1.mjs";

const bars=(prefix,dates)=>dates.map((d,i)=>({barId:`${prefix}${i+1}`,date:d,availableAt:d,verified:true,eligibleSymbolSession:true}));
const base={
  symbol:"TEST",
  semanticSpaceVersion:"TECHNICAL_CONTINUITY_V1",
  rootProvenance:["PRICE_OHLC"],
};

const cup={
  ...base,objectId:"WEEKLY_CUP",family:"CUP",layer:"MACRO_TOPOLOGY",scale:"WEEKLY",
  intervalStart:"2026-08-03",intervalEnd:"2026-09-25",confirmedAt:"2026-09-25",completeness:"COMPLETE",
  anchorIds:["CUP_L","CUP_B","CUP_R"],sourceBars:bars("CW",["2026-09-21","2026-09-22","2026-09-23","2026-09-24","2026-09-25"]),
  boundary:{boundaryId:"RIM",version:"V1",lower:99,upper:101,direction:"UP",firstBreakAt:"2026-09-25"},
};
const w={
  ...base,objectId:"DAILY_W",family:"W",layer:"MACRO_TOPOLOGY",scale:"DAILY",
  intervalStart:"2026-09-01",intervalEnd:"2026-09-21",confirmedAt:"2026-09-21",completeness:"COMPLETE",
  anchorIds:["W_L","W_M","W_R"],sourceBars:bars("DW",["2026-09-01","2026-09-21"]),
  boundary:{boundaryId:"NECK",version:"V1",lower:96,upper:97,direction:"UP",firstBreakAt:"2026-09-21"},
};
const vcp={
  ...base,objectId:"DAILY_VCP",family:"VCP",layer:"COMPRESSION_PROGRESSION",scale:"DAILY",
  intervalStart:"2026-09-18",intervalEnd:"2026-09-24",confirmedAt:"2026-09-24",completeness:"COMPLETE",
  anchorIds:["W_R","V2","V3"],sourceBars:bars("DV",["2026-09-18","2026-09-24"]),
};

// A later weekly parent cannot be backfilled into the earlier Monday snapshot.
const monday=buildNestedStructureGraph({objects:[cup,w,vcp],asOfDate:"2026-09-21"});
assert.deepEqual(monday.nodes.map(x=>x.objectId),["DAILY_W"]);
assert.equal(monday.edges.length,0);

// Full as-of graph has direct causal edges only. W<->VCP overlap does not create Cup<->VCP anchor equivalence.
const friday=buildNestedStructureGraph({objects:[cup,w,vcp],asOfDate:"2026-09-25"});
assert(friday.edges.some(e=>e.type==="CONTAINS"&&e.from==="WEEKLY_CUP"&&e.to==="DAILY_W"));
assert(friday.edges.some(e=>e.type==="CONTAINS"&&e.from==="WEEKLY_CUP"&&e.to==="DAILY_VCP"));
assert(friday.edges.some(e=>e.type==="SHARES_ANCHORS"&&e.from==="DAILY_VCP"&&e.to==="DAILY_W"&&e.jaccard===1/5));
assert(!friday.edges.some(e=>e.type==="SHARES_ANCHORS"&&new Set([e.from,e.to]).has("WEEKLY_CUP")));
assert.equal(friday.transitiveClosureApplied,false);
assert.equal(friday.scoringVoteCount,null);

// Prefix replay equality: future objects cannot rewrite the earlier graph.
const replay=buildNestedStructureGraph({objects:[cup,w,vcp],asOfDate:"2026-09-21"});
assert.deepEqual(replay,monday);

// A partial week remains marked partial and cannot act as a confirmed parent.
const partial={...cup,objectId:"PARTIAL_WEEK",confirmedAt:"2026-09-24",intervalEnd:"2026-09-24",completeness:"PARTIAL",sourceBars:bars("PW",["2026-09-21","2026-09-24"])};
const partialGraph=buildNestedStructureGraph({objects:[partial,w],asOfDate:"2026-09-24"});
assert.equal(partialGraph.nodes.find(x=>x.objectId==="PARTIAL_WEEK").completeness,"PARTIAL");
assert(!partialGraph.edges.some(e=>e.type==="CONTAINS"&&e.from==="PARTIAL_WEEK"));

// Different technical-price spaces are a provenance conflict, not a relationship.
const rawW={...w,objectId:"RAW_W",semanticSpaceVersion:"RAW_EXECUTION_V1"};
const semanticConflict=buildNestedStructureGraph({objects:[cup,rawW],asOfDate:"2026-09-25"});
assert.equal(semanticConflict.edges.length,0);
assert.equal(semanticConflict.conflicts[0].type,"SEMANTIC_SPACE_CONFLICT");

// Same boundary id/version with mutated coordinates fails closed.
const sameTrigger={...w,objectId:"DAILY_TRIGGER",confirmedAt:"2026-09-25",boundary:{...cup.boundary}};
const triggerGraph=buildNestedStructureGraph({objects:[cup,sameTrigger],asOfDate:"2026-09-25"});
assert(triggerGraph.edges.some(e=>e.type==="SHARES_TRIGGER"));
const mutated={...sameTrigger,objectId:"MUTATED",boundary:{...cup.boundary,upper:102}};
const boundaryConflict=buildNestedStructureGraph({objects:[cup,mutated],asOfDate:"2026-09-25"});
assert.equal(boundaryConflict.edges.length,0);
assert.equal(boundaryConflict.conflicts[0].type,"BOUNDARY_PROVENANCE_CONFLICT");

// A non-session pseudo-bar blocks its object instead of becoming weekly evidence.
const badCup={...cup,objectId:"BAD_CUP",sourceBars:[...cup.sourceBars,{barId:"PSEUDO",date:"2026-09-23",availableAt:"2026-09-23",verified:true,eligibleSymbolSession:false}]};
const blocked=buildNestedStructureGraph({objects:[badCup,w],asOfDate:"2026-09-25"});
assert(!blocked.nodes.some(x=>x.objectId==="BAD_CUP"));
assert.deepEqual(blocked.blocked[0].barIds,["PSEUDO"]);

console.log(JSON.stringify({ok:true,status:"PATTERN_NESTED_STRUCTURE_GRAPH_PASS"}));
