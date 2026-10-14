import { test, expect } from './fixtures';
import { DataFactory } from './data';

test.describe('Tournament Management CRUD & Validation Operations', () => {
  // Setup: Register and authenticate before testing tournaments
  test.beforeEach(async ({ pm, page }) => {
    const adminUser = DataFactory.createValidUser();

    await test.step('Register active admin user', async () => {
      await pm.register.goto();
      await pm.register.registerUser(adminUser);
      await expect(pm.register.successMessage).toBeVisible();
      await expect(pm.register.successMessage).toContainText(/Registration successful/i);
    });

    await test.step('Login to obtain active session', async () => {
      await pm.login.goto();
      await pm.login.login(adminUser.email, adminUser.password);
      await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10000 });
      await expect(page.getByTestId('topbar')).toBeVisible();
    });
  });

  test('CREATE: should create a new tournament successfully with valid data and show in directory', async ({ pm, page }) => {
    const tournamentData = DataFactory.createTournamentPayload();

    await test.step('Navigate to tournaments list', async () => {
      await pm.tournaments.goto();
      await expect(pm.tournaments.pageContainer).toBeVisible();
      await expect(pm.tournaments.header).toBeVisible();
      await expect(pm.tournaments.createTournamentButton).toBeVisible();
      await expect(pm.tournaments.searchInput).toBeVisible();
    });

    await test.step('Open tournament creation form', async () => {
      await pm.tournaments.clickCreateTournament();
      await page.waitForURL(/\/tournaments\/create/);
      await expect(pm.createTournament.pageContainer).toBeVisible();
      await expect(pm.createTournament.form).toBeVisible();
      await expect(pm.createTournament.nameInput).toBeVisible();
      await expect(pm.createTournament.categoryInput).toBeVisible();
      await expect(pm.createTournament.typeSelect).toBeVisible();
      await expect(pm.createTournament.formatSelect).toBeVisible();
      await expect(pm.createTournament.submitButton).toBeVisible();
    });

    await test.step('Fill and submit tournament form with valid payload', async () => {
      await pm.createTournament.createTournament(tournamentData);
    });

    await test.step('Verify redirection back to tournaments directory', async () => {
      await page.waitForURL(/\/tournaments$/);
      await expect(pm.tournaments.pageContainer).toBeVisible();
      await expect(pm.tournaments.header).toBeVisible();
      await expect(pm.tournaments.createTournamentButton).toBeVisible();
      await expect(pm.tournaments.searchInput).toBeVisible();
    });

    await test.step('Search for created tournament and verify presence in grid', async () => {
      await pm.tournaments.search(tournamentData.name);
      await expect(pm.tournaments.getTournamentCard(tournamentData.name)).toBeVisible();
    });
  });

  test('VALIDATION: should enforce client-side date & length constraints on tournament creation', async ({ pm, page }) => {
    await test.step('Navigate to tournament creation page', async () => {
      await pm.createTournament.goto();
      await expect(pm.createTournament.pageContainer).toBeVisible();
      await expect(pm.createTournament.form).toBeVisible();
      await expect(pm.createTournament.nameInput).toBeVisible();
      await expect(pm.createTournament.categoryInput).toBeVisible();
      await expect(pm.createTournament.typeSelect).toBeVisible();
      await expect(pm.createTournament.formatSelect).toBeVisible();
      await expect(pm.createTournament.submitButton).toBeVisible();
    });

    await test.step('Verify title minimum length constraint (< 3 characters)', async () => {
      const shortNameData = DataFactory.createInvalidTournamentShortNamePayload();
      await pm.createTournament.fillForm(shortNameData);
      await pm.createTournament.submitButton.click();

      // Form should reject submission and show field error
      await expect(page.getByText(/Tournament title must be at least 3 characters/i)).toBeVisible();
      expect(page.url()).toContain('/tournaments/create');
    });

    await test.step('Verify chronological date constraint (start date after registration deadline)', async () => {
      const invalidDateData = DataFactory.createInvalidTournamentDatesPayload();
      await pm.createTournament.fillForm(invalidDateData);
      await pm.createTournament.submitButton.click();

      // Form should reject submission and highlight invalid date order
      await expect(page.getByText(/Start date must be after registration deadline/i)).toBeVisible();
      expect(page.url()).toContain('/tournaments/create');
    });
  });

  test('READ: should navigate to tournament details and inspect overview, participants, and tabs', async ({ pm, page }) => {
    const tournamentData = DataFactory.createTournamentPayload({ category: 'Table Tennis Open' });

    await test.step('Create tournament prerequisite', async () => {
      await pm.tournaments.goto();
      await pm.tournaments.clickCreateTournament();
      await page.waitForURL(/\/tournaments\/create/);
      await pm.createTournament.createTournament(tournamentData);
      await page.waitForURL(/\/tournaments$/);
    });

    await test.step('Search and navigate to tournament details page', async () => {
      await pm.tournaments.search(tournamentData.name);
      await pm.tournaments.openTournament(tournamentData.name);
      await page.waitForURL(/\/tournaments\/[a-zA-Z0-9_-]+/);
      await expect(pm.tournamentDetails.pageContainer).toBeVisible();
      await expect(pm.tournamentDetails.hero).toBeVisible();
      await expect(pm.tournamentDetails.heroName).toContainText(tournamentData.name);
    });

    await test.step('Switch between tabs and verify content containers', async () => {
      await pm.tournamentDetails.switchTab('participants');
      await expect(pm.tournamentDetails.tabContentParticipants).toBeVisible();

      await pm.tournamentDetails.switchTab('matches');
      await expect(pm.tournamentDetails.tabContentMatches).toBeVisible();

      await pm.tournamentDetails.switchTab('overview');
      await expect(pm.tournamentDetails.tabContentOverview).toBeVisible();
    });
  });

  test('UPDATE: should edit tournament details from settings tab and verify updates in real-time', async ({ pm, page }) => {
    const tournamentData = DataFactory.createTournamentPayload();
    const updatedName = `${tournamentData.name} Updated Master`;

    await test.step('Create tournament prerequisite', async () => {
      await pm.tournaments.goto();
      await pm.tournaments.clickCreateTournament();
      await page.waitForURL(/\/tournaments\/create/);
      await pm.createTournament.createTournament(tournamentData);
      await page.waitForURL(/\/tournaments$/);
    });

    await test.step('Navigate to tournament details page', async () => {
      await pm.tournaments.search(tournamentData.name);
      await pm.tournaments.openTournament(tournamentData.name);
      await page.waitForURL(/\/tournaments\/[a-zA-Z0-9_-]+/);
    });

    await test.step('Update tournament settings with new fields', async () => {
      await pm.tournamentDetails.updateDetails({
        name: updatedName,
        category: 'Pro Table Tennis',
        prizePool: 5000,
        description: 'Updated tournament description with revised prize pool and rules.',
      });
    });

    await test.step('Verify success alert and updated hero title in real-time', async () => {
      await expect(pm.tournamentDetails.alertSuccess).toBeVisible();
      await expect(pm.tournamentDetails.alertSuccess).toContainText(
        /Tournament details updated successfully/i,
      );
      await expect(pm.tournamentDetails.heroName).toContainText(updatedName);
    });
  });

  test('STATUS & REGISTRATION: should change operational status and allow player registration', async ({ pm, page }) => {
    const tournamentData = DataFactory.createTournamentPayload();

    await test.step('Create tournament prerequisite', async () => {
      await pm.tournaments.goto();
      await pm.tournaments.clickCreateTournament();
      await page.waitForURL(/\/tournaments\/create/);
      await pm.createTournament.createTournament(tournamentData);
      await page.waitForURL(/\/tournaments$/);
    });

    await test.step('Navigate to tournament details page', async () => {
      await pm.tournaments.search(tournamentData.name);
      await pm.tournaments.openTournament(tournamentData.name);
      await page.waitForURL(/\/tournaments\/[a-zA-Z0-9_-]+/);
    });

    await test.step('Change status to ACTIVE via Settings tab', async () => {
      await pm.tournamentDetails.changeStatus('ACTIVE');
      await expect(pm.tournamentDetails.alertSuccess).toBeVisible();
      await expect(pm.tournamentDetails.alertSuccess).toContainText(
        /Tournament status updated to ACTIVE/i,
      );
    });

    await test.step('Register current authenticated user for tournament', async () => {
      await pm.tournamentDetails.register();
      await expect(pm.tournamentDetails.alertSuccess).toBeVisible();
      await expect(pm.tournamentDetails.alertSuccess).toContainText(
        /Successfully registered for tournament/i,
      );
    });

    await test.step('Verify participant count incremented', async () => {
      await expect(pm.tournamentDetails.participantCount).toContainText('1 /');
    });
  });

  test('DELETE: should soft-delete tournament and verify removal from directory', async ({ pm, page }) => {
    const tournamentData = DataFactory.createTournamentPayload();

    await test.step('Create tournament prerequisite', async () => {
      await pm.tournaments.goto();
      await pm.tournaments.clickCreateTournament();
      await page.waitForURL(/\/tournaments\/create/);
      await pm.createTournament.createTournament(tournamentData);
      await page.waitForURL(/\/tournaments$/);
    });

    await test.step('Navigate to tournament details page', async () => {
      await pm.tournaments.search(tournamentData.name);
      await pm.tournaments.openTournament(tournamentData.name);
      await page.waitForURL(/\/tournaments\/[a-zA-Z0-9_-]+/);
    });

    await test.step('Accept confirmation dialog and delete tournament from hero', async () => {
      page.once('dialog', async (dialog) => {
        await dialog.accept();
      });
      await pm.tournamentDetails.deleteFromHero();
    });

    await test.step('Verify redirection and tournament removed from directory', async () => {
      await page.waitForURL(/\/tournaments$/);
      await pm.tournaments.search(tournamentData.name);
      await expect(pm.tournaments.getTournamentCard(tournamentData.name)).not.toBeVisible();
    });
  });
});
