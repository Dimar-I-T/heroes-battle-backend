import { Body, Controller, Post } from "@nestjs/common";
import { PlayersService } from "src/players/player.service";

interface ResultBody {
    winner_id: string,
    loser_id: string
}

@Controller('matches')
export class MatchController {
    constructor(private readonly playerService: PlayersService) { }

    @Post()
    result(@Body() resultBody: ResultBody) {
        return this.playerService.result(resultBody.winner_id, resultBody.loser_id);
    }
}