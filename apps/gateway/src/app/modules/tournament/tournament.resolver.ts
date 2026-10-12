import {
  Args,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';

import { CreateTournamentInput } from './dto/create-tournament.input';
import { UpdateTournamentInput } from './dto/update-tournament.input';
import { TournamentsInput } from './dto/tournaments.input';
import { TournamentEntity } from './entity/tournament.entity';
import { PaginatedTournamentsEntity } from './entity/paginated-tournaments.entity';
import { TournamentService } from './tournament.service';
import { CurrentUser, CurrentUserPayload } from '../auth/current-user.decorator';

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
}
