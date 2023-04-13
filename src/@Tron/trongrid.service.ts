import { Injectable, Logger } from '@nestjs/common';
import TronWeb from 'tronweb';
import TronGrid from 'trongrid';
import { AppConfigService } from '../config/app/config.service';
const { HttpProvider } = TronWeb.providers;

@Injectable()
export class TrongridService {
  private readonly logger = new Logger(TrongridService.name);
  private _tronGridClient: any;
  private _tronWebClients: any;
  private tronwebHostIndex = 3;

  constructor(private readonly appConfigService: AppConfigService) {}

  get tronGridClient() {
    return this._tronGridClient;
  }

  get tronWebClients() {
    return this._tronWebClients;
  }

  public async init(): Promise<void> {
    try {
      this.createTronwebHttpClient();
      this.createTrongridHttpClient();
    } catch (e) {
      console.error(e);
      this.logger.error('Tron network init error');
    }
  }

  private createTronwebHttpClient(): void {
    const fullHostURL = new HttpProvider('https://api.trongrid.io');
    const apiKey = this.appConfigService.trongridProviderAPIKey;

    this._tronWebClients = new TronWeb({
      fullHost: fullHostURL,
      solidityNode: fullHostURL,
      eventServer: fullHostURL,
      headers: {
        'TRON-PRO-API-KEY': apiKey,
      },
    });

    this.logger.log(`Connected to Tronweb by Http to ${fullHostURL}`);
  }

  // private createTronwebHttpClient(): void {
  //   const fullHostIps: string[] = this.appConfigService.tronwebFullHosts;

  //   for (const fullHostIp of fullHostIps) {
  //     const fullHostUrlBuf = `http://${fullHostIp}:8090/`;

  //     const httpProvider = new HttpProvider(fullHostUrlBuf);

  //     this._tronWebClients.push(
  //       new TronWeb({
  //         fullHost: httpProvider,
  //       }),
  //     );

  //     this.logger.log(`Connected to Tronweb by Http to ${fullHostUrlBuf}`);
  //   }

  //   // console.log('this._tronWebClients[this.tronwebHostIndex]', this._tronWebClients[this.tronwebHostIndex]);
  // }

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
      const toketContract = 'TXWkP3jLBqRGojUih1ShzNyDaN5Csnebok';
      const Contract = await this._tronWebClients.contract().at(toketContract);

      const balance = await Contract.balanceOf(address).call({
        owner_address: address,
      });
      console.log('balance\n', balance);

      return balance;
    } catch (e) {
      throw e;
    }
  }
}
