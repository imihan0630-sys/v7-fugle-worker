// DATA_LANE Issue #1026. Offline-only evidence disposition; NEVER a quota grant.
// This object is an evidence inventory, not a substitute for an independent
// REMEDIATION authorization, an authenticated D1 receipt or AUDIT closure.
import assert from "node:assert/strict";

export function assessIssue1026P03P05SafeEvidenceV0_1({
 gapInventory,closureGate,system1ReservePolicy,octSourceAcceptance,
 accountUsageEvidence,quotaDeferEvidence,now
}={}){
 assert.equal(gapInventory?.schemaVersion,"S2_CORR003_PHYSICAL_EVIDENCE_GAP_INVENTORY_V0_1");
 assert.equal(gapInventory?.directiveId,"S2-CORR-20261007-003");
 assert.equal(closureGate?.schemaVersion,"S2_CORR003_INDEPENDENT_PHYSICAL_CLOSURE_GATE_V0_1");
 assert.equal(closureGate?.directiveId,gapInventory.directiveId);
 assert.equal(system1ReservePolicy?.schemaVersion,"S2_SYSTEM1_AFTER_MARKET_RESERVE_POLICY_V0_2");
 assert.equal(system1ReservePolicy?.directiveId,gapInventory.directiveId);
 assert.equal(octSourceAcceptance?.officialWindow?.marketDateReceiptCount,12);
 assert.equal(octSourceAcceptance?.officialWindow?.byMarket?.TWSE?.ordinarySymbolSourceRows,6518);
 assert.equal(octSourceAcceptance?.officialWindow?.byMarket?.TPEX?.ordinarySymbolSourceRows,5325);
 assert.equal(octSourceAcceptance?.cloudflare?.d1ReadsPerformed,0);
 assert.equal(octSourceAcceptance?.cloudflare?.d1WritesPerformed,0);
 assert.equal(accountUsageEvidence?.physicalObservation?.runConclusion,"success");
 assert.equal(accountUsageEvidence?.physicalObservation?.quotaDayUTC,"2026-10-09");
 assert.equal(accountUsageEvidence?.physicalObservation?.freshnessGuarantee,"NOT_DOCUMENTED_BY_VENDOR");
 assert.equal(accountUsageEvidence?.physicalImpact?.cloudflareD1SqlQueriesExecutedByMetadataObserver,0);
 assert.equal(quotaDeferEvidence?.accountQuotaReceipt?.state,"QUOTA_BUDGET_DEFER");
 assert.equal(quotaDeferEvidence?.accountQuotaReceipt?.physicalAllowed,false);
 assert.equal(quotaDeferEvidence?.workflowExecution?.d1RowsWrittenByWarmup,0);
 const day=new Date(now);
 assert.ok(Number.isFinite(day.getTime()),"real observation time is required");
 const unit=id=>gapInventory.workPackages?.find(x=>x.id===id);
 const gate=id=>closureGate.prerequisiteGates?.find(x=>x.id===id);
 const p03=unit("P03_MULTIWRITER_UTC_DAY"),p05=unit("P05_ORIGINAL_PHYSICAL_CRITERIA");
 assert.ok(p03&&p05,"original P03/P05 acceptance work packages missing");
 assert.equal(p03.qualifyingPhysicalAcceptance,false);
 assert.equal(p05.qualifyingPhysicalAcceptance,false);
 assert.equal(p03.supportChecksDocumented,3);
 assert.equal(p03.supportChecksTotal,8);
 assert.equal(p05.supportChecksDocumented,4);
 assert.equal(p05.supportChecksTotal,9);
 assert.equal(p05.physicalD1ScoutExecuted,0);
 assert.equal(p05.physicalD1CensusExecuted,0);
 assert.equal(p05.physicalMissingKeyCount,"UNKNOWN");
 assert.equal(gate("P03_MULTIWRITER_UTC_DAY")?.state,"PENDING");
 assert.equal(gate("P05_ORIGINAL_PHYSICAL_CRITERIA")?.state,"PENDING");
 assert.equal(closureGate?.closureState,"PHYSICAL_GATES_PENDING_NO_VERIFIED_CLOSED");
 const reserveWriteAuthorized=system1ReservePolicy?.reserveNumberAuthorized===true
  &&Number.isSafeInteger(system1ReservePolicy.authorizedReserveRows)
  &&system1ReservePolicy.authorizedReserveRows>0;
 const reserveReadAuthorized=system1ReservePolicy?.readReserveNumberAuthorized===true
  &&Number.isSafeInteger(system1ReservePolicy.authorizedReadReserveRows)
  &&system1ReservePolicy.authorizedReadReserveRows>0;
 // The old day account observation is NOT refreshed by this read-only
 // offline assessment. Never use this for spendable headroom.
 const obs=accountUsageEvidence.physicalObservation;
 const sameQuotaDay=day.toISOString().slice(0,10)===obs.quotaDayUTC;
 return Object.freeze({
  schemaVersion:"S2_ISSUE1026_P03_P05_NO_QUOTA_BYPASS_EVIDENCE_REVIEW_V0_1",
  issue:1026,directiveId:"S2-CORR-20261007-003",lane:"DATA_LANE",
  mode:"OFFLINE_EVIDENCE_ASSESSMENT_NON_AUTHORIZING",
  observedAt:day.toISOString(),
  state:"P03_P05_PHYSICAL_ACCEPTANCE_DEFER",
  p03:{documentedEvidenceChecks:3,totalChecks:8,physicalClosure:"PENDING",
   verifiedRealSameDayPostFixMultiwriterGrantResults:0,
   missing:["AUTHORIZED_SYSTEM1_READ_WRITE_RESERVES","AUTHENTICATED_SAME_UTC_DAY_MULTIWRITER_GRANT_RESULTS","P0_PRIORITY_P2_P3_REAL_DEFER","PARTIAL_RETRY_DAY_ROLLOVER_RECEIPT_CHAIN","AUDITOR_VERIFIED_ACCOUNT_LEDGER_NO_COLLISION"]},
  p05:{documentedEvidenceChecks:4,totalChecks:9,physicalClosure:"PENDING",
   officialSourceDays:12,officialSourceStockDateKeys:11843,
   d1ScoutExecuted:0,d1ScoutTarget:36,d1CensusExecuted:0,
   d1CensusTarget:11843,physicalMissingKeys:"UNKNOWN",
   missing:["EVIDENCE_QUALIFIED_D1_READ_HEADROOM","D1_36_INDEXED_SELECT_REAL_RECEIPT","D1_11843_KEY_CENSUS_REAL_RECEIPT","ORIGINAL_PIT_MISSING_KEY_CONFLICT_IMMUTABILITY_RECONCILIATION","INDEPENDENT_AUDITOR_ALL_CRITERIA_PHYSICAL_ACCEPTANCE"]},
  reserves:{system1WriteAuthorized:reserveWriteAuthorized,
   system1ReadAuthorized:reserveReadAuthorized,
   observedV7MaxRowsWrittenIsNotReserve:2825},
  priorAccountObservation:{runId:obs.workflowRunId,quotaDayUTC:obs.quotaDayUTC,
   rowsReadLowerBound:obs.rowsReadAccountAggregateLowerBound,
   rowsWrittenLowerBound:obs.rowsWrittenAccountAggregateLowerBound,
   sameUtcDayAsAssessment:sameQuotaDay,spendableReadHeadroomProven:false,
   spendableWriteHeadroomProven:false,graphQlLagBoundProven:false},
  priorQuotaDefer:{runId:quotaDeferEvidence.run.id,
   disposition:"QUOTA_BUDGET_DEFER",physicalWarmupD1RowsWritten:0},
  physicalD1SelectAuthorizedByAssessment:false,
  physicalD1MutationAuthorizedByAssessment:false,
  quotaReservationGrantedByAssessment:false,
  manualBooleanIsNotAttestation:true,
  physicalD1SqlReadsPerformed:0,physicalD1SqlWritesPerformed:0,
  cloudflareR2CallsPerformed:0,productionWorkerChanged:false,
  cloudflareBillingChanged:false,
  next:"P01/P02 qualified reserve + same quota-day account usage/lag/ledger independent proof -> 36-key readonly scout -> separately certified 11843-key full census; P03 only real authenticated grant/result from registered writers, independent AUDIT closure."
 });
}
