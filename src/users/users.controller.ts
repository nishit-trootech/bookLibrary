import { Body, Controller, Get, HttpStatus, Param, Post, Put, Request, Res, UseFilters, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserProfileDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { ExpressAdapter } from '@nestjs/platform-express';
import { HttpAdapterHost } from '@nestjs/core';
import { ResponseDto } from 'src/common/dto/response.dto';
import { CustomUnauthorizedExceptionFilter } from 'src/common/filters/custom-unauthorised-exception.filter';


@Controller('users')
@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@UseFilters(CustomUnauthorizedExceptionFilter)
export class UsersController {
  httpAdapter: ExpressAdapter;
  constructor(
    private readonly userService: UsersService,
    private readonly httpAdapterHost: HttpAdapterHost<ExpressAdapter>,
  ) { 
    this.httpAdapter = this.httpAdapterHost.httpAdapter;
  }

  @Get()
  @ApiOperation({ summary: 'User profile' })
  async fetchUserProfile(@Request() req, @Res({ passthrough: true }) res: Response) {
    const { userId } = req.user;
    
    const userDetail = await this.userService.fetchUserProfile(userId);

    this.httpAdapter.status(res, HttpStatus.OK);

    return new ResponseDto(HttpStatus.OK, 'Profile details fetched successfully', userDetail);
  }

  @Put()
  @ApiOperation({ summary: 'Update user profile' })
  
  @ApiBody({
    description: 'Update user profile',
    schema: {
      example: {
        firstName: 'Test',
        lastName: 'Demo',
        profileImage: 'Image-URL',

      },
    },
  })
  async updateUserProfile(@Request() req, @Body() updateUserProfileDto: UpdateUserProfileDto, @Res({ passthrough: true }) res: Response) {
    const { userId } = req.user;
    await this.userService.updateUserProfile(userId, updateUserProfileDto);

    this.httpAdapter.status(res, HttpStatus.OK);

    return new ResponseDto(HttpStatus.OK, 'Profile Updated successfully', {});
  }

}

