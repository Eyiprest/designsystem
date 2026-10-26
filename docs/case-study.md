# Steady: 12 accessible components, tested and documented

Draft for the portfolio. Written 2026-10-26. Links and the live demo are filled in only after they exist (see `docs/task-tracker.md`).

## 1. What I set out to do

Build a small React and TypeScript component library that I can defend line by line. Twelve components, a checkout demonstration made only from them, tokens in code and in Figma, a Storybook with a docs page for each component, and a test report I could show to a sceptical reviewer. I wanted the report to say what failed, and what I did not test.

The checkout shows bank transfer, USSD and cash payment instructions, three ways of paying that need different instructions from one set of parts. It is **a demonstration**. It takes no payment, and the bank, account number and USSD code are made up.

## 2. The rules I set first

- Native HTML first. ARIA only where HTML has no element for the job.
- No custom focus traps, comboboxes or tab systems. Where the browser has no answer, use React Aria.
- No silencing TypeScript errors. No switching off axe rules.
- No claim of full WCAG 2.2 AA conformance. I say "tested against relevant WCAG 2.2 AA criteria".
- A log of everything that broke, kept in order and never tidied.

## 3. What I read, and what it changed

Fourteen sources are in `docs/research-log.md`, each with the date, what I learned and the decision it informed. Three of them shaped the work most:

- **Deque's study**: automated tools found 57% of issues by volume on average. That is why axe is one layer and not the whole test plan.
- **GOV.UK error summary guidance**: a summary at the top, focus moved to it, every item linking to its field. I copied the idea and wrote my own code.
- **React Aria's quality page**: it says it tests with screen readers. That is why I used it for dialog, tabs, switch and toast, and why I did not write those myself.

I also tried to read the W3C dialog pattern page. The request was declined, so I did not retry. The log lists it under "sources I did not read".

## 4. Tokens and Figma

`tokens/tokens.json` is the single source. One script writes the CSS custom properties, the Figma variables file and a contrast report, and fails the build if any of the 29 colour pairs misses its target. Control borders are held to 3:1 against their background (WCAG 1.4.11), and the report lists every pair with its ratio.

In Figma there are 64 variables in five collections, a Foundations page and 14 component sets for the 12 components. All 287 solid fills on the components page are bound to variables. The file is drawn from the code and is not synced to it. `docs/figma.md` lists what is missing, such as the ghost button and manual-activation tabs.

## 5. Component decisions

- **Select, checkbox, radio and table are native.** Less code, and the browser handles keyboard and touch.
- **Loading buttons use `aria-disabled`, not `disabled`.** A disabled button drops out of the tab order. Focus would vanish mid-submit.
- **The form has its own validation and an error summary.** Focus moves to the summary after a failed submit and the summary links go to the fields. The wording is the same in both places.
- **The navigation menu is a list of links.** No `role="menu"`. That role promises arrow-key behaviour I did not build.
- **Toasts are for routine messages only.** An error uses an inline alert, so it cannot time out.
- **"Toast/alert" counts as one component.** The brief lists it as one item, so Steady has one Notification family with two forms. I note this as an interpretation.

## 6. Testing, and what it found

Four layers ran, all in Chromium 153 on Linux:

| Layer | Result |
|---|---|
| axe-core inside every story (colour contrast included) plus behaviour assertions | 65 of 65 pass |
| Real key presses with Playwright | 12 of 12 pass |
| axe page scans at 1280, 640 and 320 px in four checkout states | 13 of 13 pass, no horizontal page scroll |
| Screen readers, other browsers, forced colours, zoom control, real users | **Not tested** |

The issue log has 16 entries. Seven were component or page defects, found and fixed:

- A toast rendered with no text. The automated suite found it.
- **A regression I introduced:** after I added live error clearing, focus jumped from the field to the error summary on every keystroke. A person could not have typed a word. A story that types into the form after a failed submit caught it.
- Two heading-level errors, caught by axe.
- A hovered field lost its red error border. I saw it in a screenshot. axe could not.
- The price column was cut off on a 320 px screen. A screenshot again.
- The demo-controls box had a border running through its legend. A screenshot again.

Eight more were mistakes in my own tests and three were tooling problems. I kept them in the log because they are part of what happened. Automated checks found 3 of the 7 real defects. Looking at screenshots found 3. That matches what I read: tools find some of it.

## 7. What I would not claim

- That the components work with a screen reader. They should, by the accessibility tree and the ARIA rules, and the docs say what should be announced, but I have not heard any of them.
- That the library is conformant to WCAG 2.2 AA.
- That any user has used it. `research/` holds a kit for 2 to 3 sessions with assistive-technology users, and no session has run.

## 8. What is next

1. Run the manual NVDA and VoiceOver checks written in `docs/test-report.md`, and record what is heard.
2. Run 2 to 3 sessions with the kit in `research/`, with consent and payment, and report them as what happened in those sessions only.
3. Test in Firefox and Safari, with forced colours, and with the browser zoom control.
4. Fix what those find, and log it the same way.

## Stack

React 19, TypeScript 6, Vite, Storybook 10 with the a11y addon, Vitest browser mode with Playwright, axe-core, React Aria Components (dialog, tabs, switch, toast), plain CSS custom properties, Atkinson Hyperlegible fonts (OFL).
