import { Page, Locator } from '@playwright/test';

export class TournamentsPage {
  readonly page: Page;
  readonly pageContainer: Locator;
  readonly header: Locator;
  readonly createTournamentButton: Locator;
  readonly searchInput: Locator;
  readonly statusSelect: Locator;
  readonly tournamentGrid: Locator;
  readonly tournamentCards: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageContainer = page.getByTestId('tournaments-page');
    this.header = page.getByTestId('tournament-header');
    this.createTournamentButton = page.getByTestId('create-tournament-btn');
    this.searchInput = page.getByTestId('tournament-search-input');
    this.statusSelect = page.getByTestId('tournament-status-select');
    this.tournamentGrid = page.getByTestId('tournament-grid');
    this.tournamentCards = page.getByTestId('tournament-card');
    this.emptyState = page.getByTestId('empty-state');
  }

  async goto() {
    await this.page.goto('/tournaments');
  }

  async search(query: string) {
    await this.searchInput.fill(query);
  }

  async filterByStatus(status: string) {
    await this.statusSelect.selectOption(status);
  }

  async clickCreateTournament() {
    await this.createTournamentButton.click();
  }

  getTournamentCard(name: string): Locator {
    return this.tournamentCards.filter({ hasText: name });
  }

  async openTournament(name: string) {
    const card = this.getTournamentCard(name);
    await card.click();
  }
}
