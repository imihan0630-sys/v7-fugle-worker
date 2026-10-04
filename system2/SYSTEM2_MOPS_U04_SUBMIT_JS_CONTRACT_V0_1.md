# System 2 MOPS U04 Submit JavaScript Contract V0.1

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / READ_ONLY SUBMIT-SEMANTICS DISCOVERY
System 1 Formal Core: LOCKED

## Purpose

Continue the final representative-routing gap after PR #565 proved:

- U04 list form action is reachable;
- MOPS requires ROC three-digit years;
- `noticeDate=1` with ROC bounded dates reaches the U04 report surface;
- supplying only `co_id_1=4414` does not return the frozen 4414 control.

The query page exposes hidden fields `code1`, `TYPEK2`, and `checkbtn`, which are likely populated or validated by page JavaScript during company selection/submission.

## V0.1 probe

Read the official t146sb10 HTML and preserve:
- external script src values;
- inline script blocks;
- snippets around `co_id_1`, `code1`, `TYPEK2`, `checkbtn`, `form1`, and `ajax_t146sb10`;
- relevant onSubmit/onClick handlers.

No query is submitted in this probe.

## Acceptance

The probe may return either:
- direct inline submit semantics; or
- external script references requiring a second bounded source inspection.

It must not invent hidden-field values.

## Exact continuation

If submit semantics are observed:
1. freeze the exact field transformation;
2. rerun the 4414 bounded U04 list control;
3. require official list output, not a security page or generic shell.

If semantics live in external scripts:
1. fetch only the referenced official script(s);
2. freeze the relevant function;
3. then rerun the bounded control.

All authority flags remain false.
