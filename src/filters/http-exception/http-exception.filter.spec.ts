import { Test, TestingModule } from '@nestjs/testing';
import { HttpExceptionFilter } from './http-exception.filter';
import { ResponseService } from '../../modules/common/response.service';
import { HttpException, ArgumentsHost } from '@nestjs/common';
import { RESPONSE_CODES } from '../../constants/response-codes.constants';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockResponseService: ResponseService;
  let mockResponse: Response;

  beforeEach(async () => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HttpExceptionFilter,
        {
          provide: ResponseService,
          useValue: {
            formatResponse: jest.fn().mockReturnValue({
              error: 'error details',
            }),
          },
        },
      ],
    }).compile();

    filter = module.get<HttpExceptionFilter>(HttpExceptionFilter);
    mockResponseService = module.get<ResponseService>(ResponseService);
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should handle HttpException correctly', () => {
    const exception = new HttpException('Forbidden', 403);
    const host = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
      }),
    } as ArgumentsHost;

    filter.catch(exception, host);

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'error details',
    });
    expect(mockResponseService.formatResponse).toHaveBeenCalledWith(
      {},
      'Forbidden',
      RESPONSE_CODES.ERROR,
    );
  });
});
