import { Module } from '@nestjs/common';
import { ResponseService } from './response.service';
import { UtilsService } from './utils.service';

@Module({
  providers: [ResponseService, UtilsService],
  exports: [ResponseService, UtilsService],
})
export class CommonModule {}
