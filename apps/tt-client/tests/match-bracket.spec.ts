import { test, expect } from './fixtures';
import { DataFactory } from './data';

test.describe('Tournament Match Generation, Bracket Progression & Winner Finalization', () => {
  test.beforeEach(async ({ pm, page }) => {
    const adminUser = DataFactory.createValidUser();

    await test.step('Register active user for test session', async () => {
      await pm.register.goto();
      await pm.register.registerUser(adminUser);
      await expect(pm.register.successMessage).toBeVisible();
      await expect(pm.register.successMessage).toContainText(/Registration successful/i);
    });

    await test.step('Login and verify dashboard session', async () => {
      await pm.login.goto();
      await pm.login.login(adminUser.email, adminUser.password);
      await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10000 });
      await expect(page.getByTestId('topbar')).toBeVisible();
    });
  });

  test('BRACKET E2E: should seed dummy players, randomly generate Round 1 matches, progress winners to Final, and crown Tournament Champion', async ({ pm, page }) => {
    const tournamentData = DataFactory.createTournamentPayload({
      maxPlayers: 4,
      category: 'Championship Knockout',
    });

    await test.step('Create a new 4-player knockout tournament', async () => {
      await pm.tournaments.goto();
      await pm.tournaments.clickCreateTournament();
      await page.waitForURL(/\/tournaments\/create/);
      await pm.createTournament.createTournament(tournamentData);
      await page.waitForURL(/\/tournaments$/);
    });

    await test.step('Open tournament details and switch to Matches tab', async () => {
      await pm.tournaments.search(tournamentData.name);
      await pm.tournaments.openTournament(tournamentData.name);
      await page.waitForURL(/\/tournaments\/[a-zA-Z0-9_-]+/);
      await pm.tournamentDetails.switchTab('matches');
      await expect(page.getByTestId('empty-matches-state')).toBeVisible();
    });

    await test.step('Seed 4 dummy players and verify Round 1 Semifinals matches are randomly generated', async () => {
      await page.getByTestId('matches-seed-players-btn').click();
      await expect(pm.tournamentDetails.alertSuccess).toBeVisible();
      await expect(pm.tournamentDetails.alertSuccess).toContainText(
        /Round 1 bracket matches have been randomly generated/i,
      );
      await expect(page.getByTestId('bracket-round-1')).toBeVisible();
      const round1Matches = page.getByTestId('bracket-round-1').getByTestId('match-item');
      await expect(round1Matches).toHaveCount(2);
    });

    await test.step('Validate edge case: reject tied score in knockout match', async () => {
      const firstMatch = page.getByTestId('bracket-round-1').getByTestId('match-item').first();
      await firstMatch.getByTestId('match-score-a-input').fill('11');
      await firstMatch.getByTestId('match-score-b-input').fill('11');
      await firstMatch.getByTestId('record-match-result-btn').click();

      await expect(page.getByTestId('match-validation-error')).toBeVisible();
      await expect(page.getByTestId('match-validation-error')).toContainText(/cannot end in a tie/i);
    });

    await test.step('Record Round 1 Match #1 result and verify Winner advances to newly registered Grand Final match', async () => {
      const firstMatch = page.getByTestId('bracket-round-1').getByTestId('match-item').first();
      await firstMatch.getByTestId('match-score-a-input').fill('11');
      await firstMatch.getByTestId('match-score-b-input').fill('6');
      await firstMatch.getByTestId('record-match-result-btn').click();

      await expect(pm.tournamentDetails.alertSuccess).toBeVisible();
      await expect(pm.tournamentDetails.alertSuccess).toContainText(
        /Winner has automatically advanced to the next round match/i,
      );

      // Verify Round 2 (Grand Final) match is now registered with 1st finalist waiting for opponent
      await expect(page.getByTestId('bracket-round-2')).toBeVisible();
      const finalMatch = page.getByTestId('bracket-round-2').getByTestId('match-item').first();
      await expect(finalMatch).toHaveAttribute('data-match-status', 'PENDING');
      await expect(finalMatch).toContainText('TBD');
    });

    await test.step('Record Round 1 Match #2 result and verify Grand Final becomes SCHEDULED with both finalists', async () => {
      const secondMatch = page.getByTestId('bracket-round-1').getByTestId('match-item').nth(1);
      await secondMatch.getByTestId('match-score-a-input').fill('8');
      await secondMatch.getByTestId('match-score-b-input').fill('11');
      await secondMatch.getByTestId('record-match-result-btn').click();

      const finalMatch = page.getByTestId('bracket-round-2').getByTestId('match-item').first();
      await expect(finalMatch).toHaveAttribute('data-match-status', 'SCHEDULED');
    });

    await test.step('Record Grand Final result and verify Official Tournament Champion is crowned', async () => {
      const finalMatch = page.getByTestId('bracket-round-2').getByTestId('match-item').first();
      const finalistA = await finalMatch.getByTestId('match-player-a').textContent();

      await finalMatch.getByTestId('match-score-a-input').fill('11');
      await finalMatch.getByTestId('match-score-b-input').fill('9');
      await finalMatch.getByTestId('record-match-result-btn').click();

      await expect(pm.tournamentDetails.alertSuccess).toBeVisible();
      await expect(pm.tournamentDetails.alertSuccess).toContainText(
        /crowned the Official Tournament Winner/i,
      );

      // Verify Champion Banner & Winner Name
      await expect(page.getByTestId('tournament-champion-banner')).toBeVisible();
      if (finalistA) {
        await expect(page.getByTestId('tournament-winner-name')).toContainText(finalistA.trim());
      }
    });

    await test.step('Verify Home Dashboard displays the Latest Tournament with Champion and global Matches page lists all matches', async () => {
      await page.getByTestId('nav-dashboard').click();
      await expect(page.getByTestId('latest-tournament-spotlight')).toBeVisible();
      await expect(page.getByTestId('latest-tournament-name')).toContainText(tournamentData.name);
      await expect(page.getByTestId('latest-tournament-winner')).toBeVisible();

      // Navigate to global Matches directory (/matches) and verify matches are visible to users
      await page.getByTestId('nav-matches').click();
      await expect(page.getByTestId('matches-page')).toBeVisible();
      await page.getByTestId('match-search-input').fill(tournamentData.name);
      await expect(page.getByTestId('match-card').first()).toBeVisible();
    });
  });
});
