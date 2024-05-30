import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
  } from '@nestjs/common';
  import { AxiosError } from 'axios';
  import { Response } from 'express';
  
  @Catch(AxiosError)
  export class AxiosExceptionFilter implements ExceptionFilter {
    catch(exception: AxiosError, host: ArgumentsHost) {
      const context = host.switchToHttp();
      const response = context.getResponse<Response>();
      const status = exception.response
        ? exception.response.status
        : HttpStatus.INTERNAL_SERVER_ERROR;
  
      let payload = {
        message: exception.message,
        code: exception.code,
        type_error: 'AxiosError',
      };
  
      if (exception.response && typeof exception.response.data === 'object') {
        payload = {
          ...payload,
          ...exception.response.data,
        };
      }
  
      response.status(status).json(payload);
    }
  }