import { cleanTestData } from '../../../tools/cleanup-test-data';

/**
 * Playwright Global Teardown hook.
 * Executes automatically after all test suites complete, purging all test-created
 * users, tournaments, teams, and matches so the platform UI remains completely clean.
 */
async function globalTeardown() {
  console.log('\n[Playwright Global Teardown] Running automated test data cleanup...');
  try {
    await cleanTestData();
  } catch (error) {
    console.error('[Playwright Global Teardown] Error during test cleanup:', error);
  }
}

export default globalTeardown;
