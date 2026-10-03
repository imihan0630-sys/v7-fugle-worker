import assert from "node:assert/strict";
import fs from "node:fs";
import { createHash } from "node:crypto";
import { createRemoteD1RestAdapter } from "../deploy/remote_d1_rest_adapter.mjs";

const accountId=process.env.CLOUDFLARE_ACCOUNT_ID;
const apiToken=process.env.SYSTEM2_CLOUDFLARE_API_TOKEN;
assert.ok(accountId,"CLOUDFLARE_ACCOUNT_ID is required");
assert.ok(apiToken,"SYSTEM2_CLOUDFLARE_API_TOKEN is required");

const scanPath="research/d08_twse_month_end_scan_date_receipt_20261004_v0_1.json";
const scanReceipt=JSON.parse(fs.readFileSync(scanPath,"utf8"));
assert.equal(scanReceipt.schemaVersion,"D08_TWSE_MONTH_END_SCAN_DATE_RECEIPT_V0_1");
assert.equal(scanReceipt.monthCount,44);
const scanDates=scanReceipt.scanDates.map(x=>String(x.scanDate));
assert.equal(new Set(scanDates).size,44);

const db=await createRemoteD1RestAdapter({
  accountId,apiToken,databaseName:"system2-research",
});

const schema=await db.rawQuery(
  "SELECT schema_value FROM s2_schema_meta WHERE schema_key='schema_version' LIMIT 1"
);
assert.equal(schema[0]?.schema_value,"1.1","isolated D1 schema must remain 1.1");

const receipts=await db.rawQuery(`
  SELECT registry_id,registry_hash,dataset_start_date,membership_count,
         symbol_market_count,replay_eligible_count,unknown_start_count,
         current_count,delisted_count,observed_at,persisted_at,schema_version
    FROM s2_historical_universe_registry_receipts
   ORDER BY observed_at DESC,persisted_at DESC,registry_id ASC
`);
assert.ok(receipts.length>0,"no historical universe registry receipt exists");

const eligibleReceipts=receipts.filter(r=>
  String(r.dataset_start_date||"") <= scanDates[0]
  && Number(r.replay_eligible_count||0)>0
);
assert.ok(eligibleReceipts.length>0,"no registry covers first scan date");
const latestObserved=String(eligibleReceipts[0].observed_at);
const latest=eligibleReceipts.filter(r=>String(r.observed_at)===latestObserved);
assert.equal(latest.length,1,
  "latest historical universe registry observedAt is ambiguous; require explicit registry owner resolution"
);
const receipt=latest[0];
const registryId=String(receipt.registry_id);
assert.match(registryId,/^[A-Za-z0-9_.:-]+$/,"unsafe registry id");

const memberships=await db.rawQuery(`
  SELECT registry_id,market,symbol,company_name,industry,member_state,
         listing_date,delisting_date,first_trading_date,effective_from,effective_to,
         start_basis,end_basis,replay_eligible,source_id,source_name,source_row_hash,
         observed_at,membership_id,membership_hash,schema_version
    FROM s2_historical_universe_memberships
   WHERE registry_id='${registryId.replaceAll("'","''")}'
   ORDER BY market,symbol,effective_from,membership_id
`);

assert.equal(
  memberships.length,
  Number(receipt.membership_count),
  "registry membership count does not match durable receipt"
);
assert.equal(
  memberships.filter(x=>Number(x.replay_eligible)===1).length,
  Number(receipt.replay_eligible_count),
  "replay-eligible count does not match durable receipt"
);

const sha256=s=>createHash("sha256").update(s).digest("hex");
const snapshots=[];
for(const scanDate of scanDates){
  const active=memberships
    .filter(x=>
      String(x.market)==="TWSE"
      && Number(x.replay_eligible)===1
      && x.effective_from
      && String(x.effective_from)<=scanDate
      && (!x.effective_to || String(x.effective_to)>=scanDate)
    )
    .sort((a,b)=>String(a.symbol).localeCompare(String(b.symbol)));

  const seen=new Set();
  for(const row of active){
    const symbol=String(row.symbol);
    assert.match(symbol,/^[1-9][0-9]{3}$/,"non ordinary symbol in TWSE snapshot");
    assert.ok(!seen.has(symbol),"duplicate active TWSE symbol "+symbol+" on "+scanDate);
    seen.add(symbol);
  }
  const digestInput=active.map(x=>
    [x.symbol,x.membership_id,x.membership_hash].map(v=>String(v??"")).join("|")
  ).join("\n");
  snapshots.push({
    scanDate,
    memberCount:active.length,
    industryKnownCount:active.filter(x=>String(x.industry||"").trim()).length,
    currentStateCount:active.filter(x=>x.member_state==="CURRENT").length,
    delistedStateRowsActiveAtDate:active.filter(x=>x.member_state==="DELISTED").length,
    firstSymbol:active[0]?.symbol??null,
    lastSymbol:active.at(-1)?.symbol??null,
    membershipDigest:sha256(digestInput),
  });
}

assert.equal(snapshots.length,44);
const minMemberCount=Math.min(...snapshots.map(x=>x.memberCount));
const maxMemberCount=Math.max(...snapshots.map(x=>x.memberCount));
assert.ok(minMemberCount>0,"TWSE historical snapshot unexpectedly empty");

const twseMemberships=memberships.filter(x=>String(x.market)==="TWSE");
const result={
  result:"PASS",
  schemaVersion:"D08_TWSE_HISTORICAL_UNIVERSE_SNAPSHOT_READONLY_V0_1",
  researchOnly:true,
  mutationPerformed:false,
  system1RuntimeUsed:false,
  outcomesAccessed:false,
  databaseName:"system2-research",
  d1SchemaVersion:String(schema[0].schema_value),
  registry:{
    registryId,
    registryHash:String(receipt.registry_hash),
    datasetStartDate:String(receipt.dataset_start_date),
    observedAt:String(receipt.observed_at),
    persistedAt:String(receipt.persisted_at),
    membershipCount:Number(receipt.membership_count),
    replayEligibleCount:Number(receipt.replay_eligible_count),
    unknownStartCount:Number(receipt.unknown_start_count),
    currentCount:Number(receipt.current_count),
    delistedCount:Number(receipt.delisted_count),
    twseMembershipRowCount:twseMemberships.length,
    twseReplayEligibleRowCount:twseMemberships.filter(x=>Number(x.replay_eligible)===1).length,
    twseUnknownStartRowCount:twseMemberships.filter(x=>Number(x.replay_eligible)!==1||!x.effective_from).length,
  },
  scanDateReceipt:{
    monthCount:scanReceipt.monthCount,
    scanDateListHash:scanReceipt.scanDateListHash,
    sourceBundleHash:scanReceipt.sourceBundleHash,
  },
  snapshots,
  summary:{
    snapshotCount:snapshots.length,
    minMemberCount,
    maxMemberCount,
    firstScanDate:snapshots[0].scanDate,
    lastScanDate:snapshots.at(-1).scanDate,
    snapshotBundleHash:sha256(snapshots.map(x=>
      x.scanDate+"|"+x.memberCount+"|"+x.membershipDigest
    ).join("\n")),
  },
  d1Metrics:{
    requestCount:db.metrics.requestCount,
    rowsRead:db.metrics.rowsRead,
    rowsWritten:db.metrics.rowsWritten,
  },
};
assert.equal(result.d1Metrics.rowsWritten,0,"read-only audit wrote D1 rows");
console.log("D08_UNIVERSE_SNAPSHOT_RECEIPT="+JSON.stringify(result));