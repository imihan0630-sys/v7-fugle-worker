import { createHash } from 'node:crypto';
import { PRODUCTS, METRICS, TABLE_ID, labelFor, invariant, rocMonth } from './contract.mjs';

export const sha256 = value => createHash('sha256').update(value).digest('hex');
export const jsonHash = value => sha256(JSON.stringify(value));
const text = cell => cell.text.replace(/\s+/g, ' ').trim();

// Runs inside Chromium on both the archived fixture and the live original table.
// freezeTable creates visual clones; never parse those clones as additional data.
export async function readTable(page) {
  const table = page.locator(`[id="${TABLE_ID}"]`);
  invariant(await table.count() === 1, 'expected exactly one original result table');
  return table.evaluate(t => ({
    html: t.outerHTML,
    rows: [...t.rows].map(row => ({
      section: row.parentElement.tagName,
      cells: [...row.cells].map(cell => ({
        text: cell.textContent, className: cell.className,
        colSpan: cell.colSpan, rowSpan: cell.rowSpan,
      })),
    })),
  }));
}

function measure(raw) {
  const value = raw.trim();
  if (['', '-', '--', '—', '－', '…', '...', 'X', 'x', 'N/A'].includes(value)) {
    return { value: 'UNKNOWN', raw, status: 'UNKNOWN', reason: 'SOURCE_MISSING_OR_SUPPRESSED' };
  }
  invariant(/^(?:0|[1-9]\d*|[1-9]\d{0,2}(?:,\d{3})+)(?:\.\d+)?$/.test(value), `unrecognized quantity ${JSON.stringify(raw)}`);
  // Preserve displayed decimal/grouping precision; do not coerce blank to zero.
  return { value, raw, status: 'REPORTED', reason: null };
}

export function parseTable(snapshot, month) {
  const roc = rocMonth(month);
  invariant(Array.isArray(snapshot.rows), 'missing table rows');
  const rows = snapshot.rows.filter(r => {
    if (r.cells.length && r.cells.every(c => c.className === 'Width')) {
      invariant(r.cells.length === 8 && r.cells.every(c => !text(c) && c.colSpan === 1 && c.rowSpan === 1), 'unexpected sizing row');
      return false;
    }
    return true;
  });
  invariant(rows.length === 3, 'expected two header rows and one month');
  invariant(rows[0].section === 'THEAD' && rows[1].section === 'THEAD' && rows[2].section === 'TBODY', 'table sections changed');
  const [metrics, products, values] = rows.map(r => r.cells);
  invariant(metrics.length === 5 && products.length === 9 && values.length === 9, 'table dimensions changed');
  invariant(metrics.every(c => c.rowSpan === 1), 'metric rowspan changed');
  invariant(JSON.stringify(metrics.map(c => c.colSpan)) === '[1,1,3,3,1]', 'metric colspan changed');
  invariant(JSON.stringify(metrics.map(text)) === JSON.stringify(['項目別', '', ...METRICS, '']), 'metric/order changed');
  invariant([...products, ...values].every(c => c.rowSpan === 1 && c.colSpan === 1), 'unexpected merged data cells');
  invariant(!text(products[0]) && !text(products[1]) && !text(products[8]) && !text(values[8]), 'border/header cells changed');
  invariant(text(values[0]) === `${Number(roc.slice(0, 3))}年` && text(values[1]) === `${Number(roc.slice(3))}月`, 'wrong result month');
  return PRODUCTS.map((p, i) => {
    const header = `${labelFor(p)} (${p.unit})`;
    invariant(text(products[2 + i]) === header && text(products[5 + i]) === header, `product/name/unit drift for ${p.code}`);
    const production = measure(values[2 + i].text);
    const inventory = measure(values[5 + i].text);
    return {
      productCode: p.code, sourceProductCode: p.sourceCode, productName: p.name,
      referenceMonth: month, displayedUnit: p.unit,
      productionValue: production.value, inventoryValue: inventory.value,
      production, inventory,
      sourcePublishedAt: 'UNKNOWN',
      sourcePublishedAtReason: 'NO_RECORD_PUBLICATION_CLOCK_EXPOSED_IN_VERIFIED_QUERY',
    };
  });
}
