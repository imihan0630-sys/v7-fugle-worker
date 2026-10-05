import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const guard = JSON.parse(
  readFileSync(new URL('./d03_mixed_root_residual_selection_identification_addendum_20261006_v0_1.json', import.meta.url))
);

const nonempty = v => typeof v === 'string' && v.trim().length > 0;
const hex64 = v => typeof v === 'string' && /^[a-f0-9]{64}$/.test(v);

export function evaluateSelectionIdentification(input) {
  if (!input || typeof input !== 'object') throw new Error('INPUT_REQUIRED');
  if (input.layer1ComponentIsolationPass !== true) {
    return Object.freeze({
      status:'BLOCKED',
      disposition:'COMPONENT_ISOLATION_NOT_PROVEN',
      effectiveIndependentEvidenceIncrement:0,
      formalCoreImpact:'NONE_LOCKED'
    });
  }

  for (const f of guard.requiredResidualSelectionFields) {
    if (!(f in input)) throw new Error('MISSING_SELECTION_FIELD:' + f);
    if (typeof input[f] === 'string' && !nonempty(input[f])) throw new Error('EMPTY_SELECTION_FIELD:' + f);
  }

  if (!guard.estimandScopes.includes(input.estimandScope)) throw new Error('INVALID_ESTIMAND_SCOPE');
  if (!guard.selectionSensitivityTiers.includes(input.selectionSensitivityTier)) throw new Error('INVALID_SELECTION_TIER');
  if (!guard.positivityStates.includes(input.positivityState)) throw new Error('INVALID_POSITIVITY_STATE');
  if (!guard.dispositions.includes(input.selectionFirewallDisposition)) throw new Error('INVALID_SELECTION_DISPOSITION');
  if (!hex64(input.admissionLineageHash)) throw new Error('INVALID_ADMISSION_LINEAGE_HASH');
  if (!hex64(input.supportRuleHash)) throw new Error('INVALID_SUPPORT_RULE_HASH');
  if (input.stageWiseAdmissionComplete !== true) throw new Error('STAGE_WISE_ADMISSION_INCOMPLETE');
  if (input.evaluationCutoffOutcomeDriven === true) throw new Error('OUTCOME_DRIVEN_EVALUATION_CUTOFF_FORBIDDEN');
  if (input.selectionModelRetunedAfterOutcome === true) throw new Error('OUTCOME_DRIVEN_SELECTION_MODEL_RETUNING_FORBIDDEN');
  if (input.imputationModelSelectedAfterOutcome === true) throw new Error('POST_OUTCOME_IMPUTATION_SELECTION_FORBIDDEN');

  if (input.estimandScope === 'OBSERVED_SUBPOPULATION_ESTIMAND') {
    return Object.freeze({
      status:'PASS_RESEARCH_ONLY',
      disposition:'ROOT_SPECIFIC_MECHANISM_SUPPORTED_BUT_POPULATION_INCREMENTALITY_NOT_IDENTIFIED',
      effectiveIndependentEvidenceIncrement:0,
      crossSystemResidualStatus:'RESIDUAL_CANDIDATE',
      formalCoreImpact:'NONE_LOCKED'
    });
  }

  if (input.estimandScope === 'RESTRICTED_SUPPORT_ESTIMAND') {
    if (!hex64(input.consumerSupportRuleHash) || input.consumerSupportRuleHash !== input.supportRuleHash) {
      return Object.freeze({
        status:'BLOCKED',
        disposition:'RESTRICTED_SUPPORT_CONSUMER_MISMATCH',
        effectiveIndependentEvidenceIncrement:0,
        formalCoreImpact:'NONE_LOCKED'
      });
    }
    if (!['PASS','THIN'].includes(input.positivityState)) {
      return Object.freeze({
        status:'BLOCKED',
        disposition:'SELECTION_IDENTIFICATION_BLOCKED',
        effectiveIndependentEvidenceIncrement:0,
        formalCoreImpact:'NONE_LOCKED'
      });
    }
    return Object.freeze({
      status:'PASS_RESTRICTED_SUPPORT_ONLY',
      disposition:'RESTRICTED_SUPPORT_INCREMENTALITY_IDENTIFIED',
      effectiveIndependentEvidenceIncrement:1,
      exportToUnrestrictedPopulation:false,
      formalCoreImpact:'NONE_LOCKED'
    });
  }

  if (input.estimandScope === 'TARGET_POPULATION_ESTIMAND') {
    if (input.selectionSensitivityTier === 'TIER_A') {
      return Object.freeze({
        status:'BLOCKED',
        disposition:'SELECTION_IDENTIFICATION_BLOCKED',
        effectiveIndependentEvidenceIncrement:0,
        formalCoreImpact:'NONE_LOCKED'
      });
    }
    if (input.positivityState !== 'PASS') {
      return Object.freeze({
        status:'BLOCKED',
        disposition:'SELECTION_IDENTIFICATION_BLOCKED',
        effectiveIndependentEvidenceIncrement:0,
        formalCoreImpact:'NONE_LOCKED'
      });
    }
    if (input.selectionSensitivityTier === 'TIER_B') {
      if (input.weightDiagnosticsPass !== true || input.balanceDiagnosticsPass !== true) {
        return Object.freeze({
          status:'BLOCKED',
          disposition:'SELECTION_IDENTIFICATION_BLOCKED',
          effectiveIndependentEvidenceIncrement:0,
          formalCoreImpact:'NONE_LOCKED'
        });
      }
    }
    if (input.selectionSensitivityTier === 'TIER_C' && input.missingOutcomeBoundsStableDirection !== true) {
      return Object.freeze({
        status:'BLOCKED',
        disposition:'SELECTION_IDENTIFICATION_BLOCKED',
        effectiveIndependentEvidenceIncrement:0,
        formalCoreImpact:'NONE_LOCKED'
      });
    }
    if (input.selectionFirewallDisposition !== 'TARGET_POPULATION_INCREMENTALITY_IDENTIFIED') {
      return Object.freeze({
        status:'BLOCKED',
        disposition:'SELECTION_IDENTIFICATION_BLOCKED',
        effectiveIndependentEvidenceIncrement:0,
        formalCoreImpact:'NONE_LOCKED'
      });
    }
    return Object.freeze({
      status:'PASS_TARGET_POPULATION',
      disposition:'TARGET_POPULATION_INCREMENTALITY_IDENTIFIED',
      effectiveIndependentEvidenceIncrement:1,
      formalCoreImpact:'NONE_LOCKED'
    });
  }

  throw new Error('UNREACHABLE');
}

const H = ch => ch.repeat(64);
const base = {
  layer1ComponentIsolationPass:true,
  estimandScope:'TARGET_POPULATION_ESTIMAND',
  admissionLineageHash:H('a'),
  selectionSensitivityTier:'TIER_B',
  positivityState:'PASS',
  supportRuleHash:H('b'),
  evaluationCutoffRule:'PREREGISTERED_CALENDAR_OR_DETERMINISTIC_MATURITY',
  selectionFirewallDisposition:'TARGET_POPULATION_INCREMENTALITY_IDENTIFIED',
  stageWiseAdmissionComplete:true,
  evaluationCutoffOutcomeDriven:false,
  selectionModelRetunedAfterOutcome:false,
  imputationModelSelectedAfterOutcome:false,
  weightDiagnosticsPass:true,
  balanceDiagnosticsPass:true,
  missingOutcomeBoundsStableDirection:true
};

const observed = evaluateSelectionIdentification({
  ...base,
  estimandScope:'OBSERVED_SUBPOPULATION_ESTIMAND',
  selectionSensitivityTier:'TIER_A',
  selectionFirewallDisposition:'ROOT_SPECIFIC_MECHANISM_SUPPORTED_BUT_POPULATION_INCREMENTALITY_NOT_IDENTIFIED'
});
assert.equal(observed.effectiveIndependentEvidenceIncrement,0);
assert.equal(observed.crossSystemResidualStatus,'RESIDUAL_CANDIDATE');

const target = evaluateSelectionIdentification(base);
assert.equal(target.effectiveIndependentEvidenceIncrement,1);
assert.equal(target.status,'PASS_TARGET_POPULATION');

const restricted = evaluateSelectionIdentification({
  ...base,
  estimandScope:'RESTRICTED_SUPPORT_ESTIMAND',
  selectionSensitivityTier:'TIER_B',
  selectionFirewallDisposition:'RESTRICTED_SUPPORT_INCREMENTALITY_IDENTIFIED',
  consumerSupportRuleHash:H('b')
});
assert.equal(restricted.effectiveIndependentEvidenceIncrement,1);
assert.equal(restricted.exportToUnrestrictedPopulation,false);

const restrictedMismatch = evaluateSelectionIdentification({
  ...base,
  estimandScope:'RESTRICTED_SUPPORT_ESTIMAND',
  selectionFirewallDisposition:'RESTRICTED_SUPPORT_INCREMENTALITY_IDENTIFIED',
  consumerSupportRuleHash:H('c')
});
assert.equal(restrictedMismatch.effectiveIndependentEvidenceIncrement,0);

const positivityFail = evaluateSelectionIdentification({...base,positivityState:'FAIL'});
assert.equal(positivityFail.effectiveIndependentEvidenceIncrement,0);

const tierAFull = evaluateSelectionIdentification({...base,selectionSensitivityTier:'TIER_A'});
assert.equal(tierAFull.effectiveIndependentEvidenceIncrement,0);

const tierCBoundsCross = evaluateSelectionIdentification({
  ...base,
  selectionSensitivityTier:'TIER_C',
  missingOutcomeBoundsStableDirection:false
});
assert.equal(tierCBoundsCross.effectiveIndependentEvidenceIncrement,0);

const noLayer1 = evaluateSelectionIdentification({...base,layer1ComponentIsolationPass:false});
assert.equal(noLayer1.effectiveIndependentEvidenceIncrement,0);

const missing = {...base}; delete missing.admissionLineageHash;
assert.throws(()=>evaluateSelectionIdentification(missing),/MISSING_SELECTION_FIELD/);
assert.throws(()=>evaluateSelectionIdentification({...base,evaluationCutoffOutcomeDriven:true}),/OUTCOME_DRIVEN_EVALUATION_CUTOFF/);
assert.throws(()=>evaluateSelectionIdentification({...base,selectionModelRetunedAfterOutcome:true}),/SELECTION_MODEL_RETUNING/);
assert.throws(()=>evaluateSelectionIdentification({...base,imputationModelSelectedAfterOutcome:true}),/IMPUTATION_SELECTION/);

console.log(JSON.stringify({
  status:'PASS',
  cases:12,
  observedSubpopulationIncrement:observed.effectiveIndependentEvidenceIncrement,
  targetPopulationIncrement:target.effectiveIndependentEvidenceIncrement,
  restrictedSupportIncrement:restricted.effectiveIndependentEvidenceIncrement,
  restrictedSupportExportToUnrestrictedPopulation:restricted.exportToUnrestrictedPopulation,
  positivityFailIncrement:positivityFail.effectiveIndependentEvidenceIncrement,
  formalCoreImpact:'NONE_LOCKED',
  outcomeDataUsed:false
}));
