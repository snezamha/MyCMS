import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { CommonModule } from '../common/common.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [PrismaModule, CommonModule],
})
export class UserModule {}
