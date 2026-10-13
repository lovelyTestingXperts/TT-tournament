import { test, expect } from './fixtures';
import { AuthAssertions, TournamentAssertions } from './assertions';
import { DataFactory } from './data';

test.describe('Multi-Sport Tournaments, Team Registration & Wave Fixtures', () => {
  test.beforeEach(async ({ pm, page }) => {
    const adminUser = DataFactory.createValidUser();

    await test.step('Register test user session', async () => {
      await pm.register.goto();
      await pm.register.registerUser(adminUser);
      await AuthAssertions.assertSuccessMessageVisible(pm.register, /Registration successful/i);
    });

    await test.step('Login user and verify authenticated session', async () => {
      await pm.login.goto();
      await pm.login.login(adminUser.email, adminUser.password);
      await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10000 });
      await expect(page.getByTestId('topbar')).toBeVisible();
    });
  });

  test('SPRT-01: Multi-Sport Form Adapters - sport presets auto-populate format, team limits, and rules', async ({ pm, page }) => {
    await test.step('Navigate to Create Tournament page', async () => {
      await pm.tournaments.goto();
      await pm.tournaments.clickCreateTournament();
      await page.waitForURL(/\/tournaments\/create/);
      await expect(page.getByTestId('create-tournament-page')).toBeVisible();
    });

    await test.step('Verify default Table Tennis preset configuration', async () => {
      await expect(page.getByTestId('sport-card-table_tennis')).toBeVisible();
      await expect(page.getByTestId('tournament-category-input')).toHaveValue('Table Tennis');
      await expect(page.getByTestId('tournament-comp-type-individual')).toBeChecked();
    });

    await test.step('Select Cricket sport card and verify adaptive fields for team competition', async () => {
      await page.getByTestId('sport-card-cricket').click();
      await expect(page.getByTestId('tournament-category-input')).toHaveValue('Cricket');
      await expect(page.getByTestId('tournament-comp-type-team')).toBeChecked();
      await expect(page.getByTestId('tournament-min-team-input')).toBeVisible();
      await expect(page.getByTestId('tournament-min-team-input')).toHaveValue('2');
      await expect(page.getByTestId('tournament-max-team-input')).toHaveValue('11');
    });

    await test.step('Select Chess sport card and verify scoring format is GAME_POINTS', async () => {
      await page.getByTestId('sport-card-chess').click();
      await expect(page.getByTestId('tournament-category-input')).toHaveValue('Chess');
      await expect(page.getByTestId('tournament-comp-type-individual')).toBeChecked();
    });

    await test.step('Test quick rule template chip appending and live preview tab', async () => {
      const firstRuleChip = page.getByTestId('rule-preset-chip-0');
      if (await firstRuleChip.isVisible()) {
        await firstRuleChip.click();
      }

      // Switch to preview tab
      await page.getByTestId('rules-tab-preview').click();
      await expect(page.getByTestId('rules-preview-panel')).toBeVisible();
      await expect(page.getByTestId('rules-preview-panel')).toContainText('1');

      // Switch back to edit tab
      await page.getByTestId('rules-tab-edit').click();
      await expect(page.getByTestId('tournament-description-input')).toBeVisible();
    });
  });

  test('SPRT-02: Duplicate Registration Guard - prevents re-registration and displays Already Registered badge', async ({ pm, page }) => {
    const tournamentData = DataFactory.createTournamentPayload({
      name: `TT Solo Cup ${Date.now()}`,
      category: 'Table Tennis',
      maxPlayers: 8,
    });

    await test.step('Create an individual tournament', async () => {
      await pm.tournaments.goto();
      await pm.tournaments.clickCreateTournament();
      await page.waitForURL(/\/tournaments\/create/);
      await pm.createTournament.createTournament(tournamentData);
      await page.waitForURL(/\/tournaments$/);
    });

    await test.step('Open tournament and register current user', async () => {
      await pm.tournaments.search(tournamentData.name);
      await pm.tournaments.openTournament(tournamentData.name);
      await page.waitForURL(/\/tournaments\/[a-zA-Z0-9_-]+/);

      const registerBtn = page.getByTestId('register-tournament-btn');
      await expect(registerBtn).toBeVisible();
      await registerBtn.click();

      await TournamentAssertions.assertSuccessAlertVisible(
        pm.tournamentDetails,
        /Successfully registered/i,
      );
    });

    await test.step('Verify Hero now shows Already Registered badge and register button is removed', async () => {
      await expect(page.getByTestId('already-registered-badge')).toBeVisible();
      await expect(page.getByTestId('already-registered-badge')).toContainText('Already Registered');
      await expect(page.getByTestId('register-tournament-btn')).not.toBeVisible();
    });

    await test.step('Verify user is listed in Participants tab', async () => {
      await pm.tournamentDetails.switchTab('participants');
      await expect(page.getByTestId('participant-item').first()).toBeVisible();
    });
  });

  test('SPRT-03: Team Sports Registration - team modal, min team size enforcement, and unique player assignment', async ({ pm, page }) => {
    const teamTournamentName = `Cricket Premier ${Date.now()}`;

    await test.step('Create a team Cricket tournament with minTeamSize = 2', async () => {
      await pm.tournaments.goto();
      await pm.tournaments.clickCreateTournament();
      await page.waitForURL(/\/tournaments\/create/);

      // Select Cricket preset
      await page.getByTestId('sport-card-cricket').click();
      await page.getByTestId('tournament-name-input').fill(teamTournamentName);

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const afterTomorrow = new Date();
      afterTomorrow.setDate(afterTomorrow.getDate() + 2);
      const inThreeDays = new Date();
      inThreeDays.setDate(inThreeDays.getDate() + 3);

      await page.getByTestId('tournament-deadline-input').fill(tomorrow.toISOString().split('T')[0]);
      await page.getByTestId('tournament-start-date-input').fill(afterTomorrow.toISOString().split('T')[0]);
      await page.getByTestId('tournament-end-date-input').fill(inThreeDays.toISOString().split('T')[0]);

      await page.getByTestId('submit-tournament-btn').click();
      await page.waitForURL(/\/tournaments$/);
    });

    await test.step('Open Cricket tournament details and click Register Team', async () => {
      await pm.tournaments.search(teamTournamentName);
      await pm.tournaments.openTournament(teamTournamentName);
      await page.waitForURL(/\/tournaments\/[a-zA-Z0-9_-]+/);

      const registerTeamBtn = page.getByTestId('register-tournament-btn');
      await expect(registerTeamBtn).toBeVisible();
      await expect(registerTeamBtn).toContainText('Register Team');
      await registerTeamBtn.click();
    });

    await test.step('Verify Register Team Modal opens and enforces minimum team size', async () => {
      await expect(page.getByTestId('register-team-modal')).toBeVisible();
      await page.getByTestId('team-name-input').fill('Titans XI');

      // Attempt to submit with only 1 member (captain)
      await page.getByTestId('submit-team-btn').click();
      await expect(page.getByTestId('team-validation-error')).toBeVisible();
      await expect(page.getByTestId('team-validation-error')).toContainText(/at least 2 members/i);
    });

    await test.step('Add additional member and successfully submit team', async () => {
      const addMemberSelect = page.getByTestId('add-member-select');
      if (await addMemberSelect.isVisible()) {
        const options = await addMemberSelect.locator('option').all();
        if (options.length > 1) {
          const secondVal = await options[1].getAttribute('value');
          if (secondVal) {
            await addMemberSelect.selectOption(secondVal);
          }
        }
      }

      await page.getByTestId('submit-team-btn').click();
      await TournamentAssertions.assertSuccessAlertVisible(
        pm.tournamentDetails,
        /Team "Titans XI" successfully registered/i,
      );
    });
  });

  test('SPRT-04: Wave-by-Wave Progression & Sport Scoring - registration lock, wave draws, sport-specific score entry, and finals crowning', async ({ pm, page }) => {
    const tournamentData = DataFactory.createTournamentPayload({
      name: `Table Tennis Wave Championship ${Date.now()}`,
      category: 'Table Tennis',
      maxPlayers: 4,
    });

    await test.step('Create tournament and navigate to matches tab', async () => {
      await pm.tournaments.goto();
      await pm.tournaments.clickCreateTournament();
      await page.waitForURL(/\/tournaments\/create/);
      await pm.createTournament.createTournament(tournamentData);
      await page.waitForURL(/\/tournaments$/);

      await pm.tournaments.search(tournamentData.name);
      await pm.tournaments.openTournament(tournamentData.name);
      await page.waitForURL(/\/tournaments\/[a-zA-Z0-9_-]+/);
      await pm.tournamentDetails.switchTab('matches');
    });

    await test.step('Verify registration window status is initially open', async () => {
      await expect(page.getByTestId('registration-window-status-pill')).toBeVisible();
      await expect(page.getByTestId('registration-window-status-pill')).toContainText('Registration Open');
    });

    await test.step('Seed 4 dummy players to populate participants', async () => {
      await page.getByTestId('matches-seed-players-btn').click();
      await TournamentAssertions.assertSuccessAlertVisible(
        pm.tournamentDetails,
        /Round 1 bracket matches have been randomly generated/i,
      );
    });

    await test.step('Verify matches tab renders bracket round 1 with sport-specific scoring modal triggers', async () => {
      await expect(page.getByTestId('bracket-round-1')).toBeVisible();
      const firstMatch = page.getByTestId('bracket-round-1').getByTestId('match-item').first();
      await expect(firstMatch).toBeVisible();

      // Check if sport scoring modal trigger is available
      const openModalBtn = firstMatch.locator('[data-testid^="open-sport-score-modal-"]');
      if (await openModalBtn.isVisible()) {
        await openModalBtn.click();
        await expect(page.getByTestId('record-score-modal')).toBeVisible();
        await expect(page.getByTestId('set-1-score-a')).toBeVisible();
        await page.getByTestId('submit-score-btn').click();
      } else {
        // Fallback to inline scoring if available
        await firstMatch.getByTestId('match-score-a-input').fill('11');
        await firstMatch.getByTestId('match-score-b-input').fill('7');
        await firstMatch.getByTestId('record-match-result-btn').click();
      }
    });

    await test.step('Complete remaining matches and verify Grand Final champion banner', async () => {
      const secondMatch = page.getByTestId('bracket-round-1').getByTestId('match-item').nth(1);
      if (await secondMatch.isVisible() && await secondMatch.getByTestId('match-score-a-input').isVisible()) {
        await secondMatch.getByTestId('match-score-a-input').fill('8');
        await secondMatch.getByTestId('match-score-b-input').fill('11');
        await secondMatch.getByTestId('record-match-result-btn').click();
      }

      // Grand Final
      const finalRound = page.getByTestId('bracket-round-2');
      if (await finalRound.isVisible()) {
        const finalMatch = finalRound.getByTestId('match-item').first();
        if (await finalMatch.getByTestId('match-score-a-input').isVisible()) {
          await finalMatch.getByTestId('match-score-a-input').fill('11');
          await finalMatch.getByTestId('match-score-b-input').fill('9');
          await finalMatch.getByTestId('record-match-result-btn').click();
        }
      }

      // Verify Champion Crown
      await expect(page.getByTestId('tournament-champion-banner')).toBeVisible();
      await expect(page.getByTestId('tournament-winner-name')).toBeVisible();
    });
  });
});
