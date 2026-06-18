import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Match } from './matches.entity';
import { HeroesService } from 'src/heroes/heroes.service';
import { Player } from 'src/players/player.entity';
import { Player_Hero } from 'src/player-heroes/player-heroes.entity';
import { ItemsService } from 'src/items/items.service';
import { PlayerItemsService } from 'src/player-items/player-items.service';
import { Item } from 'src/items/items.entity';
import { Player_Item } from 'src/player-items/player-items.entity';
import { resultMatchType } from './types';

const rPS: string[] = ['rock', 'paper', 'scissors'];
const resultMatrix: resultRPSType[][] = [
    ['draw', 'lose', 'win'],
    ['win', 'draw', 'lose'],
    ['lose', 'win', 'draw']
];

// draw, lose, win, : 00, 01, 02 
// win, draw, lose  : 10, 11, 12
// lose, win, draw  : 20, 21, 22

type resultRPSType = 'win' | 'lose' | 'draw';

function getRandomRPS(): string {
    return rPS[Math.floor(rPS.length * Math.random())];
}

function rPSResult(heroRPS: string, enemyRPS: string): resultRPSType {
    const row: number = rPS.indexOf(heroRPS);
    const col: number = rPS.indexOf(enemyRPS);
    return resultMatrix[row][col];
}

@Injectable()
export class MatchesService {
    constructor(
        @InjectRepository(Match)
        private readonly matchRepository: Repository<Match>,
        private readonly dataSource: DataSource,
        private readonly heroService: HeroesService,
        private readonly itemService: ItemsService,
        private readonly playerItemService: PlayerItemsService
    ) { }

    async startMatch(player_id: string, hero_id: string): Promise<any> {
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
                throw new UnprocessableEntityException(`You don't have this hero`);
            }

            let simulationMessage: string = 'WELCOME TO THE MATCH!';

            let heroPlayer = await this.heroService.findHeroById(hero_id);
            simulationMessage += `\nYour hero is ${heroPlayer.name}`;
            simulationMessage += `\nHealth: ${heroPlayer.health}`;
            simulationMessage += `\nDamage: ${heroPlayer.damage}`;
            const items_id = await this.playerItemService.getMyItems(player_id);

            const items: Item[] = []
            simulationMessage += `\nYour items are:`
            items_id.forEach(async (player_item: Player_Item) => {
                const itemToPush = await this.itemService.findItemById(player_item.item_id);
                if (itemToPush) {
                    items.push(itemToPush);
                }
                simulationMessage += `\n- ${itemToPush.name} (plus_health: ${itemToPush.plus_health}, plus_damage: ${itemToPush.plus_damage})`;
            });

            let enemy = await this.heroService.getRandomHero();
            simulationMessage += `\n\nYour enemy is ${enemy.name}`;
            simulationMessage += `\nHealth: ${enemy.health}`;
            simulationMessage += `\nDamage: ${enemy.damage}`;

            let win: boolean = true;
            let k = 1;
            while (heroPlayer.health > 0 && enemy.health > 0) {
                simulationMessage += `\n\nROUND ${k}`;
                const n = items.length
                let selectedItem: any;
                let isSelectingItem: any;
                if (n > 0) {
                    simulationMessage += `\nYou wanna use an item? `
                    isSelectingItem = Math.floor(1 * Math.random());
                    if (isSelectingItem === 1) {
                        simulationMessage += `\nYES, selecting random item`
                        const randomIndex = Math.floor(n * Math.random());
                        selectedItem = items[randomIndex];
                        items.splice(randomIndex, 1);
                        heroPlayer.damage += selectedItem.plus_damage;
                        heroPlayer.health += selectedItem.plus_health;
                        simulationMessage += `\nYour damage + ${selectedItem.plus_damage} damage for one round`
                        simulationMessage += `\nYour health + ${selectedItem.plus_health} if you lose this round`
                    } else {
                        simulationMessage += `\nNO, skipping item`;
                    }
                } else {
                    simulationMessage += `\nYou don\'t have any more items`;
                }

                simulationMessage += `\n\nRock, Paper, Scissors!`;
                const rpsHero = getRandomRPS();
                const rpsEnemy = getRandomRPS();
                const resultCurr = rPSResult(rpsHero, rpsEnemy);
                simulationMessage += `\n`
                simulationMessage += `\nYour choice: ${rpsHero}`;
                simulationMessage += `\nEnemy\'s choice ${rpsEnemy}`;

                if (resultCurr === 'win') {
                    simulationMessage += `\nYou WIN round ${k}! attacking enemy by ${heroPlayer.damage} damage`;
                    enemy.health -= heroPlayer.damage;
                    if (isSelectingItem === 1) {
                        heroPlayer.health -= selectedItem.plus_health;
                    }
                } else if (resultCurr === 'lose') {
                    simulationMessage += `\nYou LOSE round ${k}! getting damaged by enemy by ${enemy.damage} damage`;
                    heroPlayer.health -= enemy.damage;
                }

                if (isSelectingItem === 1) {
                    heroPlayer.damage -= selectedItem.plus_damage;
                }

                if (resultCurr === 'draw') {
                    simulationMessage += `\nRound ${k} Result: DRAW`
                    if (isSelectingItem === 1) {
                        heroPlayer.health -= selectedItem.plus_health;
                    }
                } else {
                    simulationMessage += `\nRound ${k} Result:`;
                    simulationMessage += `\nYour Health: ${heroPlayer.health}`;
                    simulationMessage += `\n\nEnemy\'s Health: ${enemy.health}`;
                    if (heroPlayer.health <= 0) {
                        simulationMessage += `\nYou lost the game :(`;
                        win = false;
                        break;
                    }

                    if (enemy.health <= 0) {
                        simulationMessage += `\nCongrats! You won the game!`
                        break;
                    }
                }

                k++;
            }

            let result: resultMatchType = 'win';
            if (win) {
                player.wins++;
                player.coins += enemy.health;
            } else {
                player.losses++;
                result = 'lose';
            }

            await queryRunner.manager.save(Player, player);
            const matchResult = queryRunner.manager.create(Match, {
                player_id, hero_id, enemy_id: enemy.hero_id, result_match: result
            });

            const newMatchResult = await queryRunner.manager.save(Match, matchResult);
            await queryRunner.commitTransaction();
            return {
                simulationMessage: simulationMessage,
                matchResult: newMatchResult
            };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async getMyRecentMatches(player_id: string) {
        const matches = await this.matchRepository.createQueryBuilder('matches')
            .leftJoinAndSelect('matches.hero', 'hero')
            .leftJoinAndSelect('matches.enemy', 'enemy')
            .where('matches.player_id = :player_id', { player_id })
            .orderBy('created_at', 'DESC')
            .getMany();

        if (!matches) {
            throw new NotFoundException(`Matches don't exist`);
        }

        return matches;
    }
}
