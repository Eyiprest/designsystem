# Session guide (60 minutes)

Run the sample page from the deployed site: [checkout URL, filled in after Netlify deploy]. Use your own camera-off setup. Have a second person take notes if you can, so you can listen.

## Before (5 min)

- Thank them. Say your name and what you built.
- Say: "This is not a test of you. Anything hard is a fault in the page."
- Say: "Please talk about what you hear, what you expect and what you do. Tell me if something surprises you."
- Check consent and the recording choice again, out loud.
- Say: "The checkout is a demonstration. No money or real details are involved. Use made-up details."
- Ask them to share their screen and audio and show how they have it set up (speech rate, zoom). Do not ask them to change anything.

## Warm-up (5 min)

- Which tools do you use daily?
- What goes wrong when you shop online?

## Tasks (35 min)

Give each task on its own, in plain words, never naming the control. Do not help unless they ask or are stuck for over 2 minutes. If you help, write down at what point and with what.

| # | Task | Components exercised | Watch for |
|---|---|---|---|
| 1 | "Open the page and tell me what it is for." | Alert, Navigation, skip link | Do they learn it is a demonstration? Do they find the skip link? |
| 2 | "Pay for the order by bank transfer. Use made-up details." | Form, Text input, Radio, Select, Button | Label and hint clarity, radio group behaviour, how the loading state sounds |
| 3 | "Press the order button without filling in anything. What happened? Fix it." | Form error summary, field errors | Do they notice the summary? Do links reach the right field? Is the error text enough? |
| 4 | "Now choose USSD. What do you need to do next?" | Radio, Select, status announcement | Is the change announced? |
| 5 | "Find the way to see your receipt notice." | Checkbox, Toast, Tabs | Do they notice the toast? Can they reach and read the tabs? |
| 6 | "Find out whether any of this is real." | Accordion | Opens and reads |
| 7 | "Switch the failed-order setting on and try to order again. What happens?" | Switch, Alert (error) | Is the error found and understood? |
| 8 | (Only on the dialog story in Storybook) "Open the edit window and close it." | Dialog | Focus entry and return |

Reorder by what the person uses. Drop tasks rather than rush.

## Questions after each task (2 min each, as needed)

- What did you expect to happen?
- What did you hear or see that told you it worked?
- What would have helped?

## Close (10 min)

- What was easiest? What was hardest?
- Anything you want me to change first?
- Is there anything I should have asked and did not?
- Confirm payment and the deletion date. Thank them.

## Afterwards

Within a day, fill `findings-template.md` while it is fresh. Send the participant their payment. Keep recordings only as long as you said.
