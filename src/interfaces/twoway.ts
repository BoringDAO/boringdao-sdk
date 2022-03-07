export interface TwowayCalculateRewardInterface {
  chainID: number
  reward: string | undefined
}

export interface LockBalanceInterface {
  chainID: number
  balance: string
}

export interface LockBalancesInterface {
  tokenName: string
  balances: LockBalanceInterface[]
}
