import {readFile,appendFile} from 'node:fs/promises';
import {resolveScheduledMarketContext} from './resolve_scheduled_market_date.mjs';
const source=await readFile(process.env.V7_TEST_WORKER_PATH || new URL('../Worker.js',import.meta.url),'utf8');
const api=await import('data:text/javascript;base64,'+Buffer.from(source+'\nexport {loadTradingCalendar,isTradingDate};').toString('base64'));
const triggerSchedule=String(process.env.V7_TRIGGER_SCHEDULE || '').trim();
const context=resolveScheduledMarketContext({now:new Date(),triggerSchedule});
const override=String(process.env.V7_RECOVERY_DATA_ONLY_DATE||'').trim();
if(override){
  if(triggerSchedule) throw new Error('manual date is not allowed for cron');
  const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  if(!/^\d{4}-\d{2}-\d{2}$/.test(override)) throw new Error('manual data-only date must be YYYY-MM-DD');
  const parsed=new Date(override+'T00:00:00Z');
  if(!Number.isFinite(parsed.getTime())||parsed.toISOString().slice(0,10)!==override)
    throw new Error('manual data-only date invalid');
  const delta=Date.parse(today+'T00:00:00Z')-parsed.getTime();
  if(!Number.isFinite(delta)||delta<0||delta>7*86400000)
    throw new Error('manual data-only date exceeds seven-day weekend/holiday recovery window');
}
const date=override||context.marketDate;
await api.loadTradingCalendar({},Number(date.slice(0,4)));
const proceed=api.isTradingDate(date);
if(process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT,
  `proceed=${proceed}\nmarket_date=${date}\ncross_midnight_fallback=${context.crossMidnightFallback}\n`);
console.log(JSON.stringify({date,tradingDay:proceed,triggerSchedule:triggerSchedule||null,
  crossMidnightFallback:context.crossMidnightFallback,noSelection:true,noPush:true}));
