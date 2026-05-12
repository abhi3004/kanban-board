---
name: react-unit-test-coverage
description: Use when a coding agent changes React components, pages, hooks, routes, UI state, forms, or user-facing behavior in this Vite React app. Guides agents to write or update Vitest and React Testing Library unit tests for every component and page and run project validation before finishing.
---

# React Unit Test Coverage

## Workflow

1. Identify every changed user-facing file under `src/`, especially components, pages, hooks, and route-level modules.
2. Create or update the closest `*.test.tsx` or `*.test.ts` file for each changed component/page. Prefer colocated tests unless the project already has a nearby test directory.
3. Test visible behavior: render output, primary interactions, accessible states, conditional content, loading/empty/error states, and important edge cases.
4. Use React Testing Library queries that match how users find UI: `getByRole`, `getByLabelText`, `getByText`, and accessible names. Use `userEvent` for interactions.
5. Mock only external boundaries such as network calls, timers, storage, browser APIs, and routing. Avoid asserting private component implementation details.
6. Keep tests deterministic and small. Avoid snapshots unless the output is intentionally stable and a behavior assertion would be weaker.
7. Run validation before handoff:
   - `npm run test` for the unit suite.
   - `npm run test:coverage` when new files or meaningful behavior were added.
   - `npm run check` before finishing any code change.

## Coverage Expectations

- Every component and page should have a test before the agent finishes the change.
- New components need at least a default render test plus one meaningful state, prop, or interaction test when applicable.
- Page tests should verify composed user flows and major visible sections. Complex child logic should also be tested at the component level.
- If a changed component/page cannot reasonably be unit tested, explain the gap in the final response and add the narrowest higher-level test available.

## Project Commands

- `npm run test`: run Vitest once in jsdom.
- `npm run test:watch`: keep Vitest running while actively editing.
- `npm run test:coverage`: run the unit suite with V8 coverage thresholds.
- `npm run check`: run lint, unit tests, and production build.
