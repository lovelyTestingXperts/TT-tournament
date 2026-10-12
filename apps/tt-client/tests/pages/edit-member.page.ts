import { Page, Locator } from '@playwright/test';

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  avatar?: string;
  role?: 'ADMIN' | 'REFEREE' | 'PLAYER' | 'MEMBER';
  isActive?: boolean;
  bio?: string;
}

export class EditMemberPage {
  readonly page: Page;
  readonly form: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly phoneInput: Locator;
  readonly avatarInput: Locator;
  readonly roleSelect: Locator;
  readonly statusSelect: Locator;
  readonly bioInput: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.form = page.getByTestId('edit-user-form');
    this.firstNameInput = page.getByTestId('user-edit-firstname-input');
    this.lastNameInput = page.getByTestId('user-edit-lastname-input');
    this.phoneInput = page.getByTestId('user-edit-phone-input');
    this.avatarInput = page.getByTestId('user-edit-avatar-input');
    this.roleSelect = page.getByTestId('user-edit-role-select');
    this.statusSelect = page.getByTestId('user-edit-status-select');
    this.bioInput = page.getByTestId('user-edit-bio-input');
    this.submitButton = page.getByTestId('submit-user-edit-btn');
    this.cancelButton = page.getByTestId('cancel-btn');
    this.errorMessage = page.getByTestId('alert-error');
  }

  async editUser(data: UpdateUserData) {
    if (data.firstName !== undefined) {
      await this.firstNameInput.fill(data.firstName);
    }
    if (data.lastName !== undefined) {
      await this.lastNameInput.fill(data.lastName);
    }
    if (data.phoneNumber !== undefined) {
      await this.phoneInput.fill(data.phoneNumber);
    }
    if (data.role !== undefined) {
      await this.roleSelect.selectOption(data.role);
    }
    if (data.isActive !== undefined) {
      await this.statusSelect.selectOption(data.isActive ? 'true' : 'false');
    }
    if (data.bio !== undefined) {
      await this.bioInput.fill(data.bio);
    }
    await this.submitButton.click();
  }
}
