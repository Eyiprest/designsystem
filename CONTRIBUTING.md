# Contributing

Issues and pull requests are welcome. This is a small project run by one person, so replies may take a few days.

Before a pull request:

1. `npm run typecheck` and `npm test` pass.
2. A new or changed component has a story for each state and a docs page with the ten standard headings (see any `.mdx` in `src/components`).
3. Use native HTML first. Add ARIA only where HTML has no element for the job. Do not write your own focus trap, combobox or tab system.
4. Do not silence a TypeScript error or turn off an axe rule to make a check pass. If a rule is wrong for your case, say why in the pull request.
5. New colours go in `tokens/tokens.json` with a contrast pair, so `npm run tokens` checks them.
6. If you find an accessibility problem, open an issue and say which assistive technology and browser you used.
