# Prioritising problems

Rank each problem by two questions, then by how many sessions showed it.

## Severity

| Level | Meaning |
|---|---|
| 4 Blocker | The person could not finish the task, or finished only with help |
| 3 Major | They finished, but with long delay, wrong turns or a stated loss of trust |
| 2 Minor | Noticed and mentioned, little effect |
| 1 Note | An idea or preference, no observed effect |

## Reach

How many of the sessions showed it: 1, 2 or 3 of 3. With three sessions, a problem seen once is still a problem if it is a Blocker.

## Order

1. Severity 4, any reach
2. Severity 3, seen in 2 or more sessions
3. Severity 3, seen once
4. Severity 2, seen in 2 or more sessions
5. Everything else, in a backlog

## For each problem above Note level

Record: the fix, who does it, and the check that will show it is fixed (a story, a keyboard check, or a repeat with the same person if they agree). Add the problem to `docs/issue-log.md` with "found by: user session".

## Example of the format

**This is fictional and shows layout only. It did not happen.**

| ID | Problem | Severity | Reach | Fix | Retest |
|---|---|---|---|---|---|
| EXAMPLE-1 | Participant did not notice a message after pressing a button | 3 | 1 of 3 | Move the message into an always-present live region | Keyboard script plus a screen reader check |
