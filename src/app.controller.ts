import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { WithdrawDto } from './dto/withdraw.dto';
import { SendDto } from './dto/send.dto';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly service: AppService) {}

  @Get('/balances/eth')
  async getBalancesETH(
    @Query('evmAddress') evmAddress: string,
    @Query('tronAddress') tronAddress: string,
  ): Promise<any> {
    return this.service.getBalancesETH(evmAddress, tronAddress);
  }

  @Get('/balances/bnb/:address')
  async getBalancesBNB(@Param('address') address: string): Promise<any> {
    return this.service.getBalancesBNB(address);
  }

  @Post('/deposit')
  async depositUSDT(@Body('amount') amount: string): Promise<any> {
    await this.service.depositUSDT(amount);
    return { message: 'Transaction has been send' };
  }

  @Post('/withdraw')
  async withdrawFromBinance(@Body() data: WithdrawDto): Promise<any> {
    await this.service.withdrawFromBinance(data);
    return { message: 'Withdraw has been process' };
  }

  @Get('/trx-info/bsc/:contractAddress')
  async getTransactionsInfo(
    @Param('contractAddress') contractAddress: string,
    @Query('transactonsCount') transactonsCount: number,
  ): Promise<any> {
    return this.service.getTransactionsInfo(contractAddress, transactonsCount);
  }

  @Post('/send/usdt')
  async sendUSDT(@Body() data: SendDto): Promise<any> {
    await this.service.sendUSDT(data);
    return { message: 'Transaction has been send' };
  }
}
