import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { CurrentUserPayload } from '../auth/current-user.decorator';
import { CreateTournamentInput } from './dto/create-tournament.input';
import { UpdateTournamentInput } from './dto/update-tournament.input';
import { TournamentsInput } from './dto/tournaments.input';
import { TournamentEntity } from './entity/tournament.entity';
import { PaginatedTournamentsEntity } from './entity/paginated-tournaments.entity';
import { TournamentService } from './tournament.service';

@Controller('tournaments')
export class TournamentController {
  constructor(
    private readonly tournamentService: TournamentService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createTournament(
    @Body() createTournamentInput: CreateTournamentInput,
    @CurrentUser() currentUser: CurrentUserPayload,
  ): Promise<TournamentEntity> {
    return this.tournamentService.createTournament(
      createTournamentInput,
      currentUser.userId,
    );
  }

  @Get()
  async findAll(
    @Query() input: TournamentsInput,
  ): Promise<PaginatedTournamentsEntity> {
    return this.tournamentService.findAllTournaments(
      input ?? new TournamentsInput(),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TournamentEntity> {
    return this.tournamentService.findTournamentById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateTournament(
    @Param('id') id: string,
    @Body() input: UpdateTournamentInput,
    @CurrentUser() currentUser: CurrentUserPayload,
  ): Promise<TournamentEntity> {
    return this.tournamentService.updateTournament(
      id,
      input,
      currentUser.userId,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteTournament(
    @Param('id') id: string,
    @CurrentUser() currentUser: CurrentUserPayload,
  ): Promise<boolean> {
    return this.tournamentService.deleteTournament(
      id,
      currentUser.userId,
    );
  }

  @Post(':id/register')
  @UseGuards(JwtAuthGuard)
  async registerForTournament(
    @Param('id') id: string,
    @CurrentUser() currentUser: CurrentUserPayload,
  ): Promise<TournamentEntity> {
    return this.tournamentService.registerForTournament(
      id,
      currentUser.userId,
    );
  }
}
