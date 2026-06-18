import { Injectable, NotFoundException } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { Item } from './items.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { itemSortType } from './types';
import { sortOptionType } from '../players/types';

@Injectable()
export class ItemsService {
    constructor(
        @InjectRepository(Item)
        private readonly itemRepository: Repository<Item>
    ) { }

    async findItems(search: string, limit: number, sort: itemSortType, option: sortOptionType): Promise<Item[]> {
        let searchFind: any, sortFind: any;
        if (search) {
            searchFind = {
                name: ILike(`%${search}%`)
            };
        }

        if (sort) {
            sortFind = {
                [sort]: option
            }
        }

        return await this.itemRepository.find({
            where: searchFind,
            order: sortFind,
            take: limit
        });
    }

    async findItemById(item_id: string): Promise<Item> {
        const hero = await this.itemRepository.findOne({
            where: { item_id }
        });

        if (!hero) {
            throw new NotFoundException(`Hero with item_id ${item_id}doesn\'t exist`);
        }

        return hero;
    }
}
