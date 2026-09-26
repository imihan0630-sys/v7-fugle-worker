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
  readonly marketDate: string;
  readonly decisionTimestamp: string;
  readonly componentFactorRefs: readonly {
    readonly factorId: string;
    readonly factorVersion: string;
    readonly state: ObservationState;
  }[];
  readonly state: ObservationState;
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
