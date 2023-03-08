import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigModule } from './config/app/config.module';

@Module({
  imports: [AppConfigModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
