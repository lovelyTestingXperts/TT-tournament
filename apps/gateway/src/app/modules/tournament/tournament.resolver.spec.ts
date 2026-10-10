import { Test, TestingModule } from '@nestjs/testing';
import { TournamentResolver } from './tournament.resolver';
import { TournamentService } from './tournament.service';

class MockTournamentService {}

describe('TournamentResolver', () => {
  let resolver: TournamentResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TournamentResolver,
        {
          provide: TournamentService,
          useClass: MockTournamentService,
        },
      ],
    }).compile();

    resolver = module.get<TournamentResolver>(TournamentResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
