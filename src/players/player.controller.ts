import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';

import { PlayersService } from './player.service';

@Controller('players')
export class PlayersController {
    constructor(private readonly playerService: PlayersService) { }
    @Get()
    findAll() {
        return this.playerService.findAll();
    }

    @Get(':player_id')
    findOne(@Param('player_id', ParseUUIDPipe) player_id: string) {
        return this.playerService.findOne(player_id);
    }
}