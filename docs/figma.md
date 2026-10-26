# Figma file

File: https://www.figma.com/design/smxbU8i74XsPL5JJ7p8SvM/Untitled (your file; rename it to "Steady" when you like)

Built 2026-10-26 through the Figma API, then checked with Figma's own screenshots of each set.

## What is in it

**Variables (64, five collections, one mode each).** Color 25, Typography 13, Space 10, Shape and size 14, Motion 2. Generated from `tokens/tokens.json` by `npm run tokens` (`tokens/figma-variables.json`). Every variable has a scope (no "all scopes") and a code syntax of `var(--steady-...)`, so the Figma name maps to the CSS name.

**Page "Foundations".** Colour swatches (25), type sizes, spacing bars, control heights and the focus ring. All bound to the variables.

**Page "Components".** 14 component sets covering the 12 library components:

| Library component | Figma sets | Variants |
|---|---|---|
| Button | Button | 12 (primary and secondary x default, hover, active, focus, disabled, loading) |
| Text input | Text input | 5 (default, hover, focus, error, disabled) |
| Select | Select | 5 |
| Checkbox + Radio group | Checkbox, Radio | 8 each (checked yes/no x default, focus, error, disabled) |
| Switch | Switch | 6 |
| Modal dialog | Modal dialog | 2 (dialog, alertdialog) |
| Tabs | Tabs | 3 (one per selected tab) |
| Toast / alert | Alert, Toast | 4 and 2 |
| Form | Form | 2 (empty, errors shown) |
| Data table | Data table | 3 (sort none, ascending, descending) |
| Navigation menu | Navigation menu | 3 (current item) |
| Accordion | Accordion | 4 (collapsed or expanded x default, focus) |

Check run: 287 of 287 solid fills on the Components page are bound to a variable.

## Limits, said plainly

- Only one mode per collection. No dark theme exists in code, so none in Figma.
- Strokes, padding, gaps, radii and font sizes are bound where the API allowed. Fixed pixel sizes (for example the 48 x 28 switch track, the 24px check box) are plain numbers.
- The Figma data table shows one arrow per sort state. The code draws both arrows and dims the inactive one.
- Not drawn: the Ghost button variant, the small and large button sizes, Tabs manual activation and the disabled tab. They exist in code and Storybook.
- Tabs and Navigation menu have no separate Focus variant. Their focus ring is the shared ring shown in Foundations and on Button, Switch and Accordion.
- Hover and Active are shown on Button only. Other controls show hover only where the code does.
- Components are drawn from the code. They are not auto-synced. If the CSS changes, this file is out of date until someone updates it.
- No Code Connect mappings. That needs a published library and a Figma plan that supports it.
- Not published as a team library. Publishing is your call, from the Figma UI.
- Figma's fallback fonts apply if Atkinson Hyperlegible Next is missing on a viewer's machine.
