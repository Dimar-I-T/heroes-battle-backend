import { IsString, MinLength } from 'class-validator';

export class UpdatePlayerDto {
  @IsString()
  @MinLength(3)
  username!: string;
}