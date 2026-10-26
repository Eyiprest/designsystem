# Known issues and limits

Last updated 2026-10-26.

## Not tested

- **Screen readers.** No NVDA, JAWS, VoiceOver or TalkBack run has happened. Every "Screen reader" section in the docs says what should be announced, based on the accessibility tree and the ARIA specification, and says it is not confirmed.
- **Browsers.** Chromium 153 on Linux only. Firefox and Safari are untested.
- **Forced colours (Windows High Contrast).** Untested.
- **Browser zoom at 200%.** The 640 px viewport scan stands in for it and is not the same thing.
- **Real users.** No sessions. The kit in `research/` is ready to use.
- **Touch devices.** Untested. Target sizes are above the 24 px minimum but no device was used.

## Known behaviour to be aware of

- **Toast keyboard order.** After F6, keyboard users press Tab twice to reach Dismiss, because React Aria 1.22.1 gives the toast itself a role of `alertdialog` and focus stops on it first. This is library behaviour.
- **Unstable API.** React Aria's toast exports are named `UNSTABLE_*`. `react-aria-components` is pinned to an exact version for that reason.
- **Select and axe.** axe cannot compute the select's background because of the chevron image. Checked by hand.
- **Tabs.** The tab list wraps onto more rows when narrow. It does not scroll.
- **Dialog.** Escape also closes an `alertdialog`. Nested dialogs are untested.
- **Live regions.** A live region that is inserted already filled may not be announced by some screen readers. Use the toast region or render the Alert empty first.
- **Skip link in Storybook tests.** The Vitest browser runner cannot activate a link that changes the URL hash. This is covered by the Playwright keyboard script instead.
- **Figma.** Drawn from the code and not synced to it. See `docs/figma.md`.

## Gaps by design

No dark theme. No right-to-left testing. No i18n. No icon-only button. No dropdown navigation. No multi-select, indeterminate checkbox or textarea.
