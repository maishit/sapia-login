import { Test, TestingModule } from '@nestjs/testing';
import { UtilsService } from './utils.service';
import { ResponseService } from './response.service';

describe('ResponseService', () => {
  let service: ResponseService;
  let mockUtilsService: UtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResponseService,
        {
          provide: UtilsService,
          useValue: {
            getCurrentTimestamp: jest.fn(() => 1713401308),
          },
        },
      ],
    }).compile();

    service = module.get<ResponseService>(ResponseService);
    mockUtilsService = module.get<UtilsService>(UtilsService);
  });

  it('should return formatted response with data, message, code, and current timestamp', () => {
    const result = service.formatResponse({ key: 'value' }, 'success', 1000);
    expect(result).toEqual({
      data: { key: 'value' },
      message: 'success',
      code: 1000,
      cur_time: 1713401308,
    });
  });

  it('should call getCurrentTimestamp from UtilsService', () => {
    service.formatResponse({ key: 'value' }, 'success', 1000);
    expect(mockUtilsService.getCurrentTimestamp).toHaveBeenCalled();
  });
});
