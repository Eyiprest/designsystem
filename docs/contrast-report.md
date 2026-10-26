# Contrast report

Computed by `scripts/build-tokens.mjs` using the WCAG relative luminance formula. Run `npm run tokens` to regenerate.
This checks colour pairs in isolation. It does not check anti-aliasing, text rendered over images, or user-modified colours.

Result: 29 of 29 declared pairs pass.

| Foreground | Background | Ratio | Needs | SC | Used for | Result |
|---|---|---|---|---|---|---|
| `color.text.primary` #1D1C19 | `color.bg.canvas` #FBFAF7 | 16.33:1 | 4.5:1 | 1.4.3 | Body text on page | Pass |
| `color.text.primary` #1D1C19 | `color.bg.surface` #FFFFFF | 17.04:1 | 4.5:1 | 1.4.3 | Text in inputs, dialogs | Pass |
| `color.text.primary` #1D1C19 | `color.bg.subtle` #F1EFE8 | 14.81:1 | 4.5:1 | 1.4.3 | Table header, hover row | Pass |
| `color.text.secondary` #57544C | `color.bg.canvas` #FBFAF7 | 7.24:1 | 4.5:1 | 1.4.3 | Hint text on page | Pass |
| `color.text.secondary` #57544C | `color.bg.surface` #FFFFFF | 7.56:1 | 4.5:1 | 1.4.3 | Hint text in surface | Pass |
| `color.text.secondary` #57544C | `color.bg.subtle` #F1EFE8 | 6.57:1 | 4.5:1 | 1.4.3 | Secondary text on subtle | Pass |
| `color.text.on-primary` #FFFFFF | `color.primary.default` #0B6B70 | 6.27:1 | 4.5:1 | 1.4.3 | Primary button label | Pass |
| `color.text.on-primary` #FFFFFF | `color.primary.hover` #08555A | 8.55:1 | 4.5:1 | 1.4.3 | Primary button label, hover | Pass |
| `color.text.on-primary` #FFFFFF | `color.primary.active` #064044 | 11.51:1 | 4.5:1 | 1.4.3 | Primary button label, pressed | Pass |
| `color.primary.default` #0B6B70 | `color.bg.canvas` #FBFAF7 | 6.00:1 | 4.5:1 | 1.4.3 | Link text, secondary button label | Pass |
| `color.primary.default` #0B6B70 | `color.bg.surface` #FFFFFF | 6.27:1 | 4.5:1 | 1.4.3 | Link text in surface | Pass |
| `color.primary.active` #064044 | `color.primary.subtle` #E1F0F0 | 9.82:1 | 4.5:1 | 1.4.3 | Selected tab or nav label on subtle | Pass |
| `color.text.primary` #1D1C19 | `color.primary.subtle` #E1F0F0 | 14.54:1 | 4.5:1 | 1.4.3 | Text on selected row | Pass |
| `color.text.on-inverse` #FBFAF7 | `color.bg.inverse` #1D1C19 | 16.33:1 | 4.5:1 | 1.4.3 | Toast text | Pass |
| `color.error.default` #B3261E | `color.bg.canvas` #FBFAF7 | 6.26:1 | 4.5:1 | 1.4.3 | Error text on page | Pass |
| `color.error.default` #B3261E | `color.bg.surface` #FFFFFF | 6.54:1 | 4.5:1 | 1.4.3 | Error text in surface | Pass |
| `color.error.default` #B3261E | `color.error.subtle` #FCE9E7 | 5.59:1 | 4.5:1 | 1.4.3 | Error summary text | Pass |
| `color.success.default` #1E6B34 | `color.bg.surface` #FFFFFF | 6.55:1 | 4.5:1 | 1.4.3 | Success text | Pass |
| `color.success.default` #1E6B34 | `color.success.subtle` #E5F2E8 | 5.67:1 | 4.5:1 | 1.4.3 | Success alert text | Pass |
| `color.warning.default` #7A4800 | `color.bg.surface` #FFFFFF | 7.62:1 | 4.5:1 | 1.4.3 | Warning text | Pass |
| `color.warning.default` #7A4800 | `color.warning.subtle` #FFF1CF | 6.80:1 | 4.5:1 | 1.4.3 | Warning alert text | Pass |
| `color.border.default` #7D796D | `color.bg.canvas` #FBFAF7 | 4.17:1 | 3:1 | 1.4.11 | Input, select, checkbox border on page | Pass |
| `color.border.default` #7D796D | `color.bg.surface` #FFFFFF | 4.35:1 | 3:1 | 1.4.11 | Input border on surface | Pass |
| `color.primary.default` #0B6B70 | `color.bg.canvas` #FBFAF7 | 6.00:1 | 3:1 | 1.4.11 | Selected checkbox, switch on, radio dot | Pass |
| `color.primary.default` #0B6B70 | `color.bg.surface` #FFFFFF | 6.27:1 | 3:1 | 1.4.11 | Selected control on surface | Pass |
| `color.error.default` #B3261E | `color.bg.surface` #FFFFFF | 6.54:1 | 3:1 | 1.4.11 | Error border | Pass |
| `color.focus.outer` #1D1C19 | `color.bg.canvas` #FBFAF7 | 16.33:1 | 3:1 | 1.4.11 | Focus ring on page | Pass |
| `color.focus.outer` #1D1C19 | `color.bg.surface` #FFFFFF | 17.04:1 | 3:1 | 1.4.11 | Focus ring on surface | Pass |
| `color.focus.outer` #1D1C19 | `color.focus.inner` #FFFFFF | 17.04:1 | 3:1 | 1.4.11 | Focus ring against its own gap | Pass |

## Not checked by this script

- `color.text.disabled` on `color.disabled.bg`. Disabled controls are exempt from 1.4.3, so this pair is deliberately not asserted.
- Hover and pressed backgrounds for secondary and ghost buttons are covered by the text pairs above only where they reuse the same background tokens.
