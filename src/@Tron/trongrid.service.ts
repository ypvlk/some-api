import { Injectable, Logger } from '@nestjs/common';
import TronWeb from 'tronweb';
import TronGrid from 'trongrid';
import { AppConfigService } from '../config/app/config.service';
const { HttpProvider } = TronWeb.providers;

@Injectable()
export class TrongridService {
  private readonly logger = new Logger(TrongridService.name);
  private _tronGridClient: any;
  private _tronWebClients: Array<any> = [];
  private tronwebHostIndex = 1;

  constructor(private readonly appConfigService: AppConfigService) {}

  get tronGridClient() {
    return this._tronGridClient;
  }

  get tronWebClients() {
    return this._tronWebClients;
  }

  public async init(): Promise<void> {
    try {
      // this.createTronwebHttpClient();
      this.createTrongridHttpClient();
    } catch (e) {
      console.error(e);
      this.logger.error('Trongrid network init error');
    }
  }

  private createTronwebHttpClient(): void {
    const fullHostIps: string[] = this.appConfigService.tronwebFullHosts;

    for (const fullHostIp of fullHostIps) {
      const fullHostUrlBuf = `http://${fullHostIp}:8090/`;

      const httpProvider = new HttpProvider(fullHostUrlBuf);

      this._tronWebClients.push(
        new TronWeb({
          fullHost: httpProvider,
        }),
      );

      this.logger.log(`Connected to Tronweb by Http to ${fullHostUrlBuf}`);
    }

    // console.log('this._tronWebClients[this.tronwebHostIndex]', this._tronWebClients[this.tronwebHostIndex]);
  }

  private createTrongridHttpClient(): void {
    const providerURL = this.appConfigService.trongridProviderURL;
    const apiKey = this.appConfigService.trongridProviderAPIKey;

    if (!providerURL) {
      throw new Error('Trongrid HTTP Provider URL is missed.');
    }

    if (!apiKey) {
      throw new Error('Trongrid API KEY is missed.');
    }

    const tronGridHttpProvider = new HttpProvider(providerURL);
    const tronGridWeb = new TronWeb({
      fullHost: tronGridHttpProvider,
      headers: {
        'TRON-PRO-API-KEY': apiKey,
      },
    });

    this._tronGridClient = new TronGrid(tronGridWeb);
    this.logger.log(`Connected to Trongrid by Http to ${providerURL}`);
  }

  public async getBalanceWETH(address: string): Promise<any> {
    try {
      const wETHContractAddress = 'TQQg4EL8o1BSeKJY4MJ8TB8XK7xufxFBvK';
      // const contract = await this._tronWebClients[this.tronwebHostIndex].contract().at(wETHContractAddress);
      // const result = await contract.balanceOf(address).call();

      const userBalance = await this._tronWebClients[
        this.tronwebHostIndex
      ].trx.getBalance(address);
      console.log(`User's balance is:`);
      // return result;
    } catch (e) {
      throw e;
    }
  }
}
