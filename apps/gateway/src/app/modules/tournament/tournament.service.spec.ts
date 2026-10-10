import { Test, TestingModule } from '@nestjs/testing';
import { TournamentService } from './tournament.service';
import { CreateTournamentInput } from './dto/create-tournament.input';
import { TournamentFormat } from './enums/tournament-format.enum';
import { TournamentType } from './enums/tournament-type.enum';
import { TournamentVisibility } from './enums/tournament-visibility.enum';

describe('TournamentService', () => {
  let service: TournamentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TournamentService],
    }).compile();

    service = module.get<TournamentService>(TournamentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTournament', () => {
    it('should have a create method stub', async () => {
      const createTournamentInput: CreateTournamentInput = {
        name: 'Test Tournament',
        type: TournamentType.ONLINE,
        format: TournamentFormat.LEAGUE,
        visibility: TournamentVisibility.PUBLIC,
        startDate: new Date(Date.now() + 1000 * 60 * 60),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
        registrationDeadline: new Date(Date.now() + 1000 * 60 * 30),
      };

      await expect(
        service.createTournament(
          createTournamentInput,
          'creator-id',
        ),
      ).rejects.toThrow();
    });
  });
});
