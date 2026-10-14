import { test, expect } from './fixtures';
import { DataFactory, UserRegistrationData } from './data';

test.describe('Authentication: Sign Up & Login Flows', () => {
  test.describe('Page Manager & Basic Controls', () => {
    test('should display login page controls via page manager', async ({ pm }) => {
      await test.step('Navigate to login page', async () => {
        await pm.login.goto();
      });

      await test.step('Verify login form controls are visible', async () => {
        await expect(pm.login.pageContainer).toBeVisible();
        await expect(pm.login.form).toBeVisible();
        await expect(pm.login.emailInput).toBeVisible();
        await expect(pm.login.passwordInput).toBeVisible();
        await expect(pm.login.submitButton).toBeVisible();
      });
    });

    test('should display register page controls via page manager', async ({ pm }) => {
      await test.step('Navigate to register page', async () => {
        await pm.register.goto();
      });

      await test.step('Verify register form controls are visible', async () => {
        await expect(pm.register.pageContainer).toBeVisible();
        await expect(pm.register.form).toBeVisible();
        await expect(pm.register.firstNameInput).toBeVisible();
        await expect(pm.register.lastNameInput).toBeVisible();
        await expect(pm.register.emailInput).toBeVisible();
        await expect(pm.register.passwordInput).toBeVisible();
        await expect(pm.register.submitButton).toBeVisible();
        await expect(pm.register.statusBadge).toHaveText('Player');
      });
    });

    test('should toggle between login and register using page manager', async ({ pm }) => {
      await test.step('Navigate to login and switch to register page', async () => {
        await pm.login.goto();
        await pm.login.registerLink.click();
        await expect(pm.register.pageContainer).toBeVisible();
        await expect(pm.register.form).toBeVisible();
      });

      await test.step('Switch back to login page from register page', async () => {
        await pm.register.loginLink.click();
        await expect(pm.login.pageContainer).toBeVisible();
        await expect(pm.login.form).toBeVisible();
      });
    });
  });

  test.describe('End-to-End Registration and Login with Dynamic Credentials', () => {
    test('should register a new player with dynamic credentials and successfully login', async ({ pm, page }) => {
      let dummyUser: UserRegistrationData;

      await test.step('Generate dynamic valid user credentials', async () => {
        dummyUser = DataFactory.createValidUser();
      });

      await test.step('Navigate to registration and submit user details', async () => {
        await pm.register.goto();
        await pm.register.registerUser(dummyUser);
      });

      await test.step('Verify success message appears on register page', async () => {
        await expect(pm.register.successMessage).toBeVisible();
        await expect(pm.register.successMessage).toContainText(/Registration successful/i);
      });

      await test.step('Navigate to login page', async () => {
        await pm.login.goto();
        await expect(pm.login.pageContainer).toBeVisible();
        await expect(pm.login.form).toBeVisible();
      });

      await test.step('Submit login credentials and authenticate', async () => {
        await pm.login.login(dummyUser.email, dummyUser.password);
      });

      await test.step('Verify successful authentication and redirect to dashboard', async () => {
        await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10000 });
        await expect(page.getByTestId('topbar')).toBeVisible();
      });
    });
  });

  test.describe('Negative Scenarios & Validation Restrictions', () => {
    test('should reject registration when email format is invalid', async ({ pm, page }) => {
      await test.step('Navigate to register and submit user with invalid email format', async () => {
        const invalidEmailUser = DataFactory.createUserWithInvalidEmail();
        await pm.register.goto();
        await pm.register.registerUser(invalidEmailUser);
      });

      await test.step('Verify email field validation error is displayed', async () => {
        const errorLocator = page.getByTestId('email-input-error');
        await expect(errorLocator).toBeVisible();
        await expect(errorLocator).toContainText(/Invalid email address/i);
      });
    });

    test('should reject registration when password is shorter than 6 characters', async ({ pm, page }) => {
      await test.step('Navigate to register and submit short password', async () => {
        const shortPassUser = DataFactory.createUserWithShortPassword();
        await pm.register.goto();
        await pm.register.registerUser(shortPassUser);
      });

      await test.step('Verify password length validation error is displayed', async () => {
        const errorLocator = page.getByTestId('password-input-error');
        await expect(errorLocator).toBeVisible();
        await expect(errorLocator).toContainText(/at least 6 characters/i);
      });
    });

    test('should reject registration when password and confirm password do not match', async ({ pm, page }) => {
      await test.step('Navigate to register and submit mismatched passwords', async () => {
        const mismatchUser = DataFactory.createUserWithMismatchedPassword();
        await pm.register.goto();
        await pm.register.registerUser(mismatchUser);
      });

      await test.step('Verify password mismatch error is displayed', async () => {
        const errorLocator = page.getByTestId('confirmPassword-input-error');
        await expect(errorLocator).toBeVisible();
        await expect(errorLocator).toContainText(/Passwords do not match/i);
      });
    });

    test('should reject registration when first name is too short', async ({ pm, page }) => {
      await test.step('Navigate to register and submit short first name with empty last name', async () => {
        const shortNameUser = DataFactory.createUserWithShortName();
        await pm.register.goto();
        await pm.register.registerUser(shortNameUser);
      });

      await test.step('Verify name length and requirement errors are displayed', async () => {
        const firstError = page.getByTestId('firstName-input-error');
        await expect(firstError).toBeVisible();
        await expect(firstError).toContainText(/at least 2 characters/i);

        const lastError = page.getByTestId('lastName-input-error');
        await expect(lastError).toBeVisible();
        await expect(lastError).toContainText(/Last name is required/i);
      });
    });

    test('should show error alert when attempting to login with invalid credentials', async ({ pm }) => {
      await test.step('Navigate to login and submit nonexistent credentials', async () => {
        await pm.login.goto();
        await pm.login.login('nonexistent.player@example.com', 'wrongpassword');
      });

      await test.step('Verify invalid credentials error alert is displayed', async () => {
        await expect(pm.login.errorMessage).toBeVisible();
        await expect(pm.login.errorMessage).toContainText(/Invalid email or password/i);
      });
    });

    test('should reject login submission if password is too short on login form', async ({ pm, page }) => {
      await test.step('Navigate to login and enter password below minimum length', async () => {
        await pm.login.goto();
        await pm.login.login('user@example.com', '123');
      });

      await test.step('Verify password length validation error is displayed on login form', async () => {
        const errorLocator = page.getByTestId('password-input-error');
        await expect(errorLocator).toBeVisible();
        await expect(errorLocator).toContainText(/Password too short/i);
      });
    });
  });
});
