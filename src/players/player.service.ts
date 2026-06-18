import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Player } from './player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { sortOptionType } from './types';
import { UpdatePlayerDto } from './dto/update-player.dto';

@Injectable()
export class PlayersService {
    constructor(
        @InjectRepository(Player)
        private readonly playerRepository: Repository<Player>,
    ) { }

    async create(username: string, hashed_password: string): Promise<Player> {
        try {
            const player = this.playerRepository.create({
                username, hashed_password
            });
            return await this.playerRepository.save(player);
        } catch (error: any) {
            if (error.code === '23505') {
                throw new ConflictException('Username already registered, please use a different one');
            }

            throw new InternalServerErrorException('There\'s some error in the server');
        }
    }

    async findAll(search: string, limit: number, sort: string, sortOption: sortOptionType): Promise<Omit<Player, 'hashed_password'>[]> {
        let searchFind: any;
        let orderFind: any;
        if (search) {
            searchFind = {
                username: ILike(`%${search}%`)
            }
        }

        if (sort) {
            if (sortOption) {
                orderFind = {
                    [sort]: sortOption
                }
            }
        } else {
            orderFind = {
                player_id: "ASC"
            }
        }

        const players = await this.playerRepository.find({
            where: searchFind,
            order: orderFind,
            take: limit
        });

        const result: Omit<Player, 'hashed_password'>[] = this.getPlayers(players);
        return result;
    }

    async findOne(username: string): Promise<Player> {
        const player = await this.playerRepository.findOne({ where: { username } });
        if (!player) {
            throw new NotFoundException(`User #${username} not found`);
        }

        return player;
    }

    async findById(player_id: string): Promise<Omit<Player, 'hashed_password'>> {
        const player = await this.playerRepository.findOne({ where: { player_id } });
        if (!player) {
            throw new NotFoundException(`User #${player_id} not found`);
        }

        const { hashed_password, ...playerToSend } = player;
        return playerToSend;
    }

    async getLeaderboard(limit: number): Promise<Omit<Player, 'hashed_password'>[]> {
        const players = await this.playerRepository.find({
            order: {
                wins: 'DESC'
            },
            take: limit
        });

        const result = this.getPlayers(players);
        return result;
    }

    async update(player_id: string, dto: Partial<UpdatePlayerDto>): Promise<Omit<Player, 'hashed_password'>> {
        const player = await this.playerRepository.findOne({ where: { player_id } });
        if (!player) {
            throw new NotFoundException(`User #${player_id} not found`);
        }

        if (dto.username) {
            player.username = dto.username;
        }

        await this.playerRepository.save(player);
        const { hashed_password, ...playerToSend } = player;
        return playerToSend;
    }

    async updateCoins(player_id: string, coins: number): Promise<void> {
        if (coins < 0) {
            throw new Error('Coins cannot be negative')
        }
        
        const player = await this.playerRepository.findOne({
            where: { player_id }
        });

        if (!player) {
            throw new NotFoundException(`User #${player_id} not found`);
        }

        player.coins = coins;
        await this.playerRepository.save(player);
    }

    async remove(player_id: string): Promise<void> {
        await this.playerRepository.delete(player_id);
    }

    async result(winner_id: string, loser_id: string): Promise<void> {
        await this.playerRepository.increment(
            { player_id: winner_id },
            'wins',
            1
        );

        await this.playerRepository.increment(
            { player_id: loser_id },
            'losses',
            1
        );

        await this.playerRepository.increment(
            { player_id: winner_id },
            'coins',
            50
        );
    }

    private getPlayers(players: Player[]): Omit<Player, 'hashed_password'>[] {
        let result: Omit<Player, 'hashed_password'>[] = []
        players.forEach((player: Player) => {
            const { hashed_password, ...playerToSend } = player;
            result.push(playerToSend);
        })

        return result;
    }
}