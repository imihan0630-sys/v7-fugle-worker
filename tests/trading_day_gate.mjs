import {readFile,appendFile} from 'node:fs/promises';
import {resolveScheduledMarketContext} from './resolve_scheduled_market_date.mjs';
const source=await readFile(process.env.V7_TEST_WORKER_PATH || new URL('../Worker.js',import.meta.url),'utf8');
const api=await import('data:text/javascript;base64,'+Buffer.from(source+'\nexport {loadTradingCalendar,isTradingDate};').toString('base64'));
const triggerSchedule=String(process.env.V7_TRIGGER_SCHEDULE || '').trim();
const context=resolveScheduledMarketContext({now:new Date(),triggerSchedule});
const date=context.marketDate;
await api.loadTradingCalendar({},Number(date.slice(0,4)));
const proceed=api.isTradingDate(date);
if(process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT,
  `proceed=${proceed}\nmarket_date=${date}\ncross_midnight_fallback=${context.crossMidnightFallback}\n`);
console.log(JSON.stringify({date,tradingDay:proceed,triggerSchedule:triggerSchedule||null,
  crossMidnightFallback:context.crossMidnightFallback,noSelection:true,noPush:true}));
