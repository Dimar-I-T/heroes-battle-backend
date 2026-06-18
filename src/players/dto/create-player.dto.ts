import { IsString, Matches, MinLength } from 'class-validator';

export class CreatePlayerDto {
  @IsString()
  @MinLength(3)
  username!: string;

  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?~`]).+$/, {
    message: 'Password has to contain capital letter, number, and symbol',
  })
  password!: string;
}