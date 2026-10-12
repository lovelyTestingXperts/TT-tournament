import { expect } from '@playwright/test';
import { TournamentsPage } from '../pages/tournaments.page';
import { CreateTournamentPage } from '../pages/create-tournament.page';
import { TournamentDetailsPage } from '../pages/tournament-details.page';

export class TournamentAssertions {
  static async assertTournamentsPageVisible(tournamentsPage: TournamentsPage) {
    await expect(tournamentsPage.pageContainer).toBeVisible();
    await expect(tournamentsPage.header).toBeVisible();
    await expect(tournamentsPage.createTournamentButton).toBeVisible();
    await expect(tournamentsPage.searchInput).toBeVisible();
  }

  static async assertCreateTournamentFormVisible(createPage: CreateTournamentPage) {
    await expect(createPage.pageContainer).toBeVisible();
    await expect(createPage.form).toBeVisible();
    await expect(createPage.nameInput).toBeVisible();
    await expect(createPage.categoryInput).toBeVisible();
    await expect(createPage.typeSelect).toBeVisible();
    await expect(createPage.formatSelect).toBeVisible();
    await expect(createPage.submitButton).toBeVisible();
  }

  static async assertTournamentInGrid(tournamentsPage: TournamentsPage, tournamentName: string) {
    const card = tournamentsPage.getTournamentCard(tournamentName);
    await expect(card).toBeVisible();
  }

  static async assertTournamentNotInGrid(tournamentsPage: TournamentsPage, tournamentName: string) {
    const card = tournamentsPage.getTournamentCard(tournamentName);
    await expect(card).not.toBeVisible();
  }

  static async assertTournamentDetailsVisible(detailsPage: TournamentDetailsPage, expectedName: string) {
    await expect(detailsPage.pageContainer).toBeVisible();
    await expect(detailsPage.hero).toBeVisible();
    await expect(detailsPage.heroName).toContainText(expectedName);
  }

  static async assertSuccessAlertVisible(detailsPage: TournamentDetailsPage, expectedText?: string | RegExp) {
    await expect(detailsPage.alertSuccess).toBeVisible();
    if (expectedText) {
      await expect(detailsPage.alertSuccess).toContainText(expectedText);
    }
  }

  static async assertErrorAlertVisible(
    targetPage: CreateTournamentPage | TournamentDetailsPage,
    expectedText?: string | RegExp,
  ) {
    const errorAlert = targetPage.errorMessage || (targetPage as TournamentDetailsPage).alertError;
    await expect(errorAlert).toBeVisible();
    if (expectedText) {
      await expect(errorAlert).toContainText(expectedText);
    }
  }
}
