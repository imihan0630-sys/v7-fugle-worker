import assert from "node:assert/strict";
import {diagnoseBoundedRevisionQueryIntegrityV0_4} from "../runtime/bounded_revision_query_integrity_v0_4.mjs";
const r=(d,t,s)=>({date:d,time:t,seqNo:s});
{
 const x=diagnoseBoundedRevisionQueryIntegrityV0_4({allSnapshots:[[r("2026-01-01","01:00:00","1")],[r("2026-01-01","01:00:00","1")]],monthRows:[r("2026-01-01","01:00:00","1")]});
 assert.equal(x.state,"EXACT_KEYSET_RECONCILIATION");
 assert.equal(x.queryIntegrityCertified,true);
}
{
 const x=diagnoseBoundedRevisionQueryIntegrityV0_4({allSnapshots:[[r("2026-01-01","01:00:00","1")],[r("2026-01-02","01:00:00","2")]],monthRows:[r("2026-01-01","01:00:00","1")]});
 assert.equal(x.state,"ALL_QUERY_NONDETERMINISTIC");
 assert.equal(x.queryIntegrityCertified,false);
}
{
 const x=diagnoseBoundedRevisionQueryIntegrityV0_4({allSnapshots:[[r("2026-01-01","01:00:00","1")],[r("2026-01-01","01:00:00","1")]],monthRows:[r("2026-01-01","01:00:00","1"),r("2026-01-02","01:00:00","2")]});
 assert.equal(x.state,"MONTH_SHARD_SUPERSET");
 assert.equal(x.onlyMonth.length,1);
}
{
 const x=diagnoseBoundedRevisionQueryIntegrityV0_4({allSnapshots:[[r("2026-01-01","01:00:00","1"),r("2026-01-02","01:00:00","2")],[r("2026-01-01","01:00:00","1"),r("2026-01-02","01:00:00","2")]],monthRows:[r("2026-01-01","01:00:00","1")]});
 assert.equal(x.state,"ALL_QUERY_SUPERSET");
 assert.equal(x.onlyAll.length,1);
}
console.log("bounded revision query integrity V0.4 tests PASS");
