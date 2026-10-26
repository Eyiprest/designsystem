# Manual screen reader results

Run by the author, Eyituoyor Prest, on 2026-10-26, on the deployed site (https://eyidesignsystems.netlify.app/checkout/).
Environment: NVDA (version not recorded), Microsoft Edge (version not recorded), Windows laptop.
Reported by the tester in chat, not recorded. Wording is the tester's, from listening live or from memory.

| # | What was done | What NVDA said | Expected | Match |
|---|---|---|---|---|
| 1 | Page loaded, Tab once from the top | "same page, skip to main content" | A skip link announced first | Yes. NVDA says "same page" for an in-page link. |
| 2 | Pressed Enter on the skip link, then Tab | Tester heard speech but could not recall it | Focus inside the main content | **Not recorded** |
| 3 | Tabbed to the first form field | "Full name, edit, required" | "Full name, edit, required" | Yes |
| 4 | Pressed Place sample order with the form empty | "There is a problem", then what to fill in, then "link, same page" (tester's paraphrase; exact words not captured) | Summary title, then error links | Yes, in outline. Exact wording and whether focus was on the summary were not recorded. |

## Not done

Speech Viewer could not be opened, so nothing was captured in text. Not tested with NVDA: field-level error text after a failed submit, whether Enter on a summary link reaches its field, payment method change announcement, order confirmation, toast, dialog, tabs, accordion, data table sort. Not tested: JAWS, VoiceOver, TalkBack, Narrator.
