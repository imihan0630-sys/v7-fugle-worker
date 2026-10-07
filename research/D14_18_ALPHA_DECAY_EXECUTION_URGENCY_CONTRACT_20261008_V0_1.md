# D14-18｜訊號衰減與執行急迫性研究契約

Status: MECHANISM_FALSIFICATION_CONTRACT_FROZEN / TAIWAN_PIT_REPLAY_PENDING / FORMAL_CORE_UNCHANGED
Date: 2026-10-08 Asia/Taipei
Scope: D14-18 only
Formal Core impact: NONE

## 1. 研究問題

D14-18 研究等待改善執行摩擦與等待造成訊號價值衰減之間的交換。不得預設越快成交越好，也不得預設等待更佳價格一定有利。

## 2. 不可變母單身分

每個研究收據至少固定：
- symbol / side；
- signalFirstKnownAt；
- decisionAt；
- earliestOrderableAt；
- parentQuantity；
- executionWindow；
- matchingMechanism；
- regularLot / oddLot identity；
- decision-time quote provenance；
- order lifecycle；
- unexecuted remainder；
- fill provenance。

計畫、訊號、推播、委託、模擬成交、broker-confirmed fill、realized P/L 必須分離。沒有 broker-confirmed fill，不得宣稱實際成交或已實現執行績效。

## 3. 支持機制

1. 等待可能讓 spread / market impact 隨流動性補充而改善。
2. 若 alpha decay 快於 friction improvement，等待會破壞原始交易優勢。
3. urgency 應由 decision-time 可知的 signal-life 與 executable liquidity 共同決定。
4. unexecuted opportunity cost 必須保留，不能只比較已成交子樣本。
5. 不同 market regime 可能具有不同 urgency frontier，不預設永久單一最佳門檻。

## 4. 反證與替代解釋

- 後來價格上漲不能倒推當時應更快成交。
- 後來價格下跌不能倒推當時應等待。
- 大盤、產業、事件與自然 price discovery 都是替代解釋。
- 完整當日 volume profile、close 或未來成交不得倒灌 decision-time。
- 只保留成功成交會產生 survivorship bias。
- 同一 parent order 的多筆 child orders 不得冒充獨立樣本。
- 多組 decay horizon、urgency threshold、cost weight 屬 multiple testing。
- 小額執行結果不得直接外推大額資金。
- 缺 commission、tax、slippage、latency、matching state 或 fill source 一律 UNKNOWN。

## 5. PIT / OOS / Walk-forward

所有 urgency input 僅能使用 decisionAt 以前 first-known 的資料。
模型、估計窗、成本權重、比較器與門檻須在 evaluation window 前凍結。
Walk-forward 僅能向前更新，不得用 future outcome 重新選 horizon。
OOS 必須保留 partial fill、cancel、reject、no-fill 與 opportunity cost。

## 6. 與鄰近模組邊界

- D14-15：order-type semantics。
- D14-16：parent-to-child scheduling。
- D14-17：implementation shortfall / market-impact attribution。
- D14-18：signal decay / execution urgency。

四者可共用 execution receipt，但不得重複計為四份 alpha evidence。

## 7. L3 readiness gate

至少三個獨立台股交易日的 prospective PIT receipts，要求：
- immutable decision/mechanism/order-lifecycle identity；
- deterministic replay；
- preserved executed and unexecuted opportunities；
- mechanism-matched comparator；
- broker-confirmed fills for realized execution claims。

三日期只觸發 readiness review，不自動升級 L3。

## 8. 目前結論

D14-18 已完成 mechanism + falsification contract，可作 L2 evidence candidate；在 dedicated checkpoint 與 central tracker 完成一致性寫回前，不得宣稱正式 maturity promotion。

No FORMAL_OPTIMIZATION_CANDIDATE.
Formal Core unchanged.
