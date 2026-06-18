import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';

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

    async findAll(): Promise<Player[]> {
        return this.playerRepository.find();
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

    async update(player_id: string, dto: Partial<CreatePlayerDto>): Promise<Player> {
        const user = await this.findOne(player_id);
        Object.assign(user, dto);
        return this.playerRepository.save(user);
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
}