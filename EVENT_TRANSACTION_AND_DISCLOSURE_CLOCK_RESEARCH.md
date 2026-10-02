# Event Transaction & Disclosure Clock Research

Updated: 2026-10-02 Asia/Taipei
Room: 08｜事件與新聞研究室
Scope: D11-06, D11-09, D17-13
Status: RESEARCH_ONLY / PIT_SOURCE_FEASIBILITY_ADVANCED / OUTCOMES_CLOSED / FORMAL_CORE_UNCHANGED

## Why this tranche exists

The event system must not collapse four different clocks into one:
1. economic/factual occurrence;
2. legal or regulatory due time;
3. source publication time;
4. conservative strategy-observable time.

The same separation is required for mergers, acquisitions, asset disposals, financial reports, monthly revenue and investor conferences.

---

## D11-06 — M&A / disposition / material-transaction lifecycle

### Official Taiwan mechanics

The FSC "Regulations Governing the Acquisition and Disposal of Assets by Public Companies" defines the event space broadly enough to include securities, real estate, equipment, intangible assets, right-of-use assets, derivatives, mergers, demergers, acquisitions and share transfers.

For general acquisition/disposal events, the legal **fact occurrence date** is not simply "announcement date". It is the earliest applicable date among contract signing, payment, execution, transfer, board resolution, or another date sufficient to determine counterparty and amount; where approval is required, the earlier of those dates or receipt of approval is used.

For mergers/demergers/acquisitions/share transfers:
- expert fairness/reasonableness opinion is required before the board decision in the covered cases;
- participating firms generally coordinate board/shareholder decisions on the same day, subject to statutory exceptions;
- pre-publication participants are subject to confidentiality;
- key dates such as LOI/MOU, advisor appointment, contract signing and board resolution must be recorded;
- board-approved transaction records are reported within two days;
- merger/demerger/acquisition/share-transfer transactions are reportable within two days of fact occurrence;
- later contract change, termination, failure to complete on schedule or change to prior disclosure creates a new two-day disclosure clock.

### Event-state machine

Do not model an M&A announcement as one boolean. Minimum states:

`RUMOR_OR_UNVERIFIED -> INTENT_OR_NEGOTIATION -> BOARD_APPROVED -> SHAREHOLDER_APPROVED_IF_REQUIRED -> CONTRACTED -> REGULATORY_PENDING_IF_REQUIRED -> EFFECTIVE_OR_COMPLETED -> REVISED / TERMINATED / DELAYED`

Each state has its own:
- eventOccurredAt;
- regulatoryDueAt;
- sourcePublishedAt;
- capturedAt;
- effectiveFromSession;
- revision/supersession link.

### Positive mechanism

A properly timestamped state machine may add useful risk context because the economic uncertainty is different before board approval, after signed terms, during regulatory review, and after completion.

### Falsification / negative controls

- **Announcement != completion.** A signed or approved deal can be revised, delayed or terminated.
- **Same-day board requirement != same-time public observability.** Legal process timing does not prove when a strategy could see the information.
- **Deal size != directional sign.** Acquirer and target economics can differ; financing, valuation, dilution, break fees and competing bids can dominate.
- **Asset sale != M&A.** Thresholds and clocks differ by event family.
- **Later correction cannot rewrite earlier replay.** Revisions append.
- **No outcome inference yet.** No return, gap, continuation or reversal was inspected in this tranche.

### Maturity decision

D11-06 advances **L2 -> L3** for Taiwan PIT source/data feasibility only.

This does not mean M&A produces a usable alpha factor. It means Taiwan official rules expose enough event-state and timing structure to build a point-in-time capture/replay study.

---

## D11-09 — financial report / monthly revenue / investor-conference windows

### Recurring disclosure clocks

Current TWSE information-reporting rules separate several recurring disclosure families:
- quarterly financial reports: by the legally prescribed reporting deadlines;
- annual self-reported financial information: within 75 days after fiscal year end;
- monthly operating revenue: prior-month data by the 10th of each month;
- voluntary product/business revenue statistics: prior-month data by the 20th;
- voluntary self-reported profit information: on the day it is made public, with continuing update requirements.

The official TWSE OpenAPI catalog identifies `/opendata/t187ap05_L` as the listed-company monthly operating revenue summary endpoint. Current source access in this research session was intermittently blocked, so this tranche relies on the official catalog plus TWSE reporting-rule text and does not fabricate an unobserved live payload.

### Investor-conference clocks

TWSE rules explicitly distinguish conference timing:
- if a conference occurs before the trading session or during trading hours, complete financial/business information must be filed in the preceding non-trading period;
- other conferences are filed no later than the same day after the event;
- identical multi-day/multi-session conferences need only file the first-session information under the timing rule;
- domestic self-hosted conferences must provide video information by two hours before the next business-day session begins;
- if held before/during the session, live complete video information must also be available during the conference.

### Critical distinction

A **regulatory deadline is not an exact event timestamp**.

Monthly revenue by the 10th means the event is a **deadline-window** until an actual publication is observed. It must not be encoded as "known on the 10th at market open".

Financial-report due dates likewise define a legal boundary, not the issuer's exact release time.

An investor-conference schedule can become a **scheduled-exact** event only when the date/time was actually published before the decision cutoff.

### Falsification / negative controls

- Deadline date alone cannot be used as actualPublishedAt.
- Voluntary self-estimated profit is not the same evidence class as audited/reviewed financial statements.
- Conference video posted after the event cannot be backdated into pre-event knowledge.
- Identical repeated conference sessions should not be counted as independent economic events.
- A scheduled conference does not guarantee a surprise; content may be neutral, already disclosed, or merely restate known facts.
- Corrections/revisions must preserve earlier versions.
- No event-return relation was tested here.

### Maturity decision

D11-09 advances **L2 -> L3** for Taiwan PIT source/data feasibility only.

The exact alpha/effect question remains open and needs prospective or OOS evidence.

---

## D17-13 — Scheduled vs Unscheduled event-state contract

### Frozen taxonomy

`SCHEDULED_EXACT`
- Exact event date/time was publicly knowable before the decision cutoff.
- Example: pre-announced investor conference with verified time.

`SCHEDULED_WINDOW`
- A bounded window is known but exact release time is not.
- Example: issuer gives a date but not a precise release time.

`DEADLINE_ONLY`
- Regulation defines the latest permissible filing date, but actual publication can occur earlier.
- Example: monthly revenue due by the 10th.

`UNSCHEDULED`
- No valid pre-event schedule was knowable; event enters only at conservative first-known/capture time.

`UNKNOWN`
- Source coverage, timing or identity is insufficient.

### Replay rule

For each event preserve:
- firstKnownScheduledAt;
- scheduledEventAt, if any;
- regulatoryDueAt;
- eventOccurredAt;
- sourcePublishedAt;
- capturedAt;
- correction/revision linkage.

Until provider availability is independently authenticated, `capturedAt` remains the conservative replay-eligibility clock. A displayed source publication time may be retained as provenance but cannot automatically backdate strategy observability.

### Why this is useful

This taxonomy separates:
- known event exposure before close;
- deadline risk without exact timing;
- true unscheduled overnight surprise;
- missing/unknown coverage.

That is directly useful for prospective Event Risk research, but not yet a trading rule.

### Falsification / failure cases

- A known deadline is not equivalent to a known publication time.
- A pre-announced event can be postponed or cancelled.
- Scheduled and unscheduled events can cluster on the same night.
- "No scheduled event" never means "no event can occur".
- Retrospective calendars can contain dates not actually knowable ex ante.
- Missing source capture makes the state UNKNOWN, not UNSCHEDULED or NO_EVENT.

### Maturity decision

D17-13 advances **L2 -> L3** for Taiwan PIT source/data feasibility.

The promotion is strictly about a reproducible Taiwan event-clock data contract. It is **not** evidence that scheduled or unscheduled events have a stable directional return effect.

---

## System 1 / System 2 incremental-value assessment

Potential incremental value:
- event-calendar provenance firewall;
- pre-close event-risk classification;
- prevention of deadline-as-publication look-ahead;
- M&A lifecycle state rather than one-shot announcement boolean;
- cleaner cohort construction for gap/tail-risk studies.

Redundancy guard:
- do not award separate factor votes for "monthly revenue deadline", "scheduled event", "announcement" and "news" when they describe the same underlying event;
- D11 owns the official event state; D17 owns information transmission/novelty; D15 owns portfolio risk; D16 owns validation.

Current conclusion:
`FORMAL_OPTIMIZATION_CANDIDATE = NO`

Reason: source/data feasibility is established, but no prospective/OOS event-outcome evidence, transaction-cost impact, redundancy test or multi-regime stability has passed.

## Exact next continuation

1. Build immutable prospective receipts for D11-06 M&A/asset-event state transitions across independent Taiwan dates.
2. Capture monthly revenue / financial-report / investor-conference actual publication versions prospectively, preserving deadline, published and captured clocks.
3. Accumulate D17-13 scheduled-exact / deadline-only / unscheduled / unknown cohorts before opening outcome joins.
4. Keep D11-13 negative-evidence completeness at L2 until expected/observed source coverage can prove absence rather than merely fail to observe an event.
5. Preregister event-outcome horizons and controls before any price/return inspection.
