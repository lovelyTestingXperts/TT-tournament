import { Page, Locator } from '@playwright/test';

export class RegisterPage {
  readonly page: Page;
  readonly pageContainer: Locator;
  readonly form: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly phoneInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly statusBadge: Locator;
  readonly submitButton: Locator;
  readonly loginLink: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageContainer = page.getByTestId('register-page');
    this.form = page.getByTestId('register-form');
    this.firstNameInput = page.getByTestId('firstName-input');
    this.lastNameInput = page.getByTestId('lastName-input');
    this.emailInput = page.getByTestId('email-input');
    this.passwordInput = page.getByTestId('password-input');
    this.confirmPasswordInput = page.getByTestId('confirmPassword-input');
    this.phoneInput = page.getByTestId('phoneNumber-input');
    this.statusBadge = page.getByTestId('status-badge');
    this.submitButton = page.getByTestId('register-submit-btn');
    this.loginLink = page.getByTestId('login-link');
    this.errorMessage = page.getByTestId('alert-error');
    this.successMessage = page.getByTestId('alert-success');
  }

  async goto() {
    await this.page.goto('/register');
  }

  async registerUser(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword?: string;
    phoneNumber?: string;
  }) {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.emailInput.fill(data.email);
    await this.passwordInput.fill(data.password);
    await this.confirmPasswordInput.fill(data.confirmPassword !== undefined ? data.confirmPassword : data.password);
    if (data.phoneNumber) {
      await this.phoneInput.fill(data.phoneNumber);
    }
    await this.submitButton.click();
  }
}
