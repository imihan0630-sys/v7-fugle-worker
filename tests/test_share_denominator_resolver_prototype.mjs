import assert from "node:assert/strict";
import { resolvePointInTimeDenominator } from "../research/share_denominator_resolver_prototype.mjs";

const V=(denominatorType,valueShares,effectiveFromSession,knownAt,extra={})=>({
  denominatorType,valueShares,effectiveFromSession,knownAt,quality:"VERIFIED",...extra
});
const B=(denominatorType,effectiveFromSession,knownAt,extra={})=>({
  denominatorType,effectiveFromSession,knownAt,quality:"VERIFIED",...extra
});

// 8454 registered issued shares: the exact official counts must follow registration vintage.
{
  const versions=[
    V("REGISTERED_ISSUED_SHARES",252357405,"2024-09-19","2024-09-19",{sourceRecordId:"8454:pre"}),
    V("REGISTERED_ISSUED_SHARES",264975275,"2025-09-22","2025-09-22",{sourceRecordId:"8454:post"})
  ];
  const before=resolvePointInTimeDenominator({
    versions,denominatorType:"REGISTERED_ISSUED_SHARES",
    targetSession:"2025-09-19",replayAsOf:"2025-09-19"
  });
  const after=resolvePointInTimeDenominator({
    versions,denominatorType:"REGISTERED_ISSUED_SHARES",
    targetSession:"2025-09-23",replayAsOf:"2025-09-23"
  });
  assert.equal(before.valueShares,252357405);
  assert.equal(after.valueShares,264975275);
}

// 8454 listed shares: registration does NOT switch the trading-supply denominator;
// the exchange-listed denominator changes only on the 2025-10-09 listing session.
{
  const versions=[
    V("EXCHANGE_LISTED_SHARES",252357405,"2024-09-19","2024-09-19",{sourceRecordId:"8454:list-pre"}),
    V("EXCHANGE_LISTED_SHARES",264975275,"2025-10-09","2025-09-22",{sourceRecordId:"8454:list-post"})
  ];
  const sep30=resolvePointInTimeDenominator({
    versions,denominatorType:"EXCHANGE_LISTED_SHARES",
    targetSession:"2025-09-30",replayAsOf:"2025-09-30"
  });
  const oct09=resolvePointInTimeDenominator({
    versions,denominatorType:"EXCHANGE_LISTED_SHARES",
    targetSession:"2025-10-09",replayAsOf:"2025-10-09"
  });
  assert.equal(sep30.valueShares,252357405);
  assert.equal(oct09.valueShares,264975275);
}

// Known supply break with missing post-break denominator must fail closed;
// keeping the old denominator would silently normalize with stale supply.
{
  const versions=[
    V("EXCHANGE_LISTED_SHARES",252357405,"2024-09-19","2024-09-19")
  ];
  const breaks=[
    B("EXCHANGE_LISTED_SHARES","2025-10-09","2025-09-22",{eventKey:"8454:2025-10-09:NEW_SHARES_LISTED"})
  ];
  const out=resolvePointInTimeDenominator({
    versions,breaks,denominatorType:"EXCHANGE_LISTED_SHARES",
    targetSession:"2025-10-09",replayAsOf:"2025-10-09"
  });
  assert.equal(out.ready,false);
  assert.equal(out.reason,"DENOMINATOR_STALE_ACROSS_VERIFIED_BREAK");
}

// Exact semantic space is mandatory: registered shares cannot be silently substituted
// for exchange-listed shares.
{
  const versions=[
    V("REGISTERED_ISSUED_SHARES",264975275,"2025-09-22","2025-09-22")
  ];
  const out=resolvePointInTimeDenominator({
    versions,denominatorType:"EXCHANGE_LISTED_SHARES",
    targetSession:"2025-10-09",replayAsOf:"2025-10-09"
  });
  assert.equal(out.ready,false);
  assert.equal(out.reason,"DENOMINATOR_UNKNOWN_AT_REPLAY_ASOF");
}

// 8422 par-value change: registration completed 2025-08-21, but the trading unit
// remains the old NT$10 share until 2025-11-05 and switches to the new NT$1 share
// only when new shares list on 2025-11-17.
{
  const versions=[
    V("EXCHANGE_LISTED_SHARES",113679605,"2025-01-01","2025-01-01",{sourceRecordId:"8422:old-unit"}),
    V("EXCHANGE_LISTED_SHARES",1136796050,"2025-11-17","2025-10-16",{sourceRecordId:"8422:new-unit"})
  ];
  const lastOld=resolvePointInTimeDenominator({
    versions,denominatorType:"EXCHANGE_LISTED_SHARES",
    targetSession:"2025-11-05",replayAsOf:"2025-11-05"
  });
  const resumed=resolvePointInTimeDenominator({
    versions,denominatorType:"EXCHANGE_LISTED_SHARES",
    targetSession:"2025-11-17",replayAsOf:"2025-11-17"
  });
  assert.equal(lastOld.valueShares,113679605);
  assert.equal(resumed.valueShares,1136796050);
}

// 3593 capital reduction: a later registration date must not be mistaken for the
// trading-unit switch; reduced shares enter the exchange denominator on 2025-12-22.
{
  const versions=[
    V("EXCHANGE_LISTED_SHARES",93042416,"2025-01-01","2025-01-01",{sourceRecordId:"3593:pre"}),
    V("EXCHANGE_LISTED_SHARES",55825449,"2025-12-22","2025-11-17",{sourceRecordId:"3593:post"})
  ];
  const dec10=resolvePointInTimeDenominator({
    versions,denominatorType:"EXCHANGE_LISTED_SHARES",
    targetSession:"2025-12-10",replayAsOf:"2025-12-10"
  });
  const dec22=resolvePointInTimeDenominator({
    versions,denominatorType:"EXCHANGE_LISTED_SHARES",
    targetSession:"2025-12-22",replayAsOf:"2025-12-22"
  });
  assert.equal(dec10.valueShares,93042416);
  assert.equal(dec22.valueShares,55825449);
}

// A later current snapshot cannot leak into an earlier replay even if it claims an
// earlier effective date. knownAt is a hard point-in-time boundary.
{
  const versions=[
    V("REGISTERED_ISSUED_SHARES",100000000,"2025-01-01","2025-01-01"),
    V("REGISTERED_ISSUED_SHARES",120000000,"2025-07-01","2026-01-15")
  ];
  const out=resolvePointInTimeDenominator({
    versions,denominatorType:"REGISTERED_ISSUED_SHARES",
    targetSession:"2025-09-01",replayAsOf:"2025-09-01"
  });
  assert.equal(out.valueShares,100000000);
}

// Revision chains are replay-vintage aware. Before the correction is known, the old
// version is valid; after supersession, the correction replaces it.
{
  const versions=[
    V("REGISTERED_ISSUED_SHARES",100000000,"2025-07-01","2025-07-02",{
      sourceRecordId:"orig",supersededAt:"2025-07-10"
    }),
    V("REGISTERED_ISSUED_SHARES",100000005,"2025-07-01","2025-07-10",{
      sourceRecordId:"corr",revisionOf:"orig"
    })
  ];
  const before=resolvePointInTimeDenominator({
    versions,denominatorType:"REGISTERED_ISSUED_SHARES",
    targetSession:"2025-07-08",replayAsOf:"2025-07-08"
  });
  const after=resolvePointInTimeDenominator({
    versions,denominatorType:"REGISTERED_ISSUED_SHARES",
    targetSession:"2025-07-11",replayAsOf:"2025-07-11"
  });
  assert.equal(before.valueShares,100000000);
  assert.equal(after.valueShares,100000005);
}

// Unreconciled same-vintage conflicts fail closed.
{
  const versions=[
    V("REGISTERED_ISSUED_SHARES",100,"2025-01-01","2025-01-01"),
    V("REGISTERED_ISSUED_SHARES",101,"2025-01-01","2025-01-01")
  ];
  const out=resolvePointInTimeDenominator({
    versions,denominatorType:"REGISTERED_ISSUED_SHARES",
    targetSession:"2025-02-01",replayAsOf:"2025-02-01"
  });
  assert.equal(out.ready,false);
  assert.equal(out.reason,"DENOMINATOR_CONFLICT");
}

console.log("share denominator vintage tests passed");
