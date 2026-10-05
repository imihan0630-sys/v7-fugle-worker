import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const spec = JSON.parse(
  readFileSync(new URL('./d03_interaction_estimability_concentration_oracle_20261006_v0_1.json', import.meta.url))
);

const nonempty = v => typeof v === 'string' && v.trim().length > 0;
const hex64 = v => typeof v === 'string' && /^[a-f0-9]{64}$/.test(v);

function req(x, fields, prefix) {
  for (const f of fields) {
    if (!(f in x)) throw new Error(`MISSING_${prefix}_FIELD:${f}`);
    const v=x[f];
    if (typeof v === 'string' && !nonempty(v)) throw new Error(`EMPTY_${prefix}_FIELD:${f}`);
  }
}

function claimScopeFromConcentration(x) {
  if (x.requestedClaimScope === 'MARKET_WIDE') {
    if (x.singleSectorDominant === true) return 'SECTOR_CONDITIONAL_OBSERVATION';
    if (x.singleRegimeDominant === true) return 'REGIME_CONDITIONAL_OBSERVATION';
    if (x.singlePhaseDominant === true) return 'PHASE_CONDITIONAL_OBSERVATION';
  }
  if (x.estimandScope === 'RESTRICTED_SUPPORT_ESTIMAND') return 'RESTRICTED_SUPPORT_ONLY';
  return 'MARKET_WIDE_CLAIM_SUPPORTED';
}

export function evaluateInteractionSupport(x) {
  if (!x || typeof x !== 'object') throw new Error('INPUT_REQUIRED');
  req(x,spec.requiredCommonFields,'COMMON');

  if (!spec.representationClasses.includes(x.representationClass)) throw new Error('INVALID_REPRESENTATION_CLASS');
  if (!hex64(x.supportFloorPreregistrationHash)) throw new Error('INVALID_SUPPORT_FLOOR_PREREG_HASH');
  if (x.representationChangedAfterOutcome === true) throw new Error('POST_OUTCOME_REPRESENTATION_SWITCH_FORBIDDEN');
  if (x.knownSemanticBreaksPooled === true && x.breakAwareMethodAuthorized !== true) throw new Error('SEMANTIC_BREAK_POOLING_FORBIDDEN');
  if (!Number.isInteger(x.preregisteredMinIndependentDecisionDateN) || x.preregisteredMinIndependentDecisionDateN < 1) throw new Error('INVALID_PREREG_MIN_DATE_N');

  const result = {
    status:'PASS',
    representationClass:x.representationClass,
    terminalState:'SUPPORT_READY',
    claimScope:claimScopeFromConcentration(x),
    effectiveInteractionIncrementEligible:true,
    formalCoreImpact:'NONE_LOCKED'
  };

  if (x.selectionIdentificationDisposition !== 'TARGET_POPULATION_INCREMENTALITY_IDENTIFIED' &&
      x.estimandScope !== 'RESTRICTED_SUPPORT_ESTIMAND') {
    result.terminalState='SELECTION_IDENTIFICATION_BLOCKED';
    result.effectiveInteractionIncrementEligible=false;
  }

  if (x.admittedDecisionDateN < x.preregisteredMinIndependentDecisionDateN ||
      x.methodSpecificSupportFloorPass !== true) {
    result.terminalState='POWER_INSUFFICIENT';
    result.effectiveInteractionIncrementEligible=false;
  }

  if (x.representationClass === 'CATEGORICAL_JOINT_CELL') {
    req(x,spec.categoricalJointCellRequired,'CELL');
    const universe=new Set(x.preregisteredCellUniverse);
    for(const id of universe){
      if(!(id in x.rawRowNByCell) || !(id in x.independentDecisionDateNByCell) || !(id in x.uniqueSymbolNByCell) || !(id in x.admittedDateNByCell)) {
        throw new Error('CELL_LEDGER_INCOMPLETE:'+id);
      }
    }
    if ((x.zeroSupportCells||[]).some(id=>universe.has(id))) {
      result.terminalState='JOINT_SUPPORT_INSUFFICIENT';
      result.effectiveInteractionIncrementEligible=false;
    }
    const floor=x.preregisteredMinJointCellIndependentDateN;
    if (!Number.isInteger(floor) || floor<1) throw new Error('INVALID_CELL_FLOOR');
    if ([...universe].some(id => Number(x.independentDecisionDateNByCell[id]) < floor)) {
      result.terminalState='POWER_INSUFFICIENT';
      result.effectiveInteractionIncrementEligible=false;
    }
  }

  if (x.representationClass === 'CONTINUOUS_INTERACTION') {
    req(x,spec.continuousRequired,'CONTINUOUS');
    if (x.designRankState !== 'FULL_RANK') {
      result.terminalState='METHOD_INCOMPATIBLE';
      result.effectiveInteractionIncrementEligible=false;
    }
    if (x.unsupportedDesignRegionState === 'MATERIAL_UNSUPPORTED_REGION') {
      result.terminalState='JOINT_SUPPORT_INSUFFICIENT';
      result.effectiveInteractionIncrementEligible=false;
    }
    if (x.highLeverageDominance === true || x.highInfluenceDominance === true) {
      result.terminalState='CONCENTRATION_FRAGILE';
      result.effectiveInteractionIncrementEligible=false;
    }
  }

  if (x.representationClass === 'MIXED_THRESHOLD_CONTINUOUS') {
    req(x,spec.mixedRequired,'MIXED');
    if (!hex64(x.thresholdIdentityHash) || !nonempty(x.thresholdSearchFamilyId)) throw new Error('THRESHOLD_IDENTITY_REQUIRED');
    if (x.thresholdSupportPass !== true || x.continuousSupportPass !== true) {
      result.terminalState='JOINT_SUPPORT_INSUFFICIENT';
      result.effectiveInteractionIncrementEligible=false;
    }
  }

  if (x.representationClass === 'PATH_OR_LIFECYCLE_INTERACTION') {
    req(x,spec.pathRequired,'PATH');
    if (x.replicationClusterN < 2 || x.leaveOneReplicationClusterOutState === 'INSUFFICIENT_CLUSTERS') {
      result.terminalState='DEPENDENCE_TOO_STRONG_FOR_CURRENT_SAMPLE';
      result.effectiveInteractionIncrementEligible=false;
    }
  }

  if (x.inferenceMode === 'CLUSTER') {
    req(x,spec.clusterSupport.required,'CLUSTER');
    if (Number(x.effectiveClusterCount) < 20) {
      result.terminalState='DEPENDENCE_TOO_STRONG_FOR_CURRENT_SAMPLE';
      result.effectiveInteractionIncrementEligible=false;
    }
    if (x.clusterInfluenceSevere === true || x.clusterImbalanceSevere === true) {
      result.terminalState='CONCENTRATION_FRAGILE';
      result.effectiveInteractionIncrementEligible=false;
    }
  }

  if (x.inferenceMode === 'HAC') {
    req(x,spec.hacSupport.required,'HAC');
    if (Number(x.effectiveDateDiagnostic) < 20) {
      result.terminalState='DEPENDENCE_TOO_STRONG_FOR_CURRENT_SAMPLE';
      result.effectiveInteractionIncrementEligible=false;
    } else if (Number(x.effectiveDateDiagnostic) < 40 && x.corroboratingDependenceMethodPass !== true) {
      result.terminalState='POWER_INSUFFICIENT';
      result.effectiveInteractionIncrementEligible=false;
    }
  }

  if (x.inferenceMode === 'BLOCK_BOOTSTRAP') {
    req(x,spec.blockBootstrapSupport.required,'BLOCK');
    if (x.semanticBoundaryCrossing === true) throw new Error('BLOCK_CROSSES_SEMANTIC_BOUNDARY');
    if (Number(x.effectiveNonOverlappingBlockCount) < 10) {
      result.terminalState='DEPENDENCE_TOO_STRONG_FOR_CURRENT_SAMPLE';
      result.effectiveInteractionIncrementEligible=false;
    } else if (Number(x.effectiveNonOverlappingBlockCount) < 20 && x.corroboratingDependenceMethodPass !== true) {
      result.terminalState='POWER_INSUFFICIENT';
      result.effectiveInteractionIncrementEligible=false;
    }
  }

  req(x,spec.concentrationRequired,'CONCENTRATION');
  req(x,spec.leaveOneOutRequired,'LOO');

  if (x.leaveOneDateOut?.signFlipAny === true ||
      x.leaveOneReplicationClusterOut?.signFlipAny === true ||
      x.promotionStateStability === false) {
    result.terminalState='CONCENTRATION_FRAGILE';
    result.effectiveInteractionIncrementEligible=false;
  }

  if (x.weightingUsed === true) {
    req(x,spec.weightedSupportRequired,'WEIGHT');
    if (x.weightedSupportFloorPass !== true ||
        (x.zeroSupportStrata||[]).length>0 ||
        x.nearZeroSupportWarning === true) {
      result.terminalState='SELECTION_IDENTIFICATION_BLOCKED';
      result.effectiveInteractionIncrementEligible=false;
    }
  }

  if (result.claimScope !== 'MARKET_WIDE_CLAIM_SUPPORTED' && x.requestedClaimScope === 'MARKET_WIDE') {
    result.effectiveInteractionIncrementEligible=false;
    if (result.terminalState === 'SUPPORT_READY') result.terminalState='CONCENTRATION_FRAGILE';
  }

  if (x.versionOrContinuityCompatible !== true) {
    result.terminalState='VERSION_OR_CONTINUITY_INCOMPATIBLE';
    result.effectiveInteractionIncrementEligible=false;
  }

  return Object.freeze(result);
}

const H=c=>c.repeat(64);
const common={
  interactionFamilyId:'IF_PV_V1',
  interactionVersion:'I1',
  representationClass:'CATEGORICAL_JOINT_CELL',
  targetPopulationHash:H('a'),
  estimandScope:'TARGET_POPULATION_ESTIMAND',
  commonSupportHash:H('b'),
  rawRowN:600,
  rawDecisionDateN:60,
  admittedDecisionDateN:60,
  uniqueSymbolN:150,
  dateWeightingRule:'DECISION_DATE_WEIGHTED',
  outcomeHorizonId:'D5',
  purgeEmbargoRuleVersion:'PURGE_D20_MAX_FOOTPRINT_V1',
  sda016ConsumptionRef:'SDA016-TEST',
  selectionIdentificationDisposition:'TARGET_POPULATION_INCREMENTALITY_IDENTIFIED',
  dependenceMethodRef:'D16-06-CLUSTER-V1',
  consumerScopeHash:H('c'),
  terminalState:'SUPPORT_READY',
  supportFloorPreregistrationHash:H('d'),
  preregisteredMinIndependentDecisionDateN:40,
  methodSpecificSupportFloorPass:true,
  representationChangedAfterOutcome:false,
  knownSemanticBreaksPooled:false,
  breakAwareMethodAuthorized:false,
  requestedClaimScope:'MARKET_WIDE',
  singleSectorDominant:false,
  singleRegimeDominant:false,
  singlePhaseDominant:false,
  preregisteredCellUniverse:['00','01','10','11'],
  rawRowNByCell:{'00':150,'01':150,'10':150,'11':150},
  independentDecisionDateNByCell:{'00':30,'01':30,'10':30,'11':30},
  uniqueSymbolNByCell:{'00':80,'01':80,'10':80,'11':80},
  admittedDateNByCell:{'00':30,'01':30,'10':30,'11':30},
  weightedEffectiveSupportByCell:{'00':30,'01':30,'10':30,'11':30},
  zeroSupportCells:[],
  nearZeroSupportCells:[],
  preregisteredMinJointCellIndependentDateN:20,
  minJointCellFloorJustification:'D16_METHOD_SPECIFIC_FROZEN',
  cellConcentrationDiagnostics:{maxDateShare:0.1},
  inferenceMode:'CLUSTER',
  rawClusterN:60,
  effectiveClusterCount:35,
  clusterSizeDistribution:{min:5,median:10,max:20},
  clusterLeverageDiagnostics:{state:'PASS'},
  clusterInfluenceDiagnostics:{state:'PASS'},
  clusteringDimensions:['decisionDate'],
  clusterInfluenceSevere:false,
  clusterImbalanceSevere:false,
  maxDecisionDateShare:0.05,
  topKDecisionDateShare:0.15,
  symbolConcentration:{state:'PASS'},
  sectorIndustryConcentration:{state:'PASS'},
  regimeConcentration:{state:'PASS'},
  episodeClusterConcentration:{state:'PASS'},
  designRegionConcentration:{state:'PASS'},
  effectContributionConcentration:{state:'PASS'},
  leaveOneDateOut:{signFlipAny:false},
  leaveOneReplicationClusterOut:{signFlipAny:false},
  leaveOneSectorIndustryOutForCrossIndustryClaim:{state:'PASS'},
  leaveOneRegimeOutForGlobalClaim:{state:'PASS'},
  signStability:true,
  effectRange:[0.8,1.2],
  promotionStateStability:true,
  maxAbsoluteDelta:0.2,
  weightingUsed:false,
  versionOrContinuityCompatible:true
};

const good=evaluateInteractionSupport(common);
assert.equal(good.terminalState,'SUPPORT_READY');
assert.equal(good.effectiveInteractionIncrementEligible,true);

const zeroCell=evaluateInteractionSupport({...common,zeroSupportCells:['11'],independentDecisionDateNByCell:{...common.independentDecisionDateNByCell,'11':0}});
assert.equal(zeroCell.terminalState,'JOINT_SUPPORT_INSUFFICIENT');

const thinCell=evaluateInteractionSupport({...common,independentDecisionDateNByCell:{...common.independentDecisionDateNByCell,'11':8}});
assert.equal(thinCell.terminalState,'POWER_INSUFFICIENT');

const hugeRowsFewDates=evaluateInteractionSupport({...common,rawRowN:10000,rawDecisionDateN:8,admittedDecisionDateN:8,methodSpecificSupportFloorPass:false});
assert.equal(hugeRowsFewDates.terminalState,'POWER_INSUFFICIENT');

assert.throws(()=>evaluateInteractionSupport({...common,representationChangedAfterOutcome:true}),/POST_OUTCOME_REPRESENTATION_SWITCH/);
assert.throws(()=>evaluateInteractionSupport({...common,knownSemanticBreaksPooled:true}),/SEMANTIC_BREAK_POOLING/);

const fewClusters=evaluateInteractionSupport({...common,effectiveClusterCount:12});
assert.equal(fewClusters.terminalState,'DEPENDENCE_TOO_STRONG_FOR_CURRENT_SAMPLE');

const influenced=evaluateInteractionSupport({...common,effectiveClusterCount:30,clusterInfluenceSevere:true});
assert.equal(influenced.terminalState,'CONCENTRATION_FRAGILE');

const signFlip=evaluateInteractionSupport({...common,leaveOneDateOut:{signFlipAny:true}});
assert.equal(signFlip.terminalState,'CONCENTRATION_FRAGILE');

const sectorOnly=evaluateInteractionSupport({...common,singleSectorDominant:true});
assert.equal(sectorOnly.claimScope,'SECTOR_CONDITIONAL_OBSERVATION');
assert.equal(sectorOnly.effectiveInteractionIncrementEligible,false);

const continuous={
  ...common,
  representationClass:'CONTINUOUS_INTERACTION',
  componentRangeCoverage:{state:'PASS'},
  componentQuantileCoverage:{state:'PASS'},
  jointDesignCoverage:{state:'PASS'},
  unsupportedDesignRegionState:'NONE',
  componentCorrelation:0.4,
  interactionMainEffectCollinearity:{state:'PASS'},
  leverageDiagnostics:{state:'PASS'},
  partialLeverageDiagnostics:{state:'PASS'},
  influenceDiagnostics:{state:'PASS'},
  designRankState:'FULL_RANK',
  marginalControlBasisHash:H('e'),
  highLeverageDominance:false,
  highInfluenceDominance:false
};
const contGood=evaluateInteractionSupport(continuous);
assert.equal(contGood.terminalState,'SUPPORT_READY');

const contExtreme=evaluateInteractionSupport({...continuous,highLeverageDominance:true});
assert.equal(contExtreme.terminalState,'CONCENTRATION_FRAGILE');

const contRank=evaluateInteractionSupport({...continuous,designRankState:'RANK_DEFICIENT'});
assert.equal(contRank.terminalState,'METHOD_INCOMPATIBLE');

const mixed={
  ...common,
  representationClass:'MIXED_THRESHOLD_CONTINUOUS',
  thresholdIdentityHash:H('f'),
  thresholdSearchFamilyId:'TSF1',
  categoricalSupportRef:'CELL-SUPPORT-1',
  continuousSupportRef:'CONT-SUPPORT-1',
  thresholdSupportPass:true,
  continuousSupportPass:true
};
assert.equal(evaluateInteractionSupport(mixed).terminalState,'SUPPORT_READY');
assert.equal(evaluateInteractionSupport({...mixed,thresholdSupportPass:false}).terminalState,'JOINT_SUPPORT_INSUFFICIENT');

const path={
  ...common,
  representationClass:'PATH_OR_LIFECYCLE_INTERACTION',
  structuralEpisodeN:6,
  replicationClusterN:3,
  transitionN:8,
  activeEpisodeN:1,
  rightCensoredEpisodeN:1,
  calendarSpanSessions:120,
  separatedPeriodN:3,
  outcomeFootprintOverlapState:'CONTROLLED',
  leaveOneReplicationClusterOutState:'STABLE'
};
assert.equal(evaluateInteractionSupport(path).terminalState,'SUPPORT_READY');
assert.equal(evaluateInteractionSupport({...path,replicationClusterN:1,leaveOneReplicationClusterOutState:'INSUFFICIENT_CLUSTERS'}).terminalState,'DEPENDENCE_TOO_STRONG_FOR_CURRENT_SAMPLE');

const hac={
  ...continuous,
  inferenceMode:'HAC',
  kernel:'BARTLETT',
  bandwidth:5,
  lagDependenceDiagnostics:{state:'PASS'},
  longRunVarianceInflation:1.5,
  effectiveDateDiagnostic:35,
  corroboratingDependenceMethodPass:false
};
assert.equal(evaluateInteractionSupport(hac).terminalState,'POWER_INSUFFICIENT');
assert.equal(evaluateInteractionSupport({...hac,effectiveDateDiagnostic:45}).terminalState,'SUPPORT_READY');

const block={
  ...path,
  inferenceMode:'BLOCK_BOOTSTRAP',
  bootstrapFamily:'MOVING_BLOCK',
  blockLength:5,
  blockLengthSelectorVersion:'DEP_ONLY_V1',
  replications:2000,
  effectiveNonOverlappingBlockCount:8,
  blockLengthSensitivity:{state:'STABLE'},
  semanticBoundaryCrossing:false,
  corroboratingDependenceMethodPass:false
};
assert.equal(evaluateInteractionSupport(block).terminalState,'DEPENDENCE_TOO_STRONG_FOR_CURRENT_SAMPLE');

const weighted={
  ...common,
  weightingUsed:true,
  sumWeights:600,
  sumSquaredWeights:900,
  weightedEffectiveSupport:400,
  maxWeight:4,
  weightQuantiles:[0.4,0.8,1,1.5,4],
  weightConcentration:{state:'PASS'},
  zeroSupportStrata:[],
  nearZeroSupportWarning:false,
  balanceDiagnostics:{state:'PASS'},
  weightedSupportFloorPass:true
};
assert.equal(evaluateInteractionSupport(weighted).terminalState,'SUPPORT_READY');
assert.equal(evaluateInteractionSupport({...weighted,nearZeroSupportWarning:true}).terminalState,'SELECTION_IDENTIFICATION_BLOCKED');

console.log(JSON.stringify({
  status:'PASS',
  cases:20,
  goodCategorical:'SUPPORT_READY',
  zeroCell:'JOINT_SUPPORT_INSUFFICIENT',
  thinCell:'POWER_INSUFFICIENT',
  hugeRowsFewDates:'POWER_INSUFFICIENT',
  fewEffectiveClusters:'DEPENDENCE_TOO_STRONG_FOR_CURRENT_SAMPLE',
  concentrationFragile:'CONCENTRATION_FRAGILE',
  continuousHighLeverage:'CONCENTRATION_FRAGILE',
  continuousRankDeficient:'METHOD_INCOMPATIBLE',
  sectorScopeContracted:'SECTOR_CONDITIONAL_OBSERVATION',
  weightedNearZeroSupport:'SELECTION_IDENTIFICATION_BLOCKED',
  formalCoreImpact:'NONE_LOCKED',
  outcomeDataUsed:false
}));
