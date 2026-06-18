import { Injectable, NotFoundException } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { Hero } from './heroes.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { heroSortType } from './types';
import { sortOptionType } from 'src/players/types';

@Injectable()
export class HeroesService {
    constructor(
        @InjectRepository(Hero)
        private readonly heroRepository: Repository<Hero>
    ) { }

    async findHeroes(search: string, limit: number, sort: heroSortType, option: sortOptionType): Promise<Hero[]> {
        let searchFind: any, sortFind: any;
        if (search) {
            searchFind = {
                name: ILike(`%${search}%`)
            };
        }

        if (sort) {
            sortFind = {
                [sort]: option
            };
        }

        return await this.heroRepository.find({
            where: searchFind,
            order: sortFind,
            take: limit
        });
    }

    async findHeroById(hero_id: string): Promise<Hero> {
        const hero = await this.heroRepository.findOne({
            where: {hero_id}
        });

        if (!hero) {
            throw new NotFoundException(`Hero with hero_id ${hero_id}doesn\'t exist`);
        }

        return hero;
    }

    async getRandomHero(): Promise<Hero> {
        const allHero = await this.heroRepository.find();
        const n = allHero.length;
        const randomIndex = Math.floor(n * Math.random());
        return allHero[randomIndex];
    }
}
