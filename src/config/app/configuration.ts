import { registerAs } from '@nestjs/config';

export const TOKEN = 'app';

export const configuration = registerAs(TOKEN, () => ({
  env: process.env.APP_ENV,
  port: parseInt(process.env.APP_PORT, 10) || 3000,
  allowedOrigins: process.env.ALLOWED_ORIGINS,
  ethereum: {
    infuraKey: process.env.ETHEREUM_INFURA_KEY || null,
    infuraUrl: process.env.ETHEREUM_INFURA_URL || 'with https;//',
    infuraWSUrl: process.env.ETHEREUM_INFURA_WS_URL || 'with wss://',
    alchemyKey: process.env.ETHEREUM_ALCHEMY_KEY || null,
    alchemyURL: process.env.ETHEREUM_ALCHEMY_URL || 'with https;//',
    alchemyWSURL: process.env.ETHEREUM_ALCHEMY_WS_URL || 'with wss://',
    selfNodeHost: process.env.ETHEREUM_NODE_HOST || 'localhost',
    selfNodePort: parseInt(process.env.ETHEREUM_NODE_PORT, 10) || 8545,
    selfNodeWSPort: parseInt(process.env.ETHEREUM_NODE_WS_PORT) || 8546,
  },
  tron: {
    trongridHost: process.env.TRON_GRID_HOST || 'with https;//',
    trongridKey: process.env.TRON_GRID_API_KEY || null,
    tronwebFullHosts: process.env.TRON_WEB_HOSTS || [],
  },
  bsc: {
    bscHost: process.env.BSC_MAIN_HOST || 'with https;//',
    quicknodeUrl: process.env.BSC_QUICKNODE_URL || 'with https;//',
    quicknodeWSUrl: process.env.BSC_QUICKNODE_WS_URL || 'with wss;//',
  },
  binance: {
    binanceAPIKey: process.env.BINANCE_API_KEY || null,
    binanceAPISecret: process.env.BINANCE_API_SECRET || null,
  },
  evm: {
    privatKey: process.env.EVM_PRIVATE_KEY || null,
  },
  account: {
    bscUSDTPrivateKey: process.env.USDT_BSC_PRIVATE_KEY || null,
  },
}));
