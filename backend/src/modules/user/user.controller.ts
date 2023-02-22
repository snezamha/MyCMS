import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { Roles } from '../common/decorators/role.decorator';
import { UserDto } from './dtos/user.dto';
import { RoleGuard } from '../common/role.guard';
import { UserService } from './user.service';

@Controller({ path: 'users', version: '1' })
export class UserController {
  constructor(public userService: UserService) {}
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @Get()
  async getUsers(@Query('page') page = 1) {
    const users = await this.userService.pagination(page);
    return users;
  }
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @Get('/:id')
  async getUser(@Param('id') id: string) {
    try {
      const user = await this.userService.findUnique(id);
      if (!user) {
        throw new NotFoundException('User not found!');
      }
      return { data: user };
    } catch (error) {
      throw new HttpException(
        { message: 'Failed to create user', error },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Post()
  async createUser(@Body() body: UserDto) {
    try {
      const user = await this.userService.create(body);
      return { message: 'User created successfully', data: user };
    } catch (error) {
      throw new HttpException(
        { message: 'Failed to create user', error },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @Put('/:id')
  async updateUser(@Body() body: UserDto, @Param('id') id: string) {
    try {
      const user = await this.userService.update(body, id);
      return { message: 'User updated successfully', data: user };
    } catch (error) {
      throw new HttpException(
        { message: 'Failed to update user', error },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    try {
      await this.userService.delete(id);
      return { message: 'User deleted successfully' };
    } catch (error) {
      throw new HttpException(
        { message: 'Failed to update user', error },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
