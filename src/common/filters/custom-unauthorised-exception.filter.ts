import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnauthorizedException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

interface ErrorResponse {
  message: string;
  statusCode: number;
  data: any;
}

@Catch(UnauthorizedException)
export class CustomUnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errorResponse: ErrorResponse = {
      message: 'Unauthorized Access',
      statusCode: HttpStatus.UNAUTHORIZED,
      data: [],
    };

    response.status(HttpStatus.UNAUTHORIZED).json(errorResponse);
  }
}
  