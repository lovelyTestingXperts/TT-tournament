import { test, expect } from '../fixtures';
import { DataFactory } from '../data';

test.describe('Dual Division (Singles & Doubles) Matches & Championship Progression', () => {
  test.beforeEach(async ({ pm, page }) => {
    const adminUser = DataFactory.createValidUser();

    await test.step('Register test user session', async () => {
      await pm.register.goto();
      await pm.register.registerUser(adminUser);
      await expect(pm.register.successMessage).toBeVisible();
      await expect(pm.register.successMessage).toContainText(/Registration successful/i);
    });

    await test.step('Login user and verify authenticated session', async () => {
      await pm.login.goto();
      await pm.login.login(adminUser.email, adminUser.password);
      await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10000 });
      await expect(page.getByTestId('topbar')).toBeVisible();
    });
  });

  test('DUAL-01: Dual Division Championship Creation - Umbrella tournament with Singles & Doubles sub-tournaments and card badge', async ({ pm, page }) => {
    const parentName = `World Dual Championship ${Date.now()}`;
    const tournamentData = DataFactory.createTournamentPayload({
      name: parentName,
      category: 'Table Tennis',
      maxPlayers: 8,
    });

    await test.step('Navigate to Create Tournament page', async () => {
      await pm.tournaments.goto();
      await pm.tournaments.clickCreateTournament();
      await page.waitForURL(/\/tournaments\/create/);
      await expect(page.getByTestId('create-tournament-page')).toBeVisible();
    });

    await test.step('Select Table Tennis and choose Dual Division mode', async () => {
      await page.getByTestId('sport-card-table_tennis').click();
      await page.getByTestId('tournament-name-input').fill(tournamentData.name);
      await page.getByTestId('tournament-category-input').fill('Table Tennis Championship');

      // Select Dual Division option
      await page.getByTestId('tournament-competition-type-select').selectOption('BOTH');
      await expect(page.getByTestId('dual-division-info')).toBeVisible();
      await expect(page.getByTestId('dual-division-info')).toContainText(/Championship Dual Format/i);

      // Fill dates and limits
      await page.getByTestId('tournament-start-date-input').fill(tournamentData.startDate);
      await page.getByTestId('tournament-end-date-input').fill(tournamentData.endDate);
      await page.getByTestId('tournament-deadline-input').fill(tournamentData.registrationDeadline);
      await page.getByTestId('tournament-max-players-input').fill('8');

      // Submit form
      await page.getByTestId('submit-tournament-btn').click();
      await page.waitForURL(/\/tournaments$/, { timeout: 15000 });
    });

    await test.step('Verify unified parent tournament card displays Dual Division badge on Tournaments list', async () => {
      await expect(page.getByTestId('tournaments-page')).toBeVisible();
      const parentCard = page.locator(`[data-testid="tournament-card"]:has-text("${parentName}")`);
      await expect(parentCard).toBeVisible();
      await expect(parentCard.getByTestId('dual-division-badge')).toBeVisible();
      await expect(parentCard.getByTestId('dual-division-badge')).toContainText(/Singles & Doubles/i);
    });
  });

  test('DUAL-02: Division Switcher & Independent Match Execution Across Both Divisions', async ({ pm, page }) => {
    const parentName = `National Dual Trophy ${Date.now()}`;
    const tournamentData = DataFactory.createTournamentPayload({
      name: parentName,
      category: 'Table Tennis',
      maxPlayers: 4,
    });

    await test.step('Create Dual Division tournament and open details', async () => {
      await pm.tournaments.goto();
      await pm.tournaments.clickCreateTournament();
      await page.waitForURL(/\/tournaments\/create/);
      await page.getByTestId('sport-card-table_tennis').click();
      await page.getByTestId('tournament-name-input').fill(tournamentData.name);
      await page.getByTestId('tournament-competition-type-select').selectOption('BOTH');
      await page.getByTestId('tournament-start-date-input').fill(tournamentData.startDate);
      await page.getByTestId('tournament-end-date-input').fill(tournamentData.endDate);
      await page.getByTestId('tournament-deadline-input').fill(tournamentData.registrationDeadline);
      await page.getByTestId('tournament-max-players-input').fill('4');
      await page.getByTestId('submit-tournament-btn').click();
      await page.waitForURL(/\/tournaments$/, { timeout: 15000 });

      const parentCard = page.locator(`[data-testid="tournament-card"]:has-text("${parentName}")`);
      await parentCard.click();
      await page.waitForURL(/\/tournaments\//);
      await expect(page.getByTestId('tournament-details-page')).toBeVisible();
    });

    await test.step('Verify Division Switcher is rendered with Singles and Doubles buttons', async () => {
      await expect(page.getByTestId('division-switcher')).toBeVisible();
      await expect(page.getByTestId('division-singles-btn')).toBeVisible();
      await expect(page.getByTestId('division-doubles-btn')).toBeVisible();
    });

    await test.step('Seed and run Singles Division matches', async () => {
      await page.getByTestId('division-singles-btn').click();
      await page.getByTestId('matches-tab-btn').click();
      await page.getByTestId('matches-seed-players-btn').click();
      await expect(pm.tournamentDetails.alertSuccess).toBeVisible();

      // Record Singles Match 1
      const match1 = page.getByTestId('bracket-round-1').getByTestId('match-item').first();
      await expect(match1).toBeVisible();
      await match1.getByTestId('match-score-a-input').fill('11');
      await match1.getByTestId('match-score-b-input').fill('7');
      await match1.getByTestId('record-match-result-btn').click();
      await expect(pm.tournamentDetails.alertSuccess).toBeVisible();
    });

    await test.step('Switch to Doubles Division, seed teams, and record doubles match', async () => {
      await page.getByTestId('division-doubles-btn').click();
      await expect(page.getByTestId('tournament-hero')).toContainText(/Doubles/i);

      // Seed Doubles teams
      await page.getByTestId('matches-seed-players-btn').click();
      await expect(pm.tournamentDetails.alertSuccess).toBeVisible();

      // Record Doubles Match 1
      const doublesMatch1 = page.getByTestId('bracket-round-1').getByTestId('match-item').first();
      await expect(doublesMatch1).toBeVisible();
      await doublesMatch1.getByTestId('match-score-a-input').fill('11');
      await doublesMatch1.getByTestId('match-score-b-input').fill('5');
      await doublesMatch1.getByTestId('record-match-result-btn').click();
      await expect(pm.tournamentDetails.alertSuccess).toBeVisible();
    });

    await test.step('Switch back to Singles Division and confirm independent state is preserved', async () => {
      await page.getByTestId('division-singles-btn').click();
      await expect(page.getByTestId('tournament-hero')).toContainText(/Singles/i);
      await expect(page.getByTestId('bracket-round-1')).toBeVisible();
    });
  });
});
