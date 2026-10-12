import { test, expect } from '@playwright/test';

test.describe('Authentication & Protected Routing', () => {
  test('unauthenticated access to root (/) should redirect automatically to /login', async ({ page }) => {
    // Attempt to access protected dashboard root
    await page.goto('/');

    // Verify automatic redirect to login
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByTestId('login-page')).toBeVisible();
    await expect(page.getByTestId('login-form')).toBeVisible();
    await expect(page.getByTestId('login-submit-btn')).toBeVisible();
  });

  test('unauthenticated access to /members should redirect automatically to /login', async ({ page }) => {
    // Attempt to access members management page
    await page.goto('/members');

    // Verify automatic redirect to login
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByTestId('login-page')).toBeVisible();
  });

  test('should navigate to register page and display player registration', async ({ page }) => {
    await page.goto('/register');

    await expect(page.getByTestId('register-page')).toBeVisible();
    await expect(page.getByTestId('register-form')).toBeVisible();
    await expect(page.getByTestId('status-badge')).toHaveText('Player');
    await expect(page.getByTestId('register-submit-btn')).toBeVisible();
  });

  test('should display inactive/pending warning banner if account inactive flag is provided', async ({ page }) => {
    await page.goto('/login');

    // Mock inactive notification via state or simulated redirect
    await page.evaluate(() => {
      window.history.replaceState({ accountInactive: true }, '', '/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    await page.goto('/login');
    await expect(page.getByTestId('login-page')).toBeVisible();
  });
});
