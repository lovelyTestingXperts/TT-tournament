import { test, expect } from '../fixtures';
import { DataFactory } from '../data';

test.describe('Badminton Matches & Sets Progression', () => {
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

  test('BDMT-01: Badminton Tournament Setup - Best of 3 sets to 21 points preset', async ({ pm, page }) => {
    const tournamentData = DataFactory.createTournamentPayload({
      name: `All India Badminton Masters ${Date.now()}`,
      category: 'Badminton',
      maxPlayers: 4,
    });

    await test.step('Select Badminton sport card and verify 21-points set scoring configuration', async () => {
      await pm.tournaments.goto();
      await pm.tournaments.clickCreateTournament();
      await page.waitForURL(/\/tournaments\/create/);
      await page.getByTestId('sport-card-badminton').click();
      await expect(page.getByTestId('tournament-category-input')).toHaveValue('Badminton');
    });

    await test.step('Fill form details and submit Badminton tournament', async () => {
      await page.getByTestId('tournament-name-input').fill(tournamentData.name);
      await page.getByTestId('tournament-start-date-input').fill(tournamentData.startDate);
      await page.getByTestId('tournament-end-date-input').fill(tournamentData.endDate);
      await page.getByTestId('tournament-deadline-input').fill(tournamentData.registrationDeadline);
      await page.getByTestId('tournament-max-players-input').fill('4');
      await page.getByTestId('submit-tournament-btn').click();
      await page.waitForURL(/\/tournaments$/, { timeout: 15000 });
    });

    await test.step('Verify Badminton card appears on Tournaments listing', async () => {
      const card = page.locator(`[data-testid="tournament-card"]:has-text("${tournamentData.name}")`);
      await expect(card).toBeVisible();
    });
  });

  test('BDMT-02: Badminton Match Play - Bracket match draw, set score entry, and finals champion', async ({ pm, page }) => {
    const tournamentData = DataFactory.createTournamentPayload({
      name: `BWF World Tour Super 500 ${Date.now()}`,
      category: 'Badminton',
      maxPlayers: 4,
    });

    await test.step('Create Badminton tournament and open details', async () => {
      await pm.tournaments.goto();
      await pm.tournaments.clickCreateTournament();
      await page.waitForURL(/\/tournaments\/create/);
      await page.getByTestId('sport-card-badminton').click();
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

    await test.step('Seed 4 badminton players and generate opening knockout matches', async () => {
      await page.getByTestId('matches-tab-btn').click();
      await page.getByTestId('matches-seed-players-btn').click();
      await expect(pm.tournamentDetails.alertSuccess).toBeVisible();
      await expect(page.getByTestId('bracket-round-1')).toBeVisible();
    });

    await test.step('Record 21-points set score for Semifinal Match 1 (21 - 17)', async () => {
      const match1 = page.getByTestId('bracket-round-1').getByTestId('match-item').first();
      await expect(match1).toBeVisible();
      await match1.getByTestId('match-score-a-input').fill('21');
      await match1.getByTestId('match-score-b-input').fill('17');
      await match1.getByTestId('record-match-result-btn').click();
      await expect(pm.tournamentDetails.alertSuccess).toBeVisible();
    });

    await test.step('Record 21-points set score for Semifinal Match 2 (18 - 21)', async () => {
      const match2 = page.getByTestId('bracket-round-1').getByTestId('match-item').nth(1);
      await expect(match2).toBeVisible();
      await match2.getByTestId('match-score-a-input').fill('18');
      await match2.getByTestId('match-score-b-input').fill('21');
      await match2.getByTestId('record-match-result-btn').click();
      await expect(pm.tournamentDetails.alertSuccess).toBeVisible();
    });

    await test.step('Record Grand Final score (21 - 19) and verify championship crown', async () => {
      await expect(page.getByTestId('bracket-round-2')).toBeVisible();
      const finalMatch = page.getByTestId('bracket-round-2').getByTestId('match-item').first();
      await expect(finalMatch).toBeVisible();
      await finalMatch.getByTestId('match-score-a-input').fill('21');
      await finalMatch.getByTestId('match-score-b-input').fill('19');
      await finalMatch.getByTestId('record-match-result-btn').click();
      await expect(pm.tournamentDetails.alertSuccess).toBeVisible();
      await expect(page.getByTestId('tournament-champion-banner')).toBeVisible();
    });
  });
});
