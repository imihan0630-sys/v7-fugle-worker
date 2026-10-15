import fs from 'node:fs';
import assert from 'node:assert/strict';

const cases = JSON.parse(fs.readFileSync(new URL('./d03_source_linked_identity_digest_full_payload_cases_20261015_v0_1.json', import.meta.url), 'utf8')).cases;

function assess(i) {
  if (Number.isFinite(i.rowsWritten) && i.rowsWritten !== 0) return {status:'REJECT', reason:'READBACK_NOT_READ_ONLY'};
  if (Number.isFinite(i.rows) && Number.isFinite(i.expectedRows) && i.rows !== i.expectedRows) return {status:'REJECT', reason:'ROW_COUNT_MISMATCH'};
  if (i.digestMatch === false) return {status:'REJECT', reason:'SOURCE_LINKED_DIGEST_MISMATCH'};
  if (i.identityVectorPass && i.rawPayloadRehashed === false) return {status:'REPLAY_BLOCKED', reason:'RAW_PAYLOAD_REHASH_MISSING'};
  if (i.rawPayloadRehashed && i.hashSchemaComplete === false) return {status:'REPLAY_BLOCKED', reason:'HASH_SCHEMA_COMPLETENESS_MISSING'};
  if (i.rawPayloadRehashed && i.hashSchemaComplete && i.sourcePitClocksAccepted === false) return {status:'REPLAY_BLOCKED', reason:'SOURCE_PIT_CLOCKS_MISSING'};
  if (i.destinationPersistedAtOnly) return {status:'REPLAY_BLOCKED', reason:'DESTINATION_CLOCK_LAUNDERING'};
  if (i.batchMetadataRows === 129 && !i.batchPayloadClosed) return {status:'REPLAY_BLOCKED', reason:'BATCH_PAYLOAD_CLOSURE_MISSING'};
  if (i.frozenRowsObserved === 0 && !i.frozenHistoryAccepted) return {status:'REPLAY_BLOCKED', reason:'FROZEN_HISTORY_NOT_ACCEPTED'};
  if (i.perSymbolSessionCoverage === false) return {status:'REPLAY_BLOCKED', reason:'PER_SYMBOL_SESSION_COVERAGE_MISSING'};
  if (i.bollingerRequested && (i.exactCleanSessions ?? 0) < 20) return {status:'REPLAY_BLOCKED', reason:'BOLLINGER_EXACT_20_MISSING'};
  if (i.bollingerRequested && i.exactCleanSessions >= 20 && i.continuityAccepted === false) return {status:'REPLAY_BLOCKED', reason:'CONTINUITY_LINEAGE_MISSING'};
  if (i.adxRequested && !i.adxReplayCertified) return {status:'REPLAY_BLOCKED', reason:'ADX_REPLAY_STATE_MISSING'};
  if (i.migrationOrderPreregistered === false) return {status:'INFERENCE_BLOCKED', reason:'SELECTION_DATE_CLUSTER_UNKNOWN'};
  if (i.oosEvidence === false) return {status:'INFERENCE_BLOCKED', reason:'OOS_EVIDENCE_MISSING'};
  if (i.walkForwardEvidence === false) return {status:'INFERENCE_BLOCKED', reason:'WALK_FORWARD_EVIDENCE_MISSING'};
  if (i.tradingCostEvidence === false || i.fillabilityEvidence === false) return {status:'INFERENCE_BLOCKED', reason:'TRADING_COST_FILLABILITY_MISSING'};
  if (i.corporateActionResolved === false || i.marketStateValidated === false) return {status:'INFERENCE_BLOCKED', reason:'ACTION_MARKET_STATE_UNKNOWN'};
  const strictReady = i.rows === 84688 && i.expectedRows === 84688 && i.digestMatch && i.rowsWritten === 0 && i.identityVectorPass && i.rawPayloadRehashed && i.hashSchemaComplete && i.sourcePitClocksAccepted && i.batchPayloadClosed && i.frozenHistoryAccepted && i.perSymbolSessionCoverage && i.continuityAccepted && i.parentBindingAccepted;
  if (strictReady) return {status:'INDICATOR_INPUT_READY_OUTCOMES_CLOSED', reason:'INPUT_GATE_ONLY'};
  return {status:'IDENTITY_VECTOR_PASS_FULL_PAYLOAD_BLOCKED', reason:'FOUR_FIELD_SCOPE_ONLY'};
}

for (const c of cases) assert.deepEqual(assess(c.input), c.expected, c.id);
console.log(`PASS ${cases.length}/${cases.length}`);
