import assert from "node:assert/strict";
import { auditPatternEvidenceBundle, jaccardAnchors } from "./pattern_evidence_dedup_v0_1.mjs";

const base={
  scale:"DAILY_BASE",
  semanticSpaceVersion:"TECHNICAL_CONTINUITY_V1",
  rootProvenance:["PRICE_OHLC"],
};

// Same exact anchor set, different names: raw labels increase, exact structure does not.
const sameAnchor=auditPatternEvidenceBundle([
  {...base,episodeId:"W1",family:"W",layer:"MACRO_TOPOLOGY",anchorIds:["A1","A2","A3"]},
  {...base,episodeId:"C1",family:"CUP",layer:"MACRO_TOPOLOGY",anchorIds:["A3","A1","A2"]},
]);
assert.equal(sameAnchor.rawNamedLabelCount,2);
assert.equal(sameAnchor.uniqueNamedFamilyCount,2);
assert.equal(sameAnchor.exactAnchorGroupCount,1);
assert.equal(sameAnchor.multiLabelSameAnchorGroups.length,1);
assert.equal(sameAnchor.rootProvenanceCount,1);
assert.equal(sameAnchor.scoringVoteCount,null);

// Nested W inside a broader Cup: partial overlap remains continuous, not forced into a binary independent vote.
const nested=auditPatternEvidenceBundle([
  {...base,episodeId:"CUP_BIG",family:"CUP",layer:"MACRO_TOPOLOGY",anchorIds:["L_RIM","BOTTOM","R_RIM"]},
  {...base,episodeId:"W_BOTTOM",family:"W",layer:"MACRO_TOPOLOGY",anchorIds:["W_L","BOTTOM","W_H","W_R"]},
]);
assert.equal(nested.exactAnchorGroupCount,2);
const nestedPair=nested.pairwiseAnchorOverlap[0];
assert.equal(nestedPair.exactAnchorSet,false);
assert.equal(nestedPair.jaccard,1/6);

// Cup handle, VCP and Platform share one exact contraction object.
const compression=auditPatternEvidenceBundle([
  {...base,episodeId:"HANDLE",family:"CUP_HANDLE",layer:"COMPRESSION_PROGRESSION",anchorIds:["H1","L1","H2","L2"]},
  {...base,episodeId:"VCP",family:"VCP",layer:"COMPRESSION_PROGRESSION",anchorIds:["H1","L1","H2","L2"]},
  {...base,episodeId:"PLATFORM",family:"PLATFORM",layer:"COMPRESSION_PROGRESSION",anchorIds:["H1","L1","H2","L2"]},
]);
assert.equal(compression.rawNamedLabelCount,3);
assert.equal(compression.exactAnchorGroupCount,1);
assert.equal(compression.rootProvenanceCount,1);
assert.deepEqual(compression.multiLabelSameAnchorGroups[0].families,["CUP_HANDLE","PLATFORM","VCP"]);

// Three families share one exact observed boundary break.
const oneBreak=auditPatternEvidenceBundle([
  {...base,episodeId:"W_BREAK",family:"W",layer:"TRIGGER_LIFECYCLE",anchorIds:["W1","W2","W3"],boundaryId:"B42",firstBreakAt:"2026-09-28"},
  {...base,episodeId:"CUP_BREAK",family:"CUP",layer:"TRIGGER_LIFECYCLE",anchorIds:["C1","C2","C3"],boundaryId:"B42",firstBreakAt:"2026-09-28"},
  {...base,episodeId:"VCP_BREAK",family:"VCP",layer:"TRIGGER_LIFECYCLE",anchorIds:["V1","V2","V3"],boundaryId:"B42",firstBreakAt:"2026-09-28"},
]);
assert.equal(oneBreak.rawNamedLabelCount,3);
assert.equal(oneBreak.exactTriggerGroupCount,1);
assert.equal(oneBreak.sharedTriggerGroups.length,1);

// Sakata local motif inside breakout bars: two layers, still one root information family.
const sakataInsideBreak=auditPatternEvidenceBundle([
  {...base,episodeId:"BREAK",family:"BREAKOUT",layer:"TRIGGER_LIFECYCLE",anchorIds:["P1","P2"],boundaryId:"B1",firstBreakAt:"2026-09-28",windowStart:"2026-09-28",windowEnd:"2026-09-30"},
  {...base,episodeId:"3S",family:"SAKATA_THREE_SOLDIERS",layer:"LOCAL_CANDLE_SAKATA",anchorIds:[],windowStart:"2026-09-28",windowEnd:"2026-09-30"},
]);
assert.equal(sakataInsideBreak.layerCount,2);
assert.equal(sakataInsideBreak.rootProvenanceCount,1);
assert.equal(sakataInsideBreak.independenceStatus,"UNPROVEN_FROM_LABEL_COUNT");

// Truly different root source increases provenance diversity, but still does not create an automatic score.
const crossSource=auditPatternEvidenceBundle([
  {...base,episodeId:"PRICE_PATTERN",family:"VCP",layer:"COMPRESSION_PROGRESSION",anchorIds:["A","B","C"]},
  {...base,episodeId:"FLOW",family:"VOLUME_DRYUP_CONTEXT",layer:"COMPRESSION_PROGRESSION",anchorIds:[],rootProvenance:["VERIFIED_VOLUME_FLOW"]},
]);
assert.equal(crossSource.rootProvenanceCount,2);
assert.equal(crossSource.scoringVoteCount,null);

// Jaccard remains a continuous diagnostic.
assert.equal(jaccardAnchors(["A","B"],["B","C"]),1/3);
assert.equal(jaccardAnchors([],[]),null);

console.log(JSON.stringify({ok:true,status:"PATTERN_EVIDENCE_DEDUP_PASS"}));
