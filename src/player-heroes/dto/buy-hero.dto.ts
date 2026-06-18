import { IsNotEmpty, IsString } from "class-validator";

export class BuyHeroDto {
    @IsString()
    @IsNotEmpty()
    hero_id!: string;
}