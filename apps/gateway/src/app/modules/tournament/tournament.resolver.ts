import {
  Args,
  Mutation,
  Query,
  Resolver,
  UseGuards,
} from '@nestjs/graphql';

import { CreateTournamentInput } from './dto/create-tournament.input';
import { UpdateTournamentInput } from './dto/update-tournament.input';
import { TournamentsInput } from './dto/tournaments.input';
import { TournamentEntity } from './entity/tournament.entity';
import { PaginatedTournamentsEntity } from './entity/paginated-tournaments.entity';
import { TournamentService } from './tournament.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../auth/current-user.decorator';

@Resolver(() => TournamentEntity)
export class TournamentResolver {
  constructor(
    private readonly tournamentService: TournamentService,
  ) {}

  @Mutation(() => TournamentEntity)
  @UseGuards(JwtAuthGuard)
  async createTournament(
    @Args('input')
    input: CreateTournamentInput,
    @CurrentUser()
    currentUser: CurrentUserPayload,
  ): Promise<TournamentEntity> {
    return this.tournamentService.createTournament(
      input,
      currentUser.userId,
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
  @UseGuards(JwtAuthGuard)
  async updateTournament(
    @Args('id')
    id: string,
    @Args('input')
    input: UpdateTournamentInput,
    @CurrentUser()
    currentUser: CurrentUserPayload,
  ): Promise<TournamentEntity> {
    return this.tournamentService.updateTournament(
      id,
      input,
      currentUser.userId,
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteTournament(
    @Args('id')
    id: string,
    @CurrentUser()
    currentUser: CurrentUserPayload,
  ): Promise<boolean> {
    return this.tournamentService.deleteTournament(
      id,
      currentUser.userId,
    );
  }

  @Mutation(() => TournamentEntity)
  @UseGuards(JwtAuthGuard)
  async registerTournament(
    @Args('id')
    id: string,
    @CurrentUser()
    currentUser: CurrentUserPayload,
  ): Promise<TournamentEntity> {
    return this.tournamentService.registerForTournament(
      id,
      currentUser.userId,
    );
  }
}
