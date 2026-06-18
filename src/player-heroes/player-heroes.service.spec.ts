import { Test, TestingModule } from '@nestjs/testing';
import { PlayerHeroesService } from './player-heroes.service';

describe('PlayerHeroesService', () => {
  let service: PlayerHeroesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerHeroesService],
    }).compile();

    service = module.get<PlayerHeroesService>(PlayerHeroesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
