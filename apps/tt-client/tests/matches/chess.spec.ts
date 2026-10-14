import { test, expect } from '../fixtures';
import { DataFactory } from '../data';

test.describe('Chess Duels & FIDE Points Progression', () => {
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

  test('CHSS-01: Chess Rapid Tournament Setup - Enforces Individual mode and GAME_POINTS scoring', async ({ pm, page }) => {
    const tournamentData = DataFactory.createTournamentPayload({
      name: `Grandmaster Rapid Chess ${Date.now()}`,
      category: 'Chess',
      maxPlayers: 4,
    });

    await test.step('Select Chess sport card and verify individual duel mode', async () => {
      await pm.tournaments.goto();
      await pm.tournaments.clickCreateTournament();
      await page.waitForURL(/\/tournaments\/create/);
      await page.getByTestId('sport-card-chess').click();
      await expect(page.getByTestId('tournament-category-input')).toHaveValue('Chess');
      await expect(page.getByTestId('tournament-competition-type-select')).toHaveValue('INDIVIDUAL');
    });

    await test.step('Submit Chess tournament form', async () => {
      await page.getByTestId('tournament-name-input').fill(tournamentData.name);
      await page.getByTestId('tournament-start-date-input').fill(tournamentData.startDate);
      await page.getByTestId('tournament-end-date-input').fill(tournamentData.endDate);
      await page.getByTestId('tournament-deadline-input').fill(tournamentData.registrationDeadline);
      await page.getByTestId('tournament-max-players-input').fill('4');
      await page.getByTestId('submit-tournament-btn').click();
      await page.waitForURL(/\/tournaments$/, { timeout: 15000 });
    });

    await test.step('Verify Chess tournament appears in tournament directory', async () => {
      const card = page.locator(`[data-testid="tournament-card"]:has-text("${tournamentData.name}")`);
      await expect(card).toBeVisible();
    });
  });

  test('CHSS-02: Chess Duel Progression - Match draw, 1.0 vs 0.0 scoring, and championship crowning', async ({ pm, page }) => {
    const tournamentData = DataFactory.createTournamentPayload({
      name: `FIDE Candidate Duels ${Date.now()}`,
      category: 'Chess',
      maxPlayers: 4,
    });

    await test.step('Create Chess tournament and open details', async () => {
      await pm.tournaments.goto();
      await pm.tournaments.clickCreateTournament();
      await page.waitForURL(/\/tournaments\/create/);
      await page.getByTestId('sport-card-chess').click();
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

    await test.step('Seed 4 chess players and generate opening duel fixtures', async () => {
      await page.getByTestId('matches-tab-btn').click();
      await page.getByTestId('matches-seed-players-btn').click();
      await expect(pm.tournamentDetails.alertSuccess).toBeVisible();
      await expect(page.getByTestId('bracket-round-1')).toBeVisible();
    });

    await test.step('Submit game point results for semifinal duels (1 - 0)', async () => {
      const match1 = page.getByTestId('bracket-round-1').getByTestId('match-item').first();
      await expect(match1).toBeVisible();
      await match1.getByTestId('match-score-a-input').fill('1');
      await match1.getByTestId('match-score-b-input').fill('0');
      await match1.getByTestId('record-match-result-btn').click();
      await expect(pm.tournamentDetails.alertSuccess).toBeVisible();

      const match2 = page.getByTestId('bracket-round-1').getByTestId('match-item').nth(1);
      await expect(match2).toBeVisible();
      await match2.getByTestId('match-score-a-input').fill('0');
      await match2.getByTestId('match-score-b-input').fill('1');
      await match2.getByTestId('record-match-result-btn').click();
      await expect(pm.tournamentDetails.alertSuccess).toBeVisible();
    });

    await test.step('Submit Grand Final game result and crown Chess Champion', async () => {
      await expect(page.getByTestId('bracket-round-2')).toBeVisible();
      const finalMatch = page.getByTestId('bracket-round-2').getByTestId('match-item').first();
      await expect(finalMatch).toBeVisible();
      await finalMatch.getByTestId('match-score-a-input').fill('1');
      await finalMatch.getByTestId('match-score-b-input').fill('0');
      await finalMatch.getByTestId('record-match-result-btn').click();
      await expect(pm.tournamentDetails.alertSuccess).toBeVisible();
      await expect(page.getByTestId('tournament-champion-banner')).toBeVisible();
    });
  });
});
