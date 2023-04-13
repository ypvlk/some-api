import { Module, OnModuleInit } from '@nestjs/common';
import { AppConfigModule } from '../config/app/config.module';
import { AppConfigService } from '../config/app/config.service';
import { EthereumService } from './ethereum.service';

@Module({
  imports: [AppConfigModule],
  controllers: [],
  providers: [EthereumService, AppConfigService],
  exports: [EthereumService],
})
export class EthereumModule implements OnModuleInit {
  constructor(readonly service: EthereumService) {}

  async onModuleInit(): Promise<void> {
    await this.service.init();
  }
}
