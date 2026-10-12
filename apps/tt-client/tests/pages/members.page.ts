import { Page, Locator } from '@playwright/test';

export class MembersPage {
  readonly page: Page;
  readonly header: Locator;
  readonly addUserButton: Locator;
  readonly searchInput: Locator;
  readonly roleSelect: Locator;
  readonly statusSelect: Locator;
  readonly sortSelect: Locator;
  readonly resetFiltersButton: Locator;
  readonly table: Locator;
  readonly memberRows: Locator;
  readonly pagination: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.getByTestId('member-header');
    this.addUserButton = page.getByTestId('add-user-btn');
    this.searchInput = page.getByTestId('user-search-input');
    this.roleSelect = page.getByTestId('user-role-select');
    this.statusSelect = page.getByTestId('user-status-select');
    this.sortSelect = page.getByTestId('user-sort-select');
    this.resetFiltersButton = page.getByTestId('user-reset-filters-btn');
    this.table = page.getByTestId('members-table');
    this.memberRows = page.getByTestId('member-row');
    this.pagination = page.getByTestId('members-pagination');
  }

  async goto() {
    await this.page.goto('/members');
  }

  async search(query: string) {
    await this.searchInput.fill(query);
  }

  async filterByRole(role: string) {
    await this.roleSelect.selectOption(role);
  }

  async filterByStatus(status: 'ACTIVE' | 'INACTIVE' | '') {
    await this.statusSelect.selectOption(status);
  }

  async resetFilters() {
    await this.resetFiltersButton.click();
  }

  getMemberRow(userId: string): Locator {
    return this.page.locator(`[data-member-id="${userId}"]`);
  }

  async openMemberActions(userId: string) {
    await this.page.getByTestId(`member-actions-btn-${userId}`).click();
  }

  async toggleMemberStatus(userId: string) {
    await this.openMemberActions(userId);
    await this.page.getByTestId(`toggle-status-btn-${userId}`).click();
  }

  async clickEditMember(userId: string) {
    await this.openMemberActions(userId);
    await this.page.getByTestId(`edit-member-btn-${userId}`).click();
  }

  async clickDeleteMember(userId: string) {
    await this.openMemberActions(userId);
    await this.page.getByTestId(`delete-member-btn-${userId}`).click();
  }
}
