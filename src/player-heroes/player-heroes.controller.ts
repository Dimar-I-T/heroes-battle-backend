import { Controller, UseGuards, Request, Body, Post, Get, Delete, Param, ParseUUIDPipe } from '@nestjs/common';
import { PlayerHeroesService } from './player-heroes.service';
import { ResponseMessage } from 'src/common/decorators/response.message.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { BuyHeroDto } from './dto/buy-hero.dto';

@Controller('player-heroes')
export class PlayerHeroesController {
    constructor(private readonly playerHeroService: PlayerHeroesService) {}

    @UseGuards(AuthGuard)
    @Get('me')
    @ResponseMessage('Successfully retrieved owned heroes')
    getMyHeroes(@Request() req: any) {
        const player_id = req.player.sub;
        return this.playerHeroService.getMyHeroes(player_id);
    }

    @UseGuards(AuthGuard)
    @Post('buy')
    @ResponseMessage('Successfully bought the hero')
    buyHero(@Request() req: any, @Body() dto: BuyHeroDto) {
        const player_id = req.player.sub;
        return this.playerHeroService.buyHero(player_id, dto.hero_id);
    }

    @UseGuards(AuthGuard)
    @Delete(':hero_id')
    @ResponseMessage('Successfully sold hero')
    sellHero(@Request() req: any, @Param('hero_id', ParseUUIDPipe) hero_id: string) {
        const player_id = req.player.sub;
        return this.playerHeroService.sellHero(player_id, hero_id);
    }
}
