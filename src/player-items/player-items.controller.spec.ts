import { Test, TestingModule } from '@nestjs/testing';
import { PlayerItemsController } from './player-items.controller';

describe('PlayerItemsController', () => {
  let controller: PlayerItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerItemsController],
    }).compile();

    controller = module.get<PlayerItemsController>(PlayerItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
