import {Contract, ethers, Signer} from 'ethers'
import TunnelABI from './abis/Tunnel.json'
import {ContractInputs} from './interfaces/multicall'
import {multicalls} from './multicall'
import {MULTICALL_NETWORKS} from './constants/multicall'
import MulticallABI from './abis/Multicall.json'
import {AssetCommonAmountsInterface} from './interfaces/tunnel'
import {getToken} from './helpers/token'
import ERC20ABI from './abis/ERC20.json'
import {BoringTunnelContractAddress, BorTunnelContractAddress} from './constants/address'
import {TransactionReceipt} from '@ethersproject/abstract-provider'
import {getContract} from './helpers/contract'
import {AssetType} from './constants/enum'

export class Tunnel {
  chainId: number
  provider: Signer | ethers.providers.Provider

  multicallContract: Contract
  btcContract: Contract
  ltcContract: Contract
  dogeContract: Contract

  boringBTCContract: Contract
  boringLTCContract: Contract
  boringDOGEContract: Contract

  constructor(provider: Signer | ethers.providers.Provider, chainId: number) {
    this.chainId = chainId
    this.provider = provider

    this.ltcContract = getContract(provider, BorTunnelContractAddress.LTC, TunnelABI.abi)
    this.dogeContract = getContract(provider, BorTunnelContractAddress.DOGE, TunnelABI.abi)
    this.btcContract = getContract(provider, BorTunnelContractAddress.BTC, TunnelABI.abi)

    this.boringLTCContract = getContract(provider, BoringTunnelContractAddress.LTC, TunnelABI.abi)
    this.boringDOGEContract = getContract(provider, BoringTunnelContractAddress.DOGE, TunnelABI.abi)
    this.boringBTCContract = getContract(provider, BoringTunnelContractAddress.BTC, TunnelABI.abi)

    this.multicallContract = getContract(provider, MULTICALL_NETWORKS[this.chainId], MulticallABI)
  }

  private getContract = (oldVersion: boolean, assetType: string): Contract | null => {
    switch (assetType) {
      case AssetType.BTC.toString():
        return oldVersion ? this.btcContract : this.boringBTCContract
      case AssetType.LTC.toString():
        return oldVersion ? this.ltcContract : this.boringLTCContract
      case AssetType.DOGE.toString():
        return oldVersion ? this.dogeContract : this.boringDOGEContract
      default:
        return null
    }
  }

  totalPledgeAmounts = async (oldVersion: boolean): Promise<AssetCommonAmountsInterface> => {
    const calls: ContractInputs[] = Object.keys(AssetType).map((assetType) => {
      const tokenContract = getToken(this.chainId, oldVersion ? 'BOR' : 'BORING')
      const tunnelContract = this.getContract(oldVersion, assetType)

      return {
        contract: getContract(this.provider, tokenContract?.address, ERC20ABI.abi),
        method: 'balanceOf',
        args: [tunnelContract?.address],
      }
    })

    const amounts = await multicalls(this.multicallContract, calls).catch((e: any) => {
      return Promise.reject(`multicalls totalBorPledgeAmounts: ${e}`)
    })

    return Promise.resolve({
      btc: amounts[0]?.toString() ?? '0',
      ltc: amounts[1]?.toString() ?? '0',
      doge: amounts[2]?.toString() ?? '0',
    })
  }

  getCanIssueAssetAmounts = async (oldVersion: boolean): Promise<AssetCommonAmountsInterface> => {
    return this.commonInvoke(oldVersion, 'canIssueAmount')
  }

  getUserPledgeAmounts = async (oldVersion: boolean, account: string): Promise<AssetCommonAmountsInterface> => {
    return this.commonInvoke(oldVersion, 'borPledgeInfo', [account])
  }

  totalTVL = async (oldVersion: boolean): Promise<AssetCommonAmountsInterface> => {
    return this.commonInvoke(oldVersion, 'totalTVL')
  }

  pledgeRatio = async (oldVersion: boolean): Promise<AssetCommonAmountsInterface> => {
    return this.commonInvoke(oldVersion, 'pledgeRatio')
  }

  userLockAmount = async (oldVersion: boolean): Promise<AssetCommonAmountsInterface> => {
    return this.commonInvoke(oldVersion, 'userLockAmount')
  }

  userLockLength = async (oldVersion: boolean, account: string): Promise<AssetCommonAmountsInterface> => {
    return this.commonInvoke(oldVersion, 'userLockLength', [account])
  }

  redeemLockTxLimit = async (oldVersion: boolean): Promise<AssetCommonAmountsInterface> => {
    return this.commonInvoke(oldVersion, 'redeemLockTxLimit')
  }

  withdrawUnlock = async (oldVersion: boolean, assetType: AssetType): Promise<TransactionReceipt> => {
    const contract = this.getContract(oldVersion, assetType.toString())
    const tx = await contract?.withdrawUnlock()

    return tx.wait()
  }

  private commonInvoke = async (
    oldVersion: boolean,
    method: string,
    args?: any[]
  ): Promise<AssetCommonAmountsInterface> => {
    const calls: ContractInputs[] = Object.keys(AssetType).map((assetType) => {
      return {
        contract: this.getContract(oldVersion, assetType),
        method: method,
        args: args,
      }
    })

    const amounts = await multicalls(this.multicallContract, calls).catch((e: any) => {
      return Promise.reject(`multicalls ${method}: ${e}`)
    })

    return Promise.resolve({
      btc: amounts[0]?.toString() ?? '0',
      ltc: amounts[1]?.toString() ?? '0',
      doge: amounts[2]?.toString() ?? '0',
    })
  }
}
