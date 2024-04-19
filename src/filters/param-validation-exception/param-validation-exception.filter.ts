import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Inject,
  ValidationError,
} from '@nestjs/common';
import iterate from 'iterare';
import { I18nContext } from 'nestjs-i18n';
import {
  I18nValidationError,
  I18nValidationExceptionFilterErrorFormatterOption,
  I18nValidationException,
} from 'nestjs-i18n';
import {
  formatI18nErrors,
  mapChildrenToValidationErrors,
} from 'nestjs-i18n/dist/utils';
import { RESPONSE_CODES } from '../../constants/response-codes.constants';
import { ResponseService } from '../../modules/common/response.service';
import { I18nValidationExceptionFilterOptions } from '../../types/validation.type';

@Catch(I18nValidationException)
export class ParamValidationExceptionFilter implements ExceptionFilter {
  constructor(
    private responseSrv: ResponseService,
    @Inject('I18nValidationExceptionFilterOptions')
    private readonly options: I18nValidationExceptionFilterOptions = {
      detailedErrors: false,
    },
  ) {}

  catch(exception: I18nValidationException, host: ArgumentsHost) {
    const i18n = I18nContext.current();
    // console.log(i18n.service);
    const errors = formatI18nErrors(exception.errors ?? [], i18n.service, {
      lang: i18n.lang,
    });
    console.log('errors');
    console.log(errors);

    const normalizedErrors = this.normalizeValidationErrors(errors);
    console.log(normalizedErrors);
    const response = host.switchToHttp().getResponse();

    response
      .status(this.options.errorHttpStatusCode || exception.getStatus())
      .json(
        this.responseSrv.formatResponse(
          {},
          normalizedErrors[0],
          RESPONSE_CODES.ERROR,
        ),
      );
  }

  private isWithErrorFormatter(
    options: I18nValidationExceptionFilterOptions,
  ): options is I18nValidationExceptionFilterErrorFormatterOption {
    return 'errorFormatter' in options;
  }

  protected normalizeValidationErrors(
    validationErrors: ValidationError[],
  ): string[] | I18nValidationError[] | object {
    if (
      this.isWithErrorFormatter(this.options) &&
      !('detailedErrors' in this.options)
    )
      return this.options.errorFormatter(validationErrors);

    if (
      !this.isWithErrorFormatter(this.options) &&
      !this.options.detailedErrors
    )
      return this.flattenValidationErrors(validationErrors);

    return validationErrors;
  }

  protected flattenValidationErrors(
    validationErrors: ValidationError[],
  ): string[] {
    return iterate(validationErrors)
      .map((error) => mapChildrenToValidationErrors(error))
      .flatten()
      .filter((item) => !!item.constraints)
      .map((item) => Object.values(item.constraints))
      .flatten()
      .toArray();
  }
}
