import {Contract, ethers, Signer} from 'ethers'
import {TransactionReceipt} from '@ethersproject/abstract-provider'
import BoringDAOABI from './abis/BoringDAO.json'
import {BorDAOContractAddress, BoringDAOContractAddress} from './constants/address'
import {MULTICALL_NETWORKS} from './constants/multicall'
import MulticallABI from './abis/Multicall.json'
import {AssetType} from './constants/enum'
import {getContract} from './helpers/contract'

export class BoringDAO {
  provider: Signer | ethers.providers.Provider
  chainId: number

  multicallContract: Contract

  btcContract: Contract
  ltcContract: Contract
  dogeContract: Contract

  boringBTCContract: Contract
  boringLTCContract: Contract
  boringDOGEContract: Contract

  constructor(provider: Signer | ethers.providers.Provider, chainId: number) {
    this.provider = provider
    this.chainId = chainId

    this.ltcContract = getContract(provider, BorDAOContractAddress.LTC, BoringDAOABI.abi)
    this.dogeContract = getContract(provider, BorDAOContractAddress.DOGE, BoringDAOABI.abi)
    this.btcContract = getContract(provider, BorDAOContractAddress.BTC, BoringDAOABI.abi)

    this.boringLTCContract = getContract(provider, BoringDAOContractAddress.LTC, BoringDAOABI.abi)
    this.boringDOGEContract = getContract(provider, BoringDAOContractAddress.DOGE, BoringDAOABI.abi)
    this.boringBTCContract = getContract(provider, BoringDAOContractAddress.BTC, BoringDAOABI.abi)

    this.multicallContract = getContract(provider, MULTICALL_NETWORKS[chainId], MulticallABI)
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

  burnOToken = async (
    oldVersion: boolean,
    assetType: AssetType,
    chainId: number,
    amount: string,
    to: string
  ): Promise<TransactionReceipt> => {
    const contract = this.getContract(oldVersion, assetType.toString())
    const tunnelKey = ethers.utils.formatBytes32String(assetType.toString())
    const tx = await contract?.burnBToken(tunnelKey, ethers.utils.parseEther(amount), to)

    return tx.wait()
  }

  redeem = async (oldVersion: boolean, assetType: AssetType, amount: string): Promise<TransactionReceipt> => {
    const contract = this.getContract(oldVersion, assetType.toString())
    const tunnelKey = ethers.utils.formatBytes32String(assetType.toString())
    const tx = await contract?.redeem(tunnelKey, ethers.utils.parseEther(amount))

    return tx.wait()
  }

  pledge = async (oldVersion: boolean, assetType: AssetType, amount: string): Promise<TransactionReceipt> => {
    const contract = this.getContract(oldVersion, assetType.toString())
    const tunnelKey = ethers.utils.formatBytes32String(assetType.toString())
    const tx = await contract?.pledge(tunnelKey, ethers.utils.parseEther(amount))

    return tx.wait()
  }
}
