import {ethers, Signer} from 'ethers'
import {Token} from './interfaces/token'
import {NATIVE_BRIDGE_ADDRESSES} from './constants/native'
import NativeABI from './abis/NBridge.json'
import {isOriginToken} from './helpers/token'
import {TransactionReceipt} from '@ethersproject/abstract-provider'
import {getContract} from './helpers/contract'

export class NativeBridge {
  getNativeMinCrossAmount = async (
    provider: ethers.providers.Provider,
    fromChainId: number,
    toChainId: number,
    token: Token
  ): Promise<string> => {
    const nativeBridgeAddress = NATIVE_BRIDGE_ADDRESSES[fromChainId]
    const nativeBridgeContract = getContract(provider, nativeBridgeAddress, NativeABI.abi)
    try {
      const result = await nativeBridgeContract?.fixFees(token?.address, toChainId)
      return Promise.resolve(result.toString())
    } catch (e) {
      return Promise.reject(`get native min cross: ${e}`)
    }
  }

  nativeCrossOut = async (
    provider: Signer | ethers.providers.Provider,
    fromChainId: number,
    toChainId: number,
    token: Token,
    amount: string,
    to: string
  ): Promise<TransactionReceipt> => {
    let estimateArgs = {}
    if (isOriginToken(fromChainId, token)) {
      estimateArgs = {
        value: ethers.utils.parseEther(amount),
      }
    }

    const nativeBridgeAddress = NATIVE_BRIDGE_ADDRESSES[fromChainId]
    const nativeBridgeContract = getContract(provider, nativeBridgeAddress, NativeABI.abi)

    const gas = await nativeBridgeContract?.estimateGas
      .crossOut(token?.address, toChainId, to, ethers.utils.parseEther(amount), estimateArgs)
      .catch((e: any) => {
        console.error(e)
      })

    let args: any = {
      gasLimit: gas,
    }
    if (isOriginToken(fromChainId, token)) {
      args = {
        value: ethers.utils.parseEther(amount),
        gasLimit: gas,
      }
    }

    const tx = await nativeBridgeContract?.crossOut(
      token?.address,
      toChainId,
      to,
      ethers.utils.parseEther(amount),
      args
    )

    return tx.wait()
  }
}
