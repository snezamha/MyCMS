import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { AllExceptionsFilter } from './exception.filter';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './modules/common/common.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, AuthModule, CommonModule],
  providers: [
    {
      provide: 'EXCEPTION_FILTER',
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
