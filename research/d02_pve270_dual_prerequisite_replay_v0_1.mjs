export const PVE270_SCHEMA = 'D02_PVE270_DUAL_PREREQUISITE_REPLAY_V0_1';
const iso = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value) && Number.isFinite(Date.parse(value));
const day = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
const proof = value => typeof value === 'string' && value.trim().length >= 8;

// Research-only pre-outcome evidence join. This never promotes a trading signal.
export function evaluatePve270DualPrerequisite(input = {}) {
  const f = input.feature || {}, b = input.baseline || {}, q = input.quota || {}, s = input.schedule || {}, g = input.governance || {};
  const reasons = [];
  const require = (ok, code) => { if (!ok) reasons.push(code); };
  require(day(f.marketDate), 'FEATURE_MARKET_DATE_INVALID');
  require(proof(f.symbol), 'FEATURE_SYMBOL_MISSING');
  require(iso(f.capturedAt), 'FEATURE_CAPTURE_CLOCK_MISSING');
  require(iso(f.decisionCutoff), 'FEATURE_DECISION_CLOCK_MISSING');
  require(iso(f.capturedAt) && iso(f.decisionCutoff) && Date.parse(f.capturedAt) <= Date.parse(f.decisionCutoff), 'FEATURE_AFTER_DECISION');
  require(f.outcomeAccessed === false, 'OUTCOME_ACCESS_MUST_REMAIN_CLOSED');
  require(f.historicalBackfill === false, 'RETROSPECTIVE_BACKFILL_FORBIDDEN');
  require(f.preOutcomeCommonSupport === true, 'PRE_OUTCOME_COMMON_SUPPORT_UNPROVEN');
  require(b.guardSchema === 'D02_PVE261_BASELINE_REFRESH_ACCEPTANCE_V0_1' && b.physicalPass === true, 'BASELINE_PHYSICAL_GUARD_NOT_PASS');
  require(proof(b.physicalRunId) && proof(b.receiptHash), 'BASELINE_PHYSICAL_PROVENANCE_MISSING');
  require(b.marketDate === f.marketDate && b.symbol === f.symbol && b.slotClock === f.slotClock, 'BASELINE_FEATURE_IDENTITY_MISMATCH');
  require(day(b.expectedLatestComparableSlotDate) && day(b.baselineAsOfDate) && b.expectedLatestComparableSlotDate === b.baselineAsOfDate && b.baselineAsOfDate < f.marketDate, 'BASELINE_FRESHNESS_NOT_PROVEN');
  require(iso(b.deployedAt) && iso(f.capturedAt) && Date.parse(b.deployedAt) < Date.parse(f.capturedAt), 'BASELINE_REMEDIATION_NOT_DEPLOYED_BEFORE_FEATURE');
  require(b.decisionImpact === 0, 'BASELINE_REMEDIATION_DECISION_IMPACT_NOT_ZERO');
  require(q.guardSchema === 'D02_PVE268_CROSS_SYSTEM_D1_QUOTA_ACCEPTANCE_V0_1' && q.physicalPass === true, 'QUOTA_PHYSICAL_GUARD_NOT_PASS');
  require(proof(q.physicalRunId) && proof(q.receiptHash), 'QUOTA_PHYSICAL_PROVENANCE_MISSING');
  require(q.marketDate === f.marketDate && q.quotaUtcDay === s.quotaUtcDay, 'QUOTA_DATE_IDENTITY_MISMATCH');
  require(iso(q.deployedAt) && iso(f.capturedAt) && Date.parse(q.deployedAt) < Date.parse(f.capturedAt), 'QUOTA_REMEDIATION_NOT_DEPLOYED_BEFORE_FEATURE');
  require(q.accountReserveBeforeAfterMarket === true && q.normalProductionReceiptPersisted === true && q.quotaRejectionObserved === false, 'QUOTA_RESERVATION_OR_RECEIPT_NOT_PROVEN');
  require(s.guardSchema === 'D02_PVE269_SCHEDULE_EVIDENCE_FUSION_V0_1' && s.state === 'BUSINESS_EXECUTION_SUCCESS' && s.successCount === 1, 'SCHEDULE_BUSINESS_EXECUTION_NOT_UNIQUE_SUCCESS');
  require(proof(s.physicalRunId) && proof(s.receiptHash), 'SCHEDULE_PHYSICAL_PROVENANCE_MISSING');
  require(s.marketDate === f.marketDate, 'SCHEDULE_MARKET_DATE_MISMATCH');
  require(iso(s.observedAt) && iso(f.decisionCutoff) && Date.parse(s.observedAt) > Date.parse(f.decisionCutoff), 'SCHEDULE_POST_SESSION_CLOCK_INVALID');
  require(g.baselineOwnerApproved === true && g.quotaRemediationOwnerVerified === true, 'OWNER_AND_CORRECTION_AUTHORITY_NOT_PROVEN');
  require(g.formalCoreUnchanged === true && g.strategyUnchanged === true && g.liveCapitalOrderAuthorityChanged === false, 'PROTECTED_FORMAL_BOUNDARY_UNPROVEN');
  require(g.outcomeAccessAuthorized === false && g.retroactiveCleanDateAllowed === false, 'RESEARCH_GOVERNANCE_NOT_FAIL_CLOSED');
  const prereqEvidenceComplete = reasons.length === 0;
  return Object.freeze({
    schemaVersion:PVE270_SCHEMA,
    state:prereqEvidenceComplete ? 'PREREQUISITE_AUDIT_READY_ONLY' : 'PREREQUISITE_BLOCKED',
    prereqEvidenceComplete, reasons:Object.freeze(reasons),
    decisionTimeFeatureRewritten:false, cleanH001DateAuthorized:false,
    economicInferenceAuthorized:false, maturityPromotionAuthorized:false,
    formalCoreChangeAuthorized:false, correctionClosureAuthorized:false
  });
}
