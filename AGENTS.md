# Agent Instructions

## Unit Tests Are Required

- Use the project skill at `.agents/skills/react-unit-test-coverage/SKILL.md` before changing React components, pages, hooks, or user-facing behavior.
- Every component and page must have a focused unit test beside the source file or in the closest existing test location.
- When a coding agent changes a component/page, it must add or update the matching test in the same change.
- Prefer React Testing Library queries by role, label, text, and visible user behavior. Avoid tests that assert implementation details.
- Run `npm run check` before finishing any code change. For fast iteration while editing, run `npm run test:watch`.

## Validation Commands

- `npm run test` runs unit tests once.
- `npm run test:coverage` checks coverage with the configured thresholds.
- `npm run check` runs lint, tests, and production build.
