# D16/D18 breadth source-clock guard — 2026-10-12

Research-only. The source module now rejects impossible market calendar dates and capture/decision clocks before the relevant market date. Bounds are explicitly mathematical-only; caller-supplied hash strings and boolean flags do not constitute independently verified immutable provenance.

Isolated V8 tool evaluation: 20 synthetic adversarial assertions passed. This is not 20 market sessions, not an official source acceptance, and not a trading performance result.

The remote test-file write and pull-request creation were blocked by tool safety checks. Main, tracker, dedicated checkpoint and Formal Core remain unchanged.

Exact next: re-read latest main; preserve concurrent changes; obtain approved test-file/PR path; independently attest official source bytes, capturedAt, availableAt and universe identity; then execute physical source receipt tests. D18-06 existing L3 market-index acceptance still awaits tracker reconciliation. No fake Shadow or unknown-as-zero.
