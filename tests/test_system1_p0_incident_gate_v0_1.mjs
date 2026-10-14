import assert from "node:assert/strict";
import {classifyQuarterEpsSnapshot,classifyAmbiguousRecovery,classifyHistory60Census,
  classifyMonitoringSafety,classifyCpuReadiness} from "../research/system1_p0_incident_gate_v0_1.mjs";

const day="2026-10-13",later="2026-10-14";
const quality={marketDate:day,datasets:{QUARTER_EPS:{ready:true,count:0}}};
const empty=classifyQuarterEpsSnapshot({marketDate:day,status:quality});
assert.equal(empty.state,"EPS_CANDIDATE_RECEIPT_EMPTY");
assert.equal(empty.candidateEpsReportCount,0);
assert.equal(empty.preliminaryCountKnown,false);
assert.equal(empty.mayDeclareFullMarketEpsCoverage,false);
assert.equal(empty.mayClaimNoCandidate,false);
assert.equal(classifyQuarterEpsSnapshot({marketDate:day,status:quality,preliminaryCount:0}).mayClaimNoCandidate,true);
assert.equal(classifyQuarterEpsSnapshot({marketDate:day,status:quality,preliminaryCount:4}).allCandidateEpsReviewed,false);
assert.equal(classifyQuarterEpsSnapshot({marketDate:day,status:{...quality,marketDate:later}}).state,"EPS_SNAPSHOT_UNVERIFIED");
assert.equal(classifyQuarterEpsSnapshot({marketDate:day,status:{marketDate:day,datasets:{QUARTER_EPS:{ready:false,count:0}}}}).state,"EPS_SNAPSHOT_UNVERIFIED");
assert.equal(classifyQuarterEpsSnapshot({marketDate:day,status:{marketDate:day,datasets:{QUARTER_EPS:{ready:true,count:2}}},preliminaryCount:2}).allCandidateEpsReviewed,true);

const oldFormal={scanDate:"2026-09-29",pipeline:{complete:false}};
const unknown=classifyAmbiguousRecovery({marketDate:day,priorPostHttpStatus:503,scanStatus:oldFormal});
assert.equal(unknown.state,"FORMAL_SCAN_NOT_CONFIRMED");
assert.equal(unknown.businessRecoveryStateUncertain,true);
assert.equal(unknown.mayRetryBusinessPost,false);
assert.equal(unknown.mayCountAsZeroPicks,false);
assert.equal(classifyAmbiguousRecovery({marketDate:day,priorPostHttpStatus:"TIMEOUT"}).state,"SCAN_READBACK_UNKNOWN");
assert.equal(classifyAmbiguousRecovery({marketDate:day,priorPostHttpStatus:503,scanStatus:{scanDate:day,pipeline:{complete:false}}}).state,"FORMAL_PIPELINE_UNVERIFIED");
assert.equal(classifyAmbiguousRecovery({marketDate:day,priorPostHttpStatus:503,scanStatus:{scanDate:day,pipeline:{complete:true}}}).state,"SCAN_RECORDED_BUT_C1_PARENT_UNVERIFIED");
const c1={ok:true,header:{sessionDate:day,generationId:"GEN_A"}};
const scan={scanDate:day,pipeline:{complete:true}};
assert.equal(classifyAmbiguousRecovery({marketDate:day,priorPostHttpStatus:503,scanStatus:scan,c1Generation:c1}).state,"C1_PARENT_UNBOUND_TO_FORMAL_DECISION");
const proved=classifyAmbiguousRecovery({marketDate:day,priorPostHttpStatus:503,scanStatus:scan,
 c1Generation:c1,formalC1Binding:{status:"VERIFIED",c1GenerationId:"GEN_A"}});
assert.equal(proved.state,"FORMAL_C1_PARENT_BOUND_READONLY_CONFIRMED");
assert.equal(proved.mayPublishFormalPlan,false);

const partition={"60_BARS_AND_60_MARKET_SESSIONS_PRESENT":1676,
  "CALENDAR_GAP_NEEDS_LISTING_OR_HALT_PROVENANCE":204,
  "LATEST_COMPLETED_QUOTE_NOT_PRESENT":21,"FEWER_THAN_60_COMPLETED_BARS":7};
const history=classifyHistory60Census({marketDate:day,total:1908,classes:partition});
assert.equal(history.state,"HISTORY_PROVENANCE_PENDING");
assert.equal(history.aligned+history.listingOrHaltProvenancePending+history.latestSessionStale+history.fewerThan60,1908);
assert.equal(history.eligibleForFormalFullCoverage,false);
assert.equal(history.gapIsNotAutomaticallyMissingApiData,true);
assert.equal(classifyHistory60Census({marketDate:day,total:1907,classes:partition}).state,"HISTORY_DENOMINATOR_OR_PARTITION_UNVERIFIED");
assert.equal(classifyHistory60Census({marketDate:day,total:2,classes:{
 ...Object.fromEntries(Object.keys(partition).map(k=>[k,0])),
 "60_BARS_AND_60_MARKET_SESSIONS_PRESENT":2
},perSymbolProvenanceVerified:true}).eligibleForFormalFullCoverage,true);

const monitors=classifyMonitoringSafety({marketDate:later,
  monitorKeys:["FORMAL:3037","FORMAL:6226","AIDEEN_APP:6213","AIDEEN_APP:6672"],
  brokerPositions:[{symbol:"6226",shares:100}],closedSymbols:["3037"],
  quotesByKey:{"AIDEEN_APP:6213":{isTrial:true,quoteFresh:false},
    "AIDEEN_APP:6672":{isTrial:true,quoteFresh:false}},
  freshPlanDate:day});
assert.equal(monitors.formalPlanCurrent,false);
assert.deepEqual(monitors.monitoringNotPosition,["FORMAL:3037"]);
assert.deepEqual(monitors.trialQuotes,["AIDEEN_APP:6213","AIDEEN_APP:6672"]);
assert.equal(monitors.mayUseTrialQuoteForTrade,false);
assert.equal(monitors.mayGenerateBuySellAdviceFromWatchlist,false);
const noBroker=classifyMonitoringSafety({marketDate:later,monitorKeys:["FORMAL:6226"]});
assert.equal(noBroker.state,"BROKER_PORTFOLIO_NOT_RECONCILED");
assert.throws(()=>classifyMonitoringSafety({marketDate:day,monitorKeys:["FORMAL:6226","FORMAL:6226"]}),/DUPLICATE_OR_INVALID_MONITOR_IDENTITY/);
const cpu=classifyCpuReadiness({providerExceededResources:true,candidateOnly:true,workerDeployed:false,originalLimitMs:10,observedQuoteAgeSeconds:30});
assert.equal(cpu.actualPass,false);
assert.equal(cpu.offlineCandidateIsNotDeployment,true);
assert.equal(cpu.originalQuoteFreshSeconds,90);
assert.equal(classifyCpuReadiness({providerExceededResources:false,candidateOnly:false,workerDeployed:true,observedQuoteAgeSeconds:35,sourceIsTrial:true,underlyingBusinessState:"PASS_INTRADAY_MONITOR_FRESHNESS"}).actualPass,false);
assert.equal(classifyCpuReadiness({providerExceededResources:false,candidateOnly:false,workerDeployed:true,observedQuoteAgeSeconds:35,sourceIsTrial:false,underlyingBusinessState:"PASS_INTRADAY_MONITOR_FRESHNESS"}).actualPass,true);
assert.throws(()=>classifyCpuReadiness({originalLimitMs:50}),/P0_ORIGINAL_FREE_CPU_LIMIT_CHANGED/);
assert.throws(()=>classifyAmbiguousRecovery({marketDate:"future"}),/TARGET_MARKET_DATE_REQUIRED/);
console.log(JSON.stringify({ok:true,fixtureOnly:true,actual20261013HistoryTotal:1908,
 sourceEpsScopeProtected:true,ambiguous503NoRetry:true,c1ZeroPickProhibited:true,
 original90SecondsPreserved:true,original10msPreserved:true,
 closedStockNotReintroducedAsHolding:true,trialQuotesBlocked:true,
 noProductionSourceReads:true,noWorkerWrite:true,noD1KvWrite:true,noTrade:true,noPush:true}));
