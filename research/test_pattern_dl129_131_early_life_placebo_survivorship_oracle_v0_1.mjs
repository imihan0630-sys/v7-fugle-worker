import assert from "node:assert/strict";
import {
  classifyPriceDiscovery,validateEarlyLifeModule,validatePlaceboPair,
  validateReferenceMechanicControl,validateListingCohortPredictor,
  validateCohortDenominator,validateTerminalStateUnlock
} from "./pattern_dl129_131_early_life_placebo_survivorship_oracle_v0_1.mjs";

let p=0;const t=(n,f)=>{f();p++;console.log("PASS",n);};

t("D12901 new security listing classified separately",()=>assert.equal(classifyPriceDiscovery({transitionClass:"NEW_SECURITY_INITIAL_LISTING"}).status,"NEW_SECURITY_INITIAL_LISTING_PRICE_DISCOVERY"));
t("D12902 same-security transfer classified separately",()=>assert.equal(classifyPriceDiscovery({transitionClass:"SAME_SECURITY_TRANSFER_LISTING"}).status,"SAME_SECURITY_TRANSFER_LISTING_PRICE_DISCOVERY"));
t("D12903 successor initial listing classified separately",()=>assert.equal(classifyPriceDiscovery({transitionClass:"SUCCESSOR_SECURITY_INITIAL_LISTING"}).status,"SUCCESSOR_SECURITY_INITIAL_LISTING_PRICE_DISCOVERY"));
t("D12904 mature trading remains distinct",()=>assert.equal(classifyPriceDiscovery({matureContinuous:true}).status,"MATURE_CONTINUOUS_TRADING"));

const first={priceDiscoveryClass:"NEW_SECURITY_INITIAL_LISTING_PRICE_DISCOVERY",listingAgeEligibleSessions:1,completedBar:true,sameSecurityBarsAvailable:1};
t("D12905 first completed candle geometry eligible",()=>assert.equal(validateEarlyLifeModule("D01-02",first).status,"D0102_EARLY_LIFE_GEOMETRY_ELIGIBLE"));
t("D12906 two-bar sequence waits for same-security history",()=>assert.equal(validateEarlyLifeModule("D01-03",{...first,requiredBars:2}).status,"D0103_SEQUENCE_HISTORY_TOO_SHORT"));
t("D12907 base waits for sufficient same-security history",()=>assert.equal(validateEarlyLifeModule("D01-07",{...first,requiredBaseWidth:20}).status,"D0107_BASE_HISTORY_TOO_SHORT"));
t("D12908 listing reference cannot be prior close",()=>assert.equal(validateEarlyLifeModule("D01-09",{...first,usedReferenceBasisAsPriorClose:true}).status,"LISTING_REFERENCE_NOT_PRIOR_CLOSE"));
t("D12909 transfer-listing gap gets migration context",()=>assert.equal(validateEarlyLifeModule("D01-09",{priceDiscoveryClass:"SAME_SECURITY_TRANSFER_LISTING_PRICE_DISCOVERY",listingAgeEligibleSessions:500,dl123Pass:true}).status,"MARKET_MIGRATION_BOUNDARY_GAP_CONTEXT"));

const sig={moduleId:"D01-02",priceDiscoveryClass:"NEW_SECURITY_INITIAL_LISTING_PRICE_DISCOVERY",listingAgeSupportId:"AGE-1",identityTransitionClass:"NEW_SECURITY_INITIAL_LISTING",blockedRowPolicyId:"B1",outcomeOpened:false};
t("D13001 first-session placebo with identical support valid",()=>assert.equal(validatePlaceboPair(sig,{...sig}).status,"PLACEBO_PAIR_VALID"));
t("D13002 transfer and new-security listing cannot be pooled",()=>assert.equal(validatePlaceboPair(sig,{...sig,priceDiscoveryClass:"SAME_SECURITY_TRANSFER_LISTING_PRICE_DISCOVERY",identityTransitionClass:"SAME_SECURITY_TRANSFER_LISTING"}).status,"PLACEBO_COMMON_SUPPORT_MISMATCH"));
t("D13003 placebo cannot be chosen after outcomes opened",()=>assert.equal(validatePlaceboPair(sig,{...sig,outcomeOpened:true}).status,"PLACEBO_OUTCOME_CONTAMINATED"));
t("D13004 new listing needs initial-reference mechanic control",()=>assert.equal(validateReferenceMechanicControl({transitionClass:"NEW_SECURITY_INITIAL_LISTING",referenceBasisType:"PUBLIC_OFFERING_OR_INITIAL_LISTING_REFERENCE"}).status,"REFERENCE_MECHANIC_CONTROL_VALID"));
t("D13005 transfer listing needs prior-market reference control",()=>assert.equal(validateReferenceMechanicControl({transitionClass:"SAME_SECURITY_TRANSFER_LISTING",referenceBasisType:"OTHER"}).status,"TRANSFER_LISTING_REFERENCE_CONTROL_MISSING"));
t("D13006 successor listing needs exchange-ratio/reference control",()=>assert.equal(validateReferenceMechanicControl({transitionClass:"SUCCESSOR_SECURITY_INITIAL_LISTING",referenceBasisType:"SUCCESSOR_EXCHANGE_RATIO_OR_OFFICIAL_REFERENCE"}).status,"REFERENCE_MECHANIC_CONTROL_VALID"));

const cohort={securityIdentity:"SEC1",listingStart:"2021-01-01",listingAgeEligibleSessions:10,futureDelistingHidden:true,futureMigrationStateUsed:false,futureSuccessorIdentityUsed:false,futureSurvivalDurationUsed:false,currentListingStatusUsedAsHistoricalEligibility:false};
t("D13101 PIT listing cohort predictor valid",()=>assert.equal(validateListingCohortPredictor(cohort).status,"LISTING_COHORT_PIT_VALID"));
t("D13102 future delisting leak rejected",()=>assert.equal(validateListingCohortPredictor({...cohort,futureDelistingHidden:false}).status,"FUTURE_DELISTING_LEAK"));
t("D13103 future migration leak rejected",()=>assert.equal(validateListingCohortPredictor({...cohort,futureMigrationStateUsed:true}).status,"FUTURE_MIGRATION_LEAK"));
t("D13104 present-day survivor status cannot define historical eligibility",()=>assert.equal(validateListingCohortPredictor({...cohort,currentListingStatusUsedAsHistoricalEligibility:true}).status,"CURRENT_SURVIVORSHIP_LEAK"));

const den={historicalUniverseVersion:"U1",listingCohortYear:2021,cohortMemberCount:100,laterDelistedCount:5,laterMigratedCount:3,laterConvertedCount:2,shortLivedCount:4,currentSurvivorsOnly:false};
t("D13105 full historical cohort denominator valid",()=>assert.equal(validateCohortDenominator(den).status,"COHORT_DENOMINATOR_VALID"));
t("D13106 current survivors only prohibited",()=>assert.equal(validateCohortDenominator({...den,currentSurvivorsOnly:true}).status,"CURRENT_SURVIVORS_ONLY_PROHIBITED"));
t("D13107 terminal state cannot enter predictor",()=>assert.equal(validateTerminalStateUnlock({terminalStateUsedInPredictor:true,terminalStateUnlockedForOutcomeSide:false}).status,"TERMINAL_STATE_PREDICTOR_LEAK"));
t("D13108 terminal state may be outcome-side after unlock",()=>assert.equal(validateTerminalStateUnlock({terminalStateUsedInPredictor:false,terminalStateUnlockedForOutcomeSide:true}).status,"TERMINAL_STATE_OUTCOME_SIDE_ALLOWED"));

console.log(`SUMMARY ${p}/23 PASS`);
