import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt';
import { User } from 'src/models/user.model';
import { CreateUserDto, LoginDto } from 'src/users/dto/users.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(private readonly jwtService: JwtService) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      return User.create(createUserDto);
    } catch (error) {
      this.logger.error({ error });
      throw new HttpException(
        'Failed to create new User. Please try after sometime ...',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async validateUser(loginDto: LoginDto) {
    const { usernameOrEmail, password } = loginDto;

    const isEmail = usernameOrEmail.includes('@');
    const whereConditions = [];

    if (isEmail) {
      whereConditions.push({
        email: usernameOrEmail,
      });
    } else {
      whereConditions.push({
        username: usernameOrEmail,
      });
    }

    const findUser = await User.findOne({
      where: { [Op.or]: whereConditions },
    });

    if (!findUser) {
      throw new NotFoundException('User not found');
    }

    const userObj = JSON.parse(JSON.stringify(findUser));

    const isPasswordValid = await bcrypt.compare(password, userObj.password);

    if (!isPasswordValid) {
      throw new NotFoundException('Invalid password');
    }

    const token = await this.generateToken(userObj);

    return token;
  }

  async generateToken(user: any) {
    const payload = {
      username: user.username,
      email: user.email,
      sub: user.id,
    };
    try {
      return this.jwtService.sign(payload);
    } catch (error) {
      this.logger.error({ error });
      throw new HttpException(
        'Something went wrong. Please try after sometime ...',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
