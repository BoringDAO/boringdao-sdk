import {
  CHAIN_ARBITRUM_TESTNET,
  CHAIN_AURORA_TESTNET,
  CHAIN_BSC_TESTNET,
  CHAIN_ETHER_KOVAN,
  CHAIN_OK_TESTNET,
  CHAIN_POLYGON_MUMBAI,
} from '@w3u/chains'

export const isTestnet = (chainID: number | undefined): boolean => {
  return (
    chainID === CHAIN_ETHER_KOVAN ||
    chainID === CHAIN_BSC_TESTNET ||
    chainID === CHAIN_POLYGON_MUMBAI ||
    chainID === CHAIN_OK_TESTNET ||
    chainID === CHAIN_AURORA_TESTNET ||
    chainID === CHAIN_ARBITRUM_TESTNET
  )
}
