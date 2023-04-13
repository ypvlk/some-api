import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/app/config.module';
import { EthereumModule } from './@Ethereum/ethereum.module';
import { TronmModule } from './@Tron/tron.module';
import { BSCModule } from './@BSC/bsc.module';
import { BinanceModule } from './@Binance/binance.module';

@Module({
  imports: [
    AppConfigModule,
    ConfigModule.forRoot(),
    EthereumModule,
    TronmModule,
    BSCModule,
    BinanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
