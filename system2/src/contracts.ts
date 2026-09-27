/**
 * System 2 research-only contracts.
 *
 * This file is intentionally not imported by Worker.js.
 * It defines immutable/PIT-safe interfaces for the future multi-strategy engine.
 */

export type ObservationState =
  | "KNOWN"
  | "UNKNOWN"
  | "STALE"
  | "INVALID"
  | "NOT_APPLICABLE";

export type FactorRole =
  | "REQUIRED"
  | "OPTIONAL"
  | "CONTEXT_ONLY"
  | "EXCLUSION_ONLY";

export type NormalizationMethod =
  | "NONE"
  | "CROSS_SECTIONAL_PERCENTILE"
  | "CROSS_SECTIONAL_ZSCORE"
  | "TIME_SERIES_ZSCORE"
  | "BOUNDED_RATIO"
  | "BOOLEAN_STATE"
  | "ORDINAL_STATE"
  | "CUSTOM_VERSIONED";

export interface SourceProvenance {
  readonly sourceId: string;
  readonly sourceName: string;
  readonly sourceUrl?: string;
  readonly sourceDate?: string;
  readonly observedAt?: string;
  readonly availableAt?: string;
  readonly capturedAt: string;
  readonly pointInTimeEligible: boolean | null;
  readonly payloadHash?: string;
}

export interface NormalizationMeta {
  readonly method: NormalizationMethod;
  readonly normalizationVersion: string;
  readonly referenceUniverse?: string;
  readonly referenceWindow?: string;
  readonly lowerBound?: number;
  readonly upperBound?: number;
}

export interface FactorObservation<T = unknown> {
  readonly factorId: string;
  readonly factorVersion: string;
  readonly scope: "MARKET" | "INDUSTRY" | "SYMBOL" | "EVENT";
  readonly scopeKey: string;
  readonly marketDate: string;
  readonly decisionTimestamp: string;
  readonly state: ObservationState;
  readonly rawValue: T | null;
  readonly normalizedValue: number | null;
  readonly confidence: number | null;
  readonly provenance: SourceProvenance;
  readonly normalization: NormalizationMeta;
  readonly unknownReason?: string;
  readonly qualityFlags: readonly string[];
}

export interface InteractionObservation {
  readonly interactionId: string;
  readonly interactionVersion: string;
  readonly strategyId?: string;
  readonly strategyVersion?: string;
  readonly symbol?: string;
  readonly marketDate: string;
  readonly decisionTimestamp: string;
  readonly componentFactorRefs: readonly {
    readonly factorId: string;
    readonly factorVersion: string;
    readonly state: ObservationState;
  }[];
  readonly componentFamilyAssessmentIds?: readonly string[];
  readonly state: ObservationState;
  readonly confluenceState?: "SUPPORTIVE" | "NEUTRAL" | "ADVERSE" | "INDETERMINATE";
  readonly redundancyState?:
    | "NOT_TESTED"
    | "CONTROLLED_FOR_RESEARCH"
    | "REDUNDANCY_WARNING"
    | "REJECTED_REDUNDANT";
  readonly rankingEligible?: boolean;
  readonly normalizedValue: number | null;
  readonly confidence: number | null;
  readonly falsificationTag?: string;
  readonly qualityFlags: readonly string[];
}

export type RegimeLabel =
  | "RISK_ON"
  | "RISK_OFF"
  | "LARGE_CAP_LED"
  | "SMALL_CAP_LED"
  | "TREND"
  | "RANGE"
  | "HIGH_VOLATILITY"
  | "LOW_VOLATILITY"
  | "SECTOR_ROTATION"
  | "PANIC"
  | "RECOVERY"
  | "UNKNOWN";

export interface MarketRegimeSnapshot {
  readonly regimeSnapshotId: string;
  readonly marketDate: string;
  readonly decisionTimestamp: string;
  readonly labels: readonly RegimeLabel[];
  readonly taiwanIndexState: ObservationState;
  readonly breadthState: ObservationState;
  readonly liquidityState: ObservationState;
  readonly volatilityState: ObservationState;
  readonly leadershipState: ObservationState;
  readonly sectorRotationState: ObservationState;
  readonly globalMacroState: ObservationState;
  readonly factorRefs: readonly string[];
  readonly warnings: readonly string[];
}

export interface StrategyFactorRequirement {
  readonly factorId: string;
  readonly factorVersion: string;
  readonly role: FactorRole;
  readonly weight?: number;
  readonly minimumNormalizedValue?: number;
  readonly maximumNormalizedValue?: number;
}

export interface StrategyDefinition {
  readonly strategyId: string;
  readonly strategyVersion: string;
  readonly name: string;
  readonly status: "DRAFT" | "SHADOW" | "CANDIDATE" | "LIVE" | "RETIRED";
  readonly primaryHorizonSessions: readonly number[];
  readonly factors: readonly StrategyFactorRequirement[];
  readonly interactionIds: readonly string[];
  readonly allowedRegimes: readonly RegimeLabel[];
  readonly blockedRegimes: readonly RegimeLabel[];
  readonly hardExclusionIds: readonly string[];
  readonly maxHoldingSessions?: number;
  readonly parentVersion?: string;
  readonly changeReason: string;
}


export type EvidenceFamily =
  | "MARKET_REGIME"
  | "INDUSTRY_THESIS"
  | "FUNDAMENTAL_QUALITY"
  | "VALUATION"
  | "EVENT_CATALYST"
  | "TECHNICAL_STRUCTURE"
  | "PRICE_VOLUME"
  | "CHIP_OWNERSHIP"
  | "CAPITAL_FLOW"
  | "RISK_FRICTION";

export type EvidenceRole =
  | "PRIMARY"
  | "REQUIRED"
  | "SUPPORTIVE"
  | "CONTEXT_ONLY"
  | "HARD_INVALIDATION"
  | "WARNING";

export type DataReadinessState =
  | "READY_CURRENT"
  | "DERIVABLE_CURRENT"
  | "PIT_AUDIT_REQUIRED"
  | "SOURCE_EXTENSION_REQUIRED"
  | "SEMANTIC_GAP"
  | "NOT_APPLICABLE";

export type StrategyValidityState =
  | "VALID"
  | "WEAKENING"
  | "INVALIDATED"
  | "INCOMPLETE";

export type EntryReadinessState =
  | "WATCH"
  | "NEAR_ENTRY"
  | "ACTIVE_ENTRY_MONITOR"
  | "BUY_ELIGIBLE"
  | "WAIT"
  | "TOO_EXTENDED"
  | "CONFLICT"
  | "BLOCKED";

export interface StrategyEvidenceFamilyRequirement {
  readonly family: EvidenceFamily;
  readonly role: EvidenceRole;
  readonly factorIds: readonly string[];
  readonly dataReadiness: DataReadinessState;
  readonly unknownBlocksEligibility: boolean;
  readonly notes?: string;
}

export interface StrategySetupContract {
  readonly setupId: string;
  readonly setupVersion: string;
  readonly thesisMechanism: string;
  readonly requiredFamilies: readonly EvidenceFamily[];
  readonly supportiveFamilies: readonly EvidenceFamily[];
  readonly contextFamilies: readonly EvidenceFamily[];
  readonly hardInvalidationIds: readonly string[];
  readonly entryReadinessInputs: readonly string[];
  readonly intradayRole: "HIGH" | "MEDIUM" | "LOW" | "NONE";
  readonly expectedHorizonSessions: readonly number[];
  readonly addActionFamilies: readonly string[];
  readonly reduceActionFamilies: readonly string[];
  readonly exitActionFamilies: readonly string[];
}

export interface StrategyContract {
  readonly strategyId: string;
  readonly strategyVersion: string;
  readonly ownerApprovalState: "OWNER_APPROVED" | "RESEARCH_ONLY_APPROVED" | "OWNER_REVIEW_PENDING" | "RESEARCH_LANE";
  readonly thesis: string;
  readonly primaryHorizonSessions: readonly number[];
  readonly evidenceFamilies: readonly StrategyEvidenceFamilyRequirement[];
  readonly setups: readonly StrategySetupContract[];
  readonly allowedRegimes: readonly RegimeLabel[];
  readonly blockedRegimes: readonly RegimeLabel[];
  readonly hardInvalidationIds: readonly string[];
  readonly interactionIds: readonly string[];
  readonly versionChangeTriggers: readonly string[];
  readonly notes: readonly string[];
}

export type DecisionState =
  | "SELECTED"
  | "QUALIFIED_NOT_SELECTED"
  | "REJECTED"
  | "INCOMPLETE"
  | "WATCH";

export interface StrategyEvaluation {
  readonly decisionId: string;
  readonly marketDate: string;
  readonly decisionTimestamp: string;
  readonly strategyId: string;
  readonly strategyVersion: string;
  readonly symbol: string;
  readonly companyName?: string;
  readonly state: DecisionState;
  readonly rank: number | null;
  readonly totalScore: number | null;
  readonly factorRefs: readonly string[];
  readonly interactionRefs: readonly string[];
  readonly regimeSnapshotId: string;
  readonly reasons: readonly string[];
  readonly warnings: readonly string[];
  readonly missingRequiredFactors: readonly string[];
  readonly thesis?: string;
  readonly invalidationConditions: readonly string[];
  readonly strategyValidity?: StrategyValidityState;
  readonly entryReadiness?: EntryReadinessState;
  readonly sourceReadiness?: "SOURCE_READY" | "SOURCE_LIMITED" | "SOURCE_BLOCKED";
  readonly shadowSpecId?: string;
  readonly evaluationMode?: "LIMITED_PROSPECTIVE_SHADOW" | "FULL_SHADOW" | "RESEARCH_REPLAY";
  readonly decisionHash: string;
}

export interface EntryPlan {
  readonly entryZoneLow: number | null;
  readonly entryZoneHigh: number | null;
  readonly triggerPrice: number | null;
  readonly stopPrice: number | null;
  readonly targets: readonly number[];
  readonly maxHoldingSessions: number | null;
}

export interface FrozenDecisionSnapshot {
  readonly evaluation: StrategyEvaluation;
  readonly entryPlan: EntryPlan;
  readonly factorObservations: readonly FactorObservation[];
  readonly interactionObservations: readonly InteractionObservation[];
  readonly regime: MarketRegimeSnapshot;
  readonly frozenAt: string;
  readonly schemaVersion: "S2_DECISION_V0_1";
}
