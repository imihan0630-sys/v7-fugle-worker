import assert from "node:assert/strict";
import { resolvePointInTimeLifecycle } from "../research/corporate_action_lifecycle_state_machine_prototype.mjs";

const E = ({
  actionFamilyId="SYN:2025:ACTION",
  stage="SUPPLY_CHANGE",
  eventVersion,
  effectiveSession,
  knownAt,
  quality="VERIFIED",
  ...extra
}) => ({
  actionFamilyId, stage, eventVersion, effectiveSession, knownAt, quality, ...extra
});

// Revision before the original effective date: after supersession, only the revised
// schedule is live. Before the correction is known, the original planned version
// remains the point-in-time truth.
{
  const events=[
    E({
      eventVersion:"v1",
      effectiveSession:"2025-07-01",
      knownAt:"2025-06-01T09:00:00+08:00",
      supersededAt:"2025-06-20T09:00:00+08:00",
      denominatorValue:110
    }),
    E({
      eventVersion:"v2",
      effectiveSession:"2025-07-15",
      knownAt:"2025-06-20T09:00:00+08:00",
      denominatorValue:110
    })
  ];

  const before=resolvePointInTimeLifecycle({
    events,targetSession:"2025-07-01",
    replayAsOf:"2025-06-10T23:59:59+08:00",
    coverageComplete:true
  });
  assert.equal(before.status,"READY");
  assert.equal(before.realizedEvents[0].eventVersion,"v1");

  const after=resolvePointInTimeLifecycle({
    events,targetSession:"2025-07-15",
    replayAsOf:"2025-07-15T23:59:59+08:00",
    coverageComplete:true
  });
  assert.equal(after.status,"READY");
  assert.equal(after.realizedEvents.length,1);
  assert.equal(after.realizedEvents[0].eventVersion,"v2");
  assert.equal(after.realizedEvents[0].effectiveSession,"2025-07-15");
}

// Late correction after effective date: historical replay before correction must keep
// v1; replay after correction may use v2. This is the anti-retro-leakage contract.
{
  const events=[
    E({
      eventVersion:"v1",
      effectiveSession:"2025-07-01",
      knownAt:"2025-06-20T10:00:00+08:00",
      supersededAt:"2025-07-10T10:00:00+08:00",
      denominatorValue:100
    }),
    E({
      eventVersion:"v2-correction",
      effectiveSession:"2025-07-01",
      knownAt:"2025-07-10T10:00:00+08:00",
      denominatorValue:105
    })
  ];

  const before=resolvePointInTimeLifecycle({
    events,targetSession:"2025-07-08",
    replayAsOf:"2025-07-08T23:59:59+08:00",
    coverageComplete:true
  });
  assert.equal(before.realizedEvents[0].eventVersion,"v1");
  assert.equal(before.realizedEvents[0].denominatorValue,100);

  const after=resolvePointInTimeLifecycle({
    events,targetSession:"2025-07-11",
    replayAsOf:"2025-07-11T23:59:59+08:00",
    coverageComplete:true
  });
  assert.equal(after.realizedEvents[0].eventVersion,"v2-correction");
  assert.equal(after.realizedEvents[0].denominatorValue,105);
}

// Cancellation known before the planned effective date means the event never
// becomes realized. Complete coverage permits NO_EVENT.
{
  const out=resolvePointInTimeLifecycle({
    events:[E({
      eventVersion:"planned-v1",
      effectiveSession:"2025-08-01",
      knownAt:"2025-07-01T09:00:00+08:00",
      cancelledAt:"2025-07-20T15:00:00+08:00",
      denominatorValue:120
    })],
    targetSession:"2025-08-05",
    replayAsOf:"2025-08-05T23:59:59+08:00",
    coverageComplete:true
  });
  assert.equal(out.ready,true);
  assert.equal(out.status,"NO_EVENT");
  assert.equal(out.realizedEvents.length,0);
}

// A cancellation learned after an already-effective event does not erase the
// historical realized stage. This is a negative control against retroactive deletion.
{
  const out=resolvePointInTimeLifecycle({
    events:[E({
      eventVersion:"realized-v1",
      effectiveSession:"2025-08-01",
      knownAt:"2025-07-01T09:00:00+08:00",
      cancelledAt:"2025-08-05T15:00:00+08:00",
      denominatorValue:120
    })],
    targetSession:"2025-08-06",
    replayAsOf:"2025-08-06T23:59:59+08:00",
    coverageComplete:true
  });
  assert.equal(out.status,"READY");
  assert.equal(out.realizedEvents.length,1);
}

// Same-session UNIT_SCALE and SUPPLY_CHANGE are separate stages. Input order must
// not control transform order.
{
  const unit=E({
    actionFamilyId:"SYN:2025:PAR",
    stage:"UNIT_SCALE",
    eventVersion:"unit-v1",
    effectiveSession:"2025-09-01",
    knownAt:"2025-08-01T09:00:00+08:00",
    shareUnitFactor:10
  });
  const supply=E({
    actionFamilyId:"SYN:2025:PAR",
    stage:"SUPPLY_CHANGE",
    eventVersion:"supply-v1",
    effectiveSession:"2025-09-01",
    knownAt:"2025-08-01T09:00:00+08:00",
    denominatorType:"EXCHANGE_LISTED_SHARES",
    denominatorValue:1000000000
  });
  const a=resolvePointInTimeLifecycle({
    events:[supply,unit],targetSession:"2025-09-01",
    replayAsOf:"2025-09-01T23:59:59+08:00",coverageComplete:true
  });
  const b=resolvePointInTimeLifecycle({
    events:[unit,supply],targetSession:"2025-09-01",
    replayAsOf:"2025-09-01T23:59:59+08:00",coverageComplete:true
  });
  assert.deepEqual(
    a.realizedEvents.map(x=>x.stage),
    ["UNIT_SCALE","SUPPLY_CHANGE"]
  );
  assert.deepEqual(
    a.realizedEvents.map(x=>x.stage),
    b.realizedEvents.map(x=>x.stage)
  );
}

// Unreconciled active primary semantic disagreement fails closed; no latest-wins.
{
  const out=resolvePointInTimeLifecycle({
    events:[
      E({
        eventVersion:"source-a",
        effectiveSession:"2025-10-01",
        knownAt:"2025-09-01T09:00:00+08:00",
        sourceRecordId:"A",
        denominatorValue:100
      }),
      E({
        eventVersion:"source-b",
        effectiveSession:"2025-10-01",
        knownAt:"2025-09-01T09:00:00+08:00",
        sourceRecordId:"B",
        denominatorValue:101
      })
    ],
    targetSession:"2025-10-01",
    replayAsOf:"2025-10-01T23:59:59+08:00",
    coverageComplete:true
  });
  assert.equal(out.ready,false);
  assert.equal(out.reason,"EVENT_VERSION_CONFLICT");
}

// Exact duplicate records are idempotent ingestion noise, not duplicate transforms.
{
  const event=E({
    eventVersion:"v1",
    effectiveSession:"2025-11-01",
    knownAt:"2025-10-01T09:00:00+08:00",
    sourceRecordId:"same",
    denominatorValue:100
  });
  const out=resolvePointInTimeLifecycle({
    events:[event,{...event}],
    targetSession:"2025-11-01",
    replayAsOf:"2025-11-01T23:59:59+08:00",
    coverageComplete:true
  });
  assert.equal(out.status,"READY");
  assert.equal(out.realizedEvents.length,1);
}

// Absence is not NO_EVENT unless source coverage is complete.
{
  const unknown=resolvePointInTimeLifecycle({
    events:[],targetSession:"2025-12-01",
    replayAsOf:"2025-12-01T23:59:59+08:00",
    coverageComplete:false
  });
  assert.equal(unknown.ready,false);
  assert.equal(unknown.reason,"EVENT_COVERAGE_UNKNOWN");

  const complete=resolvePointInTimeLifecycle({
    events:[],targetSession:"2025-12-01",
    replayAsOf:"2025-12-01T23:59:59+08:00",
    coverageComplete:true
  });
  assert.equal(complete.ready,true);
  assert.equal(complete.status,"NO_EVENT");
}

console.log("corporate-action lifecycle state-machine tests passed");
