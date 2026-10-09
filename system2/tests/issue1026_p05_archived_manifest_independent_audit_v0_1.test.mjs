import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {readFile} from "node:fs/promises";
import {verifyIssue1026P05SourceManifestCoreV0_1 as verify,
 auditIssue1026P05RealArchivedManifestV0_1 as real}
 from "../runtime/issue1026_p05_archived_manifest_independent_audit_v0_1.mjs";
const H=x=>createHash("sha256").update(JSON.stringify(x)).digest("hex");
const dates=["2026-10-01","2026-10-02","2026-10-05",
 "2026-10-06","2026-10-07","2026-10-08"];
const expectedDays=dates.flatMap(marketDate=>["TWSE","TPEX"].map(market=>({
 market,marketDate,ordinarySymbolCount:3,sourceTransport:"PRIMARY",
 frozenNormalizedBarSha256:"a".repeat(64),
})));
const rows=expectedDays.flatMap(x=>["1000","1001","1002"].map(symbol=>({
 market:x.market,marketDate:x.marketDate,symbol,
 sourceValueSha256:H([x.market,x.marketDate,symbol]),
 sourceObservationIsRetrospective:true,
 historicalOriginalFirstKnownAtCertified:false,
 physicalHotD1Presence:"UNKNOWN",physicalHotD1VersionCount:"UNKNOWN",
 originalPITReplayAuthorized:false,
})));
const receipts=expectedDays.map(e=>{
 const sub=rows.filter(x=>x.market===e.market&&x.marketDate===e.marketDate);
 return {...e,sourceKeyIdentitySha256:H(sub.map(x=>x.symbol)),
 sourceKeyValueSha256:H(sub.map(x=>[x.symbol,x.sourceValueSha256])),
 originalHistoricalFirstKnownAtCertified:false,
 hotD1ReadbackCertified:false,
 };
});
const mids=H(rows.map(x=>[x.market,x.marketDate,x.symbol]));
const mvals=H(rows.map(x=>[x.market,x.marketDate,x.symbol,x.sourceValueSha256]));
const manifest={
 sourceOnly:true,result:"PASS_11843_OFFICIAL_SOURCE_KEYS_ONLY_NO_D1_CENSUS",
 hotD1ScoutPhysicalExecuted:0,hotD1FullPhysicalExecuted:0,
 d1SelectsExecutedByManifest:0,d1WritesExecutedByManifest:0,
 r2CallsExecutedByManifest:0,system1RuntimeUsed:false,
 physicalD1MissingKeys:"UNKNOWN",physicalD1MultiVersionKeys:"UNKNOWN",
 pointInTimeAvailableAtAtHistoricalCutCertified:false,
 originalFirstKnownAtCertified:false,selectedToTradeAuthorized:false,
 officialSourceStockDateKeys:36,manifestKeyCount:36,
 manifestSourceKeyRows:rows,dateSourceReceipts:receipts,
 manifestSourceKeysSha256:mids,manifestSourceKeyValuesSha256:mvals,
 marketSourceKeys:{TWSE:18,TPEX:18},
};
const run=(m=manifest)=>verify({manifest:m,expectedDays,
 expectedTotal:36,expectedIdentityHash:mids,expectedValueHash:mvals});
const x=run();
assert.equal(x.sourceKeysIndependentlyValidated,36);
assert.equal(x.marketDateReceipts,12);
assert.equal(x.unprovenHistoricalFirstKnownAt,36);
assert.equal(x.unknownHotD1PresenceKeys,36);
assert.equal(x.permissionToWrite,false);
assert.equal(x.physicalD1MissingKeys,"UNKNOWN");
assert.equal(x.originalPITReplayAuthorized,false);
const change=cb=>{const y=structuredClone(manifest);cb(y);return y;};
const negative=[
 ["ghost source identity",x=>x.manifestSourceKeyRows[0].symbol="1099"],
 ["duplicate source identity",x=>x.manifestSourceKeyRows[1].symbol="1000"],
 ["reordered day",x=>x.manifestSourceKeyRows.reverse()],
 ["fake source value",x=>x.manifestSourceKeyRows[0].sourceValueSha256="f".repeat(64)],
 ["fabricated PIT",x=>x.manifestSourceKeyRows[0].historicalOriginalFirstKnownAtCertified=true],
 ["fabricated firstKnownAt",x=>x.manifestSourceKeyRows[0].firstKnownAt="2026-10-01T01:00:00Z"],
 ["fabricated availableAt",x=>x.manifestSourceKeyRows[0].availableAt="2026-10-01T01:00:00Z"],
 ["physical presence invented",x=>x.manifestSourceKeyRows[0].physicalHotD1Presence="PRESENT"],
 ["physical version count invented",x=>x.manifestSourceKeyRows[0].physicalHotD1VersionCount=1],
 ["wrong retrospective clock",x=>x.manifestSourceKeyRows[0].sourceObservationIsRetrospective=false],
 ["unauthorized replay",x=>x.manifestSourceKeyRows[0].originalPITReplayAuthorized=true],
 ["row removed",x=>x.manifestSourceKeyRows.pop()],
 ["fake source only false",x=>x.sourceOnly=false],
 ["fake D1 sampled",x=>x.hotD1ScoutPhysicalExecuted=36],
 ["fake full D1",x=>x.hotD1FullPhysicalExecuted=11843],
 ["fake source-to-D1 present",x=>x.physicalD1MissingKeys=0],
 ["fake primary source",x=>x.dateSourceReceipts[0].sourceTransport="LEGACY"],
 ["per-day identity digest fake",x=>x.dateSourceReceipts[0].sourceKeyIdentitySha256="f".repeat(64)],
 ["per-day value digest fake",x=>x.dateSourceReceipts[0].sourceKeyValueSha256="f".repeat(64)],
 ["aggregate hash fake",x=>x.manifestSourceKeyValuesSha256="f".repeat(64)],
 ["fictitious D1 read",x=>x.d1SelectsExecutedByManifest=36],
 ["fictitious D1 write",x=>x.d1WritesExecutedByManifest=1],
];
for(const [name,cb] of negative){
 assert.throws(()=>run(change(cb)),undefined,name);
}
assert.throws(()=>real({manifest,acceptance:{},observedAt:"2026-10-10T00:00:00Z"}));
const workflow=await readFile(new URL(
 "../../.github/workflows/system2-issue1026-p05-archived-manifest-offline-audit.yml",
 import.meta.url),"utf8");
assert.match(workflow,/actions: read/);
assert.match(workflow,/workflow_dispatch:/);
assert.match(workflow,/push:[\s\S]+paths:/);
assert.doesNotMatch(workflow,/^\s*schedule:/m);
assert.doesNotMatch(workflow,/wrangler|CLOUDFLARE_ACCOUNT_ID|CLOUDFLARE_API_TOKEN|d1 execute/i);
console.log("ISSUE1026_P05_ARCHIVED_KEY_AUDIT_POSITIVE_22_ADVERSARIAL_PIT_VERSION_QUOTA_FIREWALL_PASS");
