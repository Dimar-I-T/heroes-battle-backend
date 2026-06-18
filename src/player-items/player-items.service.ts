import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Player_Item } from './player-items.entity';
import { DataSource, Repository } from 'typeorm';
import { Player } from 'src/players/player.entity';
import { ItemsService } from 'src/items/items.service';

@Injectable()
export class PlayerItemsService {
    constructor(
        @InjectRepository(Player_Item)
        private readonly playerItemRepository: Repository<Player_Item>,
        private readonly itemService: ItemsService,
        private readonly dataSource: DataSource
    ) { }

    async buyItem(player_id: string, item_id: string): Promise<Player_Item> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const player = await queryRunner.manager.findOneBy(Player, { player_id });
            if (!player) {
                throw new NotFoundException(`Player with player_id ${player_id} doesn\'t exist`);
            }

            let player_item_current: Player_Item[] = await queryRunner.manager.find(Player_Item, {
                where: { player_id: player_id }
            });

            player_item_current = player_item_current.filter((Player_Item_c: Player_Item) => Player_Item_c.item_id === item_id);

            if (player_item_current.length === 1) {
                throw new UnprocessableEntityException(`You already have this item`);
            }

            const item = await this.itemService.findItemById(item_id);
            if (player.coins < item.cost) {
                throw new UnprocessableEntityException(`Not enough coins to buy ${item.name}`);
            }

            player.coins -= item.cost;
            await queryRunner.manager.save(Player, player);

            const player_item = queryRunner.manager.create(Player_Item, {
                player_id, item_id
            });

            const new_player_item = await queryRunner.manager.save(Player_Item, player_item);

            await queryRunner.commitTransaction();
            return new_player_item;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async getMyItems(player_id: string) {
        return await this.playerItemRepository.createQueryBuilder('player_items')
            .leftJoinAndSelect('player_items.item', 'item')
            .where('player_items.player_id = :player_id', { player_id: player_id })
            .getMany();
    }

    async sellItem(player_id: string, item_id: string): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const player = await queryRunner.manager.findOneBy(Player, { player_id });
            if (!player) {
                throw new NotFoundException(`Player with player_id ${player_id} doesn\'t exist`);
            }

            let player_item_current: Player_Item[] = await queryRunner.manager.find(Player_Item, {
                where: { player_id: player_id }
            });

            player_item_current = player_item_current.filter((Player_Item_c: Player_Item) => Player_Item_c.item_id === item_id);

            if (player_item_current.length === 0) {
                throw new UnprocessableEntityException(`You don\'t have this item`);
            }

            const item = await this.itemService.findItemById(item_id);
            player.coins += item.cost;
            await queryRunner.manager.save(Player, player);
            await queryRunner.manager.delete(Player_Item, {
                player_id, item_id
            });

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
