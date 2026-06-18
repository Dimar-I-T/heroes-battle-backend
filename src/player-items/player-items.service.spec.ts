import { Test, TestingModule } from '@nestjs/testing';
import { PlayerItemsService } from './player-items.service';

describe('PlayerItemsService', () => {
  let service: PlayerItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerItemsService],
    }).compile();

    service = module.get<PlayerItemsService>(PlayerItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
