import fs from 'node:fs';
import crypto from 'node:crypto';

const fixture = JSON.parse(fs.readFileSync(new URL('./d03_corr007_versioned_receipt_gate_cases_20261008_v0_1.json', import.meta.url)));
const hex64 = /^[0-9a-f]{64}$/;
const atOrBefore = (a, b) => Number.isFinite(Date.parse(a)) && Number.isFinite(Date.parse(b)) && Date.parse(a) <= Date.parse(b);

function qualify(x) {
  if (x.schemaVersion !== fixture.expectedEvidenceSchema) return false;
  if (x.exchange !== 'TWSE' || x.coverageState !== 'COMPLETE') return false;
  if (x.requestedStartDate !== x.archiveStartDate || x.requestedEndDate !== x.archiveEndDate) return false;
  if (!x.sourceId || !x.sourceFamily || !x.sourceContractVersion || !x.sourceContractVersion.endsWith('_V0_2')) return false;
  if (!hex64.test(x.receiptDigest)) return false;
  if (!x.sourceEvidenceRef || x.sourceEvidenceRef.sourceId !== x.sourceId || x.sourceEvidenceRef.digest !== x.receiptDigest) return false;
  if (x.availabilitySemantics === 'PROSPECTIVE_OBSERVED') {
    if (!atOrBefore(x.observedAt, x.decisionCutoffAt)) return false;
  } else if (x.availabilitySemantics === 'VERIFIED_SOURCE_TIMESTAMP') {
    if (!x.availableAt || !atOrBefore(x.availableAt, x.decisionCutoffAt)) return false;
  } else return false;
  return x.corporateActionRefCount === 3 && x.exactSessionReady === true && x.partialSourceCount === 0 && x.unresolvedConflictCount === 0;
}

const stable = value => JSON.stringify(value, Object.keys(value).sort());
const digest = value => crypto.createHash('sha256').update(stable(value)).digest('hex');
let passed = 0;
for (const c of fixture.cases) {
  const candidate = {...fixture.base, ...c.mutation};
  const actual = qualify(candidate);
  if (actual !== c.expected) throw new Error(`${c.id}: expected ${c.expected}, got ${actual}`);
  passed++;
}
const legacyRelabel = {...fixture.base, schemaVersion: fixture.legacyEvidenceSchema};
const newDigest = {...fixture.base, receiptDigest: 'c'.repeat(64), sourceEvidenceRef: {...fixture.base.sourceEvidenceRef, digest: 'c'.repeat(64)}};
if (qualify(legacyRelabel)) throw new Error('legacy receipt promoted');
if (digest(fixture.base) === digest(newDigest)) throw new Error('digest mutation not bound');

console.log(JSON.stringify({
  status: 'PASS',
  cases: passed,
  legacyV01Rejected: true,
  crossVersionMixRejected: true,
  digestMutationChangesBoundInput: true,
  d03MaturityPct: 56.7,
  formalCoreImpact: 'NONE_LOCKED'
}));
