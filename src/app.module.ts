import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { sequelizeOptions } from './database/database.config';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './auth/auth.guard';
import dotenv from 'dotenv';
dotenv.config();
@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY, // Use environment variable or fallback to a default value
      signOptions: { expiresIn: '24h' }, // Optional: Set token expiration
    }),
    SequelizeModule.forRoot(sequelizeOptions),
    UsersModule,
    AuthModule,
    BooksModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtAuthGuard],
  exports: [JwtAuthGuard, JwtAuthGuard],
})
export class AppModule {}
