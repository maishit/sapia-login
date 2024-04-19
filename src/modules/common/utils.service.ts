import { Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class UtilsService {
  constructor(private readonly i18n: I18nService) {}

  /**
   * Get current timestamp(seconds)
   * @returns
   */
  getCurrentTimestamp(): number {
    return Math.floor(Date.now() / 1000);
  }

  getLangContent(key: string): string {
    return this.i18n.t(key, { lang: I18nContext.current().lang });
  }
}
