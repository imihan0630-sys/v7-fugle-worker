import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const spec=JSON.parse(readFileSync(new URL('./d03_falsification_null_of_null_calibration_contract_20261006_v0_1.json',import.meta.url)));

function validateCalibrationBatch(batch){
  if(!batch||typeof batch!=='object') throw new Error('BATCH_REQUIRED');
  if(!Array.isArray(batch.worlds)||!batch.worlds.length) throw new Error('WORLDS_REQUIRED');

  for(const w of batch.worlds){
    for(const f of spec.requiredWorldFields){
      if(!(f in w)) throw new Error('MISSING_WORLD_FIELD:'+f);
    }
    if(!spec.truthLabels.includes(w.truthLabel)) throw new Error('INVALID_TRUTH_LABEL');
    if(!spec.calibrationStages.includes(w.calibrationStage)) throw new Error('INVALID_CALIBRATION_STAGE');
    if(w.deleted===true) throw new Error('SYNTHETIC_WORLD_DELETION_FORBIDDEN');
  }

  if(batch.auditResultsSeen===true&&batch.methodChangedAfterAudit===true&&batch.methodVersionIncremented!==true){
    throw new Error('AUDIT_REDESIGN_WITHOUT_VERSION_INCREMENT');
  }
  if(batch.methodChangedAfterAudit===true&&batch.newAuditSetRequired!==true){
    throw new Error('AUDIT_REDESIGN_REQUIRES_NEW_AUDIT_SET');
  }
  if(batch.rerunUntilFavorable===true) throw new Error('RERUN_UNTIL_FAVORABLE_FORBIDDEN');
  if(batch.seedDeletionOccurred===true) throw new Error('SEED_DELETION_FORBIDDEN');

  const families=new Set(batch.worlds.filter(w=>w.truthLabel==='NO_RESIDUAL_INTERACTION').map(w=>w.syntheticWorldFamilyId));
  const missing=spec.requiredNullWorldFamilies.filter(x=>!families.has(x));
  if(missing.length) return {status:'CALIBRATION_WORLD_COVERAGE_INCOMPLETE',missingFamilies:missing,methodLayerCleared:false};

  if(batch.thresholdsFrozenPreAudit!==true) return {status:'CALIBRATION_THRESHOLDS_NOT_FROZEN',methodLayerCleared:false};
  if(batch.type1Pass!==true) return {status:'TYPE1_FAIL',methodLayerCleared:false};
  if(batch.directionalErrorPass!==true) return {status:'DIRECTIONAL_ERROR_FAIL',methodLayerCleared:false};
  if(batch.powerPass!==true) return {status:'POWER_INSUFFICIENT',methodLayerCleared:false};
  if(batch.supportBlockBehaviorPass!==true) return {status:'SUPPORT_BLOCK_BEHAVIOR_FAIL',methodLayerCleared:false};
  if(batch.searchSelectionCalibrationPass!==true) return {status:'SEARCH_SELECTION_CALIBRATION_FAIL',methodLayerCleared:false};
  if(batch.nullGeneratorCalibrationPass!==true) return {status:'NULL_GENERATOR_CALIBRATION_FAIL',methodLayerCleared:false};

  const auditN=batch.worlds.filter(w=>w.calibrationStage==='HELD_OUT_AUDIT').length;
  if(auditN===0) return {status:'DEVELOPMENT_ONLY',methodLayerCleared:false};

  return {status:'AUDIT_PASS',methodLayerCleared:true,marketEvidenceUnits:0,maturityImpact:'NONE'};
}

const H=c=>c.repeat(64);
const nullFamilies=spec.requiredNullWorldFamilies;
const worlds=nullFamilies.map((f,i)=>({
  syntheticWorldFamilyId:f,
  syntheticWorldVersion:'V1',
  dgpHash:H((i%10).toString()),
  parameterHash:H(((i+1)%10).toString()),
  seed:1000+i,
  sampleGeometryHash:H(((i+2)%10).toString()),
  truthLabel:'NO_RESIDUAL_INTERACTION',
  expectedSupportState:'METHOD_SPECIFIC',
  methodVersion:'M1',
  calibrationStage:i<5?'DEVELOPMENT':'HELD_OUT_AUDIT'
}));
worlds.push({
  syntheticWorldFamilyId:'INJECTED_SMOOTH',
  syntheticWorldVersion:'V1',
  dgpHash:H('a'),parameterHash:H('b'),seed:2001,sampleGeometryHash:H('c'),
  truthLabel:'INJECTED_INTERACTION_MEDIUM',expectedSupportState:'SUPPORT_READY',
  methodVersion:'M1',calibrationStage:'HELD_OUT_AUDIT'
});

const base={
  worlds,
  auditResultsSeen:true,
  methodChangedAfterAudit:false,
  methodVersionIncremented:false,
  newAuditSetRequired:false,
  rerunUntilFavorable:false,
  seedDeletionOccurred:false,
  thresholdsFrozenPreAudit:true,
  type1Pass:true,
  directionalErrorPass:true,
  powerPass:true,
  supportBlockBehaviorPass:true,
  searchSelectionCalibrationPass:true,
  nullGeneratorCalibrationPass:true
};

const good=validateCalibrationBatch(base);
assert.equal(good.status,'AUDIT_PASS');
assert.equal(good.marketEvidenceUnits,0);

assert.equal(validateCalibrationBatch({...base,type1Pass:false}).status,'TYPE1_FAIL');
assert.equal(validateCalibrationBatch({...base,directionalErrorPass:false}).status,'DIRECTIONAL_ERROR_FAIL');
assert.equal(validateCalibrationBatch({...base,powerPass:false}).status,'POWER_INSUFFICIENT');
assert.equal(validateCalibrationBatch({...base,supportBlockBehaviorPass:false}).status,'SUPPORT_BLOCK_BEHAVIOR_FAIL');
assert.equal(validateCalibrationBatch({...base,searchSelectionCalibrationPass:false}).status,'SEARCH_SELECTION_CALIBRATION_FAIL');
assert.equal(validateCalibrationBatch({...base,nullGeneratorCalibrationPass:false}).status,'NULL_GENERATOR_CALIBRATION_FAIL');
assert.equal(validateCalibrationBatch({...base,thresholdsFrozenPreAudit:false}).status,'CALIBRATION_THRESHOLDS_NOT_FROZEN');

const devOnly={...base,worlds:worlds.map(w=>({...w,calibrationStage:'DEVELOPMENT'}))};
assert.equal(validateCalibrationBatch(devOnly).status,'DEVELOPMENT_ONLY');

const missingWorld={...base,worlds:worlds.filter(w=>w.syntheticWorldFamilyId!=='SERIAL_DEPENDENCE')};
assert.equal(validateCalibrationBatch(missingWorld).status,'CALIBRATION_WORLD_COVERAGE_INCOMPLETE');

assert.throws(()=>validateCalibrationBatch({...base,rerunUntilFavorable:true}),/RERUN_UNTIL_FAVORABLE/);
assert.throws(()=>validateCalibrationBatch({...base,seedDeletionOccurred:true}),/SEED_DELETION/);
assert.throws(()=>validateCalibrationBatch({...base,methodChangedAfterAudit:true,methodVersionIncremented:false,newAuditSetRequired:true}),/VERSION_INCREMENT/);

console.log(JSON.stringify({
  status:'PASS',
  cases:13,
  heldOutSyntheticAuditRequired:true,
  correlatedAndDependentNullWorldCoverageRequired:true,
  calibrationOverfitGuard:true,
  syntheticAuditPassMarketEvidenceUnits:0,
  formalCoreImpact:'NONE_LOCKED',
  outcomeDataUsed:false
}));
