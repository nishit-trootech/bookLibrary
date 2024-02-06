import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

interface ErrorResponse {
  message: string;
  statusCode: number;
  data: any;
}

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(BadRequestExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const errors = exception.getResponse();

    const errorResponse: ErrorResponse = {
      message: 'Validation Error',
      statusCode: HttpStatus.BAD_REQUEST,
      data: errors.message,
    };

    this.logger.error({ errorResponse });

    response.status(HttpStatus.BAD_REQUEST).json(errorResponse);
  }
}
