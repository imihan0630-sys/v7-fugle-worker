// D01 DL-022 first-event order reconstructability helper v0.1
// Research-only / outcome-blind.

function txt(x){return typeof x==="string"?x.trim():"";}

export function buildFirstEventOrder({asOf,events=[]}={}){
  const cutoff=txt(asOf);
  if(!cutoff) return {status:"UNKNOWN",reason:"ASOF_MISSING"};

  const groups=new Map();

  for(const e of events||[]){
    const occurred=txt(e.eventOccurredAt);
    const available=txt(e.eventAvailableAt);
    const observed=txt(e.firstObservedAt||e.eventAvailableAt);
    const g=txt(e.sourceEventGroupKey);
    const type=txt(e.eventType);

    if(!occurred||!available||!observed||!g||!type)
      return {status:"UNKNOWN",reason:"EVENT_PROVENANCE_INCOMPLETE"};

    if(occurred>cutoff||available>cutoff||observed>cutoff) continue;

    if(!groups.has(g))
      groups.set(g,{sourceEventGroupKey:g,eventOccurredAt:occurred,eventTypes:new Set()});

    const row=groups.get(g);
    if(row.eventOccurredAt!==occurred)
      return {status:"QA_FAIL",reason:"SOURCE_GROUP_CLOCK_CONFLICT",sourceEventGroupKey:g};

    row.eventTypes.add(type);
  }

  const arr=[...groups.values()].map(x=>({
    sourceEventGroupKey:x.sourceEventGroupKey,
    eventOccurredAt:x.eventOccurredAt,
    eventTypes:[...x.eventTypes].sort()
  }));

  arr.sort((a,b)=>
    a.eventOccurredAt.localeCompare(b.eventOccurredAt)||
    a.sourceEventGroupKey.localeCompare(b.sourceEventGroupKey)
  );

  const timeBlocks=[];
  for(const row of arr){
    const last=timeBlocks.at(-1);
    if(last&&last.eventOccurredAt===row.eventOccurredAt) last.groups.push(row);
    else timeBlocks.push({eventOccurredAt:row.eventOccurredAt,groups:[row]});
  }

  const signature=JSON.stringify(timeBlocks.map(block=>({
    t:block.eventOccurredAt,
    groups:block.groups.map(g=>({
      k:g.sourceEventGroupKey,
      labels:g.eventTypes
    }))
  })));

  return {
    status:"VALID",
    orderedEventGroupKeys:arr.map(x=>x.sourceEventGroupKey),
    orderedEventGroupTimes:arr.map(x=>x.eventOccurredAt),
    eventLabelsByGroup:Object.fromEntries(arr.map(x=>[x.sourceEventGroupKey,x.eventTypes])),
    tiedTimeBlockCount:timeBlocks.filter(x=>x.groups.length>1).length,
    firstEventOrderSignature:signature,
    independentVoteEligible:false,
    representationClass:"DETERMINISTIC_DERIVED_VIEW"
  };
}

export function compareOrderToClockBasis({orderResult,events=[]}={}){
  if(orderResult?.status!=="VALID")
    return {status:"UNKNOWN",reason:"ORDER_NOT_VALID"};
  const rebuilt=buildFirstEventOrder({
    asOf:"9999-12-31",
    events
  });
  if(rebuilt.status!=="VALID")
    return {status:"UNKNOWN",reason:"CLOCK_BASIS_NOT_VALID"};
  return {
    status:rebuilt.firstEventOrderSignature===orderResult.firstEventOrderSignature
      ?"DETERMINISTICALLY_RECONSTRUCTED"
      :"SEMANTIC_CONTRADICTION",
    predictiveIncrementality:"UNKNOWN"
  };
}
