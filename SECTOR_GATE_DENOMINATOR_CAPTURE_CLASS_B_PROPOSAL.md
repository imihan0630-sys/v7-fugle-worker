# SECTOR_GATE — Prospective Denominator Receipt Proposal

Updated: 2026-09-27 Asia/Taipei  
Status: CLASS-B PROPOSAL ONLY / NOT IMPLEMENTED  
Formal Core: LOCKED

## Minimum same-generation receipt

Per scanDate x decisionGeneration x industry:
- industry identity/classification version;
- exact todayRows keyset/fingerprint;
- exact featureRows keyset/fingerprint;
- stockCount;
- advanceCount under deployed `(changePercent||0)>0`;
- changeObservedCount / changeMissingCount;
- deployed breadth;
- avgChange numerator/sum and finite denominator;
- activityReadyCount (`historyDays>=20`);
- avgAmount20 observed count;
- avgAmount20 positive count;
- coveredAmount;
- summed avgAmount20;
- deployed amountVs20DayAverage;
- exact gate pass bits.

Per candidate:
- symbol/pool;
- exact pre-sector Formal reach;
- candidate contributions to advance count, avgChange and activity amount/baseline;
- deployed inclusive sector values;
- optional leave-one-out diagnostic values clearly labeled research-only.

## Guards

- Do not substitute leave-one-out values for deployed Formal inputs.
- Do not treat missing changePercent as observed flat in evidence-quality reporting even though deployed breadth does.
- Do not infer zero missingness from absent counters.
- Parent and sector receipt must reconcile to the same generation.
- No outcomes in the selection-time parent.
- No threshold sweep.

## Engineering boundary

All required raw ingredients are already loaded during the scan; no extra market call is required.

Durable full-population storage/runtime wiring is Class B and requires owner approval.

Changing breadth/avgChange/activity definitions, self-inclusion, denominator membership or thresholds is Class C.

No implementation is performed here.
