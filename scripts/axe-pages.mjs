/**
 * axe-core scans of the built checkout page at three viewport widths, in several states, plus a
 * horizontal-overflow check. 640px stands in for 200% zoom on a 1280px screen, and 320px for 400%.
 * That is viewport emulation, not the browser's zoom control. The test report says so.
 * Usage: npm run build && npx vite preview --port 4173 & node scripts/axe-pages.mjs [baseUrl]
 */
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { writeFileSync, mkdirSync } from 'node:fs';

const base = process.argv[2] ?? 'http://localhost:4173';
const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];
const widths = [{ w: 1280, note: '100%' }, { w: 640, note: 'stands in for 200% zoom' }, { w: 320, note: 'stands in for 400% zoom (reflow)' }];
const rows = [];
const browser = await chromium.launch();
const version = browser.version();

async function scan(page, label, width, note) {
  const res = await new AxeBuilder({ page }).withTags(tags).analyze();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  const v = res.violations.map((x) => `${x.id} (${x.impact}) x${x.nodes.length}`);
  rows.push({ state: label, width, note, axeRulesPassed: res.passes.length, violations: v, incomplete: res.incomplete.map((x) => x.id), pageOverflowPx: overflow, result: v.length === 0 && overflow <= 0 ? 'Pass' : 'Fail', environment: `Chromium ${version}, axe-core ${res.testEngine.version}`, date: '2026-10-26' });
  console.log(`${v.length === 0 && overflow <= 0 ? 'PASS' : 'FAIL'}  ${label} @${width}px  violations=${v.length} overflow=${overflow} incomplete=[${res.incomplete.map((x) => x.id)}] ${v.join('; ')}`);
}

for (const { w, note } of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 800 } });
  const page = await ctx.newPage();
  await page.goto(base); await page.waitForSelector('h1');
  await scan(page, 'Checkout, initial', w, note);

  await page.getByRole('button', { name: 'Place sample order' }).click();
  await page.waitForSelector('[role=group][aria-labelledby]');
  await scan(page, 'Checkout, validation errors shown', w, note);

  await page.getByLabel('Full name').fill('Ada Lovelace');
  await page.getByLabel('Email address').fill('ada@example.com');
  await page.getByLabel('Phone number').fill('0800 000 0000');
  await page.getByRole('radio', { name: 'Bank transfer' }).check();
  await page.getByLabel('Your bank').selectOption({ index: 1 });
  await scan(page, 'Checkout, bank transfer chosen', w, note);

  await page.getByRole('button', { name: 'Place sample order' }).click();
  await page.waitForSelector('h1:has-text("Sample order created")', { timeout: 6000 });
  await scan(page, 'Confirmation view', w, note);
  await ctx.close();
}

// Reduced motion: no transition or animation longer than a few ms on common controls.
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(base); await page.waitForSelector('h1');
  const longest = await page.evaluate(() => {
    let max = 0;
    for (const el of document.querySelectorAll('*')) {
      const s = getComputedStyle(el);
      const parse = (t) => Math.max(...t.split(',').map((x) => (x.trim().endsWith('ms') ? parseFloat(x) : parseFloat(x) * 1000) || 0));
      max = Math.max(max, parse(s.transitionDuration), parse(s.animationDuration));
    }
    return max;
  });
  rows.push({ state: 'prefers-reduced-motion: reduce', width: 1280, note: 'longest computed transition or animation duration in ms', measuredMs: longest, result: longest <= 1 ? 'Pass' : 'Fail', environment: `Chromium ${version}`, date: '2026-10-26' });
  console.log(`${longest <= 1 ? 'PASS' : 'FAIL'}  reduced motion: longest duration ${longest}ms`);
  await ctx.close();
}

await browser.close();
mkdirSync('docs/test-results', { recursive: true });
writeFileSync('docs/test-results/pages.json', JSON.stringify(rows, null, 2));
process.exit(rows.some((r) => r.result !== 'Pass') ? 1 : 0);
