import {Contract, ContractInterface, ethers} from 'ethers'
import {isAddress} from 'ethers/lib/utils'
import {TransactionReceipt} from '@ethersproject/abstract-provider'
import {AddressZero} from '@ethersproject/constants'
import {JsonRpcProvider} from '@ethersproject/providers'
import {SwapPairABI, TwowayABI} from './abi'
import BigNumber from 'bignumber.js'
import {TWOWAY_CONTRACT_ADDRESSES, TWOWAY_TOKENS} from './constants/twoway'

export const getContract = (
  library: JsonRpcProvider,
  address: string | undefined,
  ABI: ContractInterface,
  account?: string | null | undefined
): Contract => {
  if (!isAddress(address ?? '') || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address ?? '', ABI, account ? library.getSigner(account).connectUnchecked() : library)
}

const getTwowayToken = (chainID: number) => TWOWAY_TOKENS.find((token) => token.chainID === chainID)

export const crossOutUSDT = async (
  library: JsonRpcProvider,
  currentChainID: number,
  account: string,
  targetChainID: number,
  to: string,
  amount: string
): Promise<TransactionReceipt> => {
  const token = getTwowayToken(currentChainID)
  if (!token) throw Error(`Can't find twoway token(${currentChainID})`)

  return crossOut(
    library,
    currentChainID,
    account,
    token.address,
    targetChainID,
    to,
    ethers.utils.parseUnits(amount, token.decimals).toString()
  )
}

export const crossOut = async (
  library: JsonRpcProvider,
  currentChainID: number,
  account: string,
  tokenAddress: string,
  targetChainID: number,
  to: string,
  amount: string
): Promise<TransactionReceipt> => {
  console.debug(
    `crossOut(current_chain_id: ${currentChainID}, account: ${account}, token_address: ${tokenAddress}, target_chain_id: ${targetChainID}, to: ${to}, amount: ${amount})`
  )
  const contract = getContract(library, TWOWAY_CONTRACT_ADDRESSES[currentChainID], TwowayABI, account)

  const tx = await contract?.crossOut(tokenAddress, targetChainID, to, amount)

  return tx.wait()
}

export const getCrossUSDTResult = async (
  library: JsonRpcProvider,
  targetLibrary: JsonRpcProvider,
  currentChainID: number,
  targetChainID: number,
  amount: string
): Promise<string[]> => {
  const token = getTwowayToken(currentChainID)
  if (!token) throw Error(`Can't find twoway token(${currentChainID})`)
  const targetToken = getTwowayToken(targetChainID)
  if (!targetToken) throw Error(`Can't find target twoway token(${currentChainID})`)

  const targetDiff = 18 - (targetToken?.decimals || 18)
  const currentContract = getContract(library, TWOWAY_CONTRACT_ADDRESSES[currentChainID], TwowayABI)
  const targetContract = getContract(targetLibrary, TWOWAY_CONTRACT_ADDRESSES[targetChainID], TwowayABI)

  const maxToken1 = await currentContract?.getMaxToken1AmountOut(token.address, targetChainID)
  const ratio = await targetContract?.feeRatioM(targetToken.address, currentChainID)
  const valueN = ethers.utils.parseUnits(amount, 18).toString()

  let count = 2
  if (new BigNumber(maxToken1.toString()).eq(0) || new BigNumber(valueN).lte(maxToken1.toString())) {
    count = 1
  }

  const fixedAmount = await targetContract?.feeAmountM(targetToken.address, currentChainID)
  const finalFixedAmount = new BigNumber(fixedAmount.toString()).multipliedBy(count).toString()

  const d = new BigNumber(amount).multipliedBy(ratio.toString())
  const f = new BigNumber(finalFixedAmount).multipliedBy(10 ** targetDiff).plus(d.toString())
  return [f.toString(), new BigNumber(valueN).minus(f).toString()]
}

export const getMaximumUSDTLiquidity = async (
  library: JsonRpcProvider,
  targetLibrary: JsonRpcProvider,
  currentChainID: number,
  targetChainID: number
): Promise<string> => {
  const token = getTwowayToken(currentChainID)
  if (!token) throw Error(`Can't find twoway token(${currentChainID})`)
  const targetToken = getTwowayToken(targetChainID)
  if (!targetToken) throw Error(`Can't find target twoway token(${currentChainID})`)

  const targetDiff = 18 - (targetToken?.decimals || 18)

  const currentContract = getContract(library, token.pair, SwapPairABI)
  const targetContract = getContract(targetLibrary, targetToken.pair, SwapPairABI)

  const currentReserves = await currentContract.getReserves(targetChainID)
  const targetReserves = await targetContract.getReserves(currentChainID)

  const result = new BigNumber(targetReserves[0].toString())
    .multipliedBy(10 ** targetDiff)
    .plus(currentReserves[1].toString())
    .toString()

  return Promise.resolve(result)
}
