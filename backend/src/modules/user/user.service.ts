import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserDto } from './dtos/user.dto';

@Injectable()
export class UserService {
  constructor(public prisma: PrismaService) {}
  async create(data: UserDto) {
    const userExists = await this.prisma.user.findUnique({
      where: {
        mobile: data.mobile,
      },
    });
    if (userExists) {
      throw new BadRequestException('The user exists!');
    } else {
      const user = await this.prisma.user.create({
        data: {
          ...data,
          otp: {
            code: 0,
            expiresIn: new Date(),
          },
        },
      });
      return user;
    }
  }
  async findMany() {
    const users = await this.prisma.user.findMany();
    return users;
  }
  async findUnique(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  }
  async update(data: UserDto, id: string) {
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });
    return user;
  }
  async delete(id: string) {
    const user = await this.prisma.user.delete({
      where: {
        id,
      },
    });
    return user;
  }
  async pagination(page = 1): Promise<any> {
    const take = 10;
    const users = await this.prisma.user.findMany({
      take,
      skip: (page - 1) * take,
    });
    const total = await this.prisma.user.count();
    return {
      data: users,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take),
      },
    };
  }
}
