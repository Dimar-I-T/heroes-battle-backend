import { Controller, Get, Post, Body, Param, ParseUUIDPipe, Put, Delete } from '@nestjs/common';

import { PlayersService } from './player.service';
import { CreatePlayerDto } from './dto/create-player.dto';

@Controller('players')
export class PlayersController {
    constructor(private readonly usersService: PlayersService) { }

    @Post()
    create(@Body() dto: CreatePlayerDto) {
        return this.usersService.create(dto);
    }

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':player_id')
    findOne(@Param('player_id', ParseUUIDPipe) player_id: string) {
        return this.usersService.findOne(player_id);
    }

    @Put(':player_id')
    update(
        @Param('player_id', ParseUUIDPipe) player_id: string,
        @Body() dto: Partial<CreatePlayerDto>,
    ) {
        return this.usersService.update(player_id, dto);
    }

    @Delete(':player_id')
    remove(@Param('player_id', ParseUUIDPipe) player_id: string) {
        return this.usersService.remove(player_id);
    }
}