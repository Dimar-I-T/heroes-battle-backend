import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayersService } from './player.service';
import { PlayersController } from './player.controller';
import { Player } from './player.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Player])],
    providers: [PlayersService],
    controllers: [PlayersController],
    exports: [PlayersService],
})
export class PlayersModule { }