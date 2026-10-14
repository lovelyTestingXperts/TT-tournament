import { test, expect } from '../fixtures';
import { DataFactory } from '../data';

test.describe('Match Arena - Round Configuration, Live Scoring & Team Registration', () => {
  test.beforeEach(async ({ pm, page }) => {
    const adminUser = DataFactory.createValidUser();

    await test.step('Register test user session', async () => {
      await pm.register.goto();
      await pm.register.registerUser(adminUser);
      await expect(pm.register.successMessage).toBeVisible();
      await expect(pm.register.successMessage).toContainText(/Registration successful/i);
    });

    await test.step('Login user and verify session', async () => {
      await pm.login.goto();
      await pm.login.login(adminUser.email, adminUser.password);
      await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10000 });
      await expect(page.getByTestId('topbar')).toBeVisible();
    });
  });

  test('ARENA-01: Configure Best-of-3 rounds, initiate live match, record round-by-round results, and finalize match winner', async ({ pm, page }) => {
    const tournamentData = DataFactory.createTournamentPayload({
      name: `Arena Championship ${Date.now()}`,
      category: 'Table Tennis',
      maxPlayers: 4,
    });

    await test.step('Create tournament and generate matches', async () => {
      await pm.tournaments.goto();
      await pm.tournaments.clickCreateTournament();
      await page.waitForURL(/\/tournaments\/create/);
      await page.getByTestId('sport-card-table_tennis').click();
      await pm.createTournament.createTournament(tournamentData);
      await page.waitForURL(/\/tournaments$/, { timeout: 15000 });

      // Open tournament details
      const card = page.locator(`[data-testid="tournament-card"]:has-text("${tournamentData.name}")`);
      await card.click();
      await page.waitForURL(/\/tournaments\//);

      // Seed dummy players
      await page.getByTestId('matches-tab-btn').click();
      await page.getByTestId('matches-seed-players-btn').click();
      await expect(pm.tournamentDetails.alertSuccess).toBeVisible();
    });

    await test.step('Navigate to Match Arena page from first scheduled match', async () => {
      await expect(page.getByTestId('bracket-round-1')).toBeVisible();
      const firstMatch = page.getByTestId('bracket-round-1').getByTestId('match-item').first();
      const matchId = await firstMatch.getAttribute('data-match-id');
      expect(matchId).toBeTruthy();

      const arenaBtn = firstMatch.getByTestId(`enter-match-arena-${matchId}-btn`);
      await expect(arenaBtn).toBeVisible();
      await arenaBtn.click();
      await page.waitForURL(new RegExp(`/matches/${matchId}`));
      await expect(page.getByTestId('match-arena-page')).toBeVisible();
    });

    await test.step('Verify Match Configuration stage and select Best of 3 format', async () => {
      await expect(page.getByTestId('match-start-config-card')).toBeVisible();
      await expect(page.getByTestId('select-format-BEST_OF_3')).toBeVisible();
      await page.getByTestId('select-format-BEST_OF_3').click();
    });

    await test.step('Start Match and verify transition to LIVE status', async () => {
      const startBtn = page.getByTestId('start-match-btn');
      await expect(startBtn).toBeVisible();
      await startBtn.click();

      await expect(page.getByTestId('match-status-badge')).toHaveAttribute('data-status', 'LIVE');
      await expect(page.getByTestId('live-scoring-arena')).toBeVisible();
      await expect(page.getByTestId('active-round-card')).toBeVisible();
    });

    await test.step('Record Round 1: Player A wins 11 - 8', async () => {
      await page.getByTestId('round-score-a-input').fill('11');
      await page.getByTestId('round-score-b-input').fill('8');
      await page.getByTestId('save-round-btn').click();

      // Verify Round 1 recorded in completed history
      await expect(page.getByTestId('round-result-row-1')).toBeVisible();
      await expect(page.getByTestId('player-a-overall-score')).toHaveText('1');
    });

    await test.step('Record Round 2: Player A wins 11 - 6 to clinch Best of 3 match', async () => {
      await page.getByTestId('round-score-a-input').fill('11');
      await page.getByTestId('round-score-b-input').fill('6');
      await page.getByTestId('save-round-btn').click();

      // Verify Match Clinch celebration banner appears
      await expect(page.getByTestId('match-clinch-banner')).toBeVisible();
      await expect(page.getByTestId('player-a-overall-score')).toHaveText('2');
    });

    await test.step('Finalize and record match result to advance winner', async () => {
      const finalizeBtn = page.getByTestId('finalize-match-btn');
      await expect(finalizeBtn).toBeVisible();
      await finalizeBtn.click();

      await expect(page.getByTestId('completed-match-summary')).toBeVisible();
      await expect(page.getByTestId('match-status-badge')).toHaveAttribute('data-status', 'COMPLETED');
    });
  });

  test('ARENA-02: Team registration in team tournament succeeds without GraphQL variable errors', async ({ pm, page }) => {
    const tournamentData = DataFactory.createTournamentPayload({
      name: `Team Registration Cup ${Date.now()}`,
      category: 'Cricket',
      maxPlayers: 4,
    });

    await test.step('Create a Team tournament', async () => {
      await pm.tournaments.goto();
      await pm.tournaments.clickCreateTournament();
      await page.waitForURL(/\/tournaments\/create/);
      await page.getByTestId('sport-card-cricket').click();
      await page.getByTestId('tournament-name-input').fill(tournamentData.name);
      await page.getByTestId('tournament-category-input').fill('Cricket Tournament');
      await page.getByTestId('tournament-competition-type-select').selectOption('TEAM');
      await page.getByTestId('tournament-min-team-size-input').fill('2');
      await page.getByTestId('tournament-max-team-size-input').fill('4');
      await page.getByTestId('tournament-start-date-input').fill(tournamentData.startDate);
      await page.getByTestId('tournament-end-date-input').fill(tournamentData.endDate);
      await page.getByTestId('tournament-deadline-input').fill(tournamentData.registrationDeadline);
      await page.getByTestId('submit-tournament-btn').click();
      await page.waitForURL(/\/tournaments$/, { timeout: 15000 });
    });

    await test.step('Open tournament and click Register Team', async () => {
      const card = page.locator(`[data-testid="tournament-card"]:has-text("${tournamentData.name}")`);
      await card.click();
      await page.waitForURL(/\/tournaments\//);

      const registerTeamBtn = page.getByTestId('register-tournament-btn');
      await expect(registerTeamBtn).toBeVisible();
      await registerTeamBtn.click();
      await expect(page.getByTestId('register-team-modal')).toBeVisible();
    });

    await test.step('Fill team details with team name and submit', async () => {
      await page.getByTestId('team-name-input').fill('Royal Strikers');

      // Add a teammate from dropdown if available
      const memberSelect = page.getByTestId('add-member-select');
      const count = await memberSelect.locator('option').count();
      if (count > 1) {
        await memberSelect.selectOption({ index: 1 });
      }

      await page.getByTestId('submit-register-team-btn').click();

      // Verify no GraphQL error alert is shown and success banner appears
      await expect(page.getByTestId('tournament-action-error')).not.toBeVisible();
      await expect(pm.tournamentDetails.alertSuccess).toBeVisible();
      await expect(pm.tournamentDetails.alertSuccess).toContainText(/successfully registered/i);
    });
  });

  test('ARENA-03: Match Module Redesign - Horizontal capsules, relevance grouping, and interactive Championship Tree View', async ({ page }) => {
    await test.step('Navigate to /matches and verify redesigned Matches page header and controls', async () => {
      await page.goto('/matches');
      await page.waitForURL(/\/matches$/);
      await expect(page.getByTestId('matches-page')).toBeVisible();
      await expect(page.getByTestId('match-header')).toBeVisible();
      await expect(page.getByTestId('match-search-input')).toBeVisible();
      await expect(page.getByTestId('match-status-select')).toBeVisible();
      await expect(page.getByTestId('view-mode-capsules-btn')).toBeVisible();
      await expect(page.getByTestId('view-mode-tree-btn')).toBeVisible();
    });

    await test.step('Verify match capsules render in matches-grid or empty state handles cleanly', async () => {
      await expect(page.getByTestId('loading-spinner')).not.toBeVisible({ timeout: 10000 });
      const hasCards = (await page.getByTestId('match-card').count()) > 0;
      if (hasCards) {
        await expect(page.getByTestId('matches-grid')).toBeVisible();
        await expect(page.getByTestId('match-card').first()).toBeVisible();
      } else {
        await expect(page.getByTestId('empty-state')).toBeVisible();
      }
    });

    await test.step('Toggle Group by Tournament view', async () => {
      const groupToggle = page.getByTestId('group-by-tournament-toggle');
      if (await groupToggle.isVisible()) {
        await groupToggle.click();
        await expect(groupToggle).toHaveClass(/border-primary/);
        // Toggle back to Smart Relevance Feed
        await groupToggle.click();
      }
    });

    await test.step('Switch to Championship Tree View and verify interactive bracket tree', async () => {
      await page.getByTestId('view-mode-tree-btn').click();
      await expect(page.getByTestId('view-mode-tree-btn')).toHaveClass(/bg-primary/);

      // Verify either tree or empty state is rendered
      const treeView = page.getByTestId('tournament-tree-view');
      const emptyMatches = page.locator('text=No Bracket Matches Available');

      const isTreeOrEmpty = (await treeView.isVisible()) || (await emptyMatches.isVisible());
      expect(isTreeOrEmpty).toBeTruthy();
    });

    await test.step('Switch back to Capsule Feed view', async () => {
      await page.getByTestId('view-mode-capsules-btn').click();
      await expect(page.getByTestId('view-mode-capsules-btn')).toHaveClass(/bg-primary/);
    });
  });
});
