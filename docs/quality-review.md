# Three-persona quality review

Date: 2026-10-26. I wrote this after checking the repository, not from memory. Each point says what I found and what I did or did not do about it. I am the author, so treat it as a self-review. A review by another person would be worth more.

## 1. Accessibility specialist (reads the test report first)

**Would trust:** the report separates what ran from what did not. Every screen reader row says "Not tested". The issue log keeps test mistakes and tooling faults apart from component defects. Colour pairs fail the build when they drop below target. No `ts-ignore`, no `eslint-disable`, no axe rules switched off (searched).

**Would push on:**
- No screen reader has been used. The "Screen reader" sections describe expected speech, and say so. Until NVDA and VoiceOver runs exist, they are predictions. *Open. Script is in the test report.*
- One browser engine. *Open.*
- The toast takes two Tab presses to reach Dismiss, because the library gives the toast an `alertdialog` role. I documented it and did not change it. *Open. Needs a screen reader check to judge whether it hurts.*
- The "200% zoom" scan is a 640 px viewport, not the zoom control. The report says so. *Open.*
- There is no lint rule set for accessibility (such as `jsx-a11y`). Axe in stories covers rendered output only. *Not done. Add it.*
- Focus-not-obscured (WCAG 2.4.11) is not separately tested for the fixed toast region. *Open.*

## 2. Screen reader or keyboard user (what would I hit on the page?)

**Fine, by the checks:** a skip link first; one focus style; radio group is one tab stop; errors come with a summary that takes focus and links to fields; focus does not move while typing; the dialog keeps focus inside and returns it; the background is out of the accessibility tree (checked in Chromium's real tree); sort buttons keep focus.

**Could still be wrong, because nobody has heard it:**
- The "Place sample order" button gets `aria-disabled` and its label changes while loading. Whether that is announced is not known.
- The status line after choosing a payment method is a live region that is always on the page. Some screen readers announce it twice or not at all. Not known.
- The confirmation heading takes focus after the order is created. Reasonable, not confirmed by use.
- The page title gets an "Error:" prefix when the form has errors. Not confirmed by use.

**Fixed after review:** an empty toast (title missing) and a focus jump on every keystroke (issues 5 and 9).

## 3. Maintainer or senior engineer (would I adopt or fork this?)

**Would like:** native HTML first; four React Aria behaviours instead of home-made ones; strict TypeScript with `noUncheckedIndexedAccess`; tokens from one JSON file; exact pins on the two packages that drift (`react-aria-components`, `playwright`); no secrets (searched); stories double as tests.

**Would push on:**
- React Aria's toast exports are unstable. Pinned, and said so in the docs. An upgrade needs a test run.
- TypeScript is 6.0.x, because 7.0 has no JavaScript API and Storybook needs it. A later TypeScript release may fix that. *Revisit.*
- Not on npm. No build for consumers (no `exports`, no types bundle). It is a copy-in library today. The README says so.
- Figma is hand-built from code and can drift. *Open.* Code Connect is not set up.
- No visual regression tests. Two of the seven defects (hover error border, clipped price) were found by eye.
- Chromium-only in CI-like runs; there is no CI file yet. *Add a GitHub Action after the repository exists.*
- "Toast/alert" counted as one component is my reading of the brief. Documented.

## Result

No blocker for publishing as a portfolio project **if** the README keeps its status line and the limits above stay visible. Do not describe it as tested with assistive technology or as WCAG conformant until the open items in sections 1 and 2 are done.
