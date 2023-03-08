import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app/config.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const appConfigService = app.get(AppConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix(appConfigService.globalPrefix);
  app.enableCors({ origin: appConfigService.allowedOrigins });

  function handleExit() {
    try {
      // TODO
      console.log('');
    } catch (error) {
      console.error('', error);
    } finally {
      process.exit();
    }
  }

  process.on('SIGINT', () => {
    handleExit();
  });
  process.on('SIGTERM', () => {
    handleExit();
  });

  const port = appConfigService.port;

  const server = await app.listen(port, () => {
    console.log(`Webserver express start listening on port ${port}`);
  });

  server.keepAliveTimeout = 65 * 1000;
}

bootstrap();
