# System 2 S2-07 MOPS Repeated Capture Stability V1.7

Updated: 2026-10-07 Asia/Taipei  
Lane: BUILD_LANE / shared TECHNICAL_CONTINUITY owner  
Status: RESEARCH_ONLY / REPEATED_CAPTURE_UNION_RECONCILIATION  
Formal Core: LOCKED  
Scheduler: NOT ADDED  
Trading authority: NONE

## Purpose

V1.6 proved that exact-version payload identity is stable for common returned versions, but historical MOPS query membership can drift between successful captures. V1.7 therefore stops treating any single response membership as the expected keyset.

The evidence object becomes an **append-only union of every genuinely observed exact version**.

Once a version has been prospectively observed:
- it remains in the union forever;
- a later query omission cannot delete it;
- its earliest actually observed availability upper bound is preserved;
- the same global key with a different payload hash is a hard blocker.

## Four-capture physical design

The V1.7 workflow reconciles:
1. accepted V1.6 run 37547303476;
2. accepted latest-main V1.6 run 37548011614;
3. one fresh read-only V1.6 capture;
4. a second fresh read-only V1.6 capture.

No recurring scheduler is added. The two fresh captures execute only inside the validation workflow.

## Union versus membership

V1.7 distinguishes:
- **union growth**: a global exact-version identity never seen before;
- **membership drift**: a previously observed version omitted by one response;
- **payload mutation**: same global identity returned with changed canonical content;
- **late-discovered pre-existing version**: source-reported time proves the version existed by an earlier capture, but that earlier capture did not return it;
- **intermittent membership**: present, absent, then present again;
- **dropped membership**: observed previously but absent from later capture(s).

Membership drift is evidence about source-query behavior. It never authorizes deletion from the union.

## Earliest observed clock

For each global exact-version identity, V1.7 stores the minimum genuine prospective firstObservedAt across all immutable captures.

A later capture may improve membership coverage but cannot rewrite the earliest observation to a later time. Historical sourceReportedAt remains separate and cannot backdate public availability.

## Bounded union stabilization

V1.7 defines a narrow research state:

`REPEATED_CAPTURE_UNION_STABILIZED_SOURCE_SEMANTICS_PENDING`

only when:
- at least four valid prospective captures share the same stable event-universe hash;
- all captures remain 23-symbol ready;
- no payload or global-identity conflict exists;
- the final two captures add zero new exact-version identities to the cumulative union.

This is deliberately **union stabilization**, not membership equality.

Even if this state is reached, V1.7 keeps:
- sourceSemanticsCertified=false;
- expectedMopsKeysetComplete=false;
- noRevisionGapThroughCut=false;
- preParentEvidenceCutReady=false;
- symbolSessionCompletenessCertified=false;
- technicalContinuityCertified=false.

## Why expected keyset stays locked

Repeated-capture union stabilization can show that the observed union stopped growing over a bounded sequence. It cannot alone prove that the source contract exposes every historical version that should exist.

A later source-semantics gate must explain annual/month-shard omissions and establish why the stabilized union is complete enough to freeze as the expected MOPS keyset.

## Authority boundary

V1.7 performs no:
- D1/R2 mutation;
- Worker deploy;
- Cron or scheduler addition;
- strategy evaluation;
- selection/final-selection;
- push;
- capital or order action;
- System1 runtime mutation.

Formal Core remains locked.

## Exact continuation

After physical V1.7:
1. persist the immutable union and its earliest-observed clocks;
2. if union growth is not stabilized, continue bounded prospective capture without relaxing gates;
3. if union growth is stabilized, classify annual/month-shard source semantics for all drifted versions;
4. only after source semantics are certified may a later version freeze `expectedMopsVersionKeys`;
5. then bind the expected MOPS keyset with the accepted V1.5 source-lane manifest into the V1.4.1 pre-parent cut;
6. post-parent reconciliation must still prove `noRevisionGapThroughCut=true` before any symbol-session / TECHNICAL_CONTINUITY promotion.
