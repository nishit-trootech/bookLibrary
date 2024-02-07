import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseFilters,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, LoginDto } from 'src/users/dto/users.dto';
import { AuthService } from './auth.service';
import { ExpressAdapter } from '@nestjs/platform-express';
import { HttpAdapterHost } from '@nestjs/core';
import { ResponseDto } from 'src/common/dto/response.dto';
import { CustomUnauthorizedExceptionFilter } from 'src/common/filters/custom-unauthorised-exception.filter';

@Controller('auth')
@ApiTags('Auth')
@UseFilters(CustomUnauthorizedExceptionFilter)
export class AuthController {
  httpAdapter: ExpressAdapter;
  constructor(
    private readonly authService: AuthService,
    private readonly httpAdapterHost: HttpAdapterHost<ExpressAdapter>,
  ) {
    this.httpAdapter = this.httpAdapterHost.httpAdapter;
  }

  @Post('signup')
  @ApiOperation({ summary: 'User signup' })
  @ApiBody({
    description: 'User signup',
    schema: {
      example: {
        username: 'test',
        email: 'test@domain.com',
        password: 'Test@123',
      },
    },
  })
  async signUp(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.createUser(createUserDto);

    this.httpAdapter.status(res, HttpStatus.OK);

    return new ResponseDto(HttpStatus.OK, 'User registered successfully', user);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({
    description: 'User login',
    schema: {
      example: {
        usernameOrEmail: 'test@domain.com',
        password: 'Test@123',
      },
    },
  })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.validateUser(loginDto);

    this.httpAdapter.status(res, HttpStatus.OK);

    return new ResponseDto(HttpStatus.OK, 'Logged In successfully', { token });
  }
}
