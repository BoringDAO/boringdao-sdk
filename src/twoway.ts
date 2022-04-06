import {ethers, Signer} from 'ethers'
import {TransactionReceipt} from '@ethersproject/abstract-provider'
import TwowayABI from './abis/TwoWay.json'
import MulticallABI from './abis/Multicall.json'
import BigNumber from 'bignumber.js'
import {
  PRODUCTION_TWOWAY_CHAIN_IDS,
  TWOWAY_CHAIN_IDS,
  TWOWAY_CONTRACT_ADDRESSES,
  TWOWAY_TOKENS,
} from './constants/twoway'
import {MULTICALL_NETWORKS} from './constants/multicall'
import {ContractInputs} from './interfaces/multicall'
import {LockBalancesInterface, TwowayCalculateRewardInterface} from './interfaces/twoway'
import {isTestnet} from './helpers/chain'
import {multicalls} from './multicall'
import {getOTokens} from './helpers/twoway'
import {Token} from './interfaces/token'
import {isOriginToken} from './helpers/token'
import {getContract} from './helpers/contract'

export class Twoway {
  getAddLiquidityRewards = async (
    relayProvider: ethers.providers.Provider,
    relayChainId: number,
    oTokenAddress: string,
    chainId: number,
    amount: string
  ): Promise<TwowayCalculateRewardInterface[]> => {
    const multicallContract = getContract(relayProvider, MULTICALL_NETWORKS[relayChainId], MulticallABI)
    const twowayContract = getContract(relayProvider, TWOWAY_CONTRACT_ADDRESSES[relayChainId], TwowayABI.abi)

    if (!oTokenAddress) return new Promise((resolve) => resolve([]))

    const ids = !isTestnet(chainId) ? PRODUCTION_TWOWAY_CHAIN_IDS : TWOWAY_CHAIN_IDS

    // if (new BigNumber(amount || '0').lte(0)) return
    const calls: ContractInputs[] = []
    ids.map((id) =>
      calls.push({
        contract: twowayContract,
        method: 'calculateReward',
        args: [oTokenAddress, id, ethers.utils.parseEther(amount || '0')],
      })
    )

    multicalls(multicallContract, calls)
      .then((values) => {
        const results: TwowayCalculateRewardInterface[] = ids.map((id, i) => {
          return {
            chainID: id,
            reward: values[i]?.toString(),
          }
        })

        return Promise.resolve(results)
      })
      .catch((e: any) => {
        return Promise.reject(`Multicalls twoway calculate reward(${relayChainId}: ${e}`)
      })

    return Promise.resolve([])
  }

  getTwowayToken = (chainID: number) => TWOWAY_TOKENS.find((token) => token.chainID === chainID)

  crossOutUSDT = async (
    signerOrProvider: Signer | ethers.providers.Provider,
    fromChainID: number,
    toChainID: number,
    account: string,
    to: string,
    amount: string
  ): Promise<TransactionReceipt> => {
    const token = this.getTwowayToken(fromChainID)
    if (!token) throw Error(`Can't find twoway token(${fromChainID})`)

    return this.crossOut(
      signerOrProvider,
      fromChainID,
      toChainID,
      account,
      token,
      to,
      ethers.utils.parseUnits(amount, token.decimals).toString()
    )
  }

  crossOut = async (
    provider: Signer | ethers.providers.Provider,
    fromChainID: number,
    toChainID: number,
    account: string,
    token: Token,
    to: string,
    amount: string
  ): Promise<TransactionReceipt> => {
    console.debug(
      `crossOut(current_chain_id: ${fromChainID}, account: ${account}, token_address: ${token.address}, target_chain_id: ${toChainID}, to: ${to}, amount: ${amount})`
    )
    const contract = getContract(provider, TWOWAY_CONTRACT_ADDRESSES[fromChainID], TwowayABI.abi)

    let args = {}
    if (isOriginToken(fromChainID, token)) {
      args = {
        value: ethers.utils.parseUnits(amount, token?.decimals),
      }
    }

    const tx = await contract?.crossOut(
      token?.address,
      toChainID,
      to,
      ethers.utils.parseUnits(amount, token?.decimals),
      args
    )
    return tx.wait()
  }

  getCrossUSDTResult = async (
    provider: ethers.providers.Provider,
    targetProvider: ethers.providers.Provider,
    fromChainID: number,
    toChainID: number,
    amount: string
  ): Promise<string[]> => {
    const token = this.getTwowayToken(fromChainID)
    if (!token) throw Error(`Can't find twoway token(${fromChainID})`)
    const targetToken = this.getTwowayToken(toChainID)
    if (!targetToken) throw Error(`Can't find target twoway token(${fromChainID})`)

    const targetDiff = 18 - (targetToken?.decimals || 18)
    const currentContract = getContract(provider, TWOWAY_CONTRACT_ADDRESSES[fromChainID], TwowayABI.abi)
    const targetContract = getContract(targetProvider, TWOWAY_CONTRACT_ADDRESSES[toChainID], TwowayABI.abi)

    const maxToken1 = await currentContract?.getMaxToken1AmountOut(token.address, toChainID)
    const ratio = await targetContract?.feeRatioM(targetToken.address, fromChainID)
    const valueN = ethers.utils.parseUnits(amount, 18).toString()

    let count = 2
    if (new BigNumber(maxToken1.toString()).eq(0) || new BigNumber(valueN).lte(maxToken1.toString())) {
      count = 1
    }

    const fixedAmount = await targetContract?.feeAmountM(targetToken.address, fromChainID)
    const finalFixedAmount = new BigNumber(fixedAmount.toString()).multipliedBy(count).toString()

    const d = new BigNumber(amount).multipliedBy(ratio.toString())
    const f = new BigNumber(finalFixedAmount).multipliedBy(10 ** targetDiff).plus(d.toString())
    return [f.toString(), new BigNumber(valueN).minus(f).toString()]
  }

  getTwowayAddress = (chainID: number) => {
    return TWOWAY_CONTRACT_ADDRESSES[chainID]
  }

  getUSDTAddress = (chainID: number) => {
    const token = this.getTwowayToken(chainID)
    return token?.address
  }

  addTwowayLiquidity = async (
    provider: Signer | ethers.providers.Provider,
    chainId: number,
    account: string,
    amount: string,
    token: Token
  ): Promise<TransactionReceipt> => {
    const twowayAddress = TWOWAY_CONTRACT_ADDRESSES[chainId]
    const twowayContract = getContract(provider, twowayAddress, TwowayABI.abi)
    try {
      const value = ethers.utils.parseUnits(amount, token?.decimals)

      let args = {}
      if (isOriginToken(chainId, token)) {
        args = {
          value: value,
        }
      }

      console.log(`Deposit(tokenAddress: ${token?.address}, amount: ${value})`)
      const tx = await twowayContract?.deposit(token?.address, value, args)
      await tx.wait()
      return Promise.resolve(tx)
    } catch (e) {
      return Promise.reject(`add twoway liquidity: ${e}`)
    }
  }

  removeTwowayLiquidity = async (
    provider: Signer | ethers.providers.Provider,
    chainId: number,
    toChainId: number,
    account: string,
    amount: string,
    token: Token
  ): Promise<TransactionReceipt> => {
    const twowayAddress = TWOWAY_CONTRACT_ADDRESSES[chainId]
    const twowayContract = getContract(provider, twowayAddress, TwowayABI.abi)
    try {
      console.log(`Withdraw(tokenAddress: ${token?.address}, toID: ${toChainId})`)
      const tx = await twowayContract?.withdraw(token?.address, toChainId, account, ethers.utils.parseEther(amount))
      await tx.wait()
      return Promise.resolve(tx)
    } catch (e) {
      return Promise.reject(`remove liquidity: ${e}`)
    }
  }

  getTreasuryTo = async (provider: ethers.providers.Provider | Signer, chainId: number): Promise<string> => {
    const twowayContract = getContract(provider, TWOWAY_CONTRACT_ADDRESSES[chainId], TwowayABI.abi)
    try {
      const to = await twowayContract.treasuryTo()
      return Promise.resolve(to)
    } catch (e) {
      console.error('fuck: ', e)
      return Promise.reject(e)
    }
  }

  getTwowayLockBalances = async (
    relayProvider: ethers.providers.Provider,
    relayChainId: number,
    chainId: number
  ): Promise<LockBalancesInterface[]> => {
    const oTokens = getOTokens(relayChainId)
    const multicallContract = getContract(relayProvider, MULTICALL_NETWORKS[relayChainId], MulticallABI)
    const twowayContract = getContract(relayProvider, TWOWAY_CONTRACT_ADDRESSES[relayChainId], TwowayABI.abi)

    const ids = !isTestnet(chainId) ? PRODUCTION_TWOWAY_CHAIN_IDS : TWOWAY_CHAIN_IDS

    const calls: ContractInputs[] = []
    oTokens.map((oToken) => {
      calls.push(
        ...ids.map<ContractInputs>((id) => {
          return {
            contract: twowayContract,
            method: 'lockBalances',
            args: [oToken.address, id],
          }
        })
      )
    })

    const balances = await multicalls(multicallContract, calls).catch((e: any) => {
      return Promise.reject(`multicalls lockBalances: ${e}`)
    })

    const length = ids.length
    const result: LockBalancesInterface[] = []
    if (balances && balances.length > 0) {
      oTokens.map((token, i) => {
        const r = ids.map((id, j) => {
          // @ts-ignore
          const balance = balances[j + length * i] || '0'

          return {
            chainID: id,
            balance: balance.toString(),
          }
        })

        result.push({
          tokenName: token.symbol,
          balances: r,
        })
      })
    }
    return Promise.resolve(result)
  }
}
