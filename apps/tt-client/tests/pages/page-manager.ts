import { Page } from '@playwright/test';
import { LoginPage } from './login.page';
import { RegisterPage } from './register.page';
import { MembersPage } from './members.page';
import { CreateMemberPage } from './create-member.page';
import { EditMemberPage } from './edit-member.page';
import { MemberDetailsPage } from './member-details.page';
import { TournamentsPage } from './tournaments.page';
import { CreateTournamentPage } from './create-tournament.page';
import { TournamentDetailsPage } from './tournament-details.page';

export class PageManager {
  private readonly page: Page;
  private _loginPage?: LoginPage;
  private _registerPage?: RegisterPage;
  private _membersPage?: MembersPage;
  private _createMemberPage?: CreateMemberPage;
  private _editMemberPage?: EditMemberPage;
  private _memberDetailsPage?: MemberDetailsPage;
  private _tournamentsPage?: TournamentsPage;
  private _createTournamentPage?: CreateTournamentPage;
  private _tournamentDetailsPage?: TournamentDetailsPage;

  constructor(page: Page) {
    this.page = page;
  }

  get login(): LoginPage {
    if (!this._loginPage) {
      this._loginPage = new LoginPage(this.page);
    }
    return this._loginPage;
  }

  get register(): RegisterPage {
    if (!this._registerPage) {
      this._registerPage = new RegisterPage(this.page);
    }
    return this._registerPage;
  }

  get members(): MembersPage {
    if (!this._membersPage) {
      this._membersPage = new MembersPage(this.page);
    }
    return this._membersPage;
  }

  get createMember(): CreateMemberPage {
    if (!this._createMemberPage) {
      this._createMemberPage = new CreateMemberPage(this.page);
    }
    return this._createMemberPage;
  }

  get editMember(): EditMemberPage {
    if (!this._editMemberPage) {
      this._editMemberPage = new EditMemberPage(this.page);
    }
    return this._editMemberPage;
  }

  get memberDetails(): MemberDetailsPage {
    if (!this._memberDetailsPage) {
      this._memberDetailsPage = new MemberDetailsPage(this.page);
    }
    return this._memberDetailsPage;
  }

  get tournaments(): TournamentsPage {
    if (!this._tournamentsPage) {
      this._tournamentsPage = new TournamentsPage(this.page);
    }
    return this._tournamentsPage;
  }

  get createTournament(): CreateTournamentPage {
    if (!this._createTournamentPage) {
      this._createTournamentPage = new CreateTournamentPage(this.page);
    }
    return this._createTournamentPage;
  }

  get tournamentDetails(): TournamentDetailsPage {
    if (!this._tournamentDetailsPage) {
      this._tournamentDetailsPage = new TournamentDetailsPage(this.page);
    }
    return this._tournamentDetailsPage;
  }
}
