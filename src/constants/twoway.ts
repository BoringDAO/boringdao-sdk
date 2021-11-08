import {
  CHAIN_ARBITRUM,
  CHAIN_AVALANCHE,
  CHAIN_AVALANCHE_TESTNET,
  CHAIN_BSC,
  CHAIN_BSC_TESTNET,
  CHAIN_ETHER,
  CHAIN_ETHER_KOVAN,
  CHAIN_FANTOM,
  CHAIN_FANTOM_TESTNET,
  CHAIN_HARMONY_0,
  CHAIN_HARMONY_0_TESTNET,
  CHAIN_HECO,
  CHAIN_HECO_TESTNET,
  CHAIN_OK,
  CHAIN_OK_TESTNET,
  CHAIN_POLYGON,
  CHAIN_POLYGON_MUMBAI,
  CHAIN_XDAI,
  CHAIN_XDAI_TESTNET,
} from '@w3u/chains'

export interface PegToken {
  address: string
  symbol: string
  decimals: number
  chainID: number
  pair: string
}

export const TWOWAY_CONTRACT_ADDRESSES: {[chainID: number]: string} = {
  [CHAIN_ETHER]: '0xF8393Bc60CF8CfcD442BcD742a4Aa847f4B6B4ac',
  [CHAIN_BSC]: '0xf52d6823d9e2aff7548d9fe82eeadca6b1ed3062',
  [CHAIN_OK]: '0x39b107d2d810954507e7cd70403fda4ae12a192e',
  [CHAIN_POLYGON]: '0x54e2657015a9b5cc65dde59e515c71171312d319',
  [CHAIN_AVALANCHE]: '0x0f4c9320b9de4fa426d3e27d85c3452f52314c57',
  [CHAIN_HARMONY_0]: '0xe3b59fd01c0155a98146a6e0beb8376b751363fc',
  [CHAIN_HECO]: '0x8b645375a7a3bceaa01a6ecfd6e58d90b125b454',
  [CHAIN_FANTOM]: '0xbe4a5438ad89311d8c67882175d0ffcc65dc9c03',
  [CHAIN_XDAI]: '0x8b645375a7a3bceaa01a6ecfd6e58d90b125b454',
  [CHAIN_ETHER_KOVAN]: '0xF4809f0574E66aB07A0D2F4c229af0cD31A16FA6',
  [CHAIN_ARBITRUM]: '0x017Ff87AB312301aDE54f7cf9Cc5AEA28C9De024',
  [CHAIN_BSC_TESTNET]: '0x6456cA9a734FBEB21BE8b7935837FF33325F4dBf',
  [CHAIN_OK_TESTNET]: '0x1D89E92f28f66DBE12a7F0b469ab55e77330bb1b',
  [CHAIN_POLYGON_MUMBAI]: '0xBDF99C3b6c23fF62049A721385893696514eed62',
  [CHAIN_AVALANCHE_TESTNET]: '0x019ecC465EeE4c2C12c9D27474eB494Cc58799e8',
  [CHAIN_HARMONY_0_TESTNET]: '0x8723ca4652cC6b0d7f916B524178F5ed7FB3534A',
  [CHAIN_HECO_TESTNET]: '0x7fbdB4E3657AA7877887BB445dcB57e58c674871',
  [CHAIN_FANTOM_TESTNET]: '0x40a7Db10d41b0e16F8E264294E47A4719c706EA2',
  [CHAIN_XDAI_TESTNET]: '0x25836668769f5017F29CA40967c5a2889a001550',
}

export const TWOWAY_CONTRACT_WEBSOCKET: {[chainID: number]: string} = {
  [CHAIN_ETHER]: 'wss://mainnet.infura.io/ws/v3/09fc61c0350848d2abb958131e3a5876',
  [CHAIN_BSC]: 'wss://bsc-ws-node.nariox.org:443',
  [CHAIN_OK]:
    'wss://apis.ankr.com/wss/d50ae3fe072547a5ad272b83cea911ab/17493a07f06838bfde72985c9f263be0/okexchain/full/main',
  [CHAIN_POLYGON]: 'wss://speedy-nodes-nyc.moralis.io/1a2b3c4d5e6f1a2b3c4d5e6f/polygon/mainnet/ws',
  [CHAIN_AVALANCHE]: 'wss://speedy-nodes-nyc.moralis.io/1a2b3c4d5e6f1a2b3c4d5e6f/avalanche/mainnet/ws',
  [CHAIN_HARMONY_0]: 'wss://ws.s0.t.hmny.io/',
  [CHAIN_HECO]:
    'wss://apis.ankr.com/wss/240bbc536212424c8da5278eeaa73b24/17493a07f06838bfde72985c9f263be0/heco/fast/main',
  [CHAIN_FANTOM]:
    'wss://apis.ankr.com/wss/45e74fdba98e48ed910265ce082acd2d/17493a07f06838bfde72985c9f263be0/fantom/full/main',
  [CHAIN_XDAI]:
    'wss://apis.ankr.com/wss/29c93b1dfaa94f8e82fa28196c9b69c7/17493a07f06838bfde72985c9f263be0/xdai/fast/main',
  [CHAIN_ARBITRUM]:
    'wss://apis.ankr.com/wss/cff7cf15d9194d6cab27fc0ef5270754/17493a07f06838bfde72985c9f263be0/arbitrum/full/main',
}

export const TWOWAY_TOKENS: PegToken[] = [
  {
    symbol: 'USDT',
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    chainID: CHAIN_ETHER,
    decimals: 6,
    pair: '0x9312142efba17ce795f95e17076b0800d14a3b19',
  },
  {
    symbol: 'USDT',
    address: '0x382bB369d343125BfB2117af9c149795C6C65C50',
    chainID: CHAIN_OK,
    decimals: 18,
    pair: '0x232c6b4e2e0833b1e6e07c9a37898203e7dd7b24',
  },
  {
    symbol: 'USDT',
    address: '0x55d398326f99059ff775485246999027b3197955',
    chainID: CHAIN_BSC,
    decimals: 18,
    pair: '0x37e6812c17252534b8b30c8b05fb677c4a94c397',
  },
  {
    symbol: 'USDT',
    address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
    chainID: CHAIN_POLYGON,
    decimals: 6,
    pair: '0xed6701d701841401b446f23757caa422d81691b0',
  },
  {
    symbol: 'USDT',
    address: '0xc7198437980c041c805A1EDcbA50c1Ce5db95118',
    chainID: CHAIN_AVALANCHE,
    decimals: 6,
    pair: '0x216f332d17145871d1d5ff5feb4b08513ef7cc21',
  },
  {
    symbol: 'USDT',
    address: '0xa71edc38d189767582c38a3145b5873052c3e47a',
    chainID: CHAIN_HECO,
    decimals: 18,
    pair: '0xe9fe1cefed8492cce0a72bc01c46002791644784',
  },
  {
    symbol: 'USDT',
    address: '0x3c2b8be99c50593081eaa2a724f0b8285f5aba8f',
    chainID: CHAIN_HARMONY_0,
    decimals: 6,
    pair: '0xb238a595e9797e009efd5f938c9918181662066c',
  },
  {
    symbol: 'USDT',
    address: '0x049d68029688eabf473097a2fc38ef61633a3c7a',
    chainID: CHAIN_FANTOM,
    decimals: 6,
    pair: '0xe4af65953eeb4b868b7b7ff33808e22069b09916',
  },
  {
    symbol: 'USDT',
    address: '0x4ECaBa5870353805a9F068101A40E0f32ed605C6',
    chainID: CHAIN_XDAI,
    decimals: 6,
    pair: '0xe9fe1cefed8492cce0a72bc01c46002791644784',
  },
  {
    symbol: 'USDT',
    address: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
    chainID: CHAIN_ARBITRUM,
    decimals: 6,
    pair: '0xD01a5051253007ae0b7123b50410E3B5A3f6cF95',
  },
  {
    symbol: 'USDT',
    address: '0x1D83BcDA708047898F20Cebb4AABF08008783f41',
    chainID: CHAIN_ETHER_KOVAN,
    decimals: 6,
    pair: '0x51d4615c849A80BAFb3EcF4817Fb9174eD4B7284',
  },
  {
    symbol: 'USDT',
    address: '0xB36c3713A6D46C67f55F6F49Ae0c47a61901F015',
    chainID: CHAIN_BSC_TESTNET,
    decimals: 18,
    pair: '0x9d3f38c696ca08CDDC9C5D04B24D52beE5a81ea1',
  },
  {
    symbol: 'USDT',
    address: '0xCB7Bb6e911e79713A596731dc21D0a2EF24a4F74',
    chainID: CHAIN_POLYGON_MUMBAI,
    decimals: 6,
    pair: '0xa8E633C998b109eE76714b4CA8d7D652A68b3860',
  },
  {
    symbol: 'USDT',
    address: '0xbE64543d9dC5b530ee9bD6259D02d14613Aec9aB',
    chainID: CHAIN_OK_TESTNET,
    decimals: 18,
    pair: '0xC8E98D8855088F869a38dD00f4683c3Ea05d2c62',
  },
  {
    symbol: 'USDT',
    address: '0xb608b55b0F777e70F8e37a18F8Da6EC8AE667B33',
    chainID: CHAIN_AVALANCHE_TESTNET,
    decimals: 6,
    pair: '0xBE4Cb4bD2f6E1BAC5E45CE9162388d514375Dc28',
  },
  {
    symbol: 'USDT',
    address: '0xAe8234563e2B07E5cB89c6B0d81Fe54CF7667769',
    chainID: CHAIN_HECO_TESTNET,
    decimals: 18,
    pair: '0x5b9611a5f0dA88aC6D3146C784a7ff66de6E6f09',
  },
  {
    symbol: 'USDT',
    address: '0xbf49c0ffDEEC5bF1731674841B60E4B0855FE6ED',
    chainID: CHAIN_HARMONY_0_TESTNET,
    decimals: 6,
    pair: '0xa42ECFcFE2eA660D4cA88d6773a77eA41AB384a6',
  },
  {
    symbol: 'USDT',
    address: '0xbf49c0ffDEEC5bF1731674841B60E4B0855FE6ED',
    chainID: CHAIN_FANTOM_TESTNET,
    decimals: 6,
    pair: '0x031c7CaCCA128D830C0160e36074D296B6AD23AA',
  },
  {
    symbol: 'USDT',
    address: '0xbf49c0ffDEEC5bF1731674841B60E4B0855FE6ED',
    chainID: CHAIN_XDAI_TESTNET,
    decimals: 6,
    pair: '0xbBa69494e9812948349f31691C871A4aBA42D517',
  },
]
