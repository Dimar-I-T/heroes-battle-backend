import { Controller, Get, Query } from '@nestjs/common';
import { HeroesService } from './heroes.service';
import { ResponseMessage } from 'src/common/decorators/response.message.decorator';
import type { heroSortType } from './types';
import type { sortOptionType } from 'src/players/types';

@Controller('heroes')
export class HeroesController {
    constructor(private readonly heroService: HeroesService) {}

    @Get()
    @ResponseMessage('Successfully retrieved heroes')
    findHeroes(@Query('search') search: string, @Query('limit') limit: number = 20, @Query('sort') sort: heroSortType = 'cost', @Query('option') sortOption: sortOptionType = 'asc') {
        return this.heroService.findHeroes(search, limit, sort, sortOption);
    }
}
