# Issue log

A running record of what broke while building Steady, in the order it happened. Each entry says whether the fault was in the **component**, in the **test**, or in the **tooling**, because those are different things and the test report counts them separately.

Environment for all entries: Chromium 153.0.8010.12 (headless, Playwright 1.63.0), Linux, Vitest 5.0.5, Storybook 10.6.3, React Aria Components 1.22.1. Date: 2026-10-26.

| # | Where | What I expected | What happened | Fault in | Fix | Result after fix |
|---|-------|-----------------|---------------|----------|-----|------------------|
| 1 | Tooling: TypeScript | Install the latest TypeScript (7.0.2). | The 7.0.2 package has no `main` entry, so it exposes no JavaScript compiler API. Storybook's prop-table generator needs that API. | Tooling | Pinned `typescript` to 6.0.3. | `tsc --noEmit` and Storybook both run. |
| 2 | Tooling: Playwright | Install Chromium with `npx playwright install`. | Download blocked by the network allowlist. A Chromium build for Playwright 1.63 was already on the machine, and Playwright 1.64.1 wanted a different build. | Tooling | Pinned `playwright` to 1.63.0. | Chromium 153 launches. |
| 3 | Tooling: axe canary | Check the a11y gate can actually fail. | Added a story with 1.6:1 text and an unlabelled input. Both were reported, with measured contrast (#cccccc on #ffffff). Canary story deleted afterwards. | n/a (control test) | None needed. | Confirms the Vitest + axe setup fails on contrast and label violations. |
| 4 | Stories: types | Stories type-check. | TS2322 on the Accordion and Form stories, because those components require `children` and the story meta did not provide one. | Test code | Added `children: null` to each meta's default args. | `tsc --noEmit` clean. |
| 5 | **Notification: Toast** | A toast shows its title. | The toast region and label rendered ("1 notification.") but the toast had no text. I had written `<Text slot="title" />` self-closing. React Aria's `Text` slot wires up ids and does not supply the content. | **Component** | Passed `{toast.content.title}` and `{toast.content.description}` as children. | Story finds "Receipt sent". A real user would have seen an empty toast. |
| 6 | Dialog story: background hidden | After opening, a role query for the link behind the dialog returns nothing. | The link was still found by Testing Library. React Aria hides the background with the `inert` attribute and not `aria-hidden`, and Testing Library ignores `inert`. Checked directly: `#storybook-root` has `inert`, Chromium's accessibility tree (via CDP `Accessibility.getFullAXTree`) lists only the dialog and its contents, and `link.focus()` leaves focus on the Save button inside the dialog. | **Test** | Assert `closest('[inert]')` is set and that focus cannot move to the link. | Pass. Component behaviour was correct all along. |
| 7 | Navigation story: skip link | Press Enter on the skip link in the test, then check focus moved to `main`. | The whole Vitest browser connection closed (`VITEST_BROWSER_CONNECTION_CLOSED`) every time. Running the file alone reproduced it. Removing only that Enter step stopped it. Activating the link changes the iframe's URL hash, which the test runner does not survive. | **Tooling** | Removed the Enter step from the story. Skip link activation is tested with real navigation in `scripts/keyboard-checks.mjs`. | The other stories pass. The activation test is still to be written and run. See the test report. |
| 8 | Toast story: dismiss | After dismissing, the toast text is gone. | `waitFor` timed out. Captured the DOM at failure: `document.querySelectorAll('.steady-toast').length` was 0. React Aria unmounts the whole region when the queue is empty, and my test was still querying the old detached region node. In a real browser, pressing Enter on Dismiss removes the toast in 17 ms and auto-dismiss fires at about 6.4 s (configured 6 s). | **Test** | Query `screen` (the live document) rather than the stored region node. | Pass. |

| 9 | **Form: focus handling** | After a failed submit, typing in a field should keep focus in that field. | I added live error clearing (errors disappear as fields become valid). The existing story "Fix then submit" then failed: only the first letter of each field was typed (`name=A`, `email=a`). My effect that focuses the error summary depended on `errors`, and live clearing created a new errors object on every keystroke, so **focus jumped from the field to the summary on every keystroke**. A keyboard or screen reader user could not have typed a word. | **Component** (regression I introduced) | The effect now depends only on the submit-attempt counter. Live clearing returns the same object when nothing changed. | Story passes. Full suite green three runs in a row. |
| 10 | **Checkout: heading order** | Headings go h1, then h2. | axe `heading-order` failed on two stories. I used `h3` for "Demonstration controls" and for "<method>: what happens next", directly under the page `h1`. The section titles above them ("Your details", "Payment") are `legend` elements, not headings, so level 2 was missing. | **Component / page** | Changed both to `h2` (visual size unchanged). | axe clean on all checkout stories. |
| 11 | **Text input: hover vs error** | A field in error stays red while hovered. | Found in a desktop screenshot: the Email field had a grey border while Name and Phone were red. The mouse was resting over Email, and my `:hover` rule had higher specificity than the `aria-invalid` rule, so hovering hid the error state. | **Component** | Hover rule now excludes `[aria-invalid='true']`. | Computed border colour while hovered and invalid: `rgb(179, 38, 30)`, the error colour. |
| 12 | **Data table at 320px** | Prices visible on a phone. | Screenshot at 320px: the Amount column was cut off, and the order table needed sideways scrolling to show prices. It met the reflow criterion only through the table's own scroll region, but the most important column was hidden at first view. | **Component** (design) | Row headers may wrap, and cell padding is smaller below 40rem. | In the order summary at 320px, scrollWidth 286 equals clientWidth 286. No scrolling needed. |
| 13 | **Checkout: demo controls** | A tidy labelled group. | The dashed top border ran through the fieldset's legend, and the tinted box then straddled it. | Page | Replaced the fieldset with a labelled group and a normal heading. | Checked in screenshot. |
| 14 | **Alert: static notice** | A standing banner is not announced as a live update. | The "This is a demonstration" banner used `role="status"` although it never changes after load. | **Component** (API gap) | Added `live` prop (default true). The banner uses `live={false}` and gets no role. | Story `StaticNotice` asserts no status or alert role. |
| 15 | Stories: test mistakes | Assertions match what is on screen. | Four test mistakes in one pass. (a) A role query for `status` matched three live regions on the checkout page. (b) The toast queue is module-level, so a toast from one story appeared in the next. (c) I queried a detached summary node after React unmounted it, the same mistake as entry 8. (d) My "no pickup error yet" check matched the `<option>` placeholder, which uses the same words. | **Test** | (a) Query the specific message and assert its role. (b) `toastQueue.clear()` in `beforeEach`. (c) Query the document. (d) Assert `aria-invalid` is absent. Confirmed (c) in real Chromium: the summary really does disappear. | All pass. |

## Totals so far

Counted from the table above. A defect can be counted once only.

- Component or page defects found: **7**, all fixed and retested. Entries 5, 9, 10, 11, 12, 13, 14. Entry 9 was a regression I introduced and tests caught.
- Test mistakes: **8**. Entries 4, 6, 8, the four in entry 15, and 16.
- Tooling problems: **3**. Entries 1, 2, 7.
- Control tests: **1**. Entry 3.

How the seven component or page defects were found:

- Automated suite (Vitest, axe, play functions): entries 5, 9, 10. That is three.
- Looking at screenshots: entries 11, 12, 13. That is three. axe would not have flagged a grey error border or a clipped price column.
- Design review while fixing a test ambiguity: entry 14. That is one.

The real-input keyboard run found no component defects. It found one mistake in my own check (entry 16). This list will grow as manual testing runs. Nothing above has been removed or reworded to look better.

## Real-input keyboard run (scripts/keyboard-checks.mjs)

| # | Where | What I expected | What happened | Fault in | Fix | Result after fix |
|---|-------|-----------------|---------------|----------|-----|------------------|
| 16 | Toast keyboard check | F6 reaches the notifications region, one Tab reaches Dismiss. | Timed out waiting for the toast to go. Traced focus by hand: F6 lands on the region, the first Tab lands on the toast itself (React Aria gives it `role="alertdialog"`), and the second Tab lands on Dismiss. My check pressed Enter on the toast, which does nothing. | **Test** | Check now presses Tab twice and asserts the focused element is Dismiss. | Pass. Worth knowing for the docs: keyboard users need two Tab presses after F6. |

## Found by looking at the published Storybook

| # | Where | What I expected | What happened | Fault in | Fix | Result after fix |
|---|-------|-----------------|---------------|----------|-----|------------------|
| 17 | Every MDX docs page with a table (12 files) | Markdown tables render as tables. | Tables showed as raw `\|---\|` text. Storybook's MDX compiler does not read GitHub-style tables by default. The page-scan and axe checks did not catch it because the text is valid HTML. Found while taking screenshots of the live site for the portfolio. | **Tooling** | Added `remark-gfm` 4.0.1 to the docs addon in `.storybook/main.ts`. Also updated the Introduction's test table, which still said screen readers were "not tested yet" after the three NVDA checks. | All 15 docs pages render tables, and none contain raw pipe text (checked with a script against the rebuilt site). |
