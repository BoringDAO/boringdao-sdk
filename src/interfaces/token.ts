export interface Token {
  address: string
  symbol: string
  decimals: number
  chainID: number
}

export interface TwowayOToken extends Token {
  pid: number
}

export interface NativeBridgeToken extends Token {
  isWrapped?: boolean
  originAddress?: string
}
