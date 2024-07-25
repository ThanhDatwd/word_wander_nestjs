import { IsEmail, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @MinLength(6)
  username: string;
  @IsEmail()
  email: string;
  @MinLength(6)
  @MaxLength(15)
  password: string;
}
