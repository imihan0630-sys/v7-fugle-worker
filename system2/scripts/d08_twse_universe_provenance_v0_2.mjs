import fs from "node:fs";
import { createHash } from "node:crypto";
import { buildHistoricalUniverseSnapshotV0_1 } from "../runtime/historical_universe_registry_v0_1.mjs";
import { buildD08SemanticUniverseIdentityV0_1 } from "../runtime/d08_twse_historical_universe_source_v0_1.mjs";
import { buildD08TwseHistoricalUniverseSourceV0_2 } from "../runtime/d08_twse_historical_universe_source_v0_2.mjs";

const sha=text=>createHash("sha256").update(text).digest("hex");
const observedAt=new Date().toISOString();
const scanReceipt=JSON.parse(fs.readFileSync("research/d08_twse_month_end_scan_date_receipt_20261004_v0_1.json","utf8"));
const frozenV01=JSON.parse(fs.readFileSync("research/d08_twse_official_universe_source_receipt_20261004_v0_1.json","utf8"));
if(scanReceipt.monthCount!==44||frozenV01.scanClock.snapshotCount!==44) throw new Error("expected 44 frozen scan dates");

const built=await buildD08TwseHistoricalUniverseSourceV0_2({observedAt});
const semantic=buildD08SemanticUniverseIdentityV0_1(built.registry);
const oldByDate=new Map(frozenV01.scanClock.snapshots.map(x=>[x.scanDate,x]));
const snapshots=[];
for(const entry of scanReceipt.scanDates){
  const date=entry.scanDate;
  const snap=await buildHistoricalUniverseSnapshotV0_1({
    snapshotId:"D08-TWSE-V0.2-"+date,
    registry:built.registry,marketDate:date,capturedAt:observedAt,
  });
  const old=oldByDate.get(date);
  if(!old) throw new Error("missing V0.1 frozen snapshot "+date);
  const semanticSnapshotHash=sha(JSON.stringify({
    marketDate:date,
    semanticRegistryHash:semantic.semanticRegistryHash,
    members:snap.members.map(x=>[x.market,x.symbol]),
    schemaVersion:"D08_TWSE_SEMANTIC_UNIVERSE_SNAPSHOT_V0_2",
  }));
  snapshots.push({
    scanDate:date,
    memberCount:snap.memberCount,
    snapshotHash:snap.snapshotHash,
    semanticSnapshotHash,
    v01MemberCount:old.memberCount,
    memberCountDelta:snap.memberCount-old.memberCount,
    firstSymbol:snap.members[0]?.symbol||null,
    lastSymbol:snap.members.at(-1)?.symbol||null,
  });
}
const changed=snapshots.filter(x=>x.memberCountDelta!==0);
const receipt={
  schemaVersion:"D08_TWSE_OFFICIAL_UNIVERSE_SOURCE_RECEIPT_V0_2",
  result:"PASS",generatedAt:observedAt,researchOnly:true,outcomeJoin:false,
  supersedesForNewResearch:"research/d08_twse_official_universe_source_receipt_20261004_v0_1.json",
  frozenV01RemainsImmutable:true,
  scanDateListHash:scanReceipt.scanDateListHash,
  sourceReceipt:built.sourceReceipt,
  registry:{
    registryId:built.registry.registryId,
    registryHash:built.registry.registryHash,
    semanticRegistryHash:semantic.semanticRegistryHash,
    membershipCount:built.registry.membershipCount,
    replayEligibleCount:built.registry.replayEligibleCount,
    unknownStartCount:built.registry.unknownStartCount,
    currentCount:built.registry.currentCount,
    delistedCount:built.registry.delistedCount,
  },
  reconciliation:{
    adjustedSymbols:built.sourceReceipt.currentListingStartReconciledSymbols,
    changedSnapshotCount:changed.length,
    changedSnapshots:changed.map(x=>({scanDate:x.scanDate,v01MemberCount:x.v01MemberCount,v02MemberCount:x.memberCount,delta:x.memberCountDelta})),
    knownPrimaryCause:{
      symbol:"6873",companyName:"泓德能源",
      currentCompanyListingDate:"2024-09-26",
      officialNewlistingEarliestContinuousDate:"2023-03-06",
      interpretation:"same-company continuous listing start is restored to the earlier Innovation Board listing date",
    },
  },
  scanClock:{
    snapshotCount:snapshots.length,
    minMemberCount:Math.min(...snapshots.map(x=>x.memberCount)),
    maxMemberCount:Math.max(...snapshots.map(x=>x.memberCount)),
    volatileSnapshotBundleHash:sha(snapshots.map(x=>[x.scanDate,x.memberCount,x.snapshotHash].join("|")).join("\n")),
    semanticSnapshotBundleHash:sha(snapshots.map(x=>[x.scanDate,x.memberCount,x.semanticSnapshotHash].join("|")).join("\n")),
    snapshots,
  },
  guards:{
    noReturns:true,noD1Writes:true,noR2Writes:true,noSystem1Runtime:true,noFormalCoreImpact:true,
    oldReceiptRewritten:false,versionedSemanticChange:true,semanticSnapshotHashExcludesCaptureClock:true,
  },
};
console.log("D08_TWSE_UNIVERSE_PROVENANCE_V0_2="+JSON.stringify(receipt));
