import {Contract, ethers, Signer} from 'ethers'
import {
  BorFeePoolContractAddress,
  BoringFeePoolContractAddress,
  BoringTunnelContractAddress,
  BorTunnelContractAddress,
} from './constants/address'
import TunnelABI from './abis/Tunnel.json'
import {MULTICALL_NETWORKS} from './constants/multicall'
import MulticallABI from './abis/Multicall.json'
import {getContract} from './helpers/contract'
import {AssetCommonAmountsInterface} from './interfaces/tunnel'
import {ContractInputs} from './interfaces/multicall'
import {AssetType} from './constants/enum'
import {multicalls} from './multicall'
import {TransactionReceipt} from '@ethersproject/abstract-provider'

export class FeePool {
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

    this.ltcContract = getContract(provider, BorFeePoolContractAddress.LTC, TunnelABI.abi)
    this.dogeContract = getContract(provider, BorFeePoolContractAddress.DOGE, TunnelABI.abi)
    this.btcContract = getContract(provider, BorFeePoolContractAddress.BTC, TunnelABI.abi)

    this.boringLTCContract = getContract(provider, BoringFeePoolContractAddress.LTC, TunnelABI.abi)
    this.boringDOGEContract = getContract(provider, BoringFeePoolContractAddress.DOGE, TunnelABI.abi)
    this.boringBTCContract = getContract(provider, BoringFeePoolContractAddress.BTC, TunnelABI.abi)

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

  earned = async (oldVersion: boolean, account: string): Promise<AssetCommonAmountsInterface> => {
    return this.commonInvoke(oldVersion, 'earned', [account])
  }

  claimFee = async (oldVersion: boolean, assetType: string): Promise<TransactionReceipt> => {
    const contract = this.getContract(oldVersion, assetType)

    const tx = await contract?.claimFee()
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
