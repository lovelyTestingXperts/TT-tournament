# Playwright E2E Test Suite & Test Catalog Documentation

This directory contains the automated end-to-end (E2E) testing suite for the Table Tennis Management application (`tt-client`).

---

## 📁 Directory Architecture

```
apps/tt-client/tests/
├── data/                     # Dynamic data factory services for payloads and validation edge cases
├── fixtures/                 # Playwright test fixtures injecting PageManager and cleanup helpers
├── pages/                    # Page Object Model (POM) representations of application screens
│   ├── login.page.ts
│   ├── register.page.ts
│   ├── members.page.ts
│   ├── create-member.page.ts
│   ├── member-details.page.ts
│   ├── tournaments.page.ts
│   ├── create-tournament.page.ts
│   ├── tournament-details.page.ts
│   └── page-manager.ts       # Central aggregator providing access to all page instances
├── auth.spec.ts              # Authentication & authorization test suites (10 scenarios)
├── user-crud.spec.ts         # User and member CRUD operation test suites (5 scenarios)
├── tournament-crud.spec.ts   # Tournament CRUD and lifecycle test suites (6 scenarios)
├── match-bracket.spec.ts     # Match bracket and knockout progression suites (1 scenario)
├── multi-sport.spec.ts       # Multi-sport, team roster, wave draws & scoring suites (4 scenarios)
├── global-teardown.ts        # Automated global teardown hook executing cleanTestData()
└── README.md                 # This testing and documentation guide
```

---

## 📊 Human-Readable Test Catalog (`web-tests.xlsx`)

To provide complete visibility over our automated scenario coverage, a human-readable Excel workbook is maintained at:
- `apps/tt-client/test-artifact/web-tests.xlsx`
- `test-artifact/web-tests.xlsx`

### Workbook Schema

| Sheet Name | Content |
|---|---|
| **Summary** | Overall automation metrics, module breakdown, execution stats |
| **All Tests** | Complete catalog of all automated scenarios |
| **Authentication** | Sign-up, login, and validation error scenarios |
| **Member Management** | Create, Read, Update, Status toggle, and Soft-delete operations |
| **Tournament Management**| Create, Validation, Read, Update, Status transition, and Soft-delete |

### Columns Per Test Scenario

1. **Test ID**: Unique identifier (`AUTH-001`, `USER-001`, `TRN-001`)
2. **Module**: Application functional domain
3. **Scenario Group**: Logical feature subgroup (e.g., `CRUD - Create`, `Negative Validation`)
4. **Title**: The test title from `test(...)`
5. **Description**: Business and QA description of what is being tested
6. **Test Type**: `Functional E2E (Positive)`, `Validation (Negative)`, `Security / Negative`, `State Transition`
7. **Priority**: `P0 (Critical)`, `P1 (High)`, `P2 (Medium)`
8. **Automated Steps**: Bulleted execution workflow matching `test.step` blocks
9. **Expected Result**: Assertions and expected post-conditions
10. **Spec File**: Relative path to test specification file
11. **Status**: Execution status (e.g. `Automated & Passing`)
12. **Created At**: Timestamp of test creation
13. **Last Updated**: Timestamp of last modification

---

## 📝 MANDATORY Rule: Maintaining the Test Catalog

> **CRITICAL**: Whenever you add a new test scenario, modify an existing test, or deprecate a scenario, you MUST update the `web-tests.xlsx` sheet.

### How to Synchronize:
1. Write or modify your test scenarios in `apps/tt-client/tests/**/*.spec.ts` using standard `test('...')` and `await test.step('...')` blocks.
2. Execute:
   ```bash
   npm run update:test-sheet
   ```
3. The synchronizer automatically parses your TypeScript test files using the TypeScript AST parser, discovers all new/modified tests and their `test.step` steps, maps them to the appropriate module tab, and updates `web-tests.xlsx` with zero manual bookkeeping.

---

## 🛠️ Step Grouping Protocol (`test.step`)

Every test scenario MUST group discrete phases inside `test.step`:
```typescript
test('CREATE: should create a new tournament successfully', async ({ pm, page }) => {
  await test.step('Navigate to tournaments list', async () => {
    await pm.tournaments.goto();
    await TournamentAssertions.assertTournamentsPageVisible(pm.tournaments);
  });

  await test.step('Fill and submit tournament form', async () => {
    await pm.createTournament.createTournament(tournamentData);
  });

  await test.step('Verify tournament appears in directory', async () => {
    await expect(pm.tournaments.getTournamentCard(tournamentData.name)).toBeVisible();
  });
});
```

---

## 🧹 Test Data Teardown & UI Isolation Protocol (MANDATORY)

To prevent test-created artifacts from cluttering or corrupting the live application UI for human testers, all tests participate in our multi-layered teardown system:

1. **Automated Global Teardown**:
   - `playwright.config.ts` registers `globalTeardown: require.resolve('./tests/global-teardown.ts')`.
   - After the test run completes, `cleanTestData()` automatically executes, removing all test users, tournaments, and matches.

2. **Fixture-Level Cleanup**:
   - If a specific test scenario requires mid-suite cleanup, import and call `cleanupTestData()` injected from `test.fixture.ts`.

3. **User Naming Conventions**:
   - Test users must always use emails matching `@example.com` or `@ttsports.com` (or generated via `DataFactory`).
   - The official admin account (`lovely.kumar@testingxperts.com`) and seeded players (`@sports.org`) are protected and will never be deleted.

4. **Standalone Manual Cleanup**:
   - At any time, run:
     ```bash
     npm run test:cleanup
     ```

---

## 🚀 Running Tests

```bash
# Run all Playwright tests
npm exec playwright test -- --project=chromium

# Run tests in a specific suite
npm exec playwright test tests/auth.spec.ts --project=chromium
npm exec playwright test tests/user-crud.spec.ts --project=chromium
npm exec playwright test tests/tournament-crud.spec.ts --project=chromium
npm exec playwright test tests/multi-sport.spec.ts --project=chromium

# Run tests with HTML report
npm exec playwright show-report

# Purge any test artifacts manually
npm run test:cleanup
```
