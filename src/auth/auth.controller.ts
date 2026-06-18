import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseFilters, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { CreatePlayerDto } from '../players/dto/create-player.dto';
import { ResponseMessage } from '../common/decorators/response.message.decorator';
import { CustomResponseFilter } from '../common/filters/custom-response.filter';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    @ResponseMessage('Successfully registered')
    @UseFilters(CustomResponseFilter)
    register(@Body() dto: CreatePlayerDto) {
        return this.authService.register(dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    @ResponseMessage('Successfully logged in')
    @UseFilters(CustomResponseFilter)
    signIn(@Body() signInDto: Record<string, any>) {
        return this.authService.signIn(signInDto.username, signInDto.password);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    @ResponseMessage('Successfully retrieved profile data')
    @UseFilters(CustomResponseFilter)
    getProfile(@Request() req: any) {
        const playerPayload = req.player;
        const player_id = playerPayload.sub;
        return this.authService.getProfile(player_id);
    }
}
