import { test, expect } from './fixtures';
import { MemberAssertions, AuthAssertions } from './assertions';
import { DataFactory } from './data';

test.describe('User & Member Management CRUD Operations', () => {
  // Setup: Register and authenticate an active user before testing member operations
  test.beforeEach(async ({ pm, page }) => {
    const adminUser = DataFactory.createValidUser();

    // 1. Register active user
    await pm.register.goto();
    await pm.register.registerUser(adminUser);
    await AuthAssertions.assertSuccessMessageVisible(pm.register, /Registration successful/i);

    // 2. Login to obtain session
    await pm.login.goto();
    await pm.login.login(adminUser.email, adminUser.password);
    await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 10000 });
    await expect(page.getByTestId('topbar')).toBeVisible();
  });

  test('CREATE: should create a new user/member successfully and display in directory', async ({ pm, page }) => {
    // 1. Navigate to Member directory
    await pm.members.goto();
    await MemberAssertions.assertMembersPageVisible(pm.members);

    // 2. Click Add User button
    await pm.members.addUserButton.click();
    await page.waitForURL(/\/members\/create/);
    await MemberAssertions.assertCreateMemberFormVisible(pm.createMember);

    // 3. Fill and submit user creation form with DataFactory payload
    const newMember = DataFactory.createMemberPayload({ role: 'REFEREE' });
    await pm.createMember.createUser(newMember);

    // 4. Verify redirected back to member directory
    await page.waitForURL(/\/members$/);
    await MemberAssertions.assertMembersPageVisible(pm.members);

    // 5. Search for the newly created user and verify presence in table
    await pm.members.search(newMember.email);
    await MemberAssertions.assertMemberInList(pm.members, newMember.email);
    await MemberAssertions.assertMemberInList(pm.members, newMember.firstName);
  });

  test('READ: should navigate to user profile and view complete details', async ({ pm, page }) => {
    // 1. Create a user to view
    await pm.createMember.goto();
    const newMember = DataFactory.createMemberPayload({ role: 'PLAYER' });
    await pm.createMember.createUser(newMember);
    await page.waitForURL(/\/members$/);

    // 2. Filter/search to locate the created user
    await pm.members.search(newMember.email);
    await MemberAssertions.assertMemberInList(pm.members, newMember.email);

    // 3. Click the user name link to navigate to details page
    const userRow = pm.members.memberRows.filter({ hasText: newMember.email });
    await expect(userRow).toBeVisible();
    await userRow.getByText(newMember.firstName).click();

    // 4. Verify member details page renders with matching identity
    await page.waitForURL(/\/members\/[a-zA-Z0-9_-]+/);
    await expect(pm.memberDetails.profileCard).toBeVisible();
    await MemberAssertions.assertProfileFullName(pm.memberDetails, `${newMember.firstName} ${newMember.lastName}`);
  });

  test('UPDATE: should update user details (name, role, status) and verify changes', async ({ pm, page }) => {
    // 1. Create a target user
    await pm.createMember.goto();
    const targetMember = DataFactory.createMemberPayload({ role: 'MEMBER' });
    await pm.createMember.createUser(targetMember);
    await page.waitForURL(/\/members$/);

    // 2. Locate user and open Edit page
    await pm.members.search(targetMember.email);
    const userRow = pm.members.memberRows.filter({ hasText: targetMember.email });
    await expect(userRow).toBeVisible();

    // Navigate to edit page via actions dropdown or directly
    const memberActionsBtn = userRow.getByRole('button', { name: /actions/i });
    await memberActionsBtn.click();
    const editBtn = page.getByRole('button', { name: /edit member/i });
    await editBtn.click();

    // 3. Verify Edit Form is loaded
    await page.waitForURL(/\/members\/.*\/edit/);
    await MemberAssertions.assertEditMemberFormVisible(pm.editMember);

    // 4. Apply updates
    const updatedFirstName = `${targetMember.firstName}Updated`;
    const updatedLastName = `${targetMember.lastName}Updated`;
    await pm.editMember.editUser({
      firstName: updatedFirstName,
      lastName: updatedLastName,
      role: 'ADMIN',
    });

    // 5. Verify redirection to profile and updated details
    await page.waitForURL(/\/members\/[a-zA-Z0-9_-]+$/);
    await MemberAssertions.assertProfileFullName(pm.memberDetails, `${updatedFirstName} ${updatedLastName}`);
  });

  test('STATUS TOGGLE: should toggle user account status between active and inactive', async ({ pm, page }) => {
    // 1. Create a user
    await pm.createMember.goto();
    const targetMember = DataFactory.createMemberPayload();
    await pm.createMember.createUser(targetMember);
    await page.waitForURL(/\/members$/);

    // 2. Search for the member
    await pm.members.search(targetMember.email);
    const userRow = pm.members.memberRows.filter({ hasText: targetMember.email });
    await expect(userRow).toBeVisible();

    // 3. Open dropdown menu and toggle status
    const memberActionsBtn = userRow.getByRole('button', { name: /actions/i });
    await memberActionsBtn.click();
    const toggleStatusBtn = page.getByRole('button', { name: /deactivate user/i });
    await toggleStatusBtn.click();

    // 4. Verify status badge updates to Inactive
    await expect(userRow.getByTestId('status-badge')).toContainText(/inactive/i);
  });

  test('DELETE: should soft-delete user and verify removal from directory', async ({ pm, page }) => {
    // 1. Create a user to delete
    await pm.createMember.goto();
    const userToDelete = DataFactory.createMemberPayload();
    await pm.createMember.createUser(userToDelete);
    await page.waitForURL(/\/members$/);

    // 2. Search for the member
    await pm.members.search(userToDelete.email);
    const userRow = pm.members.memberRows.filter({ hasText: userToDelete.email });
    await expect(userRow).toBeVisible();

    // 3. Navigate to details page and delete with dialog confirmation
    await userRow.getByText(userToDelete.firstName).click();
    await page.waitForURL(/\/members\/[a-zA-Z0-9_-]+/);

    // Accept native browser confirm dialog
    page.once('dialog', async (dialog) => {
      await dialog.accept();
    });

    await pm.memberDetails.deleteProfileButton.click();

    // 4. Verify redirected to /members and user is no longer listed
    await page.waitForURL(/\/members$/);
    await pm.members.search(userToDelete.email);
    await MemberAssertions.assertMemberNotInList(pm.members, userToDelete.email);
  });
});
