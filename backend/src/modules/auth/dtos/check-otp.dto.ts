import { IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CheckOtpDto {
  @IsNotEmpty()
  @MaxLength(11)
  @MinLength(11)
  mobile: string;

  @IsNotEmpty()
  @MaxLength(4)
  @MinLength(4)
  code: number;
}
