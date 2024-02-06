import { HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto, FetchUserProfileDto, UpdateUserProfileDto } from './dto/create-user.dto';
import { User } from 'src/models/user.model';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  async fetchUserProfile(userId: string): Promise<User> {
    try {
      return User.findByPk(userId);
    } catch (error) {
      this.logger.error({ error });
      throw new HttpException(
        'Failed to fetch profile details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUserProfile(userId: string, updateUserProfileDto: UpdateUserProfileDto): Promise<any> {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      const response = await User.update(
        updateUserProfileDto,
        { where: { id: userId } }
      );

      return response;
    } catch (error) {
      this.logger.error({ error });
      throw new HttpException(
        'Failed to update profile details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

