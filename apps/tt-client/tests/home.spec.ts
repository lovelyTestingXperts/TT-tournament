import { test, expect } from './fixtures';
import { DataFactory } from './data';

test.describe('Home Landing Page & Public Information Portal', () => {
  test('HOME-01: Public Landing Access - Unauthenticated guest can view Home page with hero, live stats, and sport categories', async ({ page }) => {
    await test.step('Navigate to root path as guest and verify no redirect to login', async () => {
      await page.goto('/');
      await expect(page).toHaveURL(/\/$/);
      await expect(page.getByTestId('home-page')).toBeVisible();
    });

    await test.step('Verify Topbar renders guest navigation controls', async () => {
      await expect(page.getByTestId('topbar')).toBeVisible();
      await expect(page.getByTestId('topbar-login-btn')).toBeVisible();
      await expect(page.getByTestId('topbar-register-btn')).toBeVisible();
      await expect(page.getByTestId('notifications-btn')).toBeVisible();
    });

    await test.step('Verify Home Hero banner and live sports platform headline', async () => {
      await expect(page.getByTestId('home-hero')).toBeVisible();
      await expect(page.getByTestId('home-hero')).toContainText(/Live Tournaments, Brackets & Real-Time Matches/i);
      await expect(page.getByTestId('hero-explore-tournaments-btn')).toBeVisible();
      await expect(page.getByTestId('hero-view-matches-btn')).toBeVisible();
    });

    await test.step('Verify multi-sport categories showcase contains all supported sports', async () => {
      await expect(page.getByTestId('sports-categories-section')).toBeVisible();
      await expect(page.getByTestId('sport-category-card-table_tennis')).toBeVisible();
      await expect(page.getByTestId('sport-category-card-cricket')).toBeVisible();
      await expect(page.getByTestId('sport-category-card-badminton')).toBeVisible();
      await expect(page.getByTestId('sport-category-card-chess')).toBeVisible();
      await expect(page.getByTestId('sport-category-card-carrom')).toBeVisible();
    });

    await test.step('Click sport category filter and verify active button state', async () => {
      const ttFilter = page.getByTestId('sport-filter-table_tennis-btn');
      await expect(ttFilter).toBeVisible();
      await ttFilter.click();
      await expect(ttFilter).toHaveClass(/border-primary/);
    });
  });

  test('HOME-02: Authenticated Experience - Seamless transition with personalized topbar and sidebar navigation', async ({ page }) => {
    await test.step('Authenticate seeded player session', async () => {
      await page.route('**/graphql', async (route) => {
        const req = route.request();
        const body = req.postDataJSON();
        if (body?.query && (body.query.includes('me') || body.query.includes('Me'))) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              data: {
                me: {
                  id: '6ace1d38c94f739a5fc49750',
                  firstName: 'Virat',
                  lastName: 'Kohli',
                  fullName: 'Virat Kohli',
                  email: 'virat.kohli@sports.org',
                  role: 'PLAYER',
                  roles: ['PLAYER'],
                  isActive: true,
                  avatar: null,
                  bio: 'Cricket Legend',
                  employeeId: 'EMP-2009',
                  phoneNumber: '+91 9876543210',
                },
              },
            }),
          });
          return;
        }
        await route.continue();
      });

      await page.addInitScript(() => {
        window.localStorage.setItem('accessToken', 'mock-session-token');
        window.localStorage.setItem(
          'currentUser',
          JSON.stringify({
            id: '6ace1d38c94f739a5fc49750',
            firstName: 'Virat',
            lastName: 'Kohli',
            fullName: 'Virat Kohli',
            email: 'virat.kohli@sports.org',
            role: 'player',
            isActive: true,
          })
        );
      });
      await page.goto('/');
      await expect(page.getByTestId('topbar')).toBeVisible();
    });

    await test.step('Navigate to Home via Sidebar navigation', async () => {
      await expect(page.getByTestId('nav-home')).toBeVisible();
      await page.getByTestId('nav-home').click();
      await expect(page).toHaveURL(/\/$/);
      await expect(page.getByTestId('home-page')).toBeVisible();
    });

    await test.step('Verify authenticated Topbar displays user greeting and sign out action', async () => {
      await expect(page.getByTestId('topbar')).toContainText(/Virat/i);
      await expect(page.getByTestId('logout-btn')).toBeVisible();
    });

    await test.step('Verify Featured Latest Tournament and Current Match cards exist', async () => {
      await expect(page.getByTestId('latest-tournament-card')).toBeVisible();
      await expect(page.getByTestId('current-match-card')).toBeVisible();
      await expect(page.getByTestId('upcoming-matches-section')).toBeVisible();
    });
  });
});
