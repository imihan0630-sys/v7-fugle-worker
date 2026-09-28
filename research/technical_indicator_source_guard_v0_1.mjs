// Research-only guard. The frozen v0.1 formula core is not changed.
import {buildIndicatorSnapshot} from './technical_indicator_core_v0_1.mjs';

export const TECHNICAL_SOURCE_GUARD_VERSION = 'TECHNICAL_SOURCE_GUARD_V0_1';
const decimal = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/;
const isoDate = /^\d{4}-\d{2}-\d{2}$/;

const fail = (reason, index = null) => ({valid:false,reason,index});
const price = value => {
  if (typeof value === 'number') return Number.isFinite(value) && value > 0 ? value : null;
  if (typeof value !== 'string' || !decimal.test(value.trim())) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};
const dateValid = value => {
  if (typeof value !== 'string' || !isoDate.test(value)) return false;
  const parsed = new Date(value + 'T00:00:00Z');
  return Number.isFinite(parsed.valueOf()) && parsed.toISOString().slice(0,10) === value;
};
const instant = value => typeof value === 'string' && Number.isFinite(Date.parse(value))
  && /^\d{4}-\d{2}-\d{2}T/.test(value);

export function validateTechnicalSource(rows, context) {
  if (!context || !context.symbol || !context.source) return fail('MISSING_SOURCE_IDENTITY');
  if (context.continuitySpace !== 'TECHNICAL_CONTINUITY') return fail('PRICE_SPACE_UNVERIFIED');
  if (context.pointInTimeEligible !== true || !instant(context.asOf)
      || !instant(context.sourceAvailableAt)
      || Date.parse(context.sourceAvailableAt) > Date.parse(context.asOf))
    return fail('PIT_UNVERIFIED');
  if (!Array.isArray(rows) || !rows.length) return fail('NO_BARS');
  let priorDate = null;
  const normalized = [];
  for (let i=0; i<rows.length; i++) {
    const r=rows[i];
    if (!r || r.symbol !== context.symbol) return fail('ROW_SYMBOL_MISMATCH',i);
    if (!dateValid(r.tradeDate)) return fail('INVALID_TRADE_DATE',i);
    if (priorDate !== null && r.tradeDate <= priorDate) return fail('DUPLICATE_OR_OUT_OF_ORDER_DATE',i);
    priorDate=r.tradeDate;
    const open=price(r.open), high=price(r.high), low=price(r.low), close=price(r.close);
    if ([open,high,low,close].some(v=>v===null)) return fail('INVALID_OR_NONPOSITIVE_PRICE',i);
    if (low>high || open<low || open>high || close<low || close>high)
      return fail('OHLC_GEOMETRY',i);
    if (r.symbolSessionVerified !== true) return fail('SYMBOL_SESSION_UNVERIFIED',i);
    if (r.technicalContinuity !== true || r.corporateActionContinuityResolved !== true)
      return fail('CONTINUITY_UNVERIFIED',i);
    if (r.suspensionPseudoBar === true || r.noTradePseudoBar === true)
      return fail('PSEUDO_BAR',i);
    normalized.push({...r,open,high,low,close});
  }
  if (priorDate > context.asOf.slice(0,10)) return fail('FUTURE_BAR',rows.length-1);
  return {valid:true,reason:null,rows:normalized};
}

export function buildGuardedTechnicalSnapshot(rows, context) {
  const check=validateTechnicalSource(rows,context);
  if (!check.valid) return {
    schemaVersion:'TECHNICAL_INDICATOR_SNAPSHOT_V0_2_RESEARCH',
    guardVersion:TECHNICAL_SOURCE_GUARD_VERSION,decisionImpact:false,
    dataQualityState:'BLOCKED',blockedReason:check.reason,blockedIndex:check.index,
    interpretationState:'BLOCKED',kd:null,rsi:null,macd:null
  };
  const result=buildIndicatorSnapshot(check.rows,{...context,strictSemantics:true});
  return {...result,schemaVersion:'TECHNICAL_INDICATOR_SNAPSHOT_V0_2_RESEARCH',
    guardVersion:TECHNICAL_SOURCE_GUARD_VERSION,asOf:context.asOf,
    sourceAvailableAt:context.sourceAvailableAt,tradeDate:check.rows.at(-1).tradeDate};
}
