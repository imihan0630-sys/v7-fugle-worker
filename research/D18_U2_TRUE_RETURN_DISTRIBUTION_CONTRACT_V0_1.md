# D18 U2 True Return Distribution Contract V0.1

Updated: 2026-10-01 Asia/Taipei
Status: RESEARCH-ONLY / CONTRACT_FROZEN / CONTINUITY_EXECUTION_PENDING
Owner room: 11｜統計驗證與策略市場狀態研究室
Formal Core impact: NONE

## Purpose

Freeze the semantics required before cross-sectional daily returns may enter D18 market Regime research.

The key distinction is:
two valid raw closing prices do not automatically imply a valid economic return.

Corporate actions, price-space resets, suspension/resumption and unresolved prior-session identity can create mechanical price jumps that must not be interpreted as market breadth or return-distribution information.

## 1. U2 is split into two different objects

### U2A — RAW_CLOSE_RETURN_DIAGNOSTIC

Definition:
`rawClose_t / rawClose_previous_official_session - 1`

Required:
- current raw close is valid;
- previous official-session raw close is identified;
- symbol identity is stable enough to pair the rows;
- both source rows are PIT-admissible for the requested replay.

Use:
- source/data diagnostics;
- raw traded-price movement;
- comparison against continuity-certified returns.

Not allowed:
- label as total/economic return;
- primary D18 return-distribution Regime;
- automatic strategy policy input when continuity is unresolved.

### U2B — CONTINUITY_CERTIFIED_RETURN

Primary D18 return object.

Requires all U2A conditions plus:
- target-date-bounded corporate-action continuity;
- continuity state explicitly certified;
- effective corporate actions only if known/effective by target date;
- no later corporate action may rewrite an earlier replay;
- source/vintage/knownAt/effective-date provenance;
- price-space definition/version;
- explicit UNKNOWN on unresolved continuity.

Only U2B is eligible for the primary:
- median stock return;
- equal-weight cross-sectional return;
- positive-return share when using actual return rather than exchange direction;
- return dispersion;
- quantile/tail descriptors;
- Regime return-distribution context.

## 2. Existing source limitation

The current official full-market historical daily adapter deliberately assigns:
`continuityState = UNVERIFIED`.

Therefore:
- the adapter proves actual historical market presence and raw-price availability;
- it does NOT prove U2B continuity-certified economic returns.

No current D18 research may silently promote all historical rows from that adapter into U2B.

## 3. Previous official session is not previous calendar day

For symbol/date T, previous-return reference must be the immediately previous valid official trading session for that symbol under the frozen session calendar and continuity contract.

Do not use:
- T minus one calendar day;
- the last row in a current-list reconstruction without proving historical presence;
- a stale historical row across an unresolved suspension/action gap.

## 4. No-trade / suspension / new listing semantics

### No trade / no usable current close
Return = UNKNOWN.

Do not set zero merely because volume is zero.

### Suspension / long gap
Return is not automatically the ratio to the last old close.
Require:
- official session/gap identity;
- resumption/reference-price continuity semantics.

Otherwise U2B = UNKNOWN.

### New listing
If no valid prior comparable session exists:
- U2A/U2B return = UNKNOWN;
- current market presence remains in U0;
- do not backfill a synthetic prior close.

### Delisting / market transfer / identifier ambiguity
Preserve actual date-specific market membership.
Unresolved identity => UNKNOWN.

## 5. Corporate-action firewall

Events that can change the raw price space include, at minimum:
- cash dividend;
- stock dividend;
- rights/capital increase;
- stock split / par-value change;
- capital reduction;
- mergers/exchanges or other reference-price resets where applicable.

For target date T:
- only action information admissible under the target-date PIT contract may affect continuity;
- a later action cannot rewrite historical U2B values for an earlier replay;
- raw and continuity returns are both retained when available.

If the event bridge is unresolved:
`CONTINUITY_UNVERIFIED`
and U2B remains UNKNOWN.

## 6. Distribution denominators

For every date report separately:
- U0 market-base count;
- U1 direction-comparable count;
- U2A raw-return-known count;
- U2B continuity-certified-return count;
- U2B/U0 coverage;
- missing-reason counts.

Primary D18 return-distribution statistics use U2B only.

Do not pool U2A and U2B in one distribution.

## 7. Required primary descriptors once U2B exists

At minimum:
- N;
- median return;
- equal-weight mean return;
- positive / negative / zero comparable shares;
- robust dispersion;
- lower/upper tail quantiles when N supports them;
- TWSE/TPEx separate panels plus a combined panel only under common timestamp semantics;
- continuity/missingness coverage.

Cap-weighted return requires a separate PIT-safe market-cap denominator contract and is not authorized by this U2 contract alone.

## 8. Missingness reason extension

U2 return UNKNOWN reasons include:
- NO_USABLE_CLOSE;
- PRIOR_SESSION_PRICE_MISSING;
- PREVIOUS_OFFICIAL_SESSION_UNRESOLVED;
- NEW_OR_RETURN_HISTORY_UNAVAILABLE;
- CONTINUITY_UNVERIFIED;
- CORPORATE_ACTION_REFERENCE_UNRESOLVED;
- SOURCE_OR_CLOCK_INVALID;
- IDENTITY_OR_MARKET_MEMBERSHIP_UNKNOWN;
- UNKNOWN_OTHER.

Do not convert these reasons into zero return.

## 9. OOS / Walk-forward semantics

U2B construction is data engineering, not a learnable alpha parameter.

Nevertheless every OOS fold must freeze:
- continuity contract version;
- source contract version;
- session calendar version;
- allowed corporate-action information set;
- price-space semantics.

If the continuity contract changes materially:
- start a new evidence version/epoch;
- do not silently recompute old OOS folds and pool them as if unchanged.

## 10. Negative controls

Before any D18 policy use, compare:
1. raw U2A distribution;
2. continuity-certified U2B distribution;
3. no-action/control dates where the two should agree within data semantics;
4. corporate-action-heavy dates where mechanical differences are expected.

A D18 effect that exists only in U2A and disappears in U2B is evidence of price-space contamination, not market-state alpha.

## 11. Current maturity conclusion

Mechanism and falsification are frozen.

Executable U2B feasibility is still incomplete because the current full-market historical adapter assigns continuity UNVERIFIED.

D18-04 remains L2 as a whole.
Direction Breadth can mature independently; True Return Distribution cannot claim L3 until a tested U2B builder/replay path exists.

## 12. Policy boundary

No return-distribution threshold, quantile Regime, risk-on/off label, strategy gate or dynamic weight is authorized.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.

## Exact next continuation

1. Reuse the existing corporate-action/technical-continuity research contracts rather than inventing a second continuity truth.
2. Build a research-only U2A/U2B comparison receipt when the continuity bridge is executable.
3. Verify no-action controls before action-event cases.
4. Measure U2B coverage/missingness prospectively/historically under PIT constraints.
5. Only then consider return-distribution Regime occupancy; policy alpha remains later.
