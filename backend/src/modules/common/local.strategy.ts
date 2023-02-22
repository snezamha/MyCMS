import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'mobile',
      passwordField: 'code',
    });
  }

  async validate(mobile: string, code: number) {
    const user = await this.authService.checkOtp(mobile, code);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
