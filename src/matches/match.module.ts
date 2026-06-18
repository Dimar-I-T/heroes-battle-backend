import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Player } from "src/players/player.entity";
import { PlayersService } from "src/players/player.service";
import { MatchController } from "./match.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Player])],
    providers: [PlayersService],
    controllers: [MatchController],
    exports: [],
})
export class MatchModule { }