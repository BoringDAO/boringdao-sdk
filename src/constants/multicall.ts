import {
  CHAIN_ARBITRUM,
  CHAIN_ARBITRUM_TESTNET,
  CHAIN_AURORA,
  CHAIN_AURORA_TESTNET,
  CHAIN_AVALANCHE,
  CHAIN_AVALANCHE_TESTNET,
  CHAIN_BOBA,
  CHAIN_BSC,
  CHAIN_BSC_TESTNET,
  CHAIN_ETHER,
  CHAIN_ETHER_GOERLI,
  CHAIN_ETHER_KOVAN,
  CHAIN_ETHER_RINKEBY,
  CHAIN_ETHER_ROPSTEN,
  CHAIN_FANTOM,
  CHAIN_FANTOM_TESTNET,
  CHAIN_HARMONY_0,
  CHAIN_HARMONY_0_TESTNET,
  CHAIN_HECO,
  CHAIN_HECO_TESTNET,
  CHAIN_METIS,
  CHAIN_OK,
  CHAIN_OK_TESTNET,
  CHAIN_OPTIMISM,
  CHAIN_POLYGON,
  CHAIN_POLYGON_MUMBAI,
  CHAIN_XDAI,
  CHAIN_XDAI_TESTNET,
} from '@w3u/chains'

export const MULTICALL_NETWORKS: {[chainID: number]: string} = {
  [CHAIN_ETHER]: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
  [CHAIN_ETHER_ROPSTEN]: '0x53C43764255c17BD724F74c4eF150724AC50a3ed',
  [CHAIN_ETHER_KOVAN]: '0x2cc8688C5f75E365aaEEb4ea8D6a480405A48D2A',
  [CHAIN_ETHER_RINKEBY]: '0x42Ad527de7d4e9d9d011aC45B31D8551f8Fe9821',
  [CHAIN_ETHER_GOERLI]: '0x77dCa2C955b15e9dE4dbBCf1246B4B85b651e50e',
  [CHAIN_BSC]: '0x1Ee38d535d541c55C9dae27B12edf090C608E6Fb',
  [CHAIN_BSC_TESTNET]: '0x301907b5835a2d723Fe3e9E8C5Bc5375d5c1236A',
  [CHAIN_OK]: '0x43e9cebf47397b510eB0a8aD9478dA2aC05F969c',
  [CHAIN_OK_TESTNET]: '0x412Ffc85E70ba52beD9301a5dE60E95AbDaa6200',
  [CHAIN_AVALANCHE_TESTNET]: '0xe17D262c3188F9c49f475Ba92110c12D094f13F3',
  [CHAIN_AVALANCHE]: '0xE9fE1cEFeD8492ccE0A72bC01C46002791644784',
  [CHAIN_HARMONY_0]: '0x4F497F9D85A6fE135fFca99f0f253919fE827211',
  [CHAIN_HARMONY_0_TESTNET]: '0xE958CC207Ad831E46E7ba9C5E9399ae189A10D61',
  [CHAIN_POLYGON_MUMBAI]: '0x3A520D5957cb50b0F570C4580282a7d5f2aE434c',
  [CHAIN_POLYGON]: '0xcDa98D16F4f5dA0163e25CA469d10ED8A64017bC',
  [CHAIN_XDAI]: '0x9F595098E07B3D75d36077bAF30889c49cDAeEFb',
  [CHAIN_XDAI_TESTNET]: '0x08FEa88e6Bc7D6e6AD45db98F049d2099EcD3a94',
  [CHAIN_FANTOM]: '0x9F595098E07B3D75d36077bAF30889c49cDAeEFb',
  [CHAIN_FANTOM_TESTNET]: '0xc425c83B35937FD07bE6763F91C357314e9DA3fE',
  [CHAIN_HECO]: '0x9F595098E07B3D75d36077bAF30889c49cDAeEFb',
  [CHAIN_HECO_TESTNET]: '0xA5772c7fD3575B5e66e530b517d7d744B849cB36',
  [CHAIN_ARBITRUM]: '0x9F595098E07B3D75d36077bAF30889c49cDAeEFb',
  [CHAIN_ARBITRUM_TESTNET]: '0x66d28394746ECe22d80cba6Faffc8336a46f0670',
  [CHAIN_OPTIMISM]: '0x11E4BED429b239a1A0C594ADEB71b99e8Fa1011A',
  [CHAIN_BOBA]: '0xD01a5051253007ae0b7123b50410E3B5A3f6cF95',
  [CHAIN_METIS]: '0x5D78bF8f79A66e43f5932c1Ae0b8fA6563F97f74',
  [CHAIN_AURORA]: '0xF8BE629521CfdcC35E9439E9775d341A0f076023',
  [CHAIN_AURORA_TESTNET]: '0x75359476afe3d8DC0caB44118e0637FbaCd60141',
}
