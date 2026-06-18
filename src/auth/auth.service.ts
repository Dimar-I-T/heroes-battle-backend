import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PlayersService } from 'src/players/player.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Player } from 'src/players/player.entity';
import { CreatePlayerDto } from 'src/players/dto/create-player.dto';
import { NotFoundError } from 'rxjs';

@Injectable()
export class AuthService {
    constructor(
        private readonly playersService: PlayersService,
        private jwtService: JwtService
    ) { }
    private readonly salt: number = 10;

    async hashPassword(password: string): Promise<string> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash;
    }

    async comparePassword(passwordPlain: string, passwordHashed: string): Promise<boolean> {
        const same = await bcrypt.compare(passwordPlain, passwordHashed);
        return same;
    }

    async getToken(player_id: string): Promise<any> {
        const payload = {
            sub: player_id
        };

        const token = await this.jwtService.signAsync(payload);
        return token;
    }

    async register(dto: CreatePlayerDto): Promise<any> {
        const username = dto.username;
        const hashed_password = await this.hashPassword(dto.password);
        const player = await this.playersService.create(username, hashed_password);
        return {
            access_token: await this.getToken(player.player_id)
        };
    }

    async signIn(username: string, password: string): Promise<any> {
        const player = await this.playersService.findOne(username);
        const same = await this.comparePassword(password, player.hashed_password);
        if (!same) {
            throw new UnauthorizedException('Incorrect password!');
        }

        return {
            access_token: await this.getToken(player.player_id)
        }
    }

    async getProfile(player_id: string): Promise<Omit<Player, 'hashed_password'>> {
        const player = await this.playersService.findById(player_id);
        return player;
    }
}
