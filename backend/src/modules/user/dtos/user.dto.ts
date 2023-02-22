import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

class Otp {
  @IsNumber()
  code: number;
  @IsDate()
  expiresIn: Date;
}

export class UserDto {
  @MaxLength(11)
  @MinLength(11)
  @IsNotEmpty()
  mobile: string;
  @IsOptional()
  otp: Otp;
}
