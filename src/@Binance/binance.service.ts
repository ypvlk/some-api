import { Injectable, Logger } from '@nestjs/common';
import BinanceAPI from 'binance-api-node';
import { AppConfigService } from '../config/app/config.service';

export type Network = 'BSC' | 'ETH' | 'TRX';

@Injectable()
export class BinanceService {
  private readonly logger = new Logger(BinanceService.name);
  private _httpClient: any;
  private _wsClient: any;

  constructor(private readonly appConfigService: AppConfigService) {}

  get httpClient() {
    return this._httpClient;
  }

  public async init(): Promise<void> {
    try {
      this.createHttpClient();
    } catch (e) {
      console.error(e);
      this.logger.error('Binance API init error');
    }
  }

  private createHttpClient(): void {
    const apiKey = this.appConfigService.binanceAPIKey;
    const apiSecret = this.appConfigService.binanceAPISecret;

    if (!apiKey || !apiSecret) {
      throw new Error('Binance API credentials is missed.');
    }

    this._httpClient = BinanceAPI({
      apiKey,
      apiSecret,
    });

    this.logger.log(`Connected to Binance API by HTTP`);
  }

  public async getDepositAddress(coin: string, network: Network): Promise<any> {
    try {
      const { address } = await this._httpClient.depositAddress({
        coin,
        network,
      });

      if (!address) {
        throw new Error('Binance deposit address is missed.');
      }

      return address;
    } catch (e) {
      throw e;
    }
  }

  public async withdraw(
    coin: string,
    amount: string,
    address: string,
    network: Network,
  ): Promise<any> {
    try {
      if (coin !== 'ETH' && coin !== 'BNB' && coin !== 'USDT') {
        throw new Error(`Coin ${coin} is not supported.`);
      }

      await this._httpClient.withdraw({
        coin,
        address,
        amount: parseFloat(amount),
        network,
      });
    } catch (e) {
      throw e;
    }
  }

  public async getCoinBalance(coin: string, network: Network): Promise<any> {
    try {
      const accountInfo = await this._httpClient.accountInfo();

      const balance = accountInfo.balances.find(
        (item) => item.asset === coin, //&& item.network === network
      );

      if (!balance) {
        throw new Error(`No balance found for ${coin} on ${network} network`);
      }

      return balance.free;
    } catch (e) {
      throw e;
    }
  }

  public async getAssetDetail(coin: string) {
    try {
      const assetDetail = await this._httpClient.assetDetail({ coin });
      return { ...assetDetail[coin] };
    } catch (e) {
      throw e;
    }
  }
}
