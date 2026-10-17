import assert from "node:assert/strict";
import {DATE,CODES,KIND,ORIGINAL_SELECT,classifyOriginalD1QuarterEps} from
 "../research/system1_p0_quarter_eps_d1_symbol_receipt_v0_1.mjs";
assert.equal(KIND,"QUARTER_EPS");
assert.match(ORIGINAL_SELECT,/^SELECT snapshot_json/);
assert.equal(CODES.length,5);
const goodRow={quarterEpsVerified:true,previousQuarterEpsVerified:true,
 quarterEPS:1.4,previousQuarterEPS:1.2};
const stocks=Object.fromEntries(["3236","3147","4167","6122"].map(x=>[x,goodRow]));
const raw=JSON.stringify({asOfDate:DATE,year:2026,quarter:2,count:4,stocks});
const read=(json=raw,opts={})=>classifyOriginalD1QuarterEps({
 sourceDatabaseName:"v7-live",marketDate:DATE,rows:[{snapshot_json:json}],
 meta:{rows_read:1,rows_written:0},observedAt:"2026-10-17T14:00:00Z",...opts});
let x=read();
assert.equal(x.state,"EXACT_SNAPSHOT_MEMBERSHIP_OBSERVED");
assert.equal(x.stockMapCount,4);
assert.deepEqual(x.missingCodes,["5340"]);
assert.equal(x.completeCandidateCoverageCertified,false);
assert.equal(x.historicalPitCertified,false);
assert.equal(x.canScan,false);
assert.equal(x.canTrade,false);
assert.equal(x.candidates.find(z=>z.symbol==="3236").readbackState,
 "PRESENT_FLAGS_AND_NUMERIC_ONLY__ORIGINAL_SOURCE_NOT_CERTIFIED");
assert.equal(read(raw,{marketDate:"2026-10-15"}).state,"NOT_VERIFIED");
assert.equal(read(raw,{sourceDatabaseName:"system2-research"}).state,"NOT_VERIFIED");
assert.equal(read(raw,{meta:{rows_read:1,rows_written:1}}).reason,"D1_SELECT_METRICS_UNVERIFIED");
assert.equal(read(raw,{meta:{rows_read:20001,rows_written:0}}).state,"NOT_VERIFIED");
assert.equal(read(raw,{rows:[]}).reason,"EXACT_ONE_ORIGINAL_SNAPSHOT_REQUIRED");
assert.equal(read(raw,{rows:[{snapshot_json:raw},{snapshot_json:raw}]}).state,"NOT_VERIFIED");
assert.equal(read("{").reason,"ORIGINAL_JSON_INVALID");
assert.equal(read(JSON.stringify({asOfDate:DATE,year:2026,quarter:1,count:4,stocks})).state,"SNAPSHOT_METADATA_MISMATCH");
assert.equal(read(JSON.stringify({asOfDate:DATE,year:2026,quarter:2,count:9,stocks})).countMatches,false);
assert.equal(read(JSON.stringify({asOfDate:DATE,year:2026,quarter:2,count:1,stocks:{"5340":goodRow}})).
 candidates.find(z=>z.symbol==="5340").readbackState,
 "PRESENT_FLAGS_AND_NUMERIC_ONLY__ORIGINAL_SOURCE_NOT_CERTIFIED");
assert.equal(read(JSON.stringify({asOfDate:DATE,year:2026,quarter:2,count:1,stocks:{"5340":{}}})).
 candidates.find(z=>z.symbol==="5340").readbackState,"PRESENT_INCOMPLETE");
assert.equal(read(JSON.stringify({asOfDate:DATE,year:2026,quarter:2,count:1,stocks:{"5340":null}})).
 candidates.find(z=>z.symbol==="5340").readbackState,"INVALID_ROW");
assert.equal(x.sourceOriginalReportVerified,false);
assert.equal(x.sourceShaMatchedToOriginalMops,false);
assert.equal(x.rawD1SnapshotSha256.length,64);
console.log("System1 original D1 EPS symbol membership: 17 offline assertions PASS");
