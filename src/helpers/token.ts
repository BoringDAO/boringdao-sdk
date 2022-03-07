import {
  CHAIN_ARBITRUM,
  CHAIN_ARBITRUM_TESTNET,
  CHAIN_AURORA,
  CHAIN_ETHER,
  CHAIN_ETHER_KOVAN,
  CHAIN_HARMONY_0,
  CHAIN_HARMONY_0_TESTNET,
  CHAIN_METIS,
  CHAIN_OPTIMISM,
} from '@w3u/chains'
import {Token} from '../interfaces/token'
import {TokensContractAddress} from '../constants/token'

export const isOriginToken = (chainID: number | undefined, token: Token | undefined): boolean => {
  if ((chainID === CHAIN_HARMONY_0 || chainID === CHAIN_HARMONY_0_TESTNET) && token?.symbol === 'ONE') {
    return true
  }

  if (
    (chainID === CHAIN_ETHER_KOVAN ||
      chainID === CHAIN_ETHER ||
      chainID === CHAIN_OPTIMISM ||
      chainID === CHAIN_ARBITRUM ||
      chainID === CHAIN_AURORA ||
      chainID === CHAIN_ARBITRUM_TESTNET) &&
    token?.symbol === 'ETH'
  ) {
    return true
  }

  if (chainID === CHAIN_METIS && token?.symbol === 'METIS') {
    return true
  }

  return false
}

export const getToken = (chainId: number, symbol: string): Token | undefined => {
  return TokensContractAddress.find((token) => token.chainID === chainId && token.symbol === symbol)
}
