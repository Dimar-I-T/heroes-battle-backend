import { Body, Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { AuthGuard } from '../auth/auth.guard';
import { ResponseMessage } from '../common/decorators/response.message.decorator';
import { MatchHeroDto } from './dto/match-hero.dto';

@Controller('matches')
export class MatchesController {
    constructor(private readonly matchService: MatchesService) {}

    @UseGuards(AuthGuard)
    @Post('start')
    @ResponseMessage('Successfully played match')
    startMatch(@Request() req: any, @Body() matchHeroDto: MatchHeroDto) {
        const player_id = req.player.sub;
        return this.matchService.startMatch(player_id, matchHeroDto.hero_id);
    }

    @UseGuards(AuthGuard)
    @Get('me')
    @ResponseMessage('Successfully retrieved own matches')
    getMatches(@Request() req: any) {
        const player_id = req.player.sub;
        return this.matchService.getMyRecentMatches(player_id);
    }
}
