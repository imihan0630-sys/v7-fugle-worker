import assert from "node:assert/strict";
import {
  classifyListingWarmup,validateListingDayModule,classifyRelistingReentry,
  validateReentryClock,validateListingAgeSupport,validateHistoryDenominator,
  aggregateHistoryDenominator
} from "./pattern_dl126_128_listing_warmup_oracle_v0_1.mjs";

let p=0;const t=(n,f)=>{f();p++;console.log("PASS",n);};

t("D12601 first eligible session distinct",()=>assert.equal(classifyListingWarmup({listingAgeEligibleSessions:1,moduleMinimumHistoryRequired:5}).status,"FIRST_ELIGIBLE_SESSION"));
t("D12602 short history by design not missing",()=>assert.equal(classifyListingWarmup({listingAgeEligibleSessions:3,moduleMinimumHistoryRequired:5}).status,"HISTORY_TOO_SHORT_BY_DESIGN"));
t("D12603 missing data remains missing",()=>assert.equal(classifyListingWarmup({listingAgeEligibleSessions:3,moduleMinimumHistoryRequired:5,dataMissing:true}).status,"DATA_MISSING_BLOCKED"));
t("D12604 minimum history ready",()=>assert.equal(classifyListingWarmup({listingAgeEligibleSessions:5,moduleMinimumHistoryRequired:5,fullPreregisteredWindowReady:false}).status,"MODULE_MINIMUM_HISTORY_READY"));
t("D12605 full window ready",()=>assert.equal(classifyListingWarmup({listingAgeEligibleSessions:60,moduleMinimumHistoryRequired:5,fullPreregisteredWindowReady:true}).status,"FULL_PREREGISTERED_WINDOW_READY"));

t("D12606 new security first completed bar can form one-bar morphology",()=>assert.equal(validateListingDayModule("D01-02",{securityTransitionClass:"NEW_SECURITY_INITIAL_LISTING",completedFirstBar:true}).status,"FIRST_BAR_MORPHOLOGY_ELIGIBLE"));
t("D12607 new security sequence cannot borrow predecessor bars",()=>assert.equal(validateListingDayModule("D01-03",{securityTransitionClass:"NEW_SECURITY_INITIAL_LISTING",borrowedPredecessorBars:true}).status,"PREDECESSOR_BAR_BORROW_PROHIBITED"));
t("D12608 successor base cannot borrow predecessor anchors",()=>assert.equal(validateListingDayModule("D01-07",{securityTransitionClass:"SUCCESSOR_SECURITY_INITIAL_LISTING",borrowedPredecessorAnchors:true}).status,"PREDECESSOR_ANCHOR_BORROW_PROHIBITED"));
t("D12609 listing reference is not prior close",()=>assert.equal(validateListingDayModule("D01-09",{securityTransitionClass:"NEW_SECURITY_INITIAL_LISTING",usedListingReferenceAsPriorClose:true}).status,"LISTING_REFERENCE_NOT_PRIOR_CLOSE"));
t("D12610 proven same-security transfer can use prior-market history",()=>assert.equal(validateListingDayModule("D01-07",{securityTransitionClass:"SAME_SECURITY_TRANSFER_LISTING",dl123Pass:true}).status,"SAME_SECURITY_TRANSFER_HISTORY_ELIGIBLE"));

t("D12701 successor relisting starts new identity",()=>assert.equal(classifyRelistingReentry({identityRelation:"SUCCESSOR_SECURITY"}).status,"SUCCESSOR_SECURITY_NEW_IDENTITY"));
t("D12702 same identity long absence starts stale",()=>assert.equal(classifyRelistingReentry({identityProvenSame:true,dataReady:true,longAbsence:true}).status,"SAME_SECURITY_LONG_ABSENCE_STALE_ANCHOR"));
t("D12703 same identity can later reconfirm",()=>assert.equal(classifyRelistingReentry({identityProvenSame:true,dataReady:true,longAbsence:true,reconfirmed:true}).status,"SAME_SECURITY_REENTRY_RECONFIRMED"));
t("D12704 first reentry print cannot backdate confirmation",()=>assert.equal(validateReentryClock({firstReentryPrintBackdatedConfirmation:true}).status,"FIRST_REENTRY_PRINT_BACKDATE_PROHIBITED"));
t("D12705 reconfirmation needs a new clock",()=>assert.equal(validateReentryClock({reconfirmed:true}).status,"RECONFIRMATION_CLOCK_MISSING"));
t("D12706 reconfirmation cannot mutate old receipt",()=>assert.equal(validateReentryClock({reconfirmed:true,reconfirmationObservableAt:"2026-10-08T10:00:00+08:00",oldReceiptMutated:true}).status,"OLD_RECEIPT_MUTATION_PROHIBITED"));
t("D12707 valid reconfirmation clock passes",()=>assert.equal(validateReentryClock({reconfirmed:true,reconfirmationObservableAt:"2026-10-08T10:00:00+08:00",oldReceiptMutated:false}).status,"RECONFIRMATION_CLOCK_VALID"));

const parent={securityIdentity:"S1",warmupState:"MODULE_MINIMUM_HISTORY_READY",moduleHistoryReady:true,blockedRowPolicyId:"B1",identityTransitionClass:"NEW_SECURITY_INITIAL_LISTING",listingAgeEligibleSessions:20};
t("D12801 parent child same listing-age support valid",()=>assert.equal(validateListingAgeSupport(parent,{...parent}).status,"LISTING_AGE_SUPPORT_VALID"));
t("D12802 listing age mismatch blocks comparison",()=>assert.equal(validateListingAgeSupport(parent,{...parent,listingAgeEligibleSessions:100}).status,"LISTING_AGE_SUPPORT_MISMATCH"));
t("D12803 transition-class mismatch blocks comparison",()=>assert.equal(validateListingAgeSupport(parent,{...parent,identityTransitionClass:"SAME_SECURITY_TRANSFER_LISTING"}).status,"LISTING_AGE_SUPPORT_MISMATCH"));

t("D12804 short-history state legal denominator row",()=>assert.equal(validateHistoryDenominator({state:"HISTORY_TOO_SHORT_BY_DESIGN",securityIdentity:"S1",listingAgeEligibleSessions:3}).status,"HISTORY_DENOMINATOR_ROW_VALID"));
t("D12805 denominator identity required",()=>assert.equal(validateHistoryDenominator({state:"HISTORY_TOO_SHORT_BY_DESIGN",listingAgeEligibleSessions:3}).status,"HISTORY_DENOMINATOR_IDENTITY_INCOMPLETE"));
t("D12806 aggregate keeps short-history and blocked rows",()=>{const x=aggregateHistoryDenominator([{state:"HISTORY_TOO_SHORT_BY_DESIGN"},{state:"MODULE_HISTORY_READY_NO_STRUCTURE"},{state:"DATA_MISSING_BLOCKED"},{state:"IDENTITY_BLOCKED"}]);assert.equal(x.total,4);assert.equal(x.counts.HISTORY_TOO_SHORT_BY_DESIGN,1);assert.equal(x.counts.DATA_MISSING_BLOCKED,1);});

console.log(`SUMMARY ${p}/23 PASS`);
