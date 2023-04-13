import { Module, OnModuleInit } from '@nestjs/common';
import { AppConfigModule } from '../config/app/config.module';
import { AppConfigService } from '../config/app/config.service';
import { TrongridService } from './trongrid.service';

@Module({
  imports: [AppConfigModule],
  controllers: [],
  providers: [TrongridService, AppConfigService],
  exports: [TrongridService],
})
export class TronmModule implements OnModuleInit {
  constructor(readonly service: TrongridService) {}

  async onModuleInit(): Promise<void> {
    await this.service.init();
  }
}
