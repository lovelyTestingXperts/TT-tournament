import { test, expect } from '../fixtures';
import { DataFactory } from '../data';

test.describe('Table Tennis Matches & Bracket Progression', () => {
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

  test('TT-01: Table Tennis Singles - 4 players bracket generation, set scores entry, winner advance to final, and champion crown', async ({ pm, page }) => {
    const tournamentData = DataFactory.createTournamentPayload({
      name: `WTT Grand Smash ${Date.now()}`,
      category: 'Table Tennis',
      maxPlayers: 4,
    });

    await test.step('Create Table Tennis Singles tournament', async () => {
      await pm.tournaments.goto();
      await pm.tournaments.clickCreateTournament();
      await page.waitForURL(/\/tournaments\/create/);
      await page.getByTestId('sport-card-table_tennis').click();
      await pm.createTournament.createTournament(tournamentData);
      await page.waitForURL(/\/tournaments$/, { timeout: 15000 });
    });

    await test.step('Open tournament details and inspect overview', async () => {
      const card = page.locator(`[data-testid="tournament-card"]:has-text("${tournamentData.name}")`);
      await card.click();
      await page.waitForURL(/\/tournaments\//);
      await expect(page.getByTestId('tournament-details-page')).toBeVisible();
      await expect(page.getByTestId('tournament-name')).toContainText(tournamentData.name);
    });

    await test.step('Seed 4 realistic players and verify automatic Round 1 bracket generation', async () => {
      await page.getByTestId('matches-tab-btn').click();
      await expect(page.getByTestId('matches-seed-players-btn')).toBeVisible();
      await page.getByTestId('matches-seed-players-btn').click();
      await expect(pm.tournamentDetails.alertSuccess).toBeVisible();
      await expect(pm.tournamentDetails.alertSuccess).toContainText(
        /Round 1 bracket matches have been randomly generated/i,
      );
    });

    await test.step('Verify Round 1 matches render with two semifinal match pairings', async () => {
      await expect(page.getByTestId('bracket-round-1')).toBeVisible();
      const round1Matches = page.getByTestId('bracket-round-1').getByTestId('match-item');
      await expect(round1Matches).toHaveCount(2);
    });

    await test.step('Record scores for Semifinal Match 1 (11 - 7) and advance winner', async () => {
      const match1 = page.getByTestId('bracket-round-1').getByTestId('match-item').first();
      await match1.getByTestId('match-score-a-input').fill('11');
      await match1.getByTestId('match-score-b-input').fill('7');
      await match1.getByTestId('record-match-result-btn').click();
      await expect(pm.tournamentDetails.alertSuccess).toBeVisible();
      await expect(pm.tournamentDetails.alertSuccess).toContainText(/recorded.*advanced/i);
    });

    await test.step('Record scores for Semifinal Match 2 (8 - 11) and advance winner to Grand Final', async () => {
      const match2 = page.getByTestId('bracket-round-1').getByTestId('match-item').nth(1);
      await match2.getByTestId('match-score-a-input').fill('8');
      await match2.getByTestId('match-score-b-input').fill('11');
      await match2.getByTestId('record-match-result-btn').click();
      await expect(pm.tournamentDetails.alertSuccess).toBeVisible();
    });

    await test.step('Verify Grand Final match generated and record championship score (11 - 9)', async () => {
      await expect(page.getByTestId('bracket-round-2')).toBeVisible();
      const finalMatch = page.getByTestId('bracket-round-2').getByTestId('match-item').first();
      await expect(finalMatch).toBeVisible();
      await finalMatch.getByTestId('match-score-a-input').fill('11');
      await finalMatch.getByTestId('match-score-b-input').fill('9');
      await finalMatch.getByTestId('record-match-result-btn').click();
      await expect(pm.tournamentDetails.alertSuccess).toBeVisible();
      await expect(pm.tournamentDetails.alertSuccess).toContainText(/crowned the Official Tournament Winner/i);
    });

    await test.step('Verify Champion Victory Banner and final winner name', async () => {
      await expect(page.getByTestId('tournament-champion-banner')).toBeVisible();
      await expect(page.getByTestId('tournament-winner-name')).toBeVisible();
    });
  });

  test('TT-02: Table Tennis Doubles - Team registration of 2-player pairs, Wave 1 draw, and set progression', async ({ pm, page }) => {
    const tournamentData = DataFactory.createTournamentPayload({
      name: `TT National Doubles ${Date.now()}`,
      category: 'Table Tennis',
      maxPlayers: 4,
    });

    await test.step('Create Table Tennis Doubles tournament (Team mode with team size 2)', async () => {
      await pm.tournaments.goto();
      await pm.tournaments.clickCreateTournament();
      await page.waitForURL(/\/tournaments\/create/);
      await page.getByTestId('sport-card-table_tennis').click();
      await page.getByTestId('tournament-name-input').fill(tournamentData.name);
      await page.getByTestId('tournament-category-input').fill('Table Tennis Doubles');
      await page.getByTestId('tournament-competition-type-select').selectOption('TEAM');
      await page.getByTestId('tournament-min-team-size-input').fill('2');
      await page.getByTestId('tournament-max-team-size-input').fill('2');
      await page.getByTestId('tournament-start-date-input').fill(tournamentData.startDate);
      await page.getByTestId('tournament-end-date-input').fill(tournamentData.endDate);
      await page.getByTestId('tournament-deadline-input').fill(tournamentData.registrationDeadline);
      await page.getByTestId('tournament-max-players-input').fill('4');
      await page.getByTestId('submit-tournament-btn').click();
      await page.waitForURL(/\/tournaments$/, { timeout: 15000 });
    });

    await test.step('Open doubles tournament and seed 2-player pairs', async () => {
      const card = page.locator(`[data-testid="tournament-card"]:has-text("${tournamentData.name}")`);
      await card.click();
      await page.waitForURL(/\/tournaments\//);
      await expect(page.getByTestId('tournament-details-page')).toBeVisible();

      // Seed teams
      await page.getByTestId('matches-tab-btn').click();
      await page.getByTestId('matches-seed-players-btn').click();
      await expect(pm.tournamentDetails.alertSuccess).toBeVisible();
    });

    await test.step('Verify Wave 1 team matches rendered and record pair score', async () => {
      await expect(page.getByTestId('bracket-round-1')).toBeVisible();
      const firstTeamMatch = page.getByTestId('bracket-round-1').getByTestId('match-item').first();
      await expect(firstTeamMatch).toBeVisible();
      await firstTeamMatch.getByTestId('match-score-a-input').fill('11');
      await firstTeamMatch.getByTestId('match-score-b-input').fill('6');
      await firstTeamMatch.getByTestId('record-match-result-btn').click();
      await expect(pm.tournamentDetails.alertSuccess).toBeVisible();
    });
  });
});
