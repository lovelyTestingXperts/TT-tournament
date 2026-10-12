import { expect } from '@playwright/test';
import { MembersPage } from '../pages/members.page';
import { CreateMemberPage } from '../pages/create-member.page';
import { EditMemberPage } from '../pages/edit-member.page';
import { MemberDetailsPage } from '../pages/member-details.page';

export class MemberAssertions {
  static async assertMembersPageVisible(membersPage: MembersPage) {
    await expect(membersPage.header).toBeVisible();
    await expect(membersPage.addUserButton).toBeVisible();
    await expect(membersPage.searchInput).toBeVisible();
    await expect(membersPage.table).toBeVisible();
  }

  static async assertCreateMemberFormVisible(createPage: CreateMemberPage) {
    await expect(createPage.form).toBeVisible();
    await expect(createPage.firstNameInput).toBeVisible();
    await expect(createPage.lastNameInput).toBeVisible();
    await expect(createPage.emailInput).toBeVisible();
    await expect(createPage.passwordInput).toBeVisible();
    await expect(createPage.roleSelect).toBeVisible();
    await expect(createPage.submitButton).toBeVisible();
  }

  static async assertEditMemberFormVisible(editPage: EditMemberPage) {
    await expect(editPage.form).toBeVisible();
    await expect(editPage.firstNameInput).toBeVisible();
    await expect(editPage.lastNameInput).toBeVisible();
    await expect(editPage.roleSelect).toBeVisible();
    await expect(editPage.statusSelect).toBeVisible();
    await expect(editPage.submitButton).toBeVisible();
  }

  static async assertMemberInList(membersPage: MembersPage, fullNameOrEmail: string) {
    await expect(membersPage.table).toContainText(fullNameOrEmail);
  }

  static async assertMemberNotInList(membersPage: MembersPage, fullNameOrEmail: string) {
    // Assert the deleted member's email/name is not present on the page
    const emailLocator = membersPage.page.getByText(fullNameOrEmail, { exact: true });
    await expect(emailLocator).not.toBeVisible();
  }

  static async assertProfileFullName(detailsPage: MemberDetailsPage, expectedFullName: string) {
    await expect(detailsPage.fullNameHeader).toContainText(expectedFullName);
  }

  static async assertErrorMessage(targetPage: CreateMemberPage | EditMemberPage, message?: string | RegExp) {
    await expect(targetPage.errorMessage).toBeVisible();
    if (message) {
      await expect(targetPage.errorMessage).toContainText(message);
    }
  }
}
