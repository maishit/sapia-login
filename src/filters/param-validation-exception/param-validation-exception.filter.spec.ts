import { Test, TestingModule } from '@nestjs/testing';
import { ParamValidationExceptionFilter } from './param-validation-exception.filter';
import { ResponseService } from '../../modules/common/response.service';
import { ArgumentsHost } from '@nestjs/common';
import { I18nService, I18nValidationException } from 'nestjs-i18n';
import { RESPONSE_CODES } from '../../constants/response-codes.constants';
// import { formatI18nErrors } from 'nestjs-i18n/dist/utils';

jest.mock('nestjs-i18n', () => ({
  I18nService: class {
    t = jest.fn().mockImplementation(() => 'Translated text');
  },
  I18nContext: {
    current: jest.fn(() => ({ lang: 'en', service: I18nService })),
  },
}));

jest.mock('nestjs-i18n/dist/utils', () => ({
  formatI18nErrors: jest.fn().mockImplementation((errors) => {
    return errors.map(() => {
      return [
        {
          property: 'username',
          constraints: { isNotEmpty: 'Username is required' },
        },
      ];
    });
  }),
}));

describe('ParamValidationExceptionFilter', () => {
  let filter: ParamValidationExceptionFilter;
  let mockResponseService: ResponseService;
  let mockResponse: any;
  // let mockI18nService: I18nService;

  beforeEach(async () => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParamValidationExceptionFilter,
        {
          provide: ResponseService,
          useValue: {
            formatResponse: jest.fn().mockReturnValue({
              error: 'error details',
            }),
          },
        },
        {
          provide: 'I18nValidationExceptionFilterOptions',
          useValue: {
            detailedErrors: false,
            errorHttpStatusCode: 400,
          },
        },
      ],
    }).compile();

    filter = module.get<ParamValidationExceptionFilter>(
      ParamValidationExceptionFilter,
    );

    mockResponseService = module.get<ResponseService>(ResponseService);
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should handle I18nValidationException correctly', () => {
    const errors = [
      {
        property: 'username',
        constraints: { isNotEmpty: 'username should not be empty' },
      },
    ];
    const exception = {
      getStatus: () => 400,
      errors: errors,
    } as unknown as I18nValidationException;
    const host = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
      }),
    } as ArgumentsHost;

    jest
      .spyOn(filter as any, 'normalizeValidationErrors')
      .mockReturnValue(['username should not be empty']);

    filter.catch(exception, host);

    expect(mockResponse.status).toHaveBeenCalledWith(exception.getStatus());
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'error details',
    });
    expect(mockResponseService.formatResponse).toHaveBeenCalledWith(
      {},
      'username should not be empty',
      RESPONSE_CODES.ERROR,
    );
  });
});
