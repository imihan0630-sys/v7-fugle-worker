import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

const contract=JSON.parse(await readFile(new URL("../../research/d08_twse_daily_valuation_archive_manifest_contract_v0_1.json",import.meta.url),"utf8"));
const m=JSON.parse(await readFile(new URL("../../research/d08_twse_daily_valuation_archive_manifest_20261007_v0_1.json",import.meta.url),"utf8"));

assert.equal(m.result,"PASS");
assert.equal(m.requiredYearCount,22);
assert.equal(m.yearCount,22);
assert.deepEqual(m.years.map(x=>x.year),contract.archive.requiredYears);
assert.equal(new Set(m.years.map(x=>x.year)).size,22);
assert.equal(m.years.every(x=>x.readbackVerified===true),true);
assert.equal(m.years.every(x=>x.tradingDateCount>0&&x.totalRows>0),true);
assert.equal(m.years.every(x=>x.totalPeKnown<=x.totalRows&&x.totalPbKnown<=x.totalRows),true);
assert.equal(m.years[0].fromDate,"2005-09-02");
assert.equal(m.years.at(-1).toDate,"2026-08-31");
assert.equal(m.totals.tradingDateCount,m.years.reduce((s,x)=>s+x.tradingDateCount,0));
assert.equal(m.totals.totalRows,m.years.reduce((s,x)=>s+x.totalRows,0));
assert.equal(m.totals.totalPeKnown,m.years.reduce((s,x)=>s+x.totalPeKnown,0));
assert.equal(m.totals.totalPbKnown,m.years.reduce((s,x)=>s+x.totalPbKnown,0));
const line=x=>[
 x.year,x.fromDate,x.toDate,x.tradingDateCount,x.totalRows,x.totalPeKnown,x.totalPbKnown,
 x.sourceBundleHash,x.packPayloadHash,x.objectSha256,x.objectKey
].join("|");
const hash=createHash("sha256").update(m.years.map(line).join("\n")).digest("hex");
assert.equal(hash,m.packBundleHash);
assert.equal(hash,"540617710149de3713d2c8e574f90dc39c6800d87b19c0d95763eac78f0bae31");
assert.equal(m.guards.noReturns,true);
assert.equal(m.guards.noFormalCoreImpact,true);

console.log(JSON.stringify({
  ok:true,guard:"D08_DAILY_VALUATION_ARCHIVE_MANIFEST_V0_1",
  yearCount:m.yearCount,tradingDateCount:m.totals.tradingDateCount,
  totalRows:m.totals.totalRows,packBundleHash:m.packBundleHash,
  outcomeAccess:false,formalCoreImpact:false
}));
