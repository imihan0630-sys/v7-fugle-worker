import fs from 'node:fs';
import assert from 'node:assert/strict';

const cases = JSON.parse(fs.readFileSync(new URL('./d03_dest_count_readback_indicator_replay_cases_20261015_v0_1.json', import.meta.url), 'utf8')).cases;

function assess(i) {
  if (Number.isFinite(i.rowsWritten) && i.rowsWritten !== 0) return {status:'REJECT', reason:'READBACK_NOT_READ_ONLY'};
  if (Number.isFinite(i.producerBars) && Number.isFinite(i.readbackBars) && i.producerBars !== i.readbackBars) return {status:'REJECT', reason:'BAR_COUNT_MISMATCH'};
  if (Number.isFinite(i.producerBatches) && Number.isFinite(i.readbackBatches) && i.producerBatches !== i.readbackBatches) return {status:'REJECT', reason:'BATCH_COUNT_MISMATCH'};
  if (i.zipHashMatch && !i.independentPayloadParity) return {status:'REPLAY_BLOCKED', reason:'PAYLOAD_PARITY_MISSING'};
  if (i.producerHashParityReported && !i.independentPayloadParity) return {status:'REPLAY_BLOCKED', reason:'INDEPENDENT_PAYLOAD_PARITY_MISSING'};
  if (i.independentPayloadParity && i.sourcePitClocksAccepted === false) return {status:'REPLAY_BLOCKED', reason:'SOURCE_PIT_CLOCKS_MISSING'};
  if (i.destinationPersistedAtOnly) return {status:'REPLAY_BLOCKED', reason:'DESTINATION_CLOCK_CANNOT_REPLACE_SOURCE_CLOCK'};
  if (i.perSymbolSessionCoverage === false) return {status:'REPLAY_BLOCKED', reason:'PER_SYMBOL_SESSION_COVERAGE_MISSING'};
  if (i.bollingerRequested && (i.exactCleanSessions ?? 0) < 20) return {status:'REPLAY_BLOCKED', reason:'BOLLINGER_EXACT_20_MISSING'};
  if (i.bollingerRequested && i.exactCleanSessions >= 20 && i.continuityAccepted === false) return {status:'REPLAY_BLOCKED', reason:'CONTINUITY_LINEAGE_MISSING'};
  if (i.adxRequested && !i.adxReplayCertified) return {status:'REPLAY_BLOCKED', reason:'ADX_REPLAY_STATE_MISSING'};
  if (i.batchMetadataComplete && !i.allBatchPayloadClosed) return {status:'REPLAY_BLOCKED', reason:'BATCH_PAYLOAD_CLOSURE_MISSING'};
  if (i.frozenRowsObserved === 0 && !i.frozenHistoryAccepted) return {status:'REPLAY_BLOCKED', reason:'FROZEN_HISTORY_NOT_ACCEPTED'};
  if (i.migrationOrderPreregistered === false) return {status:'INFERENCE_BLOCKED', reason:'MIGRATION_SELECTION_ORDER_UNKNOWN'};
  if (i.oosEvidence === false) return {status:'INFERENCE_BLOCKED', reason:'OOS_EVIDENCE_MISSING'};
  if (i.walkForwardEvidence === false) return {status:'INFERENCE_BLOCKED', reason:'WALK_FORWARD_EVIDENCE_MISSING'};
  if (i.tradingCostEvidence === false || i.fillabilityEvidence === false) return {status:'INFERENCE_BLOCKED', reason:'TRADING_COST_FILLABILITY_MISSING'};
  if (i.marketStateValidated === false || i.corporateActionResolved === false) return {status:'INFERENCE_BLOCKED', reason:'MARKET_STATE_ACTION_CONTAMINATION_UNKNOWN'};
  const strictReady = i.producerBars === 84688 && i.readbackBars === 84688 && i.producerBatches === 129 && i.readbackBatches === 129 && i.rowsWritten === 0 && i.independentPayloadParity && i.sourcePitClocksAccepted && i.perSymbolSessionCoverage && i.continuityAccepted && i.parentBindingAccepted;
  if (strictReady) return {status:'INDICATOR_INPUT_READY_OUTCOMES_CLOSED', reason:'INPUT_GATE_ONLY'};
  return {status:'COUNT_READBACK_PASS_REPLAY_BLOCKED', reason:'COUNT_SCOPE_ONLY'};
}

for (const c of cases) assert.deepEqual(assess(c.input), c.expected, c.id);
console.log(`PASS ${cases.length}/${cases.length}`);
