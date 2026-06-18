import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { ItemsModule } from 'src/items/items.module';
import { PlayerItemsModule } from 'src/player-items/player-items.module';
import { HeroesModule } from 'src/heroes/heroes.module';
import { Match } from './matches.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Match]),
    HeroesModule,
    ItemsModule,
    PlayerItemsModule,
  ],
  controllers: [MatchesController],
  providers: [MatchesService],
  exports: [MatchesService]
})
export class MatchesModule {}
