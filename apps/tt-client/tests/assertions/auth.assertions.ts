import { expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { RegisterPage } from '../pages/register.page';

export class AuthAssertions {
  static async assertLoginPageVisible(loginPage: LoginPage) {
    await expect(loginPage.pageContainer).toBeVisible();
    await expect(loginPage.form).toBeVisible();
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
  }

  static async assertRegisterPageVisible(registerPage: RegisterPage) {
    await expect(registerPage.pageContainer).toBeVisible();
    await expect(registerPage.form).toBeVisible();
    await expect(registerPage.firstNameInput).toBeVisible();
    await expect(registerPage.lastNameInput).toBeVisible();
    await expect(registerPage.emailInput).toBeVisible();
    await expect(registerPage.passwordInput).toBeVisible();
    await expect(registerPage.submitButton).toBeVisible();
    await expect(registerPage.statusBadge).toHaveText('Player');
  }

  static async assertRedirectedToLogin(loginPage: LoginPage) {
    await expect(loginPage.page).toHaveURL(/\/login/);
    await expect(loginPage.pageContainer).toBeVisible();
  }

  static async assertInactiveWarningVisible(loginPage: LoginPage) {
    await expect(loginPage.warningMessage).toBeVisible();
  }

  static async assertErrorMessage(targetPage: LoginPage | RegisterPage, message?: string | RegExp) {
    await expect(targetPage.errorMessage).toBeVisible();
    if (message) {
      await expect(targetPage.errorMessage).toContainText(message);
    }
  }

  static async assertSuccessMessageVisible(registerPage: RegisterPage, message?: string | RegExp) {
    await expect(registerPage.successMessage).toBeVisible();
    if (message) {
      await expect(registerPage.successMessage).toContainText(message);
    }
  }

  static async assertFieldError(page: any, inputName: string, errorMessage?: string | RegExp) {
    const errorLocator = page.getByTestId(`${inputName}-input-error`);
    await expect(errorLocator).toBeVisible();
    if (errorMessage) {
      await expect(errorLocator).toContainText(errorMessage);
    }
  }
}
