import {Token} from '../interfaces/token'
import {CHAIN_BSC, CHAIN_ETHER} from '@w3u/chains'

export const TokensContractAddress: Token[] = [
  {
    address: '0x3c9d6c1C73b31c837832c72E04D3152f051fc1A9',
    symbol: 'BOR',
    chainID: CHAIN_ETHER,
    decimals: 18,
  },
  {
    address: '0x92D7756c60dcfD4c689290E8A9F4d263b3b32241',
    symbol: 'BOR',
    chainID: CHAIN_BSC,
    decimals: 18,
  },
  {
    address: '0xBC19712FEB3a26080eBf6f2F7849b417FdD792CA',
    symbol: 'BORING',
    chainID: CHAIN_ETHER,
    decimals: 18,
  },
  {
    address: '0xffEecbf8D7267757c2dc3d13D730E97E15BfdF7F',
    symbol: 'BORING',
    chainID: CHAIN_BSC,
    decimals: 18,
  },
]
