import { Module } from '@nestjs/common';
import { HeroesController } from './heroes.controller';
import { HeroesService } from './heroes.service';
import { Hero } from './heroes.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Hero])],
  controllers: [HeroesController],
  providers: [HeroesService],
  exports: [HeroesService]
})
export class HeroesModule {}
