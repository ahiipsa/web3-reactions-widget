
export const config = {
  widgetClient: {
    host: process.env.REACT_APP_WIDGET_HOST
  },
  contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS || '0xfA1DbE1Bc72b1fD14a7b626Feb5cf5441e225dF8',
  defaultRPC: process.env.REACT_APP_DEFAULT_RPC || 'https://api.harmony.one',
  chainParameters: {
      id: 1666600000, // '0x63564C40'
      name: 'Harmony Mainnet Shard 0',
      network: 'harmony',
      nativeCurrency: {
        decimals: 18,
        name: 'ONE',
        symbol: 'ONE',
      },
      rpcUrls: {
        default: {
          http: ['https://api.harmony.one'],
        },
        public: {
          http: ['https://api.harmony.one'],
        }
      },
      blockExplorers: {
        default: { name: 'Explorer', url: 'https://explorer.harmony.one/' },
      },
      testnet: false,
    },
}