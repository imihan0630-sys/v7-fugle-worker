import assert from "node:assert/strict";
import {applyTaxonomyBridge,tallyContextStates} from "./d01_dl147_taxonomy_bridge_firewall_v0_1.mjs";
const price={securityId:"TPEX-1595",priceRootHash:"RAW_PRICE_1595",episodeId:"PIVOT_21"};
const origin={securityId:"TPEX-1595",scheme:"TPEX_OFFICIAL",version:"2026_PRE",
 sector:"ELECTRONIC_COMPONENTS",memberReceipt:"PRE_1595",availableAt:"2026-05-19T12:00:00+08:00",effectiveFrom:"2026-01-01T00:00:00+08:00"};
const target={...origin,version:"2026_POST",sector:"SEMICONDUCTORS",memberReceipt:"POST_1595",effectiveFrom:"2026-06-01T00:00:00+08:00"};
const bridge={ownerReceiptId:"D09_CERT_V1",ownerDomain:"D09",ownerCertified:true,
 fromScheme:origin.scheme,fromVersion:origin.version,toScheme:target.scheme,toVersion:target.version,
 availableAt:"2026-05-20T00:00:00+08:00",effectiveFrom:"2026-06-01T00:00:00+08:00",
 mappingType:"RECOMPUTED_COMMON_SUPPORT",peerMembershipCoverageComplete:true,
 originPeerSetHash:"OLD_PEERS",targetPeerSetHash:"NEW_PEERS",commonSupportHash:"REBUILT_MATCH",
 metricRecomputedAtDecision:true,unknownPeerCount:0,conflictPeerCount:0};
const after="2026-06-02T17:00:00+08:00";
const run=(more={})=>applyTaxonomyBridge({priceNode:price,origin,target,bridge,decisionAt:after,...more});
const cases=[
 ["actual effective-dated reclassification with recomputed peers",()=>assert.equal(run().state,"RECOMPUTED_SECTOR_CONTEXT_CERTIFIED")],
 ["price-root unchanged across taxonomy",()=>assert.equal(run().price.priceRootHash,price.priceRootHash)],
 ["episode identity unchanged",()=>assert.equal(run().price.episodeId,price.episodeId)],
 ["same classification version accepted",()=>assert.equal(run({target:origin}).state,"SAME_TAXONOMY_CONTEXT")],
 ["same version conflicting membership blocked",()=>assert.equal(run({target:{...origin,sector:"SEMICONDUCTORS"}}).reason,"SAME_VERSION_MEMBERSHIP_CONFLICT")],
 ["future sector not active before effective",()=>assert.equal(run({decisionAt:"2026-05-25T18:00:00+08:00"}).reason,"FUTURE_CLASSIFICATION_NOT_ACTIVE")],
 ["not-yet-known post sector blocked even after start",()=>assert.equal(run({target:{...target,availableAt:"2026-06-03T12:00:00+08:00"}}).reason,"HISTORICAL_CLASSIFICATION_NOT_YET_KNOWN")],
 ["no D09 bridge cannot compare",()=>assert.equal(run({bridge:null}).reason,"BRIDGE_OWNER_VERSION_MISSING")],
 ["non-D09 owner cannot certify",()=>assert.equal(run({bridge:{...bridge,ownerDomain:"D01"}}).reason,"BRIDGE_OWNER_VERSION_MISSING")],
 ["bridge mapped to wrong vintage blocked",()=>assert.equal(run({bridge:{...bridge,toVersion:"2026_UNKNOWN"}}).reason,"BRIDGE_OWNER_VERSION_MISSING")],
 ["bridge known too late blocked",()=>assert.equal(run({bridge:{...bridge,availableAt:"2026-06-04T00:00:00+08:00"}}).reason,"BRIDGE_NOT_KNOWN_AT_DECISION")],
 ["bridge not yet effective blocked",()=>assert.equal(run({bridge:{...bridge,effectiveFrom:"2026-07-01T00:00:00+08:00"}}).reason,"BRIDGE_NOT_YET_EFFECTIVE")],
 ["pure category display alias not an extra signal",()=>assert.equal(run({bridge:{...bridge,mappingType:"LABEL_ALIAS_ONLY"}}).sectorComparisonAllowed,false)],
 ["display alias preserves price episode",()=>assert.equal(run({bridge:{...bridge,mappingType:"LABEL_ALIAS_ONLY"}}).price.episodeId,price.episodeId)],
 ["unrecognized bridge mapping blocks",()=>assert.equal(run({bridge:{...bridge,mappingType:"OTHER"}}).reason,"BRIDGE_COMPARISON_MODE_UNKNOWN")],
 ["partial peer universe blocked",()=>assert.equal(run({bridge:{...bridge,peerMembershipCoverageComplete:false}}).reason,"PEER_SUPPORT_OR_RECOMPUTATION_UNKNOWN")],
 ["missing previous peer membership hash blocked",()=>assert.equal(run({bridge:{...bridge,originPeerSetHash:null}}).reason,"PEER_SUPPORT_OR_RECOMPUTATION_UNKNOWN")],
 ["no rebuilt sector metric blocked",()=>assert.equal(run({bridge:{...bridge,metricRecomputedAtDecision:false}}).reason,"PEER_SUPPORT_OR_RECOMPUTATION_UNKNOWN")],
 ["unknown member count blocks",()=>assert.equal(run({bridge:{...bridge,unknownPeerCount:1}}).reason,"UNKNOWN_PEER_DENOMINATOR")],
 ["conflicting member count blocks",()=>assert.equal(run({bridge:{...bridge,conflictPeerCount:1}}).reason,"UNKNOWN_PEER_DENOMINATOR")],
 ["different issuer cannot stitch",()=>assert.equal(run({target:{...target,securityId:"TWSE-1595"}}).reason,"CROSS_SECURITY_IDENTITY")],
 ["unknown target scheme blocks",()=>assert.equal(run({target:{...target,scheme:""}}).reason,"SCHEME_VERSION_UNKNOWN")],
 ["missing price root blocks",()=>assert.equal(run({priceNode:{...price,priceRootHash:null}}).reason,"PRICE_NODE_NOT_CERTIFIED")],
 ["same version before current effectiveness fails",()=>assert.equal(run({target:origin,decisionAt:"2025-12-01T00:00:00+08:00"}).reason,"HISTORICAL_CLASSIFICATION_NOT_YET_KNOWN")],
 ["denominator includes unknown and display-only",()=>{let x=tallyContextStates([run(),run({target:origin}),run({bridge:{...bridge,mappingType:"LABEL_ALIAS_ONLY"}}),run({bridge:null})]);assert.equal(x.total,4);assert.equal(x.eligibleForSectorComparison,2);assert.equal(x.displayOnly,1);assert.equal(x.blocked,1)}],
];
let pass=0,failed=[];
for(const [name,test] of cases)try{test();pass++;console.log("PASS "+name)}catch(e){failed.push({name,error:e.message});console.error("FAIL "+name+": "+e.message)}
console.log(JSON.stringify({suite:"D01_DL147_TAXONOMY_BRIDGE_OUTCOME_BLIND",pass,total:cases.length,failed}));
if(failed.length)process.exitCode=1;
