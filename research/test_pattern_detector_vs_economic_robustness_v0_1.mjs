import assert from "node:assert/strict";
import {
  validateEconomicValidationReadiness,
  summarizeReplicationUnits,
  summarizeCoverage,
  classifyDesignReadiness,
  holdoutUseGuard,
  regimeDefinitionGuard
} from "./pattern_detector_vs_economic_robustness_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

const design={
  experimentId:"E1",semanticRuleId:"S1",detectorFamilyId:"D1",parameterFamilyId:"PF1",
  parameterGridHash:"PG1",targetDefinitionId:"T1",benchmarkId:"B1",horizonId:"H1",
  costPolicyId:"C1",parentIdentityContractId:"P1",structuralIdentityContractId:"R1",
  symbolUniverseVersion:"U1",dateWindowId:"W1",regimeOwner:"D18",regimeVersion:"RG1",
  dependenceUnit:"ROOT_EPISODE_CLUSTER",holdoutId:"OOS1",coveragePolicyId:"CV1",
  missingnessPolicyId:"M1",outcomeJoinState:"CLOSED",holdoutUseCount:0,
  regimeDefinedFromPatternPerformance:false
};

t("ER01 complete design is ready only for D16 preregistration",()=>{
  const r=validateEconomicValidationReadiness(design);
  assert.equal(r.status,"READY_FOR_D16_PREREGISTRATION");
  assert.equal(r.outcomeJoinAllowedInD01,false);
  assert.equal(r.economicEvidenceAssigned,false);
});

t("ER02 missing target blocks readiness",()=>{
  const r=validateEconomicValidationReadiness({...design,targetDefinitionId:""});
  assert.equal(r.status,"ECONOMIC_VALIDATION_NOT_READY");
  assert.ok(r.missing.includes("targetDefinitionId"));
});

t("ER03 D01 cannot open outcomes",()=>{
  const r=validateEconomicValidationReadiness({...design,outcomeJoinState:"OPEN"});
  assert.equal(r.status,"PROHIBITED");
});

t("ER04 regime carved from pattern performance is prohibited",()=>{
  const r=validateEconomicValidationReadiness({...design,regimeDefinedFromPatternPerformance:true});
  assert.equal(r.reason,"POST_HOC_REGIME_MINING");
});

t("ER05 consumed holdout requires D16 governance",()=>{
  const r=validateEconomicValidationReadiness({...design,holdoutUseCount:2});
  assert.equal(r.status,"HOLDOUT_ALREADY_CONSUMED");
});

t("ER06 repeated dates of one root are not independent replications",()=>{
  const r=summarizeReplicationUnits([
    {parentDecisionId:"P1",structuralRootId:"R1",objectEpisodeId:"EP1",symbol:"2330",independentClusterId:"C1",regimeState:"RG1"},
    {parentDecisionId:"P2",structuralRootId:"R1",objectEpisodeId:"EP1",symbol:"2330",independentClusterId:"C1",regimeState:"RG1"},
    {parentDecisionId:"P3",structuralRootId:"R1",objectEpisodeId:"EP1",symbol:"2330",independentClusterId:"C1",regimeState:"RG1"}
  ]);
  assert.equal(r.observationCount,3);
  assert.equal(r.uniqueStructuralRootCount,1);
  assert.equal(r.independentClusterCount,1);
  assert.equal(r.economicReplicationCount,1);
});

t("ER07 multiple named representations do not inflate price information roots",()=>{
  const r=summarizeReplicationUnits([
    {parentDecisionId:"P1",structuralRootId:"R1",objectEpisodeId:"EP1",symbol:"2330",independentClusterId:"C1",regimeState:"RG1",rawRepresentationCount:5}
  ]);
  assert.equal(r.rawRepresentationCount,5);
  assert.equal(r.priceInformationRootCount,1);
  assert.equal(r.effectiveIndependentEvidenceCount,1);
});

t("ER08 cross-symbol replication counts unique symbols separately from observations",()=>{
  const r=summarizeReplicationUnits([
    {parentDecisionId:"P1",structuralRootId:"R1",objectEpisodeId:"EP1",symbol:"2330",independentClusterId:"C1",regimeState:"RG1"},
    {parentDecisionId:"P2",structuralRootId:"R2",objectEpisodeId:"EP2",symbol:"2317",independentClusterId:"C2",regimeState:"RG1"}
  ]);
  assert.equal(r.uniqueSymbolCount,2);
  assert.equal(r.economicReplicationCount,2);
});

t("ER09 coverage ledger keeps blocked and missing cases",()=>{
  const r=summarizeCoverage({eligibleCount:100,evaluableCount:70,dataBlockedCount:10,noOpportunityCount:10,missingCount:10});
  assert.equal(r.status,"VALID");
  assert.equal(r.evaluableRate,0.7);
  assert.equal(r.silentDroppingAllowed,false);
});

t("ER10 invalid coverage arithmetic fails closed",()=>{
  const r=summarizeCoverage({eligibleCount:10,evaluableCount:8,dataBlockedCount:3});
  assert.equal(r.status,"UNKNOWN");
});

t("ER11 detector-only readiness is G0 not economic proof",()=>{
  const r=classifyDesignReadiness({});
  assert.equal(r.readinessStage,"G0_LOCAL_DETECTOR_ONLY");
  assert.equal(r.economicEvidenceAssigned,false);
});

t("ER12 cross-symbol only reaches G1",()=>{
  const r=classifyDesignReadiness({crossSymbolFrozen:true});
  assert.equal(r.readinessStage,"G1_CROSS_SYMBOL");
});

t("ER13 independent date clusters are required for G2",()=>{
  const r=classifyDesignReadiness({crossSymbolFrozen:true,independentDateClustersFrozen:true});
  assert.equal(r.readinessStage,"G2_CROSS_DATE");
});

t("ER14 ex-ante regimes are required for G3",()=>{
  const r=classifyDesignReadiness({
    crossSymbolFrozen:true,independentDateClustersFrozen:true,exAnteRegimeFrozen:true
  });
  assert.equal(r.readinessStage,"G3_CROSS_REGIME");
});

t("ER15 prospective fresh holdout is required for G4",()=>{
  const r=classifyDesignReadiness({
    crossSymbolFrozen:true,independentDateClustersFrozen:true,exAnteRegimeFrozen:true,
    prospectiveFlag:true,holdoutFresh:true
  });
  assert.equal(r.readinessStage,"G4_PROSPECTIVE_OOS");
});

t("ER16 frozen cost policy is required for G5 readiness",()=>{
  const r=classifyDesignReadiness({
    crossSymbolFrozen:true,independentDateClustersFrozen:true,exAnteRegimeFrozen:true,
    prospectiveFlag:true,holdoutFresh:true,costPolicyFrozen:true
  });
  assert.equal(r.readinessStage,"G5_COST_AWARE");
});

t("ER17 reused holdout becomes development-like",()=>{
  const r=holdoutUseGuard({holdoutId:"OOS1",holdoutFirstOpenedAt:"2026-01-01",holdoutUseCount:3});
  assert.equal(r.status,"HOLDOUT_CONSUMED");
  assert.equal(r.developmentLike,true);
});

t("ER18 market regime cannot be performance-shaped",()=>{
  const r=regimeDefinitionGuard({
    regimeOwner:"D18",regimeVersion:"R1",frozenAt:"2026-01-01",performanceUsedToDefine:true
  });
  assert.equal(r.status,"PROHIBITED");
});

console.log(`SUMMARY ${pass}/18 PASS`);
