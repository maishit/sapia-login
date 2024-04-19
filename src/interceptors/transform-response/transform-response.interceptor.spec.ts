import { Test, TestingModule } from '@nestjs/testing';
import { TransformResponseInterceptor } from './transform-response.interceptor';
import { ResponseService } from '../../modules/common/response.service';
import { UtilsService } from '../../modules/common/utils.service';
import { of } from 'rxjs';
import { ExecutionContext, CallHandler } from '@nestjs/common';

describe('TransformResponseInterceptor', () => {
  let interceptor: TransformResponseInterceptor;
  let mockResponseService: ResponseService;
  let mockUtilsService: UtilsService;
  let mockCallHandler: CallHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransformResponseInterceptor,
        {
          provide: ResponseService,
          useValue: {
            formatResponse: jest.fn((data, message, code) => ({
              data: data,
              message: message,
              code: code,
              cur_time: mockUtilsService.getCurrentTimestamp(),
            })),
          },
        },
        {
          provide: UtilsService,
          useValue: {
            getCurrentTimestamp: jest.fn().mockReturnValue(1713403944), // Mocked timestamp
          },
        },
      ],
    }).compile();

    interceptor = module.get<TransformResponseInterceptor>(
      TransformResponseInterceptor,
    );
    mockResponseService = module.get<ResponseService>(ResponseService);
    mockUtilsService = module.get<UtilsService>(UtilsService);
    mockCallHandler = {
      handle: jest.fn().mockReturnValue(of('someData')),
    };
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should transform response correctly', (done) => {
    interceptor
      .intercept({} as ExecutionContext, mockCallHandler)
      .subscribe((result) => {
        expect(mockCallHandler.handle).toHaveBeenCalled();
        expect(mockResponseService.formatResponse).toHaveBeenCalledWith(
          'someData',
          'success',
          1000,
        );
        expect(result).toEqual({
          data: 'someData',
          message: 'success',
          code: 1000,
          cur_time: 1713403944,
        });
        done();
      });
  });
});
