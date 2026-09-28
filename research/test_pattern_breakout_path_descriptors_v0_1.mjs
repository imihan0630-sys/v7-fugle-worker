import assert from "node:assert/strict";
import {describeBreakoutPath} from "./pattern_breakout_path_descriptors_v0_1.mjs";

const B={boundaryId:"R1",version:"ZONE_V1",lower:99,upper:101};
const bar=(date,open,low,high,close,extra={})=>({date,open,low,high,close,eligibleSymbolSession:true,...extra});

const path=[
  bar("2026-09-01",99,98,100,99),
  bar("2026-09-02",101,100,104,102),
  bar("2026-09-03",102,101.2,105,104),
  bar("2026-09-04",101,99.5,103,100),
  bar("2026-09-05",99,97,100,98),
  bar("2026-09-06",100,99.5,104,103),
];

const full=describeBreakoutPath({direction:"UP",boundary:B,bars:path,atrAtBreak:2,atrPointInTimeVerified:true});
assert.equal(full.observationStatus,"OBSERVABLE");
assert.equal(full.firstConfirmedBreakAt,"2026-09-02");
assert.equal(full.eligibleBarsSinceBreak,5);
assert.equal(full.observableBarsSinceBreak,5);
assert.equal(full.eligibleBarsBeyondBreakBoundary,3);
assert.equal(full.eligibleBarsInsideZone,1);
assert.equal(full.eligibleBarsBeyondFailureEdge,1);
assert.equal(full.fractionBeyondBreakBoundary,3/5);
assert.equal(full.longestConsecutiveBeyondBoundaryRun,2);
assert.equal(full.currentConsecutiveBeyondBoundaryRun,1);
assert.equal(full.maxFavorableIntradayExtensionBreakInclusive,4);
assert.equal(full.maxFavorableIntradayExtensionPostBreak,4);
assert.equal(full.maxFavorableClosingExtension,3);
assert.equal(full.maxFavorableIntradayExtensionAtr,2);
assert.equal(full.firstReentryEligibleSessionOffset,2);
assert.equal(full.firstFailureEligibleSessionOffset,3);
assert.equal(full.firstReclaimEligibleSessionOffset,4);
assert.equal(full.observedInsideOrFailureBarsBeforeFirstReclaim,2);
assert.equal(full.noFollowThroughDescriptor.tunedNDayThreshold,null);

// Prefix replay is invariant: future failure/reclaim cannot rewrite a prior descriptor snapshot.
const prefix=describeBreakoutPath({direction:"UP",boundary:B,bars:path.slice(0,3),atrAtBreak:2,atrPointInTimeVerified:true});
const fullAsOf=describeBreakoutPath({direction:"UP",boundary:B,bars:path,asOfDate:"2026-09-03",atrAtBreak:2,atrPointInTimeVerified:true});
const causalView=({asOfDate,...rest})=>rest;
assert.deepEqual(causalView(fullAsOf),causalView(prefix));
assert.equal(prefix.firstFailureEligibleSessionOffset,null);

// Break-bar extension is explicitly included and differs from post-break extension.
const breakSpike=describeBreakoutPath({direction:"UP",boundary:B,bars:[
  bar("2026-09-01",100,99,103,102),
  bar("2026-09-02",102,101.5,102.5,102),
]});
assert.equal(breakSpike.maxFavorableIntradayExtensionBreakInclusive,2);
assert.equal(breakSpike.maxFavorableIntradayExtensionPostBreak,1.5);

// Constrained sessions remain outside the persistence denominator until an unconstrained observation.
const constrainedPrefix=describeBreakoutPath({direction:"UP",boundary:B,bars:[
  bar("2026-09-01",101,101,105,105,{priceLimitConstrained:true}),
  bar("2026-09-02",105,105,110,110,{priceLimitConstrained:true}),
]});
assert.equal(constrainedPrefix.observationStatus,"CONSTRAINED_UNRESOLVED");
assert.equal(constrainedPrefix.observableBarsSinceBreak,0);
assert.equal(constrainedPrefix.fractionBeyondBreakBoundary,null);
const constrainedResolved=describeBreakoutPath({direction:"UP",boundary:B,bars:[
  bar("2026-09-01",101,101,105,105,{priceLimitConstrained:true}),
  bar("2026-09-02",105,105,110,110,{priceLimitConstrained:true}),
  bar("2026-09-03",109,108,112,109),
]});
assert.equal(constrainedResolved.observationStatus,"PARTIALLY_OBSERVED");
assert.equal(constrainedResolved.eligibleBarsSinceBreak,3);
assert.equal(constrainedResolved.observableBarsSinceBreak,1);
assert.equal(constrainedResolved.fractionBeyondBreakBoundary,1);

// Unknown symbol-session provenance blocks rather than treating an uncertain row as zero/no event.
const blocked=describeBreakoutPath({direction:"UP",boundary:B,bars:[
  {...bar("2026-09-01",101,100,103,102),eligibleSymbolSession:null},
]});
assert.equal(blocked.observationStatus,"DATA_BLOCKED");
assert.equal(blocked.blockedReason,"SYMBOL_SESSION_PROVENANCE_UNKNOWN");

// Boundary versions define distinct immutable episodes even with the same break date.
const v1=describeBreakoutPath({direction:"UP",boundary:B,bars:[bar("2026-09-01",101,100,103,102)]});
const v2=describeBreakoutPath({direction:"UP",boundary:{...B,version:"ZONE_V2"},bars:[bar("2026-09-01",101,100,103,102)]});
assert.notEqual(v1.episodeId,v2.episodeId);

// Downside mirror uses the same unsigned persistence geometry.
const down=describeBreakoutPath({direction:"DOWN",boundary:B,bars:[
  bar("2026-09-01",99,96,100,98),
  bar("2026-09-02",98,95,99,97),
]});
assert.equal(down.eligibleBarsBeyondBreakBoundary,2);
assert.equal(down.maxFavorableClosingExtension,2);
assert.equal(down.directionalEffect,"UNKNOWN");

console.log(JSON.stringify({ok:true,status:"PATTERN_BREAKOUT_PATH_DESCRIPTORS_PASS"}));
