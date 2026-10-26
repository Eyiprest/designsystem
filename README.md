# Steady

A small React and TypeScript component library with 12 accessible components, a documented token set, and a checkout demonstration built only from those components.

**Status: portfolio project, version 0.1, not published to npm.** Built by Eyituoyor Prest. Tested against relevant WCAG 2.2 AA criteria with automated tools and keyboard checks. **Not yet tested with screen readers or with disabled users.** See [Known issues](docs/known-issues.md).

Live Storybook: https://eyidesignsystems.netlify.app/ · Checkout demonstration: https://eyidesignsystems.netlify.app/checkout/

> The checkout page is **a demonstration**. It takes no payment and sends nothing. The shop, bank, account number, USSD code and pickup points are made up.

## The 12 components

Button, Text input, Select, Checkbox and radio group, Switch, Modal dialog, Tabs, Notification (Alert and Toast), Form with validation, Data table, Navigation menu (with skip link), Accordion.

Native HTML elements are used wherever they exist (`button`, `input`, `select`, `table`, `form`). Four behaviours come from [React Aria Components](https://react-spectrum.adobe.com/react-aria/) because they are easy to get wrong by hand: dialog focus handling, tabs, switch, toast.

## Run it

Needs Node 22.

```bash
npm install
npm run storybook     # docs and stories at http://localhost:6006
npm run dev           # checkout demonstration
npm test              # 65 story tests with axe, in Chromium
npm run test:keyboard # real key presses (needs: npx vite --port 5199)
npm run test:a11y:pages # page scans (needs: npm run build && npx vite preview --port 4173)
npm run build:site    # Storybook plus checkout into ./site
```

Playwright needs Chromium installed (`npx playwright install chromium`).

## Use a component

This is not on npm. Copy `src/components`, `src/styles` and `src/tokens`, or import from `src/index.ts` inside this repo.

```tsx
import { Form, TextInput, Button } from './src';

<Form validate={validate} onSubmit={save} aria-label="Contact">
  <TextInput label="Email address" name="email" type="email" autoComplete="email" required />
  <Button type="submit">Continue</Button>
</Form>
```

## What is where

| Path | What |
|---|---|
| `src/components/` | Components, stories and docs pages (`.mdx`) |
| `src/checkout/` | The checkout demonstration |
| `tokens/tokens.json` | Token source of truth. `npm run tokens` writes CSS, Figma variables and the contrast report. |
| `docs/test-report.md` | Test results, generated from the raw results in `docs/test-results/` |
| `docs/issue-log.md` | Everything that broke while building, and who was at fault (component, test or tooling) |
| `docs/research-log.md` | Sources read, what they changed |
| `docs/figma.md` | What is in the Figma file, and what is not |
| `research/` | Kit for running sessions with assistive-technology users. No sessions have been run. |
| `docs/case-study.md` | Write-up |

## Accessibility notes

- Focus ring: one style, 2 px, 2 px gap.
- Colour pairs are contrast-checked when tokens build. The build fails if one drops below target.
- Errors and states use shape and text as well as colour.
- Reduced motion: all transitions and animations drop to 0.01 ms.
- Not tested: NVDA, JAWS, VoiceOver, TalkBack, Firefox, Safari, forced colours, the browser zoom control.

## Licence

Code: MIT. Fonts (Atkinson Hyperlegible Next and Mono): SIL Open Font License 1.1, from `@fontsource`.
