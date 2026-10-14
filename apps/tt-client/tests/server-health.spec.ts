import { test, expect } from './fixtures';

test.describe('Server Health & Downtime Error Handling', () => {
  test('SRV-01: Server is down Banner - Displays user-friendly error when API gateway is unreachable', async ({ page }) => {
    // Intercept GraphQL endpoint to simulate server downtime / connection failure
    await page.route('**/graphql', async (route) => {
      await route.abort('connectionrefused');
    });

    await test.step('Navigate to landing page and observe network failure handling', async () => {
      await page.goto('/');
      await expect(page.getByTestId('home-page')).toBeVisible();
    });

    await test.step('Verify user-friendly Server is down banner is displayed', async () => {
      const banner = page.getByTestId('server-down-banner');
      await expect(banner).toBeVisible();
      await expect(banner).toContainText(/Server is down/i);
      await expect(banner).toContainText(/Our sports gateway is currently unreachable/i);
    });

    await test.step('Verify Sidebar reflects Server Offline status', async () => {
      const statusIndicator = page.getByTestId('server-status-indicator');
      await expect(statusIndicator).toBeVisible();
      await expect(statusIndicator).toContainText(/Server Offline/i);
    });

    await test.step('Verify Retry Connection action button exists on banner', async () => {
      const retryBtn = page.getByTestId('retry-server-btn');
      await expect(retryBtn).toBeVisible();
    });
  });

  test('SRV-02: Server Downtime Recovery & Dismissal - Dismissing banner and retry workflow', async ({ page }) => {
    let shouldFail = true;

    await page.route('**/graphql', async (route) => {
      if (shouldFail) {
        await route.abort('connectionrefused');
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: {
              __typename: 'Query',
              tournaments: { items: [], meta: { total: 0 } },
              matches: [],
            },
          }),
        });
      }
    });

    await test.step('Navigate to application and trigger server down banner', async () => {
      await page.goto('/');
      await expect(page.getByTestId('server-down-banner')).toBeVisible();
    });

    await test.step('Dismiss banner via close button and verify it hides', async () => {
      await page.getByTestId('dismiss-server-down-btn').click();
      await expect(page.getByTestId('server-down-banner')).not.toBeVisible();
    });
  });
});
