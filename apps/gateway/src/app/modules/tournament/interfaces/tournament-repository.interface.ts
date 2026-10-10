import { CreateTournamentInput } from '../dto/create-tournament.input';
import { UpdateTournamentInput } from '../dto/update-tournament.input';
import { TournamentsInput } from '../dto/tournaments.input';
import { TournamentEntity } from '../entity/tournament.entity';
import { PaginatedTournamentsEntity } from '../entity/paginated-tournaments.entity';

export interface TournamentRepositoryInterface {
  createTournament(
    createTournamentInput: CreateTournamentInput,
    creatorId: string,
  ): Promise<TournamentEntity>;

  findAllTournaments(
    input: TournamentsInput,
  ): Promise<PaginatedTournamentsEntity>;

  findTournamentById(id: string): Promise<TournamentEntity>;

  updateTournament(
    id: string,
    updatePayload: UpdateTournamentInput,
    currentUserId: string,
  ): Promise<TournamentEntity>;

  deleteTournament(
    id: string,
    currentUserId: string,
  ): Promise<boolean>;

  registerForTournament(
    id: string,
    participantId: string,
  ): Promise<TournamentEntity>;
}
