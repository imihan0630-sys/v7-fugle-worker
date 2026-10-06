# S2-07 RAW A1 Lineage V1.0 Physical Receipt

Date: 2026-10-07 Asia/Taipei  
Lane: BUILD_LANE  
Status: RESEARCH_ONLY / PHYSICALLY EXECUTED  
Formal Core: LOCKED  
Trading authority: NONE

## Authoritative execution

- Implementation PR: #718
- Merge commit: `4c2350b499f3412b6a2be650c5d601ace2eea760`
- Workflow: `System2 S2-07 RAW A1 Lineage V1.0 Readonly`
- Run: `37496251790`
- Job: `112381430570`
- Result: PASS
- System2 Research CI: `37496251753` PASS
- V8 Regression: `37496251698` PASS

A workflow PASS means the bounded lineage probe completed correctly and preserved fail-closed semantics. It does **not** mean all four cases achieved lineage readiness.

## Physical result

Four V0.9-positive cases were evaluated against the existing isolated `system2-research` RAW A1 store.

- caseCount = 4
- rawA1LineageReadyCount = 1
- blockedCount = 3
- readySymbols = `4806`
- `PRE_SUSPENSION_RAW_A1_BAR_MISSING = 3`
- `RESUME_RAW_A1_BAR_MISSING = 3`
- rawA1LineageBoundForAllCases = false

### 4806 — bounded lineage READY

Certified native schedule:

- stopTradingStart = 2026-09-23
- resumeTradingDate = 2026-10-02
- previous official market session = 2026-09-22
- suspended official sessions = 2026-09-23, 09-24, 09-29, 09-30, 10-01

Physical D1 observation:

- exactly two RAW A1 rows were present in the bounded lineage window;
- zero RAW A1 rows were present on the certified suspended official sessions;
- pre-suspension canonical key = `TPEX|4806|2026-09-22|RAW`;
- resume canonical key = `TPEX|4806|2026-10-02|RAW`;
- both rows retain barId, barHash, sourceRowHash, availableAt and PIT provenance;
- both rows still have `continuityState=UNVERIFIED`.

Therefore `rawA1LineageBound=true` for 4806 only. V1.0 does not rewrite those RAW rows and does not upgrade technical continuity.

### 5381 / 6241 / 3086 — blocked

For each of the three cases, the isolated D1 returned zero RAW A1 rows inside the bounded pre-suspension-to-resume query window.

Each remains blocked by:

- `PRE_SUSPENSION_RAW_A1_BAR_MISSING`
- `RESUME_RAW_A1_BAR_MISSING`

This is a persisted RAW A1 coverage dependency, not proof of technical-continuity failure and not proof that the underlying market bars did not exist. BUILD_LANE must not fill these historical rows ad hoc; canonical historical population remains DATA_LANE-owned.

## Read-only proof

The physical probe used:

- database = `system2-research`
- D1 schema = `1.1`
- requestCount = 6
- rowsRead = 12
- rowsWritten = 0
- mutationPerformed = false

The workflow also verified no mutation SQL, no Worker deployment, no secret write and no System1 production-file change.

## Authority boundary

Still false:

- rawBarsMutated
- adjustedPriceGenerated
- continuityTransformPerformed
- technicalContinuityCertified
- symbolSessionCompletenessCertified
- selectionAuthority
- finalSelectionEnabled
- livePushEnabled
- capitalImpact
- orderImpact
- system1RuntimeUsed

## Exact continuation

BUILD_LANE may continue only the positive 4806 case into a bounded technical-continuity contract/probe.

5381, 6241 and 3086 remain blocked on canonical RAW A1 coverage and must not be promoted or repaired by BUILD_LANE history writes.

Durable machine receipt:
`system2/evidence/S2_07_RAW_A1_LINEAGE_V1_0_PHYSICAL_20261007.json`
