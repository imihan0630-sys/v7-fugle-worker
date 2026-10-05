import assert from "node:assert/strict";
import {validateC1GenerationInventory} from "../research/system1_c1_generation_inventory_validation_v0_1.mjs";

const day="2026-10-06",generationId="g1",digest="a".repeat(64),universe="b".repeat(64);
const base=()=>({
  schemaVersion:"SYSTEM1_C1_GENERATION_INVENTORY_V0_1",scanDate:day,generationCount:1,returnedCount:1,limit:250,
  truncated:false,integrityComplete:true,modernOriginCoverageComplete:true,snapshotMutableUntilSessionComplete:true,
  historicalBackfillPerformed:false,generations:[{ordinal:1,generationId,sessionDate:day,decisionAt:day+"T15:35:00.000Z",
  capturedAt:day+"T15:35:00.000Z",createdAt:day+"T15:35:01.000Z",sourceMainSha:"c".repeat(40),
  runtimeVersion:"8.19.0-c1-scan-origin-generation-inventory",universeDigest:universe,contentDigest:digest,
  populationN:1880,capturedN:1880,featureN:500,chunkCount:20,completeness:"IN_MEMORY_COMPLETE_NORMALIZED_UNIVERSE",
  originStatus:"SCAN_ORIGIN_CAPTURED",originKind:"AFTER_MARKET_SCAN_PIPELINE",pathKind:"RUN_AFTER_MARKET_SCAN_CORE",
  triggerTransport:"NOT_IDENTIFIED_BY_THIS_CAPTURE",error:null}]
});
const expected={scanDate:day,generationId,runtimeVersion:"8.19.0-c1-scan-origin-generation-inventory",contentDigest:digest,universeDigest:universe};
let n=0;const pass=(name,fn)=>{fn();n++;console.log("PASS",name);};
pass("verified parent",()=>{const r=validateC1GenerationInventory(base(),expected);assert.equal(r.status,"VERIFIED");assert.equal(r.originKind,"AFTER_MARKET_SCAN_PIPELINE");});
pass("truncation blocks",()=>{const x=base();x.truncated=true;assert.throws(()=>validateC1GenerationInventory(x,expected),/TRUNCATED/);});
pass("coverage blocks",()=>{const x=base();x.modernOriginCoverageComplete=false;assert.throws(()=>validateC1GenerationInventory(x,expected),/ORIGIN_COVERAGE/);});
pass("integrity blocks",()=>{const x=base();x.integrityComplete=false;assert.throws(()=>validateC1GenerationInventory(x,expected),/INTEGRITY_BLOCKED/);});
pass("parent required",()=>{const x=base();x.generations[0].generationId="other";assert.throws(()=>validateC1GenerationInventory(x,expected),/FORMAL_PARENT_MISSING/);});
pass("origin required",()=>{const x=base();x.generations[0].originStatus="DATA_QUALITY_BLOCKED";assert.throws(()=>validateC1GenerationInventory(x,expected),/PARENT_ORIGIN_BLOCKED/);});
pass("digest pinning",()=>{const x=base();x.generations[0].contentDigest="d".repeat(64);assert.throws(()=>validateC1GenerationInventory(x,expected),/CONTENT_DIGEST_MISMATCH/);});
pass("runtime pinning",()=>{const x=base();x.generations[0].runtimeVersion="8.18.0-valuation-source-vintage";assert.throws(()=>validateC1GenerationInventory(x,expected),/PARENT_RUNTIME_MISMATCH/);});
pass("no historical backfill",()=>{const x=base();x.historicalBackfillPerformed=true;assert.throws(()=>validateC1GenerationInventory(x,expected),/BACKFILL_CONFLICT/);});
console.log("SUMMARY "+n+"/9 PASS");
