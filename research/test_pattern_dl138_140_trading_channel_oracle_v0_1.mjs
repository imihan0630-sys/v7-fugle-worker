import assert from "node:assert/strict";
import {
  validateCanonicalBarChannelBinding,classifyChannelAvailability,classifyChannelDependency,
  validateChannelVote,classifySessionMechanism,validateMechanismConfirmation,
  validateCrossVintageChannelSupport,validateChannelRegimeReceipt,aggregateChannelDenominator
} from "./pattern_dl138_140_trading_channel_oracle_v0_1.mjs";

let p=0;const t=(n,f)=>{f();p++;console.log("PASS",n);};

t("D13801 canonical bar channel binding valid",()=>assert.equal(validateCanonicalBarChannelBinding({canonicalBarSourceId:"S1",channelCompositionVersion:"C1",includedTradingChannels:["REGULAR_LOT"],excludedTradingChannels:["INTRADAY_ODD_LOT"],silentCustomFusion:false}).status,"CANONICAL_BAR_CHANNEL_BINDING_VALID"));
t("D13802 silent regular plus odd-lot fusion prohibited",()=>assert.equal(validateCanonicalBarChannelBinding({canonicalBarSourceId:"S1",channelCompositionVersion:"C1",includedTradingChannels:["REGULAR_LOT","INTRADAY_ODD_LOT"],excludedTradingChannels:[],silentCustomFusion:true}).status,"SILENT_CHANNEL_FUSION_PROHIBITED"));
t("D13803 pre-2020 intraday odd lot is not missing",()=>assert.equal(classifyChannelAvailability({channelClass:"INTRADAY_ODD_LOT",marketSessionDate:"2020-10-23",ruleEffective:false,sourceExpected:false,sourceObserved:false,channelCompositionKnown:true}).status,"CHANNEL_NOT_YET_AVAILABLE_BY_DESIGN"));
t("D13804 expected live channel missing is source missing",()=>assert.equal(classifyChannelAvailability({channelClass:"INTRADAY_ODD_LOT",marketSessionDate:"2021-01-01",ruleEffective:true,sourceExpected:true,sourceObserved:false,channelCompositionKnown:true}).status,"CHANNEL_SOURCE_MISSING"));
t("D13805 unknown source composition blocks",()=>assert.equal(classifyChannelAvailability({channelClass:"REGULAR_LOT",marketSessionDate:"2021-01-01",ruleEffective:true,sourceExpected:true,sourceObserved:true,channelCompositionKnown:false}).status,"CHANNEL_COMPOSITION_UNKNOWN_BLOCKED"));
t("D13806 observed channel with known composition passes",()=>assert.equal(classifyChannelAvailability({channelClass:"REGULAR_LOT",marketSessionDate:"2021-01-01",ruleEffective:true,sourceExpected:true,sourceObserved:true,channelCompositionKnown:true}).status,"CHANNEL_OBSERVED"));

const reg={securityIdentity:"SEC1",marketSessionDate:"2021-06-15",channelClass:"REGULAR_LOT"};
const odd={securityIdentity:"SEC1",marketSessionDate:"2021-06-15",channelClass:"INTRADAY_ODD_LOT"};
t("D13807 same security date cross-channel is dependency-linked",()=>assert.equal(classifyChannelDependency(reg,odd).status,"SAME_SECURITY_DATE_CROSS_CHANNEL_DEPENDENCY"));
t("D13808 cross-channel observations cannot each be independent vote",()=>assert.equal(validateChannelVote({sameSecurityDate:true,observedChannelCount:2,independentVoteCount:2}).status,"CHANNEL_VOTE_MULTIPLICATION_PROHIBITED"));
t("D13809 dependence may remain unquantified for D16",()=>assert.equal(validateChannelVote({sameSecurityDate:true,observedChannelCount:2,independentVoteCount:null}).status,"CHANNEL_DEPENDENCE_PRESERVED"));

t("D13901 regular mechanism class valid",()=>assert.equal(classifySessionMechanism({mechanism:"REGULAR_CONTINUOUS"}).status,"MECHANISM_CLASS_VALID"));
t("D13902 unknown invented mechanism rejected",()=>assert.equal(classifySessionMechanism({mechanism:"MAGIC_SESSION"}).status,"MECHANISM_CLASS_INVALID"));
t("D13903 after-hours fixed price cannot be second confirmation",()=>assert.equal(validateMechanismConfirmation({mechanism:"AFTER_HOURS_FIXED_PRICE",tradePriceEqualsRegularClose:true,countedAsIndependentConfirmation:true}).status,"AFTER_HOURS_FIXED_PRICE_FALSE_CONFIRMATION"));
t("D13904 fixed-price trade remains execution context",()=>assert.equal(validateMechanismConfirmation({mechanism:"AFTER_HOURS_FIXED_PRICE",tradePriceEqualsRegularClose:true,countedAsIndependentConfirmation:false}).status,"FIXED_PRICE_EXECUTION_CONTEXT_ONLY"));
t("D13905 odd-lot geometry cannot replace regular geometry silently",()=>assert.equal(validateMechanismConfirmation({mechanism:"INTRADAY_ODD_LOT_CALL_AUCTION",replacedRegularGeometry:true}).status,"ODD_LOT_REPLACES_REGULAR_GEOMETRY_PROHIBITED"));
t("D13906 block trade not first-wave canonical bar",()=>assert.equal(validateMechanismConfirmation({mechanism:"BLOCK_TRADE",usedAsFirstWaveCanonicalPatternBar:true}).status,"BLOCK_TRADE_FIRST_WAVE_BAR_PROHIBITED"));

const s={securityIdentity:"SEC1",channelClass:"REGULAR_LOT",channelCompositionVersion:"C1",blockedRowPolicyId:"B1",channelAvailableOnDate:true};
t("D14001 same channel regime common support valid",()=>assert.equal(validateCrossVintageChannelSupport(s,{...s}).status,"CHANNEL_COMMON_SUPPORT_VALID"));
t("D14002 composition-version drift blocks common support",()=>assert.equal(validateCrossVintageChannelSupport(s,{...s,channelCompositionVersion:"C2"}).status,"CHANNEL_COMMON_SUPPORT_MISMATCH"));
t("D14003 channel availability mismatch blocks",()=>assert.equal(validateCrossVintageChannelSupport(s,{...s,channelAvailableOnDate:false}).status,"CHANNEL_AVAILABILITY_MISMATCH"));

t("D14004 complete channel regime receipt passes",()=>assert.equal(validateChannelRegimeReceipt({market:"TWSE",securityIdentity:"SEC1",marketSessionDate:"2021-06-15",channelClass:"REGULAR_LOT",channelRuleVersion:"R1",channelEffectiveFrom:"2020-01-01",sourceChannelCompositionVersion:"C1",sourceHash:"h",firstObservableAt:"t"}).status,"CHANNEL_REGIME_RECEIPT_VALID"));
t("D14005 missing composition version fails receipt",()=>assert.equal(validateChannelRegimeReceipt({market:"TWSE",securityIdentity:"SEC1",marketSessionDate:"2021-06-15",channelClass:"REGULAR_LOT",channelRuleVersion:"R1",channelEffectiveFrom:"2020-01-01",sourceHash:"h",firstObservableAt:"t"}).status,"CHANNEL_REGIME_RECEIPT_INCOMPLETE"));

t("D14006 denominator keeps by-design unavailable channel",()=>{const x=aggregateChannelDenominator([{state:"CHANNEL_OBSERVED"},{state:"CHANNEL_NOT_YET_AVAILABLE_BY_DESIGN"},{state:"CHANNEL_SOURCE_MISSING"},{state:"CHANNEL_COMPOSITION_UNKNOWN_BLOCKED"}]);assert.equal(x.total,4);assert.equal(x.counts.CHANNEL_NOT_YET_AVAILABLE_BY_DESIGN,1);});
t("D14007 unknown mechanism state remains denominator-accounted",()=>{const x=aggregateChannelDenominator([{state:"MECHANISM_RULE_UNKNOWN_BLOCKED"}]);assert.equal(x.counts.MECHANISM_RULE_UNKNOWN_BLOCKED,1);});

console.log(`SUMMARY ${p}/22 PASS`);
