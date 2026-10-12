import { Page, Locator } from '@playwright/test';

export interface CreateTournamentData {
  name: string;
  category: string;
  type?: 'ONLINE' | 'OFFLINE';
  format?: 'SINGLE_ELIMINATION' | 'DOUBLE_ELIMINATION' | 'ROUND_ROBIN' | 'LEAGUE';
  visibility?: 'PUBLIC' | 'PRIVATE';
  maxPlayers: number;
  prizePool?: number;
  registrationDeadline: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export class CreateTournamentPage {
  readonly page: Page;
  readonly pageContainer: Locator;
  readonly form: Locator;
  readonly nameInput: Locator;
  readonly categoryInput: Locator;
  readonly typeSelect: Locator;
  readonly formatSelect: Locator;
  readonly visibilitySelect: Locator;
  readonly maxPlayersInput: Locator;
  readonly prizePoolInput: Locator;
  readonly registrationDeadlineInput: Locator;
  readonly startDateInput: Locator;
  readonly endDateInput: Locator;
  readonly descriptionInput: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;
  readonly backButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageContainer = page.getByTestId('create-tournament-page');
    this.form = page.getByTestId('create-tournament-form');
    this.nameInput = page.getByTestId('tournament-name-input');
    this.categoryInput = page.getByTestId('tournament-category-input');
    this.typeSelect = page.getByTestId('tournament-type-select');
    this.formatSelect = page.getByTestId('tournament-format-select');
    this.visibilitySelect = page.getByTestId('tournament-visibility-select');
    this.maxPlayersInput = page.getByTestId('tournament-max-players-input');
    this.prizePoolInput = page.getByTestId('tournament-prize-pool-input');
    this.registrationDeadlineInput = page.getByTestId('tournament-deadline-input');
    this.startDateInput = page.getByTestId('tournament-start-date-input');
    this.endDateInput = page.getByTestId('tournament-end-date-input');
    this.descriptionInput = page.getByTestId('tournament-description-input');
    this.submitButton = page.getByTestId('submit-tournament-btn');
    this.cancelButton = page.getByTestId('cancel-btn');
    this.backButton = page.getByTestId('back-btn');
    this.errorMessage = page.getByTestId('alert-error');
  }

  async goto() {
    await this.page.goto('/tournaments/create');
  }

  async fillForm(data: Partial<CreateTournamentData>) {
    if (data.name !== undefined) {
      await this.nameInput.fill(data.name);
    }
    if (data.category !== undefined) {
      await this.categoryInput.fill(data.category);
    }
    if (data.type !== undefined) {
      await this.typeSelect.selectOption(data.type);
    }
    if (data.format !== undefined) {
      await this.formatSelect.selectOption(data.format);
    }
    if (data.visibility !== undefined) {
      await this.visibilitySelect.selectOption(data.visibility);
    }
    if (data.maxPlayers !== undefined) {
      await this.maxPlayersInput.fill(data.maxPlayers.toString());
    }
    if (data.prizePool !== undefined) {
      await this.prizePoolInput.fill(data.prizePool.toString());
    }
    if (data.registrationDeadline !== undefined) {
      await this.registrationDeadlineInput.fill(data.registrationDeadline);
    }
    if (data.startDate !== undefined) {
      await this.startDateInput.fill(data.startDate);
    }
    if (data.endDate !== undefined) {
      await this.endDateInput.fill(data.endDate);
    }
    if (data.description !== undefined) {
      await this.descriptionInput.fill(data.description);
    }
  }

  async createTournament(data: CreateTournamentData) {
    await this.fillForm(data);
    await this.submitButton.click();
  }
}
