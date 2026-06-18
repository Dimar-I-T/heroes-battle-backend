import { Controller, Get, Query } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ResponseMessage } from '../common/decorators/response.message.decorator';
import type { itemSortType } from './types';
import type { sortOptionType } from '../players/types';

@Controller('items')
export class ItemsController {
    constructor(private readonly itemService: ItemsService) { }

    @Get()
    @ResponseMessage('Successfully retrieved items')
    findItems(@Query('search') search: string, @Query('limit') limit: number = 20, @Query('sort') sort: itemSortType = 'cost', @Query('option') sortOption: sortOptionType = 'asc') {
        return this.itemService.findItems(search, limit, sort, sortOption);
    }
}
