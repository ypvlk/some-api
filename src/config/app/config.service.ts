import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TOKEN } from './configuration';

enum AppEnvironment {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
}

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get env(): AppEnvironment {
    return this.configService.get<AppEnvironment>(`${TOKEN}.env`);
  }

  get port(): number {
    return this.configService.get<number>(`${TOKEN}.port`);
  }

  get allowedOrigins(): string {
    return this.configService.get<string>(`${TOKEN}.allowedOrigins`);
  }

  isProduction(): boolean {
    return this.env === AppEnvironment.PRODUCTION;
  }

  get ethereumProviderURL(): string {
    const infuraURL = this.configService.get<string>(
      `${TOKEN}.ethereum.infuraUrl`,
    );
    const infuraKey = this.configService.get<string>(
      `${TOKEN}.ethereum.infuraKey`,
    );
    const alchemyURL = this.configService.get<string>(
      `${TOKEN}.ethereum.alchemyUrl`,
    );
    const alchemyKey = this.configService.get<string>(
      `${TOKEN}.ethereum.alchemyKey`,
    );
    const selfNodeHost = this.configService.get<string>(
      `${TOKEN}.ethereum.selfNodeHost`,
    );
    const selfNodePort = this.configService.get<string>(
      `${TOKEN}.ethereum.selfNodePort`,
    );
    if (infuraURL && infuraKey) {
      return `${infuraURL}${infuraKey}`;
    } else if (alchemyURL && alchemyKey) {
      return `${alchemyURL}${alchemyKey}`;
    } else {
      return `http://${selfNodeHost}:${selfNodePort}`;
    }
  }

  get ethereumWSProviderURL(): string {
    const infuraWSUrl = this.configService.get<string>(
      `${TOKEN}.ethereum.infuraWSUrl`,
    );
    const infuraKey = this.configService.get<string>(
      `${TOKEN}.ethereum.infuraKey`,
    );
    const alchemyWSURL = this.configService.get<string>(
      `${TOKEN}.ethereum.alchemyWSURL`,
    );
    const alchemyKey = this.configService.get<string>(
      `${TOKEN}.ethereum.alchemyKey`,
    );
    const selfNodeHost = this.configService.get<string>(
      `${TOKEN}.ethereum.selfNodeHost`,
    );
    const selfNodeWSPort = this.configService.get<string>(
      `${TOKEN}.ethereum.selfNodeWSPort`,
    );
    if (infuraWSUrl && infuraKey) {
      return `${infuraWSUrl}${infuraKey}`;
    } else if (alchemyWSURL && alchemyKey) {
      return `${alchemyWSURL}${alchemyKey}`;
    } else {
      return `ws://${selfNodeHost}:${selfNodeWSPort}`;
    }
  }

  get trongridProviderURL(): string {
    return this.configService.get<string>(`${TOKEN}.tron.trongridHost`);
  }

  get trongridProviderAPIKey(): string {
    return this.configService.get<string>(`${TOKEN}.tron.trongridKey`);
  }

  get tronwebFullHosts(): string[] {
    const ips = this.configService.get<string>(
      `${TOKEN}.tron.tronwebFullHosts`,
    );

    return ips.split(';');
  }

  get bscHost(): string {
    return this.configService.get<string>(`${TOKEN}.bsc.bscHost`);
  }

  get binanceAPIKey(): string {
    return this.configService.get<string>(`${TOKEN}.binance.binanceAPIKey`);
  }

  get binanceAPISecret(): string {
    return this.configService.get<string>(`${TOKEN}.binance.binanceAPISecret`);
  }

  get evmWalletPrivateKey(): string {
    return this.configService.get<string>(`${TOKEN}.evm.privatKey`);
  }

  get bscUSDTPrivateKey(): string {
    return this.configService.get<string>(`${TOKEN}.account.bscUSDTPrivateKey`);
  }
}
