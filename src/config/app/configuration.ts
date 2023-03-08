import { registerAs } from '@nestjs/config';

export const TOKEN = 'app';

export const configuration = registerAs(TOKEN, () => ({
  env: process.env.APP_ENV,
  port: parseInt(process.env.PORT, 10) || 3000,
  pgDB: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'yarik',
    password: process.env.DB_PASSWORD || '123',
    database: process.env.DB_DATABASE || 'test',

    // based on  https://node-postgres.com/api/pool and https://github.com/typeorm/typeorm/issues/3388#issuecomment-673242516
    // max connection pool size (default - 3 connections)
    maxPoolSize: process.env.DB_MAX_POOL_SIZE || '3',

    // connection timeout
    connectionTimeoutMillis: process.env.DB_MAX_CONNECTION_TIMEOUT || '60000',

    // idle timeout (default - 30s)
    idleTimeoutMillis: process.env.DB_MAX_IDLE_TIMEOUT || '30000',
  },
  globalPrefix: process.env.URL_PREFIX || undefined,
  jwt: {
    auth: {
      public: process.env.JWT_PUBLIC || 'Jwt Public default',
      secret: process.env.JWT_SECRET || 'Jwt Secret default',
      algorithm: process.env.JWT_ALGO || 'HS512',
      ttl: process.env.JWT_TTL || 60 * 1000,
    },
    test: {},
  },
  allowedOrigins: process.env.ALLOWED_ORIGINS,
}));
