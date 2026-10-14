<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->

# Playwright Testing & E2E Testability Standards (MANDATORY)

Every frontend component, page, form, and interactive element MUST be authored and maintained to be directly testable with Playwright.

## 1. Test ID Protocol (`data-testid`)
Always equip elements with standard, predictable `data-testid` attributes:
- **Buttons / Actions**: `data-testid="<action>-btn"` or `data-testid="<domain>-<action>-btn"`
  - Examples: `create-tournament-btn`, `submit-btn`, `cancel-btn`, `delete-btn`, `register-btn`, `add-user-btn`
- **Inputs & Form Controls**: `data-testid="<field>-input"`, `data-testid="<field>-select"`
  - Examples: `search-input`, `tournament-name-input`, `email-input`, `password-input`, `status-select`
- **Cards, Rows & Iterated Items**:
  - Generic: `data-testid="<domain>-card"`, `data-testid="<domain>-row"`
  - Item-specific: `data-testid="<domain>-card-${id}"`, `data-testid="<domain>-row-${id}"`
- **Containers, Pages & Sections**:
  - Pages: `data-testid="<domain>-page"` (e.g. `tournaments-page`, `members-page`, `tournament-details-page`)
  - Layouts / Nav: `data-testid="sidebar"`, `data-testid="topbar"`, `data-testid="nav-<item>"`
  - Grids & Lists: `data-testid="<domain>-grid"`, `data-testid="<domain>-table"`, `data-testid="participant-list"`
  - Tabs: `data-testid="tab-<name>"`
- **Feedback & State Indicators**:
  - Loading: `data-testid="loading-spinner"`, `data-testid="loading-skeleton"`
  - Empty states: `data-testid="empty-state"`
  - Alerts: `data-testid="alert-success"`, `data-testid="alert-error"`
  - Badges: `data-testid="status-badge" data-status="<status>"`

## 2. Accessible Semantics
- Ensure `<label htmlFor="field-id">` matches `<input id="field-id">` so Playwright's `page.getByLabel()` resolves cleanly.
- Buttons must declare explicit `type="button"` or `type="submit"`.
- Icon-only buttons must have `aria-label="<action description>"`.
- Tabs must provide `role="tablist"` and `role="tab"` with `aria-selected`.

## 3. Playwright Coding Principles
- Write robust, resilient components that avoid testing brittle styling classes or DOM nesting.
- Ensure all interactive feedback (toasts, alerts, disabled states during loading) can be verified by automated assertions.
- Use `await test.step('...', async () => { ... })` for every grouped action and assertion.

## 4. Test Catalog Documentation Protocol (`web-tests.xlsx` MANDATORY)
To maintain complete visibility over what scenarios our automated tests cover, a human-readable Excel catalog is maintained at:
- `apps/tt-client/test-artifact/web-tests.xlsx`
- `test-artifact/web-tests.xlsx`

**Whenever a new Playwright test is added, refactored, or removed, you MUST update this sheet:**
- **Workbook Structure**:
  - `Summary`: Overall statistics and coverage metrics
  - `All Tests`: Comprehensive master table across all application modules
  - Module-Specific Sheets (`Authentication`, `Member Management`, `Tournament Management`, etc.): Tabulated by feature domain
- **Row & Column Schema**:
  - Each row corresponds to a single test scenario (`test(...)`)
  - Columns: `Test ID` | `Module` | `Scenario Group` | `Title` | `Description` | `Test Type` | `Priority` | `Automated Steps` | `Expected Result` | `Spec File` | `Status` | `Created At` | `Last Updated`
- **Automation / Script Tool**:
  - Simply run `npm run update:test-sheet`. The tool uses TypeScript AST analysis to automatically extract tests, grouped `test.step` actions, and assertions from `tests/**/*.spec.ts` and syncs the Excel catalog with zero manual entry.

## 5. Test Data Teardown & UI Isolation Protocol (MANDATORY)
Tests must never leave residual artifacts (test users, tournaments, matches) in the database that clutter or alter the live application UI for human users.
- **Automated Teardown**: Playwright config is integrated with `tests/global-teardown.ts`, which automatically executes `cleanTestData()` after test suites complete.
- **Fixture-Level Teardown**: When adding new end-to-end scenarios creating persistent data, utilize `cleanupTestData` fixture or `test.afterEach` to ensure changes are rolled back.
- **Test Email Naming Convention**: Dynamic test users must use emails matching `@example.com` or `@ttsports.com` (or generated via `DataFactory`). Never use `@sports.org` (reserved for permanent seeded players) or `lovely.kumar@testingxperts.com`.
- **Standalone Purge**: At any time, running `npm run test:cleanup` purges all test-created entities while preserving the 30 official seeded players and admin user.


