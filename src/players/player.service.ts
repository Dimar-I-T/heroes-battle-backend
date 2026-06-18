import { Injectable, NotFoundException } from '@nestjs/common';
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

    async create(dto: CreatePlayerDto): Promise<Player> {
        const user = this.playerRepository.create(dto);
        return this.playerRepository.save(user);
    }

    async findAll(): Promise<Player[]> {
        return this.playerRepository.find();
    }

    async findOne(player_id: string): Promise<Player> {
        const user = await this.playerRepository.findOne({ where: { player_id } });
        if (!user) {
            throw new NotFoundException(`User #${player_id} not found`);
        }
        return user;
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
            {player_id: winner_id},
            'wins',
            1
        );

        await this.playerRepository.increment(
            {player_id: loser_id},
            'losses',
            1
        );

        await this.playerRepository.increment(
            {player_id: winner_id},
            'coins',
            50
        );
    }
}