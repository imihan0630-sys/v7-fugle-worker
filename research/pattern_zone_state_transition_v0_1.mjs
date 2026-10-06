export function closeState(close, lower, upper) {
  if (![close, lower, upper].every(Number.isFinite) || upper < lower) return "UNKNOWN";
  if (close < lower) return "BELOW";
  if (close > upper) return "ABOVE";
  return "INSIDE";
}

export function summarizeZoneStates(states = []) {
  let transitions = 0;
  let directFlips = 0;
  let inside = 0;
  let run = 0;
  let maxRun = 0;
  for (let i = 0; i < states.length; i++) {
    const x = states[i];
    if (x === "INSIDE") {
      inside++;
      run++;
      maxRun = Math.max(maxRun, run);
    } else {
      run = 0;
    }
    if (i > 0) {
      const p = states[i - 1];
      if (p !== x) transitions++;
      if ((p === "BELOW" && x === "ABOVE") || (p === "ABOVE" && x === "BELOW")) directFlips++;
    }
  }
  return {
    eligibleStateCount: states.length,
    insideStateCount: inside,
    insideStateShare: states.length ? inside / states.length : null,
    stateTransitionCount: transitions,
    directOutsideFlipCount: directFlips,
    maxConsecutiveInsideStates: maxRun
  };
}

export function exactSequenceEligible(kind, complete, replaySafe) {
  if (!["TRADE_EVENT_SEQUENCE", "QUOTE_EVENT_SEQUENCE"].includes(kind)) return false;
  return complete === true && replaySafe === true;
}
