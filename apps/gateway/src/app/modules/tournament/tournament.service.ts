import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Tournament,
  TournamentDocument,
} from './schemas/tournament.schema';
import { CreateTournamentInput } from './dto/create-tournament.input';
import { UpdateTournamentInput } from './dto/update-tournament.input';
import { TournamentsInput } from './dto/tournaments.input';
import { PaginatedTournamentsEntity } from './entity/paginated-tournaments.entity';
import { TournamentEntity } from './entity/tournament.entity';
import { TOURNAMENT_ERRORS } from './tournament.constants';

@Injectable()
export class TournamentService {
  constructor(
    @InjectModel(Tournament.name)
    private readonly tournamentModel: Model<TournamentDocument>,
  ) {}

  async createTournament(
    createTournamentInput: CreateTournamentInput,
    creatorId: string,
  ): Promise<TournamentEntity> {
    throw new Error('Tournament creation flow not implemented');
  }

  async findAllTournaments(
    input: TournamentsInput,
  ): Promise<PaginatedTournamentsEntity> {
    throw new Error('Tournament list flow not implemented');
  }

  async findTournamentById(
    id: string,
  ): Promise<TournamentEntity> {
    throw new NotFoundException(
      TOURNAMENT_ERRORS.NOT_FOUND,
    );
  }

  async updateTournament(
    id: string,
    input: UpdateTournamentInput,
    currentUserId: string,
  ): Promise<TournamentEntity> {
    throw new ForbiddenException(
      TOURNAMENT_ERRORS.UNAUTHORIZED,
    );
  }

  async deleteTournament(
    id: string,
    currentUserId: string,
  ): Promise<boolean> {
    throw new ForbiddenException(
      TOURNAMENT_ERRORS.UNAUTHORIZED,
    );
  }

  async registerForTournament(
    id: string,
    participantId: string,
  ): Promise<TournamentEntity> {
    throw new Error('Tournament registration flow not implemented');
  }
}
