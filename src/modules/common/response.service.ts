import { Injectable } from '@nestjs/common';
import { UtilsService } from './utils.service';

@Injectable()
export class ResponseService {
  constructor(private utilsSrv: UtilsService) {}

  /**
   * Format response
   * @param data
   * @param message
   * @param code
   * @returns
   */
  formatResponse(data: any, message: string, code: number) {
    return {
      data: data,
      message: message,
      code: code,
      cur_time: this.utilsSrv.getCurrentTimestamp(),
    };
  }
}
