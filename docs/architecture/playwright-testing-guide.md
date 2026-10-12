# Playwright Testing Guide & Standards

This document serves as the developer and AI agent guide for writing resilient End-to-End (E2E) tests with Playwright across the application.

---

## 1. Core Locator Philosophy

Playwright promotes testing user-visible behavior. When user-visible locators are ambiguous or dynamic, use explicit `data-testid` attributes.

### Preferred Hierarchy:
1. `page.getByRole(...)` (e.g. `getByRole('button', { name: /create tournament/i })`)
2. `page.getByLabel(...)` (enabled via `<label htmlFor="...">` and `<input id="...">`)
3. `page.getByTestId(...)` (fast, unambiguous, guaranteed contract)
4. `page.getByPlaceholder(...)` / `page.getByText(...)`

> ❌ **Never use**: Brittle CSS hierarchy like `div > div:nth-child(2) > button.bg-primary` or Tailwind class selectors.

---

## 2. Standardized `data-testid` Directory

### Layout & Global Navigation
| Element | Locator | Description |
| :--- | :--- | :--- |
| Sidebar Container | `page.getByTestId('sidebar')` | Main navigation sidebar |
| Nav Link: Dashboard | `page.getByTestId('nav-dashboard')` | Link to `/` |
| Nav Link: Tournaments | `page.getByTestId('nav-tournaments')` | Link to `/tournaments` |
| Nav Link: Matches | `page.getByTestId('nav-matches')` | Link to `/matches` |
| Nav Link: Members | `page.getByTestId('nav-members')` | Link to `/members` |
| Sidebar Toggle | `page.getByTestId('sidebar-toggle-btn')` | Collapse/expand sidebar button |
| Topbar | `page.getByTestId('topbar')` | Header bar |
| Notifications | `page.getByTestId('notifications-btn')` | Topbar notifications button |

---

### Tournament Management
| Element | Locator | Description |
| :--- | :--- | :--- |
| Tournaments Page | `page.getByTestId('tournaments-page')` | Root page container |
| Header Action | `page.getByTestId('create-tournament-btn')` | Navigation to `/tournaments/create` |
| Search Filter | `page.getByTestId('tournament-search-input')` | Search bar |
| Status Dropdown | `page.getByTestId('tournament-status-select')` | Status filter |
| Tournaments Grid | `page.getByTestId('tournament-grid')` | List grid container |
| Tournament Card | `page.getByTestId('tournament-card')` | Single tournament card |
| Specific Card | `page.locator('[data-tournament-id="<id>"]')` | Target card by ID |
| Empty State | `page.getByTestId('empty-tournaments-state')` | Card when zero items found |
| Loading Spinner | `page.getByTestId('tournament-loading-spinner')` | Grid loading state |

#### Create Tournament Form
| Element | Locator |
| :--- | :--- |
| Form Container | `page.getByTestId('create-tournament-form')` |
| Name Input | `page.getByTestId('tournament-name-input')` |
| Category Input | `page.getByTestId('tournament-category-input')` |
| Type Select | `page.getByTestId('tournament-type-select')` |
| Format Select | `page.getByTestId('tournament-format-select')` |
| Visibility Select | `page.getByTestId('tournament-visibility-select')` |
| Max Players Input | `page.getByTestId('tournament-max-players-input')` |
| Prize Pool Input | `page.getByTestId('tournament-prize-pool-input')` |
| Deadline Input | `page.getByTestId('tournament-deadline-input')` |
| Start Date Input | `page.getByTestId('tournament-start-date-input')` |
| End Date Input | `page.getByTestId('tournament-end-date-input')` |
| Description Input | `page.getByTestId('tournament-description-input')` |
| Cancel Button | `page.getByTestId('cancel-btn')` |
| Submit Button | `page.getByTestId('submit-tournament-btn')` |

#### Tournament Details Page
| Element | Locator |
| :--- | :--- |
| Page Container | `page.getByTestId('tournament-details-page')` |
| Hero Section | `page.getByTestId('tournament-hero')` |
| Back Button | `page.getByTestId('back-to-tournaments-btn')` |
| Delete Action | `page.getByTestId('delete-tournament-btn')` |
| Register Action | `page.getByTestId('register-tournament-btn')` |
| Tab: Overview | `page.getByTestId('tab-overview')` |
| Tab: Participants | `page.getByTestId('tab-participants')` |
| Tab: Matches | `page.getByTestId('tab-matches')` |
| Tab: Settings | `page.getByTestId('tab-settings')` |
| Status Badges | `page.getByTestId('status-badge')` (has `data-status`) |
| Alert Success | `page.getByTestId('alert-success')` |
| Alert Error | `page.getByTestId('alert-error')` |

---

### Member & User Management
| Element | Locator | Description |
| :--- | :--- | :--- |
| Add User Button | `page.getByTestId('add-user-btn')` | Opens `/members/create` |
| Search Input | `page.getByTestId('user-search-input')` | Member search filter |
| Role Filter | `page.getByTestId('user-role-select')` | Role filter |
| Status Filter | `page.getByTestId('user-status-select')` | Status filter |
| Reset Filters | `page.getByTestId('user-reset-filters-btn')` | Clears search and filters |
| Table Container | `page.getByTestId('members-table')` | Members table |
| Member Row | `page.getByTestId('member-row')` | Any member row |
| Row by User ID | `page.locator('[data-member-id="<id>"]')` | Target specific row |
| Pagination Prev | `page.getByTestId('pagination-prev-btn')` | Previous page button |
| Pagination Next | `page.getByTestId('pagination-next-btn')` | Next page button |
| Create User Form | `page.getByTestId('create-user-form')` | New member creation form |
| Submit User Button | `page.getByTestId('submit-user-btn')` | Submit button |
| Edit User Form | `page.getByTestId('edit-user-form')` | Member edit form |
| Submit Edit Button | `page.getByTestId('submit-user-edit-btn')` | Save edit changes button |

---

### Authentication Pages
| Element | Locator |
| :--- | :--- |
| Login Form | `page.getByTestId('login-form')` |
| Email Input | `page.getByTestId('email-input')` |
| Password Input | `page.getByTestId('password-input')` |
| Login Button | `page.getByTestId('login-submit-btn')` |
| Register Link | `page.getByTestId('register-link')` |
| Register Form | `page.getByTestId('register-form')` |
| Register Button | `page.getByTestId('register-submit-btn')` |

---

## 3. Example Playwright Test Snippet

```typescript
import { test, expect } from '@playwright/test';

test.describe('Tournament Management Flow', () => {
  test('creates a new tournament and displays it in the list', async ({ page }) => {
    // 1. Navigate to tournaments
    await page.goto('/tournaments');
    await expect(page.getByTestId('tournaments-page')).toBeVisible();

    // 2. Click Create Tournament
    await page.getByTestId('create-tournament-btn').click();
    await expect(page.getByTestId('create-tournament-form')).toBeVisible();

    // 3. Fill Form
    await page.getByTestId('tournament-name-input').fill('Playwright Championship 2026');
    await page.getByTestId('tournament-category-input').fill('Esports');
    await page.getByTestId('tournament-max-players-input').fill('32');
    await page.getByTestId('tournament-deadline-input').fill('2026-11-01');
    await page.getByTestId('tournament-start-date-input').fill('2026-11-05');
    await page.getByTestId('tournament-end-date-input').fill('2026-11-10');

    // 4. Submit
    await page.getByTestId('submit-tournament-btn').click();

    // 5. Verification on List
    await expect(page.getByTestId('tournaments-page')).toBeVisible();
    await page.getByTestId('tournament-search-input').fill('Playwright Championship');
    await expect(page.getByTestId('tournament-card')).toContainText('Playwright Championship 2026');
  });
});
```
