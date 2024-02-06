import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

interface ErrorResponse {
  message: string;
  statusCode: number;
  data: any;
}

@Catch(NotFoundException)
export class CustomNotFoundExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CustomNotFoundExceptionFilter.name);

  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errorResponse: ErrorResponse = {
      message: `Route doesn't exist`,
      statusCode: HttpStatus.NOT_FOUND,
      data: [],
    };

    this.logger.error({ errorResponse });

    response.status(HttpStatus.NOT_FOUND).json(errorResponse);
  }
}
