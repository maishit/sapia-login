import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ResponseService } from '../../modules/common/response.service';
import { RESPONSE_CODES } from '../../constants/response-codes.constants';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  constructor(private responseSrv: ResponseService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return this.responseSrv.formatResponse(
          data,
          'success',
          RESPONSE_CODES.SUCCESS,
        );
      }),
    );
  }
}
