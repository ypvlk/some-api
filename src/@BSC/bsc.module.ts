import { Module, OnModuleInit } from '@nestjs/common';
import { AppConfigModule } from '../config/app/config.module';
import { AppConfigService } from '../config/app/config.service';
import { BSCService } from './bsc.service';

@Module({
  imports: [AppConfigModule],
  controllers: [],
  providers: [BSCService, AppConfigService],
  exports: [BSCService],
})
export class BSCModule implements OnModuleInit {
  constructor(readonly service: BSCService) {}

  async onModuleInit(): Promise<void> {
    await this.service.init();
  }
}
