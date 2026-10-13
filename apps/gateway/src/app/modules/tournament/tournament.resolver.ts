import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';

import { CreateTournamentInput } from './dto/create-tournament.input';
import { UpdateTournamentInput } from './dto/update-tournament.input';
import { TournamentsInput } from './dto/tournaments.input';
import {
  CreateCustomMatchInput,
  MatchesFilterInput,
  RecordMatchResultInput,
  RegisterTeamInput,
} from './dto/match.input';
import { TournamentEntity } from './entity/tournament.entity';
import { MatchEntity } from './entity/match.entity';
import { PaginatedTournamentsEntity } from './entity/paginated-tournaments.entity';
import { TournamentService } from './tournament.service';
import { CurrentUser } from '../auth/current-user.decorator';
import type { CurrentUserPayload } from '../auth/current-user.decorator';

@Resolver(() => TournamentEntity)
export class TournamentResolver {
  constructor(
    private readonly tournamentService: TournamentService,
  ) {}

  @Mutation(() => TournamentEntity)
  async createTournament(
    @Args('input')
    input: CreateTournamentInput,
    @CurrentUser()
    currentUser?: CurrentUserPayload,
  ): Promise<TournamentEntity> {
    return this.tournamentService.createTournament(
      input,
      currentUser?.userId,
    );
  }

  @Query(() => PaginatedTournamentsEntity)
  async tournaments(
    @Args('input', { nullable: true })
    input?: TournamentsInput,
  ): Promise<PaginatedTournamentsEntity> {
    return this.tournamentService.findAllTournaments(
      input ?? new TournamentsInput(),
    );
  }

  @Query(() => TournamentEntity)
  async tournament(
    @Args('id')
    id: string,
  ): Promise<TournamentEntity> {
    return this.tournamentService.findTournamentById(id);
  }

  @Query(() => [MatchEntity])
  async matches(
    @Args('filter', { nullable: true })
    filter?: MatchesFilterInput,
  ): Promise<MatchEntity[]> {
    return this.tournamentService.findAllMatches(filter);
  }

  @Mutation(() => TournamentEntity)
  async updateTournament(
    @Args('id')
    id: string,
    @Args('input')
    input: UpdateTournamentInput,
    @CurrentUser()
    currentUser?: CurrentUserPayload,
  ): Promise<TournamentEntity> {
    return this.tournamentService.updateTournament(
      id,
      input,
      currentUser?.userId,
    );
  }

  @Mutation(() => Boolean)
  async deleteTournament(
    @Args('id')
    id: string,
    @CurrentUser()
    currentUser?: CurrentUserPayload,
  ): Promise<boolean> {
    return this.tournamentService.deleteTournament(
      id,
      currentUser?.userId,
    );
  }

  @Mutation(() => TournamentEntity)
  async registerTournament(
    @Args('id')
    id: string,
    @Args('participantId', { nullable: true })
    participantId?: string,
    @CurrentUser()
    currentUser?: CurrentUserPayload,
  ): Promise<TournamentEntity> {
    const targetUserId = participantId || currentUser?.userId;
    if (!targetUserId) {
      throw new Error('participantId or authenticated user is required to register');
    }
    return this.tournamentService.registerForTournament(
      id,
      targetUserId,
    );
  }

  @Mutation(() => TournamentEntity)
  async seedTournamentPlayers(
    @Args('id')
    id: string,
    @Args('playerCount', { type: () => Int, nullable: true })
    playerCount?: number,
  ): Promise<TournamentEntity> {
    return this.tournamentService.seedTournamentPlayersAndMatches(
      id,
      playerCount,
    );
  }

  @Mutation(() => TournamentEntity)
  async generateTournamentMatches(
    @Args('id')
    id: string,
  ): Promise<TournamentEntity> {
    return this.tournamentService.generateTournamentMatches(id);
  }

  @Mutation(() => TournamentEntity)
  async closeRegistration(
    @Args('id')
    id: string,
  ): Promise<TournamentEntity> {
    return this.tournamentService.closeRegistration(id);
  }

  @Mutation(() => TournamentEntity)
  async drawWaveFixtures(
    @Args('id')
    id: string,
  ): Promise<TournamentEntity> {
    return this.tournamentService.drawWaveFixtures(id);
  }

  @Mutation(() => TournamentEntity)
  async registerTeam(
    @Args('id')
    id: string,
    @Args('input')
    input: RegisterTeamInput,
  ): Promise<TournamentEntity> {
    return this.tournamentService.registerTeam(id, input);
  }

  @Mutation(() => TournamentEntity)
  async createCustomMatch(
    @Args('input')
    input: CreateCustomMatchInput,
  ): Promise<TournamentEntity> {
    return this.tournamentService.createCustomMatch(input);
  }

  @Mutation(() => TournamentEntity)
  async recordMatchResult(
    @Args('input')
    input: RecordMatchResultInput,
  ): Promise<TournamentEntity> {
    return this.tournamentService.recordMatchResult(input);
  }

  @Mutation(() => TournamentEntity)
  async resetAndSeedDatabase(): Promise<TournamentEntity> {
    return this.tournamentService.resetAndSeedFreshData();
  }
}
