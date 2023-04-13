import { Module, OnModuleInit } from '@nestjs/common';
import { AppConfigModule } from '../config/app/config.module';
import { AppConfigService } from '../config/app/config.service';
import { BinanceService } from './binance.service';

@Module({
  imports: [AppConfigModule],
  controllers: [],
  providers: [BinanceService, AppConfigService],
  exports: [BinanceService],
})
export class BinanceModule implements OnModuleInit {
  constructor(readonly service: BinanceService) {}

  async onModuleInit(): Promise<void> {
    await this.service.init();
  }
}
