import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseService } from '../../modules/common/response.service';
import { RESPONSE_CODES } from '../../constants/response-codes.constants';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private responseSrv: ResponseService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // console.log('exception', exception);
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse();
    // console.log(exception);

    // Check exceptionResponse is a string or an object
    let message: string = '';
    if (typeof exceptionResponse === 'object') {
      message = exceptionResponse['message'];
      // Check message is an array or string
      if (Array.isArray(message)) {
        message = message[0];
      }
    } else {
      console.log('exceptionResponse', exceptionResponse);
      message = exceptionResponse;
    }

    response
      .status(status)
      .json(
        this.responseSrv.formatResponse(
          {},
          message.toString(),
          RESPONSE_CODES.ERROR,
        ),
      );
  }
}
