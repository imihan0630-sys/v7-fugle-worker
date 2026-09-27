import assert from "node:assert/strict";
import {
  buildProspectiveCapturePlan,
  CAPTURE_STRATEGIES_V0_1,
} from "../runtime/prospective_capture_plan.mjs";

const plan = buildProspectiveCapturePlan({
  capturePlanId: "CP1",
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T08:15:00Z",
  universeVersion: "TW-EQUITY-V0",
  createdAt: "2026-09-27T08:16:00Z",
});

assert.equal(plan.mode, "AFTER_CLOSE_DECISION_CAPTURE");
assert.equal(plan.intradayEnabled, false);
assert.equal(plan.outcomeJoinEnabled, false);
assert.equal(plan.notificationsEnabled, false);
assert.equal(plan.historicalBackfillAllowed, false);
assert.equal(plan.exactCronFrozen, false);
assert.equal(plan.persistenceBinding, "SYSTEM2_DB");
assert.equal(plan.requiredSchemaVersion, "0.5");
assert.deepEqual(
  plan.strategies.map((x) => x.strategyId),
  ["SHORT_MOMENTUM", "SWING_GROWTH"],
);
assert.ok(
  CAPTURE_STRATEGIES_V0_1.SHORT_MOMENTUM.sources.some(
    (x) => x.sourceId === "A1_TW_DAILY_OHLCV_DERIVED" && x.role === "REQUIRED",
  ),
);
assert.ok(
  CAPTURE_STRATEGIES_V0_1.SWING_GROWTH.sources.some(
    (x) => x.sourceId === "B2_INDUSTRY_THESIS_PROSPECTIVE" && x.role === "REQUIRED",
  ),
);

assert.throws(
  () =>
    buildProspectiveCapturePlan({
      capturePlanId: "BAD",
      marketDate: "2026-09-27",
      decisionTimestamp: "2026-09-27T08:15:00Z",
      universeVersion: "TW-EQUITY-V0",
      strategyIds: ["EVENT_DRIVEN"],
      createdAt: "2026-09-27T08:16:00Z",
    }),
  /not activated/,
);

console.log("System2 prospective capture plan tests passed");
