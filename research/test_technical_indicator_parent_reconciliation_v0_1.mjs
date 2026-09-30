import assert from 'node:assert/strict';

// Isolated outcome-blind fixture. No Worker, D1 or market input.
const valid = new Set(['READY','WARMUP_INCOMPLETE','DATA_BLOCKED','VALID_BUT_CONSTRAINED','UNKNOWN']);
const key = x => `${x.parentDecisionReceiptId}|${x.captureGeneration}`;

export function reconcile(parents, children, pages = [], populationReceipt = null) {
  if (populationReceipt && populationReceipt.expectedCount !== parents.length)
    return {state:'QA_FAIL',reason:'POPULATION_RECEIPT_MISMATCH'};
  if (!parents.length && !populationReceipt)
    return {state:'INCOMPLETE',reason:'MISSING_EMPTY_POPULATION_RECEIPT'};
  const parent = new Map(), child = new Map();
  for (const p of parents) {
    if (parent.has(key(p))) return {state:'QA_FAIL',reason:'DUPLICATE_PARENT'};
    parent.set(key(p),p);
  }
  for (const c of children) {
    if (child.has(key(c))) return {state:'QA_FAIL',reason:'DUPLICATE_CHILD'};
    if (!parent.has(key(c))) return {state:'QA_FAIL',reason:'ORPHAN_CHILD'};
    if (parent.get(key(c)).fingerprint !== c.parentFingerprint)
      return {state:'QA_FAIL',reason:'PARENT_FINGERPRINT_CONFLICT'};
    if (!valid.has(c.status)) return {state:'QA_FAIL',reason:'INVALID_STATUS'};
    child.set(key(c),c);
  }
  if (child.size !== parent.size)
    return {state:'INCOMPLETE',reason:'MISSING_CHILD',expected:parent.size,persisted:child.size};
  const seen = new Set();
  for (const page of pages) {
    if (page.truncated) return {state:'INCOMPLETE',reason:'TRUNCATED_READ'};
    for (const receipt of page.receipts) {
      if (seen.has(key(receipt))) return {state:'QA_FAIL',reason:'DUPLICATE_PAGE_KEY'};
      if (!parent.has(key(receipt))) return {state:'QA_FAIL',reason:'FOREIGN_PAGE_KEY'};
      seen.add(key(receipt));
    }
  }
  if (pages.length && seen.size !== parent.size)
    return {state:'INCOMPLETE',reason:'PARTIAL_DATE_READ'};
  const statusCounts = Object.fromEntries([...valid].map(s=>[s,0]));
  for (const c of child.values()) statusCounts[c.status]++;
  return {state:'COMPLETE',expected:parent.size,persisted:child.size,statusCounts};
}

export function immutableInsert(existing, incoming) {
  if (!existing) return {state:'INSERT',record:incoming};
  if (key(existing) !== key(incoming)) return {state:'DIFFERENT_IDENTITY'};
  if (existing.fingerprint !== incoming.fingerprint)
    return {state:'PROVENANCE_CONFLICT',record:existing};
  return {state:'IDEMPOTENT',record:existing};
}

const p = Array.from({length:1800},(_,i)=>({parentDecisionReceiptId:`r${i}`,captureGeneration:'g1',fingerprint:`h${i}`}));
const c = p.map((x,i)=>({...x,parentFingerprint:x.fingerprint,status:i<200?'UNKNOWN':'READY'}));
const run = (parents=p,children=c,pages=[])=>reconcile(parents,children,pages);
assert.deepEqual(run(p,c.slice(0,-1)),{state:'INCOMPLETE',reason:'MISSING_CHILD',expected:1800,persisted:1799});
assert.equal(run().state,'COMPLETE');
assert.equal(run().statusCounts.UNKNOWN,200);
assert.equal(run().statusCounts.READY,1600);
assert.equal(run(p,[...c,c[0]]).reason,'DUPLICATE_CHILD');
assert.equal(run(p,[...c.slice(1),{...c[0],parentDecisionReceiptId:'other'}]).reason,'ORPHAN_CHILD');
assert.equal(run(p,[{...c[0],parentFingerprint:'changed'},...c.slice(1)]).reason,'PARENT_FINGERPRINT_CONFLICT');
assert.equal(run(p,c,[{receipts:p.slice(0,1000)},{receipts:p.slice(1000,1700)}]).reason,'PARTIAL_DATE_READ');
assert.equal(run(p,c,[{receipts:p.slice(0,1000)},{receipts:p.slice(1000),truncated:true}]).reason,'TRUNCATED_READ');
assert.equal(run(p,c,[{receipts:p.slice(0,1000)},{receipts:p.slice(1000)}]).state,'COMPLETE');
assert.equal(run(p,c,[{receipts:p.slice(0,1000)},{receipts:[...p.slice(1000,1799),{...p[1799],captureGeneration:'g2'}]}]).reason,'FOREIGN_PAGE_KEY');
assert.equal(reconcile([],[]).reason,'MISSING_EMPTY_POPULATION_RECEIPT');
assert.equal(reconcile([],[],[],{expectedCount:0}).state,'COMPLETE');
assert.equal(reconcile(p,c,[],{expectedCount:1799}).reason,'POPULATION_RECEIPT_MISMATCH');
assert.equal(immutableInsert(p[0],{...p[0]}).state,'IDEMPOTENT');
assert.equal(immutableInsert(p[0],{...p[0],fingerprint:'changed'}).state,'PROVENANCE_CONFLICT');
assert.equal(immutableInsert(p[0],{...p[0],captureGeneration:'g2'}).state,'DIFFERENT_IDENTITY');
const memberships=[{parentDecisionReceiptId:'r0',cohort:'SELECTED'},{parentDecisionReceiptId:'r0',cohort:'INDEPENDENT_BROAD_CONTROL'}];
assert.equal(memberships.length,2);
assert.equal(run().expected,1800);
console.log('PASS: 19 outcome-blind shared-parent assertions');
