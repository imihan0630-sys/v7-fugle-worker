import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  buildD19TpexHistoricalUniverseSourceV0_1,
  buildD19TpexUniverseSnapshotV0_1,
} from "../runtime/d19_tpex_historical_universe_source_v0_1.mjs";

const datasetStartDate="2023-01-01";
const snapshotDate="2026-08-31";
const observedAt=new Date().toISOString();

const source=await buildD19TpexHistoricalUniverseSourceV0_1({
  datasetStartDate,
  observedAt,
  archiveStartYear:2005,
  throughYear:2026,
});

assert.equal(source.registry.unknownStartCount,0);
assert.equal(source.registry.replayEligibleCount,source.registry.membershipCount);
assert.ok(source.sourceReceipt.currentCount>800);
assert.ok(source.sourceReceipt.newListedArchiveCount>100);
assert.ok(source.sourceReceipt.delistedCount>0);
assert.equal(source.sourceReceipt.currentIndustryUsedForHistoricalReplay,false);
assert.equal(source.registry.futureDelistingInfoExposedToStrategy,false);

const snapshot=await buildD19TpexUniverseSnapshotV0_1({
  source,
  marketDate:snapshotDate,
  capturedAt:observedAt,
});
assert.ok(snapshot.memberCount>800);
assert.equal(snapshot.futureMembershipEndExposed,false);
assert.ok(snapshot.members.every((x)=>x.market==="TPEX"));
assert.ok(snapshot.members.every((x)=>x.membershipStateAtReplay==="ACTIVE"));
assert.ok(snapshot.strategyVisibleFields.includes("membershipStateAtReplay"));
assert.equal(snapshot.strategyVisibleFields.includes("replayEligible"),false);
assert.ok(snapshot.members.every((x)=>x.industry===null));
assert.ok(snapshot.members.every((x)=>!Object.hasOwn(x,"effectiveTo")));

const symbols=new Set(snapshot.members.map((x)=>x.symbol));
assert.equal(symbols.has("5371"),true,"5371 delisted 2026-09-03 must still exist on 2026-08-31");
assert.equal(symbols.has("8183"),true,"8183 delisted 2026-10-01 must still exist on 2026-08-31");
assert.equal(symbols.has("4130"),false,"4130 delisted 2026-07-28 must not exist on 2026-08-31");
assert.equal(symbols.has("5236"),false,"5236 delisted 2026-07-16 must not exist on 2026-08-31");
for(const futureListing of ["3718","7825","2938","7856"]){
  assert.equal(symbols.has(futureListing),false,futureListing+" listed after 2026-08-31 must not leak backward");
}

const canonical={
  sourceReceipt:{
    datasetStartDate:source.sourceReceipt.datasetStartDate,
    archiveStartYear:source.sourceReceipt.archiveStartYear,
    throughYear:source.sourceReceipt.throughYear,
    currentCount:source.sourceReceipt.currentCount,
    newListedArchiveCount:source.sourceReceipt.newListedArchiveCount,
    delistedCount:source.sourceReceipt.delistedCount,
    datasetStartFallbackCount:source.sourceReceipt.datasetStartFallbackCount,
    currentSourceHash:source.sourceReceipt.currentSourceHash,
    newListedSourceHashes:source.sourceReceipt.newListedSourceHashes,
    delistedSourceHashes:source.sourceReceipt.delistedSourceHashes,
  },
  registry:{
    registryId:source.registry.registryId,
    membershipCount:source.registry.membershipCount,
    currentCount:source.registry.currentCount,
    delistedCount:source.registry.delistedCount,
    unknownStartCount:source.registry.unknownStartCount,
    replayEligibleCount:source.registry.replayEligibleCount,
    membershipDigest:source.registry.membershipDigest,
  },
  snapshot:{
    marketDate:snapshot.marketDate,
    memberCount:snapshot.memberCount,
    membershipHash:snapshot.membershipHash,
  },
};
const evidenceHash=createHash("sha256").update(JSON.stringify(canonical)).digest("hex");

console.log(JSON.stringify({
  result:"PASS_TPEX_HISTORICAL_UNIVERSE_SOURCE_V0_1",
  datasetStartDate,
  snapshotDate,
  sourceReceipt:source.sourceReceipt,
  registry:{
    registryId:source.registry.registryId,
    membershipCount:source.registry.membershipCount,
    currentCount:source.registry.currentCount,
    delistedCount:source.registry.delistedCount,
    unknownStartCount:source.registry.unknownStartCount,
    replayEligibleCount:source.registry.replayEligibleCount,
    membershipDigest:source.registry.membershipDigest,
  },
  snapshot:{
    memberCount:snapshot.memberCount,
    membershipHash:snapshot.membershipHash,
    positiveBoundaryChecks:{
      activeUntilSeptember5371:symbols.has("5371"),
      activeUntilOctober8183:symbols.has("8183"),
    },
    negativeBoundaryChecks:{
      delistedBeforeSnapshot4130:symbols.has("4130"),
      delistedBeforeSnapshot5236:symbols.has("5236"),
      futureListingsLeaked:["3718","7825","2938","7856"].filter((x)=>symbols.has(x)),
    },
  },
  evidenceHash,
  interpretation:{
    currentListAloneRejectedAsHistoricalUniverse:true,
    delistedNamesReinsertedForTheirValidIntervals:true,
    futureListingsExcluded:true,
    futureDelistingMetadataNotExposedToStrategy:true,
    currentIndustryNotBackfilledHistorically:true,
    sourceIndependentPersistenceStillRequired:true,
    tpexPricePopulationReplayStillSeparateGate:true,
    l3PromotionAuthorized:false,
  },
  formalCoreChanged:false,
  productionChanged:false,
},null,2));
