import assert from "node:assert/strict";
import {signedDistance,breakoutEpisodeId,breakoutClocks} from "./pattern_breakout_path_descriptor_v0_1.mjs";
assert.equal(signedDistance(105,100,"UP"),5);
assert.equal(signedDistance(95,100,"DOWN"),5);
assert.notEqual(
 breakoutEpisodeId({symbol:"2330",semanticSpaceId:"T",boundaryId:"R",boundaryVersion:1,direction:"UP",firstConfirmedBreakAt:"2026-09-01"}),
 breakoutEpisodeId({symbol:"2330",semanticSpaceId:"T",boundaryId:"R",boundaryVersion:2,direction:"UP",firstConfirmedBreakAt:"2026-09-01"})
);
assert.deepEqual(
 breakoutClocks([
  {symbolSessionEligible:true,priceLimitConstrained:false},
  {symbolSessionEligible:true,priceLimitConstrained:true},
  {symbolSessionEligible:false,priceLimitConstrained:false}
 ]),
 {eligibleBarsSinceBreak:2,observableBarsSinceBreak:1,constrainedBarsSinceBreak:1}
);
console.log("D01 breakout descriptor smoke: 4 PASS");
