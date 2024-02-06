import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './auth.strategy';

@Module({
  imports: [PassportModule,
    JwtModule.register({
      secret: 'my-secret-key', // Use environment variable or fallback to a default value
      signOptions: { expiresIn: '1h' }, // Optional: Set token expiration
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtModule, JwtStrategy],
})
export class AuthModule {}

