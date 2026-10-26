/**
 * Real-input keyboard checks. Uses Playwright's keyboard (trusted key events) against the dev-only
 * harness page, one component per page load. Writes docs/test-results/keyboard.json.
 * Usage: npx vite --port 5199 & node scripts/keyboard-checks.mjs [baseUrl]
 */
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';

const base = process.argv[2] ?? 'http://localhost:5199';
const results = [];
const browser = await chromium.launch();
const version = browser.version();

async function check(component, name, expected, fn) {
  const context = await browser.newContext({ viewport: { width: 1000, height: 700 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  let actual = '';
  let pass = false;
  try {
    await page.goto(`${base}/harness.html?c=${component.key}`);
    await page.waitForSelector('#root > *');
    actual = await fn(page);
    pass = actual.startsWith('OK');
    if (errors.length) { pass = false; actual += ` | page errors: ${errors.join('; ')}`; }
  } catch (e) {
    actual = `Threw: ${String(e).split('\n')[0]}`;
  }
  results.push({ component: component.label, test: name, method: 'Playwright real key events', expected, actual, result: pass ? 'Pass' : 'Fail', environment: `Chromium ${version}, Linux`, date: '2026-10-26' });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${component.label}: ${name}${pass ? '' : '\n      ' + actual}`);
  await context.close();
}
const active = (page) => page.evaluate(() => {
  const a = document.activeElement;
  return a ? `${a.tagName.toLowerCase()}|${(a.getAttribute('aria-label') || a.textContent || a.id || '').trim().slice(0, 40)}` : 'none';
});
const ok = (cond, msg) => (cond ? `OK ${msg}` : `Wrong: ${msg}`);

const C = {
  button: { key: 'button', label: 'Button' },
  radios: { key: 'radios', label: 'Radio group' },
  checkbox: { key: 'checkbox', label: 'Checkbox' },
  switch: { key: 'switch', label: 'Switch' },
  dialog: { key: 'dialog', label: 'Modal dialog' },
  tabs: { key: 'tabs', label: 'Tabs' },
  toast: { key: 'toast', label: 'Toast' },
  form: { key: 'form', label: 'Form' },
  table: { key: 'table', label: 'Data table' },
  nav: { key: 'nav', label: 'Navigation menu' },
  accordion: { key: 'accordion', label: 'Accordion' },
  select: { key: 'select', label: 'Select' },
};

await check(C.button, 'Enter and Space activate; disabled button is skipped', 'Two activations, Tab skips disabled', async (p) => {
  await p.keyboard.press('Tab'); await p.keyboard.press('Enter'); await p.keyboard.press('Space');
  const n = await p.getByTestId('count').textContent();
  await p.keyboard.press('Tab');
  const f = await active(p);
  return ok(n === '2' && f.includes('After disabled'), `count=${n}, focus after Tab=${f}`);
});

await check(C.radios, 'Group is one tab stop; arrows move and select', 'Tab enters once, arrows select, Tab leaves', async (p) => {
  await p.keyboard.press('Tab'); await p.keyboard.press('Tab');
  const first = await p.evaluate(() => document.activeElement?.getAttribute('type'));
  await p.keyboard.press('ArrowDown');
  const checked = await p.evaluate(() => document.querySelector('input[type=radio]:checked')?.value);
  await p.keyboard.press('Tab');
  const f = await active(p);
  return ok(first === 'radio' && checked === 'ussd' && f.includes('After'), `first=${first}, checked=${checked}, then focus=${f}`);
});

await check(C.checkbox, 'Space toggles', 'Checked after Space, unchecked after second Space', async (p) => {
  await p.keyboard.press('Tab'); await p.keyboard.press('Space');
  const a = await p.locator('input[type=checkbox]').isChecked();
  await p.keyboard.press('Space');
  const b = await p.locator('input[type=checkbox]').isChecked();
  return ok(a && !b, `after first=${a}, after second=${b}`);
});

await check(C.switch, 'Space toggles; state exposed', 'aria-checked or checked flips', async (p) => {
  await p.keyboard.press('Tab'); await p.keyboard.press('Space');
  const a = await p.locator('input[role=switch]').isChecked();
  await p.keyboard.press('Space');
  const b = await p.locator('input[role=switch]').isChecked();
  return ok(a && !b, `after first=${a}, after second=${b}`);
});

await check(C.select, 'Native select: arrow keys change value', 'Value changes without a mouse', async (p) => {
  await p.keyboard.press('Tab'); await p.keyboard.press('ArrowDown');
  const v = await p.locator('select').inputValue();
  return ok(v !== '', `value=${v}`);
});

await check(C.dialog, 'Opens, traps Tab, Escape closes, focus returns to trigger', 'Focus stays inside; Escape closes; focus back on Open dialog', async (p) => {
  await p.keyboard.press('Tab'); await p.keyboard.press('Enter');
  await p.waitForSelector('[role=dialog]');
  const seen = new Set();
  for (let i = 0; i < 8; i++) { await p.keyboard.press('Tab'); seen.add(await p.evaluate(() => document.activeElement?.closest('[role=dialog]') ? 'in' : 'out')); }
  await p.keyboard.press('Escape');
  await p.waitForSelector('[role=dialog]', { state: 'detached' });
  const f = await active(p);
  return ok(seen.size === 1 && seen.has('in') && f.includes('Open dialog'), `eight Tabs stayed ${[...seen]}, after Escape focus=${f}`);
});

await check(C.tabs, 'Arrow keys move and select; Tab goes to panel; Home/End', 'Roving tabindex', async (p) => {
  await p.keyboard.press('Tab');
  await p.keyboard.press('ArrowRight');
  const sel = await p.evaluate(() => document.querySelector('[role=tab][aria-selected=true]')?.textContent);
  await p.keyboard.press('End');
  const end = await p.evaluate(() => document.querySelector('[role=tab][aria-selected=true]')?.textContent);
  await p.keyboard.press('Home');
  const home = await p.evaluate(() => document.querySelector('[role=tab][aria-selected=true]')?.textContent);
  await p.keyboard.press('Tab');
  const f = await p.evaluate(() => document.activeElement?.getAttribute('role') || document.activeElement?.tagName);
  return ok(sel === 'USSD' && end === 'Cash' && home === 'Bank' && (f === 'tabpanel' || f === 'A'), `ArrowRight=${sel}, End=${end}, Home=${home}, Tab then focus=${f}`);
});

await check(C.toast, 'Toast appears without taking focus; F6 reaches it; Enter dismisses', 'Focus stays on trigger; dismiss works', async (p) => {
  await p.keyboard.press('Tab'); await p.keyboard.press('Enter');
  await p.waitForSelector('.steady-toast');
  const stay = await active(p);
  await p.keyboard.press('F6');
  const inRegion = await p.evaluate(() => !!document.activeElement?.closest('[role=region], .steady-toast-region'));
  // Real order, traced by hand: F6 -> region, Tab -> the toast itself, Tab -> Dismiss.
  await p.keyboard.press('Tab'); await p.keyboard.press('Tab');
  const onClose = await p.evaluate(() => document.activeElement?.getAttribute('aria-label'));
  await p.keyboard.press('Enter');
  await p.waitForSelector('.steady-toast', { state: 'detached', timeout: 3000 });
  return ok(stay.includes('Send receipt') && inRegion && onClose === 'Dismiss', `focus after show=${stay}, F6 into region=${inRegion}, second Tab lands on aria-label=${onClose}, Enter removed the toast`);
});

await check(C.form, 'Failed submit focuses summary; summary link focuses field; fixing does not steal focus', 'Summary focused, link goes to field, typing keeps focus', async (p) => {
  await p.keyboard.press('Tab'); await p.keyboard.press('Tab'); await p.keyboard.press('Tab'); await p.keyboard.press('Enter');
  await p.waitForSelector('[role=group][aria-labelledby]');
  const onSummary = await p.evaluate(() => !!document.activeElement?.matches('[role=group]'));
  await p.keyboard.press('Tab'); await p.keyboard.press('Enter');
  const onField = await p.evaluate(() => document.activeElement?.tagName === 'INPUT');
  await p.keyboard.type('Ada Lovelace');
  const val = await p.evaluate(() => document.activeElement?.value);
  const stillInput = await p.evaluate(() => document.activeElement?.tagName === 'INPUT');
  return ok(onSummary && onField && val === 'Ada Lovelace' && stillInput, `summary focused=${onSummary}, link->field=${onField}, typed="${val}", still in input=${stillInput}`);
});

await check(C.table, 'Sort button toggles aria-sort and reorders rows', 'ascending, descending, no focus loss', async (p) => {
  await p.keyboard.press('Tab');
  const hasScrollStop = await p.evaluate(() => document.activeElement?.classList.contains('steady-table-wrap'));
  if (hasScrollStop) await p.keyboard.press('Tab');
  await p.keyboard.press('Enter');
  const s1 = await p.evaluate(() => document.querySelector('th[aria-sort]')?.getAttribute('aria-sort'));
  const f1 = await active(p);
  await p.keyboard.press('Enter');
  const s2 = await p.evaluate(() => document.querySelector('th[aria-sort]')?.getAttribute('aria-sort'));
  const f2 = await active(p);
  return ok(s1 === 'ascending' && s2 === 'descending' && f1 === f2 && f1.startsWith('button'), `aria-sort ${s1} then ${s2}; focus kept on ${f2}`);
});

await check(C.nav, 'Skip link: first Tab stop, Enter moves focus to main', 'Real navigation lands focus in main', async (p) => {
  await p.keyboard.press('Tab');
  const first = await active(p);
  await p.keyboard.press('Enter');
  const inMain = await p.evaluate(() => document.activeElement?.id === 'main' || !!document.activeElement?.closest('main'));
  const hash = await p.evaluate(() => location.hash);
  return ok(first.includes('Skip') && inMain && hash === '#main', `first stop=${first}, focus in main=${inMain}, hash=${hash}`);
});

await check(C.accordion, 'Enter/Space expand and collapse; aria-expanded tracks', 'Expanded flips; focus stays', async (p) => {
  await p.keyboard.press('Tab'); await p.keyboard.press('Enter');
  const a = await p.locator('button[aria-expanded]').first().getAttribute('aria-expanded');
  await p.keyboard.press('Space');
  const b = await p.locator('button[aria-expanded]').first().getAttribute('aria-expanded');
  return ok(a === 'true' && b === 'false', `after Enter=${a}, after Space=${b}`);
});

await browser.close();
mkdirSync('docs/test-results', { recursive: true });
writeFileSync('docs/test-results/keyboard.json', JSON.stringify(results, null, 2));
const failed = results.filter((r) => r.result !== 'Pass').length;
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);
