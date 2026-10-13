import { test, expect } from './fixtures';
import { MemberAssertions, AuthAssertions } from './assertions';
import { DataFactory } from './data';

test.describe('User & Member Management CRUD Operations', () => {
  // Setup: Register and authenticate an active user before testing member operations
  test.beforeEach(async ({ pm, page }) => {
    const adminUser = DataFactory.createValidUser();

    await test.step('Register active admin user', async () => {
      await pm.register.goto();
      await pm.register.registerUser(adminUser);
      await AuthAssertions.assertSuccessMessageVisible(pm.register, /Registration successful/i);
    });

    await test.step('Login to authenticate session', async () => {
      await pm.login.goto();
      await pm.login.login(adminUser.email, adminUser.password);
      await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10000 });
      await expect(page.getByTestId('topbar')).toBeVisible();
    });
  });

  test('CREATE: should create a new user/member successfully and display in directory', async ({ pm, page }) => {
    const newMember = DataFactory.createMemberPayload({ role: 'REFEREE' });

    await test.step('Navigate to member management directory', async () => {
      await pm.members.goto();
      await MemberAssertions.assertMembersPageVisible(pm.members);
    });

    await test.step('Open user creation form', async () => {
      await pm.members.addUserButton.click();
      await page.waitForURL(/\/members\/create/);
      await MemberAssertions.assertCreateMemberFormVisible(pm.createMember);
    });

    await test.step('Fill and submit user creation form with DataFactory payload', async () => {
      await pm.createMember.createUser(newMember);
    });

    await test.step('Verify redirection back to member directory', async () => {
      await page.waitForURL(/\/members$/);
      await MemberAssertions.assertMembersPageVisible(pm.members);
    });

    await test.step('Search for the newly created user and verify presence in table', async () => {
      await pm.members.search(newMember.email);
      await MemberAssertions.assertMemberInList(pm.members, newMember.email);
      await MemberAssertions.assertMemberInList(pm.members, newMember.firstName);
    });
  });

  test('READ: should navigate to user profile and view complete details', async ({ pm, page }) => {
    const newMember = DataFactory.createMemberPayload({ role: 'PLAYER' });

    await test.step('Create user for profile inspection', async () => {
      await pm.createMember.goto();
      await pm.createMember.createUser(newMember);
      await page.waitForURL(/\/members$/);
    });

    await test.step('Filter/search to locate the created user', async () => {
      await pm.members.search(newMember.email);
      await MemberAssertions.assertMemberInList(pm.members, newMember.email);
    });

    await test.step('Click user name link to navigate to details page', async () => {
      const userRow = pm.members.memberRows.filter({ hasText: newMember.email });
      await expect(userRow).toBeVisible();
      await userRow.getByText(newMember.firstName).click();
    });

    await test.step('Verify member details page renders with matching identity', async () => {
      await page.waitForURL(/\/members\/[a-zA-Z0-9_-]+/);
      await expect(pm.memberDetails.profileCard).toBeVisible();
      await MemberAssertions.assertProfileFullName(pm.memberDetails, `${newMember.firstName} ${newMember.lastName}`);
    });
  });

  test('UPDATE: should update user details (name, role, status) and verify changes', async ({ pm, page }) => {
    const targetMember = DataFactory.createMemberPayload({ role: 'MEMBER' });
    const updatedFirstName = `${targetMember.firstName}Updated`;
    const updatedLastName = `${targetMember.lastName}Updated`;

    await test.step('Create target user for updating', async () => {
      await pm.createMember.goto();
      await pm.createMember.createUser(targetMember);
      await page.waitForURL(/\/members$/);
    });

    await test.step('Locate user and open edit page via action dropdown', async () => {
      await pm.members.search(targetMember.email);
      const userRow = pm.members.memberRows.filter({ hasText: targetMember.email });
      await expect(userRow).toBeVisible();

      const memberActionsBtn = userRow.getByRole('button', { name: /actions/i });
      await memberActionsBtn.click();
      const editBtn = page.getByRole('button', { name: /edit member/i });
      await editBtn.click();

      await page.waitForURL(/\/members\/.*\/edit/);
      await MemberAssertions.assertEditMemberFormVisible(pm.editMember);
    });

    await test.step('Apply updates to user details', async () => {
      await pm.editMember.editUser({
        firstName: updatedFirstName,
        lastName: updatedLastName,
        role: 'ADMIN',
      });
    });

    await test.step('Verify redirection to profile and updated details', async () => {
      await page.waitForURL(/\/members\/[a-zA-Z0-9_-]+$/);
      await MemberAssertions.assertProfileFullName(pm.memberDetails, `${updatedFirstName} ${updatedLastName}`);
    });
  });

  test('STATUS TOGGLE: should toggle user account status between active and inactive', async ({ pm, page }) => {
    const targetMember = DataFactory.createMemberPayload();

    await test.step('Create user for status toggling', async () => {
      await pm.createMember.goto();
      await pm.createMember.createUser(targetMember);
      await page.waitForURL(/\/members$/);
    });

    await test.step('Search for the member in directory', async () => {
      await pm.members.search(targetMember.email);
      const userRow = pm.members.memberRows.filter({ hasText: targetMember.email });
      await expect(userRow).toBeVisible();
    });

    await test.step('Open dropdown menu and toggle account status', async () => {
      const userRow = pm.members.memberRows.filter({ hasText: targetMember.email });
      const memberActionsBtn = userRow.getByRole('button', { name: /actions/i });
      await memberActionsBtn.click();
      const toggleStatusBtn = page.getByRole('button', { name: /deactivate user/i });
      await toggleStatusBtn.click();
    });

    await test.step('Verify status badge updates to Inactive', async () => {
      const userRow = pm.members.memberRows.filter({ hasText: targetMember.email });
      await expect(userRow.getByTestId('status-badge')).toContainText(/inactive/i);
    });
  });

  test('DELETE: should soft-delete user and verify removal from directory', async ({ pm, page }) => {
    const userToDelete = DataFactory.createMemberPayload();

    await test.step('Create user to delete', async () => {
      await pm.createMember.goto();
      await pm.createMember.createUser(userToDelete);
      await page.waitForURL(/\/members$/);
    });

    await test.step('Search and locate member in directory', async () => {
      await pm.members.search(userToDelete.email);
      const userRow = pm.members.memberRows.filter({ hasText: userToDelete.email });
      await expect(userRow).toBeVisible();
    });

    await test.step('Navigate to details page and trigger deletion with confirmation dialog', async () => {
      const userRow = pm.members.memberRows.filter({ hasText: userToDelete.email });
      await userRow.getByText(userToDelete.firstName).click();
      await page.waitForURL(/\/members\/[a-zA-Z0-9_-]+/);

      page.once('dialog', async (dialog) => {
        await dialog.accept();
      });

      await pm.memberDetails.deleteProfileButton.click();
    });

    await test.step('Verify redirected to /members and user is no longer listed', async () => {
      await page.waitForURL(/\/members$/);
      await pm.members.search(userToDelete.email);
      await MemberAssertions.assertMemberNotInList(pm.members, userToDelete.email);
    });
  });
});
