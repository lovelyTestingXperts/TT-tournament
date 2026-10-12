import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly pageContainer: Locator;
  readonly form: Locator;
  readonly errorMessage: Locator;
  readonly warningMessage: Locator;
  readonly registerLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageContainer = page.getByTestId('login-page');
    this.form = page.getByTestId('login-form');
    this.emailInput = page.getByTestId('email-input');
    this.passwordInput = page.getByTestId('password-input');
    this.submitButton = page.getByTestId('login-submit-btn');
    this.errorMessage = page.getByTestId('alert-error');
    this.warningMessage = page.getByTestId('alert-warning');
    this.registerLink = page.getByTestId('register-link');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, pass: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(pass);
    await this.submitButton.click();
  }
}
