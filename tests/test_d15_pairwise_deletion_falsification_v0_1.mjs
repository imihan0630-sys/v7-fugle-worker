import assert from "node:assert/strict";
import {pairwiseDeletionCounterexample,determinant3} from "../research/d15_pairwise_deletion_falsification_v0_1.mjs";

const x=pairwiseDeletionCounterexample();
assert.equal(x.correlations.AB,1);
assert.equal(x.correlations.AC,1);
assert.equal(x.correlations.BC,-1);
assert.deepEqual(x.matrix,[[1,1,1],[1,1,-1],[1,-1,1]]);
assert.equal(x.determinant,-4);
assert.equal(x.positiveSemidefinitePossible,false);
assert.equal(determinant3([[1,0,0],[0,1,0],[0,0,1]]),1);

console.log(JSON.stringify({
  ok:true,
  finding:"Pairwise deletion can assemble AB=+1, AC=+1, BC=-1 from disjoint supports, producing determinant -4; the resulting matrix is not PSD and cannot be one coherent covariance state.",
  governance:"EXACT_LISTWISE_COMMON_SUPPORT remains mandatory for the primary D15 panel."
},null,2));
