import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { CommonModule } from '../common/common.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
  imports: [PrismaModule, CommonModule],
})
export class AuthModule {}
