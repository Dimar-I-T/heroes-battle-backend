import { Test, TestingModule } from '@nestjs/testing';
import { PlayerHeroesController } from './player-heroes.controller';

describe('PlayerHeroesController', () => {
  let controller: PlayerHeroesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerHeroesController],
    }).compile();

    controller = module.get<PlayerHeroesController>(PlayerHeroesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
