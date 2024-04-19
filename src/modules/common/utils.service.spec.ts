import { Test, TestingModule } from '@nestjs/testing';
import { UtilsService } from './utils.service';
import { I18nService } from 'nestjs-i18n';

jest.mock('nestjs-i18n', () => ({
  I18nService: class {
    t = jest.fn().mockImplementation(() => 'Translated text');
  },
  I18nContext: {
    current: jest.fn(() => ({ lang: 'en' })),
  },
}));

describe('UtilsService', () => {
  let service: UtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UtilsService, I18nService],
    }).compile();

    service = module.get<UtilsService>(UtilsService);
  });

  describe('getCurrentTimestamp', () => {
    it('should return the current timestamp in seconds', () => {
      jest.spyOn(Date, 'now').mockImplementation(() => 1713401308000);
      const timestamp = service.getCurrentTimestamp();
      expect(timestamp).toBe(1713401308);
    });
  });

  describe('getLangContent', () => {
    it('should return the translated content for a given key', () => {
      const key = 'hello';
      const result = service.getLangContent(key);
      expect(result).toEqual('Translated text');
    });
  });
});
