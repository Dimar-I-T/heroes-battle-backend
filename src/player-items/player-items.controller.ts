import { Controller, UseGuards, Request, Body, Post, Get, Delete, Param, ParseUUIDPipe } from '@nestjs/common';
import { PlayerItemsService } from './player-items.service';
import { ResponseMessage } from '../common/decorators/response.message.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { BuyItemDto } from './dto/buy-item.dto';

@Controller('player-items')
export class PlayerItemsController {
    constructor(private readonly playerItemService: PlayerItemsService) {}

    @UseGuards(AuthGuard)
    @Get('me')
    @ResponseMessage('Successfully retrieved owned items')
    getMyItems(@Request() req: any) {
        const player_id = req.player.sub;
        return this.playerItemService.getMyItems(player_id);
    }

    @UseGuards(AuthGuard)
    @Post('buy')
    @ResponseMessage('Successfully bought the item')
    buyItem(@Request() req: any, @Body() dto: BuyItemDto) {
        const player_id = req.player.sub;
        return this.playerItemService.buyItem(player_id, dto.item_id);
    }

    @UseGuards(AuthGuard)
    @Delete(':item_id')
    @ResponseMessage('Successfully sold item')
    sellItem(@Request() req: any, @Param('item_id', ParseUUIDPipe) item_id: string) {
        const player_id = req.player.sub;
        return this.playerItemService.sellItem(player_id, item_id);
    }
}
