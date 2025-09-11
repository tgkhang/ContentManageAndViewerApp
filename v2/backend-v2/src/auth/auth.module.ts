import { RolesGuard } from './guards/roles.guard';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from '../configs/jwt-secret';
import { PassportModule } from '@nestjs/passport';
import { PassportAuthController } from './passport-auth.controller.';
import { LocalStrategy } from './strategies/local.strategies';

@Module({
  providers: [AuthService, LocalStrategy, RolesGuard],
  controllers: [AuthController, PassportAuthController],
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      signOptions: { expiresIn: '5h' }, // 1d / 60s
    }),
    PassportModule,
  ],
  exports: [RolesGuard],
})
export class AuthModule {}
