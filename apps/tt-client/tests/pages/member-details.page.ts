import { Page, Locator } from '@playwright/test';

export class MemberDetailsPage {
  readonly page: Page;
  readonly pageContainer: Locator;
  readonly profileCard: Locator;
  readonly fullNameHeader: Locator;
  readonly editProfileButton: Locator;
  readonly deleteProfileButton: Locator;
  readonly restoreProfileButton: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageContainer = page.getByTestId('member-details-page');
    this.profileCard = page.getByTestId('member-profile-card');
    this.fullNameHeader = page.getByTestId('member-fullname');
    this.editProfileButton = page.getByTestId('edit-member-profile-btn');
    this.deleteProfileButton = page.getByTestId('delete-member-profile-btn');
    this.restoreProfileButton = page.getByTestId('restore-member-profile-btn');
    this.backButton = page.getByTestId('back-to-members-btn');
  }

  async goto(userId: string) {
    await this.page.goto(`/members/${userId}`);
  }
}
