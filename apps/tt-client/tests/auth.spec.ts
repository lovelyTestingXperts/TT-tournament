import { test, expect } from './fixtures';
import { AuthAssertions } from './assertions';
import { DataFactory } from './data';

test.describe('Authentication: Sign Up & Login Flows', () => {
  test.describe('Page Manager & Basic Controls', () => {
    test('should display login page controls via page manager', async ({ pm }) => {
      await pm.login.goto();
      await AuthAssertions.assertLoginPageVisible(pm.login);
    });

    test('should display register page controls via page manager', async ({ pm }) => {
      await pm.register.goto();
      await AuthAssertions.assertRegisterPageVisible(pm.register);
    });

    test('should toggle between login and register using page manager', async ({ pm }) => {
      await pm.login.goto();
      await pm.login.registerLink.click();
      await AuthAssertions.assertRegisterPageVisible(pm.register);

      await pm.register.loginLink.click();
      await AuthAssertions.assertLoginPageVisible(pm.login);
    });
  });

  test.describe('End-to-End Registration and Login with Dynamic Credentials', () => {
    test('should register a new player with dynamic credentials and successfully login', async ({ pm, page }) => {
      // 1. Generate dynamic valid user data using DataFactory
      const dummyUser = DataFactory.createValidUser();

      // 2. Go to register page and submit registration
      await pm.register.goto();
      await pm.register.registerUser(dummyUser);

      // 3. Verify success message appears
      await AuthAssertions.assertSuccessMessageVisible(pm.register, /Registration successful/i);

      // 4. Wait for redirect to /login or navigate to login
      await pm.login.goto();
      await AuthAssertions.assertLoginPageVisible(pm.login);

      // 5. Login with newly registered credentials
      await pm.login.login(dummyUser.email, dummyUser.password);

      // 6. Verify successful authentication and redirection to dashboard
      await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10000 });
      await expect(page.getByTestId('topbar')).toBeVisible();
    });
  });

  test.describe('Negative Scenarios & Validation Restrictions', () => {
    test('should reject registration when email format is invalid', async ({ pm, page }) => {
      const invalidEmailUser = DataFactory.createUserWithInvalidEmail();

      await pm.register.goto();
      await pm.register.registerUser(invalidEmailUser);

      // Should show validation error for email and prevent submission
      await AuthAssertions.assertFieldError(page, 'email', /Invalid email address/i);
    });

    test('should reject registration when password is shorter than 6 characters', async ({ pm, page }) => {
      const shortPassUser = DataFactory.createUserWithShortPassword();

      await pm.register.goto();
      await pm.register.registerUser(shortPassUser);

      await AuthAssertions.assertFieldError(page, 'password', /at least 6 characters/i);
    });

    test('should reject registration when password and confirm password do not match', async ({ pm, page }) => {
      const mismatchUser = DataFactory.createUserWithMismatchedPassword();

      await pm.register.goto();
      await pm.register.registerUser(mismatchUser);

      await AuthAssertions.assertFieldError(page, 'confirmPassword', /Passwords do not match/i);
    });

    test('should reject registration when first name is too short', async ({ pm, page }) => {
      const shortNameUser = DataFactory.createUserWithShortName();

      await pm.register.goto();
      await pm.register.registerUser(shortNameUser);

      await AuthAssertions.assertFieldError(page, 'firstName', /at least 2 characters/i);
      await AuthAssertions.assertFieldError(page, 'lastName', /Last name is required/i);
    });

    test('should show error alert when attempting to login with invalid credentials', async ({ pm }) => {
      await pm.login.goto();
      await pm.login.login('nonexistent.player@example.com', 'wrongpassword');

      await AuthAssertions.assertErrorMessage(pm.login, /Invalid email or password/i);
    });

    test('should reject login submission if password is too short on login form', async ({ pm, page }) => {
      await pm.login.goto();
      await pm.login.login('user@example.com', '123');

      await AuthAssertions.assertFieldError(page, 'password', /Password too short/i);
    });
  });
});
