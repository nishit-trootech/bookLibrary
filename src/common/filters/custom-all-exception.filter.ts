import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';

interface ErrorResponse {
  statusCode: number;
  message: string;
  data: string | string[];
}

@Catch(HttpException)
export class CustomAllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CustomAllExceptionFilter.name);
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    const validationErrors: ValidationError[] =
      (exception.getResponse() as ValidationError[]) || [];
    const errorMessages: any = Array.isArray(validationErrors)
      ? this.flattenValidationErrors(validationErrors)
      : [validationErrors];

    const errorResponse: ErrorResponse = this.getErrorResponseObject(
      errorMessages,
      status,
    );

    this.logger.error({ errorResponse });

    response.status(status).json(errorResponse);
  }

  public flattenValidationErrors(errors: ValidationError[]): string[] {
    return errors
      .map((error) => {
        if (error.children.length > 0) {
          return this.flattenValidationErrors(error.children);
        }
        return Object.values(error.constraints);
      })
      .flat();
  }

  public getErrorResponseObject(
    errorMessages: any,
    status: number,
  ): ErrorResponse {
    let message = errorMessages[0];
    let data = [];

    if (typeof errorMessages[0] === 'object') {
      message = errorMessages[0].message;
      data = errorMessages[0].data || [];
    }

    if (
      [
        HttpStatus.BAD_REQUEST,
        HttpStatus.UNAUTHORIZED,
        HttpStatus.NOT_FOUND,
        HttpStatus.FAILED_DEPENDENCY,
        HttpStatus.FORBIDDEN,
      ].includes(status)
    ) {
      return {
        statusCode: status,
        message: message,
        data: data,
      };
    }

    return {
      statusCode: status || HttpStatus.INTERNAL_SERVER_ERROR,
      message: message || 'Internal Server Error',
      data: data,
    };
  }
}
