import { deepFreeze } from "./factor_snapshot.mjs";

export const ACTUAL_HOLDINGS_READ_MODEL_VERSION_V0_1 = "0.1-RESEARCH";

export function buildActualHoldingsReadModelV0_1({ snapshot = null } = {}) {
  const base = {
    schemaVersion: "S2_ACTUAL_HOLDINGS_READ_MODEL_V0_1",
    version: ACTUAL_HOLDINGS_READ_MODEL_VERSION_V0_1,
    sourceType: "USER_UPLOADED_BROKER_SCREENSHOT",
    brokerApiUsed: false,
    brokerApiAuthorized: false,
    realOrdersEnabled: false,
    liveCapitalAuthority: false,
    orderRoutingAuthorized: false,
    directBrokerAction: false,
    decisionOutputsOnly: true,
    boardSeparation: deepFreeze({
      actualHoldings: "ACTUAL_HOLDINGS",
      virtualPositions: "VIRTUAL_POSITIONS",
      candidates: "CANDIDATES",
      watchlist: "WATCHLIST",
      simulatedFills: "SIMULATED_FILLS",
      virtualPositionsMayBeRelabeledActual: false,
      simulatedFillsMayCreateActualOwnership: false,
    }),
  };

  if (!snapshot) {
    return deepFreeze({
      ...base,
      state: "NO_VERIFIED_ACTUAL_HOLDINGS_SNAPSHOT",
      snapshotId: null,
      sourceLabel: "USER_UPLOADED_BROKER_SCREENSHOT",
      lastVerifiedAt: null,
      effectiveAsOf: null,
      brokerName: null,
      accountAlias: null,
      holdingsCount: 0,
      holdings: deepFreeze([]),
      reconciliation: null,
      actualPositionMonitorVerified: false,
      actualHoldingsAvailable: false,
      reviewState: "NO_CONFIRMED_IMPORT",
    });
  }

  if (snapshot.snapshotState !== "CONFIRMED_ACTUAL_HOLDINGS" || snapshot.reviewState !== "CONFIRMED") {
    return deepFreeze({
      ...base,
      state: "ACTUAL_HOLDINGS_FAIL_CLOSED_UNVERIFIED_SNAPSHOT",
      snapshotId: snapshot.snapshotId || null,
      sourceLabel: snapshot.sourceType || "UNKNOWN",
      lastVerifiedAt: null,
      effectiveAsOf: snapshot.effectiveAsOf || null,
      brokerName: snapshot.brokerName || null,
      accountAlias: snapshot.accountAlias || null,
      holdingsCount: 0,
      holdings: deepFreeze([]),
      reconciliation: null,
      actualPositionMonitorVerified: false,
      actualHoldingsAvailable: false,
      reviewState: snapshot.reviewState || "UNKNOWN",
    });
  }

  const holdings = Array.isArray(snapshot.holdings) ? snapshot.holdings : [];
  return deepFreeze({
    ...base,
    state: "ACTUAL_HOLDINGS_SNAPSHOT_VERIFIED",
    snapshotId: snapshot.snapshotId,
    snapshotHash: snapshot.snapshotHash,
    sourceLabel: snapshot.sourceType,
    sourceImageSha256: snapshot.sourceImageSha256,
    lastVerifiedAt: snapshot.receivedAt,
    effectiveAsOf: snapshot.effectiveAsOf,
    brokerName: snapshot.brokerName || null,
    accountAlias: snapshot.accountAlias || null,
    holdingsCount: holdings.length,
    holdings: deepFreeze(holdings),
    reconciliation: snapshot.reconciliation || null,
    actualPositionMonitorVerified: true,
    actualHoldingsAvailable: true,
    reviewState: snapshot.reviewState,
    immutableSnapshot: snapshot.immutable === true,
    allowedDecisionOutputs: deepFreeze([
      "HOLD","ADD","RE-ADD","RESTORE","REDUCE","EXIT","WARNING",
    ]),
  });
}
