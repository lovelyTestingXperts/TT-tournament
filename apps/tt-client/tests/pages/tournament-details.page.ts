import { Page, Locator } from '@playwright/test';

export interface UpdateTournamentData {
  name?: string;
  category?: string;
  prizePool?: number;
  description?: string;
}

export class TournamentDetailsPage {
  readonly page: Page;
  readonly pageContainer: Locator;
  readonly hero: Locator;
  readonly heroName: Locator;
  readonly deleteTournamentButton: Locator;
  readonly registerTournamentButton: Locator;
  readonly participantCount: Locator;
  readonly tabOverview: Locator;
  readonly tabParticipants: Locator;
  readonly tabMatches: Locator;
  readonly tabSettings: Locator;
  readonly tabContentOverview: Locator;
  readonly tabContentParticipants: Locator;
  readonly tabContentMatches: Locator;
  readonly tabContentSettings: Locator;

  // Settings tab form controls
  readonly editForm: Locator;
  readonly editNameInput: Locator;
  readonly editCategoryInput: Locator;
  readonly editPrizePoolInput: Locator;
  readonly editDescriptionInput: Locator;
  readonly saveSettingsButton: Locator;
  readonly deleteSettingsButton: Locator;

  // Feedback alerts
  readonly alertSuccess: Locator;
  readonly alertError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageContainer = page.getByTestId('tournament-details-page');
    this.hero = page.getByTestId('tournament-hero');
    this.heroName = page.getByTestId('tournament-hero-name');
    this.deleteTournamentButton = page.getByTestId('delete-tournament-btn');
    this.registerTournamentButton = page.getByTestId('register-tournament-btn');
    this.participantCount = page.getByTestId('tournament-participant-count');

    // Tabs
    this.tabOverview = page.getByTestId('tab-overview');
    this.tabParticipants = page.getByTestId('tab-participants');
    this.tabMatches = page.getByTestId('tab-matches');
    this.tabSettings = page.getByTestId('tab-settings');

    // Tab contents
    this.tabContentOverview = page.getByTestId('tab-content-overview');
    this.tabContentParticipants = page.getByTestId('tab-content-participants');
    this.tabContentMatches = page.getByTestId('tab-content-matches');
    this.tabContentSettings = page.getByTestId('tab-content-settings');

    // Settings controls
    this.editForm = page.getByTestId('edit-tournament-form');
    this.editNameInput = page.getByTestId('tournament-edit-name-input');
    this.editCategoryInput = page.getByTestId('tournament-edit-category-input');
    this.editPrizePoolInput = page.getByTestId('tournament-edit-prize-pool-input');
    this.editDescriptionInput = page.getByTestId('tournament-edit-description-input');
    this.saveSettingsButton = page.getByTestId('save-tournament-settings-btn');
    this.deleteSettingsButton = page.getByTestId('delete-tournament-settings-btn');

    // Alerts
    this.alertSuccess = page.getByTestId('alert-success');
    this.alertError = page.getByTestId('alert-error');
  }

  async goto(id: string) {
    await this.page.goto(`/tournaments/${id}`);
  }

  async switchTab(tab: 'overview' | 'participants' | 'matches' | 'settings') {
    switch (tab) {
      case 'overview':
        await this.tabOverview.click();
        break;
      case 'participants':
        await this.tabParticipants.click();
        break;
      case 'matches':
        await this.tabMatches.click();
        break;
      case 'settings':
        await this.tabSettings.click();
        break;
    }
  }

  async updateDetails(data: UpdateTournamentData) {
    await this.switchTab('settings');
    if (data.name !== undefined) {
      await this.editNameInput.fill(data.name);
    }
    if (data.category !== undefined) {
      await this.editCategoryInput.fill(data.category);
    }
    if (data.prizePool !== undefined) {
      await this.editPrizePoolInput.fill(data.prizePool.toString());
    }
    if (data.description !== undefined) {
      await this.editDescriptionInput.fill(data.description);
    }
    await this.saveSettingsButton.click();
  }

  async changeStatus(status: 'DRAFT' | 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED') {
    await this.switchTab('settings');
    const statusBtn = this.page.getByTestId(`set-status-${status.toLowerCase()}-btn`);
    await statusBtn.click();
  }

  async register() {
    await this.registerTournamentButton.click();
  }

  async deleteFromHero() {
    await this.deleteTournamentButton.click();
  }

  async deleteFromSettings() {
    await this.switchTab('settings');
    await this.deleteSettingsButton.click();
  }
}
