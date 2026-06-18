import { Body, Controller, Get, Param, ParseUUIDPipe, Query, UseGuards, Request, Put } from '@nestjs/common';

import { PlayersService } from './player.service';
import type { sortType, sortOptionType } from './types';
import { ResponseMessage } from 'src/common/decorators/response.message.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdatePlayerDto } from './dto/update-player.dto';

@Controller('players')
export class PlayersController {
    constructor(private readonly playerService: PlayersService) { }

    @Get()
    @ResponseMessage('Successfully retrieved players')
    findAll(@Query('search') search: string, @Query('limit') limit: number = 10, @Query('sort') sort: sortType, @Query('option') sortOption: sortOptionType = 'asc') {
        return this.playerService.findAll(search, limit, sort, sortOption);
    }

    @Get('leaderboard')
    @ResponseMessage('Successfully retrieved leaderboard')
    getLeaderboard(@Query('limit') limit: number = 10) {
        return this.playerService.getLeaderboard(limit);
    }

    @UseGuards(AuthGuard)
    @Put('me')
    @ResponseMessage('Successfully updated username')
    updateUsername(@Request() req: any, @Body() updatePlayerDto: UpdatePlayerDto) {
        const player_id = req.player.sub;
        return this.playerService.update(player_id, updatePlayerDto);
    }

    @Get(':player_id')
    @ResponseMessage('Successfully retrieved player')
    findOne(@Param('player_id', ParseUUIDPipe) player_id: string) {
        return this.playerService.findById(player_id);
    }
}