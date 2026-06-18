import { Module } from '@nestjs/common';
import { PlayerHeroesController } from './player-heroes.controller';
import { PlayerHeroesService } from './player-heroes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player_Hero } from './player-heroes.entity';
import { HeroesModule } from '../heroes/heroes.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Player_Hero]),
    HeroesModule
  ],
  controllers: [PlayerHeroesController],
  providers: [PlayerHeroesService],
  exports: [PlayerHeroesService]
})
export class PlayerHeroesModule {}
