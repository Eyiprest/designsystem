# Interview talking points

All claims below can be checked in this repository. If a point has a limit, the limit is part of the answer.

## 60-second summary

"I built Steady, a 12-component React and TypeScript library, with tokens in code and Figma, Storybook docs, and a demonstration checkout for bank transfer, USSD and cash. I tested it with axe in real Chromium, real key presses and page scans at 320 px. I have not yet tested with a screen reader or with disabled users, and I say so in the docs. Next step is NVDA and VoiceOver, then two or three sessions."

## Questions and answers

**Why native HTML?** The browser already handles keyboard, touch and assistive technology for button, select, table and form. My code only has to avoid breaking it. I used React Aria for dialog, tabs, switch and toast, because focus handling in those is easy to get wrong.

**What did testing find?** Seven real defects. Three came from the automated suite, three from screenshots, one from design review. The one that mattered most was my own regression: live error clearing moved focus to the error summary on every keystroke. A story that types into the form after a failed submit caught it. I fixed it by tying the focus effect to the submit attempt, not to the error set.

**What did axe miss?** A hovered field lost its error border. A price column was cut off at 320 px. A border ran through a legend. All found by looking.

**Why not a disabled button while loading?** `disabled` removes the button from the tab order. A keyboard user loses focus during the wait. `aria-disabled` keeps focus and I ignore the click.

**Why no `role="menu"` on the navigation?** It promises arrow-key menu behaviour. A list of links needs none of that.

**Is it WCAG 2.2 AA compliant?** I don't claim that. I tested against relevant AA criteria with automated and keyboard checks, and the report lists what is untested.

**What would you do next?** Run the manual NVDA and VoiceOver script in the test report, then 2 to 3 sessions with the kit in `research/`, paid and with consent. Then fix and log.

**What is the weakest part?** No screen reader testing, one browser, one engine. The toast takes two Tab presses to reach Dismiss because of the library's role choice. The Figma file is drawn from code and is not synced to it.

**What would you do differently?** Write the keyboard script before the components, so the regression would have been caught the minute it appeared.

## Do not claim

User testing, WCAG conformance, screen reader results, deployed links, or any metric not in the repository.
