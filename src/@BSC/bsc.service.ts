import { Injectable, Logger } from '@nestjs/common';
import Web3 from 'web3';
import { AppConfigService } from '../config/app/config.service';
import { BEP20_ABI } from './abi/abis';

export type TransferCoin = 'USDT' | 'ID';

@Injectable()
export class BSCService {
  private readonly logger = new Logger(BSCService.name);
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
      //   this.createWeb3WsClient();
    } catch (e) {
      console.error(e);
      this.logger.error('BSC network init error');
    }
  }

  private createWeb3HttpClient(): void {
    const providerURL = this.appConfigService.bscProviderURL;

    if (!providerURL) {
      throw new Error('BSC HTTP Provider URL is missed.');
    }

    this._web3HttpClient = new Web3();
    const provider = new Web3.providers.HttpProvider(providerURL);
    this._web3HttpClient.setProvider(provider);
    // this._web3HttpClient.eth.handleRevert = true;
    this.logger.log(`Connected to BSC by Http to ${providerURL}`);
  }

  private createWeb3WsClient(): void {
    const providerURL = this.appConfigService.bscWSProviderURL;

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

  public async getBalanceWETH(address: string): Promise<any> {
    try {
      const toketContract = '0x4DB5a66E937A9F4473fA95b1cAF1d1E1D62E29EA';
      const Contract = new this._web3HttpClient.eth.Contract(
        JSON.parse(BEP20_ABI),
        toketContract,
      );
      const result = await Contract.methods.balanceOf(address).call();
      return this._web3HttpClient.utils.fromWei(result, 'ether');
    } catch (e) {
      throw e;
    }
  }

  public async getBalanceBNB(address: string): Promise<any> {
    const balance = await this._web3HttpClient.eth.getBalance(address);
    return this._web3HttpClient.utils.fromWei(balance, 'ether');
  }

  public async getBalanceWBNB(address: string): Promise<any> {
    try {
      const toketContract = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';
      const Contract = new this._web3HttpClient.eth.Contract(
        JSON.parse(BEP20_ABI),
        toketContract,
      );
      const result = await Contract.methods.balanceOf(address).call();
      return this._web3HttpClient.utils.fromWei(result, 'ether');
    } catch (e) {
      throw e;
    }
  }

  public async transfer(
    privateKeyFrom: string,
    addressTo: string,
    coin: TransferCoin,
    amount: string,
  ): Promise<any> {
    try {
      const signer =
        this._web3HttpClient.eth.accounts.privateKeyToAccount(privateKeyFrom);
      const addressFrom = signer?.address;

      if (!addressFrom) {
        throw new Error('Wallet addressFrom is missed.');
      }

      console.log('addressFrom: ', addressFrom);

      switch (coin) {
        case 'USDT':
          const tokenContract = '0x55d398326f99059ff775485246999027b3197955'; // BUSD-T
          const Contract = new this._web3HttpClient.eth.Contract(
            JSON.parse(BEP20_ABI),
            tokenContract,
          );

          const balanceFrom = await Contract.methods
            .balanceOf(addressFrom)
            .call();
          if (
            this._web3HttpClient.utils.fromWei(balanceFrom, 'ether') < amount
          ) {
            throw new Error('Insufficient USDT balance');
          }

          // console.log('Transfer amount in USDT: ', amount);
          // const convertedAmount = parseFloat(amount) * 10 ** 18;
          console.log('Transfer amount in wei: ', amount);

          const txParams = {
            from: addressFrom,
            to: tokenContract,
            data: Contract.methods
              .transfer(addressTo, this._web3HttpClient.utils.toHex(amount))
              .encodeABI(),
            gasPrice: this._web3HttpClient.utils.toHex('50000000000'),
            gasLimit: this._web3HttpClient.utils.toHex('60000'),
          };

          this._web3HttpClient.eth.accounts
            .signTransaction(txParams, privateKeyFrom)
            .then((signedTx) => {
              this._web3HttpClient.eth
                .sendSignedTransaction(signedTx.rawTransaction)
                .on('receipt', (receipt) => {
                  console.log('Transaction receipt:\n', receipt);
                })
                .on('error', (error) => {
                  console.error('Transaction error:\n', error);
                });
            })
            .catch((err) => {
              console.error('Signing transaction error:\n', err);
            });

          break;
        default:
          throw new Error('Coin is not supported.\n');
      }
    } catch (e) {
      throw e;
    }
  }

  public async getContractEvents(
    contractAddress: string,
    count: number,
  ): Promise<any> {
    try {
      const Contract = new this._web3HttpClient.eth.Contract(
        JSON.parse(BEP20_ABI),
        contractAddress,
      );
      let latestBlockNumber = await this._web3HttpClient.eth.getBlockNumber();
      const events = [];

      while (events.length < count) {
        const options = {
          fromBlock: latestBlockNumber,
          toBlock: latestBlockNumber,
        };

        const ev = await Contract.getPastEvents('allEvents', options);

        ev.forEach((item) => {
          if (events.length < count) {
            events.push(item);
          }
        });

        --latestBlockNumber;
      }

      return events;
    } catch (e) {
      throw e;
    }
  }

  public async getTransactionsInfo(
    contractAddress: string,
    count: number,
  ): Promise<any> {
    try {
      const usdtAddress = '0x55d398326f99059fF775485246999027B3197955'; // BUSD-T
      const usdcAddress = '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d';
      const Contract = new this._web3HttpClient.eth.Contract(
        JSON.parse(BEP20_ABI),
        contractAddress,
      );
      const usdtContract = new this._web3HttpClient.eth.Contract(
        JSON.parse(BEP20_ABI),
        usdtAddress,
      );
      const usdcContract = new this._web3HttpClient.eth.Contract(
        JSON.parse(BEP20_ABI),
        usdcAddress,
      );

      const transactions = await this.getContractEvents(contractAddress, count);

      const result = [];

      for (const trx of transactions) {
        const sender = trx.returnValues.from || trx.returnValues.spender;
        const transactionHash = trx.transactionHash;
        const event = trx.event;
        const senderBalance = await Contract.methods.balanceOf(sender).call();

        const senderBalanceUSDT = await usdtContract.methods
          .balanceOf(sender)
          .call();
        const senderBalanceUSDC = await usdcContract.methods
          .balanceOf(sender)
          .call();

        result.push({
          transactionHash,
          event,
          sender,
          senderBalance: this._web3HttpClient.utils.fromWei(
            senderBalance,
            'ether',
          ),
          senderBalanceUSDT: this._web3HttpClient.utils.fromWei(
            senderBalanceUSDT,
            'ether',
          ),
          senderBalanceUSDC: this._web3HttpClient.utils.fromWei(
            senderBalanceUSDC,
            'ether',
          ),
        });
      }

      return result;
    } catch (e) {
      throw e;
    }
  }
}
