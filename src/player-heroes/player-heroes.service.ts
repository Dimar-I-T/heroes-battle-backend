import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Player_Hero } from './player-heroes.entity';
import { DataSource, Repository } from 'typeorm';
import { HeroesService } from '../heroes/heroes.service';
import { Player } from '../players/player.entity';

@Injectable()
export class PlayerHeroesService {
    constructor(
        @InjectRepository(Player_Hero)
        private readonly playerHeroRepository: Repository<Player_Hero>,
        private readonly heroService: HeroesService,
        private readonly dataSource: DataSource
    ) { }

    async buyHero(player_id: string, hero_id: string): Promise<Player_Hero> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const player = await queryRunner.manager.findOneBy(Player, { player_id });
            if (!player) {
                throw new NotFoundException(`Player with player_id ${player_id} doesn\'t exist`);
            }

            let player_hero_current: Player_Hero[] = await queryRunner.manager.find(Player_Hero, {
                where: { player_id: player_id }
            });

            player_hero_current = player_hero_current.filter((player_hero_c: Player_Hero) => player_hero_c.hero_id === hero_id);

            if (player_hero_current.length === 1) {
                throw new UnprocessableEntityException(`You already have this hero`);
            }

            const hero = await this.heroService.findHeroById(hero_id);
            if (player.coins < hero.cost) {
                throw new UnprocessableEntityException(`Not enough coins to buy ${hero.name}`);
            }

            player.coins -= hero.cost;
            await queryRunner.manager.save(Player, player);

            const player_hero = queryRunner.manager.create(Player_Hero, {
                player_id, hero_id
            });

            const new_player_hero = await queryRunner.manager.save(Player_Hero, player_hero);

            await queryRunner.commitTransaction();
            return new_player_hero;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async getMyHeroes(player_id: string) {
        return await this.playerHeroRepository.createQueryBuilder('player_heroes')
            .leftJoinAndSelect('player_heroes.hero', 'hero')
            .where('player_heroes.player_id = :player_id', { player_id: player_id })
            .getMany();
    }

    async sellHero(player_id: string, hero_id: string): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const player = await queryRunner.manager.findOneBy(Player, { player_id });
            if (!player) {
                throw new NotFoundException(`Player with player_id ${player_id} doesn\'t exist`);
            }

            let player_hero_current: Player_Hero[] = await queryRunner.manager.find(Player_Hero, {
                where: { player_id: player_id }
            });

            player_hero_current = player_hero_current.filter((player_hero_c: Player_Hero) => player_hero_c.hero_id === hero_id);

            if (player_hero_current.length === 0) {
                throw new UnprocessableEntityException(`You don\'t have this hero`);
            }

            const hero = await this.heroService.findHeroById(hero_id);
            player.coins += hero.cost;
            await queryRunner.manager.save(Player, player);
            await queryRunner.manager.delete(Player_Hero, {
                player_id, hero_id
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
