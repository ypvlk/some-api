import { Injectable, Logger } from '@nestjs/common';
import { AppConfigService } from './config/app/config.service';
import { EthereumService } from './@Ethereum/ethereum.service';
import { TrongridService } from './@Tron/trongrid.service';
import { BSCService } from './@BSC/bsc.service';
import { BinanceService, Network } from './@Binance/binance.service';
import { WithdrawDto } from './dto/withdraw.dto';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly ethereumNetworkService: EthereumService,
    private readonly tronNetworkService: TrongridService,
    private readonly bscNetworkService: BSCService,
    private readonly binanceAPIService: BinanceService,
    private readonly appConfigService: AppConfigService,
  ) {}

  public async sendUSDT({ addressTo, amount }): Promise<any> {
    try {
      const privateKeyFrom = this.appConfigService.bscUSDTPrivateKey;

      if (!privateKeyFrom) {
        throw new Error('Sender address is missed.');
      }

      const coin = 'USDT';

      console.log('addressTo: ', addressTo);
      console.log('coin', coin);

      await this.bscNetworkService.transfer(
        privateKeyFrom,
        addressTo,
        coin,
        amount,
      );
    } catch (e) {
      console.error(e);
      this.logger.error(`sendUSDT() error: ${e}`);
      throw e;
    }
  }

  public async getTransactionsInfo(
    contractAddress: string,
    transactionsCount: number,
  ): Promise<any> {
    try {
      const result = await this.bscNetworkService.getTransactionsInfo(
        contractAddress,
        transactionsCount,
      );
      return result;
    } catch (e) {
      console.error(e);
      this.logger.error(`getTransactionsInfo() error: ${e}`);
      throw e;
    }
  }

  public async withdrawFromBinance({
    coin,
    amount,
    address,
    network,
  }: WithdrawDto): Promise<any> {
    try {
      if (
        (network === 'ETH' && !/^0x([A-Fa-f0-9]{40})$/.test(address)) ||
        (network === 'BSC' && !/^0x([A-Fa-f0-9]{40})$/.test(address)) ||
        (network === 'TRX' && !/^T([A-Za-z0-9]{33})$/.test(address))
      ) {
        throw new Error('Invalid wallet address for the selected network');
      }

      const balance = await this.binanceAPIService.getCoinBalance(
        coin,
        network as Network,
      );

      if (balance < amount) {
        throw new Error('Insufficient funds.');
      }

      const { minWithdrawAmount, withdrawFee, withdrawStatus } =
        await this.binanceAPIService.getAssetDetail(coin);

      if (!withdrawStatus) {
        throw new Error(`Withdrawal of ${coin} coin is prohibited.`);
      }

      if (minWithdrawAmount > parseFloat(amount)) {
        throw new Error(`The minimal withdraw amount is ${minWithdrawAmount}`);
      }

      console.log('addresTo: ', address);
      console.log('coin: ', coin);
      console.log('network: ', network);
      console.log('amount: ', amount);
      console.log('balanceFrom: ', balance);
      console.log('minWithdrawAmount: ', minWithdrawAmount);
      console.log('withdrawFee: ', withdrawFee);

      await this.binanceAPIService.withdraw(
        coin,
        amount,
        address,
        network as Network,
      );
    } catch (e) {
      console.error(e);
      this.logger.error(`withdrawFromBinance() error: ${e}`);
      throw e;
    }
  }

  public async depositUSDT(amount: string): Promise<any> {
    try {
      const privateKeyFrom = this.appConfigService.evmWalletPrivateKey;

      if (!privateKeyFrom) {
        throw new Error('Wallet privat key is missed.');
      }

      const coin = 'USDT';
      const network = 'BSC';

      const { depositStatus } = await this.binanceAPIService.getAssetDetail(
        coin,
      );
      if (!depositStatus) {
        throw new Error('Deposit of this coin is prohibited');
      }

      const addressTo = await this.binanceAPIService.getDepositAddress(
        coin,
        network,
      );

      console.log('addressTo: ', addressTo);
      console.log('coin: ', coin);

      await this.bscNetworkService.transfer(
        privateKeyFrom,
        addressTo,
        coin,
        amount,
      );
    } catch (e) {
      console.error(e);
      this.logger.error(`depositUSDT() error: ${e}`);
      throw e;
    }
  }

  public async getBalancesETH(
    address: string,
    tronAddress: string,
  ): Promise<any> {
    try {
      // Get ETH balance from Etherem network
      const ethereumNetwork_ETH =
        await this.ethereumNetworkService.getBalanceETH(address);

      // Get wETH balance from Ethereum network
      const ethereumNetwork_wETH =
        await this.ethereumNetworkService.getBalanceWETH(address);

      //Get wETH balance from Tron network
      // const tronNetwork_wETH = await this.tronNetworkService.getBalanceWETH(tronAddress);

      // Get wETH from BSC network
      const bscNetwork_wETH = await this.bscNetworkService.getBalanceWETH(
        address,
      );
      return {
        EthereumETH: ethereumNetwork_ETH,
        EthereumWETH: ethereumNetwork_wETH,
        // TronWETH: tronNetwork_wETH,
        BSCwETH: bscNetwork_wETH,
      };
    } catch (e) {
      console.error(e);
      this.logger.error(`getBalancesETH() error: ${e}`);
      throw e;
    }
  }

  public async getBalancesBNB(address: string): Promise<any> {
    try {
      // Get BNB balance from BSC network
      const bscNetwork_BNB = await this.bscNetworkService.getBalanceBNB(
        address,
      );

      // Get wBNB balance from BSC network
      const bscNetwork_wBNB = await this.bscNetworkService.getBalanceWBNB(
        address,
      );

      // Get wBNB from Ethereum network
      const ethereumNetwork_wBNB =
        await this.ethereumNetworkService.getBalanceWBNB(address);
      return {
        BscBNB: bscNetwork_BNB,
        BscwBNB: bscNetwork_wBNB,
        EthereumWBNB: ethereumNetwork_wBNB,
      };
    } catch (e) {
      console.error(e);
      this.logger.error(`getBalancesBNB() error: ${e}`);
      throw e;
    }
  }
}
