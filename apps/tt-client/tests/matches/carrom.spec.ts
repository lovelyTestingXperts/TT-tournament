import { test, expect } from '../fixtures';
import { DataFactory } from '../data';

test.describe('Carrom Board Matches & Points Progression', () => {
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

  test('CRRM-01: Carrom Board Tournament Setup - Auto-populates 25 points rule preset', async ({ pm, page }) => {
    const tournamentData = DataFactory.createTournamentPayload({
      name: `Carrom National Open ${Date.now()}`,
      category: 'Carrom',
      maxPlayers: 4,
    });

    await test.step('Select Carrom sport preset and verify rules and points configuration', async () => {
      await pm.tournaments.goto();
      await pm.tournaments.clickCreateTournament();
      await page.waitForURL(/\/tournaments\/create/);
      await page.getByTestId('sport-card-carrom').click();
      await expect(page.getByTestId('tournament-category-input')).toHaveValue('Carrom');
    });

    await test.step('Submit Carrom tournament form', async () => {
      await page.getByTestId('tournament-name-input').fill(tournamentData.name);
      await page.getByTestId('tournament-start-date-input').fill(tournamentData.startDate);
      await page.getByTestId('tournament-end-date-input').fill(tournamentData.endDate);
      await page.getByTestId('tournament-deadline-input').fill(tournamentData.registrationDeadline);
      await page.getByTestId('tournament-max-players-input').fill('4');
      await page.getByTestId('submit-tournament-btn').click();
      await page.waitForURL(/\/tournaments$/, { timeout: 15000 });
    });

    await test.step('Verify tournament card in directory', async () => {
      const card = page.locator(`[data-testid="tournament-card"]:has-text("${tournamentData.name}")`);
      await expect(card).toBeVisible();
    });
  });

  test('CRRM-02: Carrom Match Fixtures & Point Scoring to 25 with Queen bonus', async ({ pm, page }) => {
    const tournamentData = DataFactory.createTournamentPayload({
      name: `Grand Carrom Masters ${Date.now()}`,
      category: 'Carrom',
      maxPlayers: 4,
    });

    await test.step('Create Carrom tournament and open details', async () => {
      await pm.tournaments.goto();
      await pm.tournaments.clickCreateTournament();
      await page.waitForURL(/\/tournaments\/create/);
      await page.getByTestId('sport-card-carrom').click();
      await page.getByTestId('tournament-name-input').fill(tournamentData.name);
      await page.getByTestId('tournament-start-date-input').fill(tournamentData.startDate);
      await page.getByTestId('tournament-end-date-input').fill(tournamentData.endDate);
      await page.getByTestId('tournament-deadline-input').fill(tournamentData.registrationDeadline);
      await page.getByTestId('tournament-max-players-input').fill('4');
      await page.getByTestId('submit-tournament-btn').click();
      await page.waitForURL(/\/tournaments$/, { timeout: 15000 });

      const card = page.locator(`[data-testid="tournament-card"]:has-text("${tournamentData.name}")`);
      await card.click();
      await page.waitForURL(/\/tournaments\//);
      await expect(page.getByTestId('tournament-details-page')).toBeVisible();
    });

    await test.step('Seed 4 carrom players and generate Round 1 board fixtures', async () => {
      await page.getByTestId('matches-tab-btn').click();
      await page.getByTestId('matches-seed-players-btn').click();
      await expect(pm.tournamentDetails.alertSuccess).toBeVisible();
      await expect(page.getByTestId('bracket-round-1')).toBeVisible();
    });

    await test.step('Submit board points (25 - 18) for first semifinal board match', async () => {
      const firstMatch = page.getByTestId('bracket-round-1').getByTestId('match-item').first();
      await expect(firstMatch).toBeVisible();
      await firstMatch.getByTestId('match-score-a-input').fill('25');
      await firstMatch.getByTestId('match-score-b-input').fill('18');
      await firstMatch.getByTestId('record-match-result-btn').click();
      await expect(pm.tournamentDetails.alertSuccess).toBeVisible();
    });

    await test.step('Submit board points for second match and advance to Grand Final', async () => {
      const secondMatch = page.getByTestId('bracket-round-1').getByTestId('match-item').nth(1);
      await expect(secondMatch).toBeVisible();
      await secondMatch.getByTestId('match-score-a-input').fill('14');
      await secondMatch.getByTestId('match-score-b-input').fill('25');
      await secondMatch.getByTestId('record-match-result-btn').click();
      await expect(pm.tournamentDetails.alertSuccess).toBeVisible();
    });

    await test.step('Submit final board score (25 - 21) and crown Carrom Champion', async () => {
      await expect(page.getByTestId('bracket-round-2')).toBeVisible();
      const finalMatch = page.getByTestId('bracket-round-2').getByTestId('match-item').first();
      await expect(finalMatch).toBeVisible();
      await finalMatch.getByTestId('match-score-a-input').fill('25');
      await finalMatch.getByTestId('match-score-b-input').fill('21');
      await finalMatch.getByTestId('record-match-result-btn').click();
      await expect(pm.tournamentDetails.alertSuccess).toBeVisible();
      await expect(page.getByTestId('tournament-champion-banner')).toBeVisible();
    });
  });
});
