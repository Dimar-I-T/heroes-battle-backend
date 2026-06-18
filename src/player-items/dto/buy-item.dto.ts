import { IsNotEmpty, IsString } from "class-validator";

export class BuyItemDto {
    @IsString()
    @IsNotEmpty()
    item_id!: string;
}