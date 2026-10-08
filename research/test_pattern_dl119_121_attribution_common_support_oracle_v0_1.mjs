import assert from "node:assert/strict";
import {
  deriveCanonicalMarketDate,classifySessionAttribution,classifyAttributionRevision,
  validateCommonSupport,classifyGapBridge,validateNoPseudoBars,
  buildGapRoot,validateGapCommonSupport
} from "./pattern_dl119_121_attribution_common_support_oracle_v0_1.mjs";

let p=0;const t=(n,f)=>{f();p++;console.log("PASS",n);};
const h="a".repeat(64);

t("D11901 exchange closed is explicit state",()=>assert.equal(classifySessionAttribution({exchangeCalendarKnown:true,exchangeOpen:false}).status,"EXCHANGE_CLOSED"));
t("D11902 suspended symbol is not expected to trade",()=>assert.equal(classifySessionAttribution({exchangeCalendarKnown:true,exchangeOpen:true,symbolLifecycleKnown:true,suspensionKnown:true,symbolExpectedToTrade:true,suspended:true}).status,"SYMBOL_NOT_EXPECTED_TO_TRADE"));
t("D11903 lifecycle-out symbol is not expected to trade",()=>assert.equal(classifySessionAttribution({exchangeCalendarKnown:true,exchangeOpen:true,symbolLifecycleKnown:true,suspensionKnown:true,symbolExpectedToTrade:false,suspended:false}).status,"SYMBOL_NOT_EXPECTED_TO_TRADE"));
t("D11904 admitted official trade is traded",()=>assert.equal(classifySessionAttribution({exchangeCalendarKnown:true,exchangeOpen:true,symbolLifecycleKnown:true,suspensionKnown:true,symbolExpectedToTrade:true,suspended:false,officialTradeObserved:true,rawRowPresent:true}).status,"SYMBOL_TRADED"));
t("D11905 authoritative zero-trade remains explicit no-trade",()=>assert.equal(classifySessionAttribution({exchangeCalendarKnown:true,exchangeOpen:true,symbolLifecycleKnown:true,suspensionKnown:true,symbolExpectedToTrade:true,suspended:false,officialTradeObserved:false,rawRowPresent:false}).status,"SYMBOL_EXPECTED_NO_TRADE_CONFIRMED"));
t("D11906 official trade with missing raw row is data missing",()=>assert.equal(classifySessionAttribution({exchangeCalendarKnown:true,exchangeOpen:true,symbolLifecycleKnown:true,suspensionKnown:true,symbolExpectedToTrade:true,suspended:false,officialTradeObserved:true,rawRowPresent:false}).status,"DATA_MISSING"));
t("D11907 raw row contradicting official no-trade blocks",()=>assert.equal(classifySessionAttribution({exchangeCalendarKnown:true,exchangeOpen:true,symbolLifecycleKnown:true,suspensionKnown:true,symbolExpectedToTrade:true,suspended:false,officialTradeObserved:false,rawRowPresent:true}).status,"CONTRADICTION_BLOCKED"));
t("D11908 unknown exchange calendar blocks",()=>assert.equal(classifySessionAttribution({exchangeCalendarKnown:false}).status,"UNKNOWN_BLOCKED"));
t("D11909 unknown lifecycle blocks",()=>assert.equal(classifySessionAttribution({exchangeCalendarKnown:true,exchangeOpen:true,symbolLifecycleKnown:false}).reason,"SYMBOL_LIFECYCLE_UNKNOWN"));
t("D11910 unknown suspension blocks",()=>assert.equal(classifySessionAttribution({exchangeCalendarKnown:true,exchangeOpen:true,symbolLifecycleKnown:true,suspensionKnown:false}).reason,"SUSPENSION_STATE_UNKNOWN"));

const roots={calendarAttributionRootId:"C1",timezoneAttributionRootId:"T1",symbolLifecycleRootId:"L1",rawObservationRootId:"R1",tradeStatusRootId:"S1"};
t("D11911 calendar-root change is official calendar revision",()=>assert.equal(classifyAttributionRevision(roots,{...roots,calendarAttributionRootId:"C2"}).status,"OFFICIAL_CALENDAR_REVISION"));
t("D11912 timezone-root change is vendor timezone revision",()=>assert.equal(classifyAttributionRevision(roots,{...roots,timezoneAttributionRootId:"T2"}).status,"VENDOR_TIMEZONE_ATTRIBUTION_REVISION"));
t("D11913 lifecycle-root change is symbol lifecycle revision",()=>assert.equal(classifyAttributionRevision(roots,{...roots,symbolLifecycleRootId:"L2"}).status,"SYMBOL_LIFECYCLE_REVISION"));
t("D11914 raw-root change is pipeline revision",()=>assert.equal(classifyAttributionRevision(roots,{...roots,rawObservationRootId:"R2"}).status,"RAW_DATA_PIPELINE_REVISION"));
t("D11915 two attribution roots changing is multi-root revision",()=>assert.equal(classifyAttributionRevision(roots,{...roots,timezoneAttributionRootId:"T2",rawObservationRootId:"R2"}).status,"MULTI_ROOT_REVISION"));
t("D11916 identical roots are identical attribution",()=>assert.equal(classifyAttributionRevision(roots,{...roots}).status,"IDENTICAL_ATTRIBUTION"));

t("D12001 exchange-reported market date overrides different provider batch date",()=>{const x=deriveCanonicalMarketDate({marketTimezone:"Asia/Taipei",exchangeReportedMarketDate:"2021-06-15",providerBatchDate:"2021-06-16"});assert.equal(x.status,"MARKET_DATE_READY");assert.equal(x.marketDate,"2021-06-15");assert.equal(x.basis,"EXCHANGE_REPORTED_MARKET_DATE");});
t("D12002 UTC timestamp converts to next Taipei date",()=>{const x=deriveCanonicalMarketDate({marketTimezone:"Asia/Taipei",eventTimestamp:"2021-06-14T23:30:00Z",timestampSemantic:"TRADE_EVENT"});assert.equal(x.marketDate,"2021-06-15");});
t("D12003 explicit +08 timestamp preserves Taipei date",()=>assert.equal(deriveCanonicalMarketDate({marketTimezone:"Asia/Taipei",eventTimestamp:"2021-06-15T09:00:00+08:00",timestampSemantic:"TRADE_EVENT"}).marketDate,"2021-06-15"));
t("D12004 timezone-less timestamp blocks",()=>assert.equal(deriveCanonicalMarketDate({marketTimezone:"Asia/Taipei",eventTimestamp:"2021-06-15T09:00:00",timestampSemantic:"TRADE_EVENT"}).reason,"TIMESTAMP_TIMEZONE_AMBIGUOUS"));
t("D12005 provider batch date alone cannot define session",()=>assert.equal(deriveCanonicalMarketDate({marketTimezone:"Asia/Taipei",providerBatchDate:"2021-06-15"}).reason,"PROVIDER_BATCH_DATE_NOT_SESSION_DATE"));
t("D12006 wrong market timezone blocks",()=>assert.equal(deriveCanonicalMarketDate({marketTimezone:"UTC",exchangeReportedMarketDate:"2021-06-15"}).reason,"TIMEZONE_CONTRACT_MISMATCH"));
t("D12007 exchange date works without event timestamp",()=>assert.equal(deriveCanonicalMarketDate({marketTimezone:"Asia/Taipei",exchangeReportedMarketDate:"2021-06-15"}).status,"MARKET_DATE_READY"));

const support={market:"TWSE",marketDate:"2021-06-15",marketTimezone:"Asia/Taipei",calendarAttributionRootId:"C1",symbolLifecycleRootId:"L1",timezoneAttributionRootId:"T1",semanticSpace:"RAW_EXECUTION",sourceVintageId:"V1",sourceHistoryHash:h};
t("D12008 identical support passes",()=>assert.equal(validateCommonSupport(support,{...support}).status,"COMMON_SUPPORT_VALID"));
t("D12009 timezone attribution mismatch blocks common support",()=>assert.equal(validateCommonSupport(support,{...support,timezoneAttributionRootId:"T2"}).status,"COMMON_SUPPORT_MISMATCH"));
t("D12010 source vintage mismatch blocks common support",()=>assert.equal(validateCommonSupport(support,{...support,sourceVintageId:"V2"}).status,"COMMON_SUPPORT_MISMATCH"));
t("D12011 semantic-space mismatch blocks common support",()=>assert.equal(validateCommonSupport(support,{...support,semanticSpace:"TECHNICAL_CONTINUITY"}).status,"COMMON_SUPPORT_MISMATCH"));

t("D12101 adjacent traded sessions have direct bridge",()=>assert.equal(classifyGapBridge({priorTraded:true,currentTraded:true,attributionResolved:true,interveningStates:[]}).status,"DIRECT_ADJACENT_TRADED_SESSIONS"));
t("D12102 weekend/holiday-only interval is market-closed bridge",()=>assert.equal(classifyGapBridge({priorTraded:true,currentTraded:true,attributionResolved:true,interveningStates:["EXCHANGE_CLOSED","EXCHANGE_CLOSED"]}).status,"MARKET_CLOSED_ONLY"));
t("D12103 suspension interval is symbol-not-expected bridge",()=>assert.equal(classifyGapBridge({priorTraded:true,currentTraded:true,attributionResolved:true,interveningStates:["SYMBOL_NOT_EXPECTED_TO_TRADE","SYMBOL_NOT_EXPECTED_TO_TRADE"]}).status,"SYMBOL_NOT_EXPECTED_TO_TRADE_INTERVAL"));
t("D12104 confirmed no-trade eligible interval remains distinct",()=>assert.equal(classifyGapBridge({priorTraded:true,currentTraded:true,attributionResolved:true,interveningStates:["SYMBOL_EXPECTED_NO_TRADE_CONFIRMED"]}).status,"EXPECTED_TO_TRADE_NO_TRADE_CONFIRMED"));
t("D12105 missing-data interval blocks gap interpretation",()=>assert.equal(classifyGapBridge({priorTraded:true,currentTraded:true,attributionResolved:true,interveningStates:["DATA_MISSING"]}).status,"DATA_MISSING_INTERVAL"));
t("D12106 unresolved attribution blocks",()=>assert.equal(classifyGapBridge({priorTraded:true,currentTraded:true,attributionResolved:false,interveningStates:["EXCHANGE_CLOSED"]}).status,"ATTRIBUTION_UNCERTAIN_INTERVAL"));
t("D12107 holiday plus suspension is mixed interval",()=>assert.equal(classifyGapBridge({priorTraded:true,currentTraded:true,attributionResolved:true,interveningStates:["EXCHANGE_CLOSED","SYMBOL_NOT_EXPECTED_TO_TRADE"]}).status,"MIXED_INTERVAL"));
t("D12108 no synthetic bar across holiday is valid",()=>assert.equal(validateNoPseudoBars({interveningStates:["EXCHANGE_CLOSED","EXCHANGE_CLOSED"],syntheticBarsCreated:0}).status,"NO_PSEUDO_BAR_VIOLATION"));
t("D12109 forward-filled holiday pseudo bar is prohibited",()=>assert.equal(validateNoPseudoBars({interveningStates:["EXCHANGE_CLOSED"],syntheticBarsCreated:1}).status,"PSEUDO_BAR_PROHIBITED"));
t("D12110 one endpoint pair remains one gap root despite two holiday dates",()=>{const x=buildGapRoot({priorBarId:"FRI",currentBarId:"MON",interveningStates:["EXCHANGE_CLOSED","EXCHANGE_CLOSED"]});assert.equal(x.effectiveIndependentGapRootCount,1);assert.equal(x.calendarSpacingStateCount,2);});

const gapSupport={attributionClass:"MARKET_CLOSED_ONLY",semanticSpace:"RAW_EXECUTION",priceLimitPolicyId:"PL1",suspensionPolicyId:"SP1",calendarTimezonePolicyId:"TZ1"};
t("D12111 identical gap support passes",()=>assert.equal(validateGapCommonSupport(gapSupport,{...gapSupport}).status,"GAP_COMMON_SUPPORT_VALID"));
t("D12112 suspension bridge cannot be pooled with holiday bridge",()=>assert.equal(validateGapCommonSupport(gapSupport,{...gapSupport,attributionClass:"SYMBOL_NOT_EXPECTED_TO_TRADE_INTERVAL"}).status,"GAP_COMMON_SUPPORT_MISMATCH"));
t("D12113 explicit stratification permits comparison without pooling",()=>assert.equal(validateGapCommonSupport(gapSupport,{...gapSupport,attributionClass:"SYMBOL_NOT_EXPECTED_TO_TRADE_INTERVAL"},true).status,"GAP_STRATIFIED_COMPARISON_REQUIRED"));

console.log(`SUMMARY ${p}/40 PASS`);
