# System 2 MOPS Real-Time Transport / Schema Diagnostic V0.1

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / READ_ONLY_DISCOVERY
System 1 Formal Core: LOCKED

## Purpose

Discover the official MOPS real-time material-information page's transport and query schema from the page itself before implementing a prospective availability-latency collector.

No POST/query parameter is guessed in this diagnostic.

Target:
`https://mops.twse.com.tw/mops/web/t05sr01_1`

## Diagnostic questions

The probe records:
- HTTP status / content type / bytes;
- form actions and methods;
- input names / IDs and hidden fields;
- presence of SEQ_NO / SPOKE_DATE / SPOKE_TIME / COMPANY_ID / skey;
- references to `ajax_t05sr01_1`;
- limited snippets around relevant tokens.

A readable page does not automatically certify the query contract.

## Intended next step

If the page itself exposes enough stable query structure, preregister a bounded real-time current-disclosure probe and physically validate it.

Only after a current-disclosure source can be queried reproducibly should System 2 build a prospective collector that records:
- sourceReportedAt;
- firstObservedAt;
- polling interval;
- latency upper/lower bound;
- source/parser/collector version.

## Safety / authority

This diagnostic does not:
- certify `availableAt`;
- set `knownAtVersionClockCertified=true`;
- authorize PIT replay using source-reported timestamps;
- mutate D1/R2;
- change selection, push, capital, orders or System 1 runtime.
