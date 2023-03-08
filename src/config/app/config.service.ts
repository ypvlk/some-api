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

  get globalPrefix(): string {
    return this.configService.get<string>(`${TOKEN}.globalPrefix`);
  }

  get allowedOrigins(): string {
    return this.configService.get<string>(`${TOKEN}.allowedOrigins`);
  }

  isProduction(): boolean {
    return this.env === AppEnvironment.PRODUCTION;
  }
}
