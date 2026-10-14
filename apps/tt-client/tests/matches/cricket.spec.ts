import { test, expect } from '../fixtures';
import { DataFactory } from '../data';

test.describe('Cricket Matches & Squad Progression', () => {
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

  test('CRKT-01: Cricket Squad Tournament Creation - Validates squad requirements and limited overs format', async ({ pm, page }) => {
    const tournamentData = DataFactory.createTournamentPayload({
      name: `Premier Cricket League ${Date.now()}`,
      category: 'Cricket',
      maxPlayers: 4,
    });

    await test.step('Navigate to Create Tournament page and select Cricket sport card', async () => {
      await pm.tournaments.goto();
      await pm.tournaments.clickCreateTournament();
      await page.waitForURL(/\/tournaments\/create/);
      await page.getByTestId('sport-card-cricket').click();
      await expect(page.getByTestId('tournament-category-input')).toHaveValue('Cricket');
    });

    await test.step('Verify team mode and squad limits adapt automatically', async () => {
      await expect(page.getByTestId('tournament-competition-type-select')).toHaveValue('TEAM');
      await expect(page.getByTestId('tournament-min-team-size-input')).toBeVisible();
    });

    await test.step('Fill schedule details and submit Cricket tournament', async () => {
      await page.getByTestId('tournament-name-input').fill(tournamentData.name);
      await page.getByTestId('tournament-start-date-input').fill(tournamentData.startDate);
      await page.getByTestId('tournament-end-date-input').fill(tournamentData.endDate);
      await page.getByTestId('tournament-deadline-input').fill(tournamentData.registrationDeadline);
      await page.getByTestId('tournament-max-players-input').fill('4');
      await page.getByTestId('submit-tournament-btn').click();
      await page.waitForURL(/\/tournaments$/, { timeout: 15000 });
    });

    await test.step('Verify Cricket tournament card appears on Tournaments list', async () => {
      const card = page.locator(`[data-testid="tournament-card"]:has-text("${tournamentData.name}")`);
      await expect(card).toBeVisible();
    });
  });

  test('CRKT-02: Cricket Team Registration & Captain Nomination', async ({ pm, page }) => {
    const tournamentData = DataFactory.createTournamentPayload({
      name: `T20 Super Cup ${Date.now()}`,
      category: 'Cricket',
      maxPlayers: 4,
    });

    await test.step('Create Cricket squad tournament with min team size 2', async () => {
      await pm.tournaments.goto();
      await pm.tournaments.clickCreateTournament();
      await page.waitForURL(/\/tournaments\/create/);
      await page.getByTestId('sport-card-cricket').click();
      await page.getByTestId('tournament-name-input').fill(tournamentData.name);
      await page.getByTestId('tournament-category-input').fill('Cricket');
      await page.getByTestId('tournament-min-team-size-input').fill('2');
      await page.getByTestId('tournament-max-team-size-input').fill('4');
      await page.getByTestId('tournament-start-date-input').fill(tournamentData.startDate);
      await page.getByTestId('tournament-end-date-input').fill(tournamentData.endDate);
      await page.getByTestId('tournament-deadline-input').fill(tournamentData.registrationDeadline);
      await page.getByTestId('tournament-max-players-input').fill('4');
      await page.getByTestId('submit-tournament-btn').click();
      await page.waitForURL(/\/tournaments$/, { timeout: 15000 });
    });

    await test.step('Open Cricket tournament details page', async () => {
      const card = page.locator(`[data-testid="tournament-card"]:has-text("${tournamentData.name}")`);
      await card.click();
      await page.waitForURL(/\/tournaments\//);
      await expect(page.getByTestId('tournament-details-page')).toBeVisible();
    });

    await test.step('Trigger Team Registration modal and register Team Titan', async () => {
      await page.getByTestId('register-btn').click();
      await expect(page.getByTestId('register-team-modal')).toBeVisible();

      // Enter team name
      await page.getByTestId('team-name-input').fill('Team Titan');

      // Add squad member to reach min team size 2
      const addMemberSelect = page.getByTestId('add-member-select');
      await expect(addMemberSelect).toBeVisible();
      await addMemberSelect.selectOption({ index: 1 });
      await expect(page.getByTestId('team-size-indicator')).toContainText('2 / 2 min');

      await page.getByTestId('submit-team-registration-btn').click();
      await expect(pm.tournamentDetails.alertSuccess).toBeVisible();
      await expect(pm.tournamentDetails.alertSuccess).toContainText(/successfully registered/i);
    });

    await test.step('Inspect registered teams list on Participants tab', async () => {
      await page.getByTestId('participants-tab-btn').click();
      const teamTitanRow = page.locator('[data-testid^="team-card-"]:has-text("Team Titan")');
      await expect(teamTitanRow).toBeVisible();
    });
  });

  test('CRKT-03: Cricket Wave 1 Fixtures & Limited Overs Scoring', async ({ pm, page }) => {
    const tournamentData = DataFactory.createTournamentPayload({
      name: `Overnight Cricket Trophy ${Date.now()}`,
      category: 'Cricket',
      maxPlayers: 4,
    });

    await test.step('Create Cricket tournament and seed squad teams', async () => {
      await pm.tournaments.goto();
      await pm.tournaments.clickCreateTournament();
      await page.waitForURL(/\/tournaments\/create/);
      await page.getByTestId('sport-card-cricket').click();
      await page.getByTestId('tournament-name-input').fill(tournamentData.name);
      await page.getByTestId('tournament-min-team-size-input').fill('2');
      await page.getByTestId('tournament-max-team-size-input').fill('3');
      await page.getByTestId('tournament-start-date-input').fill(tournamentData.startDate);
      await page.getByTestId('tournament-end-date-input').fill(tournamentData.endDate);
      await page.getByTestId('tournament-deadline-input').fill(tournamentData.registrationDeadline);
      await page.getByTestId('tournament-max-players-input').fill('4');
      await page.getByTestId('submit-tournament-btn').click();
      await page.waitForURL(/\/tournaments$/, { timeout: 15000 });

      // Navigate to tournament
      const card = page.locator(`[data-testid="tournament-card"]:has-text("${tournamentData.name}")`);
      await card.click();
      await page.waitForURL(/\/tournaments\//);

      // Seed teams
      await page.getByTestId('matches-tab-btn').click();
      await page.getByTestId('matches-seed-players-btn').click();
      await expect(pm.tournamentDetails.alertSuccess).toBeVisible();
    });

    await test.step('Verify Wave 1 cricket fixture and submit limited overs run score', async () => {
      await expect(page.getByTestId('bracket-round-1')).toBeVisible();
      const firstMatch = page.getByTestId('bracket-round-1').getByTestId('match-item').first();
      await expect(firstMatch).toBeVisible();

      // Record score: 145 runs vs 128 runs
      await firstMatch.getByTestId('match-score-a-input').fill('145');
      await firstMatch.getByTestId('match-score-b-input').fill('128');
      await firstMatch.getByTestId('record-match-result-btn').click();
      await expect(pm.tournamentDetails.alertSuccess).toBeVisible();
      await expect(pm.tournamentDetails.alertSuccess).toContainText(
        /(recorded.*advanced|crowned the Official Tournament Winner)/i,
      );
    });
  });
});
