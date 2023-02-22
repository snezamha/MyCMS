import {
  Body,
  Controller,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Get,
  Res,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { CheckOtpDto } from './dtos/check-otp.dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { LocalAuthGuard } from '../common/local-auth.guard';
import { Response } from 'express';
import { UserDto } from '../user/dtos/user.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(public authService: AuthService, public jwtService: JwtService) {}
  @Post('/send-otp')
  async sendOtp(@Body() body: UserDto) {
    const user = await this.authService.create(body);
    await this.authService.sendSms(user.mobile, user.otp.code);

    return {
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
    };
  }
  @Post('/check-otp')
  @UseGuards(LocalAuthGuard)
  async checkOtp(
    @Body() body: CheckOtpDto,
    @Request() req,
    @Res({ passthrough: true }) response: Response,
  ) {
    const jwt = await this.jwtService.signAsync({
      id: req.user.id,
      mobile: req.user.mobile,
      role: req.user.role,
    });
    response.cookie('jwt', jwt, { httpOnly: true });
    return {
      token: this.jwtService.sign({
        id: req.user.id,
        mobile: req.user.mobile,
        role: req.user.role,
      }),
    };
  }
  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  profile(@Request() req) {
    return req.user;
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    return {
      message: 'Success',
    };
  }
}
