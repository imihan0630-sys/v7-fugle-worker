import assert from 'node:assert/strict';
import fs from 'node:fs';

const receipt = JSON.parse(fs.readFileSync(
  new URL('./technical_indicator_official_source_capability_pilot_20260930.json', import.meta.url),
  'utf8',
));

let assertions = 0;
const check = (condition, message) => {
  assert.ok(condition, message);
  assertions += 1;
};

check(receipt.scope === 'OUTCOME_BLIND_PUBLIC_OFFICIAL_SOURCE_ONLY', 'scope must stay outcome blind');
check(receipt.formalCoreImpact === 'NONE_LOCKED', 'Formal Core must remain locked');
check(receipt.outcomeDataInspected === false, 'outcomes must not be inspected');

const twsePolls = receipt.sources.twseCurrentOpenApi.polls;
const tpexPolls = receipt.sources.tpexCurrentOpenApi.polls;
check(twsePolls.length === 2, 'TWSE needs two bounded polls');
check(twsePolls[0].sha256 === twsePolls[1].sha256, 'TWSE polls must be byte-identical');
check(tpexPolls.length === 2, 'TPEx needs two bounded polls');
check(tpexPolls[0].sha256 === tpexPolls[1].sha256, 'TPEx polls must be byte-identical');

const twseLatestHistorical = receipt.sources.twseHistoricalReport.captures.at(-1).requestedTradeDate;
check(
  twsePolls[0].rowDates[0] !== twseLatestHistorical,
  'current endpoint freshness cannot be inferred from retrieval time',
);
check(twsePolls[0].rowDates[0] === '2026-09-24', 'TWSE current witness date changed unexpectedly');
check(twseLatestHistorical === '2026-09-29', 'TWSE historical witness date changed unexpectedly');

const twseParity = receipt.sameDateCrossContractComparisons.twse20260924;
check(twseParity.leftRows === twseParity.rightRows, 'TWSE same-date row counts must match');
check(
  twseParity.exactRawOhlc
    + twseParity.formattingOnlyNumericEquivalent
    + twseParity.jointlyNoPriceDifferentMissingMarkers
    === twseParity.sharedSymbols,
  'TWSE parity categories must reconcile to the shared keyset',
);
check(twseParity.actualNumericOhlcConflicts === 0, 'TWSE numeric conflicts appeared');
check(twseParity.jointlyNoPriceDifferentMissingMarkers === 16, 'missing-marker witness count changed');

const tpexParity = receipt.sameDateCrossContractComparisons.tpex20260929;
check(tpexParity.leftRows === tpexParity.rightRows, 'TPEx same-date row counts must match');
check(tpexParity.exactRawOhlc === tpexParity.sharedSymbols, 'TPEx same-date raw OHLC parity failed');
check(tpexParity.actualNumericOhlcConflicts === 0, 'TPEx numeric conflicts appeared');

const capability = receipt.receiptCapabilityMatrix;
check(capability.rawPayloadBytesCapturedLocally === true, 'raw payload capture evidence missing');
check(capability.providerRowVersionVisible === false, 'provider row version must remain absent');
check(capability.providerFirstKnownAtPerRowVisible === false, 'per-row first-known clock must remain absent');
check(capability.independentAttestationOfD03RawDigestAvailable === false, 'D03 must not self-attest');
check(capability.certifiedSymbolSessionReceiptAvailable === false, 'session receipt must remain UNKNOWN');
check(capability.corporateActionTransformAncestryAvailable === false, 'CA ancestry must remain UNKNOWN');
check(capability.immutableParentDecisionGenerationAvailable === false, 'parent generation must remain UNKNOWN');

const classification = receipt.classification;
check(classification.observedRevisionCountInShortPollWindow === 0, 'short-window change count changed');
check(classification.revisionIncidence === 'UNKNOWN', 'short stability cannot prove revision incidence zero');
check(classification.legitimateCorrectionFalseBlockRate === 'UNKNOWN', 'false-block rate cannot be fabricated');
check(classification.formalOptimizationCandidate === 'NONE', 'source QA cannot promote a Formal candidate');
check(receipt.sources.fugle.captureAttempted === false, 'Fugle capture must not be claimed without access');
check(receipt.maturityDecision.previousPct === receipt.maturityDecision.newPct, 'maturity must not rise');
check(receipt.exactNextContinuationPoint.length === 5, 'exact continuation must remain explicit');

console.log(JSON.stringify({
  ok: true,
  assertions,
  schemaVersion: receipt.schemaVersion,
  scope: receipt.scope,
  formalCoreImpact: receipt.formalCoreImpact,
}));
