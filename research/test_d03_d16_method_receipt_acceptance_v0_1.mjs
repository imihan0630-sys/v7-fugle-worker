import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const oracle = JSON.parse(
  readFileSync(new URL('./d03_d16_method_receipt_acceptance_oracle_20261005_v0_1.json', import.meta.url))
);

const nonempty = v => typeof v === 'string' && v.trim().length > 0;
const arrayNonempty = v => Array.isArray(v) && v.length > 0;

function requireFields(obj, fields, prefix) {
  for (const field of fields) {
    if (!(field in obj)) throw new Error(`MISSING_${prefix}_FIELD:${field}`);
    const v = obj[field];
    if (typeof v === 'string' && !nonempty(v)) throw new Error(`EMPTY_${prefix}_FIELD:${field}`);
    if (Array.isArray(v) && !v.length) throw new Error(`EMPTY_${prefix}_FIELD:${field}`);
  }
}

export function validateD03D16MethodReceipt(receipt) {
  if (!receipt || typeof receipt !== 'object') throw new Error('RECEIPT_REQUIRED');

  requireFields(receipt, oracle.requiredIdentityFields, 'IDENTITY');
  requireFields(receipt, oracle.requiredPopulationFields, 'POPULATION');
  requireFields(receipt, oracle.requiredSplitFields, 'SPLIT');
  requireFields(receipt, oracle.requiredDependenceFields, 'DEPENDENCE');
  requireFields(receipt, oracle.requiredInferenceFields, 'INFERENCE');

  if (receipt.selectedOnlyInference !== false) throw new Error('SELECTED_ONLY_INFERENCE_FORBIDDEN');
  if (receipt.holdoutMethodSelection !== false) throw new Error('HOLDOUT_METHOD_SELECTION_FORBIDDEN');
  if (receipt.randomRowSplit === true) throw new Error('RANDOM_ROW_SPLIT_FORBIDDEN');
  if (receipt.rowLevelIidPrimaryInference === true) throw new Error('IID_ROW_PRIMARY_FORBIDDEN');
  if (receipt.rowCountUsedAsIndependentN === true) throw new Error('ROW_N_AS_INDEPENDENT_N_FORBIDDEN');
  if (receipt.unknownCoercedToNegative === true) throw new Error('UNKNOWN_TO_NEGATIVE_FORBIDDEN');
  if (receipt.commonSupportSameRows !== true) throw new Error('COMMON_SUPPORT_SAME_ROWS_REQUIRED');
  if (receipt.purgeCoversMaxRegisteredForwardFootprint !== true) throw new Error('PURGE_FORWARD_FOOTPRINT_INCOMPLETE');
  if (receipt.experimentOrder?.join('|') !== oracle.experimentOrder.join('|')) throw new Error('EXPERIMENT_ORDER_DRIFT');

  if (!oracle.allowedTerminalMethodStates.includes(receipt.terminalMethodState)) {
    throw new Error('UNSUPPORTED_TERMINAL_METHOD_STATE');
  }

  if (!receipt.multipleTesting || receipt.multipleTesting.familyId !== oracle.requiredMultiplicity.familyId) {
    throw new Error('MULTIPLICITY_FAMILY_ID_MISMATCH');
  }

  for (const h of oracle.requiredMultiplicity.hypotheses) {
    if (!receipt.multipleTesting.hypotheses?.includes(h)) throw new Error(`MISSING_HYPOTHESIS:${h}`);
  }
  for (const e of oracle.requiredMultiplicity.primaryEndpoints) {
    if (!receipt.multipleTesting.primaryEndpoints?.includes(e)) throw new Error(`MISSING_PRIMARY_ENDPOINT:${e}`);
  }
  for (const e of oracle.requiredMultiplicity.secondaryEndpoints) {
    if (!receipt.multipleTesting.secondaryEndpoints?.includes(e)) throw new Error(`MISSING_SECONDARY_ENDPOINT:${e}`);
  }

  if (receipt.multipleTesting.failedCellsRemain !== true) throw new Error('FAILED_CELLS_MUST_REMAIN');
  if (receipt.multipleTesting.alternatePeriodsAuthorized !== false) throw new Error('ALTERNATE_PERIOD_SEARCH_FORBIDDEN');
  if (receipt.multipleTesting.timeframeSearchAuthorized !== false) throw new Error('TIMEFRAME_SEARCH_FORBIDDEN');

  if (receipt.secondaryCanRescueFailedD5 === true) throw new Error('D10_D20_RESCUE_FORBIDDEN');
  if (receipt.postOutcomeFormulaChange === true) throw new Error('POST_OUTCOME_FORMULA_CHANGE_FORBIDDEN');
  if (receipt.postOutcomePeriodChange === true) throw new Error('POST_OUTCOME_PERIOD_CHANGE_FORBIDDEN');
  if (receipt.postOutcomeThresholdChange === true) throw new Error('POST_OUTCOME_THRESHOLD_CHANGE_FORBIDDEN');
  if (receipt.postOutcomeEndpointChange === true) throw new Error('POST_OUTCOME_ENDPOINT_CHANGE_FORBIDDEN');
  if (receipt.postOutcomeBaselineChange === true) throw new Error('POST_OUTCOME_BASELINE_CHANGE_FORBIDDEN');

  const executable =
    receipt.terminalMethodState === 'METHOD_READY' &&
    receipt.d03PhysicalGatesT1ToT5 === 'PASS';

  return Object.freeze({
    status: 'STRUCTURALLY_ACCEPTED',
    terminalMethodState: receipt.terminalMethodState,
    methodContractReady: receipt.terminalMethodState === 'METHOD_READY',
    outcomeExecutionAuthorized: executable,
    formalCoreImpact: 'NONE_LOCKED'
  });
}

const base = {
  methodReceiptVersion:'D16-D03-METHOD-V0_1',
  d03ExperimentVersion:'D03-TI005-TI006-V0_1',
  preregistrationHash:'a'.repeat(64),
  featureContractHashes:['b'.repeat(64),'c'.repeat(64)],
  parentContractVersion:'PARENT-V1',
  continuityContractVersion:'CONTINUITY-V1',
  outcomeContractVersion:'OUTCOME-V1',
  expectedParentPopulationDefinition:'ALL_FROZEN_ELIGIBLE_PARENTS',
  commonSupportInclusionRule:'SAME_ROWS_ALL_ARMS',
  blockedUnknownConstrainedHandling:'PRESERVE_AND_FAIL_CLOSED',
  selectedOnlyInference:false,
  dateLevelPopulationAccounting:'REQUIRED',
  chronologicalSplitRule:'FORWARD_ONLY',
  trainingScanDates:['2026-01-02'],
  purgedTrainingScanDates:['2026-01-02'],
  holdoutScanDates:['2026-02-02'],
  purgeGapRule:'DERIVED_FROM_MAX_REGISTERED_D20_FORWARD_FOOTPRINT',
  holdoutMethodSelection:false,
  primaryDependenceMethod:'D16_FROZEN_DEPENDENCE_METHOD',
  scanDateTreatment:'PRIMARY_CLUSTER_OR_DATE_PANEL_UNIT',
  symbolTreatment:'REPEATED_SYMBOL_DIAGNOSTIC',
  episodeTreatment:'LONGITUDINAL_EPISODE_DIAGNOSTIC',
  overlappingOutcomeTreatment:'EXPLICIT_FORWARD_WINDOW_DEPENDENCE',
  overlappingFeatureWindowTreatment:'EXPLICIT_LOOKBACK_DEPENDENCE',
  sectorIndustryTreatment:'CONCENTRATION_AND_COMMON_SHOCK_DIAGNOSTIC',
  smallClusterTreatment:'FAIL_CLOSED_OR_FINITE_SAMPLE_REMEDY',
  finiteSampleMethod:'FROZEN_BEFORE_HOLDOUT',
  rowN:100,
  independentScanDateN:10,
  uniqueSymbolN:40,
  repeatedSymbolShare:0.2,
  clusterSizeDistribution:{min:5,median:10,max:15},
  forwardWindowOverlapDiagnostics:'REQUIRED',
  estimands:['H005-A','H005-B','H005-C','H005-D','H006-A','H006-B','H006-C'],
  weightingRule:'EQUAL_SCAN_DATE_WEIGHT',
  uncertaintyMethod:'D16_FROZEN',
  effectSizeMetric:'FROZEN_PER_ENDPOINT',
  leaveOneDateOut:true,
  nonOverlappingDateSensitivity:true,
  dateVsRowBalanceDiagnostic:true,
  concentrationDiagnostics:true,
  repeatedSymbolSensitivity:true,
  coverageSensitivity:true,
  commonSupportSameRows:true,
  purgeCoversMaxRegisteredForwardFootprint:true,
  experimentOrder:[...oracle.experimentOrder],
  rowLevelIidPrimaryInference:false,
  rowCountUsedAsIndependentN:false,
  unknownCoercedToNegative:false,
  randomRowSplit:false,
  multipleTesting:{
    familyId:oracle.requiredMultiplicity.familyId,
    hypotheses:[...oracle.requiredMultiplicity.hypotheses],
    primaryEndpoints:[...oracle.requiredMultiplicity.primaryEndpoints],
    secondaryEndpoints:[...oracle.requiredMultiplicity.secondaryEndpoints],
    failedCellsRemain:true,
    alternatePeriodsAuthorized:false,
    timeframeSearchAuthorized:false
  },
  secondaryCanRescueFailedD5:false,
  postOutcomeFormulaChange:false,
  postOutcomePeriodChange:false,
  postOutcomeThresholdChange:false,
  postOutcomeEndpointChange:false,
  postOutcomeBaselineChange:false,
  d03PhysicalGatesT1ToT5:'BLOCKED'
};

const blocked = validateD03D16MethodReceipt({...base,terminalMethodState:'POWER_INSUFFICIENT'});
assert.equal(blocked.status,'STRUCTURALLY_ACCEPTED');
assert.equal(blocked.methodContractReady,false);
assert.equal(blocked.outcomeExecutionAuthorized,false);

const readyButPhysicalBlocked = validateD03D16MethodReceipt({...base,terminalMethodState:'METHOD_READY'});
assert.equal(readyButPhysicalBlocked.methodContractReady,true);
assert.equal(readyButPhysicalBlocked.outcomeExecutionAuthorized,false);

const fullyReadyFixture = validateD03D16MethodReceipt({
  ...base,
  terminalMethodState:'METHOD_READY',
  d03PhysicalGatesT1ToT5:'PASS'
});
assert.equal(fullyReadyFixture.outcomeExecutionAuthorized,true);

const reject = (patch, pattern) => {
  assert.throws(() => validateD03D16MethodReceipt({...base,terminalMethodState:'METHOD_READY',...patch}), pattern);
};

const missingHash={...base,terminalMethodState:'METHOD_READY'}; delete missingHash.preregistrationHash;
assert.throws(()=>validateD03D16MethodReceipt(missingHash),/MISSING_IDENTITY_FIELD/);
reject({selectedOnlyInference:true},/SELECTED_ONLY/);
reject({unknownCoercedToNegative:true},/UNKNOWN_TO_NEGATIVE/);
reject({randomRowSplit:true},/RANDOM_ROW_SPLIT/);
reject({holdoutMethodSelection:true},/HOLDOUT_METHOD_SELECTION/);
reject({purgeCoversMaxRegisteredForwardFootprint:false},/PURGE_FORWARD_FOOTPRINT/);
reject({rowLevelIidPrimaryInference:true},/IID_ROW_PRIMARY/);
reject({rowCountUsedAsIndependentN:true},/ROW_N_AS_INDEPENDENT_N/);
reject({commonSupportSameRows:false},/COMMON_SUPPORT_SAME_ROWS/);
reject({experimentOrder:['TI_006_MACD_VS_DIRECT_TREND','TI_005_KD_VS_RSI']},/EXPERIMENT_ORDER_DRIFT/);
reject({terminalMethodState:'LOOKS_GOOD'},/UNSUPPORTED_TERMINAL/);
reject({secondaryCanRescueFailedD5:true},/D10_D20_RESCUE/);
reject({postOutcomeFormulaChange:true},/POST_OUTCOME_FORMULA/);
reject({postOutcomePeriodChange:true},/POST_OUTCOME_PERIOD/);
reject({postOutcomeThresholdChange:true},/POST_OUTCOME_THRESHOLD/);
reject({postOutcomeEndpointChange:true},/POST_OUTCOME_ENDPOINT/);
reject({postOutcomeBaselineChange:true},/POST_OUTCOME_BASELINE/);

const shrink={...base,terminalMethodState:'METHOD_READY',multipleTesting:{...base.multipleTesting,hypotheses:base.multipleTesting.hypotheses.slice(1)}};
assert.throws(()=>validateD03D16MethodReceipt(shrink),/MISSING_HYPOTHESIS/);

console.log(JSON.stringify({
  status:'PASS',
  structuralAcceptBlockedState:'PASS',
  methodReadyDoesNotBypassPhysicalGates:'PASS',
  adversarialRejects:18,
  formalCoreImpact:'NONE_LOCKED',
  outcomeDataUsed:false
}));
