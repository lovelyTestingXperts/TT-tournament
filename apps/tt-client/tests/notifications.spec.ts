import { test, expect } from './fixtures';

test.describe('Notification Center & Sports Alerts System', () => {
  test('NOTIF-01: Notification Dropdown & Filtering - Unread badge, dropdown toggle, and category tabs', async ({ page }) => {
    await test.step('Open landing page and inspect notification bell button', async () => {
      await page.goto('/');
      await expect(page.getByTestId('notifications-btn')).toBeVisible();
      await expect(page.getByTestId('notifications-unread-badge')).toBeVisible();
      await expect(page.getByTestId('notifications-unread-badge')).toContainText('3');
    });

    await test.step('Click notification bell to open interactive dropdown', async () => {
      await page.getByTestId('notifications-btn').click();
      await expect(page.getByTestId('notifications-dropdown')).toBeVisible();
      await expect(page.getByTestId('notifications-unread-pill')).toContainText(/3 new/i);
    });

    await test.step('Verify initial dummy sports notifications rendered', async () => {
      await expect(page.getByTestId('notification-item-notif-1')).toBeVisible();
      await expect(page.getByTestId('notification-item-notif-1')).toContainText(/Sharath Kamal vs Manav Thakkar/i);
      await expect(page.getByTestId('notification-item-notif-2')).toBeVisible();
      await expect(page.getByTestId('notification-item-notif-2')).toContainText(/WTT Star Contender/i);
    });

    await test.step('Filter by Matches category and verify count', async () => {
      await page.getByTestId('filter-match-btn').click();
      await expect(page.getByTestId('notification-item-notif-1')).toBeVisible();
      // Tournament item should be filtered out
      await expect(page.getByTestId('notification-item-notif-2')).not.toBeVisible();
    });

    await test.step('Filter by Tournaments category', async () => {
      await page.getByTestId('filter-tournament-btn').click();
      await expect(page.getByTestId('notification-item-notif-2')).toBeVisible();
      await expect(page.getByTestId('notification-item-notif-1')).not.toBeVisible();
    });

    await test.step('Switch back to All filter tab', async () => {
      await page.getByTestId('filter-all-btn').click();
      await expect(page.getByTestId('notification-item-notif-1')).toBeVisible();
      await expect(page.getByTestId('notification-item-notif-2')).toBeVisible();
    });
  });

  test('NOTIF-02: Notification Actions - Mark all as read and clear notifications', async ({ page }) => {
    await test.step('Open notification center dropdown', async () => {
      await page.goto('/');
      await page.getByTestId('notifications-btn').click();
      await expect(page.getByTestId('notifications-dropdown')).toBeVisible();
      await expect(page.getByTestId('notifications-unread-pill')).toBeVisible();
    });

    await test.step('Click Mark all as read and verify unread badge dismissed', async () => {
      await page.getByTestId('mark-all-read-btn').click();
      await expect(page.getByTestId('notifications-unread-pill')).not.toBeVisible();
    });

    await test.step('Click Clear all notifications and verify empty state rendered', async () => {
      await page.getByTestId('clear-notifications-btn').click();
      await expect(page.getByTestId('empty-notifications')).toBeVisible();
      await expect(page.getByTestId('empty-notifications')).toContainText(/No notifications found/i);
    });

    await test.step('Close notifications dropdown via close button', async () => {
      await page.getByTestId('close-notifications-btn').click();
      await expect(page.getByTestId('notifications-dropdown')).not.toBeVisible();
    });
  });
});
