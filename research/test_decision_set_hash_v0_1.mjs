import assert from "node:assert/strict";
import {
  canonicalParentKeyset,
  buildDecisionGenerationHashes,
} from "./decision_set_hash_v0_1.mjs";

assert.throws(
  ()=>canonicalParentKeyset([]),
  /SUPERSEDED_USE_parent_keyset_hash_v0_1/
);
assert.throws(
  ()=>buildDecisionGenerationHashes([]),
  /SUPERSEDED_USE_parent_keyset_hash_v0_1/
);

console.log(JSON.stringify({
  ok:true,
  status:"SUPERSEDED_HELPER_HARD_DISABLED",
  canonical:"parent_keyset_hash_v0_1.mjs"
}));
