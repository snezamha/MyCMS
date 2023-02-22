import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import axios from 'axios';
import { UserDto } from '../user/dtos/user.dto';

@Injectable()
export class AuthService {
  constructor(public prisma: PrismaService) {}
  async create(data: UserDto) {
    const userExists = await this.prisma.user.findUnique({
      where: {
        mobile: data.mobile,
      },
    });
    const randNumber = Math.floor(1000 + Math.random() * 9000);
    const currentDate = new Date();
    const twoMinutesLater = new Date(currentDate.getTime() + 1 * 60 * 1000);

    if (userExists) {
      function checkValidOtp(otpValidTime: any) {
        const currentDate = new Date();
        const diff = Math.floor(
          (otpValidTime.getTime() - currentDate.getTime()) / 1000,
        );
        if (diff < 0) {
          return true;
        }
      }
      function countSecons(time: any) {
        const currentDate = new Date();
        const diff = Math.floor((time - currentDate.getTime()) / 1000);
        return diff + 's';
      }
      if (checkValidOtp(userExists.otp.expiresIn)) {
        const updateUser = await this.prisma.user.update({
          where: {
            mobile: data.mobile,
          },
          data: {
            ...data,
            otp: {
              code: randNumber,
              expiresIn: twoMinutesLater,
            },
          },
          select: {
            id: true,
            mobile: true,
            otp: true,
            createdAt: true,
          },
        });
        return updateUser;
      } else {
        throw new BadRequestException(
          'The code has just been sent to you!,You can try again after ' +
            countSecons(userExists.otp.expiresIn.getTime()),
        );
      }
    } else {
      const user = await this.prisma.user.create({
        data: {
          ...data,
          otp: {
            code: randNumber,
            expiresIn: twoMinutesLater,
          },
        },
        select: {
          id: true,
          mobile: true,
          otp: true,
          createdAt: true,
        },
      });
      return user;
    }
  }
  async checkOtp(mobile: string, code: number): Promise<any> {
    const userExists = await this.prisma.user.findUnique({
      where: {
        mobile,
      },
    });
    if (userExists && userExists.otp.code == code) {
      const { ...result } = userExists;
      return result;
    }
    throw new UnauthorizedException();
  }
  createToken = async () => {
    const { data } = await axios.post(`https://RestfulSms.com/api/Token`, {
      headers: {
        'Content-Type': 'application/json',
      },
      UserApiKey: process.env.SmsApiKey,
      SecretKey: process.env.SmsSecretKey,
    });
    return data;
  };
  async sendSms(mobile: string, code: number): Promise<any> {
    const creatToken = await this.createToken();
    const headers = {
      'Content-Type': 'application/json',
      'x-sms-ir-secure-token': creatToken.TokenKey,
    };
    const body = {
      Code: code,
      MobileNumber: mobile,
    };
    const { data } = await axios.post(
      `https://RestfulSms.com/api/VerificationCode`,
      body,
      {
        headers: headers,
      },
    );
    if (!data.IsSuccessful) {
      throw new BadRequestException('There is a problem in Send Sms');
    }
  }
}
