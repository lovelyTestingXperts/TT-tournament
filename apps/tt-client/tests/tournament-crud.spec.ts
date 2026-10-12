import { test, expect } from './fixtures';
import { TournamentAssertions, AuthAssertions } from './assertions';
import { DataFactory } from './data';

test.describe('Tournament Management CRUD & Validation Operations', () => {
  // Setup: Register and authenticate before testing tournaments
  test.beforeEach(async ({ pm, page }) => {
    const adminUser = DataFactory.createValidUser();

    // 1. Register active user
    await pm.register.goto();
    await pm.register.registerUser(adminUser);
    await AuthAssertions.assertSuccessMessageVisible(pm.register, /Registration successful/i);

    // 2. Login to obtain session
    await pm.login.goto();
    await pm.login.login(adminUser.email, adminUser.password);
    await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10000 });
    await expect(page.getByTestId('topbar')).toBeVisible();
  });

  test('CREATE: should create a new tournament successfully with valid data and show in directory', async ({ pm, page }) => {
    // 1. Navigate to Tournaments list
    await pm.tournaments.goto();
    await TournamentAssertions.assertTournamentsPageVisible(pm.tournaments);

    // 2. Click Create Tournament button
    await pm.tournaments.clickCreateTournament();
    await page.waitForURL(/\/tournaments\/create/);
    await TournamentAssertions.assertCreateTournamentFormVisible(pm.createTournament);

    // 3. Fill and submit tournament form
    const tournamentData = DataFactory.createTournamentPayload();
    await pm.createTournament.createTournament(tournamentData);

    // 4. Verify redirected to tournaments directory
    await page.waitForURL(/\/tournaments$/);
    await TournamentAssertions.assertTournamentsPageVisible(pm.tournaments);

    // 5. Search for the created tournament and verify presence
    await pm.tournaments.search(tournamentData.name);
    await TournamentAssertions.assertTournamentInGrid(pm.tournaments, tournamentData.name);
  });

  test('VALIDATION: should enforce client-side date & length constraints on tournament creation', async ({ pm, page }) => {
    await pm.createTournament.goto();
    await TournamentAssertions.assertCreateTournamentFormVisible(pm.createTournament);

    // 1. Test short name validation (< 3 chars)
    const shortNameData = DataFactory.createInvalidTournamentShortNamePayload();
    await pm.createTournament.fillForm(shortNameData);
    await pm.createTournament.submitButton.click();

    // Form should reject submission and show field error
    await expect(page.getByText(/Tournament title must be at least 3 characters/i)).toBeVisible();
    expect(page.url()).toContain('/tournaments/create');

    // 2. Test date constraint: Start date before registration deadline
    const invalidDateData = DataFactory.createInvalidTournamentDatesPayload();
    await pm.createTournament.fillForm(invalidDateData);
    await pm.createTournament.submitButton.click();

    // Form should reject submission and highlight invalid date order
    await expect(page.getByText(/Start date must be after registration deadline/i)).toBeVisible();
    expect(page.url()).toContain('/tournaments/create');
  });

  test('READ: should navigate to tournament details and inspect overview, participants, and tabs', async ({ pm, page }) => {
    // 1. Create a tournament to inspect
    await pm.tournaments.goto();
    await pm.tournaments.clickCreateTournament();
    await page.waitForURL(/\/tournaments\/create/);
    const tournamentData = DataFactory.createTournamentPayload({ category: 'Table Tennis Open' });
    await pm.createTournament.createTournament(tournamentData);
    await page.waitForURL(/\/tournaments$/);

    // 2. Find and open tournament
    await pm.tournaments.search(tournamentData.name);
    await pm.tournaments.openTournament(tournamentData.name);

    // 3. Verify details hero
    await page.waitForURL(/\/tournaments\/[a-zA-Z0-9_-]+/);
    await TournamentAssertions.assertTournamentDetailsVisible(pm.tournamentDetails, tournamentData.name);

    // 4. Test tabs switching
    await pm.tournamentDetails.switchTab('participants');
    await expect(pm.tournamentDetails.tabContentParticipants).toBeVisible();

    await pm.tournamentDetails.switchTab('matches');
    await expect(pm.tournamentDetails.tabContentMatches).toBeVisible();

    await pm.tournamentDetails.switchTab('overview');
    await expect(pm.tournamentDetails.tabContentOverview).toBeVisible();
  });

  test('UPDATE: should edit tournament details from settings tab and verify updates in real-time', async ({ pm, page }) => {
    // 1. Create a tournament
    await pm.tournaments.goto();
    await pm.tournaments.clickCreateTournament();
    await page.waitForURL(/\/tournaments\/create/);
    const tournamentData = DataFactory.createTournamentPayload();
    await pm.createTournament.createTournament(tournamentData);
    await page.waitForURL(/\/tournaments$/);

    // 2. Open details page
    await pm.tournaments.search(tournamentData.name);
    await pm.tournaments.openTournament(tournamentData.name);
    await page.waitForURL(/\/tournaments\/[a-zA-Z0-9_-]+/);

    // 3. Switch to settings tab and update tournament information
    const updatedName = `${tournamentData.name} Updated Master`;
    await pm.tournamentDetails.updateDetails({
      name: updatedName,
      category: 'Pro Table Tennis',
      prizePool: 5000,
      description: 'Updated tournament description with revised prize pool and rules.',
    });

    // 4. Verify success alert and updated hero title
    await TournamentAssertions.assertSuccessAlertVisible(
      pm.tournamentDetails,
      /Tournament details updated successfully/i,
    );
    await expect(pm.tournamentDetails.heroName).toContainText(updatedName);
  });

  test('STATUS & REGISTRATION: should change operational status and allow player registration', async ({ pm, page }) => {
    // 1. Create a tournament
    await pm.tournaments.goto();
    await pm.tournaments.clickCreateTournament();
    await page.waitForURL(/\/tournaments\/create/);
    const tournamentData = DataFactory.createTournamentPayload();
    await pm.createTournament.createTournament(tournamentData);
    await page.waitForURL(/\/tournaments$/);

    // 2. Open details page
    await pm.tournaments.search(tournamentData.name);
    await pm.tournaments.openTournament(tournamentData.name);
    await page.waitForURL(/\/tournaments\/[a-zA-Z0-9_-]+/);

    // 3. Change status to ACTIVE via Settings
    await pm.tournamentDetails.changeStatus('ACTIVE');
    await TournamentAssertions.assertSuccessAlertVisible(
      pm.tournamentDetails,
      /Tournament status updated to ACTIVE/i,
    );

    // 4. Register for tournament from hero button
    await pm.tournamentDetails.register();
    await TournamentAssertions.assertSuccessAlertVisible(
      pm.tournamentDetails,
      /Successfully registered for tournament/i,
    );

    // 5. Verify participant count updated
    await expect(pm.tournamentDetails.participantCount).toContainText('1 /');
  });

  test('DELETE: should soft-delete tournament and verify removal from directory', async ({ pm, page }) => {
    // 1. Create a tournament to delete
    await pm.tournaments.goto();
    await pm.tournaments.clickCreateTournament();
    await page.waitForURL(/\/tournaments\/create/);
    const tournamentData = DataFactory.createTournamentPayload();
    await pm.createTournament.createTournament(tournamentData);
    await page.waitForURL(/\/tournaments$/);

    // 2. Open details page
    await pm.tournaments.search(tournamentData.name);
    await pm.tournaments.openTournament(tournamentData.name);
    await page.waitForURL(/\/tournaments\/[a-zA-Z0-9_-]+/);

    // 3. Accept native browser confirm dialog and trigger delete
    page.once('dialog', async (dialog) => {
      await dialog.accept();
    });

    await pm.tournamentDetails.deleteFromHero();

    // 4. Verify redirected to directory and tournament is no longer displayed
    await page.waitForURL(/\/tournaments$/);
    await pm.tournaments.search(tournamentData.name);
    await TournamentAssertions.assertTournamentNotInGrid(pm.tournaments, tournamentData.name);
  });
});
