import { Page, Locator } from '@playwright/test';

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  employeeId?: string;
  role: 'ADMIN' | 'REFEREE' | 'PLAYER' | 'MEMBER';
  bio?: string;
}

export class CreateMemberPage {
  readonly page: Page;
  readonly form: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly roleSelect: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly phoneInput: Locator;
  readonly bioInput: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.form = page.getByTestId('create-user-form');
    this.firstNameInput = page.getByTestId('user-firstname-input');
    this.lastNameInput = page.getByTestId('user-lastname-input');
    this.employeeIdInput = page.getByTestId('user-employeeid-input');
    this.roleSelect = page.getByTestId('user-role-select');
    this.emailInput = page.getByTestId('user-email-input');
    this.passwordInput = page.getByTestId('user-password-input');
    this.phoneInput = page.getByTestId('user-phone-input');
    this.bioInput = page.getByTestId('user-bio-input');
    this.submitButton = page.getByTestId('submit-user-btn');
    this.cancelButton = page.getByTestId('cancel-btn');
    this.errorMessage = page.getByTestId('alert-error');
  }

  async goto() {
    await this.page.goto('/members/create');
  }

  async createUser(data: CreateUserData) {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.emailInput.fill(data.email);
    await this.passwordInput.fill(data.password);
    if (data.employeeId) {
      await this.employeeIdInput.fill(data.employeeId);
    }
    await this.roleSelect.selectOption(data.role);
    if (data.phoneNumber) {
      await this.phoneInput.fill(data.phoneNumber);
    }
    if (data.bio) {
      await this.bioInput.fill(data.bio);
    }
    await this.submitButton.click();
  }
}
