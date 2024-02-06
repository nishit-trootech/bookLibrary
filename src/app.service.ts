import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, LoginDto } from './users/dto/create-user.dto';
import { User } from './models/user.model';
import { JwtService } from '@nestjs/jwt';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt';

@Injectable()
export class AppService {

  constructor(private readonly jwtService: JwtService) {}

  getHello(): string {
    return 'Hello World!';
  }
}
