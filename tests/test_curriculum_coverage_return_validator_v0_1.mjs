import assert from "node:assert/strict";
import {
  validateCoverageSpecialistReturnMarkdown,
  validateCoverageStateTransition
} from "../research/curriculum_coverage_return_validator_v0_1.mjs";

let n=0;
const eq=(a,b)=>{assert.deepEqual(a,b);n++;};
const ok=x=>{assert.ok(x);n++;};

const goodReturn=`# COV-08 Specialist Return

- Candidate ID: COV-08
- Domain: D16
- Specialist room: 11｜統計驗證與策略市場狀態研究室
- Return artifact path: research/COV08_D16_SPECIALIST_RETURN_V0_1.md
- Evidence cutoff: 2026-10-03T22:51:00+08:00
- Current candidate class: SCOPE_EXTENSION_CANDIDATE
- Proposed terminal recommendation: EXTEND_EXISTING_SCOPE

### 1. Exact Knowledge Definition
Dependence-aware resampling estimates uncertainty under serial dependence. UNKNOWN remains UNKNOWN.

### 2. Existing-module Overlap Matrix
D16-06 shares date-cluster inference but not explicit block-length sensitivity.

### 3. Why Current Scope Is Insufficient
Current scope does not freeze when block bootstrap is required versus cluster-robust inference.

### 4. Taiwan Data Feasibility
Source: existing Taiwan PIT strategy return panels. Authority and access depend on the underlying official market receipts.

### 5. PIT / Replay Implication
Use knownAt, capturedAt and vintage-safe Replay semantics; no future rows enter a block.

### 6. Decision Role
Primary role: validation. This is not an independent alpha vote.

### 7. Anti-double-count Rule
Multiple bootstrap variants are shared diagnostics and must not become duplicate evidence votes.

### 8. Proposed Owner
D16-06 is the preferred owner, subject to 00-room audit.

### 9. Maturity Starting Point
Keep existing maturity unchanged until owner audit; no inherited promotion.

### 10. Terminal Recommendation
EXTEND_EXISTING_SCOPE

Strongest evidence supports dependence-aware inference; strongest counterevidence is limited sample size.
`;

const v=validateCoverageSpecialistReturnMarkdown({
  markdown:goodReturn,
  expectedCandidateId:"COV-08",
  expectedDomain:"D16",
  expectedArtifactPath:"research/COV08_D16_SPECIALIST_RETURN_V0_1.md"
});
eq(v.ok,true);
eq(v.status,"RETURN_CONTRACT_COMPLETE");
eq(v.terminalRecommendation,"EXTEND_EXISTING_SCOPE");
eq(v.errors,[]);

const missing=validateCoverageSpecialistReturnMarkdown({
  markdown:goodReturn.replace(/### 7\. Anti-double-count Rule[\s\S]*?(?=### 8\.)/,""),
  expectedCandidateId:"COV-08",
  expectedDomain:"D16"
});
eq(missing.ok,false);
ok(missing.errors.includes("MISSING_SECTION:antiDoubleCount"));

const duplicateTerminal=validateCoverageSpecialistReturnMarkdown({
  markdown:goodReturn.replace(
    "### 10. Terminal Recommendation\nEXTEND_EXISTING_SCOPE",
    "### 10. Terminal Recommendation\nEXTEND_EXISTING_SCOPE or MERGE_INTO_EXISTING"
  )
});
eq(duplicateTerminal.ok,false);
ok(duplicateTerminal.errors.includes("TERMINAL_RECOMMENDATION_MUST_BE_EXACTLY_ONE"));

const unknownBad=validateCoverageSpecialistReturnMarkdown({
  markdown:goodReturn.replace("UNKNOWN remains UNKNOWN","UNKNOWN -> 0")
});
eq(unknownBad.ok,false);
ok(unknownBad.errors.includes("UNKNOWN_COERCION_FORBIDDEN"));

const baseMeta={
  candidateId:"COV-08",
  changedAt:"2026-10-03T22:51:00+08:00",
  sourceArtifacts:["research/COV08_D16_SPECIALIST_RETURN_V0_1.md"],
  evidenceCutoff:"2026-10-03T22:51:00+08:00",
  actorRoom:"00｜研究總控室",
  reason:"return contract complete",
  canonicalImpact:"NONE"
};

const accepted=validateCoverageStateTransition({
  fromState:"PARTIAL_EVIDENCE_RECEIVED",
  toState:"RETURN_ACCEPTED_FOR_INTAKE",
  metadata:{...baseMeta,returnContractComplete:true},
  terminalRecommendation:"EXTEND_EXISTING_SCOPE"
});
eq(accepted.ok,true);

const jumped=validateCoverageStateTransition({
  fromState:"PARTIAL_EVIDENCE_RECEIVED",
  toState:"TERMINAL_DECISION_READY",
  metadata:baseMeta,
  terminalRecommendation:"EXTEND_EXISTING_SCOPE"
});
eq(jumped.ok,false);
ok(jumped.errors.includes("ILLEGAL_STATE_TRANSITION"));

const structuralSkip=validateCoverageStateTransition({
  fromState:"DEPENDENCY_AUDIT_PENDING",
  toState:"TERMINAL_DECISION_READY",
  metadata:baseMeta,
  terminalRecommendation:"ADD_MODULE"
});
eq(structuralSkip.ok,false);
ok(structuralSkip.errors.includes("STRUCTURAL_DECISION_MUST_PASS_OWNER_APPROVAL"));

const needsOwner=validateCoverageStateTransition({
  fromState:"DEPENDENCY_AUDIT_PENDING",
  toState:"OWNER_APPROVAL_REQUIRED",
  metadata:{
    ...baseMeta,
    dependencyAuditArtifact:"shared-knowledge/DEP.md",
    overlapResult:"PASS",
    antiOrphanResult:"PASS",
    owner:"11｜統計驗證與策略市場狀態研究室"
  },
  terminalRecommendation:"EXTEND_EXISTING_SCOPE"
});
eq(needsOwner.ok,true);

const ownerMissing=validateCoverageStateTransition({
  fromState:"OWNER_APPROVAL_REQUIRED",
  toState:"TERMINAL_DECISION_READY",
  metadata:baseMeta,
  terminalRecommendation:"EXTEND_EXISTING_SCOPE"
});
eq(ownerMissing.ok,false);
ok(ownerMissing.errors.includes("OWNER_APPROVAL_ARTIFACT_REQUIRED"));

const ownerPass=validateCoverageStateTransition({
  fromState:"OWNER_APPROVAL_REQUIRED",
  toState:"TERMINAL_DECISION_READY",
  metadata:{...baseMeta,ownerApprovalArtifact:"research/OWNER_APPROVAL.md"},
  terminalRecommendation:"EXTEND_EXISTING_SCOPE"
});
eq(ownerPass.ok,true);

const canonicalBlocked=validateCoverageStateTransition({
  fromState:"TERMINAL_DECISION_READY",
  toState:"CANONICAL_UPDATE_COMPLETE",
  metadata:{...baseMeta,ownerApprovalArtifact:"research/OWNER_APPROVAL.md"},
  terminalRecommendation:"EXTEND_EXISTING_SCOPE"
});
eq(canonicalBlocked.ok,false);
ok(canonicalBlocked.errors.includes("MISSING_CANONICAL_UPDATE_GATE:commitSha"));

const canonicalPass=validateCoverageStateTransition({
  fromState:"TERMINAL_DECISION_READY",
  toState:"CANONICAL_UPDATE_COMPLETE",
  metadata:{
    ...baseMeta,
    commitSha:"abc123",
    ownerApprovalArtifact:"research/OWNER_APPROVAL.md",
    dependencyAuditArtifact:"shared-knowledge/DEP.md",
    overlapResult:"PASS",
    antiOrphanResult:"PASS",
    owner:"11｜統計驗證與策略市場狀態研究室"
  },
  terminalRecommendation:"EXTEND_EXISTING_SCOPE"
});
eq(canonicalPass.ok,true);

const closePass=validateCoverageStateTransition({
  fromState:"TERMINAL_DECISION_READY",
  toState:"CLOSED_NO_STRUCTURAL_CHANGE",
  metadata:baseMeta,
  terminalRecommendation:"NOT_A_GAP"
});
eq(closePass.ok,true);

const closeBad=validateCoverageStateTransition({
  fromState:"TERMINAL_DECISION_READY",
  toState:"CLOSED_NO_STRUCTURAL_CHANGE",
  metadata:baseMeta,
  terminalRecommendation:"ADD_MODULE"
});
eq(closeBad.ok,false);
ok(closeBad.errors.includes("CLOSED_NO_STRUCTURAL_CHANGE_REQUIRES_NONSTRUCTURAL_TERMINAL"));

console.log("curriculum coverage return validator tests passed: "+n);
