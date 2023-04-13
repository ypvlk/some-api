import { Injectable, Logger } from '@nestjs/common';
import Web3 from 'web3';
import { AppConfigService } from '../config/app/config.service';
import { ERC20_ABI } from './abi/abis';

@Injectable()
export class EthereumService {
  private readonly logger = new Logger(EthereumService.name);
  private _web3HttpClient: any;
  private _web3WsClient: any;

  constructor(private readonly appConfigService: AppConfigService) {}

  get web3HttpClient() {
    return this._web3HttpClient;
  }

  get web3WsClient() {
    return this._web3WsClient;
  }

  public async init(): Promise<void> {
    try {
      this.createWeb3HttpClient();
      this.createWeb3WsClient();
    } catch (e) {
      console.error(e);
      this.logger.error('Ethereum network init error');
    }
  }

  private createWeb3HttpClient(): void {
    const providerURL = this.appConfigService.ethereumProviderURL;

    if (!providerURL) {
      throw new Error('Ethereum HTTP Provider is missed.');
    }

    this._web3HttpClient = new Web3();
    const provider = new Web3.providers.HttpProvider(providerURL);
    this._web3HttpClient.setProvider(provider);
    this._web3HttpClient.eth.handleRevert = true;
    this.logger.log(`Connected to Ethereum by Http to ${providerURL}`);
  }

  private createWeb3WsClient(): void {
    const providerURL = this.appConfigService.ethereumWSProviderURL;

    if (!providerURL) {
      throw new Error('Ethereum Websocket Provider is missed.');
    }

    const wsConfigProvider = {
      clientConfig: {
        keepalive: true,
        keepaliveInterval: 60000,
      },
      reconnect: {
        auto: true,
        delay: 1000,
        maxAttempts: 10,
      },
    };

    this._web3WsClient = new Web3();
    const provider = new Web3.providers.WebsocketProvider(
      providerURL,
      wsConfigProvider,
    );
    this._web3WsClient.setProvider(provider);
    // this._web3WsClient.web3.eth.handleRevert = true;
    this.listener(
      provider,
      `Connected to ethereum by WebSocket to ${providerURL}`,
    );
  }

  private listener(provider, msg: string) {
    provider.on('connect', () => this.logger.log(msg));
    provider.on('error', (e) => this.handleError(e, provider));
    provider.on('end', (e) => this.handleDisconnects(e, provider));
  }

  private handleError(e, provider) {
    this.logger.error(`Provider - ${provider} had error.`);
    throw new Error(e);
  }

  private handleDisconnects(e, provider) {
    this.logger.error(`Provider - ${provider} had dosconnected.`);
    throw new Error(e);
  }

  public async getBalanceETH(address: string): Promise<any> {
    const balance = await this._web3HttpClient.eth.getBalance(address);
    return this._web3HttpClient.utils.fromWei(balance, 'ether');
  }

  public async getBalanceWETH(address: string): Promise<any> {
    try {
      const toketContract = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
      const Contract = new this._web3HttpClient.eth.Contract(
        JSON.parse(ERC20_ABI),
        toketContract,
      );
      const result = await Contract.methods.balanceOf(address).call();
      return this._web3HttpClient.utils.fromWei(result, 'ether');
    } catch (e) {
      throw e;
    }
  }

  public async getBalanceWBNB(address: string): Promise<any> {
    try {
      const toketContract = '0x418D75f65a02b3D53B2418FB8E1fe493759c7605';
      const Contract = new this._web3HttpClient.eth.Contract(
        JSON.parse(ERC20_ABI),
        toketContract,
      );
      const result = await Contract.methods.balanceOf(address).call();
      return this._web3HttpClient.utils.fromWei(result, 'ether');
    } catch (e) {
      throw e;
    }
  }
}
