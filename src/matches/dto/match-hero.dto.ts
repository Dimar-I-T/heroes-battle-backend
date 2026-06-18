import { IsNotEmpty, IsString } from "class-validator";

export class MatchHeroDto {
    @IsString()
    @IsNotEmpty()
    hero_id!: string;
}